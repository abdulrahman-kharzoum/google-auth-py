# 🚀 Complete Google OAuth Testing Setup Guide

Complete end-to-end guide for testing Google OAuth with React frontend and FastAPI backend (no MongoDB).

## 📋 Overview

```
┌─────────────────────────────────────────────────────┐
│                     YOUR BROWSER                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (React/Vite)                              │
│  http://localhost:3000                              │
│  ├─ Login Button      →  OAuth Flow                 │
│  ├─ Sign-up Button    →  OAuth Flow                 │
│  ├─ Logout Button     →  Clear Session              │
│  └─ Token Display     →  Console Logging            │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Backend (FastAPI)                                  │
│  http://localhost:8000                              │
│  ├─ /api/auth/google/login       → Get OAuth URL    │
│  ├─ /api/auth/google/callback    → Handle callback  │
│  ├─ /api/auth/user/{id}          → Get session      │
│  ├─ /api/auth/refresh            → Refresh token    │
│  ├─ /api/auth/logout             → Logout           │
│  └─ /api/auth/validate           → Validate session │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Session Storage (In-Memory)                        │
│  ├─ User sessions                                   │
│  ├─ Encrypted tokens                                │
│  └─ Expires when backend restarts                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔑 Prerequisites

### Google Cloud Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project
   - Enable OAuth 2.0

2. **Get OAuth Credentials**
   - Go to Credentials → Create OAuth 2.0 Client ID
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:8000/api/auth/google/callback`
   - Copy Client ID and Client Secret

3. **Add Test User**
   - OAuth consent screen
   - Add your email as a test user

### System Requirements

- Python 3.8+
- Node.js 16+
- npm 8+

---

## 🔧 Step 1: Backend Setup

### Configure Backend Environment

```bash
cd backend
```

Edit `backend/.env`:

```env
# Your Google API credentials
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Encryption Key (keep as is or generate new)
ENCRYPTION_KEY=your_secure_encryption_key_here

# Server port
PORT=8000
```

### Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Expected dependencies (11 total):**
- fastapi
- uvicorn
- python-dotenv
- cryptography
- python-jose
- httpx 0.27.0 ✅ (fixes chromadb conflict)
- pydantic
- email-validator
- python-multipart

### Start Backend Server

```bash
cd backend
python server.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**✅ Backend is ready!**

---

## 🎨 Step 2: Frontend Setup

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

**This installs:**
- React 18.2.0
- React DOM 18.2.0
- Vite 5.0.0
- @vitejs/plugin-react

### Start Frontend Server

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.0.0  ready in 123 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

Browser should open automatically to `http://localhost:3000`

**✅ Frontend is ready!**

---

## 🧪 Step 3: Test the Complete Flow

### Test 1: Initial Login

**Objective:** Complete Google OAuth login flow

**Steps:**

1. **Open Frontend**
   - Browser: `http://localhost:3000`
   - See two buttons:
     - ✅ "Sign in with Google"
     - ✅ "Sign up with Google"

2. **Click Either Button**
   - Status shows: "Redirecting to Google..."
   - Redirected to Google login page

3. **Authenticate**
   - Sign in with your test Google account
   - Grant permissions (approve all scopes)
   - Redirected back to `http://localhost:3000?auth=success&user_id=...`

4. **View Profile**
   ```
   ┌────────────────────────────────┐
   │ [Avatar] Your Name             │
   │          your.email@gmail.com  │
   │          ID: 118923945698...   │
   └────────────────────────────────┘
   ```

5. **Check Console (F12 → Console)**
   ```javascript
   ✅ LOGIN SUCCESSFUL
   User: {
     user_id: "118923945698745625826",
     email: "your.email@gmail.com",
     name: "Your Name",
     picture: "https://lh3.googleusercontent.com/..."
   }
   Access Token: "ya29.a0AfH6SMDx..."
   Refresh Token: "1//0gF8Z1..."
   Expires At: "2025-11-15T19:57:18.000000"
   Scopes: ["openid", "email", "profile", ...]
   ```

**Result:** ✅ PASS

---

### Test 2: Token Refresh

**Objective:** Refresh access token using refresh token

**Steps:**

1. **Click "🔄 Refresh Token" Button**
   - Status shows: "Refreshing token..."
   - New tokens fetched

2. **Check Console**
   ```javascript
   ✅ TOKEN REFRESH SUCCESSFUL
   New Access Token: "ya29.a0AeXoW8f..."
   New Refresh Token: "1//0gHqR9S..."
   ```

3. **Verify Display Updated**
   - Token displays show new values
   - Click "📋 Copy Full Token" to copy

**Result:** ✅ PASS

---

### Test 3: Session Persistence

**Objective:** Verify session persists across page refreshes

**Steps:**

1. **After Login, Refresh Page**
   - Press F5 or Ctrl+R
   - User should still be logged in
   - No Google redirect needed

2. **Check Console**
   ```javascript
   ✅ SESSION RESTORED
   User: {user_id: "...", email: "...", name: "..."}
   Access Token: "ya29.a0AfH6..."
   Refresh Token: "1//0gF8..."
   ```

3. **Open New Tab**
   - Navigate to `http://localhost:3000`
   - User still logged in automatically

**Result:** ✅ PASS

---

### Test 4: Logout

**Objective:** Clear session and logout

**Steps:**

1. **Click "🚪 Logout" Button**
   - Status shows: "Logging out..."
   - Profile disappears
   - Buttons reset to login state

2. **Check Console**
   ```javascript
   ✅ LOGOUT SUCCESSFUL
   ```

3. **Verify localStorage Cleared**
   - Open DevTools
   - Application → Cookies → localhost:3000
   - `user_id` should be gone

4. **Check Backend Memory Cleared**
   - Session deleted from in-memory storage
   - Next login creates new session

**Result:** ✅ PASS

---

### Test 5: API Test without Frontend

**Objective:** Test backend APIs directly with curl

```bash
# 1. Health Check
curl http://localhost:8000/
# Response: {"status": "healthy", "service": "Google OAuth2 Authentication", ...}

# 2. Get Login URL
curl http://localhost:8000/api/auth/google/login
# Response: {"authorization_url": "https://accounts.google.com/...", "state": "..."}

# 3. After login, validate session
curl "http://localhost:8000/api/auth/validate?user_id={USER_ID}"
# Response: {"valid": true, "message": "Session is valid", "user": {...}}

# 4. Get user session
curl http://localhost:8000/api/auth/user/{USER_ID}
# Response: Full session data with encrypted tokens

# 5. Logout
curl -X POST "http://localhost:8000/api/auth/logout?user_id={USER_ID}"
# Response: {"success": true, "message": "Logged out successfully"}

# 6. Refresh token
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
# Response: New tokens and user data
```

**Result:** ✅ PASS

---

## 📊 Frontend Features

### Display Sections

#### 1. Login/Signup (Not Logged In)
```
┌──────────────────────────────────┐
│ Sign in with Google | Sign up with Google |
└──────────────────────────────────┘
```

#### 2. User Card (Logged In)
```
┌──────────────────────────────────┐
│ [Profile Pic] Name               │
│              Email               │
│              User ID             │
└──────────────────────────────────┘
```

#### 3. Action Buttons
```
┌──────────────────────────────────┐
│ 🔄 Refresh Token | 🚪 Logout     │
└──────────────────────────────────┘
```

#### 4. Token Display
```
📋 Access Token
ya29.a0AfH6SMDx... [📋 Copy Full Token]

🔄 Refresh Token
1//0gF8Z1... [📋 Copy Full Token]
```

#### 5. User Info Display
```
👤 User Information
Name: Your Name
Email: your.email@gmail.com
User ID: 118923945698...
Picture URL: https://lh3.googleusercontent.com/...
```

---

## 🎛️ Console Logging

All information automatically logged to browser console (F12 → Console):

### Login
```javascript
✅ LOGIN SUCCESSFUL
User: {...}
Access Token: "..."
Refresh Token: "..."
Expires At: "..."
Scopes: [...]
```

### Token Refresh
```javascript
✅ TOKEN REFRESH SUCCESSFUL
New Access Token: "..."
New Refresh Token: "..."
```

### Session Restore
```javascript
✅ SESSION RESTORED
User: {...}
Access Token: "..."
Refresh Token: "..."
```

### Logout
```javascript
✅ LOGOUT SUCCESSFUL
```

### Errors
```javascript
Login Error: [error message]
Token refresh error: [error message]
```

---

## 🔗 API Endpoints

### Base URL
```
http://localhost:8000
```

### Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Health check |
| GET | `/api/auth/google/login` | Get OAuth authorization URL |
| GET | `/api/auth/google/callback` | OAuth callback (handles code exchange) |
| GET | `/api/auth/user/{user_id}` | Get user session data |
| GET | `/api/auth/validate?user_id={id}` | Validate session |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout?user_id={id}` | Logout user |

---

## 🛠️ Troubleshooting

### "Connection Refused" Error

**Cause:** Backend not running

**Solution:**
```bash
cd backend
python server.py
```

---

### "Redirect URI Mismatch" Error

**Cause:** OAuth redirect URI doesn't match Google Console

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. OAuth 2.0 Credentials
3. Edit OAuth 2.0 Client
4. Add/Update Authorized redirect URIs:
   ```
   http://localhost:8000/api/auth/google/callback
   ```
5. Save

---

### CORS Error

**Cause:** Frontend URL not allowed

**Solution:**
Check `backend/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

Restart backend.

---

### Port Already in Use

**Cause:** Port 8000 or 3000 already used

**Solution:**

Backend:
```bash
# Use different port
PORT=8001 python server.py
```

Frontend:
```bash
# Vite will auto-select next port or specify
npm run dev -- --port 3001
```

---

### Tokens Not Showing in Console

**Solution:**
1. Open browser DevTools (F12)
2. Click "Console" tab
3. Perform action (login, logout, etc.)
4. Scroll up to see logs

---

### Session Lost After Refresh

**Cause:** Browser localStorage might be disabled

**Solution:**
1. Check browser settings
2. Ensure cookies/storage enabled
3. DevTools → Application → Check localStorage

---

## 📁 File Structure

```
project/
├── backend/
│   ├── server.py            ← Main backend file
│   ├── requirements.txt      ← Python dependencies
│   └── .env                 ← Configuration
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx          ← Main component
│       ├── index.css        ← Styles
│       └── pages/
│           ├── LoginSignupPage.jsx
│           └── ProfilePage.jsx
│
└── Documentation/
    ├── COMPLETE_SETUP_GUIDE.md      ← This file
    ├── REACT_FRONTEND_SETUP.md
    ├── GOOGLE_AUTH_TESTING.md
    └── TESTING_GUIDE.md
```

---

## ✅ Testing Checklist

Before considering complete, verify:

### Backend
- [ ] Backend starts without errors
- [ ] No MongoDB required
- [ ] Health check endpoint works
- [ ] Environmental variables set
- [ ] httpx 0.27.0 installed (no chromadb conflicts)

### Frontend
- [ ] Frontend starts on port 3000
- [ ] React components load
- [ ] No build errors
- [ ] Styling displays correctly

### OAuth Flow
- [ ] Login button redirects to Google
- [ ] Can authenticate with Google
- [ ] Redirects back to app
- [ ] Profile displays after login
- [ ] User info shows correct details
- [ ] Avatar loads from Google

### Tokens
- [ ] Access token displays
- [ ] Refresh token displays
- [ ] Tokens can be copied
- [ ] Tokens visible in console
- [ ] Refresh button works
- [ ] New tokens generated

### Session Management
- [ ] Session persists on refresh
- [ ] Session persists in new tab
- [ ] Session persists after browser restart
- [ ] Logout clears session
- [ ] localStorage cleared on logout

### Console Logging
- [ ] User object logged
- [ ] Access token logged
- [ ] Refresh token logged
- [ ] All API responses logged
- [ ] Error messages logged
- [ ] Success messages logged

---

## 🚀 Next Steps

### 1. Production Deployment
- Update `GOOGLE_REDIRECT_URI` to production URL
- Switch to HTTPS
- Deploy backend
- Deploy frontend
- Update Google Cloud Console URIs

### 2. Use Tokens with Google APIs
```javascript
// After login, use access token to call Google APIs
const accessToken = /* from frontend */

// Example: Get Gmail messages
fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
})
```

### 3. Add Database (Optional)
- Replace in-memory storage with:
  - MongoDB
  - PostgreSQL
  - Firebase
  - etc.

### 4. Add More Features
- User profile page
- Data refresh/sync
- API integrations
- etc.

---

## 📚 Documentation Files

- **`COMPLETE_SETUP_GUIDE.md`** ← You are here
- **[`REACT_FRONTEND_SETUP.md`](REACT_FRONTEND_SETUP.md)** - Detailed React frontend guide
- **[`GOOGLE_AUTH_TESTING.md`](GOOGLE_AUTH_TESTING.md)** - API testing guide
- **[`backend/server.py`](backend/server.py)** - Backend source code

---

## ❓ FAQ

### Q: Why are there Login and Sign-up buttons?
**A:** Both do the same thing (OAuth). They're separate for testing UI patterns. Both call `/api/auth/google/login`.

### Q: Do I need MongoDB?
**A:** No! Sessions stored in-memory. Perfect for testing. Sessions clear when backend restarts.

### Q: What happens to tokens on backend restart?
**A:** Sessions in memory are lost. User must login again (normal for development).

### Q: How long do access tokens last?
**A:** ~1 hour from Google. Use refresh token to get new ones.

### Q: Can I use this in production?
**A:** Not as-is. Add a real database for token persistence. Use HTTPS. Follow OAuth security best practices.

### Q: How do I extract tokens for my API?
**A:** Check browser console (F12) or use the copy buttons in the UI.

---

**Ready to test? Start with "Step 1: Backend Setup" above!** 🎉

For specific component details, see [`REACT_FRONTEND_SETUP.md`](REACT_FRONTEND_SETUP.md).

For API testing, see [`GOOGLE_AUTH_TESTING.md`](GOOGLE_AUTH_TESTING.md).
