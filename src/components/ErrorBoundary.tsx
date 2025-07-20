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
          <div className="p-4 bg-red-100 text-red-700 text-center">
            <p>Something went wrong.</p>
            <button onClick={this.handleReset}>Try Again</button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
