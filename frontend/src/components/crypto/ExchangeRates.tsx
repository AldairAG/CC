import React from 'react';
import { useCrypto } from '../../hooks/useCrypto';

const ExchangeRates: React.FC = () => {
    const { exchangeRates, isLoading, error } = useCrypto();

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-700/40 rounded-xl mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-slate-700/40 rounded-lg"></div>
                        <div className="h-4 bg-slate-700/40 rounded-lg"></div>
                        <div className="h-4 bg-slate-700/40 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                <div className="text-red-300 text-sm">Error al cargar las tasas de cambio</div>
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
        <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-2">
                    💱 Tasas de Cambio
                </h3>
                <div className="text-xs text-gray-400 bg-slate-800/30 px-3 py-1 rounded-lg">
                    {exchangeRates.length > 0 ? formatTimestamp(exchangeRates[0].timestamp) : 'N/A'}
                </div>
            </div>
            
            <div className="space-y-3">
                {exchangeRates.map((rate) => (
                    <div key={rate.currency} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm rounded-xl border border-slate-600/20 hover:border-amber-500/40 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-amber-500/30">
                                <span className="text-xs font-bold text-amber-300">{rate.currency}</span>
                            </div>
                            <span className="font-medium text-white">{rate.currency}</span>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-white">{formatPrice(rate.usdPrice)}</div>
                            <div className="text-xs text-gray-400">USD</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExchangeRates;
