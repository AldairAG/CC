import React, { useEffect, useState } from 'react';
import { useQuiniela } from '../../hooks/useQuiniela';
import { useUser } from '../../hooks/useUser';
import type { QuinielaParticipacionType } from '../../types/QuinielaType';
import { EstadoParticipacion } from '../../types/QuinielaType';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface UserParticipationsListProps {
    userId?: number;
    showActions?: boolean;
    limit?: number;
    onViewQuiniela?: (quinielaId: number) => void;
    onMakePredicciones?: (participacionId: number, quinielaId: number) => void;
}

const UserParticipationsList: React.FC<UserParticipationsListProps> = ({
    userId,
    showActions = true,
    limit,
    onViewQuiniela,
    onMakePredicciones
}) => {
    const {
        participacionesUsuario,
        loading,
        errors,
        loadParticipacionesUsuario,
        loadParticipacionesUsuarioConRelaciones,
        cancelParticipacion,
        navigateToQuinielaDetail
    } = useQuiniela();

    const { user } = useUser();
    const [currentPage] = useState(0);
    const [selectedParticipacion, setSelectedParticipacion] = useState<QuinielaParticipacionType | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [useWithRelations, setUseWithRelations] = useState(true); // 🆕 Alternar entre métodos

    const targetUserId = userId || user?.idUsuario;

    useEffect(() => {
        if (targetUserId) {
            if (useWithRelations) {
                // Usar el nuevo método que carga relaciones
                loadParticipacionesUsuarioConRelaciones(targetUserId);
            } else {
                // Usar el método original paginado
                loadParticipacionesUsuario(targetUserId, currentPage, limit || 10);
            }
        }
    }, [targetUserId, currentPage, limit, useWithRelations, loadParticipacionesUsuario, loadParticipacionesUsuarioConRelaciones]);

    const handleViewQuiniela = (quinielaId: number) => {
        if (onViewQuiniela) {
            onViewQuiniela(quinielaId);
        } else {
            navigateToQuinielaDetail(quinielaId);
        }
    };

    const handleMakePredicciones = (participacion: QuinielaParticipacionType) => {
        if (onMakePredicciones) {
            onMakePredicciones(participacion.id, participacion.quinielaId);
        }
    };

    const handleCancelParticipacion = async () => {
        if (!selectedParticipacion) return;

        try {
            await cancelParticipacion(selectedParticipacion.id);
            setShowCancelModal(false);
            setSelectedParticipacion(null);
            // Recargar la lista
            if (targetUserId) {
                loadParticipacionesUsuario(targetUserId, currentPage, limit || 10);
            }
        } catch (error) {
            console.error('Error al cancelar participación:', error);
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case EstadoParticipacion.ACTIVA:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case EstadoParticipacion.PREDICCIONES_COMPLETADAS:
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case EstadoParticipacion.FINALIZADA:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            case EstadoParticipacion.GANADORA:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case EstadoParticipacion.CANCELADA:
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const canMakePredicciones = (participacion: QuinielaParticipacionType) => {
        return participacion.estado === EstadoParticipacion.ACTIVA;
    };

    const canCancelParticipacion = (participacion: QuinielaParticipacionType) => {
        return participacion.estado === EstadoParticipacion.ACTIVA;
    };

    if (loading.participaciones) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
                <span className="ml-2">Cargando participaciones...</span>
            </div>
        );
    }

    if (errors.participaciones) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400">
                    Error al cargar participaciones: {errors.participaciones}
                </p>
            </div>
        );
    }

    if (participacionesUsuario.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Sin participaciones
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {userId ? 'Este usuario no ha participado' : 'No has participado'} en ninguna quiniela aún.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {userId ? 'Participaciones del Usuario' : 'Mis Participaciones'}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {participacionesUsuario.length} participación{participacionesUsuario.length !== 1 ? 'es' : ''}
                </span>
            </div>

            {/* Lista de participaciones */}
            <div className="grid grid-cols-1 gap-4">
                {participacionesUsuario.map((participacion) => (
                    <div
                        key={participacion.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Quiniela #{participacion.quinielaId}
                                    </h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(participacion.estado)}`}>
                                        {participacion.estado}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Participación:</span>
                                        <p className="font-medium">
                                            {new Date(participacion.fechaParticipacion).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Monto Apostado:</span>
                                        <p className="font-medium text-green-600 dark:text-green-400">
                                            ${(participacion.montoApostado||0).toLocaleString()}
                                        </p>
                                    </div>
                                    {participacion.aciertos !== undefined && (
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Aciertos:</span>
                                            <p className="font-medium">{participacion.aciertos}</p>
                                        </div>
                                    )}
                                    {participacion.puntuacion !== undefined && (
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Puntuación:</span>
                                            <p className="font-medium">{participacion.puntuacion}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Información adicional */}
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    {participacion.posicionFinal !== undefined && (
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Posición Final:</span>
                                            <p className="font-medium">#{participacion.posicionFinal}</p>
                                        </div>
                                    )}
                                    {participacion.premioGanado !== undefined && participacion.premioGanado > 0 && (
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Premio Ganado:</span>
                                            <p className="font-bold text-green-600 dark:text-green-400">
                                                ${participacion.premioGanado.toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Acciones */}
                            {showActions && (
                                <div className="flex flex-col space-y-2 ml-4">
                                    <button
                                        onClick={() => handleViewQuiniela(participacion.quinielaId)}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Ver Quiniela
                                    </button>

                                    {canMakePredicciones(participacion) && (
                                        <button
                                            onClick={() => handleMakePredicciones(participacion)}
                                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                        >
                                            Hacer Predicciones
                                        </button>
                                    )}

                                    {canCancelParticipacion(participacion) && (
                                        <button
                                            onClick={() => {
                                                setSelectedParticipacion(participacion);
                                                setShowCancelModal(true);
                                            }}
                                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de confirmación de cancelación */}
            {showCancelModal && selectedParticipacion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Confirmar Cancelación
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            ¿Estás seguro de que quieres cancelar tu participación en la Quiniela #{selectedParticipacion.quinielaId}?
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setSelectedParticipacion(null);
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCancelParticipacion}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Confirmar Cancelación
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserParticipationsList;
