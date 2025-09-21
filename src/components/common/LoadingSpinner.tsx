import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Animated Logo/Icon */}
      <motion.div
        className={`${sizeClasses[size]} mb-4 bg-primary-600 rounded-lg flex items-center justify-center`}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <motion.svg
          className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-6 h-6'} text-white`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </motion.svg>
      </motion.div>

      {/* Spinning Ring */}
      <motion.div
        className={`loading-spinner ${sizeClasses[size]} border-primary-600`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      {/* Loading Text */}
      {text && (
        <motion.p
          className={`text-gray-600 mt-4 ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}

      {/* Loading Dots Animation */}
      <div className="flex space-x-1 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-primary-600 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton loader for content
export const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-300 rounded mb-2 ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

// Card skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`card animate-pulse ${className}`}>
      <div className="card-body">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-300 rounded w-1/2 mb-4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded" />
          <div className="h-3 bg-gray-300 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
};

// Table skeleton
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Header */}
      <div className="flex space-x-4 mb-4">
        {Array.from({ length: columns }, (_, i) => (
          <div key={i} className="h-4 bg-gray-300 rounded flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex space-x-4 mb-3">
          {Array.from({ length: columns }, (_, j) => (
            <div
              key={j}
              className={`h-3 bg-gray-300 rounded flex-1 ${
                j === 0 ? 'w-1/4' : j === columns - 1 ? 'w-1/6' : 'w-1/4'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;