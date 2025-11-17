/**
 * Token Manager for Google OAuth2
 * Handles automatic token refresh and storage
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8050';

interface User {
  user_id: string;
  email: string;
  name: string;
  picture: string;
}

class AuthTokenManager {
  private user: User | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: Date | null = null;
  private scopes: string[] = [];
  private refreshTimer: NodeJS.Timeout | null = null;

  async initialize(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/validate?user_id=${userId}`);
      const data = await response.json();

      if (data.valid) {
        this.user = data.user;

        const sessionResponse = await fetch(`${BACKEND_URL}/api/auth/user/${userId}`);
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          console.log('Session data from backend:', session); // Log the session data
          this.accessToken = session.access_token;
          this.refreshToken = session.refresh_token;
          this.expiresAt = new Date(session.expires_at);
          this.scopes = session.scopes || [];
          this.scheduleTokenRefresh();
        }
        return true;
      } else if (data.requires_refresh && this.refreshToken) {
        return await this.refreshAccessToken();
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize token manager:', error);
      return false;
    }
  }

  storeSession(userData: any) {
    this.user = {
      user_id: userData.user_id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture
    };
    this.accessToken = userData.access_token;
    this.refreshToken = userData.refresh_token;
    this.expiresAt = new Date(userData.expires_at);
    this.scopes = userData.scopes || [];
    localStorage.setItem('user_id', userData.user_id);
    this.scheduleTokenRefresh();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getUser(): User | null {
    return this.user;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  getExpiresAt(): Date | null {
    return this.expiresAt;
  }

  getScopes(): string[] {
    return this.scopes;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.user;
  }

  isTokenExpired(): boolean {
    if (!this.expiresAt) return true;
    return new Date() >= this.expiresAt;
  }

  async refreshAccessToken(): Promise<boolean> {
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
        const expiresIn = data.tokens.expires_in || 3600;
        this.expiresAt = new Date(Date.now() + expiresIn * 1000);
        this.scopes = data.tokens.scope ? data.tokens.scope.split(' ') : [];
        if (data.user) {
          this.user = {
            user_id: data.user.user_id,
            email: data.user.email,
            name: data.user.name,
            picture: data.user.picture
          };
        }
        this.scheduleTokenRefresh();
        console.log('✅ Token refreshed successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearSession();
      return false;
    }
  }

  scheduleTokenRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    if (!this.expiresAt) return;

    const now = new Date();
    const expiresIn = this.expiresAt.getTime() - now.getTime();
    const refreshIn = Math.max(0, expiresIn - 5 * 60 * 1000);

    console.log(`Token refresh scheduled in ${Math.round(refreshIn / 1000 / 60)} minutes`);

    this.refreshTimer = setTimeout(() => {
      console.log('Auto-refreshing token...');
      this.refreshAccessToken();
    }, refreshIn);
  }

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

  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        throw new Error('Session expired. Please login again.');
      }
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.accessToken}`
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        return fetch(url, { ...options, headers });
      }
    }

    return response;
  }
}

const authTokenManager = new AuthTokenManager();
export default authTokenManager;
