import React, { useEffect, useState } from 'react';
import { useQuiniela } from '../../hooks/useQuiniela';
import { TipoQuiniela, EstadoQuiniela } from '../../types/QuinielaType';
import QuinielaCard from './QuinielaCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const QuinielasList: React.FC = () => {
    const {
        // Estado
        quinielasActivas,
        loading,
        errors,
        filtros,
        
        // Funciones de carga
        loadQuinielasActivas,
        
        // Filtros
        applyFilterByType,
        applyFilterByState,
        applySearchFilter,
        clearAllFilters,
        
        // Navegación
        navigateToCreateQuiniela
    } = useQuiniela();

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadQuinielasActivas(0, 20);
    }, [loadQuinielasActivas]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        applySearchFilter(term);
    };

    const handleTypeFilter = (tipo: string) => {
        applyFilterByType(tipo === '' ? null : tipo as TipoQuiniela);
    };

    const handleStateFilter = (estado: string) => {
        applyFilterByState(estado === '' ? null : estado as EstadoQuiniela);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        clearAllFilters();
    };

    const handleLoadMore = () => {
        loadQuinielasActivas(0, quinielasActivas.length + 10);
    };

    if (loading.quinielasActivas) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Quinielas Disponibles
                </h1>
                <button
                    onClick={navigateToCreateQuiniela}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Crear Nueva Quiniela
                </button>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Búsqueda */}
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Buscar Quinielas
                        </label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Filtro por Tipo */}
                    <div>
                        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tipo de Quiniela
                        </label>
                        <select
                            id="tipo"
                            value={filtros.tipo || ''}
                            onChange={(e) => handleTypeFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">Todos los tipos</option>
                            <option value={TipoQuiniela.CLASICA}>Clásica</option>
                            <option value={TipoQuiniela.EXPRESS}>Express</option>
                            <option value={TipoQuiniela.SUPERVIVENCIA}>Supervivencia</option>
                            <option value={TipoQuiniela.PREDICTOR_EXACTO}>Predictor Exacto</option>
                            <option value={TipoQuiniela.CHALLENGE_MENSUAL}>Challenge Mensual</option>
                        </select>
                    </div>

                    {/* Filtro por Estado */}
                    <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Estado
                        </label>
                        <select
                            id="estado"
                            value={filtros.estado || ''}
                            onChange={(e) => handleStateFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">Todos los estados</option>
                            <option value={EstadoQuiniela.ACTIVA}>Activa</option>
                            <option value={EstadoQuiniela.CERRADA}>Cerrada</option>
                            <option value={EstadoQuiniela.FINALIZADA}>Finalizada</option>
                        </select>
                    </div>

                    {/* Botón Limpiar Filtros */}
                    <div className="flex items-end">
                        <button
                            onClick={handleClearFilters}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Mostrar errores */}
            {errors.quinielasActivas && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    Error: {errors.quinielasActivas}
                </div>
            )}

            {/* Lista de Quinielas */}
            {quinielasActivas.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {quinielasActivas.map((quiniela) => (
                            <QuinielaCard key={quiniela.id} quiniela={quiniela} />
                        ))}
                    </div>

                    {/* Botón Cargar Más */}
                    <div className="text-center">
                        <button
                            onClick={handleLoadMore}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Cargar Más Quinielas
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        No hay quinielas disponibles
                    </div>
                    <button
                        onClick={navigateToCreateQuiniela}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        ¡Crea la primera quiniela!
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuinielasList;
