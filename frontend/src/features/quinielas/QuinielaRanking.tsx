import React from 'react';
import type { RankingParticipacionType } from '../../types/QuinielaType';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface QuinielaRankingProps {
    ranking: RankingParticipacionType[];
    loading?: boolean;
}

const QuinielaRanking: React.FC<QuinielaRankingProps> = ({ ranking, loading = false }) => {
    const getPositionIcon = (position: number) => {
        switch (position) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return `#${position}`;
        }
    };

    const getPositionColor = (position: number) => {
        switch (position) {
            case 1:
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 2:
                return 'text-gray-600 bg-gray-50 border-gray-200';
            case 3:
                return 'text-orange-600 bg-orange-50 border-orange-200';
            default:
                return 'text-gray-500 bg-gray-50 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Ranking de Participantes
                </h2>
                <div className="flex justify-center items-center h-32">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Ranking de Participantes
            </h2>
            
            {ranking.length > 0 ? (
                <div className="space-y-3">
                    {ranking.slice(0, 10).map((participacion) => (
                        <div
                            key={participacion.participacionId}
                            className={`flex items-center justify-between p-3 rounded-lg border ${getPositionColor(participacion.posicion)}`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                    <span className="text-lg font-bold">
                                        {getPositionIcon(participacion.posicion)}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {participacion.nombreUsuario}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {participacion.aciertos} aciertos
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-900 dark:text-white">
                                    {participacion.puntuacion} pts
                                </div>
                                {participacion.premioGanado > 0 && (
                                    <div className="text-sm text-green-600 font-medium">
                                        +${participacion.premioGanado.toLocaleString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {ranking.length > 10 && (
                        <div className="text-center text-gray-500 text-sm pt-2">
                            Y {ranking.length - 10} participantes más...
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">👥</div>
                    <div>Aún no hay participantes</div>
                    <div className="text-sm mt-1">¡Sé el primero en participar!</div>
                </div>
            )}
        </div>
    );
};

export default QuinielaRanking;
