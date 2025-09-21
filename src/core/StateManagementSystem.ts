/**
 * Advanced State Management System
 * Redux Toolkit with persistence, middleware, and advanced state handling
 */

import { errorRecoverySystem } from './ErrorRecoverySystem';

// State interfaces
export interface AppState {
  auth: AuthStateSlice;
  ui: UIStateSlice;
  data: DataStateSlice;
  cache: CacheStateSlice;
  settings: SettingsStateSlice;
  navigation: NavigationStateSlice;
  notifications: NotificationsStateSlice;
}

export interface AuthStateSlice {
  isAuthenticated: boolean;
  user: any | null;
  tokens: any | null;
  loading: boolean;
  error: string | null;
  sessionExpiry: number | null;
}

export interface UIStateSlice {
  theme: 'light' | 'dark' | 'auto';
  language: 'vi' | 'en';
  sidebarCollapsed: boolean;
  modals: Record<string, boolean>;
  loading: Record<string, boolean>;
  errors: Record<string, string>;
  notifications: UINotification[];
  currentPage: string;
  breadcrumbs: Breadcrumb[];
}

export interface DataStateSlice {
  customers: EntityState<any>;
  properties: EntityState<any>;
  projects: EntityState<any>;
  interactions: EntityState<any>;
  reports: EntityState<any>;
  analytics: AnalyticsData;
  lastUpdated: Record<string, number>;
  syncStatus: Record<string, 'idle' | 'syncing' | 'error'>;
}

export interface CacheStateSlice {
  queries: Record<string, CachedQuery>;
  invalidationRules: InvalidationRule[];
  totalSize: number;
  maxSize: number;
  lastCleanup: number;
}

export interface SettingsStateSlice {
  preferences: UserPreferences;
  appConfig: AppConfig;
  featureFlags: Record<string, boolean>;
  experiments: Record<string, any>;
}

export interface NavigationStateSlice {
  currentRoute: string;
  previousRoute: string;
  params: Record<string, any>;
  query: Record<string, any>;
  history: NavigationEntry[];
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface NotificationsStateSlice {
  items: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  subscriptions: NotificationSubscription[];
}

// Supporting interfaces
export interface EntityState<T> {
  ids: string[];
  entities: Record<string, T>;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  hasMore: boolean;
  totalCount?: number;
}

export interface UINotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  persistent?: boolean;
  actions?: NotificationAction[];
  createdAt: number;
  expiresAt?: number;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface Breadcrumb {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export interface CachedQuery {
  id: string;
  data: any;
  timestamp: number;
  expiresAt: number;
  size: number;
  tags: string[];
  dependencies: string[];
}

export interface InvalidationRule {
  id: string;
  pattern: string | RegExp;
  triggers: string[];
  maxAge?: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'vi' | 'en';
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  notifications: NotificationPreferences;
  layout: LayoutPreferences;
}

export interface AppConfig {
  apiUrl: string;
  apiVersion: string;
  environment: 'development' | 'staging' | 'production';
  features: FeatureConfig;
  limits: AppLimits;
  integrations: IntegrationConfig;
}

export interface NavigationEntry {
  path: string;
  timestamp: number;
  title?: string;
  state?: any;
}

export interface Notification {
  id: string;
  type: 'system' | 'user' | 'marketing';
  title: string;
  content: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  expiresAt?: string;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

export interface NotificationSettings {
  enabled: boolean;
  types: Record<string, boolean>;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  delivery: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface NotificationSubscription {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  active: boolean;
  createdAt: string;
}

// Action types
export type StateAction = 
  | { type: 'AUTH_SET_USER'; payload: any }
  | { type: 'AUTH_SET_LOADING'; payload: boolean }
  | { type: 'AUTH_SET_ERROR'; payload: string | null }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UI_SET_THEME'; payload: 'light' | 'dark' | 'auto' }
  | { type: 'UI_SET_LANGUAGE'; payload: 'vi' | 'en' }
  | { type: 'UI_TOGGLE_SIDEBAR' }
  | { type: 'UI_SET_MODAL'; payload: { id: string; open: boolean } }
  | { type: 'UI_SET_LOADING'; payload: { key: string; loading: boolean } }
  | { type: 'UI_SET_ERROR'; payload: { key: string; error: string | null } }
  | { type: 'UI_ADD_NOTIFICATION'; payload: UINotification }
  | { type: 'UI_REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UI_SET_PAGE'; payload: string }
  | { type: 'UI_SET_BREADCRUMBS'; payload: Breadcrumb[] }
  | { type: 'DATA_SET_ENTITIES'; payload: { key: keyof DataStateSlice; data: EntityState<any> } }
  | { type: 'DATA_ADD_ENTITY'; payload: { key: keyof DataStateSlice; entity: any } }
  | { type: 'DATA_UPDATE_ENTITY'; payload: { key: keyof DataStateSlice; id: string; updates: any } }
  | { type: 'DATA_REMOVE_ENTITY'; payload: { key: keyof DataStateSlice; id: string } }
  | { type: 'DATA_SET_LOADING'; payload: { key: keyof DataStateSlice; loading: boolean } }
  | { type: 'DATA_SET_ERROR'; payload: { key: keyof DataStateSlice; error: string | null } }
  | { type: 'CACHE_SET_QUERY'; payload: CachedQuery }
  | { type: 'CACHE_INVALIDATE_QUERY'; payload: string }
  | { type: 'CACHE_INVALIDATE_PATTERN'; payload: string | RegExp }
  | { type: 'CACHE_CLEANUP' }
  | { type: 'SETTINGS_UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SETTINGS_UPDATE_CONFIG'; payload: Partial<AppConfig> }
  | { type: 'SETTINGS_SET_FEATURE_FLAG'; payload: { key: string; value: boolean } }
  | { type: 'NAVIGATION_SET_ROUTE'; payload: { route: string; params?: any; query?: any } }
  | { type: 'NAVIGATION_GO_BACK' }
  | { type: 'NAVIGATION_GO_FORWARD' }
  | { type: 'NOTIFICATIONS_ADD'; payload: Notification }
  | { type: 'NOTIFICATIONS_MARK_READ'; payload: string }
  | { type: 'NOTIFICATIONS_REMOVE'; payload: string }
  | { type: 'NOTIFICATIONS_UPDATE_SETTINGS'; payload: Partial<NotificationSettings> }
  | { type: 'NOTIFICATIONS_ADD_SUBSCRIPTION'; payload: NotificationSubscription }
  | { type: 'STATE_REHYDRATE'; payload: Partial<AppState> }
  | { type: 'STATE_RESET' }
  | { type: 'STATE_BATCH'; payload: StateAction[] };

export interface StateMiddleware {
  name: string;
  before?: (action: StateAction, state: AppState) => StateAction | null;
  after?: (action: StateAction, prevState: AppState, nextState: AppState) => void;
  error?: (error: Error, action: StateAction, state: AppState) => void;
}

export interface StatePersistenceConfig {
  key: string;
  storage: 'localStorage' | 'sessionStorage' | 'indexedDB';
  whitelist?: (keyof AppState)[];
  blacklist?: (keyof AppState)[];
  transforms?: Record<string, {
    serialize: (value: any) => any;
    deserialize: (value: any) => any;
  }>;
  debounceMs?: number;
  maxSize?: number;
}

export class StateManagementSystem {
  private static instance: StateManagementSystem;
  private state: AppState;
  private listeners: Set<(state: AppState) => void> = new Set();
  private middlewares: StateMiddleware[] = [];
  private persistenceConfig: StatePersistenceConfig | null = null;
  private persistenceTimer: NodeJS.Timeout | null = null;
  private actionHistory: { action: StateAction; timestamp: number }[] = [];
  private maxHistorySize = 1000;
  private devMode = process.env.NODE_ENV === 'development';

  static getInstance(): StateManagementSystem {
    if (!StateManagementSystem.instance) {
      StateManagementSystem.instance = new StateManagementSystem();
    }
    return StateManagementSystem.instance;
  }

  private constructor() {
    this.state = this.createInitialState();
    this.setupDefaultMiddlewares();
    this.setupStorageListener();
  }

  private createInitialState(): AppState {
    return {
      auth: {
        isAuthenticated: false,
        user: null,
        tokens: null,
        loading: false,
        error: null,
        sessionExpiry: null
      },
      ui: {
        theme: 'light',
        language: 'vi',
        sidebarCollapsed: false,
        modals: {},
        loading: {},
        errors: {},
        notifications: [],
        currentPage: '/',
        breadcrumbs: []
      },
      data: {
        customers: this.createEntityState(),
        properties: this.createEntityState(),
        projects: this.createEntityState(),
        interactions: this.createEntityState(),
        reports: this.createEntityState(),
        analytics: {
          metrics: {},
          charts: {},
          filters: {},
          dateRange: { start: '', end: '' },
          lastUpdated: 0
        },
        lastUpdated: {},
        syncStatus: {}
      },
      cache: {
        queries: {},
        invalidationRules: [],
        totalSize: 0,
        maxSize: 50 * 1024 * 1024, // 50MB
        lastCleanup: Date.now()
      },
      settings: {
        preferences: {
          theme: 'light',
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh',
          dateFormat: 'dd/MM/yyyy',
          numberFormat: 'vi-VN',
          notifications: {
            push: true,
            email: true,
            sms: false,
            quietHours: {
              enabled: false,
              start: '22:00',
              end: '07:00'
            }
          },
          layout: {
            density: 'comfortable',
            sidebarWidth: 280,
            showAvatars: true
          }
        },
        appConfig: {
          apiUrl: '/api/v1',
          apiVersion: '1.0.0',
          environment: process.env.NODE_ENV as any || 'development',
          features: {
            realTimeSync: true,
            offlineMode: true,
            advancedAnalytics: true,
            aiAssistant: false
          },
          limits: {
            maxFileSize: 10 * 1024 * 1024,
            maxCustomers: 10000,
            maxProperties: 50000
          },
          integrations: {
            google: { enabled: false, apiKey: '' },
            facebook: { enabled: false, appId: '' },
            zalo: { enabled: false, appId: '' }
          }
        },
        featureFlags: {
          newDashboard: false,
          betaFeatures: false,
          debugMode: this.devMode
        },
        experiments: {}
      },
      navigation: {
        currentRoute: '/',
        previousRoute: '',
        params: {},
        query: {},
        history: [],
        canGoBack: false,
        canGoForward: false
      },
      notifications: {
        items: [],
        unreadCount: 0,
        settings: {
          enabled: true,
          types: {
            system: true,
            user: true,
            marketing: false
          },
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '07:00'
          },
          delivery: {
            push: true,
            email: true,
            sms: false
          }
        },
        subscriptions: []
      }
    };
  }

  private createEntityState<T>(): EntityState<T> {
    return {
      ids: [],
      entities: {},
      loading: false,
      error: null,
      lastFetch: null,
      hasMore: true,
      totalCount: 0
    };
  }

  private setupDefaultMiddlewares(): void {
    // Logger middleware
    this.addMiddleware({
      name: 'logger',
      before: (action, state) => {
        if (this.devMode) {
          console.group(`🔄 ${action.type}`);
          console.log('Action:', action);
          console.log('Current State:', state);
        }
        return action;
      },
      after: (action, prevState, nextState) => {
        if (this.devMode) {
          console.log('New State:', nextState);
          console.groupEnd();
        }
      },
      error: (error, action, state) => {
        console.error(`❌ Error in action ${action.type}:`, error);
      }
    });

    // Persistence middleware
    this.addMiddleware({
      name: 'persistence',
      after: (action, prevState, nextState) => {
        if (this.persistenceConfig) {
          this.schedulePersistence();
        }
      }
    });

    // Error recovery middleware
    this.addMiddleware({
      name: 'errorRecovery',
      error: (error, action, state) => {
        errorRecoverySystem.handleError(error, {
          id: `state-error-${Date.now()}`,
          timestamp: Date.now(),
          sessionId: 'state-management',
          url: window.location.href,
          userAgent: navigator.userAgent,
          component: 'StateManagementSystem',
          action: action.type,
          metadata: { action, state }
        });
      }
    });

    // Validation middleware
    this.addMiddleware({
      name: 'validation',
      before: (action, state) => {
        // Validate action structure
        if (!action.type) {
          throw new Error('Action must have a type property');
        }
        return action;
      }
    });

    // Analytics middleware
    this.addMiddleware({
      name: 'analytics',
      after: (action, prevState, nextState) => {
        // Track state changes for analytics
        if (action.type.startsWith('UI_') || action.type.startsWith('NAVIGATION_')) {
          // Track user interactions
          this.trackEvent('state_change', {
            action: action.type,
            timestamp: Date.now()
          });
        }
      }
    });
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.persistenceConfig?.key) {
        // Handle external state changes
        this.handleExternalStateChange(event.newValue);
      }
    });
  }

  private handleExternalStateChange(newValue: string | null): void {
    if (newValue) {
      try {
        const externalState = JSON.parse(newValue);
        this.dispatch({ type: 'STATE_REHYDRATE', payload: externalState });
      } catch (error) {
        console.error('Failed to parse external state:', error);
      }
    }
  }

  private schedulePersistence(): void {
    if (this.persistenceTimer) {
      clearTimeout(this.persistenceTimer);
    }

    const debounceMs = this.persistenceConfig?.debounceMs || 1000;
    this.persistenceTimer = setTimeout(() => {
      this.persistState();
    }, debounceMs);
  }

  private async persistState(): Promise<void> {
    if (!this.persistenceConfig) return;

    try {
      const { key, storage, whitelist, blacklist, transforms, maxSize } = this.persistenceConfig;
      
      let stateToPersist: any = { ...this.state };

      // Apply whitelist/blacklist
      if (whitelist) {
        const filteredState: any = {};
        whitelist.forEach(key => {
          if (key in this.state) {
            filteredState[key] = this.state[key];
          }
        });
        stateToPersist = filteredState;
      } else if (blacklist) {
        blacklist.forEach(key => {
          delete stateToPersist[key];
        });
      }

      // Apply transforms
      if (transforms) {
        Object.entries(transforms).forEach(([key, transform]) => {
          if (key in stateToPersist) {
            stateToPersist[key] = transform.serialize(stateToPersist[key]);
          }
        });
      }

      const serialized = JSON.stringify(stateToPersist);
      
      // Check size limit
      if (maxSize && serialized.length > maxSize) {
        console.warn('State size exceeds maximum, skipping persistence');
        return;
      }

      // Store based on storage type
      switch (storage) {
        case 'localStorage':
          localStorage.setItem(key, serialized);
          break;
        case 'sessionStorage':
          sessionStorage.setItem(key, serialized);
          break;
        case 'indexedDB':
          await this.storeInIndexedDB(key, stateToPersist);
          break;
      }

      if (this.devMode) {
        console.log('💾 State persisted:', stateToPersist);
      }
    } catch (error) {
      console.error('State persistence failed:', error);
    }
  }

  private async storeInIndexedDB(key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('StateDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['state'], 'readwrite');
        const store = transaction.objectStore('state');
        const putRequest = store.put({ id: key, data, timestamp: Date.now() });
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('state')) {
          db.createObjectStore('state', { keyPath: 'id' });
        }
      };
    });
  }

  private async loadPersistedState(): Promise<Partial<AppState> | null> {
    if (!this.persistenceConfig) return null;

    try {
      const { key, storage, transforms } = this.persistenceConfig;
      let serialized: string | null = null;

      switch (storage) {
        case 'localStorage':
          serialized = localStorage.getItem(key);
          break;
        case 'sessionStorage':
          serialized = sessionStorage.getItem(key);
          break;
        case 'indexedDB':
          const data = await this.loadFromIndexedDB(key);
          return data;
      }

      if (!serialized) return null;

      let state = JSON.parse(serialized);

      // Apply reverse transforms
      if (transforms) {
        Object.entries(transforms).forEach(([key, transform]) => {
          if (key in state) {
            state[key] = transform.deserialize(state[key]);
          }
        });
      }

      return state;
    } catch (error) {
      console.error('Failed to load persisted state:', error);
      return null;
    }
  }

  private async loadFromIndexedDB(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('StateDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['state'], 'readonly');
        const store = transaction.objectStore('state');
        const getRequest = store.get(key);
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          resolve(result ? result.data : null);
        };
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }

  private trackEvent(event: string, data: any): void {
    // Implementation would integrate with analytics service
    if (this.devMode) {
      console.log('📊 Analytics event:', event, data);
    }
  }

  // Public API
  dispatch(action: StateAction): void {
    try {
      // Add to history
      this.actionHistory.push({ action, timestamp: Date.now() });
      if (this.actionHistory.length > this.maxHistorySize) {
        this.actionHistory.shift();
      }

      // Run before middlewares
      let processedAction = action;
      for (const middleware of this.middlewares) {
        if (middleware.before) {
          const result = middleware.before(processedAction, this.state);
          if (result === null) {
            // Middleware cancelled the action
            return;
          }
          processedAction = result;
        }
      }

      // Handle batch actions
      if (processedAction.type === 'STATE_BATCH') {
        processedAction.payload.forEach(batchAction => {
          this.dispatch(batchAction);
        });
        return;
      }

      const prevState = this.state;
      const nextState = this.reducer(this.state, processedAction);
      this.state = nextState;

      // Run after middlewares
      for (const middleware of this.middlewares) {
        if (middleware.after) {
          middleware.after(processedAction, prevState, nextState);
        }
      }

      // Notify listeners
      this.notifyListeners();
    } catch (error) {
      // Run error middlewares
      for (const middleware of this.middlewares) {
        if (middleware.error) {
          middleware.error(error as Error, action, this.state);
        }
      }
      
      console.error('State dispatch error:', error);
      throw error;
    }
  }

  private reducer(state: AppState, action: StateAction): AppState {
    switch (action.type) {
      // Auth actions
      case 'AUTH_SET_USER':
        return {
          ...state,
          auth: { ...state.auth, user: action.payload, isAuthenticated: !!action.payload }
        };
      
      case 'AUTH_SET_LOADING':
        return {
          ...state,
          auth: { ...state.auth, loading: action.payload }
        };
      
      case 'AUTH_SET_ERROR':
        return {
          ...state,
          auth: { ...state.auth, error: action.payload }
        };
      
      case 'AUTH_LOGOUT':
        return {
          ...state,
          auth: {
            isAuthenticated: false,
            user: null,
            tokens: null,
            loading: false,
            error: null,
            sessionExpiry: null
          }
        };

      // UI actions
      case 'UI_SET_THEME':
        return {
          ...state,
          ui: { ...state.ui, theme: action.payload }
        };

      case 'UI_SET_LANGUAGE':
        return {
          ...state,
          ui: { ...state.ui, language: action.payload }
        };

      case 'UI_TOGGLE_SIDEBAR':
        return {
          ...state,
          ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed }
        };

      case 'UI_SET_MODAL':
        return {
          ...state,
          ui: {
            ...state.ui,
            modals: { ...state.ui.modals, [action.payload.id]: action.payload.open }
          }
        };

      case 'UI_SET_LOADING':
        return {
          ...state,
          ui: {
            ...state.ui,
            loading: { ...state.ui.loading, [action.payload.key]: action.payload.loading }
          }
        };

      case 'UI_SET_ERROR':
        return {
          ...state,
          ui: {
            ...state.ui,
            errors: { ...state.ui.errors, [action.payload.key]: action.payload.error }
          }
        };

      case 'UI_ADD_NOTIFICATION':
        return {
          ...state,
          ui: {
            ...state.ui,
            notifications: [...state.ui.notifications, action.payload]
          }
        };

      case 'UI_REMOVE_NOTIFICATION':
        return {
          ...state,
          ui: {
            ...state.ui,
            notifications: state.ui.notifications.filter(n => n.id !== action.payload)
          }
        };

      case 'UI_SET_PAGE':
        return {
          ...state,
          ui: { ...state.ui, currentPage: action.payload }
        };

      case 'UI_SET_BREADCRUMBS':
        return {
          ...state,
          ui: { ...state.ui, breadcrumbs: action.payload }
        };

      // Data actions
      case 'DATA_SET_ENTITIES':
        return {
          ...state,
          data: {
            ...state.data,
            [action.payload.key]: action.payload.data,
            lastUpdated: {
              ...state.data.lastUpdated,
              [action.payload.key]: Date.now()
            }
          }
        };

      case 'DATA_ADD_ENTITY':
        const currentEntities = state.data[action.payload.key] as EntityState<any>;
        return {
          ...state,
          data: {
            ...state.data,
            [action.payload.key]: {
              ...currentEntities,
              ids: [...currentEntities.ids, action.payload.entity.id],
              entities: {
                ...currentEntities.entities,
                [action.payload.entity.id]: action.payload.entity
              }
            }
          }
        };

      case 'DATA_UPDATE_ENTITY':
        const entityState = state.data[action.payload.key] as EntityState<any>;
        return {
          ...state,
          data: {
            ...state.data,
            [action.payload.key]: {
              ...entityState,
              entities: {
                ...entityState.entities,
                [action.payload.id]: {
                  ...entityState.entities[action.payload.id],
                  ...action.payload.updates
                }
              }
            }
          }
        };

      case 'DATA_REMOVE_ENTITY':
        const dataState = state.data[action.payload.key] as EntityState<any>;
        const { [action.payload.id]: removed, ...remainingEntities } = dataState.entities;
        return {
          ...state,
          data: {
            ...state.data,
            [action.payload.key]: {
              ...dataState,
              ids: dataState.ids.filter(id => id !== action.payload.id),
              entities: remainingEntities
            }
          }
        };

      // Cache actions
      case 'CACHE_SET_QUERY':
        return {
          ...state,
          cache: {
            ...state.cache,
            queries: {
              ...state.cache.queries,
              [action.payload.id]: action.payload
            },
            totalSize: state.cache.totalSize + action.payload.size
          }
        };

      case 'CACHE_INVALIDATE_QUERY':
        const { [action.payload]: invalidated, ...remainingQueries } = state.cache.queries;
        return {
          ...state,
          cache: {
            ...state.cache,
            queries: remainingQueries,
            totalSize: state.cache.totalSize - (invalidated?.size || 0)
          }
        };

      // Settings actions
      case 'SETTINGS_UPDATE_PREFERENCES':
        return {
          ...state,
          settings: {
            ...state.settings,
            preferences: { ...state.settings.preferences, ...action.payload }
          }
        };

      case 'SETTINGS_SET_FEATURE_FLAG':
        return {
          ...state,
          settings: {
            ...state.settings,
            featureFlags: {
              ...state.settings.featureFlags,
              [action.payload.key]: action.payload.value
            }
          }
        };

      // Navigation actions
      case 'NAVIGATION_SET_ROUTE':
        return {
          ...state,
          navigation: {
            ...state.navigation,
            previousRoute: state.navigation.currentRoute,
            currentRoute: action.payload.route,
            params: action.payload.params || {},
            query: action.payload.query || {},
            history: [
              ...state.navigation.history,
              {
                path: action.payload.route,
                timestamp: Date.now(),
                state: action.payload
              }
            ].slice(-50) // Keep only last 50 entries
          }
        };

      // System actions
      case 'STATE_REHYDRATE':
        return { ...state, ...action.payload };

      case 'STATE_RESET':
        return this.createInitialState();

      default:
        return state;
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('State listener error:', error);
      }
    });
  }

  // Subscription management
  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Middleware management
  addMiddleware(middleware: StateMiddleware): void {
    this.middlewares.push(middleware);
    console.log(`Added middleware: ${middleware.name}`);
  }

  removeMiddleware(name: string): boolean {
    const index = this.middlewares.findIndex(m => m.name === name);
    if (index >= 0) {
      this.middlewares.splice(index, 1);
      console.log(`Removed middleware: ${name}`);
      return true;
    }
    return false;
  }

  // Persistence configuration
  configurePersistence(config: StatePersistenceConfig): void {
    this.persistenceConfig = config;
    console.log('Persistence configured:', config);
  }

  async rehydrate(): Promise<void> {
    const persistedState = await this.loadPersistedState();
    if (persistedState) {
      this.dispatch({ type: 'STATE_REHYDRATE', payload: persistedState });
      console.log('State rehydrated from storage');
    }
  }

  // State access
  getState(): AppState {
    return { ...this.state };
  }

  getSlice<K extends keyof AppState>(key: K): AppState[K] {
    return this.state[key];
  }

  // Utility methods
  batch(actions: StateAction[]): void {
    this.dispatch({ type: 'STATE_BATCH', payload: actions });
  }

  reset(): void {
    this.dispatch({ type: 'STATE_RESET' });
  }

  // Development tools
  getActionHistory(): { action: StateAction; timestamp: number }[] {
    return [...this.actionHistory];
  }

  exportState(): any {
    return {
      state: this.state,
      actionHistory: this.actionHistory,
      middlewares: this.middlewares.map(m => m.name),
      persistenceConfig: this.persistenceConfig,
      timestamp: Date.now()
    };
  }

  // Time travel debugging (development only)
  replayActions(actions: StateAction[]): void {
    if (!this.devMode) {
      console.warn('Replay actions only available in development mode');
      return;
    }

    const initialState = this.createInitialState();
    this.state = initialState;

    actions.forEach(action => {
      this.dispatch(action);
    });

    console.log('Actions replayed');
  }
}

// Supporting interfaces for better typing
export interface AnalyticsData {
  metrics: Record<string, any>;
  charts: Record<string, any>;
  filters: Record<string, any>;
  dateRange: { start: string; end: string };
  lastUpdated: number;
}

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  sms: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface LayoutPreferences {
  density: 'compact' | 'comfortable' | 'spacious';
  sidebarWidth: number;
  showAvatars: boolean;
}

export interface FeatureConfig {
  realTimeSync: boolean;
  offlineMode: boolean;
  advancedAnalytics: boolean;
  aiAssistant: boolean;
}

export interface AppLimits {
  maxFileSize: number;
  maxCustomers: number;
  maxProperties: number;
}

export interface IntegrationConfig {
  google: { enabled: boolean; apiKey: string };
  facebook: { enabled: boolean; appId: string };
  zalo: { enabled: boolean; appId: string };
}

// Global instance
export const stateManager = StateManagementSystem.getInstance();