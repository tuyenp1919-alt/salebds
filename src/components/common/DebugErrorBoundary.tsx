import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class DebugErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo
    });

    // Log detailed error info
    console.error('React Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Stack:', error.stack);

    // Log environment info
    console.error('Environment Info:', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      localStorage: typeof localStorage !== 'undefined' ? 'available' : 'not available',
      sessionStorage: typeof sessionStorage !== 'undefined' ? 'available' : 'not available',
    });

    // Try to log localStorage content (safely)
    try {
      console.error('LocalStorage contents:', {
        auth_token: localStorage.getItem('auth_token'),
        auth_user: localStorage.getItem('auth_user'),
        theme: localStorage.getItem('theme'),
      });
    } catch (e) {
      console.error('Cannot access localStorage:', e);
    }
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Lỗi Ứng dụng</h1>
              <p className="text-gray-600">Ứng dụng đã gặp lỗi không mong muốn. Chi tiết lỗi:</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">Thông báo lỗi:</h3>
              <p className="text-red-700 font-mono text-sm">{error?.message}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Stack Trace:</h3>
              <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                {error?.stack}
              </pre>
            </div>

            {errorInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Component Stack:</h3>
                <pre className="text-xs text-blue-700 overflow-auto max-h-32">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Environment:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li><strong>URL:</strong> {window.location.href}</li>
                <li><strong>Time:</strong> {new Date().toLocaleString()}</li>
                <li><strong>User Agent:</strong> {navigator.userAgent}</li>
                <li><strong>LocalStorage:</strong> {typeof localStorage !== 'undefined' ? 'Available' : 'Not Available'}</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                🔄 Tải lại trang
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-medium"
              >
                🧹 Xóa dữ liệu & tải lại
              </button>
              <button
                onClick={() => window.location.href = '/salebds/login'}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
              >
                🏠 Về trang đăng nhập
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Nếu lỗi tiếp tục xảy ra, vui lòng liên hệ bộ phận hỗ trợ với thông tin lỗi ở trên.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DebugErrorBoundary;