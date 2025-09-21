/**
 * Advanced API Layer
 * Comprehensive API layer with caching, retry logic, offline support, and error handling
 */

import { errorRecoverySystem } from './ErrorRecoverySystem';
import { authSystem } from './AuthenticationSystem';
import { stateManager } from './StateManagementSystem';

export interface APIConfig {
  baseURL: string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
  enableCaching: boolean;
  enableOffline: boolean;
  enableMetrics: boolean;
  defaultHeaders: Record<string, string>;
  interceptors: {
    request: RequestInterceptor[];
    response: ResponseInterceptor[];
  };
}

export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  cache?: CacheConfig;
  retry?: RetryConfig;
  offline?: OfflineConfig;
  metadata?: Record<string, any>;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  key?: string;
  tags?: string[];
  invalidateOn?: string[];
  strategy: 'cache-first' | 'network-first' | 'cache-only' | 'network-only';
  background?: boolean; // Update cache in background
}

export interface RetryConfig {
  count: number;
  delay: number;
  exponentialBackoff: boolean;
  retryCondition: (error: APIError) => boolean;
}

export interface OfflineConfig {
  enabled: boolean;
  queueRequest: boolean;
  fallbackData?: any;
  notification?: boolean;
}

export interface APIResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
  cached?: boolean;
  fromOffline?: boolean;
}

export interface APIError extends Error {
  code?: string;
  status?: number;
  statusText?: string;
  response?: any;
  config?: RequestConfig;
  isNetworkError?: boolean;
  isTimeoutError?: boolean;
  isRetryable?: boolean;
}

export interface RequestInterceptor {
  name: string;
  onFulfilled?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onRejected?: (error: any) => any;
}

export interface ResponseInterceptor {
  name: string;
  onFulfilled?: (response: APIResponse) => APIResponse | Promise<APIResponse>;
  onRejected?: (error: APIError) => any;
}

export interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  ttl: number;
  tags: string[];
  size: number;
  hits: number;
  lastAccess: number;
}

export interface OfflineQueueItem {
  id: string;
  config: RequestConfig;
  timestamp: number;
  attempts: number;
  priority: number;
}

export interface APIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  cachedRequests: number;
  averageResponseTime: number;
  networkErrors: number;
  timeoutErrors: number;
  retryAttempts: number;
  offlineQueue: number;
  cacheHitRate: number;
  lastReset: number;
}

export class APILayer {
  private static instance: APILayer;
  private config: APIConfig;
  private cache = new Map<string, CacheEntry>();
  private offlineQueue: OfflineQueueItem[] = [];
  private metrics: APIMetrics;
  private isOnline = navigator.onLine;
  private requestId = 0;
  private activeRequests = new Map<string, AbortController>();
  private rateLimiters = new Map<string, RateLimiter>();

  static getInstance(): APILayer {
    if (!APILayer.instance) {
      APILayer.instance = new APILayer();
    }
    return APILayer.instance;
  }

  private constructor() {
    this.config = this.createDefaultConfig();
    this.metrics = this.createDefaultMetrics();
    this.setupEventListeners();
    this.setupDefaultInterceptors();
    this.startBackgroundTasks();
  }

  private createDefaultConfig(): APIConfig {
    return {
      baseURL: '/api/v1',
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
      enableCaching: true,
      enableOffline: true,
      enableMetrics: true,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      interceptors: {
        request: [],
        response: []
      }
    };
  }

  private createDefaultMetrics(): APIMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cachedRequests: 0,
      averageResponseTime: 0,
      networkErrors: 0,
      timeoutErrors: 0,
      retryAttempts: 0,
      offlineQueue: 0,
      cacheHitRate: 0,
      lastReset: Date.now()
    };
  }

  private setupEventListeners(): void {
    // Network status
    window.addEventListener('online', () => {
      console.log('Network back online, processing offline queue');
      this.isOnline = true;
      this.processOfflineQueue();
    });

    window.addEventListener('offline', () => {
      console.log('Network went offline');
      this.isOnline = false;
    });

    // Storage events for cache synchronization
    window.addEventListener('storage', (event) => {
      if (event.key?.startsWith('api-cache-')) {
        this.handleCacheSync(event);
      }
    });

    // Page visibility for background sync
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.syncBackgroundCache();
      }
    });
  }

  private setupDefaultInterceptors(): void {
    // Authentication interceptor
    this.addRequestInterceptor({
      name: 'auth',
      onFulfilled: async (config) => {
        const authHeader = authSystem.getAuthHeader();
        if (authHeader) {
          config.headers = {
            ...config.headers,
            'Authorization': authHeader
          };
        }
        return config;
      }
    });

    // Retry interceptor
    this.addResponseInterceptor({
      name: 'retry',
      onRejected: async (error) => {
        const config = error.config;
        const retryConfig = config?.retry || {
          count: this.config.retryCount,
          delay: this.config.retryDelay,
          exponentialBackoff: true,
          retryCondition: (err) => err.isRetryable !== false
        };

        if (this.shouldRetry(error, retryConfig)) {
          await this.delay(this.calculateDelay(retryConfig, error.config?.metadata?.retryCount || 0));
          return this.request({
            ...config,
            metadata: {
              ...config?.metadata,
              retryCount: (config?.metadata?.retryCount || 0) + 1
            }
          });
        }

        throw error;
      }
    });

    // Error logging interceptor
    this.addResponseInterceptor({
      name: 'errorLogging',
      onRejected: (error) => {
        errorRecoverySystem.handleError(error, {
          id: `api-error-${Date.now()}`,
          timestamp: Date.now(),
          sessionId: 'api-layer',
          url: window.location.href,
          userAgent: navigator.userAgent,
          component: 'APILayer',
          action: `${error.config?.method} ${error.config?.url}`,
          metadata: {
            config: error.config,
            response: error.response
          }
        });
        throw error;
      }
    });
  }

  private startBackgroundTasks(): void {
    // Cache cleanup every 5 minutes
    setInterval(() => {
      this.cleanupCache();
    }, 5 * 60 * 1000);

    // Metrics update every minute
    setInterval(() => {
      this.updateMetrics();
    }, 60 * 1000);

    // Offline queue processing every 30 seconds
    setInterval(() => {
      if (this.isOnline && this.offlineQueue.length > 0) {
        this.processOfflineQueue();
      }
    }, 30 * 1000);

    // Background cache updates
    setInterval(() => {
      this.updateBackgroundCache();
    }, 2 * 60 * 1000);
  }

  // Public API methods
  configure(config: Partial<APIConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('API Layer configured:', this.config);
  }

  async request<T = any>(config: RequestConfig): Promise<APIResponse<T>> {
    const startTime = Date.now();
    const requestId = (++this.requestId).toString();
    
    try {
      // Normalize config
      const normalizedConfig = this.normalizeConfig(config);
      
      // Check rate limiting
      await this.checkRateLimit(normalizedConfig);
      
      // Check cache first
      if (normalizedConfig.cache?.enabled && normalizedConfig.method === 'GET') {
        const cached = this.getFromCache(normalizedConfig);
        if (cached) {
          this.metrics.cachedRequests++;
          return cached;
        }
      }
      
      // Handle offline scenario
      if (!this.isOnline && normalizedConfig.offline?.enabled) {
        return this.handleOfflineRequest(normalizedConfig);
      }
      
      // Process request interceptors
      let processedConfig = normalizedConfig;
      for (const interceptor of this.config.interceptors.request) {
        if (interceptor.onFulfilled) {
          processedConfig = await interceptor.onFulfilled(processedConfig);
        }
      }
      
      // Make the actual request
      const response = await this.makeRequest<T>(processedConfig, requestId);
      
      // Cache response if enabled
      if (processedConfig.cache?.enabled) {
        this.setCache(processedConfig, response);
      }
      
      // Process response interceptors
      let processedResponse = response;
      for (const interceptor of this.config.interceptors.response) {
        if (interceptor.onFulfilled) {
          processedResponse = await interceptor.onFulfilled(processedResponse);
        }
      }
      
      // Update metrics
      this.metrics.totalRequests++;
      this.metrics.successfulRequests++;
      this.updateResponseTime(Date.now() - startTime);
      
      return processedResponse;
    } catch (error) {
      this.metrics.totalRequests++;
      this.metrics.failedRequests++;
      
      // Process error through interceptors
      let processedError = error as APIError;
      for (const interceptor of this.config.interceptors.response) {
        if (interceptor.onRejected) {
          try {
            processedError = await interceptor.onRejected(processedError);
          } catch (interceptorError) {
            processedError = interceptorError as APIError;
          }
        }
      }
      
      throw processedError;
    } finally {
      this.activeRequests.delete(requestId);
    }
  }

  // HTTP method shortcuts
  async get<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  async post<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, url, method: 'POST', data });
  }

  async put<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', data });
  }

  async patch<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PATCH', data });
  }

  async delete<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>): Promise<APIResponse<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

  // Private helper methods
  private normalizeConfig(config: RequestConfig): RequestConfig {
    return {
      ...config,
      url: this.buildURL(config.url, config.params),
      headers: { ...this.config.defaultHeaders, ...config.headers },
      timeout: config.timeout || this.config.timeout,
      cache: config.cache ? { 
        enabled: this.config.enableCaching,
        ttl: 5 * 60 * 1000, // 5 minutes default
        strategy: 'cache-first',
        ...config.cache 
      } : undefined,
      retry: config.retry || {
        count: this.config.retryCount,
        delay: this.config.retryDelay,
        exponentialBackoff: true,
        retryCondition: (error) => error.isRetryable !== false
      },
      offline: config.offline ? {
        enabled: this.config.enableOffline,
        queueRequest: true,
        notification: true,
        ...config.offline
      } : undefined
    };
  }

  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.config.baseURL}${url}`;
    
    if (!params) return fullURL;
    
    const urlObj = new URL(fullURL, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });
    
    return urlObj.toString();
  }

  private async makeRequest<T>(config: RequestConfig, requestId: string): Promise<APIResponse<T>> {
    const controller = new AbortController();
    this.activeRequests.set(requestId, controller);

    // Set timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, config.timeout);

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw this.createAPIError(response, config);
      }

      const data = await this.parseResponse<T>(response);
      
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseHeaders(response.headers),
        config
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError = this.createTimeoutError(config);
          this.metrics.timeoutErrors++;
          throw timeoutError;
        }
        
        if (!navigator.onLine) {
          const networkError = this.createNetworkError(config);
          this.metrics.networkErrors++;
          throw networkError;
        }
      }
      
      throw error;
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    if (contentType?.includes('text/')) {
      return response.text() as any;
    }
    
    if (contentType?.includes('application/octet-stream')) {
      return response.blob() as any;
    }
    
    return response.text() as any;
  }

  private parseHeaders(headers: Headers): Record<string, string> {
    const parsed: Record<string, string> = {};
    headers.forEach((value, key) => {
      parsed[key] = value;
    });
    return parsed;
  }

  private createAPIError(response: Response, config: RequestConfig): APIError {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as APIError;
    error.code = `HTTP_${response.status}`;
    error.status = response.status;
    error.statusText = response.statusText;
    error.config = config;
    error.isRetryable = this.isRetryableStatus(response.status);
    return error;
  }

  private createTimeoutError(config: RequestConfig): APIError {
    const error = new Error('Request timeout') as APIError;
    error.code = 'TIMEOUT';
    error.config = config;
    error.isTimeoutError = true;
    error.isRetryable = true;
    return error;
  }

  private createNetworkError(config: RequestConfig): APIError {
    const error = new Error('Network error') as APIError;
    error.code = 'NETWORK_ERROR';
    error.config = config;
    error.isNetworkError = true;
    error.isRetryable = true;
    return error;
  }

  private isRetryableStatus(status: number): boolean {
    return status >= 500 || status === 429 || status === 408;
  }

  // Cache management
  private getCacheKey(config: RequestConfig): string {
    if (config.cache?.key) {
      return config.cache.key;
    }
    
    const params = config.params ? JSON.stringify(config.params) : '';
    return `${config.method}:${config.url}:${params}`;
  }

  private getFromCache<T>(config: RequestConfig): APIResponse<T> | null {
    const key = this.getCacheKey(config);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check TTL
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Update stats
    entry.hits++;
    entry.lastAccess = Date.now();
    
    return {
      data: entry.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      cached: true
    };
  }

  private setCache(config: RequestConfig, response: APIResponse): void {
    if (!config.cache?.enabled) return;
    
    const key = this.getCacheKey(config);
    const data = JSON.stringify(response.data);
    const size = data.length;
    
    const entry: CacheEntry = {
      key,
      data: response.data,
      timestamp: Date.now(),
      ttl: config.cache.ttl || 5 * 60 * 1000,
      tags: config.cache.tags || [],
      size,
      hits: 0,
      lastAccess: Date.now()
    };
    
    this.cache.set(key, entry);
    
    // Store in persistent cache if configured
    if (config.cache.strategy !== 'cache-only') {
      this.persistCache(key, entry);
    }
  }

  private persistCache(key: string, entry: CacheEntry): void {
    try {
      localStorage.setItem(`api-cache-${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to persist cache entry:', error);
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    const toDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      // Remove expired entries
      if (now > entry.timestamp + entry.ttl) {
        toDelete.push(key);
      }
    });
    
    toDelete.forEach(key => {
      this.cache.delete(key);
      try {
        localStorage.removeItem(`api-cache-${key}`);
      } catch (error) {
        console.warn('Failed to remove cached item:', error);
      }
    });
    
    console.log(`Cleaned up ${toDelete.length} expired cache entries`);
  }

  // Offline support
  private async handleOfflineRequest<T>(config: RequestConfig): Promise<APIResponse<T>> {
    if (config.offline?.fallbackData) {
      return {
        data: config.offline.fallbackData,
        status: 200,
        statusText: 'OK (Offline)',
        headers: {},
        config,
        fromOffline: true
      };
    }
    
    if (config.offline?.queueRequest) {
      this.queueOfflineRequest(config);
      
      if (config.offline.notification) {
        stateManager.dispatch({
          type: 'UI_ADD_NOTIFICATION',
          payload: {
            id: `offline-${Date.now()}`,
            type: 'warning',
            title: 'Request Queued',
            message: 'Request will be sent when connection is restored',
            createdAt: Date.now()
          }
        });
      }
    }
    
    throw this.createNetworkError(config);
  }

  private queueOfflineRequest(config: RequestConfig): void {
    const item: OfflineQueueItem = {
      id: `offline-${Date.now()}-${Math.random()}`,
      config,
      timestamp: Date.now(),
      attempts: 0,
      priority: config.method === 'GET' ? 1 : 2 // Higher priority for mutations
    };
    
    this.offlineQueue.push(item);
    this.offlineQueue.sort((a, b) => b.priority - a.priority);
    
    this.metrics.offlineQueue = this.offlineQueue.length;
  }

  private async processOfflineQueue(): Promise<void> {
    if (!this.isOnline || this.offlineQueue.length === 0) return;
    
    console.log(`Processing ${this.offlineQueue.length} offline requests`);
    
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];
    
    for (const item of queue) {
      try {
        await this.request(item.config);
        console.log(`Successfully processed offline request: ${item.config.method} ${item.config.url}`);
      } catch (error) {
        console.error('Failed to process offline request:', error);
        
        item.attempts++;
        if (item.attempts < 3) {
          this.offlineQueue.push(item);
        }
      }
    }
    
    this.metrics.offlineQueue = this.offlineQueue.length;
  }

  // Rate limiting
  private async checkRateLimit(config: RequestConfig): Promise<void> {
    const key = `${config.method}:${config.url.split('?')[0]}`;
    let rateLimiter = this.rateLimiters.get(key);
    
    if (!rateLimiter) {
      rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute default
      this.rateLimiters.set(key, rateLimiter);
    }
    
    await rateLimiter.acquire();
  }

  // Retry logic
  private shouldRetry(error: APIError, retryConfig: RetryConfig): boolean {
    const currentRetryCount = error.config?.metadata?.retryCount || 0;
    
    if (currentRetryCount >= retryConfig.count) {
      return false;
    }
    
    return retryConfig.retryCondition(error);
  }

  private calculateDelay(retryConfig: RetryConfig, retryCount: number): number {
    if (!retryConfig.exponentialBackoff) {
      return retryConfig.delay;
    }
    
    return retryConfig.delay * Math.pow(2, retryCount);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Interceptor management
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.config.interceptors.request.push(interceptor);
    console.log(`Added request interceptor: ${interceptor.name}`);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.config.interceptors.response.push(interceptor);
    console.log(`Added response interceptor: ${interceptor.name}`);
  }

  removeRequestInterceptor(name: string): boolean {
    const index = this.config.interceptors.request.findIndex(i => i.name === name);
    if (index >= 0) {
      this.config.interceptors.request.splice(index, 1);
      return true;
    }
    return false;
  }

  removeResponseInterceptor(name: string): boolean {
    const index = this.config.interceptors.response.findIndex(i => i.name === name);
    if (index >= 0) {
      this.config.interceptors.response.splice(index, 1);
      return true;
    }
    return false;
  }

  // Cache control
  invalidateCache(pattern?: string | RegExp): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    const toDelete: string[] = [];
    this.cache.forEach((entry, key) => {
      const matches = pattern instanceof RegExp 
        ? pattern.test(key)
        : key.includes(pattern);
      
      if (matches) {
        toDelete.push(key);
      }
    });
    
    toDelete.forEach(key => this.cache.delete(key));
    console.log(`Invalidated ${toDelete.length} cache entries`);
  }

  invalidateCacheByTags(tags: string[]): void {
    const toDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      const hasMatchingTag = tags.some(tag => entry.tags.includes(tag));
      if (hasMatchingTag) {
        toDelete.push(key);
      }
    });
    
    toDelete.forEach(key => this.cache.delete(key));
    console.log(`Invalidated ${toDelete.length} cache entries by tags:`, tags);
  }

  // Background tasks
  private updateBackgroundCache(): void {
    // Update frequently accessed cache entries in background
    this.cache.forEach(async (entry, key) => {
      if (entry.hits > 5 && Date.now() - entry.lastAccess < 10 * 60 * 1000) {
        // Entry is frequently accessed and recently used
        const remainingTTL = (entry.timestamp + entry.ttl) - Date.now();
        if (remainingTTL < entry.ttl * 0.2) { // Less than 20% TTL remaining
          try {
            // Refresh in background without waiting
            const config = JSON.parse(localStorage.getItem(`api-config-${key}`) || '{}');
            if (config.url) {
              this.request(config).catch(() => {}); // Silent background refresh
            }
          } catch (error) {
            console.warn('Background cache update failed:', error);
          }
        }
      }
    });
  }

  private syncBackgroundCache(): void {
    // Sync cache with other tabs when page becomes visible
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('api-cache-')) {
          const cacheKey = key.replace('api-cache-', '');
          if (!this.cache.has(cacheKey)) {
            const entry = JSON.parse(localStorage.getItem(key) || '{}');
            this.cache.set(cacheKey, entry);
          }
        }
      }
    } catch (error) {
      console.warn('Cache sync failed:', error);
    }
  }

  private handleCacheSync(event: StorageEvent): void {
    if (!event.key || !event.key.startsWith('api-cache-')) return;
    
    const cacheKey = event.key.replace('api-cache-', '');
    
    if (event.newValue) {
      try {
        const entry = JSON.parse(event.newValue);
        this.cache.set(cacheKey, entry);
      } catch (error) {
        console.warn('Failed to sync cache entry:', error);
      }
    } else {
      this.cache.delete(cacheKey);
    }
  }

  // Metrics
  private updateMetrics(): void {
    const cacheSize = this.cache.size;
    const totalCacheRequests = this.metrics.cachedRequests;
    const totalRequests = this.metrics.totalRequests;
    
    this.metrics.cacheHitRate = totalRequests > 0 ? totalCacheRequests / totalRequests : 0;
  }

  private updateResponseTime(responseTime: number): void {
    const currentAvg = this.metrics.averageResponseTime;
    const totalRequests = this.metrics.totalRequests;
    
    this.metrics.averageResponseTime = totalRequests > 1
      ? (currentAvg * (totalRequests - 1) + responseTime) / totalRequests
      : responseTime;
  }

  getMetrics(): APIMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = this.createDefaultMetrics();
    console.log('API metrics reset');
  }

  // Request cancellation
  cancelRequest(requestId: string): boolean {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
      return true;
    }
    return false;
  }

  cancelAllRequests(): void {
    this.activeRequests.forEach((controller) => {
      controller.abort();
    });
    this.activeRequests.clear();
    console.log('All active requests cancelled');
  }

  // Development tools
  exportState(): any {
    return {
      config: this.config,
      metrics: this.metrics,
      cacheSize: this.cache.size,
      offlineQueueSize: this.offlineQueue.length,
      activeRequestsCount: this.activeRequests.size,
      isOnline: this.isOnline,
      timestamp: Date.now()
    };
  }

  getCacheStats(): any {
    const stats = {
      totalEntries: this.cache.size,
      totalSize: 0,
      averageHits: 0,
      oldestEntry: 0,
      newestEntry: 0
    };

    this.cache.forEach((entry) => {
      stats.totalSize += entry.size;
      stats.averageHits += entry.hits;
      
      if (!stats.oldestEntry || entry.timestamp < stats.oldestEntry) {
        stats.oldestEntry = entry.timestamp;
      }
      
      if (!stats.newestEntry || entry.timestamp > stats.newestEntry) {
        stats.newestEntry = entry.timestamp;
      }
    });

    if (stats.totalEntries > 0) {
      stats.averageHits /= stats.totalEntries;
    }

    return stats;
  }
}

// Rate limiter utility class
class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;
  private queue: Array<{ resolve: () => void; timestamp: number }> = [];

  constructor(maxTokens: number, windowMs: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = maxTokens / windowMs;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens--;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.queue.push({ resolve, timestamp: Date.now() });
      this.processQueue();
    });
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  private processQueue(): void {
    if (this.queue.length === 0) return;

    this.refill();

    while (this.queue.length > 0 && this.tokens >= 1) {
      const item = this.queue.shift();
      if (item) {
        this.tokens--;
        item.resolve();
      }
    }

    // Clean up old queue items
    const now = Date.now();
    this.queue = this.queue.filter(item => now - item.timestamp < 60000); // 1 minute timeout
  }
}

// Global instance
export const apiLayer = APILayer.getInstance();