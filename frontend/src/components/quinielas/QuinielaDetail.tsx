import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuiniela } from '../../hooks/useQuiniela';
import { useUser } from '../../hooks/useUser';
import { EstadoQuiniela } from '../../types/QuinielaType';
import LoadingSpinner from '../ui/LoadingSpinner';
import QuinielaRanking from './QuinielaRanking';
import ParticipateModal from './ParticipateModal';

const QuinielaDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useUser();
    const {
        // Estado
        quinielaActual,
        rankingQuiniela,
        participacionesUsuario,
        loading,
        yaParticipaEnQuinielaActual,
        
        // Funciones
        loadQuinielaDetail,
        loadRankingQuiniela,
        loadParticipacionesUsuario,
        participateInQuiniela,
        canUserParticipate,
        clearCurrentQuiniela,
        
        // Estados específicos
        isLoadingQuinielaActual,
        isParticipandoEnQuiniela,
        errorQuinielaActual
    } = useQuiniela();

    const [showParticipateModal, setShowParticipateModal] = useState(false);
    const [canParticipate, setCanParticipate] = useState(false);
    const [userParticipation, setUserParticipation] = useState<any>(null);

    useEffect(() => {
        const quinielaId = parseInt(id || '0');
        if (quinielaId && quinielaId > 0) {
            loadQuinielaDetail(quinielaId);
            loadRankingQuiniela(quinielaId);
            
            if (user?.idUsuario) {
                loadParticipacionesUsuario(user.idUsuario);
                checkParticipationStatus(quinielaId, user.idUsuario);
            }
        }

        return () => {
            clearCurrentQuiniela();
        };
    }, [id, user?.idUsuario, loadQuinielaDetail, loadRankingQuiniela, loadParticipacionesUsuario, clearCurrentQuiniela]);

    const checkParticipationStatus = async (quinielaId: number, usuarioId: number) => {
        try {
            const canPart = await canUserParticipate(quinielaId, usuarioId);
            setCanParticipate(canPart);
            
            // Buscar participación existente
            const existingParticipation = participacionesUsuario.find(p => p.quinielaId === quinielaId);
            setUserParticipation(existingParticipation || null);
        } catch (error) {
            console.error('Error verificando participación:', error);
        }
    };

    const handleParticipate = async () => {
        if (!user?.idUsuario || !quinielaActual) return;

        try {
            const result = await participateInQuiniela(quinielaActual.id, user.idUsuario);
            if (result) {
                setShowParticipateModal(false);
                setUserParticipation(result);
                setCanParticipate(false);
                // Recargar ranking
                loadRankingQuiniela(quinielaActual.id);
            }
        } catch (error) {
            console.error('Error al participar:', error);
        }
    };

    const getEstadoBadgeColor = (estado: EstadoQuiniela) => {
        switch (estado) {
            case EstadoQuiniela.ACTIVA:
                return 'bg-green-100 text-green-800 border-green-200';
            case EstadoQuiniela.CERRADA:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case EstadoQuiniela.FINALIZADA:
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRemainingTime = () => {
        if (!quinielaActual) return '';
        
        const fechaCierre = new Date(quinielaActual.fechaCierre);
        const now = new Date();
        const diff = fechaCierre.getTime() - now.getTime();
        
        if (diff <= 0) return 'Cerrada';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    if (isLoadingQuinielaActual) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (errorQuinielaActual) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {errorQuinielaActual}
                </div>
            </div>
        );
    }

    if (!quinielaActual) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center text-gray-500">
                    Quiniela no encontrada
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
                <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {quinielaActual.nombre}
                                </h1>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getEstadoBadgeColor(quinielaActual.estado)}`}>
                                    {quinielaActual.estado}
                                </span>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                                {quinielaActual.descripcion}
                            </p>

                            {/* Información clave */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        ${quinielaActual.poolActual.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-500">Pool Actual</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        ${quinielaActual.costoParticipacion.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-500">Costo</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {quinielaActual.participantesActuales}/{quinielaActual.maxParticipantes}
                                    </div>
                                    <div className="text-sm text-gray-500">Participantes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {getRemainingTime()}
                                    </div>
                                    <div className="text-sm text-gray-500">Tiempo Restante</div>
                                </div>
                            </div>
                        </div>

                        {/* Botón de participación */}
                        <div className="flex flex-col gap-3">
                            {user ? (
                                yaParticipaEnQuinielaActual || userParticipation ? (
                                    <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-center">
                                        ✅ Ya estás participando
                                    </div>
                                ) : quinielaActual.estado === EstadoQuiniela.ACTIVA && canParticipate ? (
                                    <button
                                        onClick={() => setShowParticipateModal(true)}
                                        disabled={isParticipandoEnQuiniela}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isParticipandoEnQuiniela && <LoadingSpinner />}
                                        {isParticipandoEnQuiniela ? 'Participando...' : 'Participar Ahora'}
                                    </button>
                                ) : (
                                    <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-center">
                                        No disponible para participar
                                    </div>
                                )
                            ) : (
                                <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg text-center">
                                    Inicia sesión para participar
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información Detallada */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Detalles */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Detalles de la Quiniela
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Tipo de Quiniela</dt>
                                <dd className="text-lg text-gray-900 dark:text-white">{quinielaActual.tipoQuiniela}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Distribución de Premios</dt>
                                <dd className="text-lg text-gray-900 dark:text-white">{quinielaActual.tipoDistribucion}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Premio Mínimo</dt>
                                <dd className="text-lg text-gray-900 dark:text-white">${quinielaActual.premioMinimo.toLocaleString()}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Total de Eventos</dt>
                                <dd className="text-lg text-gray-900 dark:text-white">{quinielaActual.totalEventos || 'N/A'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Fecha de Inicio</dt>
                                <dd className="text-lg text-gray-900 dark:text-white">{formatDate(quinielaActual.fechaInicio)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Fecha de Cierre</dt>
                                <dd className="text-lg text-gray-900 dark:text-white">{formatDate(quinielaActual.fechaCierre)}</dd>
                            </div>
                            {quinielaActual.nombreCreador && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Creado por</dt>
                                    <dd className="text-lg text-gray-900 dark:text-white">{quinielaActual.nombreCreador}</dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Visibilidad</dt>
                                <dd className="text-lg text-gray-900 dark:text-white">
                                    {quinielaActual.esPublica ? 'Pública' : 'Privada'}
                                </dd>
                            </div>
                        </div>

                        {/* Progreso de participantes */}
                        <div className="mt-6">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <span>Progreso de Participantes</span>
                                <span>{((quinielaActual.participantesActuales / quinielaActual.maxParticipantes) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((quinielaActual.participantesActuales / quinielaActual.maxParticipantes) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Reglas especiales */}
                        {quinielaActual.reglasEspeciales && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Reglas Especiales
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                    {quinielaActual.reglasEspeciales}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ranking */}
                <div className="lg:col-span-1">
                    <QuinielaRanking ranking={rankingQuiniela} loading={loading.ranking} />
                </div>
            </div>

            {/* Modal de Participación */}
            {showParticipateModal && quinielaActual && (
                <ParticipateModal
                    quiniela={quinielaActual}
                    onConfirm={handleParticipate}
                    onCancel={() => setShowParticipateModal(false)}
                    isLoading={isParticipandoEnQuiniela}
                />
            )}
        </div>
    );
};

export default QuinielaDetail;
