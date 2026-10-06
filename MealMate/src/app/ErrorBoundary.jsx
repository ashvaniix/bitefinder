import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("MealMate encountered an unexpected rendering error.", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center bg-surface-base px-6 text-center text-ink">
          <h1 className="text-2xl font-semibold text-brand dark:text-brand-soft">MealMate hit a snag</h1>
          <p className="mt-3 text-sm text-muted">
            Something unexpected happened. Reload MealMate to continue.
          </p>
          <button
            className="mt-6 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50"
            onClick={() => window.location.reload()}
            type="button"
          >
            Reload MealMate
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
