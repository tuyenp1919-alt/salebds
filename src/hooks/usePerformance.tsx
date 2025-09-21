import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Hook for lazy loading images with intersection observer
export const useLazyLoading = (threshold = 0.1) => {
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!imageRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(imageRef);

    return () => {
      observer.disconnect();
    };
  }, [imageRef, threshold]);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return {
    setImageRef,
    isLoaded,
    isInView,
    handleImageLoad
  };
};

// Hook for detecting network speed
export const useNetworkSpeed = () => {
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [effectiveType, setEffectiveType] = useState<string>('unknown');
  const [downlink, setDownlink] = useState<number>(0);
  const [rtt, setRtt] = useState<number>(0);

  useEffect(() => {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;

    if (connection) {
      const updateConnectionInfo = () => {
        setConnectionType(connection.type || 'unknown');
        setEffectiveType(connection.effectiveType || 'unknown');
        setDownlink(connection.downlink || 0);
        setRtt(connection.rtt || 0);
      };

      updateConnectionInfo();
      connection.addEventListener('change', updateConnectionInfo);

      return () => {
        connection.removeEventListener('change', updateConnectionInfo);
      };
    }
  }, []);

  const isSlowConnection = useMemo(() => {
    return effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1;
  }, [effectiveType, downlink]);

  const isFastConnection = useMemo(() => {
    return effectiveType === '4g' && downlink > 10;
  }, [effectiveType, downlink]);

  return {
    connectionType,
    effectiveType,
    downlink,
    rtt,
    isSlowConnection,
    isFastConnection
  };
};

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0, // Time to First Byte
    domContentLoaded: 0,
    windowLoad: 0
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
            break;
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
          case 'first-input':
            setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ ...prev, cls: prev.cls + (entry as any).value }));
            }
            break;
        }
      });
    });

    // Observe different entry types
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.warn('Performance Observer not fully supported');
    }

    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigation.responseStart - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        windowLoad: navigation.loadEventEnd - navigation.fetchStart
      }));
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getPerformanceScore = useCallback(() => {
    const { fcp, lcp, fid, cls } = metrics;
    
    let score = 100;
    
    // FCP scoring (< 1.8s = good)
    if (fcp > 1800) score -= 20;
    else if (fcp > 3000) score -= 35;
    
    // LCP scoring (< 2.5s = good)
    if (lcp > 2500) score -= 25;
    else if (lcp > 4000) score -= 40;
    
    // FID scoring (< 100ms = good)
    if (fid > 100) score -= 20;
    else if (fid > 300) score -= 35;
    
    // CLS scoring (< 0.1 = good)
    if (cls > 0.1) score -= 20;
    else if (cls > 0.25) score -= 35;
    
    return Math.max(0, score);
  }, [metrics]);

  return {
    metrics,
    performanceScore: getPerformanceScore()
  };
};

// Hook for memory usage monitoring
export const useMemoryMonitoring = () => {
  const [memoryInfo, setMemoryInfo] = useState({
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  });

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  const memoryUsagePercent = useMemo(() => {
    if (!memoryInfo.jsHeapSizeLimit) return 0;
    return (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
  }, [memoryInfo]);

  const isHighMemoryUsage = useMemo(() => {
    return memoryUsagePercent > 80;
  }, [memoryUsagePercent]);

  return {
    memoryInfo,
    memoryUsagePercent,
    isHighMemoryUsage
  };
};

// Hook for battery status monitoring
export const useBatteryStatus = () => {
  const [batteryStatus, setBatteryStatus] = useState({
    charging: true,
    level: 1,
    chargingTime: Infinity,
    dischargingTime: Infinity
  });

  useEffect(() => {
    let battery: any = null;

    const updateBatteryInfo = (batteryManager: any) => {
      setBatteryStatus({
        charging: batteryManager.charging,
        level: batteryManager.level,
        chargingTime: batteryManager.chargingTime,
        dischargingTime: batteryManager.dischargingTime
      });
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batteryManager: any) => {
        battery = batteryManager;
        updateBatteryInfo(batteryManager);

        batteryManager.addEventListener('chargingchange', () => updateBatteryInfo(batteryManager));
        batteryManager.addEventListener('levelchange', () => updateBatteryInfo(batteryManager));
        batteryManager.addEventListener('chargingtimechange', () => updateBatteryInfo(batteryManager));
        batteryManager.addEventListener('dischargingtimechange', () => updateBatteryInfo(batteryManager));
      });
    }

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', updateBatteryInfo);
        battery.removeEventListener('levelchange', updateBatteryInfo);
        battery.removeEventListener('chargingtimechange', updateBatteryInfo);
        battery.removeEventListener('dischargingtimechange', updateBatteryInfo);
      }
    };
  }, []);

  const isLowBattery = useMemo(() => {
    return !batteryStatus.charging && batteryStatus.level < 0.2;
  }, [batteryStatus]);

  const shouldOptimize = useMemo(() => {
    return isLowBattery || (!batteryStatus.charging && batteryStatus.level < 0.5);
  }, [isLowBattery, batteryStatus]);

  return {
    batteryStatus,
    isLowBattery,
    shouldOptimize
  };
};

// Hook for adaptive performance
export const useAdaptivePerformance = () => {
  const { isSlowConnection } = useNetworkSpeed();
  const { isHighMemoryUsage } = useMemoryMonitoring();
  const { shouldOptimize: shouldOptimizeForBattery } = useBatteryStatus();
  const { performanceScore } = usePerformanceMonitoring();

  const performanceMode = useMemo(() => {
    if (isSlowConnection || isHighMemoryUsage || shouldOptimizeForBattery || performanceScore < 50) {
      return 'low';
    } else if (performanceScore > 80) {
      return 'high';
    }
    return 'medium';
  }, [isSlowConnection, isHighMemoryUsage, shouldOptimizeForBattery, performanceScore]);

  const optimizationSettings = useMemo(() => {
    switch (performanceMode) {
      case 'low':
        return {
          enableAnimations: false,
          imageQuality: 'low',
          maxConcurrentRequests: 2,
          lazyLoadDistance: 100,
          cacheSize: 'small',
          enableVirtualization: true,
          reducedMotion: true
        };
      case 'high':
        return {
          enableAnimations: true,
          imageQuality: 'high',
          maxConcurrentRequests: 6,
          lazyLoadDistance: 500,
          cacheSize: 'large',
          enableVirtualization: false,
          reducedMotion: false
        };
      default:
        return {
          enableAnimations: true,
          imageQuality: 'medium',
          maxConcurrentRequests: 4,
          lazyLoadDistance: 300,
          cacheSize: 'medium',
          enableVirtualization: false,
          reducedMotion: false
        };
    }
  }, [performanceMode]);

  return {
    performanceMode,
    optimizationSettings,
    isSlowConnection,
    isHighMemoryUsage,
    shouldOptimizeForBattery
  };
};

// Hook for virtual scrolling
export const useVirtualScrolling = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length, start + visibleCount + overscan * 2);
    
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
};

// Utility function for debouncing
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Utility function for throttling
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const lastRan = useRef<number>(Date.now());

  return useCallback(((...args: any[]) => {
    if (Date.now() - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = Date.now();
    }
  }) as T, [callback, delay]);
};

export default {
  useLazyLoading,
  useNetworkSpeed,
  usePerformanceMonitoring,
  useMemoryMonitoring,
  useBatteryStatus,
  useAdaptivePerformance,
  useVirtualScrolling,
  useDebounce,
  useThrottle
};