import { useState } from 'react';
import {
    BanknotesIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    FunnelIcon
} from "@heroicons/react/24/outline";

interface CryptoTransaction {
    id: number;
    usuario: string;
    tipo: 'DEPOSIT' | 'WITHDRAWAL' | 'CONVERSION';
    cryptoType: 'BTC' | 'ETH' | 'SOL';
    amount: number;
    usdValue: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    fecha: string;
    txHash?: string;
    address?: string;
}

interface CryptoBalance {
    tipo: string;
    symbol: string;
    totalBalance: number;
    usdValue: number;
    price: number;
    change24h: number;
}

const AdminCrypto = () => {
    const [filterType, setFilterType] = useState('TODOS');
    const [filterStatus, setFilterStatus] = useState('TODOS');
    
    const [cryptoBalances] = useState<CryptoBalance[]>([
        {
            tipo: 'Bitcoin',
            symbol: 'BTC',
            totalBalance: 2.45678,
            usdValue: 110550.00,
            price: 45000.00,
            change24h: 2.4
        },
        {
            tipo: 'Ethereum',
            symbol: 'ETH',
            totalBalance: 15.8934,
            usdValue: 47680.20,
            price: 3000.00,
            change24h: -1.2
        },
        {
            tipo: 'Solana',
            symbol: 'SOL',
            totalBalance: 150.25,
            usdValue: 15025.00,
            price: 100.00,
            change24h: 5.8
        }
    ]);

    const [transactions] = useState<CryptoTransaction[]>([
        {
            id: 1,
            usuario: 'carlos_garcia',
            tipo: 'DEPOSIT',
            cryptoType: 'BTC',
            amount: 0.05,
            usdValue: 2250.00,
            status: 'COMPLETED',
            fecha: '2024-07-02 10:30',
            txHash: '1a2b3c4d5e6f...',
            address: '1BvBMSE...xyz'
        },
        {
            id: 2,
            usuario: 'maria_lopez',
            tipo: 'CONVERSION',
            cryptoType: 'ETH',
            amount: 0.5,
            usdValue: 1500.00,
            status: 'COMPLETED',
            fecha: '2024-07-02 09:15'
        },
        {
            id: 3,
            usuario: 'juan_perez',
            tipo: 'WITHDRAWAL',
            cryptoType: 'SOL',
            amount: 50.0,
            usdValue: 5000.00,
            status: 'PENDING',
            fecha: '2024-07-02 08:45',
            address: 'SoL123...abc'
        }
    ]);

    const filteredTransactions = transactions.filter(tx => {
        const matchesType = filterType === 'TODOS' || tx.tipo === filterType;
        const matchesStatus = filterStatus === 'TODOS' || tx.status === filterStatus;
        return matchesType && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const styles = {
            'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
            'FAILED': 'bg-red-100 text-red-800 border-red-200'
        };
        return styles[status as keyof typeof styles] || styles.PENDING;
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'PENDING': return <ClockIcon className="h-4 w-4" />;
            case 'COMPLETED': return <CheckCircleIcon className="h-4 w-4" />;
            case 'FAILED': return <XCircleIcon className="h-4 w-4" />;
            default: return <ClockIcon className="h-4 w-4" />;
        }
    };

    const getTypeIcon = (tipo: string) => {
        switch(tipo) {
            case 'DEPOSIT': return <ArrowDownIcon className="h-4 w-4 text-green-600" />;
            case 'WITHDRAWAL': return <ArrowUpIcon className="h-4 w-4 text-red-600" />;
            case 'CONVERSION': return <BanknotesIcon className="h-4 w-4 text-blue-600" />;
            default: return <BanknotesIcon className="h-4 w-4" />;
        }
    };

    const getCryptoIcon = (crypto: string) => {
        const icons = {
            BTC: '₿',
            ETH: 'Ξ',
            SOL: '◎'
        };
        return icons[crypto as keyof typeof icons] || '●';
    };

    const totalUsdValue = cryptoBalances.reduce((sum, balance) => sum + balance.usdValue, 0);
    const pendingTransactions = transactions.filter(tx => tx.status === 'PENDING').length;
    const completedToday = transactions.filter(tx => tx.status === 'COMPLETED' && tx.fecha.includes('2024-07-02')).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Criptomonedas</h1>
                    <p className="text-gray-600 mt-2">Administra depósitos, retiros y conversiones crypto</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Procesar Retiros
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Actualizar Precios
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <BanknotesIcon className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Valor Total USD</h3>
                            <p className="text-2xl font-bold text-gray-900">${totalUsdValue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <ClockIcon className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Transacciones Pendientes</h3>
                            <p className="text-2xl font-bold text-yellow-600">{pendingTransactions}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <CheckCircleIcon className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Completadas Hoy</h3>
                            <p className="text-2xl font-bold text-blue-600">{completedToday}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <ArrowUpIcon className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Transacciones</h3>
                            <p className="text-2xl font-bold text-purple-600">{transactions.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Crypto Balances */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Balances de Criptomonedas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cryptoBalances.map((balance, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">{getCryptoIcon(balance.symbol)}</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{balance.tipo}</h4>
                                        <p className="text-sm text-gray-500">{balance.symbol}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center text-sm ${balance.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {balance.change24h >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                                    {Math.abs(balance.change24h)}%
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Balance:</span>
                                    <span className="text-sm font-medium">{balance.totalBalance.toFixed(8)} {balance.symbol}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Precio:</span>
                                    <span className="text-sm font-medium">${balance.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Valor USD:</span>
                                    <span className="text-sm font-bold text-green-600">${balance.usdValue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700 mr-2">Tipo:</span>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="TODOS">Todos los tipos</option>
                                <option value="DEPOSIT">Depósitos</option>
                                <option value="WITHDRAWAL">Retiros</option>
                                <option value="CONVERSION">Conversiones</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2">Estado:</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="TODOS">Todos los estados</option>
                                <option value="PENDING">Pendientes</option>
                                <option value="COMPLETED">Completadas</option>
                                <option value="FAILED">Fallidas</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Transacciones Crypto ({filteredTransactions.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID / Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Crypto
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
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                #{tx.id}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {tx.usuario}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getTypeIcon(tx.tipo)}
                                            <span className="ml-2 text-sm font-medium text-gray-900">
                                                {tx.tipo}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-lg mr-2">{getCryptoIcon(tx.cryptoType)}</span>
                                            <span className="text-sm font-medium text-gray-900">{tx.cryptoType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {tx.amount} {tx.cryptoType}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                        ${tx.usdValue.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(tx.status)}`}>
                                            {getStatusIcon(tx.status)}
                                            <span className="ml-1">{tx.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {tx.fecha}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900">
                                            <EyeIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCrypto;
