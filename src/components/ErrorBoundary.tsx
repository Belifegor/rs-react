import { Component } from 'react';
import type { ReactNode } from 'react';
import type { PropsError, StateError } from '../types/types';

class ErrorBoundary extends Component<PropsError, StateError> {
  constructor(props: PropsError) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): StateError {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-8 bg-gray-500 rounded-xl text-white text-center">
            <p>
              <strong>Something went wrong.</strong>
            </p>
            <button
              onClick={this.handleReset}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
