/**
 * Token Manager for Google OAuth2
 * Handles automatic token refresh and storage
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8060';

class AuthTokenManager {
  constructor() {
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.scopes = []; // Initialize scopes
    this.refreshTimer = null;
  }

  /**
   * Initialize the token manager with user session
   */
  async initialize(userId) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/validate?user_id=${userId}`);
      const data = await response.json();

      if (data.valid) {
        this.user = data.user;

        // Get full session data
        const sessionResponse = await fetch(`${BACKEND_URL}/api/auth/user/${userId}`);
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          this.accessToken = session.access_token;
          this.refreshToken = session.refresh_token;
          this.expiresAt = new Date(session.expires_at);
          this.scopes = session.scopes || []; // Store scopes

          // Start auto-refresh
          this.scheduleTokenRefresh();
        }

        return true;
      } else if (data.requires_refresh && this.refreshToken) {
        // Token expired, try to refresh
        return await this.refreshAccessToken();
      }

      return false;
    } catch (error) {
      console.error('Failed to initialize token manager:', error);
      return false;
    }
  }

  /**
   * Store user session after login
   */
  storeSession(userData) {
    this.user = {
      user_id: userData.user_id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture
    };
    this.accessToken = userData.access_token;
    this.refreshToken = userData.refresh_token;
    this.expiresAt = new Date(userData.expires_at);
    this.scopes = userData.scopes || []; // Store scopes

    // Store user ID in localStorage
    localStorage.setItem('user_id', userData.user_id);

    // Schedule token refresh
    this.scheduleTokenRefresh();
  }

  /**
   * Get current access token
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Get current user info
   */
  getUser() {
    return this.user;
  }

  /**
   * Get current refresh token
   */
  getRefreshToken() {
    return this.refreshToken;
  }

  /**
   * Get token expiry time
   */
  getExpiresAt() {
    return this.expiresAt;
  }

  /**
   * Get current scopes
   */
  getScopes() {
    return this.scopes;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.accessToken && !!this.user;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    if (!this.expiresAt) return true;
    return new Date() >= this.expiresAt;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken() {
    if (!this.refreshToken) {
      console.error('No refresh token available');
      return false;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: this.refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();

      if (data.success && data.tokens) {
        this.accessToken = data.tokens.access_token;
        this.refreshToken = data.tokens.refresh_token;

        // Calculate new expiry time
        const expiresIn = data.tokens.expires_in || 3600;
        this.expiresAt = new Date(Date.now() + expiresIn * 1000);
        this.scopes = data.tokens.scope ? data.tokens.scope.split(' ') : []; // Update scopes

        // Update user info
        if (data.user) {
          this.user = {
            user_id: data.user.user_id,
            email: data.user.email,
            name: data.user.name,
            picture: data.user.picture
          };
        }

        // Schedule next refresh
        this.scheduleTokenRefresh();

        console.log('✅ Token refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Clear session on refresh failure
      this.clearSession();
      return false;
    }
  }

  /**
   * Schedule automatic token refresh
   * Refresh 5 minutes before expiry
   */
  scheduleTokenRefresh() {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.expiresAt) return;

    const now = new Date();
    const expiresIn = this.expiresAt.getTime() - now.getTime();

    // Refresh 5 minutes before expiry, or immediately if already expired
    const refreshIn = Math.max(0, expiresIn - 5 * 60 * 1000);

    console.log(`Token refresh scheduled in ${Math.round(refreshIn / 1000 / 60)} minutes`);

    this.refreshTimer = setTimeout(() => {
      console.log('Auto-refreshing token...');
      this.refreshAccessToken();
    }, refreshIn);
  }

  /**
   * Logout and clear session
   */
  async logout() {
    try {
      if (this.user) {
        await fetch(`${BACKEND_URL}/api/auth/logout?user_id=${this.user.user_id}`, {
          method: 'POST'
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearSession();
    }
  }

  /**
   * Clear local session data
   */
  clearSession() {
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.scopes = [];

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    localStorage.removeItem('user_id');
  }

  /**
   * Make authenticated API request
   */
  async authenticatedFetch(url, options = {}) {
    // Check if token is expired and refresh if needed
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        throw new Error('Session expired. Please login again.');
      }
    }

    // Add authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.accessToken}`
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // If we get 401, try to refresh token once
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        return fetch(url, { ...options, headers });
      }
    }

    return response;
  }
}

// Export singleton instance
const authTokenManager = new AuthTokenManager();
export default authTokenManager;