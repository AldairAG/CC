import React, { useEffect, useState } from 'react';
import { useEvento } from '../../hooks/useEvento';
import type { FiltrosEventoType, EstadoEvento } from '../../types/EventoDeportivoTypes';

/**
 * Componente de ejemplo que demuestra el uso completo del EventoSlice y useEvento hook
 */
const EventosDashboardExample: React.FC = () => {
    const {
        // Estado del store de Redux
        eventos,
        eventosDisponibles,
        deportesDisponibles,
        ligasDisponibles,
        estadisticas,
        
        // Estados de carga
        loading,
        eventosLoading,
        estadisticasLoading,
        
        // Estados de error
        error,
        
        // Filtros y paginación
        filtrosActivos,
        currentPage,
        totalPages,
        totalElements,
        
        // Funciones de carga
        cargarEventos,
        cargarEventosProximos,
        cargarEventosPorDeporte,
        cargarEventosPorLiga,
        buscarEventos,
        cargarEstadisticas,
        cargarEventosDisponibles,
        cargarDeportesDisponibles,
        cargarLigasDisponibles,
        
        // Operaciones de administración
        sincronizarEventos,
        limpiarEventosAntiguos,
        
        // Utilidades
        limpiarFiltros,
        limpiarError,
        cambiarPagina,
        
        // Getters computados del hook
        eventosHoy,
        eventosEnVivo,
        
        // Estados derivados
        tieneEventos,
        tieneFiltrosActivos
    } = useEvento();

    // Estado local del componente
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDeporte, setSelectedDeporte] = useState<string>('');
    const [selectedLiga, setSelectedLiga] = useState<string>('');
    const [selectedEstado, setSelectedEstado] = useState<EstadoEvento | ''>('');

    // ===== EFECTOS =====
    
    // Cargar datos iniciales
    useEffect(() => {
        const initializeData = async () => {
            await Promise.all([
                cargarEventosProximos(),
                cargarEstadisticas(),
                cargarDeportesDisponibles(),
                cargarEventosDisponibles()
            ]);
        };

        initializeData();
    }, [cargarEventosProximos, cargarEstadisticas, cargarDeportesDisponibles, cargarEventosDisponibles]);

    // Cargar ligas cuando cambie el deporte
    useEffect(() => {
        if (selectedDeporte) {
            cargarLigasDisponibles(selectedDeporte);
        }
    }, [selectedDeporte, cargarLigasDisponibles]);

    // ===== HANDLERS =====

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            const filtros: FiltrosEventoType = {};
            if (selectedDeporte) filtros.deporte = selectedDeporte;
            if (selectedLiga) filtros.liga = selectedLiga;
            if (selectedEstado) filtros.estado = selectedEstado;

            await buscarEventos(searchQuery, filtros);
        }
    };

    const handleFilterByDeporte = async (deporte: string) => {
        setSelectedDeporte(deporte);
        setSelectedLiga(''); // Reset liga when deporte changes
        if (deporte) {
            await cargarEventosPorDeporte(deporte);
        } else {
            await cargarEventosProximos();
        }
    };

    const handleFilterByLiga = async (liga: string) => {
        setSelectedLiga(liga);
        if (liga) {
            await cargarEventosPorLiga(liga);
        }
    };

    const handleApplyFilters = async () => {
        const filtros: FiltrosEventoType = {};
        if (selectedDeporte) filtros.deporte = selectedDeporte;
        if (selectedLiga) filtros.liga = selectedLiga;
        if (selectedEstado) filtros.estado = selectedEstado;

        await cargarEventos(filtros);
    };

    const handleClearFilters = () => {
        setSelectedDeporte('');
        setSelectedLiga('');
        setSelectedEstado('');
        setSearchQuery('');
        limpiarFiltros();
    };

    const handlePageChange = (page: number) => {
        cambiarPagina(page);
        // Aquí podrías recargar los datos para la nueva página
        // await cargarEventos({ ...filtrosActivos, page });
    };

    const handleRefreshData = async () => {
        await Promise.all([
            cargarEventosProximos(),
            cargarEstadisticas()
        ]);
    };

    const handleSyncEvents = async () => {
        const resultado = await sincronizarEventos();
        if (resultado.status === 'success') {
            await cargarEventosProximos();
        }
    };

    const handleCleanOldEvents = async () => {
        await limpiarEventosAntiguos();
    };

    // ===== RENDER =====

    return (
        <div className="eventos-dashboard p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Eventos Deportivos</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={handleRefreshData}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Actualizando...' : 'Actualizar'}
                    </button>
                    <button
                        onClick={handleSyncEvents}
                        disabled={loading}
                        className="btn btn-secondary"
                    >
                        Sincronizar Eventos
                    </button>
                    <button
                        onClick={handleCleanOldEvents}
                        disabled={loading}
                        className="btn btn-warning"
                    >
                        Limpiar Antiguos
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <span className="block sm:inline">{error}</span>
                    <button
                        onClick={limpiarError}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Estadísticas */}
            {estadisticas && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800">Eventos Próximos</h3>
                        <p className="text-2xl font-bold text-blue-900">{estadisticas.totalEventosProximos}</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800">En Vivo</h3>
                        <p className="text-2xl font-bold text-green-900">
                            {estadisticas.eventosPorEstado['en_vivo'] || 0}
                        </p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-yellow-800">Programados</h3>
                        <p className="text-2xl font-bold text-yellow-900">
                            {estadisticas.eventosPorEstado['programado'] || 0}
                        </p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-800">Disponibles para Quinielas</h3>
                        <p className="text-2xl font-bold text-purple-900">{eventosDisponibles.length}</p>
                    </div>
                </div>
            )}

            {/* Filtros y Búsqueda */}
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <h2 className="text-xl font-semibold">Filtros y Búsqueda</h2>
                
                {/* Búsqueda */}
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar eventos..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={eventosLoading}
                        className="btn btn-primary"
                    >
                        Buscar
                    </button>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        value={selectedDeporte}
                        onChange={(e) => handleFilterByDeporte(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Todos los deportes</option>
                        {deportesDisponibles.map(deporte => (
                            <option key={deporte} value={deporte}>{deporte}</option>
                        ))}
                    </select>

                    <select
                        value={selectedLiga}
                        onChange={(e) => handleFilterByLiga(e.target.value)}
                        disabled={!selectedDeporte}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Todas las ligas</option>
                        {ligasDisponibles.map(liga => (
                            <option key={liga} value={liga}>{liga}</option>
                        ))}
                    </select>

                    <select
                        value={selectedEstado}
                        onChange={(e) => setSelectedEstado(e.target.value as EstadoEvento)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Todos los estados</option>
                        <option value="programado">Programado</option>
                        <option value="en_vivo">En Vivo</option>
                        <option value="finalizado">Finalizado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>

                    <div className="flex space-x-2">
                        <button
                            onClick={handleApplyFilters}
                            className="btn btn-primary flex-1"
                        >
                            Aplicar
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="btn btn-secondary flex-1"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>

                {/* Filtros Activos */}
                {tieneFiltrosActivos && (
                    <div className="bg-gray-100 p-3 rounded">
                        <p className="text-sm text-gray-600 mb-2">Filtros activos:</p>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(filtrosActivos).map(([key, value]) => (
                                <span key={key} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">
                                    {key}: {Array.isArray(value) ? value.join(', ') : value}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Secciones de Eventos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Eventos de Hoy */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Eventos de Hoy ({eventosHoy.length})</h2>
                    {eventosLoading ? (
                        <div className="text-center py-4">Cargando eventos...</div>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {eventosHoy.map(evento => (
                                <div key={evento.id} className="border p-3 rounded">
                                    <h3 className="font-semibold">{evento.nombreEvento}</h3>
                                    <p className="text-sm text-gray-600">
                                        {evento.equipoLocal} vs {evento.equipoVisitante}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {evento.liga.nombre} • {evento.deporte.nombre} • {evento.estado}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(evento.fechaEvento).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Eventos en Vivo */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-green-600">
                        Eventos en Vivo ({eventosEnVivo.length})
                    </h2>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {eventosEnVivo.map(evento => (
                            <div key={evento.id} className="border border-green-200 p-3 rounded bg-green-50">
                                <h3 className="font-semibold">{evento.nombreEvento}</h3>
                                <p className="text-sm text-gray-600">
                                    {evento.equipoLocal} vs {evento.equipoVisitante}
                                </p>
                                {evento.marcadorLocal !== undefined && evento.marcadorVisitante !== undefined && (
                                    <p className="text-lg font-bold text-green-700">
                                        {evento.marcadorLocal} - {evento.marcadorVisitante}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">{evento.liga.nombre}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lista Principal de Eventos */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        Todos los Eventos ({totalElements})
                    </h2>
                    {tieneEventos && (
                        <div className="text-sm text-gray-500">
                            Página {currentPage + 1} de {totalPages}
                        </div>
                    )}
                </div>

                {eventosLoading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Cargando eventos...</p>
                    </div>
                ) : tieneEventos ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Evento</th>
                                        <th className="px-4 py-2 text-left">Equipos</th>
                                        <th className="px-4 py-2 text-left">Liga</th>
                                        <th className="px-4 py-2 text-left">Deporte</th>
                                        <th className="px-4 py-2 text-left">Estado</th>
                                        <th className="px-4 py-2 text-left">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {eventos.map(evento => (
                                        <tr key={evento.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 font-medium">{evento.nombreEvento}</td>
                                            <td className="px-4 py-2">
                                                {evento.equipoLocal} vs {evento.equipoVisitante}
                                            </td>
                                            <td className="px-4 py-2">{evento.liga.nombre}</td>
                                            <td className="px-4 py-2">{evento.deporte.nombre}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    evento.estado === 'en_vivo' ? 'bg-green-100 text-green-800' :
                                                    evento.estado === 'programado' ? 'bg-yellow-100 text-yellow-800' :
                                                    evento.estado === 'finalizado' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {evento.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {new Date(evento.fechaEvento).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="btn btn-secondary"
                                >
                                    Anterior
                                </button>
                                
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = currentPage < 3 ? i : currentPage - 2 + i;
                                    if (page >= totalPages) return null;
                                    
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`btn ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                                        >
                                            {page + 1}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    className="btn btn-secondary"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No se encontraron eventos</p>
                        {tieneFiltrosActivos && (
                            <button
                                onClick={handleClearFilters}
                                className="mt-2 btn btn-primary"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Estado de carga general */}
            {(loading || estadisticasLoading) && (
                <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Procesando...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventosDashboardExample;
