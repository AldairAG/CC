import React, { useState, useEffect } from 'react';
import { useCryptoTransactions } from '../../hooks/useCryptoTransactions';
import type { CryptoType } from '../../types/CryptoTypes';

interface CryptoDepositFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const CryptoDepositForm: React.FC<CryptoDepositFormProps> = ({ onSuccess, onClose }) => {
  const {
    loading,
    error,
    networks,
    exchangeRates,
    generateDepositAddress,
    createDeposit,
    validateAddress,
    convertToUSD,
    clearError,
    depositAddress
  } = useCryptoTransactions();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('BTC');
  const [amount, setAmount] = useState('');
  const [userWalletAddress, setUserWalletAddress] = useState('');
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);
  const [usdValue, setUsdValue] = useState(0);
  const [step, setStep] = useState<'form' | 'address' | 'confirm'>('form');

  // Calcular valor en USD cuando cambia el monto
  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      const usd = convertToUSD(Number(amount), selectedCrypto);
      setUsdValue(usd);
    } else {
      setUsdValue(0);
    }
  }, [amount, selectedCrypto, convertToUSD]);

  // Validar dirección cuando cambia
  useEffect(() => {
    if (userWalletAddress.trim()) {
      const validateAddr = async () => {
        const valid = await validateAddress(userWalletAddress, selectedCrypto);
        setIsAddressValid(valid);
      };
      validateAddr();
    } else {
      setIsAddressValid(null);
    }
  }, [userWalletAddress, selectedCrypto, validateAddress]);

  const handleNext = async () => {
    if (step === 'form') {
      // Generar dirección de depósito
      const result = await generateDepositAddress(selectedCrypto);
      if (result.success) {
        setStep('address');
      }
    } else if (step === 'address') {
      setStep('confirm');
    }
  };

  const handleConfirmDeposit = async () => {
    if (!userWalletAddress || !amount) return;

    const result = await createDeposit({
      cryptoType: selectedCrypto,
      amount: Number(amount),
      userWalletAddress
    });

    if (result.success) {
      onSuccess?.();
    }
  };

  const getCurrentNetwork = () => networks.find(n => n.type === selectedCrypto);
  const getCurrentRate = () => exchangeRates.find(r => r.currency === selectedCrypto);

  const handleCopyAddress = () => {
    if (depositAddress?.address) {
      navigator.clipboard.writeText(depositAddress.address);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Depósito de Criptomonedas
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

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Indicador de pasos */}
      <div className="flex justify-between mb-6">
        <div className={`flex items-center ${step === 'form' ? 'text-blue-600' : 'text-green-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'form' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
          }`}>
            1
          </div>
          <span className="ml-2 text-sm font-medium">Configurar</span>
        </div>
        <div className={`flex items-center ${
          step === 'address' ? 'text-blue-600' : 
          step === 'confirm' ? 'text-green-600' : 'text-gray-400'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'address' ? 'bg-blue-600 text-white' :
            step === 'confirm' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'
          }`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium">Dirección</span>
        </div>
        <div className={`flex items-center ${step === 'confirm' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'confirm' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
          }`}>
            3
          </div>
          <span className="ml-2 text-sm font-medium">Confirmar</span>
        </div>
      </div>

      {step === 'form' && (
        <div className="space-y-4">
          {/* Selección de criptomoneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Criptomoneda
            </label>
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value as CryptoType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {networks.map((network) => (
                <option key={network.type} value={network.type}>
                  {network.name} ({network.symbol})
                </option>
              ))}
            </select>
            {getCurrentRate() && (
              <p className="text-sm text-gray-500 mt-1">
                Precio actual: ${getCurrentRate()?.usdPrice.toLocaleString()} USD
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
              min={getCurrentNetwork()?.minDeposit}
              max={getCurrentNetwork()?.maxDeposit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Mín: ${getCurrentNetwork()?.minDeposit}`}
            />
            {usdValue > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                ≈ ${usdValue.toFixed(2)} USD
              </p>
            )}
            {getCurrentNetwork() && (
              <p className="text-xs text-gray-400 mt-1">
                Mín: {getCurrentNetwork()?.minDeposit} {selectedCrypto} | 
                Máx: {getCurrentNetwork()?.maxDeposit} {selectedCrypto}
              </p>
            )}
          </div>

          {/* Dirección del usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu dirección de {selectedCrypto}
            </label>
            <input
              type="text"
              value={userWalletAddress}
              onChange={(e) => setUserWalletAddress(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isAddressValid === false ? 'border-red-300 focus:ring-red-500' :
                isAddressValid === true ? 'border-green-300 focus:ring-green-500' :
                'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder={`Dirección de tu wallet ${selectedCrypto}`}
            />
            {isAddressValid === false && (
              <p className="text-sm text-red-600 mt-1">
                Dirección inválida
              </p>
            )}
            {isAddressValid === true && (
              <p className="text-sm text-green-600 mt-1">
                Dirección válida ✓
              </p>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={loading || !amount || !userWalletAddress || isAddressValid !== true}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Generando dirección...' : 'Continuar'}
          </button>
        </div>
      )}

      {step === 'address' && depositAddress && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Envía {amount} {selectedCrypto} a esta dirección:
            </h3>
            
            {/* QR Code */}
            <div className="mb-4 flex justify-center">
              <img
                src={depositAddress.qrCode}
                alt="QR Code"
                className="w-32 h-32 border border-gray-300 rounded"
              />
            </div>

            {/* Dirección */}
            <div className="bg-gray-100 p-3 rounded-md mb-4">
              <p className="text-sm font-mono break-all text-gray-800">
                {depositAddress.address}
              </p>
              <button
                onClick={handleCopyAddress}
                className="mt-2 text-blue-600 text-sm hover:text-blue-700"
              >
                📋 Copiar dirección
              </button>
            </div>

            {/* Información importante */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Importante:</h4>
              <ul className="text-sm text-yellow-700 text-left space-y-1">
                <li>• Envía exactamente {amount} {selectedCrypto}</li>
                <li>• Solo envía {selectedCrypto} a esta dirección</li>
                <li>• Se requieren {getCurrentNetwork()?.confirmationsRequired} confirmaciones</li>
                <li>• El depósito expirará en 30 minutos</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep('form')}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Atrás
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Ya envié
            </button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Confirmar depósito
            </h3>
            
            <div className="bg-gray-50 rounded-md p-4 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Criptomoneda:</span>
                  <span className="font-medium">{selectedCrypto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto:</span>
                  <span className="font-medium">{amount} {selectedCrypto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor USD:</span>
                  <span className="font-medium">${usdValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tu dirección:</span>
                  <span className="font-mono text-xs">{userWalletAddress.slice(0, 10)}...{userWalletAddress.slice(-10)}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              ¿Confirmas que enviaste {amount} {selectedCrypto} desde tu wallet?
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep('address')}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Atrás
            </button>
            <button
              onClick={handleConfirmDeposit}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Confirmando...' : 'Confirmar depósito'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
