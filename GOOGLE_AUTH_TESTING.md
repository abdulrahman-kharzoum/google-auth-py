# 🚀 Google OAuth Testing Guide (No MongoDB)

This guide explains how to test your Google OAuth implementation with in-memory session storage (no database required).

## ✅ Prerequisites

Ensure you have:
- Python 3.8+
- Node.js 16+ (for frontend)
- Your Google OAuth credentials ready (Client ID, Client Secret, Redirect URI)

## 🔧 Step 1: Configure Environment Variables

Edit `backend/.env` and add your actual Google credentials:

```env
# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Encryption Key (keep this as is or regenerate with: python -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=your_secure_encryption_key_here

# Server Configuration
PORT=8000
```

### Where to get Google credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
4. Choose "Web application"
5. Add authorized redirect URI: `http://localhost:8000/api/auth/google/callback`
6. Copy your Client ID and Client Secret
7. Add your test email as a test user

## 📦 Step 2: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Updated dependencies (no MongoDB):
- ✅ FastAPI, Uvicorn
- ✅ python-dotenv
- ✅ Cryptography (for token encryption)
- ✅ httpx 0.27.0 (fixes chromadb dependency issue)
- ✅ Pydantic (data validation)

## 🎯 Step 3: Start Backend Server

```bash
cd backend
python auth_backend.py
```

Expected output:
```
INFO:     Started server process [XXXX]
INFO:     Uvicorn running on http://0.0.0.0:8000
```

The backend is ready when you see ✅ messages in the logs.

## 🎨 Step 4: Start Frontend Server

In a new terminal:

```bash
cd frontend
npm install  # First time only
npm run dev
```

Frontend will be available at `http://localhost:5173` (Vite) or `http://localhost:3000` (specific port)

## 🧪 Step 5: Test the OAuth Flow

### Quick Test via Browser

1. **Open frontend:** `http://localhost:3000` (or the port shown in terminal)
2. **Click "Sign in with Google"** button
3. **Authenticate** with your Google account
4. **Grant permissions** when prompted
5. **Verify redirect** back to frontend with your profile

Expected result:
```
✅ Profile picture displayed
✅ Name shown
✅ Email displayed
✅ User ID visible
```

### Test via API (cURL)

#### 1. Get Login URL
```bash
curl http://localhost:8000/api/auth/google/login
```

Response:
```json
{
  "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "state": "secure_random_state_token"
}
```

#### 2. Check Health
```bash
curl http://localhost:8000/
```

Response:
```json
{
  "status": "healthy",
  "service": "Google OAuth2 Authentication",
  "version": "1.0.0"
}
```

#### 3. Get User Session (after login)
```bash
curl http://localhost:8000/api/auth/user/{USER_ID}
```

Response:
```json
{
  "user_id": "YOUR_GOOGLE_USER_ID",
  "email": "your.email@gmail.com",
  "name": "Your Name",
  "picture": "https://lh3.googleusercontent.com/...",
  "access_token": "encrypted_token_here",
  "refresh_token": "encrypted_refresh_token_here",
  "expires_at": "2025-11-15T19:57:18.000Z",
  "scopes": ["openid", "email", "profile", ...],
  "created_at": "2025-11-15T17:57:18.000Z",
  "updated_at": "2025-11-15T17:57:18.000Z"
}
```

#### 4. Validate Session
```bash
curl "http://localhost:8000/api/auth/validate?user_id={USER_ID}"
```

Response:
```json
{
  "valid": true,
  "message": "Session is valid",
  "user": {
    "user_id": "YOUR_GOOGLE_USER_ID",
    "email": "your.email@gmail.com",
    "name": "Your Name",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

#### 5. Logout
```bash
curl -X POST "http://localhost:8000/api/auth/logout?user_id={USER_ID}"
```

Response:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 6. Refresh Token
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "your_refresh_token_here"
  }'
```

## 📊 Test Scenarios

### Scenario 1: Complete Login Flow
✅ **Steps:**
1. Visit `http://localhost:3000`
2. Click login button
3. Authenticate with Google
4. Verify profile displays

**Expected:** Session stored in memory, tokens encrypted

---

### Scenario 2: Session Validation
✅ **Steps:**
1. After login, note your user ID from profile
2. Run: `curl http://localhost:8000/api/auth/validate?user_id={USER_ID}`
3. Should return `"valid": true`

**Expected:** Session is active and valid

---

### Scenario 3: Token Refresh
✅ **Steps:**
1. After login, browser console shows refresh token
2. Call refresh endpoint with that token
3. Should return new access token

**Expected:** New tokens issued successfully

---

### Scenario 4: Logout
✅ **Steps:**
1. While logged in, click logout
2. Verify profile disappears
3. Session removed from memory

**Expected:** User logged out, session cleared

---

### Scenario 5: Multiple Users
✅ **Steps:**
1. Login with Google account A
2. In private/incognito window, login with account B
3. Both sessions remain independent

**Expected:** Both users maintained in memory simultaneously

---

## 🔍 Debugging

### Check Backend Logs

The backend will show:
```
DEBUG: State generated: xxxx
DEBUG: Exchanging code for tokens
DEBUG: User session stored for: user@gmail.com
DEBUG: Session retrieved for: user_id
```

### Check Browser Console (F12)

Frontend logs:
```
✅ Login initiated
✅ Tokens received
✅ User profile fetched
✅ Auto-refresh scheduled
```

### Common Issues & Solutions

#### Issue: "GOOGLE_CLIENT_ID must be set in environment variables"
**Solution:** 
- Verify `.env` file has your actual credentials
- Restart backend

#### Issue: "CORS error" in browser console
**Solution:**
- Ensure frontend URL is in `CORS` list in `auth_backend.py`
- Default allows `http://localhost:3000` and `http://localhost:5173`

#### Issue: Redirect URI doesn't match
**Solution:**
- Check `GOOGLE_REDIRECT_URI` in `.env`
- Must match exactly in Google Console settings
- Should be `http://localhost:8000/api/auth/google/callback`

#### Issue: "invalid_grant" error
**Solution:**
- Ensure refresh token hasn't expired (7 days)
- Try logging in again to get fresh token
- Check system time synchronization

## 📈 What's Different From MongoDB Version

### Before (with MongoDB):
```
✅ Persistent sessions (survives server restart)
✅ Database overhead
❌ Requires MongoDB running
```

### Now (in-memory):
```
✅ Fast testing (no DB)
✅ Simpler setup
✅ Perfect for development
❌ Sessions lost when server restarts
```

**Sessions clear when you restart the backend!**

## 🚀 Next Steps

Once testing is complete:

1. **For Production:** Add a real database (PostgreSQL, MongoDB, etc.)
2. **For Deployment:** Switch to HTTPS and update redirect URIs
3. **Add Features:** Gmail API, Calendar API access, etc.

## 📝 Test Checklist

- [ ] Backend starts without MongoDB errors
- [ ] Health check endpoint responds
- [ ] Login URL endpoint works
- [ ] Google OAuth callback succeeds
- [ ] User profile displays in frontend
- [ ] User session stored in memory
- [ ] Session validation works
- [ ] Token refresh endpoint works
- [ ] Logout clears session
- [ ] Multiple users can login independently
- [ ] Error handling works (invalid state, etc.)

---

**Ready to test? Start with Step 1 above!** 🎉
