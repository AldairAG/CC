import { useState } from 'react';
import { useCarritoApuestas } from '../../hooks/useCarritoApuestas';
import CarritoApuestasSidebar from './CarritoApuestasSidebar';

const CarritoFlotante = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { slips, estadisticas } = useCarritoApuestas();

  if (slips.length === 0) return null;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 xl:hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-4 rounded-full shadow-casino z-50 transition-all duration-200 transform hover:scale-110"
      >
        <div className="relative">
          <span className="text-2xl">🎯</span>
          {slips.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {slips.length}
            </span>
          )}
        </div>
      </button>

      {/* Overlay y modal */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal del carrito */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-dark-800 z-50 xl:hidden overflow-hidden">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 border-b border-primary-600/30 bg-dark-900">
              <h3 className="text-lg font-bold text-primary-400 flex items-center gap-2">
                🎯 Carrito de Apuestas
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            {/* Contenido del carrito */}
            <div className="h-full pb-20 overflow-hidden">
              <CarritoApuestasSidebar />
            </div>

            {/* Footer con resumen */}
            {slips.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-dark-900 border-t border-primary-600/30 p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total:</span>
                  <span className="font-semibold text-white">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN'
                    }).format(estadisticas.totalApostado)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-gray-500">{slips.length} apuesta{slips.length > 1 ? 's' : ''}</span>
                  <span className="text-green-400">
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
