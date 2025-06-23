import React from 'react';
import { useCarritoApuestas } from '../../hooks/useCarritoApuestas';

interface CarritoApuestasProps {
  className?: string;
}

const CarritoApuestas: React.FC<CarritoApuestasProps> = ({ className = '' }) => {
  const {
    apuestas,
    isOpen,
    totalApuestas,
    totalMonto,
    totalGananciaPotencial,
    isCreating,
    error,
    hayApuestas,
    removerApuestaDelCarrito,
    actualizarMonto,
    limpiarTodoElCarrito,
    procesarApuestas,
    cerrarCarritoApuestas,
    formatearDinero,
    obtenerNombreTipoApuesta,
    limpiarError
  } = useCarritoApuestas();

  const handleProcesarApuestas = async () => {
    const exito = await procesarApuestas();
    if (exito) {
      // Mostrar mensaje de éxito o redirigir
      alert('¡Apuestas creadas exitosamente!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={cerrarCarritoApuestas}
      />
      
      {/* Panel del carrito */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛒</span>
                <h2 className="text-xl font-bold">Carrito de Apuestas</h2>
              </div>
              <button
                onClick={cerrarCarritoApuestas}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="font-semibold">{totalApuestas}</div>
                <div className="opacity-80">Apuestas</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{formatearDinero(totalMonto)}</div>
                <div className="opacity-80">Total</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{formatearDinero(totalGananciaPotencial)}</div>
                <div className="opacity-80">Ganancia</div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <div className="flex items-start">
                <span className="text-red-500 text-lg mr-2">⚠️</span>
                <div className="flex-1">
                  <p className="text-red-700 text-sm">{error}</p>
                  <button
                    onClick={limpiarError}
                    className="text-red-600 text-xs underline mt-1"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!hayApuestas ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
                <span className="text-6xl mb-4">🛒</span>
                <h3 className="text-lg font-semibold mb-2">Carrito vacío</h3>
                <p className="text-center text-sm">
                  Agrega apuestas desde los eventos deportivos
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {apuestas.map((apuesta) => (
                  <div key={apuesta.id} className="bg-gray-50 rounded-lg p-4 border">
                    {/* Header de la apuesta */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-800">
                          {apuesta.equipoLocal} vs {apuesta.equipoVisitante}
                        </h3>                        <p className="text-xs text-gray-500 mt-1">
                          {obtenerNombreTipoApuesta(apuesta.tipoApuesta as keyof typeof import('../../hooks/useCarritoApuestas').TIPOS_APUESTA)}
                        </p>
                      </div>
                      <button
                        onClick={() => removerApuestaDelCarrito(apuesta.id)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Predicción */}
                    <div className="mb-3">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {apuesta.prediccionUsuario}
                      </div>
                    </div>

                    {/* Cuota y monto */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Cuota</label>
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-bold text-center">
                          {apuesta.cuota.toFixed(2)}x
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Monto</label>
                        <input
                          type="number"
                          min="1"
                          max="10000"
                          value={apuesta.montoApuesta}
                          onChange={(e) => actualizarMonto(apuesta.id, Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm text-center"
                        />
                      </div>
                    </div>

                    {/* Ganancia potencial */}
                    <div className="text-center pt-2 border-t">
                      <span className="text-xs text-gray-600">Ganancia potencial: </span>
                      <span className="font-bold text-green-600">
                        {formatearDinero(apuesta.gananciaPotencial)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer con acciones */}
          {hayApuestas && (
            <div className="border-t bg-gray-50 p-4 space-y-3">
              {/* Resumen total */}
              <div className="bg-white rounded-lg p-3 border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total a apostar:</span>
                  <span className="font-bold text-lg">{formatearDinero(totalMonto)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ganancia posible:</span>
                  <span className="font-bold text-lg text-green-600">
                    {formatearDinero(totalGananciaPotencial)}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-2">
                <button
                  onClick={limpiarTodoElCarrito}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  disabled={isCreating}
                >
                  Limpiar Todo
                </button>
                <button
                  onClick={handleProcesarApuestas}
                  disabled={isCreating}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    'Apostar Todo'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarritoApuestas;
