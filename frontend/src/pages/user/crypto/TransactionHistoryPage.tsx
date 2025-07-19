import { useState, useEffect } from 'react';
import { useCrypto } from '../../../hooks/useCrypto';
import type { CryptoTransaction } from '../../../types/CryptoTypes';

const TransactionHistoryPage = () => {
  const {
    transactions,
    getCryptoTransactions,
    isFetchingTransactions
  } = useCrypto();
  
  const [filter, setFilter] = useState<{
    type: string;
    status: string;
    crypto: string;
  }>({
    type: 'all',
    status: 'all',
    crypto: 'all'
  });

  // Load transactions
  const loadTransactions = async () => {
    try {
      await getCryptoTransactions();
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filter.type === 'all' || transaction.type === filter.type;
    const statusMatch = filter.status === 'all' || transaction.status === filter.status;
    const cryptoMatch = filter.crypto === 'all' || transaction.cryptoType === filter.crypto;
    
    return typeMatch && statusMatch && cryptoMatch;
  });

  const getStatusColor = (status: CryptoTransaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'PENDING':
      case 'PENDING_ADMIN_APPROVAL':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'CONFIRMED':
      case 'APPROVED':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'FAILED':
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    }
  };

  const getTransactionIcon = (type: CryptoTransaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
      case 'MANUAL_DEPOSIT_REQUEST':
        return '↓';
      case 'WITHDRAWAL':
      case 'MANUAL_WITHDRAWAL_REQUEST':
        return '↑';
      case 'CONVERSION_TO_FIAT':
      case 'CONVERSION_FROM_FIAT':
        return '🔄';
      default:
        return '📄';
    }
  };

  const getTransactionColor = (type: CryptoTransaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
      case 'MANUAL_DEPOSIT_REQUEST':
        return 'text-green-400';
      case 'WITHDRAWAL':
      case 'MANUAL_WITHDRAWAL_REQUEST':
        return 'text-red-400';
      case 'CONVERSION_TO_FIAT':
      case 'CONVERSION_FROM_FIAT':
        return 'text-amber-400';
      default:
        return 'text-gray-400';
    }
  };

  const getCryptoIcon = (cryptoType: string) => {
    switch (cryptoType) {
      case 'BTC': return '₿';
      case 'ETH': return 'Ξ';
      case 'SOL': return '◎';
      default: return '🪙';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: CryptoTransaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completada';
      case 'PENDING':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'FAILED':
        return 'Fallida';
      case 'CANCELLED':
        return 'Cancelada';
      case 'PENDING_ADMIN_APPROVAL':
        return 'Pendiente Aprobación';
      case 'APPROVED':
        return 'Aprobada';
      case 'REJECTED':
        return 'Rechazada';
      default:
        return status;
    }
  };

  const getTransactionLabel = (type: CryptoTransaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Depósito';
      case 'MANUAL_DEPOSIT_REQUEST':
        return 'Solicitud de Depósito';
      case 'WITHDRAWAL':
        return 'Retiro';
      case 'MANUAL_WITHDRAWAL_REQUEST':
        return 'Solicitud de Retiro';
      case 'CONVERSION_TO_FIAT':
        return 'Conversión a USD';
      case 'CONVERSION_FROM_FIAT':
        return 'Conversión desde USD';
      default:
        return type;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Historial de Transacciones</h1>
          <p className="text-gray-300 mt-1">Revisa todas tus transacciones de criptomonedas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700/50">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Transacción
            </label>
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 backdrop-blur-sm"
            >
              <option value="all">Todas</option>
              <option value="DEPOSIT">Depósitos</option>
              <option value="MANUAL_DEPOSIT_REQUEST">Solicitudes de Depósito</option>
              <option value="WITHDRAWAL">Retiros</option>
              <option value="MANUAL_WITHDRAWAL_REQUEST">Solicitudes de Retiro</option>
              <option value="CONVERSION_TO_FIAT">Conversiones a USD</option>
              <option value="CONVERSION_FROM_FIAT">Conversiones desde USD</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 backdrop-blur-sm"
            >
              <option value="all">Todos</option>
              <option value="PENDING">Pendientes</option>
              <option value="CONFIRMED">Confirmadas</option>
              <option value="COMPLETED">Completadas</option>
              <option value="FAILED">Fallidas</option>
              <option value="CANCELLED">Canceladas</option>
              <option value="PENDING_ADMIN_APPROVAL">Pendiente Aprobación</option>
              <option value="APPROVED">Aprobadas</option>
              <option value="REJECTED">Rechazadas</option>
            </select>
          </div>

          {/* Crypto Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Criptomoneda
            </label>
            <select
              value={filter.crypto}
              onChange={(e) => setFilter(prev => ({ ...prev, crypto: e.target.value }))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 backdrop-blur-sm"
            >
              <option value="all">Todas</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="SOL">Solana (SOL)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/40 to-slate-700/40">
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            Transacciones ({filteredTransactions.length})
          </h2>
        </div>

        {isFetchingTransactions ? (
          <div className="p-8 text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
            Cargando transacciones...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <div className="text-4xl mb-2">📄</div>
            <div className="text-lg font-medium mb-1 text-amber-300">No hay transacciones</div>
            <div className="text-sm">No se encontraron transacciones con los filtros seleccionados</div>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-slate-700/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border ${
                      transaction.type === 'DEPOSIT' || transaction.type === 'MANUAL_DEPOSIT_REQUEST' ? 'bg-green-500/20 border-green-500/30' :
                      transaction.type === 'WITHDRAWAL' || transaction.type === 'MANUAL_WITHDRAWAL_REQUEST' ? 'bg-red-500/20 border-red-500/30' :
                      'bg-amber-500/20 border-amber-500/30'
                    }`}>
                      <span className={`text-xl ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-white">
                          {getTransactionLabel(transaction.type)}
                        </h3>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-amber-300">
                            {transaction.amount} {transaction.cryptoType}
                          </span>
                          <span className="text-lg">{getCryptoIcon(transaction.cryptoType)}</span>
                        </div>
                        {transaction.notes && (
                          <div className="text-gray-400 text-xs mt-1">{transaction.notes}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-300 font-medium">
                      {formatDate(transaction.createdAt)}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {transaction.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
