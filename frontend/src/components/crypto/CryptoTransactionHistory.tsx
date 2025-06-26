import React, { useState } from 'react';
import { useCryptoTransactions } from '../../hooks/useCryptoTransactions';
import type { CryptoTransaction, CryptoType } from '../../types/CryptoTypes';

interface CryptoTransactionHistoryProps {
  limit?: number;
}

export const CryptoTransactionHistory: React.FC<CryptoTransactionHistoryProps> = ({ limit = 10 }) => {
  const {
    loading,
    error,
    transactions,
    networks,
    getTransactionDetails
  } = useCryptoTransactions();

  const [selectedTransaction, setSelectedTransaction] = useState<CryptoTransaction | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'DEPOSIT' | 'WITHDRAWAL'>('ALL');
  const [filterCrypto, setFilterCrypto] = useState<'ALL' | CryptoType>('ALL');

  const filteredTransactions = transactions
    .filter(tx => filterType === 'ALL' || tx.type === filterType)
    .filter(tx => filterCrypto === 'ALL' || tx.cryptoType === filterCrypto)
    .slice(0, limit);

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'PROCESSING': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    return type === 'DEPOSIT' ? '↓' : '↑';
  };

  const getTypeColor = (type: string) => {
    return type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600';
  };

  const getCryptoIcon = (cryptoType: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      SOL: '◎'
    };
    return icons[cryptoType as keyof typeof icons] || '●';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleViewDetails = async (txId: string) => {
    const result = await getTransactionDetails(txId);
    if (result.success && result.transaction) {
      setSelectedTransaction(result.transaction);
      setShowDetails(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getExplorerUrl = (tx: CryptoTransaction) => {
    const network = networks.find(n => n.type === tx.cryptoType);
    return network ? `${network.explorerUrl}${tx.txHash}` : '#';
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Historial de Transacciones
          </h2>
          <div className="flex space-x-2">
            {/* Filtro por tipo */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'ALL' | 'DEPOSIT' | 'WITHDRAWAL')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="ALL">Todos</option>
              <option value="DEPOSIT">Depósitos</option>
              <option value="WITHDRAWAL">Retiros</option>
            </select>
            
            {/* Filtro por criptomoneda */}
            <select
              value={filterCrypto}
              onChange={(e) => setFilterCrypto(e.target.value as 'ALL' | CryptoType)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="ALL">Todas</option>
              {networks.map(network => (
                <option key={network.type} value={network.type}>
                  {network.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium mb-2">No hay transacciones</h3>
            <p className="text-sm">
              {filterType !== 'ALL' || filterCrypto !== 'ALL' 
                ? 'No hay transacciones que coincidan con los filtros seleccionados'
                : 'Aún no has realizado ninguna transacción'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(transaction.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Icono y tipo */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gray-100`}>
                      <span className={`text-xl ${getTypeColor(transaction.type)}`}>
                        {getTypeIcon(transaction.type)}
                      </span>
                    </div>
                    
                    {/* Información principal */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800">
                          {transaction.type === 'DEPOSIT' ? 'Depósito' : 'Retiro'}
                        </span>
                        <span className="text-lg">
                          {getCryptoIcon(transaction.cryptoType)}
                        </span>
                        <span className="font-medium text-gray-600">
                          {transaction.cryptoType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Monto y estado */}
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className={`font-bold ${getTypeColor(transaction.type)}`}>
                          {transaction.type === 'DEPOSIT' ? '+' : '-'}
                          {transaction.amount} {transaction.cryptoType}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${transaction.usdAmount.toFixed(2)} USD
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barra de progreso para confirmaciones */}
                {transaction.status === 'PENDING' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Confirmaciones</span>
                      <span>{transaction.confirmations}/{transaction.requiredConfirmations}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(transaction.confirmations / transaction.requiredConfirmations) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {limit < transactions.length && (
          <div className="text-center mt-6">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver más transacciones
            </button>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {showDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Detalles de la Transacción
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">ID de Transacción</p>
                  <p className="font-mono text-xs break-all">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estado</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Tipo</p>
                  <p className="font-medium">
                    {selectedTransaction.type === 'DEPOSIT' ? 'Depósito' : 'Retiro'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Criptomoneda</p>
                  <p className="font-medium">{selectedTransaction.cryptoType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Monto</p>
                  <p className="font-medium">{selectedTransaction.amount} {selectedTransaction.cryptoType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Valor USD</p>
                  <p className="font-medium">${selectedTransaction.usdAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Comisión</p>
                  <p className="font-medium">{selectedTransaction.fee} {selectedTransaction.cryptoType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Confirmaciones</p>
                  <p className="font-medium">{selectedTransaction.confirmations}/{selectedTransaction.requiredConfirmations}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Dirección de origen</p>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded flex-1">
                    {selectedTransaction.fromAddress}
                  </p>
                  <button
                    onClick={() => copyToClipboard(selectedTransaction.fromAddress)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Dirección de destino</p>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded flex-1">
                    {selectedTransaction.toAddress}
                  </p>
                  <button
                    onClick={() => copyToClipboard(selectedTransaction.toAddress)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Hash de transacción</p>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded flex-1">
                    {selectedTransaction.txHash}
                  </p>
                  <button
                    onClick={() => copyToClipboard(selectedTransaction.txHash)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Creado:</span>
                <span>{formatDate(selectedTransaction.createdAt)}</span>
              </div>
              
              {selectedTransaction.completedAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Completado:</span>
                  <span>{formatDate(selectedTransaction.completedAt)}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cerrar
              </button>
              <a
                href={getExplorerUrl(selectedTransaction)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center"
              >
                Ver en Explorer
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
