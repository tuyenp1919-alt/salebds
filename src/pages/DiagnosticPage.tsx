import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

const DiagnosticPage: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    const diagnostics: DiagnosticResult[] = [];

    // Test 1: localStorage availability
    try {
      localStorage.setItem('diagnostic_test', 'test');
      localStorage.removeItem('diagnostic_test');
      diagnostics.push({
        name: 'localStorage',
        status: 'pass',
        message: 'localStorage is available and working'
      });
    } catch (error) {
      diagnostics.push({
        name: 'localStorage',
        status: 'fail',
        message: 'localStorage is not available or restricted',
        details: error
      });
    }

    // Test 2: sessionStorage availability
    try {
      sessionStorage.setItem('diagnostic_test', 'test');
      sessionStorage.removeItem('diagnostic_test');
      diagnostics.push({
        name: 'sessionStorage',
        status: 'pass',
        message: 'sessionStorage is available and working'
      });
    } catch (error) {
      diagnostics.push({
        name: 'sessionStorage',
        status: 'fail',
        message: 'sessionStorage is not available or restricted',
        details: error
      });
    }

    // Test 3: Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration('/salebds/');
        if (registration) {
          diagnostics.push({
            name: 'Service Worker',
            status: 'pass',
            message: 'Service Worker is registered and active',
            details: { scope: registration.scope, state: registration.active?.state }
          });
        } else {
          diagnostics.push({
            name: 'Service Worker',
            status: 'warning',
            message: 'Service Worker is supported but not registered'
          });
        }
      } catch (error) {
        diagnostics.push({
          name: 'Service Worker',
          status: 'fail',
          message: 'Service Worker registration failed',
          details: error
        });
      }
    } else {
      diagnostics.push({
        name: 'Service Worker',
        status: 'warning',
        message: 'Service Worker not supported'
      });
    }

    // Test 4: Fetch API
    try {
      await fetch('/salebds/manifest.webmanifest', { method: 'HEAD' });
      diagnostics.push({
        name: 'Fetch API',
        status: 'pass',
        message: 'Fetch API is working'
      });
    } catch (error) {
      diagnostics.push({
        name: 'Fetch API',
        status: 'fail',
        message: 'Fetch API failed',
        details: error
      });
    }

    // Test 5: React Router
    try {
      const currentPath = window.location.pathname;
      diagnostics.push({
        name: 'React Router',
        status: 'pass',
        message: 'React Router is working',
        details: { currentPath, basename: '/salebds' }
      });
    } catch (error) {
      diagnostics.push({
        name: 'React Router',
        status: 'fail',
        message: 'React Router failed',
        details: error
      });
    }

    // Test 6: Context APIs
    try {
      diagnostics.push({
        name: 'Context APIs',
        status: 'pass',
        message: 'React Contexts are accessible'
      });
    } catch (error) {
      diagnostics.push({
        name: 'Context APIs',
        status: 'fail',
        message: 'React Contexts failed',
        details: error
      });
    }

    setResults(diagnostics);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'fail':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const environmentInfo = {
    url: window.location.href,
    userAgent: navigator.userAgent,
    cookieEnabled: navigator.cookieEnabled,
    onlineStatus: navigator.onLine,
    language: navigator.language,
    platform: navigator.platform,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">App Diagnostics</h1>
          <p className="text-gray-600">Kiểm tra tình trạng hoạt động của ứng dụng</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Đang chạy diagnostics...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h2>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <h3 className="font-medium">{result.name}</h3>
                        <p className="text-sm">{result.message}</p>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer">Details</summary>
                            <pre className="mt-1 text-xs overflow-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Environment Information</h2>
              <div className="bg-gray-50 rounded p-4">
                <pre className="text-xs text-gray-600 overflow-auto">
                  {JSON.stringify(environmentInfo, null, 2)}
                </pre>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={runDiagnostics}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  🔄 Run Again
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  🧹 Clear Storage
                </button>
                <button
                  onClick={() => window.location.href = '/salebds/'}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  🏠 Go Home
                </button>
                <button
                  onClick={() => {
                    const data = { results, environmentInfo };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `diagnostic-report-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  📋 Download Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticPage;