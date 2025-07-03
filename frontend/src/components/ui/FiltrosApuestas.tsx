import { useState } from 'react';
import { useApuestasDeportivas } from '../../hooks/useApuestasDeportivas';
import { EstadoApuesta, TipoApuesta } from '../../types/ApuestaType';

interface FiltrosApuestasProps {
  onFiltrosChange?: () => void;
}

const FiltrosApuestas = ({ onFiltrosChange }: FiltrosApuestasProps) => {
  const {
    filtros,
    applyFilterByState,
    applyFilterByType,
    applyDateFilter,
    applyAmountFilter,
    applySearchFilter,
    clearAllFilters,
    tienesFiltrosActivos,
    contadorFiltrosActivos
  } = useApuestasDeportivas();

  const [isExpanded, setIsExpanded] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    busqueda: filtros.busqueda || '',
    fechaDesde: filtros.fechaDesde || '',
    fechaHasta: filtros.fechaHasta || '',
    montoMinimo: filtros.montoMinimo?.toString() || '',
    montoMaximo: filtros.montoMaximo?.toString() || ''
  });

  const handleEstadoChange = (estado: string) => {
    applyFilterByState(estado as EstadoApuesta || null);
    onFiltrosChange?.();
  };

  const handleTipoChange = (tipo: string) => {
    applyFilterByType(tipo as TipoApuesta || null);
    onFiltrosChange?.();
  };

  const handleSearchChange = (busqueda: string) => {
    setTempFilters(prev => ({ ...prev, busqueda }));
    applySearchFilter(busqueda);
    onFiltrosChange?.();
  };

  const handleDateChange = () => {
    applyDateFilter(
      tempFilters.fechaDesde || null,
      tempFilters.fechaHasta || null
    );
    onFiltrosChange?.();
  };

  const handleAmountChange = () => {
    applyAmountFilter(
      tempFilters.montoMinimo ? Number(tempFilters.montoMinimo) : null,
      tempFilters.montoMaximo ? Number(tempFilters.montoMaximo) : null
    );
    onFiltrosChange?.();
  };

  const handleClearAll = () => {
    clearAllFilters();
    setTempFilters({
      busqueda: '',
      fechaDesde: '',
      fechaHasta: '',
      montoMinimo: '',
      montoMaximo: ''
    });
    onFiltrosChange?.();
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header del filtro */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              🔍 Filtros
            </h3>
            {tienesFiltrosActivos && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                {contadorFiltrosActivos} activo{contadorFiltrosActivos !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {tienesFiltrosActivos && (
              <button
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              >
                Limpiar todo
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {isExpanded ? '🔼' : '🔽'}
            </button>
          </div>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Búsqueda */}
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Buscar por evento, predicción..."
              value={tempFilters.busqueda}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          {/* Estado */}
          <select
            value={filtros.estado || ''}
            onChange={(e) => handleEstadoChange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Todos los estados</option>
            <option value={EstadoApuesta.PENDIENTE}>Pendiente</option>
            <option value={EstadoApuesta.ACEPTADA}>Aceptada</option>
            <option value={EstadoApuesta.RESUELTA}>Resuelta</option>
            <option value={EstadoApuesta.CANCELADA}>Cancelada</option>
            <option value={EstadoApuesta.RECHAZADA}>Rechazada</option>
          </select>

          {/* Tipo */}
          <select
            value={filtros.tipoApuesta || ''}
            onChange={(e) => handleTipoChange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Todos los tipos</option>
            <option value={TipoApuesta.RESULTADO_GENERAL}>Resultado General</option>
            <option value={TipoApuesta.RESULTADO_EXACTO}>Resultado Exacto</option>
            <option value={TipoApuesta.TOTAL_GOLES}>Total Goles</option>
            <option value={TipoApuesta.AMBOS_EQUIPOS_ANOTAN}>Ambos Equipos Anotan</option>
            <option value={TipoApuesta.PRIMER_GOLEADOR}>Primer Goleador</option>
            <option value={TipoApuesta.HANDICAP}>Hándicap</option>
            <option value={TipoApuesta.DOBLE_OPORTUNIDAD}>Doble Oportunidad</option>
          </select>
        </div>

        {/* Filtros avanzados */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
            {/* Rango de fechas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rango de fechas
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={tempFilters.fechaDesde}
                    onChange={(e) => {
                      setTempFilters(prev => ({ ...prev, fechaDesde: e.target.value }));
                      handleDateChange();
                    }}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={tempFilters.fechaHasta}
                    onChange={(e) => {
                      setTempFilters(prev => ({ ...prev, fechaHasta: e.target.value }));
                      handleDateChange();
                    }}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rango de montos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rango de montos
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Monto mínimo
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={tempFilters.montoMinimo}
                      onChange={(e) => {
                        setTempFilters(prev => ({ ...prev, montoMinimo: e.target.value }));
                        handleAmountChange();
                      }}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-8 pr-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Monto máximo
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Sin límite"
                      value={tempFilters.montoMaximo}
                      onChange={(e) => {
                        setTempFilters(prev => ({ ...prev, montoMaximo: e.target.value }));
                        handleAmountChange();
                      }}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-8 pr-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros predefinidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filtros rápidos
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const fechaHoy = new Date().toISOString().split('T')[0];
                    setTempFilters(prev => ({ ...prev, fechaDesde: fechaHoy, fechaHasta: fechaHoy }));
                    applyDateFilter(fechaHoy, fechaHoy);
                    onFiltrosChange?.();
                  }}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  Hoy
                </button>
                <button
                  onClick={() => {
                    const fecha7Dias = new Date();
                    fecha7Dias.setDate(fecha7Dias.getDate() - 7);
                    const fechaDesde = fecha7Dias.toISOString().split('T')[0];
                    const fechaHasta = new Date().toISOString().split('T')[0];
                    setTempFilters(prev => ({ ...prev, fechaDesde, fechaHasta }));
                    applyDateFilter(fechaDesde, fechaHasta);
                    onFiltrosChange?.();
                  }}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-xs hover:bg-green-200 dark:hover:bg-green-800"
                >
                  Últimos 7 días
                </button>
                <button
                  onClick={() => {
                    const fecha30Dias = new Date();
                    fecha30Dias.setDate(fecha30Dias.getDate() - 30);
                    const fechaDesde = fecha30Dias.toISOString().split('T')[0];
                    const fechaHasta = new Date().toISOString().split('T')[0];
                    setTempFilters(prev => ({ ...prev, fechaDesde, fechaHasta }));
                    applyDateFilter(fechaDesde, fechaHasta);
                    onFiltrosChange?.();
                  }}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full text-xs hover:bg-purple-200 dark:hover:bg-purple-800"
                >
                  Último mes
                </button>
                <button
                  onClick={() => {
                    applyFilterByState(EstadoApuesta.RESUELTA);
                    onFiltrosChange?.();
                  }}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Solo resueltas
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltrosApuestas;
