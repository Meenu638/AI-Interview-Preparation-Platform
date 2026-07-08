import { Component } from 'react';
import { FiAlertTriangle, FiInbox } from 'react-icons/fi';

export const Card = ({ children, className = '', hover = false }) => (
  <div className={`glass-card p-6 ${hover ? 'hover:border-primary-500/50 transition-colors' : ''} ${className}`}>
    {children}
  </div>
);

export const Skeleton = ({ className = '' }) => <div className={`skeleton ${className}`} />;

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full bg-surface-light flex items-center justify-center mb-4 text-gray-400 text-2xl">
      {icon || <FiInbox />}
    </div>
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-400 max-w-sm mb-4">{description}</p>}
    {action}
  </div>
);

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
          <FiAlertTriangle className="text-4xl text-amber-400 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">Something went wrong</h3>
          <p className="text-sm text-gray-400">Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
