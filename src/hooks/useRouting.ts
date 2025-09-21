/**
 * React Hooks for Advanced Routing System
 * Provides React integration for the routing system
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  routingSystem, 
  RouteMatch, 
  NavigationError, 
  BreadcrumbItem 
} from '../core/AdvancedRoutingSystem';

// Main routing hook
export const useRouter = () => {
  const [currentRoute, setCurrentRoute] = useState<RouteMatch | null>(
    routingSystem.getCurrentRoute()
  );
  const [previousRoute, setPreviousRoute] = useState<RouteMatch | null>(
    routingSystem.getPreviousRoute()
  );
  const [isNavigating, setIsNavigating] = useState(
    routingSystem.isNavigating()
  );
  const [navigationError, setNavigationError] = useState<NavigationError | null>(
    routingSystem.getNavigationError()
  );

  useEffect(() => {
    const updateState = () => {
      setCurrentRoute(routingSystem.getCurrentRoute());
      setPreviousRoute(routingSystem.getPreviousRoute());
      setIsNavigating(routingSystem.isNavigating());
      setNavigationError(routingSystem.getNavigationError());
    };

    // Listen for navigation updates
    const handleNavigation = () => {
      updateState();
    };

    // Set up listeners (in a real implementation, you'd have event emitters)
    const interval = setInterval(updateState, 100); // Poll for now

    return () => {
      clearInterval(interval);
    };
  }, []);

  const navigate = useCallback(async (path: string, replace = false) => {
    return routingSystem.navigate(path, { replace });
  }, []);

  const push = useCallback((path: string) => {
    return routingSystem.push(path);
  }, []);

  const replace = useCallback((path: string) => {
    return routingSystem.replace(path);
  }, []);

  const back = useCallback(() => {
    return routingSystem.back();
  }, []);

  const forward = useCallback(() => {
    return routingSystem.forward();
  }, []);

  const go = useCallback((delta: number) => {
    return routingSystem.go(delta);
  }, []);

  return {
    currentRoute,
    previousRoute,
    isNavigating,
    navigationError,
    navigate,
    push,
    replace,
    back,
    forward,
    go
  };
};

// Route parameters hook
export const useParams = () => {
  const { currentRoute } = useRouter();
  return currentRoute?.params || {};
};

// Query parameters hook
export const useQuery = () => {
  const { currentRoute } = useRouter();
  return currentRoute?.query || {};
};

// Route metadata hook
export const useMeta = () => {
  const { currentRoute } = useRouter();
  return currentRoute?.meta || {};
};

// Breadcrumbs hook
export const useBreadcrumbs = () => {
  const { currentRoute } = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    if (currentRoute) {
      const crumbs = routingSystem.generateBreadcrumbs(currentRoute);
      setBreadcrumbs(crumbs);
    }
  }, [currentRoute]);

  return breadcrumbs;
};

// Navigation history hook
export const useHistory = () => {
  const [history, setHistory] = useState(routingSystem.getNavigationHistory());

  useEffect(() => {
    const updateHistory = () => {
      setHistory(routingSystem.getNavigationHistory());
    };

    const interval = setInterval(updateHistory, 1000);
    return () => clearInterval(interval);
  }, []);

  return history;
};

// Route matching hook
export const useRouteMatch = (pattern: string) => {
  const { currentRoute } = useRouter();
  
  const match = useMemo(() => {
    if (!currentRoute) return null;
    
    const regex = new RegExp(
      pattern.replace(/:[^/]+/g, '([^/]+)').replace(/\*/g, '.*')
    );
    
    const matches = currentRoute.path.match(regex);
    if (!matches) return null;

    const paramNames = (pattern.match(/:[^/]+/g) || [])
      .map(param => param.slice(1));
    
    const params: Record<string, string> = {};
    paramNames.forEach((name, index) => {
      params[name] = matches[index + 1];
    });

    return {
      path: currentRoute.path,
      params,
      isExact: currentRoute.path === pattern
    };
  }, [currentRoute, pattern]);

  return match;
};

// Active route checking hook
export const useIsActive = (path: string, exact = false) => {
  const { currentRoute } = useRouter();
  
  return useMemo(() => {
    if (!currentRoute) return false;
    
    if (exact) {
      return currentRoute.path === path;
    }
    
    return currentRoute.path.startsWith(path);
  }, [currentRoute, path, exact]);
};

// Navigation guard hook
export const useNavigationGuard = (
  guard: (to: RouteMatch, from?: RouteMatch) => boolean | string | Promise<boolean | string>,
  deps: any[] = []
) => {
  useEffect(() => {
    const guardConfig = {
      name: `guard-${Date.now()}`,
      guard,
      priority: 500
    };

    routingSystem.addGuard(guardConfig);

    return () => {
      routingSystem.removeGuard(guardConfig.name);
    };
  }, deps);
};

// Route preloading hook
export const usePreload = (routeName: string) => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    const preloadedRoutes = routingSystem.getPreloadedRoutes();
    setIsPreloaded(preloadedRoutes.includes(routeName));
  }, [routeName]);

  const preload = useCallback(async () => {
    if (isPreloaded || isPreloading) return;
    
    setIsPreloading(true);
    try {
      // In a real implementation, you'd have a preload method
      // await routingSystem.preloadRoute(routeName);
      setIsPreloaded(true);
    } catch (error) {
      console.error('Preload failed:', error);
    } finally {
      setIsPreloading(false);
    }
  }, [routeName, isPreloaded, isPreloading]);

  return {
    isPreloaded,
    isPreloading,
    preload
  };
};

// Route transition hook
export const useTransition = () => {
  const { currentRoute, previousRoute, isNavigating } = useRouter();
  const [transitionState, setTransitionState] = useState<{
    phase: 'idle' | 'leaving' | 'entering' | 'entered';
    from?: RouteMatch | null;
    to?: RouteMatch | null;
  }>({ phase: 'idle' });

  useEffect(() => {
    if (isNavigating) {
      setTransitionState({
        phase: 'leaving',
        from: previousRoute,
        to: currentRoute
      });

      setTimeout(() => {
        setTransitionState({
          phase: 'entering',
          from: previousRoute,
          to: currentRoute
        });
      }, 150);

      setTimeout(() => {
        setTransitionState({
          phase: 'entered',
          from: previousRoute,
          to: currentRoute
        });
      }, 300);

      setTimeout(() => {
        setTransitionState({ phase: 'idle' });
      }, 500);
    }
  }, [isNavigating, currentRoute, previousRoute]);

  return transitionState;
};

// Route analytics hook
export const useRouteAnalytics = () => {
  const [analytics, setAnalytics] = useState(routingSystem.getRouteAnalytics());

  useEffect(() => {
    const updateAnalytics = () => {
      setAnalytics(routingSystem.getRouteAnalytics());
    };

    const interval = setInterval(updateAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  return analytics;
};

// Page title hook
export const useTitle = (title?: string) => {
  const { currentRoute } = useRouter();

  useEffect(() => {
    if (title) {
      document.title = title;
    } else if (currentRoute?.meta.title) {
      document.title = currentRoute.meta.title;
    }
  }, [title, currentRoute]);
};

// Navigation blocking hook
export const useBlocker = (
  when: boolean,
  message = 'Are you sure you want to leave this page?'
) => {
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    const handlePopState = (event: PopStateEvent) => {
      if (!window.confirm(message)) {
        event.preventDefault();
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [when, message]);
};

// Scroll restoration hook
export const useScrollRestoration = (behavior: 'auto' | 'manual' | 'smooth' = 'auto') => {
  const { currentRoute } = useRouter();

  useEffect(() => {
    if (behavior === 'auto' && currentRoute) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentRoute, behavior]);

  const scrollTo = useCallback((options: ScrollToOptions) => {
    window.scrollTo(options);
  }, []);

  const scrollToTop = useCallback((smooth = true) => {
    window.scrollTo({ 
      top: 0, 
      behavior: smooth ? 'smooth' : 'auto' 
    });
  }, []);

  return {
    scrollTo,
    scrollToTop
  };
};

// Link prefetching hook
export const usePrefetch = (href: string, options?: { 
  onHover?: boolean; 
  onVisible?: boolean; 
  delay?: number; 
}) => {
  const [isPrefetched, setIsPrefetched] = useState(false);
  const { preload } = usePreload(href);

  const handlePrefetch = useCallback(() => {
    if (isPrefetched) return;
    
    const timer = options?.delay 
      ? setTimeout(() => {
          preload();
          setIsPrefetched(true);
        }, options.delay)
      : (preload(), setIsPrefetched(true));

    return () => {
      if (options?.delay && timer) {
        clearTimeout(timer);
      }
    };
  }, [isPrefetched, preload, options?.delay]);

  const linkProps = useMemo(() => {
    const props: any = {};

    if (options?.onHover) {
      props.onMouseEnter = handlePrefetch;
    }

    return props;
  }, [options?.onHover, handlePrefetch]);

  useEffect(() => {
    if (options?.onVisible) {
      // In a real implementation, you'd use Intersection Observer
      const timer = setTimeout(handlePrefetch, 1000);
      return () => clearTimeout(timer);
    }
  }, [options?.onVisible, handlePrefetch]);

  return {
    isPrefetched,
    prefetch: handlePrefetch,
    linkProps
  };
};