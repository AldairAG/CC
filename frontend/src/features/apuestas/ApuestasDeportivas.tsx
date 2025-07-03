import { useState, useEffect } from 'react';
import { useApuestasDeportivas } from '../../hooks/useApuestasDeportivas';
import { useEvento } from '../../hooks/useEvento';
import CrearApuestaForm from '../../components/forms/CrearApuestaForm';
import { EstadoApuesta } from '../../types/ApuestaType';

const ApuestasDeportivas = () => {
  const {
    estadisticasApuestas,
    apuestasRecientes,
    loadEstadisticasApuestas,
    loadApuestasRecientes,
    isLoadingMisApuestas,
    errorMisApuestas
  } = useApuestasDeportivas();

  const { eventos, cargarEventosProximos } = useEvento();

  const [mostrarCrearApuesta, setMostrarCrearApuesta] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<number | undefined>();

  useEffect(() => {
    loadEstadisticasApuestas();
    loadApuestasRecientes(5);
    cargarEventosProximos();
  }, [loadEstadisticasApuestas, loadApuestasRecientes, cargarEventosProximos]);

  const handleCrearApuesta = (eventoId?: number) => {
    setEventoSeleccionado(eventoId);
    setMostrarCrearApuesta(true);
  };

  const handleApuestaCreada = () => {
    loadApuestasRecientes(5);
    loadEstadisticasApuestas();
    setMostrarCrearApuesta(false);
    setEventoSeleccionado(undefined);
  };

  const getEstadoBadgeColor = (estado: EstadoApuesta): string => {
    switch (estado) {
      case EstadoApuesta.PENDIENTE:
        return 'bg-yellow-100 text-yellow-800';
      case EstadoApuesta.ACEPTADA:
        return 'bg-blue-100 text-blue-800';
      case EstadoApuesta.RESUELTA:
        return 'bg-green-100 text-green-800';
      case EstadoApuesta.CANCELADA:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🎯 Apuestas Deportivas
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus apuestas y explora nuevas oportunidades
          </p>
        </div>
        <button
          onClick={() => handleCrearApuesta()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Nueva Apuesta</span>
        </button>
      </div>

      {/* Estadísticas Rápidas */}
      {estadisticasApuestas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total
                </h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {estadisticasApuestas.totalApuestas}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Apostado
                </h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${estadisticasApuestas.montoTotalApostado.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ganadas
                </h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {estadisticasApuestas.apuestasGanadas}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <span className="text-2xl">
                  {estadisticasApuestas.rentabilidad > 0 ? '📈' : estadisticasApuestas.rentabilidad < 0 ? '📉' : '➖'}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ROI
                </h3>
                <p className={`text-3xl font-bold ${
                  estadisticasApuestas.rentabilidad > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : estadisticasApuestas.rentabilidad < 0 
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {estadisticasApuestas.rentabilidad > 0 ? '+' : ''}{estadisticasApuestas.rentabilidad.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Eventos Disponibles */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="mr-2">⚽</span>
              Eventos Próximos
            </h3>
          </div>
          <div className="p-6">
            {eventos.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📅</div>
                <p className="text-gray-600 dark:text-gray-400">
                  No hay eventos próximos disponibles
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventos.slice(0, 5).map((evento) => (
                  <div
                    key={evento.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {evento.equipoLocal} vs {evento.equipoVisitante}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {evento.deporte} • {evento.liga}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(evento.fechaEvento).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCrearApuesta(evento.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Apostar
                      </button>
                    </div>
                  </div>
                ))}
                {eventos.length > 5 && (
                  <div className="text-center pt-4">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                      Ver todos los eventos →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Apuestas Recientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="mr-2">📋</span>
              Apuestas Recientes
            </h3>
          </div>
          <div className="p-6">
            {isLoadingMisApuestas ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando...</p>
              </div>
            ) : errorMisApuestas ? (
              <div className="text-center py-8">
                <div className="text-red-400 text-4xl mb-2">⚠️</div>
                <p className="text-red-600 dark:text-red-400">{errorMisApuestas}</p>
              </div>
            ) : apuestasRecientes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">🎯</div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No tienes apuestas recientes
                </p>
                <button
                  onClick={() => handleCrearApuesta()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Crear tu primera apuesta
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {apuestasRecientes.map((apuesta) => (
                  <div
                    key={apuesta.apuestaId}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {apuesta.eventoNombre}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {apuesta.tipoApuesta} • {apuesta.prediccion}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadgeColor(apuesta.estado)}`}>
                        {apuesta.estado}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Apostado: ${apuesta.montoApostado.toLocaleString()}
                      </span>
                      {apuesta.ganancia !== undefined && (
                        <span className={`font-medium ${
                          apuesta.ganancia > 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {apuesta.ganancia > 0 ? '+' : ''}${apuesta.ganancia.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    Ver todas mis apuestas →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🚀 Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleCrearApuesta()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-left transition-colors"
          >
            <div className="text-2xl mb-2">➕</div>
            <h4 className="font-semibold mb-1">Nueva Apuesta</h4>
            <p className="text-sm opacity-90">Crea una nueva apuesta deportiva</p>
          </button>
          
          <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-left transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold mb-1">Ver Estadísticas</h4>
            <p className="text-sm opacity-90">Revisa tu rendimiento completo</p>
          </button>
          
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-left transition-colors">
            <div className="text-2xl mb-2">📋</div>
            <h4 className="font-semibold mb-1">Mis Apuestas</h4>
            <p className="text-sm opacity-90">Gestiona todas tus apuestas</p>
          </button>
        </div>
      </div>

      {/* Modal de Crear Apuesta */}
      {mostrarCrearApuesta && (
        <CrearApuestaForm
          isOpen={mostrarCrearApuesta}
          onClose={() => {
            setMostrarCrearApuesta(false);
            setEventoSeleccionado(undefined);
          }}
          eventoId={eventoSeleccionado}
          onApuestaCreada={handleApuestaCreada}
        />
      )}
    </div>
  );
};

export default ApuestasDeportivas;
