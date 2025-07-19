import React from 'react';
import type { CryptoTransaction } from '../../types/CryptoTypes';

interface TransactionStatusProps {
    transaction: CryptoTransaction;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ transaction }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return {
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                    icon: '✅',
                    text: 'Completado'
                };
            case 'PENDING':
                return {
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-100',
                    icon: '⏳',
                    text: 'Pendiente'
                };
            case 'FAILED':
                return {
                    color: 'text-red-600',
                    bgColor: 'bg-red-100',
                    icon: '❌',
                    text: 'Fallido'
                };
            default:
                return {
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    icon: '❓',
                    text: status
                };
        }
    };

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'DEPOSIT':
                return {
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100',
                    icon: '📥',
                    text: 'Depósito'
                };
            case 'WITHDRAWAL':
                return {
                    color: 'text-red-600',
                    bgColor: 'bg-red-100',
                    icon: '📤',
                    text: 'Retiro'
                };
            case 'CONVERSION':
                return {
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-100',
                    icon: '🔄',
                    text: 'Conversión'
                };
            default:
                return {
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    icon: '📋',
                    text: type
                };
        }
    };

    const statusConfig = getStatusConfig(transaction.status);
    const typeConfig = getTypeConfig(transaction.type);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-lg">{typeConfig.icon}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.color}`}>
                        {typeConfig.text}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-lg">{statusConfig.icon}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                        {statusConfig.text}
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-gray-600">Cantidad:</span>
                    <div className="font-semibold">{transaction.amount.toFixed(8)} {transaction.cryptoType}</div>
                </div>
                <div>
                    <span className="text-gray-600">Fecha:</span>
                    <div className="font-semibold">
                        {new Date(transaction.createdAt).toLocaleDateString('es-ES')}
                    </div>
                </div>
            </div>
            
            {transaction.notes && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                    <span className="text-gray-600">Notas:</span>
                    <div className="mt-1">{transaction.notes}</div>
                </div>
            )}
        </div>
    );
};

export default TransactionStatus;
