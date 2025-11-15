# Firebase Setup Guide

This guide explains how to use Firebase Authentication in the Google OAuth Test Project.

## 📦 What's Been Added

✅ Firebase configuration file: `frontend/src/firebase.js`  
✅ Environment variables: `frontend/.env`  
✅ Firebase dependency: Added to `package.json`

## 🔥 Firebase Configuration

Your project is now configured with Firebase Authentication from the **nevermiss-ai** Firebase project.

### Environment Variables (`.env`)

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyAc9UiiTP-QBmVtpPz3nc_ibKzPrp67L2I
REACT_APP_FIREBASE_AUTH_DOMAIN=nevermiss-ai.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=nevermiss-ai
REACT_APP_FIREBASE_STORAGE_BUCKET=nevermiss-ai.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=749170663025
REACT_APP_FIREBASE_APP_ID=1:749170663025:web:87308089fb7d037e7d45d0
REACT_APP_FIREBASE_MEASUREMENT_ID=G-W6EDQ6Q74P
```

## 🚀 Installation

Install Firebase dependencies:

```bash
cd frontend
npm install
```

This will install:
- `firebase@^10.7.1` - Firebase SDK

## 📝 Firebase Features Included

The `firebase.js` file provides:

1. **Firebase Authentication** (`auth`)
2. **Google Auth Provider** (`googleProvider`) with scopes:
   - Profile & Email
   - Gmail (read & modify)
   - Google Calendar
   - Calendar Events
   - Google Tasks
3. **Session Persistence** (survives page refresh)
4. **Firebase Analytics** (optional)

## 🔧 Usage Example

### Import Firebase in Your Components

```jsx
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

// Sign in with Google
const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('User:', user);
  } catch (error) {
    console.error('Login error:', error);
  }
};

// Sign out
const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log('Logged out');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

## 🔄 Two Authentication Options

Your project now supports **two ways** to authenticate:

### Option 1: Firebase Authentication (New)
- Uses Firebase SDK directly
- Easier to implement
- Managed by Firebase
- No custom backend needed for auth

### Option 2: Custom Backend Authentication (Existing)
- Uses Python FastAPI backend
- More control and customization
- MongoDB for session storage
- Good for complex auth logic

## 🎯 Choosing Between Options

**Use Firebase if:**
- You want quick setup
- You're already using Firebase services
- You don't need custom backend auth logic
- You want Firebase's built-in features

**Use Custom Backend if:**
- You need full control over auth
- You're storing additional session data
- You have complex backend requirements
- You want to avoid vendor lock-in

## 📚 Firebase Authentication Flow

```
1. User clicks "Sign in with Google"
   ↓
2. Firebase opens Google OAuth popup
   ↓
3. User grants permissions
   ↓
4. Firebase receives tokens
   ↓
5. User session created in Firebase
   ↓
6. Tokens automatically refreshed by Firebase
```

## 🔐 OAuth Scopes Configured

The following Google API scopes are included:

| Scope | Purpose |
|-------|---------|
| `userinfo.profile` | User profile information |
| `userinfo.email` | User email address |
| `gmail.readonly` | Read Gmail messages |
| `gmail.modify` | Modify Gmail (labels, archive, etc.) |
| `calendar` | Full calendar access |
| `calendar.events` | Calendar events access |
| `tasks` | Google Tasks access |

## 🛠️ Configuration Details

### Persistence
Session persistence is set to **LOCAL**, meaning:
- ✅ Survives page refresh
- ✅ Survives browser restart
- ✅ User stays logged in

### Custom Parameters
```javascript
prompt: 'consent'     // Always show consent screen
access_type: 'offline' // Get refresh token
```

## 📊 Firebase Analytics

Analytics is initialized but optional. It provides:
- User engagement tracking
- Event logging
- App performance monitoring

## 🔒 Security Notes

1. **Never commit `.env` file** - It's in `.gitignore`
2. **API keys are public** - Firebase API keys are meant to be public
3. **Security rules matter** - Configure Firebase Security Rules properly
4. **HTTPS in production** - Always use HTTPS in production

## 🧪 Testing Firebase Auth

1. Start the development server:
```bash
npm run dev
```

2. Open browser and check console (F12)

3. Click login button and authorize

4. Check Firebase Console:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select "nevermiss-ai" project
   - Check Authentication → Users

## 🆚 Comparison: Firebase vs Custom Backend

| Feature | Firebase | Custom Backend |
|---------|----------|----------------|
| Setup Time | ⚡ Fast | ⏱️ Moderate |
| Maintenance | 🤖 Managed | 👷 Self-managed |
| Customization | 📦 Limited | 🎨 Full |
| Cost | 💰 Pay as you grow | 💻 Server costs |
| Scalability | 🚀 Automatic | 📈 Manual |
| Session Storage | ☁️ Firebase | 🗄️ MongoDB |

## 📖 Next Steps

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Test authentication** - Try logging in
4. **Check console** - View tokens and user data
5. **Integrate with your app** - Use Firebase auth in components

## 🤝 Integration with Existing Backend

You can use Firebase for authentication AND your custom backend for other features:

```jsx
import { auth } from './firebase';

// Get Firebase ID token
const user = auth.currentUser;
const idToken = await user.getIdToken();

// Send to your backend
fetch('http://localhost:8000/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});
```

## 📞 Support

- **Firebase Docs**: https://firebase.google.com/docs/auth
- **Google OAuth Scopes**: https://developers.google.com/identity/protocols/oauth2/scopes

---

## ✅ Summary

Your Google Auth Test Project now has:
- ✅ Firebase configuration
- ✅ Google OAuth scopes
- ✅ Session persistence
- ✅ Environment variables
- ✅ Firebase dependency

**You're ready to use Firebase Authentication!** 🎉