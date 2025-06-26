import React, { useState, useEffect } from 'react';
import QuinielaItem from '../../components/items/QuinielaItem';
import { useQuiniela } from '../../hooks/useQuiniela';
import type { FiltrosBusquedaAvanzada } from '../../types/QuinielaServiceTypes';

const QuinielaList = () => {
  const {
    quinielaList,
    quinielasFiltradas,
    obtenerQuinielasPublicas,
    obtenerTodasQuinielas,
    obtenerQuinielasPorEstado,
    obtenerQuinielasPorPrecioMaximo,
    obtenerQuinielasPorTipoPremio,
    busquedaAvanzadaQuinielas,
    filterByNombre,
    limpiarQuinielas
  } = useQuiniela();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Filtros avanzados
  const [priceFilter, setPriceFilter] = useState<number | ''>('');
  const [tipoFilter, setTipoFilter] = useState<string>('');
  const [fechaInicioFilter, setFechaInicioFilter] = useState<string>('');
  const [fechaFinFilter, setFechaFinFilter] = useState<string>('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Estados únicos para filtros
  const [uniqueStates, setUniqueStates] = useState<string[]>([]);
  const [uniqueTipos, setUniqueTipos] = useState<string[]>([]);

  useEffect(() => {
    fetchQuinielas();
  }, []);

  useEffect(() => {
    // Actualizar estados únicos cuando cambien las quinielas
    if (quinielaList.length > 0) {
      const states = [...new Set(quinielaList.map(q => q.estado).filter(Boolean))];
      const tipos = [...new Set(quinielaList.map(q => q.tipoPremio).filter(Boolean))];
      setUniqueStates(states);
      setUniqueTipos(tipos);
    }
  }, [quinielaList]);

  /**
   * Cargar quinielas iniciales
   */
  const fetchQuinielas = async () => {
    try {
      setLoading(true);
      setError(null);
      await obtenerQuinielasPublicas();
      setCurrentPage(0);
      setHasMorePages(true);
    } catch (err) {
      setError('Error al cargar las quinielas');
      console.error('Error fetching quinielas:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar cambio de filtro por estado
   */
  const handleFilterChange = async (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(0);

    try {
      setLoading(true);
      setError(null);
      
      if (filter === 'all') {
        await obtenerQuinielasPublicas();
      } else {
        await obtenerQuinielasPorEstado(filter);
      }
    } catch (err) {
      setError('Error al filtrar quinielas por estado');
      console.error('Error filtering by state:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar búsqueda por nombre
   */
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      filterByNombre(term);
    } else {
      limpiarQuinielas();
    }
  };

  /**
   * Aplicar filtros avanzados usando búsqueda avanzada del backend
   */
  const handleAdvancedFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: FiltrosBusquedaAvanzada = {};

      // Solo agregar filtros que tengan valor
      if (selectedFilter !== 'all') {
        filtros.estado = selectedFilter;
      }
      if (tipoFilter) {
        filtros.tipoPremio = tipoFilter;
      }
      if (priceFilter && typeof priceFilter === 'number') {
        filtros.precioMaximo = priceFilter;
      }
      if (fechaInicioFilter && fechaFinFilter) {
        filtros.fechaInicio = fechaInicioFilter;
        filtros.fechaFin = fechaFinFilter;
      }

      // Si hay filtros, usar búsqueda avanzada; si no, obtener todas
      if (Object.keys(filtros).length > 0) {
        await busquedaAvanzadaQuinielas(filtros);
      } else {
        await obtenerQuinielasPublicas();
      }

      // Si hay término de búsqueda, aplicarlo después
      if (searchTerm.trim()) {
        filterByNombre(searchTerm);
      }

    } catch (err) {
      setError('Error al aplicar filtros avanzados');
      console.error('Error applying advanced filters:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpiar filtros avanzados
   */
  const clearAdvancedFilters = async () => {
    setPriceFilter('');
    setTipoFilter('');
    setFechaInicioFilter('');
    setFechaFinFilter('');

    try {
      setLoading(true);
      
      // Reapliar solo el filtro de estado si no es 'all'
      if (selectedFilter !== 'all') {
        await obtenerQuinielasPorEstado(selectedFilter);
      } else {
        await obtenerQuinielasPublicas();
      }

      // Reapliar búsqueda por nombre si existe
      if (searchTerm.trim()) {
        filterByNombre(searchTerm);
      }
    } catch (err) {
      setError('Error al limpiar filtros');
      console.error('Error clearing filters:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpiar todos los filtros
   */
  const clearAllFilters = async () => {
    setSelectedFilter('all');
    setSearchTerm('');
    setPriceFilter('');
    setTipoFilter('');
    setFechaInicioFilter('');
    setFechaFinFilter('');
    setShowAdvancedFilters(false);
    
    limpiarQuinielas();
    await fetchQuinielas();
  };

  /**
   * Cargar más quinielas (paginación)
   */
  const loadMoreQuinielas = async () => {
    if (loadingMore || !hasMorePages) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const newQuinielas = await obtenerTodasQuinielas(nextPage, pageSize);
      
      if (newQuinielas.length < pageSize) {
        setHasMorePages(false);
      }
      
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more quinielas:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * Filtros rápidos por tipo de premio
   */
  const handleQuickFilterTipo = async (tipo: string) => {
    setTipoFilter(tipo);
    try {
      setLoading(true);
      await obtenerQuinielasPorTipoPremio(tipo);
    } catch {
      setError('Error al filtrar por tipo de premio');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtros rápidos por precio
   */
  const handleQuickFilterPrice = async (maxPrice: number) => {
    setPriceFilter(maxPrice);
    try {
      setLoading(true);
      await obtenerQuinielasPorPrecioMaximo(maxPrice);
    } catch{
      setError('Error al filtrar por precio');
    } finally {
      setLoading(false);
    }
  };

  // Determinar qué quinielas mostrar
  const displayQuinielas = quinielasFiltradas.length > 0 ? quinielasFiltradas : quinielaList;

  const getFilteredCount = (estado: string) => {
    if (estado === 'all') return quinielaList.length;
    return quinielaList.filter(q => q.estado?.toLowerCase() === estado?.toLowerCase()).length;
  };

  if (loading && quinielaList.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando quinielas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">Error al cargar</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchQuinielas}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Quinielas Disponibles
          </h1>

          {/* Search and Controls */}
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar quinielas..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showAdvancedFilters 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Filtros Avanzados
            </button>

            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar Todo
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <h3 className="text-sm font-medium text-gray-700 mr-4 py-2">Filtros Rápidos:</h3>
            <button
              onClick={() => handleQuickFilterPrice(10)}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              Hasta €10
            </button>
            <button
              onClick={() => handleQuickFilterPrice(50)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              Hasta €50
            </button>
            <button
              onClick={() => handleQuickFilterTipo('WINNER_TAKES_ALL')}
              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
            >
              Ganador se lo lleva todo
            </button>
            <button
              onClick={() => handleQuickFilterTipo('TOP_3')}
              className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
            >
              Top 3
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros Avanzados</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Premio
                </label>
                <select
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los tipos</option>
                  {uniqueTipos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Máximo (€)
                </label>
                <input
                  type="number"
                  placeholder="Ej: 50"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={fechaInicioFilter}
                  onChange={(e) => setFechaInicioFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={fechaFinFilter}
                  onChange={(e) => setFechaFinFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAdvancedFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={clearAdvancedFilters}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Limpiar Filtros Avanzados
              </button>
            </div>
          </div>
        )}

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas ({getFilteredCount('all')})
          </button>

          {uniqueStates.map(state => (
            <button
              key={state}
              onClick={() => handleFilterChange(state)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFilter === state
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {state} ({getFilteredCount(state)})
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span>
            Mostrando {displayQuinielas.length} de {quinielaList.length} quinielas
          </span>
          {loading && (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Actualizando...
            </span>
          )}
        </div>
      </div>

      {/* Quinielas Grid */}
      {displayQuinielas.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-gray-900 font-medium mb-2">No hay quinielas disponibles</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedFilter !== 'all' || tipoFilter || priceFilter || fechaInicioFilter
                ? 'No se encontraron quinielas con los filtros aplicados.'
                : 'Aún no hay quinielas creadas en el sistema.'
              }
            </p>
            {(searchTerm || selectedFilter !== 'all' || tipoFilter || priceFilter || fechaInicioFilter) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayQuinielas.map(quiniela => (
              <QuinielaItem
                key={quiniela.idQuiniela}
                quiniela={quiniela}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMorePages && !loading && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreQuinielas}
                disabled={loadingMore}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingMore ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cargando...
                  </span>
                ) : (
                  'Cargar más quinielas'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Page Size Selector */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={12}>12 por página</option>
            <option value={24}>24 por página</option>
            <option value={48}>48 por página</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default QuinielaList;