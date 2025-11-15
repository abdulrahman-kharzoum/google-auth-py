# ⚡ Quick Start Guide

Get your Google OAuth test project running in 5 minutes!

## 📋 Checklist

Before starting, make sure you have:
- [ ] Python 3.8+ installed
- [ ] MongoDB installed and running
- [ ] Google Cloud Project created
- [ ] OAuth credentials from Google Cloud Console

## 🚀 Quick Setup (5 Steps)

### 1️⃣ Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select project → APIs & Services → Credentials
3. Create OAuth Client ID (Web application)
4. Add redirect URI: `http://localhost:8000/api/auth/google/callback`
5. **Copy Client ID and Client Secret**

### 2️⃣ Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# cp .env.example .env  # Mac/Linux
```

### 3️⃣ Configure Environment

Edit `backend/.env`:
```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
MONGO_URL=mongodb://localhost:27017/
DATABASE_NAME=google_auth_db
ENCRYPTION_KEY=your_encryption_key_here
PORT=8000
```

**Generate encryption key**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4️⃣ Start MongoDB

```bash
# Windows: Already running as service
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify:
mongosh
```

### 5️⃣ Start Servers

**Option 1: Manual (Recommended for testing)**

Terminal 1 - Backend:
```bash
cd backend
python auth_backend.py
```

Terminal 2 - Frontend:
```bash
cd frontend
python -m http.server 3000
```

**Option 2: Automated (Windows)**
```bash
# Double-click start-servers.bat
# OR
.\start-servers.bat
```

## 🎯 Test It!

1. Open browser: **http://localhost:3000**
2. Click "Sign in with Google"
3. Login with your Google account
4. Grant permissions
5. See your profile!

## ⚠️ Common Issues

### MongoDB not running
```bash
# Windows: Check Services app
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port already in use
```bash
# Change PORT in backend/.env
PORT=8001

# Or kill the process
# Windows: netstat -ano | findstr :8000
# Mac/Linux: lsof -i :8000
```

### "Invalid redirect URI" error
- Go to Google Cloud Console
- Check OAuth client redirect URIs
- Must be exactly: `http://localhost:8000/api/auth/google/callback`
- Save and wait 5 minutes

### "Access blocked" error
- Add yourself as test user in OAuth consent screen
- Or publish the app (not recommended for testing)

## 📖 Next Steps

- Read [README.md](README.md) for detailed documentation
- Check API endpoints in README
- Customize scopes in `backend/auth_backend.py`
- Modify UI in `frontend/index.html`

## 🆘 Still Having Issues?

1. Check backend console for errors
2. Check browser console (F12)
3. Verify all environment variables
4. Ensure MongoDB is running
5. Check the Troubleshooting section in [README.md](README.md)

---

**Need more help? Check the full [README.md](README.md)!**