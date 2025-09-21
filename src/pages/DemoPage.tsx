import React, { useState, useEffect } from 'react';
import { errorRecoverySystem } from '../core/ErrorRecoverySystem';
import { authSystem } from '../core/AuthenticationSystem';
import { stateManager } from '../core/StateManagementSystem';
import { apiLayer } from '../core/APILayer';

export const DemoPage: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<any>({});
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runSystemTests = async () => {
    try {
      addTestResult('🚀 Starting system tests...');

      // Test Error Recovery System
      try {
        const errorStatus = errorRecoverySystem.getSystemStatus();
        addTestResult(`✅ Error Recovery System: ${errorStatus.isHealthy ? 'Healthy' : 'Issues detected'}`);
      } catch (error) {
        addTestResult(`❌ Error Recovery System: ${error}`);
      }

      // Test State Management System
      try {
        const state = stateManager.getState();
        addTestResult(`✅ State Management: Initialized with ${Object.keys(state).length} modules`);
        
        // Test dispatch
        stateManager.dispatch({
          type: 'UI_ADD_NOTIFICATION',
          payload: {
            id: 'test-notification',
            type: 'info',
            title: 'System Test',
            message: 'State management is working!',
            createdAt: Date.now()
          }
        });
        addTestResult('✅ State dispatch: Notification added successfully');
      } catch (error) {
        addTestResult(`❌ State Management: ${error}`);
      }

      // Test Authentication System
      try {
        const authStatus = authSystem.isAuthenticated();
        addTestResult(`✅ Auth System: Status = ${authStatus ? 'Authenticated' : 'Not authenticated'}`);
        
        const profile = authSystem.getCurrentUser();
        addTestResult(`✅ Auth Profile: ${profile ? 'User loaded' : 'No user'}`);
      } catch (error) {
        addTestResult(`❌ Auth System: ${error}`);
      }

      // Test API Layer
      try {
        const apiMetrics = apiLayer.getMetrics();
        addTestResult(`✅ API Layer: ${apiMetrics.totalRequests} total requests processed`);
        
        const apiStatus = apiLayer.exportState();
        addTestResult(`✅ API Status: ${apiStatus.isOnline ? 'Online' : 'Offline'}, Cache size: ${apiStatus.cacheSize}`);
      } catch (error) {
        addTestResult(`❌ API Layer: ${error}`);
      }

      addTestResult('🎉 All system tests completed!');

    } catch (error) {
      addTestResult(`💥 Test suite failed: ${error}`);
    }
  };

  const testAPICall = async () => {
    try {
      addTestResult('🌐 Testing API call...');
      
      // Test API call with mock endpoint
      const response = await apiLayer.get('/test', {
        cache: { enabled: true, ttl: 60000 },
        offline: { enabled: true, fallbackData: { message: 'Offline fallback data' } }
      });
      
      addTestResult(`✅ API Call successful: ${JSON.stringify(response.data).substring(0, 100)}...`);
    } catch (error: any) {
      addTestResult(`⚠️ API Call failed (expected): ${error.message}`);
    }
  };

  const testErrorHandling = async () => {
    try {
      addTestResult('🔥 Testing error handling...');
      
      // Simulate an error
      const testError = new Error('Simulated test error');
      errorRecoverySystem.handleError(testError, {
        id: 'demo-error-' + Date.now(),
        timestamp: Date.now(),
        sessionId: 'demo-session',
        url: window.location.href,
        userAgent: navigator.userAgent,
        component: 'DemoPage',
        action: 'testErrorHandling',
        metadata: { testType: 'simulation' }
      });
      
      addTestResult('✅ Error handled and logged successfully');
    } catch (error) {
      addTestResult(`❌ Error handling failed: ${error}`);
    }
  };

  const testStateManagement = async () => {
    try {
      addTestResult('📊 Testing state management...');
      
      // Update UI state
      stateManager.dispatch({
        type: 'UI_SET_THEME',
        payload: { theme: 'dark' }
      });
      
      stateManager.dispatch({
        type: 'UI_SET_LOADING',
        payload: { isLoading: true, message: 'Processing demo...' }
      });
      
      setTimeout(() => {
        stateManager.dispatch({
          type: 'UI_SET_LOADING',
          payload: { isLoading: false, message: '' }
        });
      }, 2000);
      
      addTestResult('✅ State updates dispatched successfully');
    } catch (error) {
      addTestResult(`❌ State management test failed: ${error}`);
    }
  };

  useEffect(() => {
    const updateStatus = () => {
      setSystemStatus({
        errorRecovery: {
          healthy: errorRecoverySystem.getSystemStatus().isHealthy,
          errors: errorRecoverySystem.getSystemStatus().errorCount
        },
        auth: {
          authenticated: authSystem.isAuthenticated(),
          user: authSystem.getCurrentUser()?.email || 'None'
        },
        api: {
          online: navigator.onLine,
          metrics: apiLayer.getMetrics()
        },
        state: {
          modules: Object.keys(stateManager.getState()).length,
          initialized: true
        }
      });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 SaleBDS Advanced Systems Demo
          </h1>
          <p className="text-lg text-gray-600">
            Testing Error Recovery, Authentication, State Management, and API Layer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* System Status Cards */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-600">🛡️ Error Recovery</h3>
            <div className="space-y-2">
              <p className="text-sm">
                Status: <span className={systemStatus.errorRecovery?.healthy ? 'text-green-600' : 'text-red-600'}>
                  {systemStatus.errorRecovery?.healthy ? 'Healthy' : 'Issues'}
                </span>
              </p>
              <p className="text-sm">Errors: {systemStatus.errorRecovery?.errors || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">🔐 Authentication</h3>
            <div className="space-y-2">
              <p className="text-sm">
                Status: <span className={systemStatus.auth?.authenticated ? 'text-green-600' : 'text-yellow-600'}>
                  {systemStatus.auth?.authenticated ? 'Authenticated' : 'Guest'}
                </span>
              </p>
              <p className="text-sm">User: {systemStatus.auth?.user || 'None'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-600">📊 State Management</h3>
            <div className="space-y-2">
              <p className="text-sm">
                Status: <span className="text-green-600">
                  {systemStatus.state?.initialized ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p className="text-sm">Modules: {systemStatus.state?.modules || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-600">🌐 API Layer</h3>
            <div className="space-y-2">
              <p className="text-sm">
                Network: <span className={systemStatus.api?.online ? 'text-green-600' : 'text-red-600'}>
                  {systemStatus.api?.online ? 'Online' : 'Offline'}
                </span>
              </p>
              <p className="text-sm">Requests: {systemStatus.api?.metrics?.totalRequests || 0}</p>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">🧪 System Tests</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={runSystemTests}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              🔍 Run All Tests
            </button>
            <button
              onClick={testAPICall}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              🌐 Test API
            </button>
            <button
              onClick={testErrorHandling}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              🔥 Test Errors
            </button>
            <button
              onClick={testStateManagement}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              📊 Test State
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">📋 Test Results</h2>
            <button
              onClick={() => setTestResults([])}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-1 px-3 rounded transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click a test button to start!</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">🔧 System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Environment</h3>
              <div className="space-y-1 text-sm">
                <p><strong>URL:</strong> {window.location.href}</p>
                <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
                <p><strong>Language:</strong> {navigator.language}</p>
                <p><strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Performance</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Memory:</strong> {(performance as any).memory ? `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A'}</p>
                <p><strong>Connection:</strong> {(navigator as any).connection?.effectiveType || 'Unknown'}</p>
                <p><strong>Storage:</strong> {localStorage.length} items</p>
                <p><strong>Session:</strong> {sessionStorage.length} items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};