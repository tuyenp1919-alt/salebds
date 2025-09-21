/**
 * Advanced Error Recovery System
 * Provides comprehensive error handling, recovery mechanisms, and automatic healing
 */

export interface ErrorContext {
  id: string;
  timestamp: number;
  component?: string;
  action?: string;
  userId?: string;
  sessionId: string;
  url: string;
  userAgent: string;
  stack?: string;
  props?: any;
  state?: any;
  metadata?: Record<string, any>;
}

export interface RecoveryStrategy {
  name: string;
  priority: number;
  canRecover: (error: Error, context: ErrorContext) => boolean;
  recover: (error: Error, context: ErrorContext) => Promise<boolean>;
  fallback?: (error: Error, context: ErrorContext) => Promise<any>;
}

export interface ErrorPattern {
  name: string;
  pattern: RegExp | ((error: Error) => boolean);
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  strategies: string[];
  metadata?: Record<string, any>;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByComponent: Record<string, number>;
  recoverySuccessRate: number;
  lastError?: ErrorContext;
  patterns: Record<string, number>;
}

export class ErrorRecoverySystem {
  private static instance: ErrorRecoverySystem;
  private strategies = new Map<string, RecoveryStrategy>();
  private patterns = new Map<string, ErrorPattern>();
  private errorHistory: ErrorContext[] = [];
  private metrics: ErrorMetrics = {
    totalErrors: 0,
    errorsByType: {},
    errorsByComponent: {},
    recoverySuccessRate: 0,
    patterns: {}
  };
  private maxHistorySize = 1000;
  private listeners: Set<(error: ErrorContext) => void> = new Set();

  static getInstance(): ErrorRecoverySystem {
    if (!ErrorRecoverySystem.instance) {
      ErrorRecoverySystem.instance = new ErrorRecoverySystem();
    }
    return ErrorRecoverySystem.instance;
  }

  private constructor() {
    this.initializeDefaultStrategies();
    this.initializeDefaultPatterns();
    this.setupGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private sessionId = this.generateSessionId();

  private initializeDefaultStrategies(): void {
    // Storage Recovery Strategy
    this.registerStrategy({
      name: 'storage-recovery',
      priority: 1,
      canRecover: (error, context) => {
        return error.message.includes('localStorage') || 
               error.message.includes('sessionStorage') || 
               error.message.includes('storage');
      },
      recover: async (error, context) => {
        try {
          // Clear storage and reinitialize
          if (typeof Storage !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
          }
          
          // Reinitialize essential storage
          const defaultState = {
            theme: 'light',
            language: 'vi',
            initialized: true
          };
          
          if (typeof Storage !== 'undefined') {
            Object.entries(defaultState).forEach(([key, value]) => {
              try {
                localStorage.setItem(key, JSON.stringify(value));
              } catch (e) {
                console.warn(`Failed to restore ${key}:`, e);
              }
            });
          }
          
          console.log('Storage recovery completed');
          return true;
        } catch (e) {
          console.error('Storage recovery failed:', e);
          return false;
        }
      }
    });

    // Component Reload Strategy
    this.registerStrategy({
      name: 'component-reload',
      priority: 2,
      canRecover: (error, context) => {
        return context.component !== undefined && 
               !error.message.includes('Maximum update depth exceeded');
      },
      recover: async (error, context) => {
        try {
          // Force component remount by clearing its cache
          if (context.component) {
            console.log(`Attempting to reload component: ${context.component}`);
            
            // Trigger a state update to force remount
            const event = new CustomEvent('force-component-reload', {
              detail: { component: context.component, errorId: context.id }
            });
            window.dispatchEvent(event);
            
            return true;
          }
          return false;
        } catch (e) {
          console.error('Component reload failed:', e);
          return false;
        }
      }
    });

    // Network Recovery Strategy
    this.registerStrategy({
      name: 'network-recovery',
      priority: 3,
      canRecover: (error, context) => {
        return error.message.includes('fetch') || 
               error.message.includes('network') || 
               error.message.includes('Failed to fetch') ||
               context.action?.includes('api-');
      },
      recover: async (error, context) => {
        try {
          // Wait for network connectivity
          if (!navigator.onLine) {
            await this.waitForNetwork();
          }
          
          // Retry the failed action if possible
          if (context.action && context.metadata?.retryFunction) {
            console.log(`Retrying action: ${context.action}`);
            await context.metadata.retryFunction();
            return true;
          }
          
          return false;
        } catch (e) {
          console.error('Network recovery failed:', e);
          return false;
        }
      }
    });

    // Authentication Recovery Strategy
    this.registerStrategy({
      name: 'auth-recovery',
      priority: 4,
      canRecover: (error, context) => {
        return error.message.includes('unauthorized') || 
               error.message.includes('403') || 
               error.message.includes('401') ||
               context.action?.includes('auth-');
      },
      recover: async (error, context) => {
        try {
          // Attempt token refresh
          const refreshToken = this.getStorageItem('refresh_token');
          if (refreshToken) {
            console.log('Attempting auth recovery with refresh token');
            
            // Trigger auth refresh
            const event = new CustomEvent('auth-refresh-required', {
              detail: { errorId: context.id }
            });
            window.dispatchEvent(event);
            
            return true;
          }
          
          // Redirect to login if no refresh token
          console.log('No refresh token available, redirecting to login');
          window.location.href = '/salebds/login';
          return true;
        } catch (e) {
          console.error('Auth recovery failed:', e);
          return false;
        }
      }
    });

    // Memory Recovery Strategy
    this.registerStrategy({
      name: 'memory-recovery',
      priority: 5,
      canRecover: (error, context) => {
        return error.message.includes('out of memory') || 
               error.message.includes('Maximum call stack') ||
               error.name === 'RangeError';
      },
      recover: async (error, context) => {
        try {
          // Force garbage collection if available
          if ('gc' in window && typeof (window as any).gc === 'function') {
            (window as any).gc();
          }
          
          // Clear unnecessary caches
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            for (const cacheName of cacheNames) {
              if (cacheName.includes('api-cache') || cacheName.includes('temp-')) {
                await caches.delete(cacheName);
              }
            }
          }
          
          // Clear query cache if available
          const event = new CustomEvent('clear-query-cache', {
            detail: { errorId: context.id }
          });
          window.dispatchEvent(event);
          
          console.log('Memory recovery completed');
          return true;
        } catch (e) {
          console.error('Memory recovery failed:', e);
          return false;
        }
      }
    });
  }

  private initializeDefaultPatterns(): void {
    // Common Error Patterns
    this.registerPattern({
      name: 'storage-error',
      pattern: /localStorage|sessionStorage|storage/i,
      severity: 'medium',
      recoverable: true,
      strategies: ['storage-recovery']
    });

    this.registerPattern({
      name: 'network-error',
      pattern: /fetch|network|Failed to fetch|ERR_NETWORK/i,
      severity: 'medium',
      recoverable: true,
      strategies: ['network-recovery']
    });

    this.registerPattern({
      name: 'auth-error',
      pattern: /unauthorized|403|401|forbidden/i,
      severity: 'high',
      recoverable: true,
      strategies: ['auth-recovery']
    });

    this.registerPattern({
      name: 'memory-error',
      pattern: /out of memory|Maximum call stack|RangeError/i,
      severity: 'critical',
      recoverable: true,
      strategies: ['memory-recovery']
    });

    this.registerPattern({
      name: 'component-error',
      pattern: /Cannot read prop|undefined is not a function|null is not an object/i,
      severity: 'medium',
      recoverable: true,
      strategies: ['component-reload']
    });

    this.registerPattern({
      name: 'critical-system-error',
      pattern: (error) => error.name === 'ChunkLoadError' || error.message.includes('Loading chunk'),
      severity: 'critical',
      recoverable: true,
      strategies: ['storage-recovery', 'component-reload'],
      metadata: { requiresReload: true }
    });
  }

  private setupGlobalErrorHandlers(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      const context = this.createErrorContext(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      this.handleError(event.error || new Error(event.message), context);
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      const context = this.createErrorContext(error, { type: 'unhandled-promise' });
      this.handleError(error, context);
      event.preventDefault();
    });

    // React error boundary events
    window.addEventListener('react-error-boundary', ((event: CustomEvent) => {
      const { error, errorInfo } = event.detail;
      const context = this.createErrorContext(error, {
        componentStack: errorInfo.componentStack,
        type: 'react-boundary'
      });
      this.handleError(error, context);
    }) as EventListener);
  }

  private createErrorContext(error: Error, additionalData: any = {}): ErrorContext {
    return {
      id: `error-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      stack: error.stack,
      ...additionalData
    };
  }

  private waitForNetwork(timeout = 30000): Promise<void> {
    return new Promise((resolve, reject) => {
      if (navigator.onLine) {
        resolve();
        return;
      }

      const timeoutId = setTimeout(() => {
        window.removeEventListener('online', onlineHandler);
        reject(new Error('Network timeout'));
      }, timeout);

      const onlineHandler = () => {
        clearTimeout(timeoutId);
        window.removeEventListener('online', onlineHandler);
        resolve();
      };

      window.addEventListener('online', onlineHandler);
    });
  }

  private getStorageItem(key: string): string | null {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  registerStrategy(strategy: RecoveryStrategy): void {
    this.strategies.set(strategy.name, strategy);
    console.log(`Registered recovery strategy: ${strategy.name}`);
  }

  registerPattern(pattern: ErrorPattern): void {
    this.patterns.set(pattern.name, pattern);
    console.log(`Registered error pattern: ${pattern.name}`);
  }

  async handleError(error: Error, context: ErrorContext): Promise<boolean> {
    console.error('Error handled by recovery system:', error, context);
    
    // Update metrics
    this.updateMetrics(error, context);
    
    // Store error in history
    this.errorHistory.push(context);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
    
    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(context);
      } catch (e) {
        console.error('Error listener failed:', e);
      }
    });
    
    // Find matching patterns
    const matchedPatterns = this.findMatchingPatterns(error);
    console.log('Matched patterns:', matchedPatterns.map(p => p.name));
    
    // Attempt recovery
    for (const pattern of matchedPatterns) {
      if (pattern.recoverable) {
        for (const strategyName of pattern.strategies) {
          const strategy = this.strategies.get(strategyName);
          if (strategy && strategy.canRecover(error, context)) {
            try {
              console.log(`Attempting recovery with strategy: ${strategyName}`);
              const recovered = await strategy.recover(error, context);
              if (recovered) {
                console.log(`Recovery successful with strategy: ${strategyName}`);
                this.updateRecoveryMetrics(true);
                return true;
              }
            } catch (recoveryError) {
              console.error(`Recovery strategy ${strategyName} failed:`, recoveryError);
            }
          }
        }
      }
    }
    
    this.updateRecoveryMetrics(false);
    return false;
  }

  private findMatchingPatterns(error: Error): ErrorPattern[] {
    const matches: ErrorPattern[] = [];
    
    for (const pattern of this.patterns.values()) {
      let isMatch = false;
      
      if (pattern.pattern instanceof RegExp) {
        isMatch = pattern.pattern.test(error.message) || 
                 pattern.pattern.test(error.name) || 
                 (error.stack && pattern.pattern.test(error.stack));
      } else if (typeof pattern.pattern === 'function') {
        isMatch = pattern.pattern(error);
      }
      
      if (isMatch) {
        matches.push(pattern);
        this.metrics.patterns[pattern.name] = (this.metrics.patterns[pattern.name] || 0) + 1;
      }
    }
    
    // Sort by severity
    return matches.sort((a, b) => {
      const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  private updateMetrics(error: Error, context: ErrorContext): void {
    this.metrics.totalErrors++;
    this.metrics.errorsByType[error.name] = (this.metrics.errorsByType[error.name] || 0) + 1;
    
    if (context.component) {
      this.metrics.errorsByComponent[context.component] = 
        (this.metrics.errorsByComponent[context.component] || 0) + 1;
    }
    
    this.metrics.lastError = context;
  }

  private updateRecoveryMetrics(success: boolean): void {
    const totalAttempts = this.errorHistory.length;
    if (totalAttempts > 0) {
      // This is simplified - in a real system you'd track successful recoveries
      this.metrics.recoverySuccessRate = success ? 
        Math.min(this.metrics.recoverySuccessRate + 0.1, 1) :
        Math.max(this.metrics.recoverySuccessRate - 0.05, 0);
    }
  }

  addErrorListener(listener: (error: ErrorContext) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getMetrics(): ErrorMetrics {
    return { ...this.metrics };
  }

  getErrorHistory(limit?: number): ErrorContext[] {
    return limit ? this.errorHistory.slice(-limit) : [...this.errorHistory];
  }

  clearHistory(): void {
    this.errorHistory = [];
    console.log('Error history cleared');
  }

  // Health check methods
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
    details: any;
  }> {
    const checks: Record<string, boolean> = {};
    
    // Storage health
    try {
      localStorage.setItem('health-check', 'test');
      localStorage.removeItem('health-check');
      checks.localStorage = true;
    } catch {
      checks.localStorage = false;
    }
    
    // Network health
    try {
      await fetch('/salebds/manifest.webmanifest', { method: 'HEAD' });
      checks.network = true;
    } catch {
      checks.network = false;
    }
    
    // Memory health (approximate)
    checks.memory = this.metrics.errorsByType['RangeError'] === undefined;
    
    // Service Worker health
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration('/salebds/');
        checks.serviceWorker = !!registration;
      } catch {
        checks.serviceWorker = false;
      }
    } else {
      checks.serviceWorker = false;
    }
    
    const healthyCount = Object.values(checks).filter(Boolean).length;
    const totalCount = Object.keys(checks).length;
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === totalCount) {
      status = 'healthy';
    } else if (healthyCount >= totalCount / 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }
    
    return {
      status,
      checks,
      details: {
        metrics: this.getMetrics(),
        recentErrors: this.getErrorHistory(5)
      }
    };
  }

  // Export system state for debugging
  exportState(): any {
    return {
      sessionId: this.sessionId,
      metrics: this.metrics,
      errorHistory: this.errorHistory,
      strategies: Array.from(this.strategies.keys()),
      patterns: Array.from(this.patterns.keys()),
      timestamp: Date.now()
    };
  }

  // Import system state (for testing or debugging)
  importState(state: any): void {
    if (state.sessionId) this.sessionId = state.sessionId;
    if (state.metrics) this.metrics = { ...this.metrics, ...state.metrics };
    if (state.errorHistory) this.errorHistory = state.errorHistory;
    console.log('System state imported');
  }
}

// Global instance
export const errorRecoverySystem = ErrorRecoverySystem.getInstance();