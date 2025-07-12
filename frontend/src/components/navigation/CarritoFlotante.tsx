import { useState } from 'react';
import { useCarritoApuestas } from '../../hooks/useCarritoApuestas';
import CarritoApuestasSidebar from './CarritoApuestasSidebar';

const CarritoFlotante = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { slips, estadisticas } = useCarritoApuestas();

  if (slips.length === 0) return null;

  return (
    <>
      {/* Botón flotante - Estilo moderno */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 xl:hidden bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white p-4 rounded-2xl shadow-2xl z-50 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm border border-amber-500/30 hover:border-amber-400/50"
      >
        <div className="relative">
          <span className="text-2xl">🎯</span>
          {slips.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse border-2 border-white/20">
              {slips.length}
            </span>
          )}
        </div>
      </button>

      {/* Overlay y modal - Estilo moderno */}
      {isOpen && (
        <>
          {/* Overlay con backdrop blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal del carrito moderno */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-gradient-to-br from-slate-800/95 via-slate-800/98 to-slate-900/95 backdrop-blur-xl z-50 xl:hidden overflow-hidden border-l border-amber-500/20 shadow-2xl">
            {/* Header del modal moderno */}
            <div className="flex items-center justify-between p-4 border-b border-amber-500/20 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
              <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-2">
                🎯 Carrito de Apuestas
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del carrito */}
            <div className="h-full pb-20 overflow-hidden">
              <CarritoApuestasSidebar />
            </div>

            {/* Footer con resumen moderno */}
            {slips.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-t border-amber-500/20 p-4 shadow-2xl">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total:</span>
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN'
                    }).format(estadisticas.totalApostado)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-slate-500">{slips.length} apuesta{slips.length > 1 ? 's' : ''}</span>
                  <span className="text-green-400 font-semibold">
                    Ganancia: {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN'
                    }).format(estadisticas.gananciasPotencialesSimples)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CarritoFlotante;
