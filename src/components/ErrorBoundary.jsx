import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('tueste_store_cart');
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F3EDE4] text-[#30231C] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#EBE4DA] border border-[#DED3C5] text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-black text-2xl text-[#30231C]">
              Recuperación de Estado
            </h2>
            <p className="text-xs text-[#665348] leading-relaxed">
              Ocurrió una inconsistencia en el estado temporal de la aplicación. Haz clic abajo para restaurar la tienda a su estado limpio.
            </p>
            <div className="p-3 bg-red-50 text-red-800 text-[11px] font-mono rounded-xl border border-red-200 text-left overflow-x-auto max-h-32">
              {this.state.error?.message || 'Error desconocido'}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-xl bg-[#F5B700] hover:bg-[#e0a700] text-[#30231C] font-black text-xs transition flex items-center justify-center gap-2 shadow-md shadow-[#F5B700]/25"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restablecer y Recargar Tienda</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
