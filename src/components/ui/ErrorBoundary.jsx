import { Component } from 'react';
import { RotateCcw, Home, AlertCircle, ChevronDown, ChevronUp, Copy, Check, Sparkles } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TaskFlow caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleCopy = () => {
    const errorText = `${this.state.error?.toString()}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || ''}`;
    navigator.clipboard.writeText(errorText);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails, copied } = this.state;
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 text-slate-800 antialiased font-sans relative overflow-hidden">
          {/* Elegant modern decorative background glow & grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-100/60 blur-3xl pointer-events-none" />

          <div className="w-full max-w-lg relative z-10 animate-fadeIn">
            {/* Main Crisp White Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-10 text-center border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-sm">
              
              {/* Modern Soft Badge & Icon */}
              <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-rose-500/10 animate-ping opacity-25" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-rose-50 to-rose-100/80 border border-rose-200/70 flex items-center justify-center shadow-inner text-rose-500">
                  <AlertCircle size={38} strokeWidth={1.8} />
                </div>
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[12px] font-semibold tracking-wide uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Application Error
              </div>

              {/* Title & Description */}
              <h1 className="text-[24px] sm:text-[26px] font-bold text-slate-900 tracking-tight">
                Something went wrong
              </h1>
              <p className="text-[14px] text-slate-500 mt-2.5 leading-relaxed max-w-md mx-auto">
                We encountered an unexpected issue while rendering this view. Don't worry, your work and records remain completely safe.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
                <button
                  onClick={this.handleReload}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-[13.5px] shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <RotateCcw size={15} />
                  <span>Reload Application</span>
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium text-[13.5px] border border-slate-200/80 flex items-center justify-center gap-2 transition-all"
                >
                  <Home size={15} />
                  <span>Go to Dashboard</span>
                </button>
              </div>

              {/* Expandable Technical Debug Section */}
              {error && (
                <div className="mt-8 pt-5 border-t border-slate-100 text-left">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => this.setState((s) => ({ showDetails: !s.showDetails }))}
                      className="text-[12px] font-medium text-slate-400 hover:text-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Technical info</span>
                      {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    {showDetails && (
                      <button
                        type="button"
                        onClick={this.handleCopy}
                        className="text-[12px] font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy error</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {showDetails && (
                    <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11.5px] font-mono text-slate-600 overflow-x-auto max-h-48 whitespace-pre-wrap break-all shadow-inner select-all">
                      <p className="font-semibold text-rose-600">{error.toString()}</p>
                      {errorInfo?.componentStack && (
                        <p className="mt-2 text-slate-400 text-[10.5px] border-t border-slate-200/50 pt-2">
                          {errorInfo.componentStack}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Clean Modern Footer */}
            <div className="flex items-center justify-center gap-2 mt-5 text-[12.5px] text-slate-400 font-medium">
              <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                TF
              </span>
              <span>TaskFlow Workspace System</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
