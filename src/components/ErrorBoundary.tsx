import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected application error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-6 py-16">
          <div className="max-w-lg w-full bg-white border border-[#E2E6EC] p-8 shadow-sm">
            <p className="text-xs font-medium tracking-wider uppercase text-[#9E7E38] mb-2">
              Service Notice
            </p>
            <h1 className="font-display text-3xl font-semibold text-[#0B1D33] mb-3">
              Unable to Load This View
            </h1>
            <p className="text-sm text-[#525C68] leading-relaxed mb-6">
              We encountered an issue connecting to the property database or loading this page.
              Please reload the page or contact Frank Fu Feng Real Estate directly at 416-800-5898.
            </p>
            <div className="bg-[#F8F9FA] border border-[#E2E6EC] p-3 text-xs font-mono text-[#525C68] mb-6 break-words">
              {this.state.errorMessage}
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#0B1D33] text-white text-sm font-medium hover:bg-[#142D4C] transition-colors cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
