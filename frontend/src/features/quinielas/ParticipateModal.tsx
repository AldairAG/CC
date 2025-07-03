import React from 'react';
import type { QuinielaType } from '../../types/QuinielaType';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ParticipateModalProps {
    quiniela: QuinielaType;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ParticipateModal: React.FC<ParticipateModalProps> = ({
    quiniela,
    onConfirm,
    onCancel,
    isLoading = false
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Confirmar Participación
                    </h3>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <div className="text-gray-600 dark:text-gray-300 mb-4">
                        ¿Estás seguro de que quieres participar en esta quiniela?
                    </div>

                    {/* Quiniela Info */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {quiniela.nombre}
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Costo de participación:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    ${quiniela.costoParticipacion.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Pool actual:</span>
                                <span className="font-medium text-green-600">
                                    ${quiniela.poolActual.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Participantes:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {quiniela.participantesActuales}/{quiniela.maxParticipantes}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tipo:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {quiniela.tipoQuiniela}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex">
                            <div className="text-yellow-400 mr-2">⚠️</div>
                            <div className="text-yellow-800 text-sm">
                                <strong>Importante:</strong> Al participar, se debitará ${quiniela.costoParticipacion.toLocaleString()} de tu saldo. 
                                Esta acción no se puede deshacer.
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    {quiniela.reglasEspeciales && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <div className="text-blue-800 text-sm">
                                <strong>Reglas especiales:</strong>
                                <div className="mt-1 whitespace-pre-wrap">
                                    {quiniela.reglasEspeciales}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading && <LoadingSpinner />}
                        {isLoading ? 'Participando...' : 'Confirmar Participación'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParticipateModal;
