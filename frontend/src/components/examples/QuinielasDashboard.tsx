// Ejemplo de uso del hook useQuiniela en un componente real

import React, { useEffect, useState } from 'react';
import { useQuiniela } from '../../hooks/useQuiniela';
import { TipoQuiniela, EstadoQuiniela } from '../../types/QuinielaType';

export const QuinielasDashboard: React.FC = () => {
    const {
        // Estado
        quinielasActivas,
        quinielasPopulares,
        loading,
        errors,
        
        // Funciones de carga
        loadQuinielasActivas,
        loadCompleteDashboard,
        
        // Navegación
        navigateToQuinielaDetail,
        navigateToCreateQuiniela,
        
        // Filtros
        applyFilterByType,
        applyFilterByState,
        applySearchFilter,
        clearAllFilters,
        filtros
    } = useQuiniela();

    const [searchTerm, setSearchTerm] = useState('');

    // Cargar datos al montar el componente
    useEffect(() => {
        loadCompleteDashboard();
    }, [loadCompleteDashboard]);

    // Manejar búsqueda
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        applySearchFilter(term);
    };

    // Manejar filtro por tipo
    const handleTypeFilter = (tipo: TipoQuiniela | null) => {
        applyFilterByType(tipo);
    };

    // Manejar filtro por estado
    const handleStateFilter = (estado: EstadoQuiniela | null) => {
        applyFilterByState(estado);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard de Quinielas</h1>
                <button
                    onClick={navigateToCreateQuiniela}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Crear Nueva Quiniela
                </button>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="mb-6 space-y-4">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Buscar quinielas..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded"
                    />
                    <select
                        value={filtros.tipo || ''}
                        onChange={(e) => handleTypeFilter((e.target.value as TipoQuiniela) || null)}
                        className="px-3 py-2 border rounded"
                    >
                        <option value="">Todos los tipos</option>
                        <option value={TipoQuiniela.CLASICA}>Clásica</option>
                        <option value={TipoQuiniela.EXPRESS}>Express</option>
                        <option value={TipoQuiniela.SUPERVIVENCIA}>Supervivencia</option>
                    </select>
                    <select
                        value={filtros.estado || ''}
                        onChange={(e) => handleStateFilter((e.target.value as EstadoQuiniela) || null)}
                        className="px-3 py-2 border rounded"
                    >
                        <option value="">Todos los estados</option>
                        <option value={EstadoQuiniela.ACTIVA}>Activa</option>
                        <option value={EstadoQuiniela.CERRADA}>Cerrada</option>
                        <option value={EstadoQuiniela.FINALIZADA}>Finalizada</option>
                    </select>
                    <button
                        onClick={clearAllFilters}
                        className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </div>

            {/* Mostrar errores */}
            {(errors.quinielasActivas || errors.quinielasPopulares) && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
                    {errors.quinielasActivas && <p>Error: {errors.quinielasActivas}</p>}
                    {errors.quinielasPopulares && <p>Error: {errors.quinielasPopulares}</p>}
                </div>
            )}

            {/* Quinielas Populares */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Quinielas Populares</h2>
                {loading.quinielasPopulares ? (
                    <div className="text-center py-8">Cargando quinielas populares...</div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {quinielasPopulares.slice(0, 6).map((quiniela) => (
                            <div
                                key={quiniela.id}
                                className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigateToQuinielaDetail(quiniela.id)}
                            >
                                <h3 className="font-semibold text-lg mb-2">{quiniela.nombre}</h3>
                                <p className="text-sm text-gray-600 mb-3">{quiniela.descripcion}</p>
                                <div className="text-sm space-y-1">
                                    <p><span className="font-medium">Pool:</span> ${quiniela.poolActual}</p>
                                    <p><span className="font-medium">Participantes:</span> {quiniela.participantesActuales}/{quiniela.maxParticipantes}</p>
                                    <p><span className="font-medium">Estado:</span> {quiniela.estado}</p>
                                    <p><span className="font-medium">Tipo:</span> {quiniela.tipoQuiniela}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quinielas Activas */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Quinielas Activas</h2>
                    <button
                        onClick={() => loadQuinielasActivas(0, 20)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                        Recargar
                    </button>
                </div>
                
                {loading.quinielasActivas ? (
                    <div className="text-center py-8">Cargando quinielas activas...</div>
                ) : quinielasActivas.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {quinielasActivas.map((quiniela) => (
                            <div
                                key={quiniela.id}
                                className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigateToQuinielaDetail(quiniela.id)}
                            >
                                <h3 className="font-semibold text-lg mb-2">{quiniela.nombre}</h3>
                                <p className="text-sm text-gray-600 mb-3">{quiniela.descripcion}</p>
                                <div className="text-sm space-y-1">
                                    <p><span className="font-medium">Pool:</span> ${quiniela.poolActual}</p>
                                    <p><span className="font-medium">Costo:</span> ${quiniela.costoParticipacion}</p>
                                    <p><span className="font-medium">Participantes:</span> {quiniela.participantesActuales}/{quiniela.maxParticipantes}</p>
                                    <p><span className="font-medium">Cierra:</span> {new Date(quiniela.fechaCierre).toLocaleDateString()}</p>
                                </div>
                                <div className="mt-3 flex justify-between items-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        quiniela.estado === EstadoQuiniela.ACTIVA ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {quiniela.estado}
                                    </span>
                                    <span className="text-xs text-gray-500">{quiniela.tipoQuiniela}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No hay quinielas activas disponibles
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuinielasDashboard;
