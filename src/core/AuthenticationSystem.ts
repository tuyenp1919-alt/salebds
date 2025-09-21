/**
 * Advanced Authentication System
 * Provides JWT-based auth with refresh tokens, secure storage, and multiple authentication methods
 */

import { errorRecoverySystem } from './ErrorRecoverySystem';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  role: 'admin' | 'manager' | 'sales' | 'support';
  team?: string;
  permissions: string[];
  preferences: UserPreferences;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  isVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'vi' | 'en';
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    desktop: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityTracking: boolean;
    dataSharing: boolean;
  };
}

export interface AuthSession {
  id: string;
  userId: string;
  device: string;
  location?: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  acceptTerms: boolean;
  marketingConsent?: boolean;
}

export interface PasswordResetData {
  email: string;
  token?: string;
  newPassword?: string;
}

export interface AuthState {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number;
  sessionTimeout: number;
}

export interface AuthEventDetail {
  type: 'login' | 'logout' | 'refresh' | 'session-expired' | 'password-changed';
  user?: UserProfile;
  timestamp: number;
  metadata?: any;
}

export class AuthenticationSystem {
  private static instance: AuthenticationSystem;
  private state: AuthState;
  private refreshTimer: NodeJS.Timeout | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  private listeners: Set<(state: AuthState) => void> = new Set();
  private eventListeners: Set<(event: AuthEventDetail) => void> = new Set();
  private readonly STORAGE_KEYS = {
    TOKENS: 'auth_tokens',
    USER: 'auth_user', 
    SESSION: 'auth_session',
    PREFERENCES: 'user_preferences',
    DEVICE_ID: 'device_id'
  };
  private deviceId: string;
  private apiBaseUrl: string = '/api/v1';
  
  static getInstance(): AuthenticationSystem {
    if (!AuthenticationSystem.instance) {
      AuthenticationSystem.instance = new AuthenticationSystem();
    }
    return AuthenticationSystem.instance;
  }

  private constructor() {
    this.deviceId = this.getOrCreateDeviceId();
    this.state = {
      user: null,
      tokens: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      lastActivity: Date.now(),
      sessionTimeout: 30 * 60 * 1000 // 30 minutes
    };

    this.initializeFromStorage();
    this.setupActivityTracking();
    this.setupStorageListener();
  }

  private getOrCreateDeviceId(): string {
    try {
      let deviceId = localStorage.getItem(this.STORAGE_KEYS.DEVICE_ID);
      if (!deviceId) {
        deviceId = this.generateDeviceId();
        localStorage.setItem(this.STORAGE_KEYS.DEVICE_ID, deviceId);
      }
      return deviceId;
    } catch (error) {
      // Fallback for when localStorage is not available
      return this.generateDeviceId();
    }
  }

  private generateDeviceId(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 10, 10);
    const fingerprint = canvas.toDataURL();
    
    return btoa(
      navigator.userAgent + 
      navigator.language + 
      screen.width + 'x' + screen.height +
      new Date().getTimezoneOffset() +
      fingerprint
    ).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  private async initializeFromStorage(): Promise<void> {
    try {
      this.setState({ isLoading: true });

      // Load tokens
      const tokensData = this.getStorageItem(this.STORAGE_KEYS.TOKENS);
      const userData = this.getStorageItem(this.STORAGE_KEYS.USER);
      const sessionData = this.getStorageItem(this.STORAGE_KEYS.SESSION);

      if (tokensData && userData) {
        const tokens = JSON.parse(tokensData);
        const user = JSON.parse(userData);
        const session = sessionData ? JSON.parse(sessionData) : null;

        // Check if tokens are still valid
        if (tokens.expiresAt > Date.now()) {
          this.setState({
            user,
            tokens,
            session,
            isAuthenticated: true,
            error: null
          });

          // Set up token refresh
          this.scheduleTokenRefresh(tokens.expiresAt);
          this.startSessionTimer();
          
          // Verify session with server
          await this.verifySession();
        } else if (tokens.refreshToken) {
          // Try to refresh expired access token
          await this.refreshAccessToken();
        } else {
          // Clear invalid tokens
          await this.logout();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      errorRecoverySystem.handleError(error as Error, {
        id: 'auth-init-error',
        timestamp: Date.now(),
        sessionId: this.deviceId,
        url: window.location.href,
        userAgent: navigator.userAgent,
        component: 'AuthenticationSystem',
        action: 'initialize'
      });
      await this.logout();
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private setupActivityTracking(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const updateActivity = () => {
      this.setState({ lastActivity: Date.now() });
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check for inactivity every minute
    setInterval(() => {
      const inactiveTime = Date.now() - this.state.lastActivity;
      if (inactiveTime > this.state.sessionTimeout) {
        this.handleSessionTimeout();
      }
    }, 60000);
  }

  private setupStorageListener(): void {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEYS.TOKENS && event.newValue === null) {
        // Logout in other tab detected
        this.handleLogoutFromOtherTab();
      }
    });
  }

  private async handleSessionTimeout(): Promise<void> {
    console.log('Session timeout detected');
    this.emitEvent({
      type: 'session-expired',
      timestamp: Date.now(),
      metadata: { reason: 'inactivity' }
    });
    await this.logout();
  }

  private async handleLogoutFromOtherTab(): Promise<void> {
    console.log('Logout from other tab detected');
    this.setState({
      user: null,
      tokens: null,
      session: null,
      isAuthenticated: false,
      error: null
    });
    this.clearTimers();
  }

  private setState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('Auth listener error:', error);
      }
    });
  }

  private emitEvent(event: AuthEventDetail): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Auth event listener error:', error);
      }
    });
  }

  private getStorageItem(key: string): string | null {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private setStorageItem(key: string, value: string, persistent = true): void {
    try {
      if (persistent && typeof Storage !== 'undefined') {
        localStorage.setItem(key, value);
      } else if (typeof Storage !== 'undefined') {
        sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`Failed to store ${key}:`, error);
    }
  }

  private removeStorageItem(key: string): void {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove ${key}:`, error);
    }
  }

  private scheduleTokenRefresh(expiresAt: number): void {
    this.clearRefreshTimer();
    
    const refreshTime = expiresAt - Date.now() - 5 * 60 * 1000; // 5 minutes before expiry
    
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(async () => {
        await this.refreshAccessToken();
      }, refreshTime);
    } else {
      // Token already expired or expiring soon, refresh immediately
      setTimeout(async () => {
        await this.refreshAccessToken();
      }, 1000);
    }
  }

  private startSessionTimer(): void {
    this.clearSessionTimer();
    this.sessionTimer = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.state.sessionTimeout);
  }

  private clearTimers(): void {
    this.clearRefreshTimer();
    this.clearSessionTimer();
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  // Public API methods
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': this.deviceId
        },
        body: JSON.stringify({
          ...credentials,
          deviceInfo: {
            id: this.deviceId,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const { user, tokens, session } = data;

      // Store auth data
      this.setStorageItem(this.STORAGE_KEYS.TOKENS, JSON.stringify(tokens), credentials.rememberMe);
      this.setStorageItem(this.STORAGE_KEYS.USER, JSON.stringify(user), credentials.rememberMe);
      this.setStorageItem(this.STORAGE_KEYS.SESSION, JSON.stringify(session), credentials.rememberMe);

      this.setState({
        user,
        tokens,
        session,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      this.scheduleTokenRefresh(tokens.expiresAt);
      this.startSessionTimer();

      this.emitEvent({
        type: 'login',
        user,
        timestamp: Date.now()
      });

      return user;
    } catch (error) {
      this.setState({
        isLoading: false,
        error: (error as Error).message
      });
      
      errorRecoverySystem.handleError(error as Error, {
        id: 'auth-login-error',
        timestamp: Date.now(),
        sessionId: this.deviceId,
        url: window.location.href,
        userAgent: navigator.userAgent,
        component: 'AuthenticationSystem',
        action: 'login'
      });
      
      throw error;
    }
  }

  async register(data: RegistrationData): Promise<UserProfile> {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': this.deviceId
        },
        body: JSON.stringify({
          ...data,
          deviceInfo: {
            id: this.deviceId,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      const { user, tokens, session } = result;

      // Store auth data
      this.setStorageItem(this.STORAGE_KEYS.TOKENS, JSON.stringify(tokens), true);
      this.setStorageItem(this.STORAGE_KEYS.USER, JSON.stringify(user), true);
      this.setStorageItem(this.STORAGE_KEYS.SESSION, JSON.stringify(session), true);

      this.setState({
        user,
        tokens,
        session,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      this.scheduleTokenRefresh(tokens.expiresAt);
      this.startSessionTimer();

      this.emitEvent({
        type: 'login',
        user,
        timestamp: Date.now(),
        metadata: { source: 'registration' }
      });

      return user;
    } catch (error) {
      this.setState({
        isLoading: false,
        error: (error as Error).message
      });
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const tokens = this.state.tokens;
      
      // Call logout endpoint if we have valid tokens
      if (tokens) {
        try {
          await fetch(`${this.apiBaseUrl}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `${tokens.tokenType} ${tokens.accessToken}`,
              'X-Device-ID': this.deviceId
            }
          });
        } catch (error) {
          console.warn('Logout API call failed:', error);
        }
      }

      // Clear all auth data
      Object.values(this.STORAGE_KEYS).forEach(key => {
        this.removeStorageItem(key);
      });

      this.clearTimers();

      this.setState({
        user: null,
        tokens: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });

      this.emitEvent({
        type: 'logout',
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    try {
      const tokens = this.state.tokens;
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': this.deviceId
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newTokens = data.tokens;

      // Update stored tokens
      const persistent = !!this.getStorageItem(this.STORAGE_KEYS.TOKENS);
      this.setStorageItem(this.STORAGE_KEYS.TOKENS, JSON.stringify(newTokens), persistent);

      this.setState({ tokens: newTokens });
      this.scheduleTokenRefresh(newTokens.expiresAt);

      this.emitEvent({
        type: 'refresh',
        timestamp: Date.now()
      });

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.logout();
      return false;
    }
  }

  async verifySession(): Promise<boolean> {
    try {
      const tokens = this.state.tokens;
      if (!tokens) return false;

      const response = await fetch(`${this.apiBaseUrl}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `${tokens.tokenType} ${tokens.accessToken}`,
          'X-Device-ID': this.deviceId
        }
      });

      if (!response.ok) {
        throw new Error('Session verification failed');
      }

      const data = await response.json();
      if (data.user) {
        // Update user data if server returned updated info
        this.setStorageItem(this.STORAGE_KEYS.USER, JSON.stringify(data.user), true);
        this.setState({ user: data.user });
      }

      return true;
    } catch (error) {
      console.error('Session verification failed:', error);
      await this.logout();
      return false;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const tokens = this.state.tokens;
      if (!tokens) throw new Error('Not authenticated');

      const response = await fetch(`${this.apiBaseUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${tokens.tokenType} ${tokens.accessToken}`,
          'X-Device-ID': this.deviceId
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      this.emitEvent({
        type: 'password-changed',
        timestamp: Date.now(),
        user: this.state.user || undefined
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/reset-password/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          newPassword
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const tokens = this.state.tokens;
      if (!tokens) throw new Error('Not authenticated');

      const response = await fetch(`${this.apiBaseUrl}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${tokens.tokenType} ${tokens.accessToken}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const updatedUser = await response.json();
      
      // Update stored user data
      this.setStorageItem(this.STORAGE_KEYS.USER, JSON.stringify(updatedUser), true);
      this.setState({ user: updatedUser });

      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Event management
  addStateListener(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  addEventListener(listener: (event: AuthEventDetail) => void): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  // Getters
  getState(): AuthState {
    return { ...this.state };
  }

  getUser(): UserProfile | null {
    return this.state.user;
  }

  getTokens(): AuthTokens | null {
    return this.state.tokens;
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  isLoading(): boolean {
    return this.state.isLoading;
  }

  getError(): string | null {
    return this.state.error;
  }

  hasPermission(permission: string): boolean {
    return this.state.user?.permissions.includes(permission) ?? false;
  }

  hasRole(role: string | string[]): boolean {
    if (!this.state.user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(this.state.user.role);
  }

  // Utility methods
  getAuthHeader(): string | null {
    const tokens = this.state.tokens;
    return tokens ? `${tokens.tokenType} ${tokens.accessToken}` : null;
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const authHeader = this.getAuthHeader();
    if (!authHeader) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': authHeader,
        'X-Device-ID': this.deviceId
      }
    });

    // Handle token refresh on 401
    if (response.status === 401) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry with new token
        const newAuthHeader = this.getAuthHeader();
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': newAuthHeader!,
            'X-Device-ID': this.deviceId
          }
        });
      }
    }

    return response;
  }

  // Development/debugging methods
  exportAuthState(): any {
    return {
      state: this.state,
      deviceId: this.deviceId,
      storageContents: {
        tokens: this.getStorageItem(this.STORAGE_KEYS.TOKENS),
        user: this.getStorageItem(this.STORAGE_KEYS.USER),
        session: this.getStorageItem(this.STORAGE_KEYS.SESSION)
      },
      timestamp: Date.now()
    };
  }

  clearAuthData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      this.removeStorageItem(key);
    });
    this.setState({
      user: null,
      tokens: null,
      session: null,
      isAuthenticated: false,
      error: null
    });
    console.log('Auth data cleared');
  }
}

// Global instance
export const authSystem = AuthenticationSystem.getInstance();