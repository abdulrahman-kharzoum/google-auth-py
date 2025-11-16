"""
Google OAuth2 Authentication Backend
Complete implementation with login, signup, and token refresh
No database required - uses in-memory storage for testing
"""
from fastapi import FastAPI, HTTPException, Header, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from cryptography.fernet import Fernet
import base64
import hashlib
import httpx
import secrets
import urllib.parse

load_dotenv()

app = FastAPI(title="Google OAuth2 Authentication API", version="1.0.0")

# CORS configuration
origins = [
    "http://localhost:3032",
    "http://localhost:5173",
    os.getenv("FRONTEND_URL", "https://yourdomain.com"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for user sessions
user_sessions: Dict[str, Dict[str, Any]] = {}

# Encryption setup
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "")
if not ENCRYPTION_KEY:
    raise ValueError("ENCRYPTION_KEY must be set in environment variables")
key = base64.urlsafe_b64encode(hashlib.sha256(ENCRYPTION_KEY.encode()).digest())
cipher_suite = Fernet(key)

# Google OAuth2 configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Validate required environment variables
if not all([GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI]):
    raise ValueError("Google OAuth credentials must be set in environment variables")

# OAuth2 URLs
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

# Store for OAuth2 state (in production, use Redis)
oauth_states: Dict[str, Dict[str, Any]] = {}

# ============================================================================
# Pydantic Models
# ============================================================================

class UserProfile(BaseModel):
    user_id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None

class TokenData(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    expires_in: int
    token_type: str = "Bearer"
    scope: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserProfile] = None
    tokens: Optional[TokenData] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserSession(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    access_token: str
    refresh_token: Optional[str] = None
    expires_at: str
    scopes: list[str] = []
    created_at: str
    updated_at: str

# ============================================================================
# Helper Functions
# ============================================================================

def encrypt_token(token: str) -> str:
    """Encrypt token for secure storage"""
    return cipher_suite.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    """Decrypt token"""
    return cipher_suite.decrypt(encrypted_token.encode()).decode()

def generate_state() -> str:
    """Generate a secure random state for OAuth2"""
    return secrets.token_urlsafe(32)

async def store_user_session(
    user_id: str,
    email: str,
    name: str,
    picture: Optional[str],
    access_token: str,
    refresh_token: Optional[str],
    expires_in: int,
    scopes: list[str]
) -> None:
    """Store user session in memory"""
    encrypted_access_token = encrypt_token(access_token)
    encrypted_refresh_token = encrypt_token(refresh_token) if refresh_token else None
    
    expires_at = (datetime.utcnow() + timedelta(seconds=expires_in)).isoformat()
    
    session_data = {
        "user_id": user_id,
        "email": email,
        "name": name,
        "picture": picture,
        "access_token": encrypted_access_token,
        "refresh_token": encrypted_refresh_token,
        "expires_at": expires_at,
        "scopes": scopes,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    user_sessions[user_id] = session_data

async def get_user_session(user_id: str) -> Optional[UserSession]:
    """Retrieve user session from memory"""
    session = user_sessions.get(user_id)
    if not session:
        return None
    
    # Decrypt tokens
    access_token = decrypt_token(session["access_token"])
    refresh_token = decrypt_token(session["refresh_token"]) if session.get("refresh_token") else None
    
    return UserSession(
        user_id=session["user_id"],
        email=session["email"],
        name=session["name"],
        picture=session.get("picture"),
        access_token=access_token,
        refresh_token=refresh_token,
        expires_at=session["expires_at"],
        scopes=session.get("scopes", []),
        created_at=session["created_at"],
        updated_at=session["updated_at"]
    )

# ============================================================================
# OAuth2 Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Google OAuth2 Authentication",
        "version": "1.0.0"
    }

@app.get("/api/auth/google/login")
async def google_login(prompt: Optional[str] = "consent"):
    """
    Initiate Google OAuth2 login flow
    Returns the authorization URL for the frontend to redirect to
    """
    state = generate_state()
    
    # Store state with timestamp for validation
    oauth_states[state] = {
        "created_at": datetime.utcnow().isoformat(),
        "type": "login",
        "prompt": prompt # Store the prompt type
    }
    
    # Build authorization URL
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join([
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
            "https://www.googleapis.com/auth/tasks",
        ]),
        "access_type": "offline",
        "prompt": prompt, # Use the passed prompt value
        "state": state
    }
    
    auth_url = f"{GOOGLE_AUTH_URL}?{urllib.parse.urlencode(params)}"
    
    return {
        "authorization_url": auth_url,
        "state": state
    }

@app.get("/api/auth/google/callback")
async def google_callback(code: str, state: str):
    """
    Handle Google OAuth2 callback
    Exchange authorization code for tokens and create user session
    """
    # Validate state
    if state not in oauth_states:
        return RedirectResponse(
            url=f"{FRONTEND_URL}?error=invalid_state",
            status_code=302
        )
    
    # Remove state after validation
    oauth_states.pop(state)
    
    try:
        # Exchange authorization code for tokens
        async with httpx.AsyncClient() as http_client:
            token_response = await http_client.post(
                GOOGLE_TOKEN_URL,
                data={
                    "code": code,
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "redirect_uri": GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                }
            )
            
            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to obtain access token: {token_response.text}"
                )
            
            tokens = token_response.json()
            access_token = tokens["access_token"]
            refresh_token = tokens.get("refresh_token")
            expires_in = tokens["expires_in"]
            scope = tokens.get("scope", "")
            
            # Get user info
            userinfo_response = await http_client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if userinfo_response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to obtain user information"
                )
            
            userinfo = userinfo_response.json()
            
            # Store user session
            await store_user_session(
                user_id=userinfo["id"],
                email=userinfo["email"],
                name=userinfo.get("name", userinfo["email"]),
                picture=userinfo.get("picture"),
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=expires_in,
                scopes=scope.split()
            )
            
            # Redirect to frontend with success
            redirect_url = f"{FRONTEND_URL}?auth=success&user_id={userinfo['id']}"
            return RedirectResponse(url=redirect_url, status_code=302)
            
    except Exception as e:
        # Redirect to frontend with error
        error_message = urllib.parse.quote(str(e))
        return RedirectResponse(
            url=f"{FRONTEND_URL}?error={error_message}",
            status_code=302
        )

@app.post("/api/auth/refresh", response_model=AuthResponse)
async def refresh_access_token(request: RefreshTokenRequest):
    """
    Refresh access token using refresh token
    """
    try:
        async with httpx.AsyncClient() as http_client:
            token_response = await http_client.post(
                GOOGLE_TOKEN_URL,
                data={
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "refresh_token": request.refresh_token,
                    "grant_type": "refresh_token",
                }
            )
            
            if token_response.status_code != 200:
                error_data = token_response.json()
                if error_data.get("error") == "invalid_grant":
                    raise HTTPException(
                        status_code=401,
                        detail="Refresh token expired or invalid. Please login again."
                    )
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to refresh token: {token_response.text}"
                )
            
            tokens = token_response.json()
            new_access_token = tokens["access_token"]
            new_refresh_token = tokens.get("refresh_token", request.refresh_token)
            expires_in = tokens["expires_in"]
            
            # Get user info with new access token
            userinfo_response = await http_client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {new_access_token}"}
            )
            
            if userinfo_response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to obtain user information"
                )
            
            userinfo = userinfo_response.json()
            
            # Update user session with new tokens
            await store_user_session(
                user_id=userinfo["id"],
                email=userinfo["email"],
                name=userinfo.get("name", userinfo["email"]),
                picture=userinfo.get("picture"),
                access_token=new_access_token,
                refresh_token=new_refresh_token,
                expires_in=expires_in,
                scopes=tokens.get("scope", "").split()
            )
            
            return AuthResponse(
                success=True,
                message="Token refreshed successfully",
                user=UserProfile(
                    user_id=userinfo["id"],
                    email=userinfo["email"],
                    name=userinfo.get("name", userinfo["email"]),
                    picture=userinfo.get("picture"),
                    given_name=userinfo.get("given_name"),
                    family_name=userinfo.get("family_name")
                ),
                tokens=TokenData(
                    access_token=new_access_token,
                    refresh_token=new_refresh_token,
                    expires_in=expires_in,
                    token_type="Bearer",
                    scope=tokens.get("scope", "")
                )
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

@app.get("/api/auth/user/{user_id}", response_model=UserSession)
async def get_user(user_id: str):
    """
    Get user session information
    """
    session = await get_user_session(user_id)
    if not session:
        raise HTTPException(status_code=404, detail="User session not found")
    
    return session

@app.post("/api/auth/logout")
async def logout(user_id: str):
    """
    Logout user and revoke tokens
    """
    try:
        # Get user session to revoke token
        session = await get_user_session(user_id)
        if session and session.access_token:
            # Revoke Google token
            async with httpx.AsyncClient() as http_client:
                try:
                    await http_client.post(
                        "https://oauth2.googleapis.com/revoke",
                        params={"token": session.access_token}
                    )
                except:
                    pass  # Continue even if revocation fails
        
        # Delete user session from memory
        if user_id in user_sessions:
            del user_sessions[user_id]
        
        return {"success": True, "message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during logout: {str(e)}"
        )

@app.get("/api/auth/validate")
async def validate_session(user_id: str):
    """
    Validate if user session is still valid
    """
    try:
        session = await get_user_session(user_id)
        if not session:
            return {"valid": False, "message": "No session found"}
        
        # Check if token is expired
        expires_at = datetime.fromisoformat(session.expires_at.replace("Z", "+00:00"))
        if expires_at < datetime.utcnow():
            return {
                "valid": False,
                "message": "Token expired",
                "requires_refresh": True
            }
        
        return {
            "valid": True,
            "message": "Session is valid",
            "user": {
                "user_id": session.user_id,
                "email": session.email,
                "name": session.name,
                "picture": session.picture
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error validating session: {str(e)}"
        )

# ============================================================================
# Run Server
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8050"))
    uvicorn.run(app, host="0.0.0.0", port=port)
