import React from 'react';

interface SafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<any>;
  onError?: (error: Error) => void;
  componentName?: string;
}

interface SafeComponentState {
  hasError: boolean;
  error?: Error;
}

class SafeComponent extends React.Component<SafeComponentProps, SafeComponentState> {
  constructor(props: SafeComponentProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SafeComponentState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`SafeComponent Error in ${this.props.componentName || 'Unknown'}:`, error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} />;
      }
      
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Lỗi tải {this.props.componentName || 'component'}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Có lỗi xảy ra khi hiển thị nội dung này. Vui lòng thử tải lại trang.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components safely
export function withSafeComponent<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    fallback?: React.ComponentType<any>;
    componentName?: string;
  }
) {
  const SafeWrappedComponent = (props: P) => (
    <SafeComponent 
      fallback={options?.fallback} 
      componentName={options?.componentName || WrappedComponent.displayName || WrappedComponent.name}
    >
      <WrappedComponent {...props} />
    </SafeComponent>
  );

  SafeWrappedComponent.displayName = `withSafeComponent(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return SafeWrappedComponent;
}

export default SafeComponent;