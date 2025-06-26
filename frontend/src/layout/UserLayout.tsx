import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { USER_ROUTES } from "../constants/ROUTERS";
import UserProfile from "../pages/user/UserProfile";
import QuinielaList from "../pages/user/QuinielaList";
import QuinielaArmar from "../pages/user/QuinielaArmar";
import Dashboard from "../pages/user/Dashboard";
import { CryptoWalletPage } from "../pages/user/CryptoWalletPage";
import { QuinielasPage } from "../pages/user/QuinielasPageNew";
import { CrearQuinielaPage } from "../pages/user/CrearQuinielaPage";
import UserProfileButton from "../components/ui/UserProfileButton";
import ThemeToggleButton from "../components/ui/ThemeToggleButton";
//import Carrito from "../pages/UserPages/Carrito";
//import DepositarForm from "../components/forms/DepositarForm";
//import CreateWallet from "../components/forms/CreateWallet";
//import UserProfile from '../pages/UserPages/UserProfile';

const UserLayout = () => {
    const navigate = useHistory();
    const location = useLocation();

    const handleNavigate = (ruta: string) => {
        navigate.push(ruta);
    };

    const isActiveRoute = (route: string) => {
        return location.pathname === route;
    };    return (
        <main className="transition-colors duration-300">
            <header className="w-full flex flex-col bg-white dark:bg-dark-900 shadow-lg border-b-2 border-primary-500 transition-colors duration-300">
                <div className="h-25 flex px-4 items-center justify-between">
                    <h1 className="text-5xl font-bold bg-red-gradient bg-clip-text text-transparent">
                        24bet
                    </h1>                    <div className='flex gap-4 items-center'>
                        <ThemeToggleButton />
                        <UserProfileButton />
                       {/*  <BotonCarrito />
                        <Avatar /> */}
                    </div>
                </div>
                <div className="flex bg-gray-100 dark:bg-dark-800 items-center justify-center border-t border-primary-600/30 transition-colors duration-300">
                    {/* <span className="px-6 py-3 font-semibold py border-b-2 border-red-600">Deportes</span> */}                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.HOME)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 text-gray-800 dark:text-white transition-colors ${
                            isActiveRoute(USER_ROUTES.HOME) ? 'bg-primary-600/30 border-b-2 border-primary-500' : ''
                        }`}
                    >
                        Casino
                    </span>
                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.QUINIELAS_LIST)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 text-gray-800 dark:text-white transition-colors ${
                            isActiveRoute(USER_ROUTES.QUINIELAS_LIST) ? 'bg-primary-600/30 border-b-2 border-primary-500' : ''
                        }`}
                    >
                        Quinielas
                    </span>
                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.QUINIELAS_CREADAS)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 text-gray-800 dark:text-white transition-colors flex items-center space-x-1 ${
                            isActiveRoute(USER_ROUTES.QUINIELAS_CREADAS) ? 'bg-primary-600/30 border-b-2 border-primary-500' : ''
                        }`}
                    >
                        <span>🏆</span>
                        <span>Mis Quinielas</span>
                    </span>
                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.CRYPTO_WALLET)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 text-gray-800 dark:text-white transition-colors flex items-center space-x-1 ${
                            isActiveRoute(USER_ROUTES.CRYPTO_WALLET) ? 'bg-primary-600/30 border-b-2 border-primary-500' : ''
                        }`}
                    >
                        <span>₿</span>
                        <span>Crypto</span>
                    </span>
                    <span 
                        onClick={() => handleNavigate(USER_ROUTES.USER_PROFILE)} 
                        className={`px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 text-gray-800 dark:text-white transition-colors flex items-center space-x-1 ${
                            isActiveRoute(USER_ROUTES.USER_PROFILE) ? 'bg-primary-600/30 border-b-2 border-primary-500' : ''
                        }`}
                    >
                        <span>⚙️</span>
                        <span>Perfil</span>
                    </span>
                </div>            </header>
            <div className="flex justify-center bg-gray-50 dark:bg-dark-900 min-h-screen transition-colors duration-300">
                <Switch>
                    <Route path={USER_ROUTES.USER_PROFILE} component={UserProfile} />
                    <Route path={USER_ROUTES.QUINIELA} component={QuinielaArmar} /> 
                    <Route path={USER_ROUTES.HOME} component={Dashboard} /> 
                    <Route path={USER_ROUTES.QUINIELAS_LIST} component={QuinielaList} />
                    <Route path={USER_ROUTES.CREAR_QUINIELA} component={CrearQuinielaPage} />
                    <Route path={USER_ROUTES.QUINIELAS_CREADAS} component={QuinielasPage} />
                    <Route path={USER_ROUTES.CRYPTO_WALLET} component={CryptoWalletPage} />
                </Switch>
            </div>
        </main>
    )
}

export default UserLayout;