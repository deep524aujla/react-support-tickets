import { Component } from 'react';
import { Button } from '@/components/ui/Button';

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
          <p className="max-w-md text-slate-600">An unexpected error occurred. Try reloading the page.</p>
          <Button onClick={() => window.location.assign('/')}>Go home</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
