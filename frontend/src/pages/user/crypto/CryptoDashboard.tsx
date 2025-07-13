import { Link } from 'react-router-dom';
import { useCrypto } from '../../../hooks/useCrypto';
import { USER_ROUTES } from '../../../constants/ROUTERS';
import PortfolioSummary from '../../../components/crypto/PortfolioSummary';
import ExchangeRates from '../../../components/crypto/ExchangeRates';
import TransactionStatus from '../../../components/crypto/TransactionStatus';

const CryptoDashboard = () => {
    const { transactions, loading, error } = useCrypto();

    // Get recent transactions (last 5)
    const recentTransactions = transactions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2">Dashboard de Criptomonedas</h1>
                <p className="text-gray-300">Gestiona tus activos digitales de forma segura y eficiente</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    to={USER_ROUTES.DEPOSITAR}
                    className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl hover:from-amber-500/20 hover:via-orange-500/20 hover:to-amber-600/20 text-white rounded-2xl p-6 transition-all duration-300 border border-slate-700/50 hover:border-amber-500/40 hover:scale-105 shadow-2xl"
                >
                    <div className="text-center">
                        <div className="text-3xl mb-2">📥</div>
                        <div className="text-lg font-semibold text-amber-300">Depositar</div>
                        <div className="text-sm text-gray-400">Agregar fondos a tu wallet</div>
                    </div>
                </Link>
                <Link
                    to={USER_ROUTES.RETIRAR}
                    className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl hover:from-red-500/20 hover:via-red-500/20 hover:to-red-600/20 text-white rounded-2xl p-6 transition-all duration-300 border border-slate-700/50 hover:border-red-500/40 hover:scale-105 shadow-2xl"
                >
                    <div className="text-center">
                        <div className="text-3xl mb-2">📤</div>
                        <div className="text-lg font-semibold text-red-300">Retirar</div>
                        <div className="text-sm text-gray-400">Convertir crypto a USD</div>
                    </div>
                </Link>
                <Link
                    to={USER_ROUTES.TRANSACTION_HISTORY}
                    className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl hover:from-purple-500/20 hover:via-purple-500/20 hover:to-purple-600/20 text-white rounded-2xl p-6 transition-all duration-300 border border-slate-700/50 hover:border-purple-500/40 hover:scale-105 shadow-2xl"
                >
                    <div className="text-center">
                        <div className="text-3xl mb-2">📊</div>
                        <div className="text-lg font-semibold text-purple-300">Historial</div>
                        <div className="text-sm text-gray-400">Ver todas las transacciones</div>
                    </div>
                </Link>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Portfolio and Exchange Rates */}
                <div className="lg:col-span-1 space-y-6">
                    <PortfolioSummary />
                    <ExchangeRates />
                </div>

                {/* Recent Transactions */}
                <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Transacciones Recientes</h2>
                            <Link
                                to={USER_ROUTES.TRANSACTION_HISTORY}
                                className="text-amber-400 hover:text-orange-400 text-sm font-medium transition-colors duration-200"
                            >
                                Ver todas
                            </Link>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
                                <div className="text-gray-400">Cargando transacciones...</div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-400">
                                Error al cargar las transacciones
                            </div>
                        ) : recentTransactions.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <div className="text-4xl mb-2">🚀</div>
                                <div className="text-lg font-medium mb-1 text-amber-300">¡Comienza tu viaje crypto!</div>
                                <div className="text-sm mb-4">Aún no tienes transacciones</div>
                                <Link
                                    to={USER_ROUTES.DEPOSITAR}
                                    className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium"
                                >
                                    Hacer mi primer depósito
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentTransactions.map((transaction) => (
                                    <TransactionStatus key={transaction.id} transaction={transaction} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CryptoDashboard;
