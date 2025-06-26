import React, { useState } from 'react';
import { CryptoBalanceCard } from '../../components/crypto/CryptoBalanceCard';
import { CryptoDepositForm } from '../../components/crypto/CryptoDepositForm';
import { CryptoTransactionHistory } from '../../components/crypto/CryptoTransactionHistory';

export const CryptoWalletPage: React.FC = () => {
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [selectedCryptoForWithdraw, setSelectedCryptoForWithdraw] = useState<string>('');

  const handleOpenDeposit = () => {
    setShowDepositForm(true);
  };

  const handleCloseDeposit = () => {
    setShowDepositForm(false);
  };

  const handleDepositSuccess = () => {
    setShowDepositForm(false);
    // Aquí podrías mostrar una notificación de éxito
  };

  const handleOpenWithdraw = (cryptoType: string) => {
    setSelectedCryptoForWithdraw(cryptoType);
    setShowWithdrawForm(true);
  };

  const handleCloseWithdraw = () => {
    setShowWithdrawForm(false);
    setSelectedCryptoForWithdraw('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wallet de Criptomonedas
          </h1>
          <p className="text-gray-600">
            Gestiona tus depósitos y retiros de Bitcoin, Ethereum y Solana
          </p>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel izquierdo - Balances */}
          <div className="lg:col-span-1">
            <CryptoBalanceCard
              onDeposit={handleOpenDeposit}
              onWithdraw={handleOpenWithdraw}
            />
          </div>

          {/* Panel derecho - Historial */}
          <div className="lg:col-span-2">
            <CryptoTransactionHistory limit={10} />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                🔒
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">
                Seguridad
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Todas las transacciones están protegidas con encriptación de grado militar 
              y autenticación de dos factores opcional.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                ⚡
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">
                Procesamiento Rápido
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Los depósitos se procesan automáticamente una vez confirmados en la red. 
              Los retiros se procesan en menos de 30 minutos.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                💎
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">
                Bajas Comisiones
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Comisiones competitivas en todas las redes. Solo pagas la comisión 
              de red necesaria para procesar tu transacción.
            </p>
          </div>
        </div>

        {/* Redes soportadas */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Redes Soportadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl">₿</div>
              <div>
                <h4 className="font-medium text-gray-800">Bitcoin</h4>
                <p className="text-sm text-gray-500">BTC • 3 confirmaciones</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl">Ξ</div>
              <div>
                <h4 className="font-medium text-gray-800">Ethereum</h4>
                <p className="text-sm text-gray-500">ETH • 12 confirmaciones</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl">◎</div>
              <div>
                <h4 className="font-medium text-gray-800">Solana</h4>
                <p className="text-sm text-gray-500">SOL • 1 confirmación</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de depósito */}
      {showDepositForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <CryptoDepositForm
              onSuccess={handleDepositSuccess}
              onClose={handleCloseDeposit}
            />
          </div>
        </div>
      )}

      {/* Modal de retiro */}
      {showWithdrawForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Retirar {selectedCryptoForWithdraw}
              </h2>
              <button
                onClick={handleCloseWithdraw}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Funcionalidad en desarrollo
              </h3>
              <p className="text-gray-600 text-sm">
                El formulario de retiros estará disponible próximamente.
              </p>
            </div>
            <button
              onClick={handleCloseWithdraw}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
