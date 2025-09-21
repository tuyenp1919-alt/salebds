/**
 * Advanced Routing System
 * Comprehensive routing solution with lazy loading, preloading, guards, and navigation state
 */

import { errorRecoverySystem } from './ErrorRecoverySystem';
import { authSystem } from './AuthenticationSystem';
import { stateManager } from './StateManagementSystem';

export interface RouteConfig {
  path: string;
  name: string;
  component?: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;
  lazy?: () => Promise<{ default: React.ComponentType<any> }>;
  meta?: RouteMeta;
  guards?: RouteGuard[];
  children?: RouteConfig[];
  redirect?: string;
  alias?: string | string[];
  props?: RouteProps;
  beforeEnter?: RouteGuard;
  beforeLeave?: RouteGuard;
}

export interface RouteMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  requiresAuth?: boolean;
  roles?: string[];
  permissions?: string[];
  layout?: string;
  icon?: string;
  hidden?: boolean;
  breadcrumb?: boolean;
  cache?: boolean;
  preload?: boolean;
  priority?: number;
  analytics?: {
    track?: boolean;
    category?: string;
    action?: string;
  };
}

export interface RouteProps {
  default?: Record<string, any>;
  dynamic?: (route: RouteMatch) => Record<string, any>;
}

export interface RouteGuard {
  name: string;
  guard: (to: RouteMatch, from?: RouteMatch) => Promise<boolean | string> | boolean | string;
  priority?: number;
}

export interface RouteMatch {
  path: string;
  fullPath: string;
  name: string;
  params: Record<string, string>;
  query: Record<string, string>;
  hash: string;
  meta: RouteMeta;
  matched: RouteConfig[];
}

export interface NavigationState {
  current: RouteMatch | null;
  previous: RouteMatch | null;
  history: RouteMatch[];
  isNavigating: boolean;
  loadingRoute: string | null;
  error: NavigationError | null;
  preloadedRoutes: Set<string>;
  cachedComponents: Map<string, React.ComponentType<any>>;
}

export interface NavigationError {
  type: 'guard' | 'loading' | 'not-found' | 'network';
  message: string;
  route: string;
  guard?: string;
  originalError?: Error;
}

export interface NavigationHook {
  name: string;
  beforeEach?: (to: RouteMatch, from: RouteMatch | null) => Promise<void> | void;
  afterEach?: (to: RouteMatch, from: RouteMatch | null) => Promise<void> | void;
  beforeResolve?: (to: RouteMatch) => Promise<void> | void;
  onError?: (error: NavigationError) => Promise<void> | void;
}

export interface PreloadStrategy {
  name: string;
  shouldPreload: (route: RouteConfig, context: PreloadContext) => boolean;
  priority: number;
}

export interface PreloadContext {
  currentRoute: RouteMatch | null;
  userInteraction: boolean;
  connectionType: string;
  memoryInfo: any;
  timing: PerformanceTiming;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
  title: string;
  meta: RouteMeta;
  params: Record<string, string>;
}

export interface RouteTransition {
  name: string;
  from?: string;
  to?: string;
  duration: number;
  easing: string;
  enter?: string;
  leave?: string;
}

export class AdvancedRoutingSystem {
  private static instance: AdvancedRoutingSystem;
  private routes: RouteConfig[] = [];
  private routeMap = new Map<string, RouteConfig>();
  private guards = new Map<string, RouteGuard>();
  private hooks: NavigationHook[] = [];
  private preloadStrategies: PreloadStrategy[] = [];
  private navigationState: NavigationState;
  private preloadQueue = new Set<string>();
  private loadingPromises = new Map<string, Promise<any>>();
  private transitions = new Map<string, RouteTransition>();
  private breadcrumbCache = new Map<string, BreadcrumbItem[]>();

  static getInstance(): AdvancedRoutingSystem {
    if (!AdvancedRoutingSystem.instance) {
      AdvancedRoutingSystem.instance = new AdvancedRoutingSystem();
    }
    return AdvancedRoutingSystem.instance;
  }

  private constructor() {
    this.navigationState = {
      current: null,
      previous: null,
      history: [],
      isNavigating: false,
      loadingRoute: null,
      error: null,
      preloadedRoutes: new Set(),
      cachedComponents: new Map()
    };

    this.setupDefaultGuards();
    this.setupDefaultPreloadStrategies();
    this.setupEventListeners();
  }

  private setupDefaultGuards(): void {
    // Authentication guard
    this.addGuard({
      name: 'auth',
      priority: 1000,
      guard: async (to) => {
        if (to.meta.requiresAuth && !authSystem.isAuthenticated()) {
          return '/login';
        }
        return true;
      }
    });

    // Role-based guard
    this.addGuard({
      name: 'role',
      priority: 900,
      guard: async (to) => {
        if (to.meta.roles && to.meta.roles.length > 0) {
          const user = authSystem.getCurrentUser();
          if (!user || !to.meta.roles.includes(user.role)) {
            return '/403';
          }
        }
        return true;
      }
    });

    // Permission guard
    this.addGuard({
      name: 'permission',
      priority: 800,
      guard: async (to) => {
        if (to.meta.permissions && to.meta.permissions.length > 0) {
          const user = authSystem.getCurrentUser();
          if (!user || !this.hasPermissions(user, to.meta.permissions)) {
            return '/403';
          }
        }
        return true;
      }
    });
  }

  private setupDefaultPreloadStrategies(): void {
    // High priority routes (dashboard, frequently accessed)
    this.addPreloadStrategy({
      name: 'high-priority',
      priority: 1000,
      shouldPreload: (route) => {
        return route.meta?.priority === 1 || route.path === '/dashboard';
      }
    });

    // User interaction based preloading
    this.addPreloadStrategy({
      name: 'interaction',
      priority: 800,
      shouldPreload: (route, context) => {
        return context.userInteraction && route.meta?.preload !== false;
      }
    });

    // Connection-aware preloading
    this.addPreloadStrategy({
      name: 'connection-aware',
      priority: 600,
      shouldPreload: (route, context) => {
        const connection = (navigator as any).connection;
        if (!connection) return true;
        
        if (connection.effectiveType === '4g' && !connection.saveData) {
          return route.meta?.preload !== false;
        }
        
        return route.meta?.preload === true;
      }
    });
  }

  private setupEventListeners(): void {
    // Browser navigation events
    window.addEventListener('popstate', (event) => {
      this.handlePopState(event);
    });

    // Page visibility for preloading
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.resumePreloading();
      } else {
        this.pausePreloading();
      }
    });

    // Network status changes
    window.addEventListener('online', () => {
      this.resumePreloading();
    });

    window.addEventListener('offline', () => {
      this.pausePreloading();
    });
  }

  // Route configuration
  addRoute(route: RouteConfig): void {
    this.routes.push(route);
    this.buildRouteMap(route);
    console.log(`Route added: ${route.path} -> ${route.name}`);
  }

  addRoutes(routes: RouteConfig[]): void {
    routes.forEach(route => this.addRoute(route));
  }

  private buildRouteMap(route: RouteConfig, parentPath: string = ''): void {
    const fullPath = this.normalizePath(parentPath + route.path);
    this.routeMap.set(route.name, { ...route, path: fullPath });
    
    if (route.children) {
      route.children.forEach(child => {
        this.buildRouteMap(child, fullPath);
      });
    }
  }

  private normalizePath(path: string): string {
    return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }

  // Guard management
  addGuard(guard: RouteGuard): void {
    this.guards.set(guard.name, guard);
    console.log(`Route guard added: ${guard.name}`);
  }

  removeGuard(name: string): boolean {
    return this.guards.delete(name);
  }

  // Hook management
  addHook(hook: NavigationHook): void {
    this.hooks.push(hook);
    console.log(`Navigation hook added: ${hook.name}`);
  }

  removeHook(name: string): void {
    this.hooks = this.hooks.filter(hook => hook.name !== name);
  }

  // Preload strategy management
  addPreloadStrategy(strategy: PreloadStrategy): void {
    this.preloadStrategies.push(strategy);
    this.preloadStrategies.sort((a, b) => b.priority - a.priority);
    console.log(`Preload strategy added: ${strategy.name}`);
  }

  // Navigation methods
  async navigate(to: string | RouteMatch, options?: NavigationOptions): Promise<boolean> {
    try {
      this.navigationState.isNavigating = true;
      this.navigationState.error = null;

      const route = typeof to === 'string' ? await this.resolve(to) : to;
      if (!route) {
        throw new Error(`Route not found: ${typeof to === 'string' ? to : to.path}`);
      }

      // Run beforeEach hooks
      await this.runBeforeEachHooks(route, this.navigationState.current);

      // Run guards
      const guardResult = await this.runGuards(route, this.navigationState.current);
      if (guardResult !== true) {
        if (typeof guardResult === 'string') {
          return this.navigate(guardResult);
        }
        return false;
      }

      // Load component if needed
      await this.loadRouteComponent(route);

      // Run beforeResolve hooks
      await this.runBeforeResolveHooks(route);

      // Update navigation state
      this.updateNavigationState(route);

      // Update browser history
      if (!options?.replace) {
        window.history.pushState({ route }, route.meta.title || '', route.fullPath);
      } else {
        window.history.replaceState({ route }, route.meta.title || '', route.fullPath);
      }

      // Update document title and meta
      this.updateDocumentMeta(route);

      // Run afterEach hooks
      await this.runAfterEachHooks(route, this.navigationState.previous);

      // Trigger preloading for related routes
      this.triggerPreloading(route);

      // Update state manager
      stateManager.dispatch({
        type: 'NAVIGATION_UPDATE',
        payload: {
          current: route,
          previous: this.navigationState.previous,
          timestamp: Date.now()
        }
      });

      return true;
    } catch (error) {
      const navError: NavigationError = {
        type: 'loading',
        message: error instanceof Error ? error.message : 'Navigation failed',
        route: typeof to === 'string' ? to : to.path,
        originalError: error instanceof Error ? error : undefined
      };

      this.navigationState.error = navError;
      await this.runErrorHooks(navError);
      
      errorRecoverySystem.handleError(error, {
        id: `navigation-error-${Date.now()}`,
        timestamp: Date.now(),
        sessionId: 'routing',
        url: window.location.href,
        userAgent: navigator.userAgent,
        component: 'AdvancedRoutingSystem',
        action: 'navigate',
        metadata: { to, options }
      });

      return false;
    } finally {
      this.navigationState.isNavigating = false;
      this.navigationState.loadingRoute = null;
    }
  }

  async resolve(path: string): Promise<RouteMatch | null> {
    const url = new URL(path, window.location.origin);
    const pathname = url.pathname;
    const query = Object.fromEntries(url.searchParams);
    const hash = url.hash;

    for (const route of this.routes) {
      const match = this.matchRoute(route, pathname);
      if (match) {
        return {
          path: pathname,
          fullPath: path,
          name: route.name,
          params: match.params,
          query,
          hash,
          meta: route.meta || {},
          matched: match.matched
        };
      }
    }

    return null;
  }

  private matchRoute(route: RouteConfig, path: string, matched: RouteConfig[] = []): { params: Record<string, string>; matched: RouteConfig[] } | null {
    const routePath = route.path;
    const pathParts = path.split('/').filter(Boolean);
    const routeParts = routePath.split('/').filter(Boolean);

    if (pathParts.length !== routeParts.length && !route.children) {
      return null;
    }

    const params: Record<string, string> = {};
    const currentMatched = [...matched, route];

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];

      if (routePart.startsWith(':')) {
        const paramName = routePart.slice(1);
        params[paramName] = pathPart;
      } else if (routePart !== pathPart) {
        return null;
      }
    }

    // Check for child routes
    if (route.children && pathParts.length > routeParts.length) {
      const remainingPath = '/' + pathParts.slice(routeParts.length).join('/');
      for (const child of route.children) {
        const childMatch = this.matchRoute(child, remainingPath, currentMatched);
        if (childMatch) {
          return {
            params: { ...params, ...childMatch.params },
            matched: childMatch.matched
          };
        }
      }
    }

    return { params, matched: currentMatched };
  }

  // Component loading and preloading
  private async loadRouteComponent(route: RouteMatch): Promise<void> {
    const routeConfig = this.routeMap.get(route.name);
    if (!routeConfig) return;

    if (routeConfig.component) return;

    if (routeConfig.lazy) {
      this.navigationState.loadingRoute = route.name;
      
      try {
        let loadPromise = this.loadingPromises.get(route.name);
        if (!loadPromise) {
          loadPromise = routeConfig.lazy();
          this.loadingPromises.set(route.name, loadPromise);
        }

        const module = await loadPromise;
        routeConfig.component = module.default;
        this.navigationState.cachedComponents.set(route.name, module.default);
        
        console.log(`Component loaded: ${route.name}`);
      } catch (error) {
        console.error(`Failed to load component for route ${route.name}:`, error);
        throw error;
      }
    }
  }

  private async preloadRoute(routeName: string): Promise<void> {
    if (this.navigationState.preloadedRoutes.has(routeName)) return;
    if (this.loadingPromises.has(routeName)) return;

    const route = this.routeMap.get(routeName);
    if (!route || !route.lazy) return;

    try {
      const loadPromise = route.lazy();
      this.loadingPromises.set(routeName, loadPromise);
      
      const module = await loadPromise;
      route.component = module.default;
      this.navigationState.cachedComponents.set(routeName, module.default);
      this.navigationState.preloadedRoutes.add(routeName);
      
      console.log(`Route preloaded: ${routeName}`);
    } catch (error) {
      console.warn(`Failed to preload route ${routeName}:`, error);
    }
  }

  private triggerPreloading(currentRoute: RouteMatch): void {
    const context: PreloadContext = {
      currentRoute,
      userInteraction: true,
      connectionType: (navigator as any).connection?.effectiveType || '4g',
      memoryInfo: (performance as any).memory,
      timing: performance.timing
    };

    for (const [routeName, route] of this.routeMap) {
      if (this.shouldPreloadRoute(route, context)) {
        this.preloadQueue.add(routeName);
      }
    }

    this.processPreloadQueue();
  }

  private shouldPreloadRoute(route: RouteConfig, context: PreloadContext): boolean {
    return this.preloadStrategies.some(strategy => 
      strategy.shouldPreload(route, context)
    );
  }

  private async processPreloadQueue(): Promise<void> {
    const batch = Array.from(this.preloadQueue).slice(0, 3); // Process 3 at a time
    batch.forEach(routeName => this.preloadQueue.delete(routeName));

    await Promise.all(
      batch.map(routeName => 
        this.preloadRoute(routeName).catch(() => {}) // Silent fail for preloading
      )
    );

    if (this.preloadQueue.size > 0) {
      setTimeout(() => this.processPreloadQueue(), 1000);
    }
  }

  private pausePreloading(): void {
    // Implementation for pausing preloading
    this.preloadQueue.clear();
  }

  private resumePreloading(): void {
    // Implementation for resuming preloading
    if (this.navigationState.current) {
      this.triggerPreloading(this.navigationState.current);
    }
  }

  // Guard execution
  private async runGuards(to: RouteMatch, from: RouteMatch | null): Promise<boolean | string> {
    const guards = Array.from(this.guards.values())
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    for (const guard of guards) {
      try {
        const result = await guard.guard(to, from);
        if (result !== true) {
          console.log(`Guard ${guard.name} blocked navigation to ${to.path}`);
          return result;
        }
      } catch (error) {
        console.error(`Guard ${guard.name} threw error:`, error);
        return false;
      }
    }

    return true;
  }

  // Hook execution
  private async runBeforeEachHooks(to: RouteMatch, from: RouteMatch | null): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeEach) {
        try {
          await hook.beforeEach(to, from);
        } catch (error) {
          console.error(`Hook ${hook.name} beforeEach error:`, error);
        }
      }
    }
  }

  private async runAfterEachHooks(to: RouteMatch, from: RouteMatch | null): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.afterEach) {
        try {
          await hook.afterEach(to, from);
        } catch (error) {
          console.error(`Hook ${hook.name} afterEach error:`, error);
        }
      }
    }
  }

  private async runBeforeResolveHooks(to: RouteMatch): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.beforeResolve) {
        try {
          await hook.beforeResolve(to);
        } catch (error) {
          console.error(`Hook ${hook.name} beforeResolve error:`, error);
        }
      }
    }
  }

  private async runErrorHooks(error: NavigationError): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onError) {
        try {
          await hook.onError(error);
        } catch (hookError) {
          console.error(`Hook ${hook.name} onError error:`, hookError);
        }
      }
    }
  }

  // State management
  private updateNavigationState(route: RouteMatch): void {
    this.navigationState.previous = this.navigationState.current;
    this.navigationState.current = route;
    
    if (this.navigationState.previous) {
      this.navigationState.history.push(this.navigationState.previous);
      
      // Keep history to reasonable size
      if (this.navigationState.history.length > 50) {
        this.navigationState.history = this.navigationState.history.slice(-25);
      }
    }
  }

  private updateDocumentMeta(route: RouteMatch): void {
    if (route.meta.title) {
      document.title = route.meta.title;
    }

    // Update meta tags
    this.updateMetaTag('description', route.meta.description);
    this.updateMetaTag('keywords', route.meta.keywords?.join(', '));
  }

  private updateMetaTag(name: string, content?: string): void {
    if (!content) return;

    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  // Breadcrumb generation
  generateBreadcrumbs(route?: RouteMatch): BreadcrumbItem[] {
    const targetRoute = route || this.navigationState.current;
    if (!targetRoute) return [];

    const cacheKey = targetRoute.fullPath;
    if (this.breadcrumbCache.has(cacheKey)) {
      return this.breadcrumbCache.get(cacheKey)!;
    }

    const breadcrumbs: BreadcrumbItem[] = [];
    
    for (const matchedRoute of targetRoute.matched) {
      if (matchedRoute.meta?.breadcrumb !== false) {
        breadcrumbs.push({
          name: matchedRoute.name,
          path: matchedRoute.path,
          title: matchedRoute.meta?.title || matchedRoute.name,
          meta: matchedRoute.meta || {},
          params: targetRoute.params
        });
      }
    }

    this.breadcrumbCache.set(cacheKey, breadcrumbs);
    return breadcrumbs;
  }

  // Event handlers
  private handlePopState(event: PopStateEvent): void {
    const state = event.state;
    if (state && state.route) {
      this.navigate(state.route, { replace: true });
    } else {
      this.navigate(window.location.pathname + window.location.search + window.location.hash, { replace: true });
    }
  }

  // Utility methods
  private hasPermissions(user: any, permissions: string[]): boolean {
    if (!user.permissions || !Array.isArray(user.permissions)) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  }

  // Public API
  getCurrentRoute(): RouteMatch | null {
    return this.navigationState.current;
  }

  getPreviousRoute(): RouteMatch | null {
    return this.navigationState.previous;
  }

  getNavigationHistory(): RouteMatch[] {
    return [...this.navigationState.history];
  }

  isNavigating(): boolean {
    return this.navigationState.isNavigating;
  }

  getNavigationError(): NavigationError | null {
    return this.navigationState.error;
  }

  getPreloadedRoutes(): string[] {
    return Array.from(this.navigationState.preloadedRoutes);
  }

  getCachedComponents(): string[] {
    return Array.from(this.navigationState.cachedComponents.keys());
  }

  // Navigation shortcuts
  async push(path: string): Promise<boolean> {
    return this.navigate(path, { replace: false });
  }

  async replace(path: string): Promise<boolean> {
    return this.navigate(path, { replace: true });
  }

  async back(): Promise<void> {
    window.history.back();
  }

  async forward(): Promise<void> {
    window.history.forward();
  }

  async go(delta: number): Promise<void> {
    window.history.go(delta);
  }

  // Development tools
  exportState(): any {
    return {
      routes: this.routes.length,
      routeMap: Array.from(this.routeMap.keys()),
      guards: Array.from(this.guards.keys()),
      hooks: this.hooks.map(h => h.name),
      preloadStrategies: this.preloadStrategies.map(s => s.name),
      navigationState: {
        ...this.navigationState,
        preloadedRoutes: Array.from(this.navigationState.preloadedRoutes),
        cachedComponents: Array.from(this.navigationState.cachedComponents.keys())
      },
      preloadQueue: Array.from(this.preloadQueue),
      loadingPromises: Array.from(this.loadingPromises.keys()),
      breadcrumbCache: Array.from(this.breadcrumbCache.keys()),
      timestamp: Date.now()
    };
  }

  getRouteAnalytics(): any {
    const history = this.navigationState.history;
    const routeVisits = new Map<string, number>();
    const routeTiming = new Map<string, number[]>();

    history.forEach(route => {
      routeVisits.set(route.name, (routeVisits.get(route.name) || 0) + 1);
    });

    return {
      totalNavigations: history.length,
      uniqueRoutes: routeVisits.size,
      mostVisited: Array.from(routeVisits.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      preloadEfficiency: {
        preloaded: this.navigationState.preloadedRoutes.size,
        cached: this.navigationState.cachedComponents.size,
        hitRate: this.calculatePreloadHitRate()
      }
    };
  }

  private calculatePreloadHitRate(): number {
    const total = this.navigationState.history.length;
    if (total === 0) return 0;

    const hits = this.navigationState.history.filter(route =>
      this.navigationState.preloadedRoutes.has(route.name)
    ).length;

    return (hits / total) * 100;
  }
}

export interface NavigationOptions {
  replace?: boolean;
  force?: boolean;
}

// Global instance
export const routingSystem = AdvancedRoutingSystem.getInstance();