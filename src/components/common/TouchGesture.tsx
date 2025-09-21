import React, { useRef, useCallback, useEffect, useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';

interface TouchGestureProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onPinchZoom?: (scale: number) => void;
  onPullToRefresh?: () => void;
  className?: string;
  disabled?: boolean;
  swipeThreshold?: number;
  longPressDelay?: number;
  enableHapticFeedback?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
  timestamp: number;
}

export const TouchGesture: React.FC<TouchGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onLongPress,
  onDoubleTap,
  onPinchZoom,
  onPullToRefresh,
  className = '',
  disabled = false,
  swipeThreshold = 50,
  longPressDelay = 500,
  enableHapticFeedback = true
}) => {
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [lastTap, setLastTap] = useState<TouchPosition | null>(null);
  const [isPressing, setIsPressing] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);

  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimation();

  // Haptic feedback function
  const vibrate = useCallback((pattern: number | number[]) => {
    if (enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [enableHapticFeedback]);

  // Handle touch start
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (disabled) return;

    const touch = event.touches[0];
    const touchPos = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    setTouchStart(touchPos);
    setIsPressing(true);

    // Start long press detection
    if (onLongPress) {
      longPressTimeoutRef.current = setTimeout(() => {
        if (isPressing) {
          vibrate(50); // Short vibration for long press
          onLongPress();
          setIsPressing(false);
        }
      }, longPressDelay);
    }
  }, [disabled, onLongPress, longPressDelay, vibrate, isPressing]);

  // Handle touch move
  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (disabled || !touchStart) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    setDragDistance(distance);

    // Cancel long press if moved too much
    if (distance > 10 && longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    // Pull to refresh handling
    if (onPullToRefresh && deltaY > 0 && deltaY > deltaX) {
      const pullDistance = Math.min(deltaY, 100);
      controls.set({ y: pullDistance * 0.5 });
    }
  }, [disabled, touchStart, controls, onPullToRefresh]);

  // Handle touch end
  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (disabled || !touchStart) return;

    const touch = event.changedTouches[0];
    const touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const timeDiff = touchEnd.timestamp - touchStart.timestamp;

    setIsPressing(false);

    // Clear long press timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    // Handle swipes
    if (distance > swipeThreshold && timeDiff < 300) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          vibrate(30);
          onSwipeRight?.();
        } else {
          vibrate(30);
          onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          if (deltaY > 100 && onPullToRefresh) {
            vibrate([50, 100, 50]);
            onPullToRefresh();
          } else {
            vibrate(30);
            onSwipeDown?.();
          }
        } else {
          vibrate(30);
          onSwipeUp?.();
        }
      }
    }

    // Handle double tap
    if (onDoubleTap && distance < 10 && timeDiff < 200) {
      if (lastTap && (touchEnd.timestamp - lastTap.timestamp) < 300) {
        const tapDistance = Math.sqrt(
          (touchEnd.x - lastTap.x) ** 2 + (touchEnd.y - lastTap.y) ** 2
        );
        
        if (tapDistance < 30) {
          vibrate(20);
          onDoubleTap();
          setLastTap(null);
          return;
        }
      }
      setLastTap(touchEnd);
    }

    // Reset pull to refresh animation
    if (onPullToRefresh) {
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 300 } });
    }

    // Reset states
    setTouchStart(null);
    setDragDistance(0);
  }, [
    disabled,
    touchStart,
    swipeThreshold,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onDoubleTap,
    onPullToRefresh,
    lastTap,
    vibrate,
    controls
  ]);

  // Handle pinch zoom
  const handlePinchStart = useCallback((event: React.TouchEvent) => {
    if (disabled || !onPinchZoom || event.touches.length !== 2) return;

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt(
      (touch2.clientX - touch1.clientX) ** 2 + (touch2.clientY - touch1.clientY) ** 2
    );

    (event.target as any).initialPinchDistance = distance;
  }, [disabled, onPinchZoom]);

  const handlePinchMove = useCallback((event: React.TouchEvent) => {
    if (disabled || !onPinchZoom || event.touches.length !== 2) return;

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt(
      (touch2.clientX - touch1.clientX) ** 2 + (touch2.clientY - touch1.clientY) ** 2
    );

    const initialDistance = (event.target as any).initialPinchDistance;
    if (initialDistance) {
      const scale = distance / initialDistance;
      onPinchZoom(scale);
    }
  }, [disabled, onPinchZoom]);

  // Pan gesture handling with framer-motion
  const handlePan = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;

    const { offset, velocity } = info;
    const distance = Math.sqrt(offset.x ** 2 + offset.y ** 2);

    // Only trigger swipes on pan end with sufficient velocity
    if (Math.abs(velocity.x) > 500 || Math.abs(velocity.y) > 500) {
      if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
        // Horizontal swipe
        if (velocity.x > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (velocity.y > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }
  }, [disabled, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={`touch-gesture-container ${className}`}
      animate={controls}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPanStart={onPinchZoom ? handlePinchStart : undefined}
      onPan={onPinchZoom ? handlePinchMove : handlePan}
      style={{ touchAction: disabled ? 'auto' : 'none' }}
      drag={false} // Disable default drag to use custom gestures
    >
      {children}
    </motion.div>
  );
};

// Hook for swipe gestures
export const useSwipeGestures = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold = 50
) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }

    setTouchStart(null);
  }, [touchStart, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  };
};

// Hook for long press
export const useLongPress = (callback: () => void, delay = 500) => {
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsPressed(true);
    timerRef.current = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  const stop = useCallback(() => {
    setIsPressed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    isPressed,
    handlers: {
      onTouchStart: start,
      onTouchEnd: stop,
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop
    }
  };
};

// Pull to refresh component
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshThreshold?: number;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshThreshold = 60,
  className = ''
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const controls = useAnimation();

  const handlePullStart = useCallback(() => {
    setIsPulling(true);
  }, []);

  const handlePullMove = useCallback((distance: number) => {
    if (distance > 0) {
      const adjustedDistance = Math.min(distance * 0.5, 80);
      setPullDistance(adjustedDistance);
      controls.set({ y: adjustedDistance });
    }
  }, [controls]);

  const handlePullEnd = useCallback(async () => {
    setIsPulling(false);

    if (pullDistance >= refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    controls.start({ y: 0, transition: { type: 'spring', stiffness: 300 } });
  }, [pullDistance, refreshThreshold, isRefreshing, onRefresh, controls]);

  const refreshIcon = isRefreshing ? (
    <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
  ) : (
    <svg
      className={`w-5 h-5 transition-transform ${pullDistance >= refreshThreshold ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-gray-50 text-gray-600"
        initial={{ y: -60 }}
        animate={controls}
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center gap-2">
          {refreshIcon}
          <span className="text-sm font-medium">
            {isRefreshing 
              ? 'Đang làm mới...' 
              : pullDistance >= refreshThreshold 
                ? 'Thả để làm mới' 
                : 'Kéo để làm mới'
            }
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <TouchGesture
        onPullToRefresh={handlePullEnd}
        className="min-h-screen"
      >
        <motion.div animate={controls}>
          {children}
        </motion.div>
      </TouchGesture>
    </div>
  );
};

export default TouchGesture;