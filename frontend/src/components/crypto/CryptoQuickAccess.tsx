import React from 'react';
import { useHistory } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/ROUTERS';
import { useCryptoTransactions } from '../../hooks/useCryptoTransactions';
import { useUser } from '../../hooks/useUser';

export const CryptoQuickAccess: React.FC = () => {
  const history = useHistory();
  const { user } = useUser();
  const { balances, exchangeRates, loading } = useCryptoTransactions();

  const getTotalCryptoUSD = () => {
    return balances.reduce((total, balance) => total + balance.usdValue, 0);
  };

  const getTotalBalanceUSD = () => {
    const fiatBalance = user?.saldo || 0;
    const cryptoBalance = getTotalCryptoUSD();
    return fiatBalance + cryptoBalance;
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const getCryptoIcon = (cryptoType: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      SOL: '◎'
    };
    return icons[cryptoType as keyof typeof icons] || '●';
  };

  const handleNavigateToCrypto = () => {
    history.push(USER_ROUTES.CRYPTO_WALLET);
  };

  if (loading && balances.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          💰 Tu Balance Total
        </h3>
        <button
          onClick={handleNavigateToCrypto}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Ver detalles →
        </button>
      </div>

      {/* Balance total destacado */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 mb-4 text-white">
        <p className="text-sm opacity-90 mb-1">Balance disponible para jugar</p>
        <p className="text-2xl font-bold">
          ${formatCurrency(getTotalBalanceUSD())}
        </p>
      </div>

      {/* Desglose rápido */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-green-600">💵</span>
            <span className="text-sm font-medium text-gray-700">Fiat</span>
          </div>
          <p className="font-bold text-gray-800">
            ${formatCurrency(user?.saldo || 0)}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-orange-600">₿</span>
            <span className="text-sm font-medium text-gray-700">Crypto</span>
          </div>
          <p className="font-bold text-gray-800">
            ${formatCurrency(getTotalCryptoUSD())}
          </p>
        </div>
      </div>

      {/* Crypto balances individuales */}
      {balances.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Criptomonedas:</p>
          {balances.slice(0, 3).map((balance) => (
            <div key={balance.cryptoType} className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{getCryptoIcon(balance.cryptoType)}</span>
                <span className="text-sm text-gray-600">{balance.cryptoType}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {balance.balance.toFixed(4)} {balance.cryptoType}
                </p>
                <p className="text-xs text-gray-500">
                  ${formatCurrency(balance.usdValue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Precios actuales */}
      {exchangeRates.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-sm font-medium text-gray-600 mb-2">Precios actuales:</p>
          <div className="grid grid-cols-3 gap-2">
            {exchangeRates.map((rate) => (
              <div key={rate.currency} className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-xs">{getCryptoIcon(rate.currency)}</span>
                  <span className="text-xs font-medium">{rate.currency}</span>
                </div>
                <p className="text-xs text-gray-800 font-bold">
                  ${formatCurrency(rate.usdPrice)}
                </p>
                <p className={`text-xs ${
                  rate.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {rate.changePercent24h >= 0 ? '+' : ''}{rate.changePercent24h.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de acción */}
      <div className="mt-4 pt-3 border-t">
        <button
          onClick={handleNavigateToCrypto}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium text-sm"
        >
          🚀 Gestionar Criptomonedas
        </button>
      </div>
    </div>
  );
};
