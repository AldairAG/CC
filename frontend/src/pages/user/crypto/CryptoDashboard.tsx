import { Link } from 'react-router-dom';
import { useCryptoTransactions } from '../../../hooks/useCryptoTransactions';
import { USER_ROUTES } from '../../../constants/ROUTERS';
import PortfolioSummary from '../../../components/crypto/PortfolioSummary';
import ExchangeRates from '../../../components/crypto/ExchangeRates';
import TransactionStatus from '../../../components/crypto/TransactionStatus';

const CryptoDashboard = () => {
    const { transactions, loading, error } = useCryptoTransactions();

    // Get recent transactions (last 5)
    const recentTransactions = transactions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard de Criptomonedas</h1>
                <p className="text-gray-600">Gestiona tus activos digitales de forma segura y eficiente</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    to={USER_ROUTES.DEPOSITAR}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 transition-colors"
                >
                    <div className="text-center">
                        <div className="text-3xl mb-2">📥</div>
                        <div className="text-lg font-semibold">Depositar</div>
                        <div className="text-sm opacity-90">Agregar fondos a tu wallet</div>
                    </div>
                </Link>
                <Link
                    to={USER_ROUTES.RETIRAR}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-6 transition-colors"
                >
                    <div className="text-center">
                        <div className="text-3xl mb-2">📤</div>
                        <div className="text-lg font-semibold">Retirar</div>
                        <div className="text-sm opacity-90">Convertir crypto a USD</div>
                    </div>
                </Link>
                <Link
                    to={USER_ROUTES.TRANSACTION_HISTORY}
                    className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg p-6 transition-colors"
                >
                    <div className="text-center">
                        <div className="text-3xl mb-2">📊</div>
                        <div className="text-lg font-semibold">Historial</div>
                        <div className="text-sm opacity-90">Ver todas las transacciones</div>
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
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Transacciones Recientes</h2>
                            <Link
                                to={USER_ROUTES.TRANSACTION_HISTORY}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Ver todas
                            </Link>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <div className="text-gray-600">Cargando transacciones...</div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-600">
                                Error al cargar las transacciones
                            </div>
                        ) : recentTransactions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">🚀</div>
                                <div className="text-lg font-medium mb-1">¡Comienza tu viaje crypto!</div>
                                <div className="text-sm mb-4">Aún no tienes transacciones</div>
                                <Link
                                    to={USER_ROUTES.DEPOSITAR}
                                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
