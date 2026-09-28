import React from 'react';

/**
 * Standard React Error Boundary component that catches render and lifecycle errors
 * anywhere in the child component tree and displays a graceful fallback UI.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AgriConnect ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // 1. Custom Fallback Component support (e.g. react-error-boundary style)
      if (this.props.FallbackComponent) {
        const FallbackComponent = this.props.FallbackComponent;
        return (
          <FallbackComponent
            error={this.state.error}
            resetErrorBoundary={this.resetErrorBoundary}
          />
        );
      }

      // 2. Custom fallback element support
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ error: this.state.error, reset: this.resetErrorBoundary })
          : this.props.fallback;
      }

      // 3. Default polished AgriConnect error fallback
      return (
        <div
          role="alert"
          style={{
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#F5F8F2'
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '2.25rem 2rem',
              boxShadow: '0 8px 30px rgba(20, 83, 45, 0.08)',
              border: '1px solid #DCE7DE',
              textAlign: 'center',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 1.25rem',
                backgroundColor: '#FEF3C7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                color: '#D97706',
                border: '2px solid #FDE68A'
              }}
            >
              ⚠️
            </div>

            <h3
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#173B2A',
                marginBottom: '0.5rem',
                letterSpacing: '-0.01em'
              }}
            >
              Something went wrong
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#6B7C72',
                lineHeight: 1.55,
                marginBottom: '1.5rem'
              }}
            >
              An unexpected error interrupted this part of AgriConnect. We prevented the entire application from crashing.
            </p>

            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                color: '#991B1B',
                textAlign: 'left',
                marginBottom: '1.5rem',
                wordBreak: 'break-word',
                fontFamily: 'ui-monospace, monospace'
              }}
            >
              <strong>Error:</strong> {this.state.error?.message || 'Unknown runtime error'}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '1rem'
              }}
            >
              <button
                type="button"
                onClick={this.resetErrorBoundary}
                style={{
                  backgroundColor: '#16803C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(22, 128, 60, 0.25)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#126630')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#16803C')}
              >
                ↻ Try Again
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#173B2A',
                  border: '1px solid #DCE7DE',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F5F8F2')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                Dashboard
              </button>
            </div>

            {this.state.errorInfo?.componentStack && (
              <div style={{ marginTop: '1.25rem', textAlign: 'left' }}>
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6B7C72',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  {this.state.showDetails ? 'Hide technical trace ▲' : 'Show technical trace ▼'}
                </button>
                {this.state.showDetails && (
                  <pre
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      color: '#4B5563',
                      overflowX: 'auto',
                      maxHeight: '180px',
                      border: '1px solid #E5E7EB'
                    }}
                  >
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
