import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import QuinielaItem from '../../components/items/QuinielaItem';
import { useQuiniela } from '../../hooks/useQuiniela';
import { USER_ROUTES } from '../../constants/ROUTERS';
import type { QuinielaResponse } from '../../types/QuinielaType';

const QuinielaList = () => {
  const history = useHistory();
  const {
    quinielasPublicas,
    loading: hookLoading,
    error: hookError,
    cargarQuinielasPublicas,
  } = useQuiniela();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [quinielasFiltradas, setQuinielasFiltradas] = useState<QuinielaResponse[]>([]);
  
  // Filtros avanzados
  const [priceFilter, setPriceFilter] = useState<number | ''>('');
  const [tipoFilter, setTipoFilter] = useState<string>('');
  const [fechaInicioFilter, setFechaInicioFilter] = useState<string>('');
  const [fechaFinFilter, setFechaFinFilter] = useState<string>('');
  
  // Paginación
  const [pageSize, setPageSize] = useState(12);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loadingMore] = useState(false);

  // Estados únicos para filtros
  const [uniqueStates, setUniqueStates] = useState<string[]>([]);
  const [uniqueTipos, setUniqueTipos] = useState<string[]>([]);

  const fetchQuinielas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await cargarQuinielasPublicas();
      setHasMorePages(true);
    } catch (err) {
      setError('Error al cargar las quinielas');
      console.error('Error fetching quinielas:', err);
    } finally {
      setLoading(false);
    }
  }, [cargarQuinielasPublicas]);

  useEffect(() => {
    fetchQuinielas();
  }, [fetchQuinielas]);

  // Actualizar estado cuando cambie el hook
  useEffect(() => {
    setLoading(hookLoading);
    setError(hookError);
  }, [hookLoading, hookError]);

  useEffect(() => {
    // Actualizar estados únicos cuando cambien las quinielas
    if (quinielasPublicas.length > 0) {
      const states = [...new Set(quinielasPublicas.map((q: QuinielaResponse) => q.estado).filter(Boolean))] as string[];
      const tipos = [...new Set(quinielasPublicas.map((q: QuinielaResponse) => q.tipoDistribucion).filter(Boolean))] as string[];
      setUniqueStates(states);
      setUniqueTipos(tipos);
    }
  }, [quinielasPublicas]);

  // Aplicar filtros localmente
  useEffect(() => {
    let filtered = [...quinielasPublicas];

    // Filtro por estado
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(q => q.estado?.toLowerCase() === selectedFilter.toLowerCase());
    }

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(q => 
        q.nombre?.toLowerCase().includes(term) ||
        q.descripcion?.toLowerCase().includes(term)
      );
    }

    // Filtros avanzados
    if (tipoFilter) {
      filtered = filtered.filter(q => q.tipoDistribucion === tipoFilter);
    }

    if (priceFilter && typeof priceFilter === 'number') {
      filtered = filtered.filter(q => q.precioEntrada <= priceFilter);
    }

    if (fechaInicioFilter) {
      filtered = filtered.filter(q => new Date(q.fechaInicio) >= new Date(fechaInicioFilter));
    }

    if (fechaFinFilter) {
      filtered = filtered.filter(q => new Date(q.fechaFin) <= new Date(fechaFinFilter));
    }

    setQuinielasFiltradas(filtered);
  }, [quinielasPublicas, selectedFilter, searchTerm, tipoFilter, priceFilter, fechaInicioFilter, fechaFinFilter]);

  /**
   * Manejar cambio de filtro por estado
   */
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  /**
   * Manejar búsqueda por nombre
   */
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  /**
   * Aplicar filtros avanzados
   */
  const handleAdvancedFilters = () => {
    // Los filtros se aplican automáticamente en el useEffect
  };

  /**
   * Limpiar filtros avanzados
   */
  const clearAdvancedFilters = () => {
    setPriceFilter('');
    setTipoFilter('');
    setFechaInicioFilter('');
    setFechaFinFilter('');
  };

  /**
   * Limpiar todos los filtros
   */
  const clearAllFilters = () => {
    setSelectedFilter('all');
    setSearchTerm('');
    setPriceFilter('');
    setTipoFilter('');
    setFechaInicioFilter('');
    setFechaFinFilter('');
    setShowAdvancedFilters(false);
  };

  /**
   * Cargar más quinielas (paginación)
   */
  const loadMoreQuinielas = async () => {
    if (loadingMore || !hasMorePages) return;
    // Simulamos paginación simple incrementando el tamaño de página
    setPageSize(prev => prev + 12);
  };

  /**
   * Filtros rápidos por tipo de premio
   */
  const handleQuickFilterTipo = (tipo: string) => {
    setTipoFilter(tipo);
  };

  /**
   * Filtros rápidos por precio
   */
  const handleQuickFilterPrice = (maxPrice: number) => {
    setPriceFilter(maxPrice);
  };

  // Determinar qué quinielas mostrar
  const displayQuinielas = quinielasFiltradas.length > 0 ? quinielasFiltradas : quinielasPublicas;

  const getFilteredCount = (estado: string) => {
    if (estado === 'all') return quinielasPublicas.length;
    return quinielasPublicas.filter((q: QuinielaResponse) => q.estado?.toLowerCase() === estado?.toLowerCase()).length;
  };

  if (loading && quinielasPublicas.length === 0) {
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

          {/* Botón Armar Quiniela */}
          <div className="mb-4 md:mb-0">
            <button
              onClick={() => history.push(USER_ROUTES.ARMAR_QUINIELA)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <span className="text-lg">🛠️</span>
              <span>Armar Mi Quiniela</span>
            </button>
          </div>

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
            Mostrando {displayQuinielas.length} de {quinielasPublicas.length} quinielas
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
            {displayQuinielas.map((quiniela: QuinielaResponse) => (
              <QuinielaItem
                key={quiniela.id}
                quiniela={{
                  ...quiniela,
                  idQuiniela: quiniela.id,
                  nombreQuiniela: quiniela.nombre,
                  premioAcumulado: quiniela.participantes * quiniela.precioEntrada,
                  numeroParticipantes: quiniela.participantes,
                  fechaInicio: quiniela.fechaInicio,
                  fechaFin: quiniela.fechaFin,
                  precioParticipacion: quiniela.precioEntrada,
                  strDescripcion: quiniela.descripcion,
                  urlBanner: '',
                  allowDoubleBets: false,
                  allowTripleBets: false,
                  tipoPremio: quiniela.tipoDistribucion,
                  tiposApuestas: [],
                  eventos: []
                }}
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