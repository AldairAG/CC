import React from 'react';
import { useHistory } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/ROUTERS';
import { useQuiniela } from '../../hooks/useQuiniela';

export const QuinielasQuickAccess: React.FC = () => {
    const history = useHistory();
    const {
        quinielasPublicas,
        misQuinielas,
        misParticipaciones,
        loading,
        obtenerQuinielasDisponibles,
        obtenerQuinielasEnCurso,
        calcularTotalPremiosPendientes
    } = useQuiniela();

    const quinielasDisponibles = obtenerQuinielasDisponibles();
    const quinielasEnCurso = obtenerQuinielasEnCurso();
    const premiosPendientes = calcularTotalPremiosPendientes();

    const handleNavigateToQuinielas = () => {
        history.push(USER_ROUTES.QUINIELAS_CREADAS);
    };

    if (loading && quinielasPublicas.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    🏆 Tus Quinielas
                </h3>
                <button
                    onClick={handleNavigateToQuinielas}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    Ver todas →
                </button>
            </div>

            {/* Stats principales */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-blue-600">🎯</span>
                        <span className="text-sm font-medium text-gray-700">Creadas</span>
                    </div>
                    <p className="font-bold text-blue-800 text-xl">
                        {misQuinielas.length}
                    </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-green-600">👥</span>
                        <span className="text-sm font-medium text-gray-700">Participando</span>
                    </div>
                    <p className="font-bold text-green-800 text-xl">
                        {misParticipaciones.length}
                    </p>
                </div>
            </div>

            {/* Premios pendientes */}
            {premiosPendientes > 0 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 mb-4 text-white">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl">🏆</span>
                        <span className="font-medium">Premios Pendientes</span>
                    </div>
                    <p className="text-2xl font-bold">
                        {premiosPendientes}
                    </p>
                    <p className="text-sm opacity-90">
                        ¡Tienes premios por reclamar!
                    </p>
                </div>
            )}

            {/* Resumen de actividad */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <span className="text-green-600">✅</span>
                        <span className="text-sm text-gray-700">Disponibles para unirse</span>
                    </div>
                    <span className="font-bold text-green-700">
                        {quinielasDisponibles.length}
                    </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <span className="text-blue-600">▶️</span>
                        <span className="text-sm text-gray-700">En curso</span>
                    </div>
                    <span className="font-bold text-blue-700">
                        {quinielasEnCurso.length}
                    </span>
                </div>
            </div>

            {/* Últimas quinielas disponibles */}
            {quinielasDisponibles.length > 0 && (
                <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-600 mb-3">🔥 Últimas disponibles:</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {quinielasDisponibles.slice(0, 3).map((quiniela) => (
                            <div 
                                key={quiniela.id} 
                                className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                onClick={handleNavigateToQuinielas}
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-800 truncate max-w-32">
                                        {quiniela.nombre}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {quiniela.participantes} participantes
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-green-600">
                                        €{(quiniela.participantes * quiniela.precioEntrada).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        €{quiniela.precioEntrada.toFixed(2)} entrada
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Estado vacío */}
            {quinielasPublicas.length === 0 && misQuinielas.length === 0 && misParticipaciones.length === 0 && (
                <div className="text-center py-6">
                    <div className="text-4xl mb-2">🎯</div>
                    <p className="text-gray-600 text-sm mb-4">
                        No hay quinielas activas
                    </p>
                    <button
                        onClick={handleNavigateToQuinielas}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        ➕ Crear tu primera quiniela
                    </button>
                </div>
            )}

            {/* Botón de acción principal */}
            <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleNavigateToQuinielas}
                        className="py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
                    >
                        🎯 Ver Quinielas
                    </button>
                    <button
                        onClick={handleNavigateToQuinielas}
                        className="py-2 px-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-medium text-sm"
                    >
                        ➕ Crear Nueva
                    </button>
                </div>
            </div>
        </div>
    );
};
