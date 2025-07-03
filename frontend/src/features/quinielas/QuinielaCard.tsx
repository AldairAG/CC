import React from 'react';
import type { QuinielaResumenType } from '../../types/QuinielaType';
import { EstadoQuiniela } from '../../types/QuinielaType';
import { useQuiniela } from '../../hooks/useQuiniela';

interface QuinielaCardProps {
    quiniela: QuinielaResumenType;
}

const QuinielaCard: React.FC<QuinielaCardProps> = ({ quiniela }) => {
    const { navigateToQuinielaDetail } = useQuiniela();

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

    const getProgressPercentage = () => {
        return (quiniela.participantesActuales / quiniela.maxParticipantes) * 100;
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

    const isClosingSoon = () => {
        const fechaCierre = new Date(quiniela.fechaCierre);
        const now = new Date();
        const hoursUntilClose = (fechaCierre.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursUntilClose <= 24 && hoursUntilClose > 0;
    };

    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
            onClick={() => navigateToQuinielaDetail(quiniela.id)}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {quiniela.nombre}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getEstadoBadgeColor(quiniela.estado)}`}>
                        {quiniela.estado}
                    </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                    {quiniela.descripcion}
                </p>

                {/* Alerta de cierre próximo */}
                {isClosingSoon() && (
                    <div className="bg-orange-100 border border-orange-300 text-orange-800 px-3 py-2 rounded-md text-sm mb-4">
                        ⚠️ ¡Cierra pronto!
                    </div>
                )}
            </div>

            {/* Información Principal */}
            <div className="p-6">
                {/* Pool y Costo */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            ${quiniela.poolActual.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Pool Actual</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            ${quiniela.costoParticipacion.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Costo</div>
                    </div>
                </div>

                {/* Progreso de Participantes */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <span>Participantes</span>
                        <span>{quiniela.participantesActuales}/{quiniela.maxParticipantes}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
                        />
                    </div>
                </div>

                {/* Detalles */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                        <span>Tipo:</span>
                        <span className="font-medium">{quiniela.tipoQuiniela}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Distribución:</span>
                        <span className="font-medium">{quiniela.tipoDistribucion}</span>
                    </div>
                    {quiniela.totalEventos && (
                        <div className="flex justify-between">
                            <span>Eventos:</span>
                            <span className="font-medium">{quiniela.totalEventos}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Cierra:</span>
                        <span className="font-medium">{formatDate(quiniela.fechaCierre)}</span>
                    </div>
                    {quiniela.nombreCreador && (
                        <div className="flex justify-between">
                            <span>Creador:</span>
                            <span className="font-medium">{quiniela.nombreCreador}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
                <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigateToQuinielaDetail(quiniela.id);
                    }}
                >
                    Ver Detalles y Participar
                </button>
            </div>
        </div>
    );
};

export default QuinielaCard;
