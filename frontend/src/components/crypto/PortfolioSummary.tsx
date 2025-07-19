import React from 'react';
import { useCrypto } from '../../hooks/useCrypto';

const PortfolioSummary: React.FC = () => {
    const { balances, convertToUSD, isLoading, error } = useCrypto();

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
                <div className="text-red-300 text-center">
                    <h3 className="text-lg font-semibold mb-2">Error</h3>
                    <p className="text-sm text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    const getTotalValue = () => {
        return balances.reduce((total, balance) => {
            return total + convertToUSD(balance.balance, balance.cryptoType);
        }, 0);
    };

    const getPercentage = (balance: number, cryptoType: string) => {
        const totalValue = getTotalValue();
        if (totalValue === 0) return 0;
        return (convertToUSD(balance, cryptoType) / totalValue) * 100;
    };

    const totalValue = getTotalValue();

    return (
        <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
            <div className="text-center mb-6">
                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-3 flex items-center justify-center gap-2">
                    📊 Resumen de Cartera
                </h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    ${totalValue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400 mt-1">Valor Total en USD</div>
            </div>

            <div className="space-y-4">
                {balances.map((balance) => {
                    const usdValue = convertToUSD(balance.balance, balance.cryptoType);
                    const percentage = getPercentage(balance.balance, balance.cryptoType);
                    
                    return (
                        <div key={balance.cryptoType} className="border-b border-slate-700/30 pb-4 last:border-b-0">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-amber-500/30">
                                        <span className="text-sm font-bold text-amber-300">
                                            {balance.cryptoType}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{balance.cryptoType}</div>
                                        <div className="text-sm text-gray-400">
                                            {balance.balance.toFixed(8)} {balance.cryptoType}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-white">
                                        ${usdValue.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {percentage.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalValue === 0 && (
                <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-3">📊</div>
                    <div className="text-lg font-medium mb-2 text-amber-300">Sin fondos disponibles</div>
                    <div className="text-sm">Realiza tu primer depósito para comenzar</div>
                </div>
            )}
        </div>
    );
};

export default PortfolioSummary;
