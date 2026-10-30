import * as React from "react";

export class ErrorBoundary extends React.Component {
  constructor(t) {
    super(t);
    this.state = {
      hasError: false,
      error: null,
    };
  }
  static getDerivedStateFromError(t) {
    return {
      hasError: true,
      error: t,
    };
  }
  componentDidCatch(t, e) {
    console.error("Uncaught error:", t, e);
  }
  render() {
    if (this.state.hasError) {
      let s = "Ocorreu um erro inesperado.";
      try {
        if (this.state.error?.message) {
          const i = JSON.parse(this.state.error.message);
          if (i.error) {
            s = i.error;
          }
        }
      } catch {
        s = this.state.error?.message || s;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-primary text-white p-4">
          <div className="bg-white/10 p-8 rounded-2xl max-w-lg w-full text-center border border-white/20">
            <h2 className="text-2xl font-title text-palette-yellow mb-4">
              Ops! Algo deu errado.
            </h2>
            <p className="text-white/80 mb-6">{s}</p>
            <button
              className="bg-palette-yellow text-primary font-bold py-2 px-6 rounded-full hover:bg-white transition-colors"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
