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
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF7ED] text-[#3D231E] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-sm border border-[#E5D2CE] text-center space-y-4">
            <h1 className="font-display text-3xl font-semibold text-[#59352F]">
              Ha ocurrido un error inesperado
            </h1>
            <p className="text-sm text-[#80605A] leading-relaxed">
              No se pudo cargar correctamente la vista de Bruder BK. Puedes recargar la página o contactarnos directamente por WhatsApp.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl bg-[#59352F] text-[#FFF7ED] text-sm font-medium hover:bg-[#472924] transition-colors cursor-pointer"
              >
                Recargar página
              </button>
              <a
                href="https://wa.me/34603335705?text=%C2%A1Hola!%20Me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20sus%20productos%20de%20Bruder%20BK."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#167943] text-white text-sm font-medium hover:bg-[#126437] transition-colors"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
