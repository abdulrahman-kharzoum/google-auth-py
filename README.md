# 🔐 Google OAuth Test Project

A complete Google OAuth2 authentication system with FastAPI backend and React frontend. Includes automatic token refresh, session management, and secure token storage.

## 📋 Features

- ✅ Google OAuth2 Authentication
- ✅ Automatic Token Refresh
- ✅ Secure Token Encryption
- ✅ Session Management (in-memory for testing)
- ✅ Gmail, Calendar, and Tasks API Access
- ✅ Clean, Modern UI
- ✅ React Frontend with Vite

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js & npm** ([Download](https://nodejs.org/))
- **Google Cloud Project** with OAuth2 credentials

## 📦 Project Structure

```
google-oauth-test-project/
├── backend/
│   ├── auth_backend.py          # Main FastAPI backend application
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment variables template
│   └── .gitignore              # Git ignore file
├── frontend/
│   ├── index.html              # Main HTML file
│   ├── src/
│   │   ├── components/
│   │   │   └── GoogleAuthButton.jsx  # React component for Google Auth
│   │   ├── pages/
│   │   │   ├── LoginSignupPage.jsx   # Login/Signup page
│   │   │   └── ProfilePage.jsx       # User profile page
│   │   ├── utils/
│   │   │   └── authTokenManager.js   # Token manager utility
│   │   ├── App.jsx                 # Main React application component
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles
│   ├── .env.example            # Environment variables template
│   ├── .gitignore              # Git ignore file
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
└── README.md
```

## 🚀 Setup Instructions

### Step 1: Google Cloud Console Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Create a new project** (or select existing one)
   - Click "Select a project" → "New Project"
   - Name it (e.g., "OAuth Test Project")
   - Click "Create"

3. **Enable Required APIs**
   - Go to "APIs & Services" → "Library"
   - Enable the following APIs:
     - Google+ API
     - Gmail API
     - Google Calendar API
     - Google Tasks API

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" → Click "Create"
   - Fill in required fields:
     - App name: "OAuth Test Project"
     - User support email: your-email@gmail.com
     - Developer contact: your-email@gmail.com
   - Click "Save and Continue"
   - Add scopes (click "Add or Remove Scopes"):
     - Select all needed scopes or just use the default ones
   - Click "Save and Continue"
   - Add test users (your Gmail account)
   - Click "Save and Continue"

5. **Create OAuth2 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "OAuth Test Client"
   - Authorized redirect URIs:
     - Add: `http://localhost:8050/api/auth/google/callback`
   - Click "Create"
   - **Save the Client ID and Client Secret** (you'll need these!)

### Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # Activate it:
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Generate encryption key**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   **Copy the output**, you'll use it in the next step.

5. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

6. **Edit `.env` file** with your values:
   ```env
   # Paste your Google credentials from Step 1
   GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
   GOOGLE_REDIRECT_URI=http://localhost:8050/api/auth/google/callback
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   
   # Paste your encryption key from Step 3.4
   ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY_HERE
   
   # Server port
   PORT=8050
   ```

7. **Run the backend**
   ```bash
   python auth_backend.py
   ```
   
   You should see:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8050
   ```

### Step 3: Frontend Setup
 
The frontend uses Vite for development.
 
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```
 
2. **Install dependencies**
   ```bash
   npm install
   ```
 
3. **Run the frontend development server**
   ```bash
   npm run dev
   ```
   
   You should see output similar to:
   ```
     VITE v5.x.x  ready in XXX ms
   
     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
     ➜  press h + enter to show help
   ```
 
4. **Open browser**
   - Navigate to: **http://localhost:5173** (or the port shown in the terminal)
 
## 🎯 Testing the Application
 
### Test Complete OAuth Flow (Pop-up)
 
1. **Open** http://localhost:5173 in your browser
 
2. **Click "Sign in with Google"**
    - A pop-up window will appear for Google's login page
    - Sign in with your Google account
    - If you have previously granted permissions, you should not be prompted again.
    - If you are prompted, select your account.
 
3. **Click "Sign up with Google"**
    - A pop-up window will appear for Google's login page
    - Sign in with your Google account
    - You should be prompted to grant permissions (consent screen).
 
4. **After authorization**
    - The pop-up window will close automatically
    - The main window will update, and you should see your profile (name, email, picture)
 
5. **Test logout**
    - Click "Logout" button
    - You should be logged out
    - Tokens are revoked on the backend
 
6. **Test session persistence**
    - Login again
    - Close and reopen browser
    - Navigate to http://localhost:5173
    - You should still be logged in (session restored)
 
### Verify Backend
 
1. **Check backend logs** for successful operations (run `python auth_backend.py` in the `backend` directory):
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8050
   ```
 
2. **Test API endpoints directly**:
   ```bash
   # Health check
   curl http://localhost:8050
   
   # Get login URL
   curl http://localhost:8050/api/auth/google/login
   ```
 
## 🐛 Troubleshooting
 
### Issue: "Invalid redirect URI"
 
**Solution:**
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Ensure redirect URI is exactly: `http://localhost:8050/api/auth/google/callback`
4. Save and wait 5 minutes for changes to propagate
 
### Issue: "CORS Error"
 
**Solution:**
- Make sure backend is running on port 8050
- Make sure frontend is running on port 5173 (or the port shown by `npm run dev`)
- Check [`backend/auth_backend.py`](backend/auth_backend.py:26) has correct CORS origins
 
### Issue: "Access blocked: This app's request is invalid"
 
**Solution:**
1. In Google Cloud Console, check OAuth consent screen
2. Add yourself as a test user
3. Make sure all required fields are filled
4. Save and try again
 
### Issue: Port already in use
 
**Solution:**
```bash
# Find process using port (e.g., 5173 for frontend, 8050 for backend)
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
 
# Mac/Linux:
lsof -i :5173
kill -9 <PID>
 
# Or change the port in frontend/vite.config.js or backend/.env
```
 
## 📚 API Endpoints
 
### Authentication Endpoints
 
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/auth/google/login` | Get Google OAuth URL |
| GET | `/api/auth/google/callback` | OAuth callback handler (handles pop-up messages) |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/user/{user_id}` | Get user session |
| POST | `/api/auth/logout` | Logout and revoke tokens |
| GET | `/api/auth/validate` | Validate session |
 
### Example: Make Authenticated Request
 
```javascript
// Using the stored access token
const accessToken = localStorage.getItem('access_token');
 
fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
.then(response => response.json())
.then(data => console.log('Gmail messages:', data));
```
 
## 🔒 Security Features
 
- ✅ **Token Encryption**: Access and refresh tokens encrypted in memory
- ✅ **State Validation**: CSRF protection via OAuth state parameter
- ✅ **Automatic Token Refresh**: Tokens refreshed 5 minutes before expiry
- ✅ **Secure Session Management**: In-memory, encrypted storage
- ✅ **Token Revocation**: Tokens properly revoked on logout
 
## 🎨 Customization
 
### Change Scopes
 
Edit [`backend/auth_backend.py`](backend/auth_backend.py:219) to modify requested permissions:
 
```python
"scope": " ".join([
    "openid",
    "email",
    "profile",
    # Add/remove Google API scopes as needed
    "https://www.googleapis.com/auth/gmail.readonly",
])
```
 
### Customize Frontend
 
Edit [`frontend/src/App.jsx`](frontend/src/App.jsx:1) or other React components to change styling, layout, or behavior.
 
## 📝 Notes
 
- **Test Users**: During development, only test users can access the app
- **Token Expiry**: Access tokens expire after 1 hour (auto-refreshed)
- **Refresh Tokens**: Don't expire but can be revoked by user
- **Storage**: Sessions stored in-memory for testing purposes. For production, consider a persistent database.
 
## 🤝 Need Help?
 
For issues or questions:
1. Check the Troubleshooting section above
2. Review backend logs for error messages
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
 
## 📄 License
 
MIT License - feel free to use this project for learning and development!
 
---
 
**Happy Testing! 🚀**