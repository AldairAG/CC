import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { USER_ROUTES } from "../constants/ROUTERS";
import UserProfile from "../pages/user/UserProfile";
import QuinielaList from "../pages/user/QuinielaList";
import Dashboard from "../pages/user/Dashboard";
import { CryptoWalletPage } from "../pages/user/CryptoWalletPage";
import QuinielasPage from "../pages/user/QuinielasPage";
import QuinielaArmar from "../pages/user/QuinielaArmar";
import UserProfileButton from "../components/ui/UserProfileButton";

const UserLayout = () => {
    const navigate = useHistory();
    const location = useLocation();

    const handleNavigate = (ruta: string) => {
        navigate.push(ruta);
    };

    const isActiveRoute = (route: string) => {
        return location.pathname === route;
    };

    return (
        <main className="min-h-screen bg-casino-gradient">
            <header className="w-full flex flex-col bg-dark-900 shadow-lg border-b-2 border-primary-500">
                <div className="h-25 flex px-4 items-center justify-between py-4">
                    <h1 className="text-5xl font-bold text-primary-500 animate-glow">
                        24bet
                    </h1>
                    <div className='flex gap-4 items-center'>
                        <UserProfileButton />
                    </div>
                </div>
                
                <div className="flex bg-dark-800 items-center justify-center border-t border-primary-600/30">
                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.HOME)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 transition-all duration-300 border-primary-500 ${
                            isActiveRoute(USER_ROUTES.HOME) ? 'bg-primary-600/30 border-b-2 text-primary-300' : 'text-gray-300 hover:text-white'
                        }`}
                    >
                        🎰 Casino
                    </span>
                    
                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.QUINIELAS_LIST)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 transition-all duration-300 border-primary-500 ${
                            isActiveRoute(USER_ROUTES.QUINIELAS_LIST) ? 'bg-primary-600/30 border-b-2 text-primary-300' : 'text-gray-300 hover:text-white'
                        }`}
                    >
                        🏆 Quinielas
                    </span>
                    
                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.QUINIELAS_CREADAS)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 transition-all duration-300 flex items-center space-x-1 border-primary-500 ${
                            isActiveRoute(USER_ROUTES.QUINIELAS_CREADAS) ? 'bg-primary-600/30 border-b-2 text-primary-300' : 'text-gray-300 hover:text-white'
                        }`}
                    >
                        <span>🏅</span>
                        <span>Mis Quinielas</span>
                    </span>
                    
                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.ARMAR_QUINIELA)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 transition-all duration-300 flex items-center space-x-1 border-primary-500 ${
                            isActiveRoute(USER_ROUTES.ARMAR_QUINIELA) ? 'bg-primary-600/30 border-b-2 text-primary-300' : 'text-gray-300 hover:text-white'
                        }`}
                    >
                        <span>🛠️</span>
                        <span>Armar Quiniela</span>
                    </span>
                    
                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.CRYPTO_WALLET)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 transition-all duration-300 flex items-center space-x-1 border-primary-500 ${
                            isActiveRoute(USER_ROUTES.CRYPTO_WALLET) ? 'bg-primary-600/30 border-b-2 text-primary-300' : 'text-gray-300 hover:text-white'
                        }`}
                    >
                        <span>₿</span>
                        <span>Crypto</span>
                    </span>
                    
                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.USER_PROFILE)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 transition-all duration-300 flex items-center space-x-1 border-primary-500 ${
                            isActiveRoute(USER_ROUTES.USER_PROFILE) ? 'bg-primary-600/30 border-b-2 text-primary-300' : 'text-gray-300 hover:text-white'
                        }`}
                    >
                        <span>⚙️</span>
                        <span>Perfil</span>
                    </span>
                </div>
            </header>
            
            <div className="flex justify-center min-h-screen bg-casino-gradient">
                <Switch>
                    <Route path={USER_ROUTES.USER_PROFILE} component={UserProfile} />
                    <Route path={USER_ROUTES.HOME} component={Dashboard} /> 
                    <Route path={USER_ROUTES.QUINIELAS_LIST} component={QuinielaList} />
                    <Route path={USER_ROUTES.QUINIELAS_CREADAS} component={QuinielasPage} />
                    <Route path={USER_ROUTES.ARMAR_QUINIELA} component={QuinielaArmar} />
                    <Route path={USER_ROUTES.CRYPTO_WALLET} component={CryptoWalletPage} />
                </Switch>
            </div>
        </main>
    )
}

export default UserLayout;
