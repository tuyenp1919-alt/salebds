import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'react-hot-toast'

import App from './App'
import SimpleErrorBoundary from './components/common/SimpleErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'

import './styles/globals.css'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always'
    },
    mutations: {
      retry: 1,
      retryDelay: 1000
    }
  }
})

// Error handler for error boundary
const handleError = (error: Error, errorInfo?: { componentStack: string }) => {
  console.error('Application Error:', error, errorInfo);
  
  // Log error details for debugging
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack
  });
  
  // Here you could send error to monitoring service
  // e.g., Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // sendErrorToMonitoring(error, errorInfo)
  }
};

// Performance observer for monitoring
if ('PerformanceObserver' in window && process.env.NODE_ENV === 'production') {
  try {
    const perfObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime)
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime)
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.log('CLS:', (entry as any).value)
        }
      })
    })
    
    perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
  } catch (e) {
    console.warn('Performance Observer not supported:', e)
  }
}

// Initialize React app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <SimpleErrorBoundary onError={handleError}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/salebds">
          <ThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <App />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    className: 'text-sm',
                    success: {
                      iconTheme: {
                        primary: '#22c55e',
                        secondary: '#ffffff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                      },
                    },
                    loading: {
                      iconTheme: {
                        primary: '#3b82f6',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
        
        {/* React Query DevTools - only in development */}
        {/* {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )} */}
      </QueryClientProvider>
    </SimpleErrorBoundary>
  </React.StrictMode>
)

// Register service worker in production
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/salebds/sw.js')
      console.log('SW registered:', registration)
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update available notification
              console.log('New content available, please refresh.')
            }
          })
        }
      })
    } catch (error) {
      console.error('SW registration failed:', error)
    }
  })
}

// Handle app updates
let deferredPrompt: any
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  
  // Show install prompt to user when appropriate
  console.log('PWA install prompt available')
})

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully')
  deferredPrompt = null
})

// Handle network status
window.addEventListener('online', () => {
  console.log('Network connected')
  // Optionally show toast notification
})

window.addEventListener('offline', () => {
  console.log('Network disconnected')
  // Show offline notification
})

// Preload critical resources
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Preload fonts
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    fontLink.as = 'style'
    document.head.appendChild(fontLink)
    
    // Preload critical images
    // This would be done based on your actual critical images
  })
}

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // App went to background - pause non-critical operations
    queryClient.getQueryCache().clear() // Optional: clear cache to save memory
  } else {
    // App came back to foreground - resume operations
    queryClient.invalidateQueries() // Refresh data when app becomes active
  }
})