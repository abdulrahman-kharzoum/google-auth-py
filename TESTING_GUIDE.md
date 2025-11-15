# 🧪 Testing Guide

Complete guide to test all features of the Google OAuth Test Project.

## 🎯 Pre-Testing Checklist

Before you start testing, ensure:

- [x] MongoDB is running
- [x] Backend server is running on port 8000
- [x] Frontend server is running on port 3000
- [x] `.env` file is configured with valid Google credentials
- [x] You're added as a test user in Google Cloud Console

**Run the setup validator:**
```bash
python test-setup.py
```

## 📝 Test Scenarios

### 1. Initial Login Flow

**Objective:** Test the complete OAuth flow from start to finish

**Steps:**
1. Open browser: `http://localhost:3000`
2. You should see "Sign in with Google" button
3. Click the button
4. Browser redirects to Google login page
5. Sign in with your Google account
6. Grant permissions (click "Continue" or "Allow")
7. Browser redirects back to `http://localhost:3000`
8. You should see your profile with:
   - Profile picture
   - Name
   - Email address
   - User ID

**Expected Result:** ✅ Successfully logged in with user profile displayed

**Check Backend Logs:**
```
✅ Successfully connected to MongoDB
✅ Database indexes created
```

**Check MongoDB:**
```bash
mongosh
use google_auth_db
db.user_sessions.find().pretty()
```
You should see your user session with encrypted tokens.

---

### 2. Session Persistence

**Objective:** Test that sessions are maintained across browser sessions

**Steps:**
1. After successful login (from Test 1)
2. Close the browser completely
3. Open a new browser window
4. Navigate to `http://localhost:3000`
5. You should automatically be logged in

**Expected Result:** ✅ User remains logged in without re-authentication

**How it works:**
- User ID stored in `localStorage`
- On page load, session is validated with backend
- If valid, user profile is restored

---

### 3. Logout Flow

**Objective:** Test complete logout and token revocation

**Steps:**
1. While logged in, click "Logout" button
2. Wait for logout to complete
3. You should see the "Sign in with Google" button again
4. Profile should no longer be visible

**Expected Result:** ✅ Successfully logged out

**Verify:**
```bash
# Check localStorage is cleared
# Open browser console (F12) and type:
localStorage.getItem('user_id')  # Should return null

# Check MongoDB - session should be deleted
mongosh
use google_auth_db
db.user_sessions.find().pretty()  # Should be empty or not show your session
```

---

### 4. Token Refresh (Advanced)

**Objective:** Test automatic token refresh before expiration

**Note:** Access tokens expire after 1 hour. By default, the system refreshes tokens 5 minutes before expiration.

**Steps:**
1. Login successfully
2. Open browser console (F12)
3. Wait for auto-refresh log message (or modify token expiry for faster testing)

**Expected Console Log:**
```
Token refresh scheduled in X minutes
Auto-refreshing token...
✅ Token refreshed successfully
```

**Manual Testing:**
1. Login successfully
2. In backend, modify token expiry to 2 minutes for testing
3. Wait 2 minutes
4. Token should auto-refresh

**Expected Result:** ✅ Token automatically refreshes without user intervention

---

### 5. Error Handling - Invalid State

**Objective:** Test CSRF protection via state validation

**Steps:**
1. Get login URL: `http://localhost:8000/api/auth/google/login`
2. Copy the authorization_url
3. Manually modify the `state` parameter in the URL
4. Visit the modified URL
5. Complete Google login
6. On callback, you should see an error

**Expected Result:** ✅ "invalid_state" error displayed

---

### 6. Error Handling - Expired Refresh Token

**Objective:** Test handling of expired refresh tokens

**Steps:**
1. Login successfully
2. In MongoDB, manually invalidate the refresh token:
   ```bash
   mongosh
   use google_auth_db
   db.user_sessions.updateOne(
     {user_id: "YOUR_USER_ID"},
     {$set: {refresh_token: "invalid_token"}}
   )
   ```
3. Wait for auto-refresh attempt (or trigger manually)
4. System should detect invalid token and require re-login

**Expected Result:** ✅ User is logged out and must re-authenticate

---

### 7. Multiple Scopes Access

**Objective:** Verify that all requested OAuth scopes are granted

**Steps:**
1. After successful login, check granted scopes in MongoDB:
   ```bash
   mongosh
   use google_auth_db
   db.user_sessions.findOne({}, {scopes: 1})
   ```

2. Check backend logs for scope information

**Expected Scopes:**
- `openid`
- `email`
- `profile`
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`
- `https://www.googleapis.com/auth/tasks`

**Expected Result:** ✅ All requested scopes are present

---

### 8. API Endpoint Testing

**Objective:** Test all backend API endpoints

#### Health Check
```bash
curl http://localhost:8000
```
**Expected:** `{"status": "healthy", ...}`

#### Get Login URL
```bash
curl http://localhost:8000/api/auth/google/login
```
**Expected:** `{"authorization_url": "https://accounts.google.com/...", "state": "..."}`

#### Get User Session
```bash
curl http://localhost:8000/api/auth/user/{YOUR_USER_ID}
```
**Expected:** User session data with encrypted tokens

#### Validate Session
```bash
curl "http://localhost:8000/api/auth/validate?user_id={YOUR_USER_ID}"
```
**Expected:** `{"valid": true, "message": "Session is valid", ...}`

#### Logout
```bash
curl -X POST "http://localhost:8000/api/auth/logout?user_id={YOUR_USER_ID}"
```
**Expected:** `{"success": true, "message": "Logged out successfully"}`

---

### 9. Browser Compatibility

**Objective:** Test across different browsers

Test the complete login flow in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)

**Expected Result:** ✅ Works consistently across all browsers

---

### 10. Mobile Responsiveness

**Objective:** Test on mobile devices or responsive mode

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (responsive mode)
3. Test on various screen sizes:
   - iPhone SE (375x667)
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)

**Expected Result:** ✅ UI adapts properly to different screen sizes

---

## 🐛 Common Test Failures & Solutions

### Login redirects but no profile shown

**Causes:**
- Backend not running
- CORS misconfiguration
- Environment variables incorrect

**Debug:**
```javascript
// Open browser console (F12)
// Check for errors
console.log(localStorage.getItem('user_id'))
```

### "Invalid credentials" error

**Causes:**
- Wrong Client ID/Secret in `.env`
- Credentials not saved in Google Cloud Console

**Solution:**
- Verify credentials in Google Cloud Console
- Double-check `.env` file
- Restart backend after changing `.env`

### MongoDB connection errors

**Causes:**
- MongoDB not running
- Wrong connection string

**Solution:**
```bash
# Check MongoDB status
mongosh

# Check connection string in .env
MONGO_URL=mongodb://localhost:27017/
```

### Port conflicts

**Causes:**
- Port already in use by another process

**Solution:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux  
lsof -i :8000
kill -9 <PID>
```

## ✅ Test Completion Checklist

After completing all tests, verify:

- [ ] Can login successfully
- [ ] Profile displays correctly
- [ ] Session persists after browser restart
- [ ] Can logout successfully
- [ ] Tokens are encrypted in database
- [ ] All scopes are granted
- [ ] Auto-refresh works (or scheduled)
- [ ] Error handling works correctly
- [ ] All API endpoints respond correctly
- [ ] Works across different browsers

## 📊 Test Report Template

```
Test Date: [DATE]
Tester: [NAME]
Browser: [Chrome/Firefox/Safari] [VERSION]
OS: [Windows/Mac/Linux]

✅ PASSED TESTS:
- Initial Login Flow
- Session Persistence
- Logout Flow
- [Add more...]

❌ FAILED TESTS:
- [Test name]
  Issue: [Description]
  Expected: [Expected behavior]
  Actual: [Actual behavior]

🔧 ENVIRONMENT:
- Backend: Running on port 8000
- Frontend: Running on port 3000
- MongoDB: Version X.X
- Python: Version 3.X

📝 NOTES:
[Any additional observations]
```

## 🎓 Advanced Testing

### Load Testing

Test with multiple concurrent users (requires additional setup):

```python
# install: pip install locust
# Create locustfile.py for load testing
```

### Security Testing

1. **Test HTTPS in production** (not localhost)
2. **Verify token encryption** in database
3. **Test CSRF protection** via state parameter
4. **Check for XSS vulnerabilities**
5. **Validate CORS settings**

### Integration Testing

Test integration with Google APIs:

```javascript
// After login, test accessing Google APIs
const token = accessToken; // Get from login response

// Gmail API
fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Calendar API  
fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Tasks API
fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

**Happy Testing! 🚀**

If you find any issues, check the [README.md](README.md) troubleshooting section.