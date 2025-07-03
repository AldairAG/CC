import { useEffect } from 'react';
import { useApuestasDeportivas } from '../../hooks/useApuestasDeportivas';
import { EstadoApuesta } from '../../types/ApuestaType';

interface DetalleApuestaProps {
  apuestaId: number;
  isOpen: boolean;
  onClose: () => void;
  onCancelar?: (apuestaId: number) => void;
}

const DetalleApuesta = ({ apuestaId, isOpen, onClose, onCancelar }: DetalleApuestaProps) => {
  const {
    apuestaActual,
    loading,
    errors,
    loadApuestaDetail,
    clearCurrentApuesta,
    canCancelApuesta
  } = useApuestasDeportivas();

  useEffect(() => {
    if (isOpen && apuestaId) {
      loadApuestaDetail(apuestaId);
    }
  }, [isOpen, apuestaId, loadApuestaDetail]);

  useEffect(() => {
    return () => {
      clearCurrentApuesta();
    };
  }, [clearCurrentApuesta]);

  const getEstadoBadgeColor = (estado: EstadoApuesta): string => {
    switch (estado) {
      case EstadoApuesta.PENDIENTE:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case EstadoApuesta.ACEPTADA:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case EstadoApuesta.RESUELTA:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case EstadoApuesta.CANCELADA:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getResultadoIcon = (esGanadora?: boolean) => {
    if (esGanadora === undefined) return '⏳';
    return esGanadora ? '🏆' : '❌';
  };

  const handleCancelar = () => {
    if (apuestaActual && onCancelar) {
      onCancelar(apuestaActual.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎯 Detalle de Apuesta
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Loading */}
          {loading.apuestaActual && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando detalle...</p>
            </div>
          )}

          {/* Error */}
          {errors.apuestaActual && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.apuestaActual}
            </div>
          )}

          {/* Contenido */}
          {apuestaActual && (
            <div className="space-y-6">
              {/* Estado y Resultado */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadgeColor(apuestaActual.estado)}`}>
                      {apuestaActual.estado}
                    </span>
                    <div className="text-2xl">
                      {getResultadoIcon(apuestaActual.esGanadora)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID de Apuesta</p>
                    <p className="font-mono text-lg"># {apuestaActual.id}</p>
                  </div>
                </div>
              </div>

              {/* Información del Evento */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📅 Información del Evento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      {apuestaActual.eventoDeportivo.equipoLocal} vs {apuestaActual.eventoDeportivo.equipoVisitante}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {apuestaActual.eventoDeportivo.deporte} • {apuestaActual.eventoDeportivo.liga}
                    </p>
                    {apuestaActual.eventoDeportivo.descripcion && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {apuestaActual.eventoDeportivo.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estado del Evento</p>
                    <p className="font-medium">{apuestaActual.eventoDeportivo.estado}</p>
                    {apuestaActual.eventoDeportivo.resultado && (
                      <>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Resultado</p>
                        <p className="font-medium">{apuestaActual.eventoDeportivo.resultado}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Detalles de la Apuesta */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  💰 Detalles de la Apuesta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de Apuesta</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {apuestaActual.tipoApuesta.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Predicción</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {apuestaActual.prediccion}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cuota</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {apuestaActual.valorCuotaMomento.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monto Apostado</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${apuestaActual.montoApostado.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ganancia Potencial</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${(apuestaActual.montoPotencialGanancia || 0).toLocaleString()}
                    </p>
                  </div>
                  {apuestaActual.montoGanancia !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ganancia Real</p>
                      <p className={`text-xl font-bold ${
                        apuestaActual.montoGanancia > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        ${apuestaActual.montoGanancia.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {apuestaActual.descripcion && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Descripción</p>
                    <p className="text-gray-900 dark:text-white">{apuestaActual.descripcion}</p>
                  </div>
                )}
              </div>

              {/* Historial de Fechas */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📅 Historial
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fecha de creación:</span>
                    <span className="font-medium">
                      {new Date(apuestaActual.fechaCreacion).toLocaleString()}
                    </span>
                  </div>
                  {apuestaActual.fechaActualizacion && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Última actualización:</span>
                      <span className="font-medium">
                        {new Date(apuestaActual.fechaActualizacion).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {apuestaActual.fechaResolucion && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fecha de resolución:</span>
                      <span className="font-medium">
                        {new Date(apuestaActual.fechaResolucion).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Historial de Cambios */}
              {apuestaActual.historialCambios && apuestaActual.historialCambios.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📝 Historial de Cambios
                  </h3>
                  <div className="space-y-3">
                    {apuestaActual.historialCambios.map((cambio) => (
                      <div key={cambio.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {cambio.estadoAnterior} → {cambio.estadoNuevo}
                            </p>
                            {cambio.comentario && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {cambio.comentario}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(cambio.fechaCambio).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cerrar
                </button>
                {canCancelApuesta(apuestaActual) && onCancelar && (
                  <button
                    onClick={handleCancelar}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancelar Apuesta
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleApuesta;
