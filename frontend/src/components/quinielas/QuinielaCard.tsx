import React from 'react';
import type { QuinielaResponse } from '../../types/QuinielaType';

interface Props {
    quiniela: QuinielaResponse;
    onVerDetalles?: (quinielaId: number) => void;
    onUnirse?: (quinielaId: number) => void;
    onHacerPredicciones?: (quinielaId: number) => void;
    showJoinButton?: boolean;
    tipo?: 'publica' | 'mia' | 'participacion';
}

export const QuinielaCard: React.FC<Props> = ({ 
    quiniela, 
    onVerDetalles, 
    onUnirse, 
    onHacerPredicciones,
    showJoinButton = true,
    tipo = 'publica'
}) => {
    const fechaInicio = new Date(quiniela.fechaInicio);
    const fechaFin = new Date(quiniela.fechaFin);
    const ahora = new Date();
    
    const estado = ahora < fechaInicio ? 'pendiente' : 
                  ahora > fechaFin ? 'finalizada' : 'en_curso';

    const getEstadoColor = () => {
        switch (estado) {
            case 'pendiente': return 'bg-yellow-100 text-yellow-800';
            case 'en_curso': return 'bg-green-100 text-green-800';
            case 'finalizada': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEstadoTexto = () => {
        switch (estado) {
            case 'pendiente': return 'Pendiente';
            case 'en_curso': return 'En Curso';
            case 'finalizada': return 'Finalizada';
            default: return 'Desconocido';
        }
    };

    const formatearFecha = (fecha: Date) => {
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalPremios = quiniela.participantes * quiniela.precioEntrada;

    const puedeUnirse = quiniela.estado === 'ACTIVA' && 
                       new Date(quiniela.fechaInicio) > new Date() &&
                       (!quiniela.maxParticipantes || quiniela.participantesActuales < quiniela.maxParticipantes);

    const tiempoRestante = calcularTiempoRestante(quiniela.fechaInicio);

    return (
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-800 truncate">
                            {quiniela.nombre}
                        </h3>
                        <span className={`text-sm ${obtenerEstadoColor(quiniela.estado)}`}>
                            {obtenerEstadoIcono(quiniela.estado)} {quiniela.estado}
                        </span>
                    </div>
                    {quiniela.descripcion && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                            {quiniela.descripcion}
                        </p>
                    )}
                </div>
                {!quiniela.esPublica && (
                    <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs">
                        🔒 Privada
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-blue-600">💰</span>
                        <div>
                            <p className="text-xs text-gray-600">Premio Total</p>
                            <p className="font-bold text-blue-800">
                                {formatearMoneda(quiniela.premioTotal || 0, quiniela.esCrypto, quiniela.cryptoTipo)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-green-600">🎫</span>
                        <div>
                            <p className="text-xs text-gray-600">Entrada</p>
                            <p className="font-bold text-green-800">
                                {formatearMoneda(quiniela.precioEntrada, quiniela.esCrypto, quiniela.cryptoTipo)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-purple-600">👥</span>
                        <div>
                            <p className="text-xs text-gray-600">Participantes</p>
                            <p className="font-bold text-purple-800">
                                {quiniela.participantesActuales}
                                {quiniela.maxParticipantes && ` / ${quiniela.maxParticipantes}`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-orange-600">⏰</span>
                        <div>
                            <p className="text-xs text-gray-600">Tiempo</p>
                            <p className="font-bold text-orange-800">
                                {tiempoRestante}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {quiniela.maxParticipantes && (
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Ocupación</span>
                        <span>{Math.round(porcentajeOcupacion)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-all ${
                                porcentajeOcupacion < 50 ? 'bg-green-500' :
                                porcentajeOcupacion < 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${porcentajeOcupacion}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Prize Distribution */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Distribución de Premios:</p>
                <div className="flex items-center space-x-4 text-xs">
                    {quiniela.tipoDistribucion === 'WINNER_TAKES_ALL' ? (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            🏆 Ganador se lleva todo
                        </span>
                    ) : (
                        <div className="flex space-x-2">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                🥇 {quiniela.porcentajePremiosPrimero}%
                            </span>
                            {quiniela.porcentajePremiosSegundo > 0 && (
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                    🥈 {quiniela.porcentajePremiosSegundo}%
                                </span>
                            )}
                            {quiniela.porcentajePremiosTercero > 0 && (
                                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                    🥉 {quiniela.porcentajePremiosTercero}%
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Crypto Badge */}
            {quiniela.esCrypto && (
                <div className="mb-4 flex items-center justify-center space-x-2 bg-orange-50 text-orange-700 py-2 px-3 rounded-lg text-sm">
                    <span>₿</span>
                    <span>Pagos en {quiniela.cryptoTipo}</span>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
                <button
                    onClick={() => onVerDetalles?.(quiniela)}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                >
                    👁️ Ver Detalles
                </button>
                
                {showJoinButton && puedeUnirse && (
                    <button
                        onClick={() => onUnirse?.(quiniela)}
                        className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                        🚀 Unirse
                    </button>
                )}
                
                {!puedeUnirse && quiniela.estado === 'ACTIVA' && (
                    <div className="flex-1 py-2 px-4 bg-gray-100 text-gray-500 rounded-md text-sm font-medium text-center">
                        {new Date(quiniela.fechaInicio) <= new Date() ? '▶️ Iniciada' : '🚫 Llena'}
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>Creada: {new Date(quiniela.fechaCreacion).toLocaleDateString()}</span>
                <span>ID: #{quiniela.id}</span>
            </div>
        </div>
    );
};
