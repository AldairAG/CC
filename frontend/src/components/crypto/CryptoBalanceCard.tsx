import React from 'react';
import { useCryptoTransactions } from '../../hooks/useCryptoTransactions';

interface CryptoBalanceCardProps {
  onDeposit?: () => void;
  onWithdraw?: (cryptoType: string) => void;
}

export const CryptoBalanceCard: React.FC<CryptoBalanceCardProps> = ({ onDeposit, onWithdraw }) => {
  const {
    loading,
    error,
    balances,
    exchangeRates,
    networks
  } = useCryptoTransactions();

  const getTotalUSDValue = () => {
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

  const getNetworkName = (cryptoType: string) => {
    return networks.find(n => n.type === cryptoType)?.name || cryptoType;
  };

  const getCurrentRate = (cryptoType: string) => {
    return exchangeRates.find(r => r.currency === cryptoType);
  };

  if (loading && balances.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600">
          <p>Error al cargar balances</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Balances Crypto
        </h2>
        <button
          onClick={onDeposit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          + Depositar
        </button>
      </div>

      {/* Balance total */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 mb-6 text-white">
        <h3 className="text-lg font-medium mb-2">Balance Total</h3>
        <p className="text-3xl font-bold">
          ${getTotalUSDValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-blue-100 text-sm mt-1">
          Valor en dólares estadounidenses
        </p>
      </div>

      {/* Lista de balances por criptomoneda */}
      <div className="space-y-4">
        {balances.map((balance) => {
          const rate = getCurrentRate(balance.cryptoType);
          const network = getNetworkName(balance.cryptoType);
          
          return (
            <div
              key={balance.cryptoType}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    {getCryptoIcon(balance.cryptoType)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{network}</h4>
                    <p className="text-sm text-gray-500">{balance.cryptoType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    {balance.balance.toFixed(8)} {balance.cryptoType}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${balance.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-gray-500">Precio actual</p>
                  <p className="font-medium">
                    ${rate?.usdPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Cambio 24h</p>
                  <p className={`font-medium ${
                    (rate?.changePercent24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(rate?.changePercent24h || 0) >= 0 ? '+' : ''}
                    {rate?.changePercent24h.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Transacciones pendientes */}
              {(balance.pendingDeposits > 0 || balance.pendingWithdrawals > 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                  <h5 className="text-sm font-medium text-yellow-800 mb-1">
                    Transacciones pendientes:
                  </h5>
                  {balance.pendingDeposits > 0 && (
                    <p className="text-xs text-yellow-700">
                      Depósitos: {balance.pendingDeposits} {balance.cryptoType}
                    </p>
                  )}
                  {balance.pendingWithdrawals > 0 && (
                    <p className="text-xs text-yellow-700">
                      Retiros: {balance.pendingWithdrawals} {balance.cryptoType}
                    </p>
                  )}
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex space-x-2">
                <button
                  onClick={onDeposit}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 text-sm font-medium"
                >
                  Depositar
                </button>
                <button
                  onClick={() => onWithdraw?.(balance.cryptoType)}
                  disabled={balance.balance <= 0}
                  className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Retirar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {balances.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-lg font-medium mb-2">No tienes balances aún</h3>
          <p className="text-sm mb-4">
            Comienza depositando criptomonedas para empezar a jugar
          </p>
          <button
            onClick={onDeposit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            Hacer primer depósito
          </button>
        </div>
      )}

      {/* Nota al pie */}
      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          💡 Los precios se actualizan cada 30 segundos. Las transacciones requieren confirmaciones de red antes de ser completadas.
        </p>
      </div>
    </div>
  );
};
