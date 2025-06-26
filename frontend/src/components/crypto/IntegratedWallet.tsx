import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { useCryptoTransactions } from '../../hooks/useCryptoTransactions';

interface IntegratedWalletProps {
  onDepositCrypto?: () => void;
  onDepositFiat?: () => void;
}

export const IntegratedWallet: React.FC<IntegratedWalletProps> = ({ 
  onDepositCrypto, 
  onDepositFiat 
}) => {
  const { user } = useUser();
  const { balances, exchangeRates, loading: cryptoLoading } = useCryptoTransactions();
  const [showCryptoDetails, setShowCryptoDetails] = useState(false);
  // Balance total en USD (fiat + crypto)
  const getTotalBalanceUSD = () => {
    const fiatBalance = user?.saldo || 0;
    const cryptoBalanceUSD = balances.reduce((total, balance) => total + balance.usdValue, 0);
    return fiatBalance + cryptoBalanceUSD;
  };

  // Balance solo de crypto en USD
  const getCryptoBalanceUSD = () => {
    return balances.reduce((total, balance) => total + balance.usdValue, 0);
  };

  const getCryptoIcon = (cryptoType: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      SOL: '◎'
    };
    return icons[cryptoType as keyof typeof icons] || '●';
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  if (cryptoLoading && balances.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header con balance total */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium mb-2">Balance Total del Casino</h2>
            <p className="text-3xl font-bold mb-1">
              ${formatCurrency(getTotalBalanceUSD())}
            </p>
            <p className="text-blue-100 text-sm">
              Disponible para jugar
            </p>
          </div>
          <div className="text-right">
            <div className="flex space-x-2">
              <button
                onClick={onDepositFiat}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                + Fiat
              </button>
              <button
                onClick={onDepositCrypto}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                + Crypto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de balances */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Balance Fiat */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  💵
                </div>
                <span className="font-medium text-gray-800">Balance Fiat</span>
              </div>
            </div>            <p className="text-2xl font-bold text-gray-800">
              ${formatCurrency(user?.saldo || 0)}
            </p>
            <p className="text-sm text-gray-500">Dólares estadounidenses</p>
          </div>

          {/* Balance Crypto Total */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  ₿
                </div>
                <span className="font-medium text-gray-800">Balance Crypto</span>
              </div>
              <button
                onClick={() => setShowCryptoDetails(!showCryptoDetails)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showCryptoDetails ? 'Ocultar' : 'Ver detalles'}
              </button>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              ${formatCurrency(getCryptoBalanceUSD())}
            </p>
            <p className="text-sm text-gray-500">
              {balances.length} criptomoneda{balances.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Detalles de crypto (expandible) */}
        {showCryptoDetails && (
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-800 mb-3">Desglose de Criptomonedas</h3>
            {balances.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No tienes balances de criptomonedas</p>
                <button
                  onClick={onDepositCrypto}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Hacer primer depósito crypto
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {balances.map((balance) => (
                  <div key={balance.cryptoType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">
                        {getCryptoIcon(balance.cryptoType)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {balance.balance.toFixed(8)} {balance.cryptoType}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${formatCurrency(balance.usdValue)}
                        </p>
                      </div>
                    </div>
                    {(balance.pendingDeposits > 0 || balance.pendingWithdrawals > 0) && (
                      <div className="text-right">
                        <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                          Pendiente
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Acciones rápidas */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium text-gray-800 mb-3">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={onDepositFiat}
              className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                💳
              </div>
              <span className="text-sm font-medium text-gray-700">Depositar Fiat</span>
            </button>
            
            <button
              onClick={onDepositCrypto}
              className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                ₿
              </div>
              <span className="text-sm font-medium text-gray-700">Depositar Crypto</span>
            </button>
            
            <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                🔄
              </div>
              <span className="text-sm font-medium text-gray-700">Convertir</span>
            </button>
            
            <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                📊
              </div>
              <span className="text-sm font-medium text-gray-700">Historial</span>
            </button>
          </div>
        </div>

        {/* Información de tipos de cambio */}
        {exchangeRates.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium text-gray-800 mb-3">Tipos de Cambio</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {exchangeRates.map((rate) => (
                <div key={rate.currency} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCryptoIcon(rate.currency)}</span>
                    <span className="font-medium text-gray-700">{rate.currency}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      ${formatCurrency(rate.usdPrice)}
                    </p>
                    <p className={`text-xs ${
                      rate.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {rate.changePercent24h >= 0 ? '+' : ''}{rate.changePercent24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
