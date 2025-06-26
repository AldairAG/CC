import { useState, useEffect } from 'react';
import {
    BanknotesIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useCrypto } from '../../hooks/useCrypto';
import { useCryptoTransactions } from '../../hooks/useCryptoTransactions';

interface CryptoTransaction {
    id: number;
    usuario: string;
    tipo: 'DEPOSITO' | 'RETIRO' | 'INTERCAMBIO';
    criptomoneda: string;
    cantidad: number;
    valorUSD: number;
    estado: 'PENDIENTE' | 'COMPLETADA' | 'FALLIDA' | 'CANCELADA';
    fechaCreacion: string;
    fechaProcesamiento?: string;
    hashTransaccion?: string;
    direccionWallet: string;
}

interface CryptoBalance {
    criptomoneda: string;
    simbolo: string;
    balance: number;
    valorUSD: number;
    cambio24h: number;
}

const AdminCrypto = () => {
    const { 
        loading: cryptoLoading 
    } = useCrypto();
    
    const { 
        loading: transactionsLoading 
    } = useCryptoTransactions();

    const [transactionsList, setTransactionsList] = useState<CryptoTransaction[]>([]);
    const [balancesList, setBalancesList] = useState<CryptoBalance[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<CryptoTransaction[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterCrypto, setFilterCrypto] = useState<string>('all');
    const [selectedTransaction, setSelectedTransaction] = useState<CryptoTransaction | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Datos de ejemplo
    useEffect(() => {
        const mockTransactions: CryptoTransaction[] = [
            {
                id: 1,
                usuario: 'carlos_crypto',
                tipo: 'DEPOSITO',
                criptomoneda: 'Bitcoin',
                cantidad: 0.5,
                valorUSD: 25000,
                estado: 'COMPLETADA',
                fechaCreacion: '2024-01-20T10:00:00Z',
                fechaProcesamiento: '2024-01-20T10:15:00Z',
                hashTransaccion: '0xabc123...',
                direccionWallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
            },
            {
                id: 2,
                usuario: 'maria_eth',
                tipo: 'RETIRO',
                criptomoneda: 'Ethereum',
                cantidad: 2.5,
                valorUSD: 6250,
                estado: 'PENDIENTE',
                fechaCreacion: '2024-01-21T15:30:00Z',
                direccionWallet: '0x742d35Cc6634C0532925a3b8D'
            },
            {
                id: 3,
                usuario: 'jose_trader',
                tipo: 'INTERCAMBIO',
                criptomoneda: 'Litecoin',
                cantidad: 10,
                valorUSD: 800,
                estado: 'COMPLETADA',
                fechaCreacion: '2024-01-19T16:45:00Z',
                fechaProcesamiento: '2024-01-19T16:50:00Z',
                hashTransaccion: '0xdef456...',
                direccionWallet: 'LTC1qw508d6qejxtdg4y5r3zarvary0c5xw7k'
            },
            {
                id: 4,
                usuario: 'ana_hodler',
                tipo: 'DEPOSITO',
                criptomoneda: 'Cardano',
                cantidad: 1000,
                valorUSD: 500,
                estado: 'FALLIDA',
                fechaCreacion: '2024-01-21T09:15:00Z',
                direccionWallet: 'addr1q9yx23ug4jz6m2y5l3nv'
            }
        ];

        const mockBalances: CryptoBalance[] = [
            {
                criptomoneda: 'Bitcoin',
                simbolo: 'BTC',
                balance: 12.5,
                valorUSD: 625000,
                cambio24h: 2.3
            },
            {
                criptomoneda: 'Ethereum',
                simbolo: 'ETH',
                balance: 45.2,
                valorUSD: 113000,
                cambio24h: -1.5
            },
            {
                criptomoneda: 'Litecoin',
                simbolo: 'LTC',
                balance: 234.8,
                valorUSD: 18784,
                cambio24h: 4.2
            },
            {
                criptomoneda: 'Cardano',
                simbolo: 'ADA',
                balance: 15000,
                valorUSD: 7500,
                cambio24h: -0.8
            }
        ];

        setTransactionsList(mockTransactions);
        setFilteredTransactions(mockTransactions);
        setBalancesList(mockBalances);
    }, []);

    // Cargar datos reales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Los hooks ya cargan los datos automáticamente
                console.log('Datos crypto cargados');
            } catch (error) {
                console.error('Error cargando datos crypto:', error);
            }
        };
        cargarDatos();
    }, []);

    // Filtrar transacciones
    useEffect(() => {
        let filtered = transactionsList;

        if (searchTerm) {
            filtered = filtered.filter(transaction =>
                transaction.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.criptomoneda.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.hashTransaccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.direccionWallet.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(transaction => transaction.estado === filterStatus);
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(transaction => transaction.tipo === filterType);
        }

        if (filterCrypto !== 'all') {
            filtered = filtered.filter(transaction => transaction.criptomoneda === filterCrypto);
        }

        setFilteredTransactions(filtered);
    }, [transactionsList, searchTerm, filterStatus, filterType, filterCrypto]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETADA': return 'bg-green-100 text-green-800';
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
            case 'FALLIDA': return 'bg-red-100 text-red-800';
            case 'CANCELADA': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETADA': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'PENDIENTE': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'FALLIDA': return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case 'CANCELADA': return <XCircleIcon className="h-5 w-5 text-gray-500" />;
            default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'DEPOSITO': return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
            case 'RETIRO': return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
            case 'INTERCAMBIO': return <BanknotesIcon className="h-4 w-4 text-blue-500" />;
            default: return <BanknotesIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    const handleViewTransaction = (transaction: CryptoTransaction) => {
        setSelectedTransaction(transaction);
        setShowModal(true);
    };

    // Calcular estadísticas
    const totalTransacciones = filteredTransactions.length;
    const transaccionesCompletadas = filteredTransactions.filter(t => t.estado === 'COMPLETADA').length;
    const transaccionesPendientes = filteredTransactions.filter(t => t.estado === 'PENDIENTE').length;
    const volumenTotal = filteredTransactions
        .filter(t => t.estado === 'COMPLETADA')
        .reduce((sum, t) => sum + t.valorUSD, 0);

    const totalBalanceUSD = balancesList.reduce((sum, b) => sum + b.valorUSD, 0);
    const criptomonedas = [...new Set(transactionsList.map(t => t.criptomoneda))];

    if (cryptoLoading || transactionsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            <BanknotesIcon className="inline h-8 w-8 mr-2" />
                            Gestión de Criptomonedas
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Administra transacciones y balances de criptomonedas
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BanknotesIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Transacciones
                                    </dt>
                                    <dd className="text-2xl font-semibold text-gray-900">
                                        {totalTransacciones}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Completadas
                                    </dt>
                                    <dd className="text-2xl font-semibold text-green-600">
                                        {transaccionesCompletadas}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ClockIcon className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Pendientes
                                    </dt>
                                    <dd className="text-2xl font-semibold text-yellow-600">
                                        {transaccionesPendientes}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BanknotesIcon className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Volumen Total
                                    </dt>
                                    <dd className="text-2xl font-semibold text-gray-900">
                                        ${volumenTotal.toLocaleString()}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Crypto Balances */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Balances de Criptomonedas (${totalBalanceUSD.toLocaleString()})
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {balancesList.map((balance, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{balance.simbolo}</h4>
                                        <p className="text-sm text-gray-500">{balance.criptomoneda}</p>
                                    </div>
                                    <div className={`flex items-center text-sm ${
                                        balance.cambio24h >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {balance.cambio24h >= 0 ? (
                                            <ArrowUpIcon className="h-4 w-4 mr-1" />
                                        ) : (
                                            <ArrowDownIcon className="h-4 w-4 mr-1" />
                                        )}
                                        {Math.abs(balance.cambio24h)}%
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-lg font-semibold text-gray-900">
                                        {balance.balance.toFixed(8)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        ${balance.valorUSD.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="col-span-2">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar transacciones..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="COMPLETADA">Completadas</option>
                            <option value="PENDIENTE">Pendientes</option>
                            <option value="FALLIDA">Fallidas</option>
                            <option value="CANCELADA">Canceladas</option>
                        </select>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="DEPOSITO">Depósitos</option>
                            <option value="RETIRO">Retiros</option>
                            <option value="INTERCAMBIO">Intercambios</option>
                        </select>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterCrypto}
                            onChange={(e) => setFilterCrypto(e.target.value)}
                        >
                            <option value="all">Todas las cryptos</option>
                            {criptomonedas.map(crypto => (
                                <option key={crypto} value={crypto}>{crypto}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Transacciones ({filteredTransactions.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Criptomoneda
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor USD
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {transaction.usuario}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getTypeIcon(transaction.tipo)}
                                            <span className="ml-2 text-sm text-gray-900">
                                                {transaction.tipo}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {transaction.criptomoneda}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {transaction.cantidad}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${transaction.valorUSD.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(transaction.estado)}
                                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.estado)}`}>
                                                {transaction.estado}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(transaction.fechaCreacion).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewTransaction(transaction)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="Ver detalles"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Details Modal */}
            {showModal && selectedTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Detalles de la Transacción
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">ID</label>
                                    <p className="text-sm text-gray-900">#{selectedTransaction.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Usuario</label>
                                    <p className="text-sm text-gray-900">{selectedTransaction.usuario}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tipo</label>
                                    <div className="flex items-center mt-1">
                                        {getTypeIcon(selectedTransaction.tipo)}
                                        <span className="ml-2 text-sm text-gray-900">
                                            {selectedTransaction.tipo}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Criptomoneda</label>
                                    <p className="text-sm text-gray-900">{selectedTransaction.criptomoneda}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Cantidad</label>
                                    <p className="text-sm text-gray-900">{selectedTransaction.cantidad}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Valor USD</label>
                                    <p className="text-sm text-gray-900">${selectedTransaction.valorUSD.toLocaleString()}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Dirección Wallet</label>
                                <p className="text-sm text-gray-900 break-all">{selectedTransaction.direccionWallet}</p>
                            </div>
                            {selectedTransaction.hashTransaccion && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Hash de Transacción</label>
                                    <p className="text-sm text-gray-900 break-all">{selectedTransaction.hashTransaccion}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-gray-500">Estado</label>
                                <div className="flex items-center mt-1">
                                    {getStatusIcon(selectedTransaction.estado)}
                                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTransaction.estado)}`}>
                                        {selectedTransaction.estado}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(selectedTransaction.fechaCreacion).toLocaleString()}
                                    </p>
                                </div>
                                {selectedTransaction.fechaProcesamiento && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Fecha de Procesamiento</label>
                                        <p className="text-sm text-gray-900">
                                            {new Date(selectedTransaction.fechaProcesamiento).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Cerrar
                            </button>
                            {selectedTransaction.estado === 'PENDIENTE' && (
                                <>
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">
                                        Aprobar
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">
                                        Rechazar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCrypto;
