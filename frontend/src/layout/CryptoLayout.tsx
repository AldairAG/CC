import { Link, Route, Switch, useLocation } from "react-router-dom";
import { USER_ROUTES } from "../constants/ROUTERS";
import CryptoDashboard from "../pages/user/crypto/CryptoDashboard";
import DepositarPage from "../pages/user/crypto/DepoitarPage";
import RetirarPage from "../pages/user/crypto/RetirarPage";
import WalletManagementPage from "../pages/user/crypto/WalletManagementPage";
import TransactionHistoryPage from "../pages/user/crypto/TransactionHistoryPage";
import PortfolioSummary from "../components/crypto/PortfolioSummary";
import ExchangeRates from "../components/crypto/ExchangeRates";

const CryptoLayout = () => {
    const location = useLocation();
    
    const tabs = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            path: USER_ROUTES.CRYPTO_DASHBOARD,
            icon: '📊',
            color: 'gray'
        },
        {
            id: 'depositar',
            label: 'Depositar',
            path: USER_ROUTES.DEPOSITAR,
            icon: '↓',
            color: 'blue'
        },
        {
            id: 'retirar',
            label: 'Retirar',
            path: USER_ROUTES.RETIRAR,
            icon: '↑',
            color: 'red'
        },
        {
            id: 'wallets',
            label: 'Mis Wallets',
            path: USER_ROUTES.WALLET_MANAGEMENT,
            icon: '👛',
            color: 'purple'
        },
        {
            id: 'historial',
            label: 'Historial',
            path: USER_ROUTES.TRANSACTION_HISTORY,
            icon: '📜',
            color: 'gray'
        }
    ];

    const getTabStyles = (tab: typeof tabs[0], isActive: boolean) => {
        const baseStyles = "flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 border-b-2";
        
        if (isActive) {
            switch (tab.color) {
                case 'blue':
                    return `${baseStyles} bg-blue-50 text-blue-700 border-blue-500`;
                case 'red':
                    return `${baseStyles} bg-red-50 text-red-700 border-red-500`;
                case 'purple':
                    return `${baseStyles} bg-purple-50 text-purple-700 border-purple-500`;
                default:
                    return `${baseStyles} bg-gray-50 text-gray-700 border-gray-500`;
            }
        }
        
        return `${baseStyles} text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-transparent hover:border-gray-300`;
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Portfolio Summary and Exchange Rates - Mobile/Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PortfolioSummary />
                <ExchangeRates />
            </div>
            
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Gestión de Criptomonedas</h3>
                <nav className="flex flex-wrap gap-2">
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.path;
                        return (
                            <Link
                                key={tab.id}
                                to={tab.path}
                                className={getTabStyles(tab, isActive)}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            
            {/* Main Content */}
            <main className="bg-white rounded-lg shadow-md p-6 min-h-screen">
                <Switch>
                    <Route path={USER_ROUTES.DEPOSITAR} component={DepositarPage} />
                    <Route path={USER_ROUTES.RETIRAR} component={RetirarPage} />
                    <Route path={USER_ROUTES.WALLET_MANAGEMENT} component={WalletManagementPage} />
                    <Route path={USER_ROUTES.TRANSACTION_HISTORY} component={TransactionHistoryPage} />
                    <Route path={USER_ROUTES.CRYPTO_DASHBOARD} component={CryptoDashboard} />
                </Switch>
            </main>
        </div>
    );
};

export default CryptoLayout;
