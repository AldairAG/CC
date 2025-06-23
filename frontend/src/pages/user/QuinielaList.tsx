import React, { useState, useEffect } from 'react';
import QuinielaItem from '../../components/items/QuinielaItem';
import { useQuiniela } from '../../hooks/useQuiniela';

const QuinielaList = () => {
  const {
    quinielaList,
    quinielasFiltradas,
    getAllQuinielas,
    filterByNombre,
    filterByEstado: filterLocalByEstado,
    filterByTipoPremio,
    fetchByPrecioMaximo,
    limpiarQuinielas
  } = useQuiniela();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<number | ''>('');
  const [tipoFilter, setTipoFilter] = useState<string>('');

  // Estados únicos para filtros
  const [uniqueStates, setUniqueStates] = useState<string[]>([]);
  const [uniqueTipos, setUniqueTipos] = useState<string[]>([]);

  useEffect(() => {
    fetchQuinielas();
  }, []);

  useEffect(() => {
    // Actualizar estados únicos cuando cambien las quinielas
    if (quinielaList.length > 0) {
      const states = [...new Set(quinielaList.map(q => q.estado))];
      const tipos = [...new Set(quinielaList.map(q => q.tipoPremio))];
      setUniqueStates(states);
      setUniqueTipos(tipos);
    }
  }, [quinielaList]);

  const fetchQuinielas = async () => {
    try {
      setLoading(true);
      setError(null);
      await getAllQuinielas();
    } catch (err) {
      setError('Error al cargar las quinielas');
      console.error('Error fetching quinielas:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleFilterChange = async (filter: string) => {
    setSelectedFilter(filter);
    
    try {
      setLoading(true);
      if (filter === 'all') {
        await getAllQuinielas();
      } else {
        // Usar filtro local para mejor rendimiento
        filterLocalByEstado(filter);
      }
    } catch {
      setError('Error al filtrar quinielas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      filterByNombre(term);
    } else {
      // Si no hay término de búsqueda, restaurar la lista completa
      limpiarQuinielas();
    }
  };

  const handleAdvancedFilters = () => {
    // Aplicar filtros locales usando las funciones disponibles
    let hasFilters = false;
    
    // Primero limpiar filtros anteriores
    limpiarQuinielas();
    
    if (tipoFilter) {
      filterByTipoPremio(tipoFilter);
      hasFilters = true;
    }
    
    if (priceFilter && typeof priceFilter === 'number') {
      fetchByPrecioMaximo(priceFilter);
      hasFilters = true;
    }
    
    // Si hay filtros de estado y no es 'all', aplicarlo también
    if (selectedFilter !== 'all' && hasFilters) {
      filterLocalByEstado(selectedFilter);
    }
    
    // Si hay término de búsqueda, aplicarlo también
    if (searchTerm.trim() && hasFilters) {
      filterByNombre(searchTerm);
    }
  };

  const clearFilters = () => {
    setSelectedFilter('all');
    setSearchTerm('');
    setPriceFilter('');
    setTipoFilter('');
    setShowAdvancedFilters(false);
    // Usar limpiarQuinielas para restaurar el estado original
    limpiarQuinielas();
    getAllQuinielas();
  };

  // Añadir función para limpiar solo los filtros avanzados
  const clearAdvancedFilters = () => {
    setPriceFilter('');
    setTipoFilter('');
    limpiarQuinielas();
    
    // Reaplizar filtros básicos si están activos
    if (selectedFilter !== 'all') {
      filterLocalByEstado(selectedFilter);
    }
    if (searchTerm.trim()) {
      filterByNombre(searchTerm);
    }
  };

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
          
          {/* Search */}
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
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Filtros
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Precio Máximo
                </label>
                <input
                  type="number"
                  placeholder="€"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-end gap-2">
                <button
                  onClick={handleAdvancedFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Aplicar
                </button>
                <button
                  onClick={clearAdvancedFilters}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
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
              {searchTerm || selectedFilter !== 'all' || tipoFilter || priceFilter
                ? 'No se encontraron quinielas con los filtros aplicados.'
                : 'Aún no hay quinielas creadas en el sistema.'
              }
            </p>
            {(searchTerm || selectedFilter !== 'all' || tipoFilter || priceFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayQuinielas.map(quiniela => (
            <QuinielaItem
              key={quiniela.idQuiniela}
              quiniela={quiniela}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuinielaList;