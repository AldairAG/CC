import { useEffect } from 'react';
import { useApuestasDeportivas } from '../../hooks/useApuestasDeportivas';

const EstadisticasApuestas = () => {
  const {
    estadisticasApuestas,
    resumenEstadisticas,
    loadEstadisticasApuestas,
    loading,
    errors
  } = useApuestasDeportivas();

  useEffect(() => {
    loadEstadisticasApuestas();
  }, [loadEstadisticasApuestas]);

  if (loading.estadisticas) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errors.estadisticas) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <div className="text-4xl mb-2">⚠️</div>
          <p>Error al cargar estadísticas: {errors.estadisticas}</p>
        </div>
      </div>
    );
  }

  if (!estadisticasApuestas) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p>No hay estadísticas disponibles</p>
        </div>
      </div>
    );
  }

  const calcularPorcentajeGanadas = () => {
    if (estadisticasApuestas.totalApuestas === 0) return 0;
    return ((estadisticasApuestas.apuestasGanadas / estadisticasApuestas.totalApuestas) * 100).toFixed(1);
  };

  const calcularPromedioApuesta = () => {
    if (estadisticasApuestas.totalApuestas === 0) return 0;
    return (estadisticasApuestas.montoTotalApostado / estadisticasApuestas.totalApuestas).toFixed(2);
  };

  const getRentabilidadColor = (rentabilidad: number) => {
    if (rentabilidad > 0) return 'text-green-600 dark:text-green-400';
    if (rentabilidad < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getRentabilidadIcon = (rentabilidad: number) => {
    if (rentabilidad > 0) return '📈';
    if (rentabilidad < 0) return '📉';
    return '➖';
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <span className="mr-2">📊</span>
          Estadísticas Generales
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total de Apuestas */}
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {estadisticasApuestas.totalApuestas}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Apuestas</p>
          </div>

          {/* Monto Total Apostado */}
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${estadisticasApuestas.montoTotalApostado.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Apostado</p>
          </div>

          {/* Apuestas Ganadas */}
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏆</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {estadisticasApuestas.apuestasGanadas}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ganadas ({calcularPorcentajeGanadas()}%)
            </p>
          </div>

          {/* Rentabilidad */}
          <div className="text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">{getRentabilidadIcon(estadisticasApuestas.rentabilidad)}</span>
            </div>
            <p className={`text-2xl font-bold ${getRentabilidadColor(estadisticasApuestas.rentabilidad)}`}>
              {estadisticasApuestas.rentabilidad > 0 ? '+' : ''}{estadisticasApuestas.rentabilidad.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rentabilidad</p>
          </div>
        </div>
      </div>

      {/* Desglose detallado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estado de las apuestas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Estado de Apuestas
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ganadas</span>
              <div className="flex items-center">
                <span className="text-green-600 dark:text-green-400 font-medium mr-2">
                  {estadisticasApuestas.apuestasGanadas}
                </span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(estadisticasApuestas.apuestasGanadas / estadisticasApuestas.totalApuestas) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Perdidas</span>
              <div className="flex items-center">
                <span className="text-red-600 dark:text-red-400 font-medium mr-2">
                  {estadisticasApuestas.apuestasPerdidas}
                </span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(estadisticasApuestas.apuestasPerdidas / estadisticasApuestas.totalApuestas) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Pendientes</span>
              <div className="flex items-center">
                <span className="text-yellow-600 dark:text-yellow-400 font-medium mr-2">
                  {estadisticasApuestas.apuestasPendientes}
                </span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(estadisticasApuestas.apuestasPendientes / estadisticasApuestas.totalApuestas) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas adicionales */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Métricas Adicionales
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Promedio por apuesta</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${calcularPromedioApuesta()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Ganancia total</span>
              <span className={`font-medium ${getRentabilidadColor(estadisticasApuestas.gananciaTotal)}`}>
                {estadisticasApuestas.gananciaTotal > 0 ? '+' : ''}${estadisticasApuestas.gananciaTotal.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tasa de éxito</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {calcularPorcentajeGanadas()}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">ROI</span>
              <span className={`font-medium ${getRentabilidadColor(estadisticasApuestas.rentabilidad)}`}>
                {estadisticasApuestas.rentabilidad > 0 ? '+' : ''}{estadisticasApuestas.rentabilidad.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen adicional si está disponible */}
      {resumenEstadisticas && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎯 Resumen de Rendimiento
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {resumenEstadisticas.total}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {resumenEstadisticas.porcentajeExito.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">% de éxito</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${resumenEstadisticas.montoTotal.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monto total</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstadisticasApuestas;
