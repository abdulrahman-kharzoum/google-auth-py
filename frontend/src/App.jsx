import React, { useState, useEffect } from 'react'
import './index.css'
import LoginSignupPage from './pages/LoginSignupPage'
import ProfilePage from './pages/ProfilePage'

const BACKEND_URL = 'http://localhost:8050'

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
      await handleOAuthCallback(userId)
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (error) {
      showMessage(`Login Error: ${decodeURIComponent(error)}`, 'error')
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }

  const checkExistingSession = async () => {
    const storedUserId = localStorage.getItem('user_id')
    if (storedUserId) {
      await validateSession(storedUserId)
    }
  }

  const handleOAuthCallback = async (userId) => {
    setIsLoading(true)
    showMessage('Processing login...', 'info')
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/user/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to get user session')
      }

      const sessionData = await response.json()
      
      // Store user data
      const userData = {
        user_id: sessionData.user_id,
        email: sessionData.email,
        name: sessionData.name,
        picture: sessionData.picture
      }
      
      setUser(userData)
      setAccessToken(sessionData.access_token)
      setRefreshToken(sessionData.refresh_token)
      localStorage.setItem('user_id', userId)
      
      // Log to console
      console.log('✅ LOGIN SUCCESSFUL')
      console.log('User:', userData)
      console.log('Access Token:', sessionData.access_token)
      console.log('Refresh Token:', sessionData.refresh_token)
      console.log('Expires At:', sessionData.expires_at)
      console.log('Scopes:', sessionData.scopes)
      
      showMessage('Login successful!', 'success')
      setTimeout(() => setStatusMessage(''), 2000)
    } catch (error) {
      console.error('OAuth callback error:', error)
      showMessage(`Login failed: ${error.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const validateSession = async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/validate?user_id=${userId}`)
      const data = await response.json()
      
      if (data.valid && data.user) {
        setUser(data.user)
        
        // Get full session data
        const sessionResponse = await fetch(`${BACKEND_URL}/api/auth/user/${userId}`)
        if (sessionResponse.ok) {
          const session = await sessionResponse.json()
          setAccessToken(session.access_token)
          setRefreshToken(session.refresh_token)
          
          console.log('✅ SESSION RESTORED')
          console.log('User:', data.user)
          console.log('Access Token:', session.access_token)
          console.log('Refresh Token:', session.refresh_token)
        }
      } else {
        localStorage.removeItem('user_id')
        setUser(null)
        setAccessToken(null)
        setRefreshToken(null)
      }
    } catch (error) {
      console.error('Session validation error:', error)
      localStorage.removeItem('user_id')
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    showMessage('Redirecting to Google...', 'info')
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/google/login`)
      
      if (!response.ok) {
        throw new Error('Failed to initiate login')
      }

      const data = await response.json()
      console.log('🔐 Login URL generated:', data.authorization_url)
      window.location.href = data.authorization_url
    } catch (error) {
      console.error('Login error:', error)
      showMessage(`Login failed: ${error.message}`, 'error')
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    showMessage('Logging out...', 'info')
    
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout?user_id=${user.user_id}`, {
        method: 'POST'
      })
      
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)
      localStorage.removeItem('user_id')
      
      console.log('✅ LOGOUT SUCCESSFUL')
      showMessage('Logged out successfully', 'success')
      setTimeout(() => setStatusMessage(''), 2000)
    } catch (error) {
      console.error('Logout error:', error)
      showMessage(`Logout failed: ${error.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshToken = async () => {
    if (!refreshToken) {
      showMessage('No refresh token available', 'error')
      return
    }

    setIsLoading(true)
    showMessage('Refreshing token...', 'info')
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      })
      
      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      
      if (data.tokens) {
        setAccessToken(data.tokens.access_token)
        setRefreshToken(data.tokens.refresh_token)
        
        console.log('✅ TOKEN REFRESH SUCCESSFUL')
        console.log('New Access Token:', data.tokens.access_token)
        console.log('New Refresh Token:', data.tokens.refresh_token)
        
        showMessage('Token refreshed successfully!', 'success')
        setTimeout(() => setStatusMessage(''), 2000)
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      showMessage(`Token refresh failed: ${error.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

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
          isLoading={isLoading}
          onLogin={handleLogin}
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
