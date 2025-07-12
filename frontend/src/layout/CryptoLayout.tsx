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
        const baseStyles = "flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm";
        
        if (isActive) {
            switch (tab.color) {
                case 'blue':
                    return `${baseStyles} bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40 shadow-lg`;
                case 'red':
                    return `${baseStyles} bg-gradient-to-r from-amber-500/20 to-red-500/20 text-amber-300 border-amber-500/40 shadow-lg`;
                case 'purple':
                    return `${baseStyles} bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40 shadow-lg`;
                default:
                    return `${baseStyles} bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40 shadow-lg`;
            }
        }
        
        return `${baseStyles} text-gray-400 hover:text-white hover:bg-amber-500/10 border-slate-600/20 hover:border-amber-500/30 hover:scale-105 active:scale-95`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="flex flex-col gap-6 p-4">
                {/* Portfolio Summary and Exchange Rates - Mobile/Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PortfolioSummary />
                    <ExchangeRates />
                </div>
                
                {/* Navigation Tabs */}
                <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50">
                    <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6 flex items-center gap-3">
                        💰 <span>Gestión de Criptomonedas</span>
                    </h3>
                    <nav className="flex flex-wrap gap-3">
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
                <main className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 min-h-screen border border-slate-700/50">
                    <Switch>
                        <Route path={USER_ROUTES.DEPOSITAR} component={DepositarPage} />
                        <Route path={USER_ROUTES.RETIRAR} component={RetirarPage} />
                        <Route path={USER_ROUTES.WALLET_MANAGEMENT} component={WalletManagementPage} />
                        <Route path={USER_ROUTES.TRANSACTION_HISTORY} component={TransactionHistoryPage} />
                        <Route path={USER_ROUTES.CRYPTO_DASHBOARD} component={CryptoDashboard} />
                    </Switch>
                </main>
            </div>
        </div>
    );
};

export default CryptoLayout;
