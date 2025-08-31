import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex h-screen items-center justify-center bg-slate-50 p-4"
          role="alert"
        >
          <div className="w-full max-w-md rounded-lg bg-red-50 p-6 shadow-md border border-red-200">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.598 4.5H4.644C2.34 20.251.896 17.751 2.05 15.751L9.4 3.003ZM12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm1-5a1 1 0 0 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                  clipRule="evenodd"
                />
              </svg>

              <h2 className="text-xl font-bold text-red-800">
                Something went wrong
              </h2>
            </div>

            <p className="mt-4 text-red-700">
              An unexpected error occurred. We have been notified and are the
              issue.
            </p>

            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-6 w-full rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
