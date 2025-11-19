import React, { useState, useEffect } from 'react'
import './index.css'
import LoginSignupPage from './pages/LoginSignupPage'
import ProfilePage from './pages/ProfilePage'
import authTokenManager from './utils/authTokenManager'

const BACKEND_URL = 'http://localhost:8060'

function App() {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('info')

  // Check for OAuth callback on page load
  useEffect(() => {
    checkAuthCallback()
    checkExistingSession()
  }, [])

  const checkAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const authStatus = urlParams.get('auth')
    const userId = urlParams.get('user_id')
    const error = urlParams.get('error')

    if (authStatus === 'success' && userId) {
      // After successful OAuth, initialize authTokenManager and update App state
      const initialized = await authTokenManager.initialize(userId);
      if (initialized) {
        updateAppStateFromAuthManager();
        localStorage.setItem('user_id', userId);
        showMessage('Login successful!', 'success');
        setTimeout(() => setStatusMessage(''), 2000);
      } else {
        showMessage('Login failed: Could not initialize session.', 'error');
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      showMessage(`Login Error: ${decodeURIComponent(error)}`, 'error');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const checkExistingSession = async () => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setIsLoading(true);
      showMessage('Restoring session...', 'info');
      try {
        const initialized = await authTokenManager.initialize(storedUserId);
        if (initialized) {
          updateAppStateFromAuthManager();
          console.log('✅ SESSION RESTORED');
          showMessage('Session restored!', 'success');
          setTimeout(() => setStatusMessage(''), 2000);
        } else {
          localStorage.removeItem('user_id');
          setUser(null);
          setAccessToken(null);
          setRefreshToken(null);
          showMessage('Session expired or invalid. Please log in again.', 'error');
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('user_id');
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        showMessage(`Error restoring session: ${error.message}`, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOAuthCallback = async (userId) => {
    // This function is now primarily for initial login handling,
    // the actual session initialization is done in checkAuthCallback
    // and checkExistingSession.
    // We just need to ensure the App state is updated.
    updateAppStateFromAuthManager();
  };

  const updateAppStateFromAuthManager = () => {
    const userData = authTokenManager.getUser();
    setUser(userData);
    setAccessToken(authTokenManager.getAccessToken());
    setRefreshToken(authTokenManager.getRefreshToken());

    console.log('User:', userData);
    console.log('Access Token:', authTokenManager.getAccessToken());
    console.log('Refresh Token:', authTokenManager.getRefreshToken());
    console.log('Expires At:', authTokenManager.getExpiresAt());
    console.log('Scopes:', authTokenManager.getScopes());
  };

  const validateSession = async (userId) => {
    // This function is no longer needed as authTokenManager.initialize handles validation
    // and session retrieval.
    // However, we keep it for now to avoid breaking other parts if it's called elsewhere.
    // It will be refactored or removed in a later step if confirmed unused.
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/validate?user_id=${userId}`);
      const data = await response.json();

      if (data.valid && data.user) {
        // If valid, ensure authTokenManager is initialized and update App state
        await authTokenManager.initialize(userId);
        updateAppStateFromAuthManager();
      } else {
        localStorage.removeItem('user_id');
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
      }
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem('user_id');
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    }
  };


  const handleLogout = async () => {
    setIsLoading(true);
    showMessage('Logging out...', 'info');

    try {
      await authTokenManager.logout();
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);

      console.log('✅ LOGOUT SUCCESSFUL');
      showMessage('Logged out successfully', 'success');
      setTimeout(() => setStatusMessage(''), 2000);
    } catch (error) {
      console.error('Logout error:', error);
      showMessage(`Logout failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    setIsLoading(true);
    showMessage('Refreshing token...', 'info');

    try {
      const refreshed = await authTokenManager.refreshAccessToken();
      if (refreshed) {
        updateAppStateFromAuthManager();
        console.log('✅ TOKEN REFRESH SUCCESSFUL');
        showMessage('Token refreshed successfully!', 'success');
        setTimeout(() => setStatusMessage(''), 2000);
      } else {
        throw new Error('Failed to refresh token. Please login again.');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      showMessage(`Token refresh failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (message, type) => {
    setStatusMessage(message)
    setStatusType(type)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    showMessage('Copied to clipboard!', 'success')
    setTimeout(() => setStatusMessage(''), 2000)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🔐 Google OAuth Test</h1>
        <p>Testing Google OAuth2 Authentication</p>
      </div>

      {statusMessage && (
        <div className={`status-message status-${statusType}`}>
          {statusMessage}
        </div>
      )}

      {user ? (
        <ProfilePage
          user={user}
          accessToken={accessToken}
          refreshToken={refreshToken}
          isLoading={isLoading}
          onLogout={handleLogout}
          onRefreshToken={handleRefreshToken}
          onCopyToClipboard={copyToClipboard}
        />
      ) : (
        <LoginSignupPage
          onLoginSuccess={handleOAuthCallback}
          onLoginError={(error) => showMessage(`Login failed: ${error.message}`, 'error')}
        />
      )}

      <div className="console-log-hint">
        <strong>💡 Check Browser Console (F12)</strong>
        Open your browser's developer console (F12 or right-click → Inspect → Console) to see:
        <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
          <li>Access Token</li>
          <li>Refresh Token</li>
          <li>User Information</li>
          <li>All API responses</li>
        </ul>
      </div>
    </div>
  )
}

export default App
