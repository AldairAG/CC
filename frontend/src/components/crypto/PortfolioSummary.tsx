import React from 'react';
import { useCryptoTransactions } from '../../hooks/useCryptoTransactions';

const PortfolioSummary: React.FC = () => {
    const { balances, convertToUSD, loading, error } = useCryptoTransactions();

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-red-500 text-center">
                    <h3 className="text-lg font-semibold mb-2">Error</h3>
                    <p className="text-sm">{error}</p>
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
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Resumen de Cartera</h3>
                <div className="text-3xl font-bold text-green-600">
                    ${totalValue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Valor Total en USD</div>
            </div>

            <div className="space-y-4">
                {balances.map((balance) => {
                    const usdValue = convertToUSD(balance.balance, balance.cryptoType);
                    const percentage = getPercentage(balance.balance, balance.cryptoType);
                    
                    return (
                        <div key={balance.cryptoType} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-600">
                                            {balance.cryptoType}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{balance.cryptoType}</div>
                                        <div className="text-sm text-gray-600">
                                            {balance.balance.toFixed(8)} {balance.cryptoType}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-gray-900">
                                        ${usdValue.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {percentage.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalValue === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-lg font-medium mb-1">Sin fondos disponibles</div>
                    <div className="text-sm">Realiza tu primer depósito para comenzar</div>
                </div>
            )}
        </div>
    );
};

export default PortfolioSummary;
