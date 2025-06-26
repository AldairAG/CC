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

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {quiniela.nombre}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor()}`}>
                            {getEstadoTexto()}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                            ${totalPremios.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">en premios</div>
                    </div>
                </div>

                {/* Descripcion */}
                {quiniela.descripcion && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {quiniela.descripcion}
                    </p>
                )}

                {/* Detalles */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <span className="text-gray-500">Inicio:</span>
                        <div className="font-medium">{formatearFecha(fechaInicio)}</div>
                    </div>
                    <div>
                        <span className="text-gray-500">Fin:</span>
                        <div className="font-medium">{formatearFecha(fechaFin)}</div>
                    </div>
                    <div>
                        <span className="text-gray-500">Entrada:</span>
                        <div className="font-medium">${quiniela.precioEntrada}</div>
                    </div>
                    <div>
                        <span className="text-gray-500">Participantes:</span>
                        <div className="font-medium">
                            {quiniela.participantes}
                            {quiniela.maxParticipantes && ` / ${quiniela.maxParticipantes}`}
                        </div>
                    </div>
                </div>

                {/* Eventos */}
                <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">
                        {quiniela.eventos?.length || 0} eventos
                    </div>
                    {quiniela.eventos && quiniela.eventos.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {quiniela.eventos.slice(0, 3).map((evento, index) => (
                                <span 
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                >
                                    ⚽ {evento.equipoLocal} vs {evento.equipoVisitante}
                                </span>
                            ))}
                            {quiniela.eventos.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                    +{quiniela.eventos.length - 3} más
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Tipo de distribución */}
                <div className="text-xs text-gray-500 mb-4">
                    {quiniela.tipoDistribucion === 'WINNER_TAKES_ALL' ? 
                        '🏆 El ganador se lleva todo' : 
                        '🏅 Premios distribuidos por posición'
                    }
                </div>

                {/* Acciones */}
                <div className="flex space-x-2">
                    {onVerDetalles && (
                        <button
                            onClick={() => onVerDetalles(quiniela.id)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Ver Detalles
                        </button>
                    )}
                    
                    {estado === 'pendiente' && onUnirse && showJoinButton && (
                        <button
                            onClick={() => onUnirse(quiniela.id)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            disabled={!!(quiniela.maxParticipantes && quiniela.participantes >= quiniela.maxParticipantes)}
                        >
                            {quiniela.maxParticipantes && quiniela.participantes >= quiniela.maxParticipantes ? 
                                'Completa' : 'Unirse'
                            }
                        </button>
                    )}
                    
                    {estado === 'en_curso' && onHacerPredicciones && tipo === 'participacion' && (
                        <button
                            onClick={() => onHacerPredicciones(quiniela.id)}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            Predecir
                        </button>
                    )}
                    
                    {estado === 'finalizada' && (
                        <button
                            disabled
                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                        >
                            Finalizada
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
