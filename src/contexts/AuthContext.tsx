import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if localStorage is available
        if (typeof window === 'undefined' || !window.localStorage) {
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }

        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('auth_user');
        
        if (token && userData) {
          const user: User = JSON.parse(userData);
          
          // Validate token (in a real app, you'd verify with backend)
          const tokenValid = await validateToken(token);
          
          if (tokenValid) {
            setAuthState({
              user,
              token,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            // Token expired, clear storage
            try {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
            } catch (e) {
              console.warn('Could not clear auth data:', e);
            }
            setAuthState(prev => ({ ...prev, loading: false }));
          }
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // In a real app, this would be an API call
      const response = await mockLogin(email, password);
      
      const { user, token, refreshToken } = response;
      
      // Store in localStorage if remember is true, otherwise sessionStorage
      if (remember) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }
      } else {
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('auth_user', JSON.stringify(user));
      }
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // In a real app, this would be an API call
      const response = await mockRegister(data);
      
      const { user, token } = response;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    
    // Redirect to login
    window.location.href = '/salebds/login';
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!authState.user) throw new Error('No authenticated user');
      
      // In a real app, this would be an API call
      const updatedUser = { ...authState.user, ...data };
      
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }
      
      // In a real app, this would be an API call
      const response = await mockRefreshToken(refreshTokenValue);
      
      const { token, user } = response;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      setAuthState(prev => ({
        ...prev,
        token,
        user,
      }));
    } catch (error) {
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        updateProfile,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Mock API functions (replace with real API calls)
const mockLogin = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email === 'demo@salebds.com' && password === 'demo123') {
    const user: User = {
      id: '1',
      email: 'demo@salebds.com',
      fullName: 'Demo User',
      avatar: undefined,
      phone: '0901234567',
      role: 'sales',
      team: 'Team Alpha',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      isActive: true,
    };
    
    return {
      user,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 3600,
    };
  } else {
    throw new Error('Email hoặc mật khẩu không chính xác');
  }
};

const mockRegister = async (data: RegisterData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (data.email === 'existing@salebds.com') {
    throw new Error('Email đã được sử dụng');
  }
  
  const user: User = {
    id: Date.now().toString(),
    email: data.email,
    fullName: data.fullName,
    phone: data.phone,
    role: 'sales',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  };
  
  return {
    user,
    token: 'mock-jwt-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
  };
};

const mockRefreshToken = async (refreshToken: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock refresh logic
  if (!refreshToken.startsWith('mock-refresh-token')) {
    throw new Error('Invalid refresh token');
  }
  
  const userData = localStorage.getItem('auth_user');
  if (!userData) {
    throw new Error('No user data found');
  }
  
  const user: User = JSON.parse(userData);
  
  return {
    token: 'mock-jwt-token-' + Date.now(),
    user,
  };
};

const validateToken = async (token: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock validation - in real app, verify with backend
  return token.startsWith('mock-jwt-token');
};

export default AuthContext;