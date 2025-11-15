# 🚀 React Frontend Setup & Testing Guide

Complete guide to use the React-based Google OAuth testing frontend.

## 📦 Project Structure

```
frontend/
├── index.html              # Entry HTML file
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main app component
│   ├── index.css           # Global styles
│   └── pages/
│       ├── LoginSignupPage.jsx   # Login/Signup buttons
│       └── ProfilePage.jsx       # User profile & tokens display
```

## 🔧 Installation

### Prerequisites
- Node.js 16+ (check with `node --version`)
- npm 8+ (check with `npm --version`)

### Setup Steps

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will open at `http://localhost:3000` (or another port if 3000 is busy).

## 🎯 Features

### 1. **Login & Sign-up Buttons**
Two identical buttons for testing:
- Both redirect to Google OAuth
- No difference - both perform login

### 2. **User Profile Display**
After login, shows:
- ✅ User avatar (from Google)
- ✅ User name
- ✅ User email
- ✅ User ID

### 3. **Token Display Section**
Shows both encrypted tokens:
- 🔐 **Access Token** - Used for API requests
- 🔄 **Refresh Token** - Used to refresh access token
- 📋 **Copy buttons** - Copy tokens to clipboard

### 4. **User Information Display**
Shows all authenticated user data:
- Full name
- Email address
- Google User ID
- Profile picture URL

### 5. **Action Buttons**
Two buttons when logged in:
- 🔄 **Refresh Token** - Get new access token
- 🚪 **Logout** - Clear session & logout

### 6. **Console Logging**
All information automatically logged to browser console:
- User data
- Access token
- Refresh token
- All API responses

## 🧪 Testing Workflow

### Step 1: Start Backend
```bash
cd backend
python server.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Step 2: Start Frontend
```bash
cd frontend
npm install  # Only first time
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### Step 3: Test Login Flow

1. **Open Frontend**
   - Go to `http://localhost:3000`
   - See two buttons: "Sign in with Google" and "Sign up with Google"

2. **Click Either Button**
   - Browser redirects to Google login page
   - Status shows: "Redirecting to Google..."

3. **Authenticate with Google**
   - Sign in with your test Google account
   - Grant permissions (email, profile, Gmail, Calendar, Tasks)
   - Google redirects back to frontend

4. **View Profile**
   - User avatar appears
   - Name and email displayed
   - Your user ID shown
   - Status shows: "Login successful!"

5. **Open Browser Console (F12)**
   - Tab: Console
   - See detailed logs:
     ```
     ✅ LOGIN SUCCESSFUL
     User: {user_id: "...", email: "...", name: "...", picture: "..."}
     Access Token: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ii..."
     Refresh Token: "1//0..."
     Expires At: "2025-11-15T19:57:18.000000"
     Scopes: ["openid", "email", "profile", "..."]
     ```

### Step 4: Test Token Refresh

1. **Click "🔄 Refresh Token" Button**
   - Status shows: "Refreshing token..."
   - New tokens are fetched from backend

2. **Check Console**
   - New access token logged
   - New refresh token logged
   - Message: "✅ TOKEN REFRESH SUCCESSFUL"

3. **Copy Tokens**
   - Click "📋 Copy Full Token" buttons
   - Tokens copied to clipboard
   - Status shows: "Copied to clipboard!"

### Step 5: Test Session Persistence

1. **Open new tab or refresh page**
   - Frontend automatically checks `localStorage`
   - Session validated with backend
   - User remains logged in

2. **Close browser & reopen**
   - Session restored from `localStorage`
   - User ID still saved
   - Session validated

### Step 6: Test Logout

1. **Click "🚪 Logout" Button**
   - Status shows: "Logging out..."
   - Backend revokes Google token
   - Session deleted from memory

2. **Backend checks**
   - `localStorage` cleared
   - Session removed
   - User ID no longer stored

3. **Console logs**
   - Message: "✅ LOGOUT SUCCESSFUL"

4. **UI returns to login**
   - Buttons reset to "Sign in with Google" / "Sign up with Google"

## 📊 Console Logging Output

### Login Console Logs
```javascript
✅ LOGIN SUCCESSFUL
User: {
  user_id: "118923945698745625826",
  email: "test@gmail.com",
  name: "Test User",
  picture: "https://lh3.googleusercontent.com/a/..."
}
Access Token: "ya29.a0AfH6SMDx..."
Refresh Token: "1//0gF8Z1..."
Expires At: "2025-11-15T19:57:18.000000"
Scopes: ["openid", "email", "profile", "https://www.googleapis.com/auth/gmail.readonly", ...]
```

### Token Refresh Console Logs
```javascript
✅ TOKEN REFRESH SUCCESSFUL
New Access Token: "ya29.a0AeXoW8f..."
New Refresh Token: "1//0gHqR9S..."
```

### Session Restore Console Logs
```javascript
✅ SESSION RESTORED
User: {user_id: "...", email: "...", name: "...", picture: "..."}
Access Token: "ya29.a0AfH6..."
Refresh Token: "1//0gF8..."
```

### Logout Console Logs
```javascript
✅ LOGOUT SUCCESSFUL
```

## 🎛️ Display Sections

### 1. Login/Signup Section (Before Login)
```
┌─────────────────────────────────┐
│  Sign in with Google   | Sign up with Google |
└─────────────────────────────────┘
```

### 2. User Profile Section (After Login)
```
┌──────────────────────────────────┐
│ [Avatar] Name                    │
│           email@gmail.com        │
│           ID: 118923945...       │
└──────────────────────────────────┘
```

### 3. Action Buttons
```
┌──────────────────────────────────┐
│ 🔄 Refresh Token | 🚪 Logout     │
└──────────────────────────────────┘
```

### 4. Token Display
```
┌──────────────────────────────────┐
│ 📋 Access Token                  │
│ ya29.a0AfH6SMDx...              │
│ [📋 Copy Full Token]             │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ 🔄 Refresh Token                 │
│ 1//0gF8Z1...                     │
│ [📋 Copy Full Token]             │
└──────────────────────────────────┘
```

### 5. User Information Display
```
┌──────────────────────────────────┐
│ 👤 User Information              │
│ Name: Test User                  │
│ Email: test@gmail.com            │
│ User ID: 118923945...            │
│ Picture URL: https://lh3...      │
└──────────────────────────────────┘
```

## 🛠️ Troubleshooting

### Issue: "Connect Refused" Error
**Cause:** Backend not running
**Solution:**
```bash
cd backend
python server.py
```

### Issue: Port Already in Use
**Cause:** Port 3000 already used
**Solution:**
```bash
# Vite will automatically try the next available port
# Or specify a different port
npm run dev -- --port 3001
```

### Issue: CORS Error
**Cause:** Frontend and backend URLs don't match
**Solution:**
- Check `FRONTEND_URL` in `backend/.env`
- Should be `http://localhost:3000`
- Restart backend after changing

### Issue: "Redirect URI Mismatch" Error
**Cause:** OAuth redirect URI not configured in Google Cloud
**Solution:**
1. Go to Google Cloud Console
2. OAuth 2.0 → Authorized redirect URIs
3. Add: `http://localhost:8000/api/auth/google/callback`
4. Save

### Issue: Console Logs Not Showing
**Solution:**
1. Open browser DevTools (F12)
2. Click "Console" tab
3. Refresh page
4. Perform action (login, logout, etc.)

### Issue: Session Not Persisting
**Cause:** Browser cookies/localStorage disabled
**Solution:**
1. Check browser settings
2. Ensure cookies enabled
3. Check `localStorage` in DevTools → Application

## 📝 Environment Variables

Frontend looks for backend at:
```javascript
const BACKEND_URL = 'http://localhost:8000'
```

This is hardcoded in `App.jsx`. To change:

1. Edit `frontend/src/App.jsx`
2. Find: `const BACKEND_URL = 'http://localhost:8000'`
3. Change to your backend URL
4. Save and restart frontend

## 🧩 Component Structure

### App.jsx (Main Component)
- Handles OAuth flow
- Manages user state
- Displays login/profile pages
- Console logging

### LoginSignupPage.jsx
- Two login buttons
- Loading state
- Google icon

### ProfilePage.jsx
- User profile card
- Token display sections
- User information display
- Action buttons (refresh, logout)

## ✅ Testing Checklist

Before considering testing complete:

- [ ] Login button works
- [ ] Redirects to Google
- [ ] User authenticates
- [ ] Profile displays
- [ ] Console shows tokens
- [ ] Access token visible
- [ ] Refresh token visible
- [ ] User info displays
- [ ] Refresh token button works
- [ ] New tokens generated
- [ ] Logout button works
- [ ] Session clears
- [ ] Page refresh restores session
- [ ] Browser refresh restores session
- [ ] Console logging works
- [ ] Copy button works
- [ ] Status messages display

## 🚀 Next Steps

1. **Test API Integration**
   - Use access token to call Google APIs
   - Try Gmail API, Calendar API, Tasks API

2. **Integrate with Your App**
   - Copy React components to your project
   - Adapt styling to match your design
   - Use tokens from context/state

3. **Production Setup**
   - Update `GOOGLE_REDIRECT_URI` to production URL
   - Use HTTPS for production
   - Update `FRONTEND_URL` environment variable
   - Deploy frontend and backend

## 📚 Related Documentation

- [`GOOGLE_AUTH_TESTING.md`](GOOGLE_AUTH_TESTING.md) - API testing guide
- [`backend/server.py`](backend/server.py) - Backend endpoints
- [`backend/.env`](backend/.env) - Configuration

---

**Ready to test? Start with "Installation" section above!** 🎉
