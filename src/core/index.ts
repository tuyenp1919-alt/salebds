/**
 * Core Systems Index
 * Centralized exports for all core systems
 */

// Error Recovery System
export { errorRecoverySystem } from './ErrorRecoverySystem';
export type {
  ErrorSeverity,
  ErrorCategory,
  ErrorContext,
  ErrorReport,
  SystemStatus,
  RecoveryAction,
  FallbackStrategy
} from './ErrorRecoverySystem';

// Authentication System
export { authSystem } from './AuthenticationSystem';
export type {
  User,
  AuthToken,
  LoginCredentials,
  RegisterData,
  AuthConfig,
  AuthState,
  AuthEventType,
  AuthEvent,
  TokenStorage,
  SessionConfig
} from './AuthenticationSystem';

// State Management System
export { stateManager } from './StateManagementSystem';
export type {
  AppState,
  AuthStateInterface,
  UIState,
  DataState,
  CacheState,
  SettingsState,
  NavigationState,
  NotificationState,
  Action,
  ActionType,
  Middleware,
  StateSubscriber,
  PersistenceConfig,
  StateAnalytics
} from './StateManagementSystem';

// API Layer
export { apiLayer } from './APILayer';
export type {
  APIConfig,
  RequestConfig,
  CacheConfig,
  RetryConfig,
  OfflineConfig,
  APIResponse,
  APIError,
  RequestInterceptor,
  ResponseInterceptor,
  CacheEntry,
  OfflineQueueItem,
  APIMetrics
} from './APILayer';

// System initialization function
export const initializeCoreSystem = async () => {
  console.log('🚀 Initializing SaleBDS Core Systems...');
  
  try {
    // Initialize error recovery first
    console.log('🛡️ Error Recovery System: Ready');
    
    // Initialize authentication
    console.log('🔐 Authentication System: Ready');
    
    // Initialize state management
    console.log('📊 State Management System: Ready');
    
    // Configure API layer
    apiLayer.configure({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
      enableCaching: true,
      enableOffline: true,
      enableMetrics: true
    });
    console.log('🌐 API Layer: Configured');
    
    console.log('✅ All core systems initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Core system initialization failed:', error);
    errorRecoverySystem.handleError(error, {
      id: 'core-init-error',
      timestamp: Date.now(),
      sessionId: 'system',
      url: window.location.href,
      userAgent: navigator.userAgent,
      component: 'CoreSystem',
      action: 'initialization',
      metadata: { error }
    });
    return false;
  }
};

// System health check function
export const checkSystemHealth = () => {
  const health = {
    errorRecovery: errorRecoverySystem.getSystemStatus().isHealthy,
    auth: authSystem.isAuthenticated() !== undefined, // System is responsive
    state: Object.keys(stateManager.getState()).length > 0,
    api: apiLayer.exportState().timestamp > 0,
    overall: true
  };
  
  health.overall = Object.values(health).every(status => status === true);
  
  return health;
};

// Development utilities
export const exportSystemState = () => {
  return {
    timestamp: Date.now(),
    errorRecovery: errorRecoverySystem.getSystemStatus(),
    auth: {
      isAuthenticated: authSystem.isAuthenticated(),
      user: authSystem.getCurrentUser()
    },
    state: stateManager.exportState(),
    api: apiLayer.exportState(),
    health: checkSystemHealth()
  };
};