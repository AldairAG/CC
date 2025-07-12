import React from 'react';
import { useCryptoTransactions } from '../../hooks/useCryptoTransactions';

const ExchangeRates: React.FC = () => {
    const { exchangeRates, loading, error } = useCryptoTransactions();

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-red-500 text-sm">Error al cargar las tasas de cambio</div>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const formatTimestamp = (timestamp: Date) => {
        return new Date(timestamp).toLocaleString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Tasas de Cambio</h3>
                <div className="text-xs text-gray-500">
                    Última actualización: {exchangeRates.length > 0 ? formatTimestamp(exchangeRates[0].timestamp) : 'N/A'}
                </div>
            </div>
            
            <div className="space-y-3">
                {exchangeRates.map((rate) => (
                    <div key={rate.currency} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-600">{rate.currency}</span>
                            </div>
                            <span className="font-medium text-gray-900">{rate.currency}</span>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-gray-900">{formatPrice(rate.usdPrice)}</div>
                            <div className="text-xs text-gray-500">USD</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExchangeRates;
