import React from 'react';
import { useCarritoApuestas } from '../../hooks/useCarritoApuestas';

interface BotonCarritoProps {
  className?: string;
}

const BotonCarrito: React.FC<BotonCarritoProps> = ({ className = '' }) => {
  const {
    totalApuestas,
    totalMonto,
    hayApuestas,
    toggleEstadoCarrito,
    formatearDinero
  } = useCarritoApuestas();

  if (!hayApuestas) return null;

  return (
    <button
      onClick={toggleEstadoCarrito}
      className={`fixed bottom-6 right-6 z-40 ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
        <div className="flex items-center space-x-3">
          {/* Icono del carrito */}
          <div className="relative">
            <span className="text-2xl">🛒</span>
            {totalApuestas > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {totalApuestas > 99 ? '99+' : totalApuestas}
              </div>
            )}
          </div>
          
          {/* Información del carrito */}
          <div className="hidden sm:block">
            <div className="text-sm font-semibold">
              {totalApuestas} {totalApuestas === 1 ? 'Apuesta' : 'Apuestas'}
            </div>
            <div className="text-xs opacity-90">
              {formatearDinero(totalMonto)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Efecto de pulso para llamar la atención */}
      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
    </button>
  );
};

export default BotonCarrito;
