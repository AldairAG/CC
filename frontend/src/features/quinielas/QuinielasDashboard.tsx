import React, { useEffect } from 'react';
import { useQuiniela } from '../../hooks/useQuiniela';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import QuinielaCard from './QuinielaCard';

const QuinielasDashboard: React.FC = () => {
    const {
        // Estado
        quinielasPopulares,
        quinielasMayorPool,
        quinielasProximasCerrar,
        estadisticasDashboard,
        loading,
        
        // Funciones
        loadCompleteDashboard,
        
        // Navegación
        navigateToCreateQuiniela
    } = useQuiniela();

    useEffect(() => {
        loadCompleteDashboard();
    }, [loadCompleteDashboard]);

    const isLoading = loading.quinielasPopulares || loading.quinielasMayorPool || loading.quinielasProximasCerrar || loading.estadisticas;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard de Quinielas
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Descubre y participa en las mejores quinielas
                    </p>
                </div>
                <button
                    onClick={navigateToCreateQuiniela}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    Crear Quiniela
                </button>
            </div>

            {/* Estadísticas */}
            {estadisticasDashboard && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 text-xl">📊</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {estadisticasDashboard.totalQuinielas}
                                </div>
                                <div className="text-gray-500 text-sm">Total Quinielas</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-green-600 text-xl">🎯</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {estadisticasDashboard.quinielasActivas}
                                </div>
                                <div className="text-gray-500 text-sm">Quinielas Activas</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-600 text-xl">👥</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {estadisticasDashboard.totalParticipaciones}
                                </div>
                                <div className="text-gray-500 text-sm">Participaciones</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <span className="text-yellow-600 text-xl">💰</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${estadisticasDashboard.poolTotalActivo?.toLocaleString() || '0'}
                                </div>
                                <div className="text-gray-500 text-sm">Pool Total</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quinielas Populares */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        🔥 Quinielas Populares
                    </h2>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Ver todas →
                    </button>
                </div>
                
                {quinielasPopulares.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quinielasPopulares.slice(0, 3).map((quiniela) => (
                            <QuinielaCard key={quiniela.id} quiniela={quiniela} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                        <div className="text-gray-400 text-4xl mb-2">🎯</div>
                        <div className="text-gray-500">No hay quinielas populares disponibles</div>
                    </div>
                )}
            </section>

            {/* Quinielas con Mayor Pool */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        💰 Mayor Pool de Premios
                    </h2>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Ver todas →
                    </button>
                </div>
                
                {quinielasMayorPool.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quinielasMayorPool.slice(0, 3).map((quiniela) => (
                            <QuinielaCard key={quiniela.id} quiniela={quiniela} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                        <div className="text-gray-400 text-4xl mb-2">💰</div>
                        <div className="text-gray-500">No hay quinielas con pools grandes disponibles</div>
                    </div>
                )}
            </section>

            {/* Quinielas Próximas a Cerrar */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        ⏰ Próximas a Cerrar
                    </h2>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Ver todas →
                    </button>
                </div>
                
                {quinielasProximasCerrar.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quinielasProximasCerrar.slice(0, 3).map((quiniela) => (
                            <QuinielaCard key={quiniela.id} quiniela={quiniela} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                        <div className="text-gray-400 text-4xl mb-2">⏰</div>
                        <div className="text-gray-500">No hay quinielas próximas a cerrar</div>
                    </div>
                )}
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-2">
                    ¿Listo para crear tu propia quiniela?
                </h2>
                <p className="text-blue-100 mb-6">
                    Crea una quiniela personalizada y compite con tus amigos
                </p>
                <button
                    onClick={navigateToCreateQuiniela}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                    Crear Mi Quiniela
                </button>
            </section>
        </div>
    );
};

export default QuinielasDashboard;
