import React, { useState, useEffect } from 'react';
import authTokenManager from '../utils/authTokenManager';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8050';

/**
 * Google OAuth2 Login Button Component
 * Handles the complete OAuth flow with automatic token management
 */
const GoogleAuthButton = ({ onLoginSuccess, onLoginError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      initializeSession(storedUserId);
    }

    // Listen for messages from the pop-up window
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        // Ensure the message is from the same origin for security
        return;
      }

      const { authStatus, userId, error } = event.data;

      if (authStatus === 'success' && userId) {
        handleOAuthCallback(userId);
      } else if (error) {
        console.error('OAuth error from pop-up:', error);
        if (onLoginError) {
          onLoginError(new Error(decodeURIComponent(error)));
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  /**
   * Initialize existing session
   */
  const initializeSession = async (userId) => {
    setIsLoading(true);
    try {
      const initialized = await authTokenManager.initialize(userId);
      if (initialized) {
        const userData = authTokenManager.getUser();
        setUser(userData);
        if (onLoginSuccess) {
          onLoginSuccess(userData);
        }
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle OAuth callback
   */
  const handleOAuthCallback = async (userId) => {
    setIsLoading(true);
    try {
      // Get user session from backend
      const response = await fetch(`${BACKEND_URL}/api/auth/user/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get user session');
      }

      const sessionData = await response.json();
      
      // Store in token manager
      authTokenManager.storeSession(sessionData);
      
      const userData = authTokenManager.getUser();
      setUser(userData);
      
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
      
      console.log('✅ Login successful:', userData);
    } catch (error) {
      console.error('OAuth callback error:', error);
      if (onLoginError) {
        onLoginError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initiate Google login
   */
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Get authorization URL from backend
      const response = await fetch(`${BACKEND_URL}/api/auth/google/login`);
      
      if (!response.ok) {
        throw new Error('Failed to initiate login');
      }

      const data = await response.json();
      
      // Open Google OAuth in a pop-up window
      const popup = window.open(data.authorization_url, 'googleAuthPopup', 'width=600,height=700');
      if (!popup) {
        throw new Error('Pop-up blocked. Please enable pop-ups for this site.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      if (onLoginError) {
        onLoginError(error);
      }
    }
  };

  /**
   * Logout user
   */
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authTokenManager.logout();
      setUser(null);
      console.log('✅ Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="google-auth-container" style={styles.container}>
        <div style={styles.userInfo}>
          {user.picture && (
            <img 
              src={user.picture} 
              alt={user.name} 
              style={styles.avatar}
            />
          )}
          <div style={styles.userDetails}>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userEmail}>{user.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          style={styles.logoutButton}
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      style={styles.loginButton}
    >
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          <svg style={styles.googleIcon} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </>
      )}
    </button>
  );
};

// Default styles
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '600',
    fontSize: '14px',
  },
  userEmail: {
    fontSize: '12px',
    color: '#666',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  googleIcon: {
    width: '20px',
    height: '20px',
  },
};

export default GoogleAuthButton;