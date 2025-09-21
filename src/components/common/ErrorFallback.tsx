import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const isDev = process.env.NODE_ENV === 'development';

  const handleGoHome = () => {
    window.location.href = '/salebds';
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Oops! Có lỗi xảy ra
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 mb-6">
          Ứng dụng đã gặp phải một lỗi không mong muốn. 
          Chúng tôi đã ghi nhận sự cố này và sẽ khắc phục sớm.
        </p>

        {/* Error Details (Development Only) */}
        {isDev && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
            <h3 className="font-semibold text-red-800 mb-2">Chi tiết lỗi:</h3>
            <p className="text-sm text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                  Stack trace
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-x-auto whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>

          <button
            onClick={handleGoHome}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>

          <button
            onClick={handleReload}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tải lại trang
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Nếu lỗi vẫn tiếp tục, vui lòng liên hệ với{' '}
            <a 
              href="mailto:support@salebds.com" 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              đội hỗ trợ
            </a>{' '}
            để được trợ giúp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;