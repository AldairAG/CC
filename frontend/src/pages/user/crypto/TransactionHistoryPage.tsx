import { useState, useEffect } from 'react';
import type { CryptoTransaction } from '../../../types/CryptoTypes';

// Mock service - En producción esto vendría del backend
const TransactionService = {
  async getUserTransactions(): Promise<CryptoTransaction[]> {
    // Mock data
    return [
      {
        id: 1,
        userId: 1,
        cryptoType: 'BTC',
        amount: 0.05,
        transactionType: 'DEPOSIT',
        status: 'COMPLETED',
        notes: 'Depósito inicial',
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-15T10:35:00')
      },
      {
        id: 2,
        userId: 1,
        cryptoType: 'ETH',
        amount: 2.5,
        transactionType: 'DEPOSIT',
        status: 'COMPLETED',
        notes: 'Depósito vía wallet externa',
        createdAt: new Date('2024-01-20T14:20:00'),
        updatedAt: new Date('2024-01-20T14:25:00')
      },
      {
        id: 3,
        userId: 1,
        cryptoType: 'BTC',
        amount: 0.02,
        transactionType: 'WITHDRAWAL',
        status: 'PENDING',
        notes: 'Retiro a wallet externa',
        createdAt: new Date('2024-01-25T09:15:00'),
        updatedAt: new Date('2024-01-25T09:15:00')
      },
      {
        id: 4,
        userId: 1,
        cryptoType: 'SOL',
        amount: 100,
        transactionType: 'CONVERSION',
        status: 'COMPLETED',
        notes: 'Conversión de BTC a SOL',
        createdAt: new Date('2024-02-01T16:45:00'),
        updatedAt: new Date('2024-02-01T16:50:00')
      },
      {
        id: 5,
        userId: 1,
        cryptoType: 'ETH',
        amount: 1.0,
        transactionType: 'WITHDRAWAL',
        status: 'FAILED',
        notes: 'Retiro fallido - dirección inválida',
        createdAt: new Date('2024-02-05T11:30:00'),
        updatedAt: new Date('2024-02-05T11:35:00')
      }
    ];
  }
};

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const userTransactions = await TransactionService.getUserTransactions();
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filter.type === 'all' || transaction.transactionType === filter.type;
    const statusMatch = filter.status === 'all' || transaction.status === filter.status;
    const cryptoMatch = filter.crypto === 'all' || transaction.cryptoType === filter.crypto;
    
    return typeMatch && statusMatch && cryptoMatch;
  });

  const getStatusColor = (status: CryptoTransaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'FAILED':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    }
  };

  const getTransactionIcon = (type: CryptoTransaction['transactionType']) => {
    switch (type) {
      case 'DEPOSIT':
        return '↓';
      case 'WITHDRAWAL':
        return '↑';
      case 'CONVERSION':
        return '🔄';
      default:
        return '📄';
    }
  };

  const getTransactionColor = (type: CryptoTransaction['transactionType']) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-green-400';
      case 'WITHDRAWAL':
        return 'text-red-400';
      case 'CONVERSION':
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
      case 'FAILED':
        return 'Fallida';
      default:
        return status;
    }
  };

  const getTransactionLabel = (type: CryptoTransaction['transactionType']) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Depósito';
      case 'WITHDRAWAL':
        return 'Retiro';
      case 'CONVERSION':
        return 'Conversión';
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
              <option value="WITHDRAWAL">Retiros</option>
              <option value="CONVERSION">Conversiones</option>
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
              <option value="COMPLETED">Completadas</option>
              <option value="PENDING">Pendientes</option>
              <option value="FAILED">Fallidas</option>
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

        {loading ? (
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
                      transaction.transactionType === 'DEPOSIT' ? 'bg-green-500/20 border-green-500/30' :
                      transaction.transactionType === 'WITHDRAWAL' ? 'bg-red-500/20 border-red-500/30' :
                      'bg-amber-500/20 border-amber-500/30'
                    }`}>
                      <span className={`text-xl ${getTransactionColor(transaction.transactionType)}`}>
                        {getTransactionIcon(transaction.transactionType)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-white">
                          {getTransactionLabel(transaction.transactionType)}
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
