import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProductionFallbackProps {
  error?: Error;
}

const ProductionFallback: React.FC<ProductionFallbackProps> = ({ error }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Collect debug information
    const info = {
      url: window.location.href,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      localStorageAvailable: typeof Storage !== 'undefined',
      localStorageContent: {},
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : null
    };

    // Safely check localStorage
    try {
      if (typeof Storage !== 'undefined') {
        info.localStorageContent = {
          auth_token: localStorage.getItem('auth_token') ? 'present' : 'missing',
          auth_user: localStorage.getItem('auth_user') ? 'present' : 'missing',
          theme: localStorage.getItem('theme'),
        };
      }
    } catch (e) {
      info.localStorageContent = { error: 'Cannot access localStorage' };
    }

    setDebugInfo(info);
    console.error('Production Fallback triggered:', info);
  }, [error, location]);

  const handleClearAndRestart = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.href = '/salebds/';
  };

  const handleGoToLogin = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    navigate('/login', { replace: true });
  };

  const handleReload = () => {
    window.location.reload();
  };

  // If we're in development, show full error details
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-bold text-red-600 mb-4">Development Error</h1>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 font-mono text-sm">{error.message}</p>
              <pre className="mt-2 text-xs text-red-600 overflow-auto">{error.stack}</pre>
            </div>
          )}
          <button
            onClick={handleReload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  // Production-friendly error screen
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Có lỗi xảy ra
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Ứng dụng đã gặp phải một lỗi không mong muốn. 
          Chúng tôi đã ghi nhận sự cố này và sẽ khắc phục sớm.
        </p>

        <div className="space-y-3 mb-6">
          <button
            onClick={handleReload}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            🔄 Tải lại trang
          </button>
          
          <button
            onClick={handleClearAndRestart}
            className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-medium transition-colors"
          >
            🧹 Khởi động lại ứng dụng
          </button>
          
          <button
            onClick={handleGoToLogin}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium transition-colors"
          >
            🏠 Về trang đăng nhập
          </button>
        </div>

        <details className="text-left">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            Thông tin kỹ thuật (cho dev)
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 overflow-auto">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </details>

        <div className="mt-6 text-xs text-gray-400">
          Mã lỗi: {Date.now().toString(36).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default ProductionFallback;