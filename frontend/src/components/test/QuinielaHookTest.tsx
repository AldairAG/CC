import React, { useEffect } from 'react';
import { useQuiniela } from '../../hooks/useQuiniela';

/**
 * Componente de prueba para verificar que el hook useQuiniela funciona correctamente
 */
export const QuinielaHookTest: React.FC = () => {
    const {
        // Estado
        quinielasActivas,
        quinielasPopulares,
        quinielaActual,
        loading,
        errors,
        
        // Funciones de carga
        loadQuinielasActivas,
        loadCompleteDashboard,
        
        // Navegación
        navigateToCreateQuiniela,
        navigateToQuinielaDetail,
        
        // Utilidades
        clearAllErrors,
        clearCurrentQuiniela
    } = useQuiniela();

    useEffect(() => {
        // Cargar datos iniciales al montar el componente
        loadCompleteDashboard();
    }, [loadCompleteDashboard]);

    const handleCreateQuiniela = () => {
        navigateToCreateQuiniela();
    };

    const handleViewQuiniela = (quinielaId: number) => {
        navigateToQuinielaDetail(quinielaId);
    };

    const handleLoadQuinielas = async () => {
        await loadQuinielasActivas(0, 10);
    };

    const handleClearErrors = () => {
        clearAllErrors();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Test useQuiniela Hook</h1>
            
            {/* Estados de carga */}
            {loading.quinielasActivas && (
                <div className="mb-4 p-3 bg-blue-100 rounded">
                    Cargando quinielas activas...
                </div>
            )}
            
            {loading.quinielasPopulares && (
                <div className="mb-4 p-3 bg-blue-100 rounded">
                    Cargando quinielas populares...
                </div>
            )}

            {/* Errores */}
            {(errors.quinielasActivas || errors.quinielasPopulares) && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
                    {errors.quinielasActivas && <p>Error quinielas activas: {errors.quinielasActivas}</p>}
                    {errors.quinielasPopulares && <p>Error quinielas populares: {errors.quinielasPopulares}</p>}
                    <button
                        onClick={handleClearErrors}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                        Limpiar errores
                    </button>
                </div>
            )}

            {/* Botones de acción */}
            <div className="mb-6 space-x-4">
                <button
                    onClick={handleCreateQuiniela}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Crear Quiniela
                </button>
                <button
                    onClick={handleLoadQuinielas}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Cargar Quinielas Activas
                </button>
            </div>

            {/* Quinielas populares */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Quinielas Populares ({quinielasPopulares.length})</h2>
                {quinielasPopulares.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {quinielasPopulares.map((quiniela) => (
                            <div
                                key={quiniela.id}
                                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <h3 className="font-medium text-lg mb-2">{quiniela.nombre}</h3>
                                <p className="text-sm text-gray-600 mb-2">{quiniela.descripcion}</p>
                                <div className="text-sm">
                                    <p>Pool: ${quiniela.poolActual}</p>
                                    <p>Participantes: {quiniela.participantesActuales}/{quiniela.maxParticipantes}</p>
                                    <p>Estado: {quiniela.estado}</p>
                                </div>
                                <button
                                    onClick={() => handleViewQuiniela(quiniela.id)}
                                    className="mt-3 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                >
                                    Ver Detalle
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No hay quinielas populares disponibles</p>
                )}
            </div>

            {/* Quinielas activas */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Quinielas Activas ({quinielasActivas.length})</h2>
                {quinielasActivas.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {quinielasActivas.map((quiniela) => (
                            <div
                                key={quiniela.id}
                                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <h3 className="font-medium text-lg mb-2">{quiniela.nombre}</h3>
                                <p className="text-sm text-gray-600 mb-2">{quiniela.descripcion}</p>
                                <div className="text-sm">
                                    <p>Pool: ${quiniela.poolActual}</p>
                                    <p>Participantes: {quiniela.participantesActuales}/{quiniela.maxParticipantes}</p>
                                    <p>Tipo: {quiniela.tipoQuiniela}</p>
                                </div>
                                <button
                                    onClick={() => handleViewQuiniela(quiniela.id)}
                                    className="mt-3 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                >
                                    Ver Detalle
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No hay quinielas activas disponibles</p>
                )}
            </div>

            {/* Información de la quiniela actual */}
            {quinielaActual && (
                <div className="mb-6 p-4 bg-gray-50 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Quiniela Actual</h2>
                    <h3 className="font-medium text-lg mb-2">{quinielaActual.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-2">{quinielaActual.descripcion}</p>
                    <div className="text-sm">
                        <p>Pool: ${quinielaActual.poolActual}</p>
                        <p>Total de eventos: {quinielaActual.totalEventos || 0}</p>
                        <p>Estado: {quinielaActual.estado}</p>
                    </div>
                    <button
                        onClick={clearCurrentQuiniela}
                        className="mt-3 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                    >
                        Limpiar Quiniela Actual
                    </button>
                </div>
            )}

            {/* Debug info */}
            <div className="mt-8 p-4 bg-gray-100 border rounded-lg">
                <h3 className="font-medium mb-2">Debug Info</h3>
                <div className="text-sm text-gray-600">
                    <p>Hook cargado correctamente ✅</p>
                    <p>Estados disponibles: {Object.keys(loading).length} loading states</p>
                    <p>Errores disponibles: {Object.keys(errors).length} error states</p>
                    <p>Total funciones expuestas: ~40+ funciones</p>
                </div>
            </div>
        </div>
    );
};

export default QuinielaHookTest;
