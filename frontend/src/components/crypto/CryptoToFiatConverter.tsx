import React, { useState } from 'react';
import { useCryptoTransactions } from '../../hooks/useCryptoTransactions';
import { useUser } from '../../hooks/useUser';
import { CryptoService } from '../../service/crypto/cryptoService';
import type { CryptoBalance, ExchangeRate } from '../../types/CryptoTypes';
import { toast } from 'react-toastify';

interface CryptoToFiatConverterProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const CryptoToFiatConverter: React.FC<CryptoToFiatConverterProps> = ({ 
  onSuccess, 
  onClose 
}) => {
  const { balances, exchangeRates, convertToUSD } = useCryptoTransactions();
  const { user, refreshUser } = useUser();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [usdValue, setUsdValue] = useState(0);
  const [fiatValue, setFiatValue] = useState(0);

  // Calcular valores cuando cambia el monto
  React.useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      const usd = convertToUSD(Number(amount), selectedCrypto);
      setUsdValue(usd);
      // Aplicar comisión de conversión del 2%
      const fiat = usd * 0.98;
      setFiatValue(fiat);
    } else {
      setUsdValue(0);
      setFiatValue(0);
    }
  }, [amount, selectedCrypto, convertToUSD]);

  const getCryptoIcon = (cryptoType: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      SOL: '◎'
    };
    return icons[cryptoType as keyof typeof icons] || '●';
  };

  const getAvailableBalance = (cryptoType: string) => {
    const balance = balances.find((b: CryptoBalance) => b.cryptoType === cryptoType);
    return balance ? balance.balance : 0;
  };

  const getCurrentRate = (cryptoType: string) => {
    return exchangeRates.find((r: ExchangeRate) => r.currency === cryptoType);
  };

  const handleConvert = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }

    const availableBalance = getAvailableBalance(selectedCrypto);
    if (Number(amount) > availableBalance) {
      toast.error('Balance insuficiente');
      return;
    }

    setLoading(true);
    try {
      const response = await CryptoService.convertToFiat({
        cryptoType: selectedCrypto,
        amount: Number(amount),
        notes: `Conversión de ${amount} ${selectedCrypto} a USD`
      });

      if (response.status === 'COMPLETED') {
        toast.success(`¡Conversión exitosa! Se agregaron $${response.fiatAmountAdded.toFixed(2)} a tu saldo`);
        
        // Refrescar datos del usuario
        await refreshUser();
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.message || 'Error en la conversión');
      }
    } catch (error) {
      console.error('Error converting crypto to fiat:', error);
      toast.error('Error al procesar la conversión');
    } finally {
      setLoading(false);
    }
  };

  const filteredBalances = balances.filter((balance: CryptoBalance) => balance.balance > 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          💱 Convertir Crypto a Saldo
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {filteredBalances.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No tienes criptomonedas
          </h3>
          <p className="text-gray-600 text-sm">
            Primero deposita criptomonedas para poder convertirlas
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Selección de criptomoneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Criptomoneda
            </label>
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filteredBalances.map((balance: CryptoBalance) => (
                <option key={balance.cryptoType} value={balance.cryptoType}>
                  {getCryptoIcon(balance.cryptoType)} {balance.cryptoType} - Disponible: {balance.balance.toFixed(8)}
                </option>
              ))}
            </select>
            {getCurrentRate(selectedCrypto) && (
              <p className="text-sm text-gray-500 mt-1">
                Precio actual: ${getCurrentRate(selectedCrypto)?.usdPrice.toLocaleString()} USD
              </p>
            )}
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto ({selectedCrypto})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
              min="0"
              max={getAvailableBalance(selectedCrypto)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Mínimo: 0.001 ${selectedCrypto}`}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Disponible: {getAvailableBalance(selectedCrypto).toFixed(8)}</span>
              <button
                onClick={() => setAmount(getAvailableBalance(selectedCrypto).toString())}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Usar todo
              </button>
            </div>
          </div>

          {/* Resumen de conversión */}
          {usdValue > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-gray-800">Resumen de conversión:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor en USD:</span>
                  <span className="font-medium">${usdValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comisión (2%):</span>
                  <span className="font-medium text-red-600">-${(usdValue * 0.02).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-gray-800 font-medium">Recibirás:</span>
                  <span className="font-bold text-green-600">${fiatValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Información del usuario */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Saldo actual:</span>
                <span className="font-medium text-blue-800">${user?.saldo?.toFixed(2) || '0.00'}</span>
              </div>
              {fiatValue > 0 && (
                <div className="flex justify-between mt-1">
                  <span className="text-blue-700">Nuevo saldo:</span>
                  <span className="font-bold text-blue-800">${((user?.saldo || 0) + fiatValue).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botón de conversión */}
          <button
            onClick={handleConvert}
            disabled={loading || !amount || Number(amount) <= 0 || Number(amount) > getAvailableBalance(selectedCrypto)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Procesando...</span>
              </div>
            ) : (
              `Convertir a saldo del casino`
            )}
          </button>

          {/* Nota informativa */}
          <div className="text-xs text-gray-500 text-center">
            ⚡ La conversión es instantánea y el saldo estará disponible inmediatamente para jugar
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoToFiatConverter;
