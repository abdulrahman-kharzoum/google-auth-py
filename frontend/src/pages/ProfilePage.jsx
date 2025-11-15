import React from 'react'

function ProfilePage({
  user,
  accessToken,
  refreshToken,
  isLoading,
  onLogout,
  onRefreshToken,
  onCopyToClipboard
}) {
  const truncateToken = (token, length = 50) => {
    if (!token) return ''
    return token.length > length ? token.substring(0, length) + '...' : token
  }

  return (
    <>
      {/* User Card */}
      <div className="user-card">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="user-avatar"
          />
        ) : (
          <div className="user-avatar-placeholder">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-email">{user.email}</div>
          <div className="user-id">ID: {user.user_id}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="button-group">
        <button
          onClick={onRefreshToken}
          disabled={isLoading}
          className="btn-signup"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Refreshing...
            </>
          ) : (
            <>
              🔄
              Refresh Token
            </>
          )}
        </button>

        <button
          onClick={onLogout}
          disabled={isLoading}
          className="btn-logout"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Logging out...
            </>
          ) : (
            <>
              🚪
              Logout
            </>
          )}
        </button>
      </div>

      {/* Token Display Section */}
      <div className="token-section">
        <h3>📋 Access Token</h3>
        <div className="token-item">
          <label>Token Value:</label>
          <div className="token-value" title={accessToken || 'No token'}>
            {accessToken ? truncateToken(accessToken, 100) : 'No token available'}
          </div>
          {accessToken && (
            <button
              onClick={() => onCopyToClipboard(accessToken)}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📋 Copy Full Token
            </button>
          )}
        </div>
      </div>

      {/* Refresh Token Section */}
      {refreshToken && (
        <div className="token-section">
          <h3>🔄 Refresh Token</h3>
          <div className="token-item">
            <label>Token Value:</label>
            <div className="token-value" title={refreshToken || 'No token'}>
              {refreshToken ? truncateToken(refreshToken, 100) : 'No token available'}
            </div>
            {refreshToken && (
              <button
                onClick={() => onCopyToClipboard(refreshToken)}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                📋 Copy Full Token
              </button>
            )}
          </div>
        </div>
      )}

      {/* User Information Section */}
      <div className="token-section">
        <h3>👤 User Information</h3>
        <div className="token-item">
          <label>Name:</label>
          <div className="token-value">{user.name}</div>
        </div>
        <div className="token-item">
          <label>Email:</label>
          <div className="token-value">{user.email}</div>
        </div>
        <div className="token-item">
          <label>User ID:</label>
          <div className="token-value">{user.user_id}</div>
        </div>
        {user.picture && (
          <div className="token-item">
            <label>Picture URL:</label>
            <div className="token-value">{user.picture}</div>
          </div>
        )}
      </div>

      {/* Console Instructions */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => {
            console.clear()
            console.log('=== GOOGLE OAUTH TEST ===')
            console.log('✅ User Information:', user)
            console.log('🔐 Access Token:', accessToken)
            console.log('🔄 Refresh Token:', refreshToken)
            console.log('================================')
          }}
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📝 Log Info to Console
        </button>
      </div>
    </>
  )
}

export default ProfilePage
