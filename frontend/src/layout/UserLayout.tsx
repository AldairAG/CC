import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useState } from "react";
import { USER_ROUTES } from "../constants/ROUTERS";
import UserProfile from "../pages/user/UserProfile";
import Dashboard from "../pages/user/ApuestasDeportivasPage";
import UserProfileButton from "../components/ui/UserProfileButton";
import { useUser } from "../hooks/useUser";
import { 
    GestionarQuinielaPage, 
    MisParticipacionesPage, 
    QuinielasPage,
    CrearQuinielaPage,
    QuinielaDetailPage,
    QuinielasListPage 
} from "../pages/user";
import ApuestasDeportivasPage from "../pages/user/ApuestasDeportivasPage";
import LigasMexicanas from "../components/navigation/LigasMexicanas";
import DeportesDisponibles from "../components/navigation/DeportesDisponibles";
import CarritoApuestasSidebar from "../components/navigation/CarritoApuestasSidebar";
import CarritoFlotante from "../components/navigation/CarritoFlotante";
import BotonesFlotantes from "../components/navigation/BotonesFlotantes";
import ApuestasPorDeportePage from "../pages/user/ApuestasPorDeportePage";
import ApuestaDetailsPage from "../pages/user/ApuestaDetailsPage";

const UserLayout = () => {
    const navigate = useHistory();
    const location = useLocation();
    const { logout } = useUser();
    
    // Estados para controlar los sidebars
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleNavigate = (ruta: string) => {
        navigate.push(ruta);
        // Cerrar sidebar móvil al navegar
        setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        logout();
    };

    const isActiveRoute = (route: string) => {
        return location.pathname === route;
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <main className="min-h-screen bg-casino-gradient">
            <header className="w-full flex flex-col bg-dark-900 shadow-lg border-b-2 border-primary-500 relative z-50">
                <div className="h-16 sm:h-20 flex px-4 items-center justify-between py-4">
                    {/* Botón hamburguesa para móviles */}
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 text-white hover:bg-primary-600/20 rounded-lg transition-colors"
                        aria-label="Abrir menú"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-500 animate-glow">
                        24bet
                    </h1>
                    
                    <div className='flex gap-2 sm:gap-4 items-center'>
                        {/* Botón carrito para móviles */}
                        <button
                            onClick={toggleCart}
                            className="xl:hidden p-2 text-white hover:bg-primary-600/20 rounded-lg transition-colors relative"
                            aria-label="Abrir carrito"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7" />
                            </svg>
                        </button>
                        
                        <UserProfileButton />
                        <button 
                            onClick={handleLogout}
                            className="px-2 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-casino flex items-center gap-2 text-sm sm:text-base"
                            title="Cerrar sesión"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm1 9a1 1 0 100-2H9a1 1 0 100 2h2z" clipRule="evenodd" />
                            </svg>
                            <span className="hidden sm:inline">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
                
                <div className="flex bg-dark-800 items-center justify-center border-t border-primary-600/30 overflow-x-auto scrollbar-hide">
                    <div className="flex min-w-max px-2 sm:px-4">
                        <span 
                            onClick={() => handleNavigate(USER_ROUTES.HOME)} 
                            className={`px-4 sm:px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 transition-all duration-300 border-primary-500 whitespace-nowrap text-sm sm:text-base ${
                                isActiveRoute(USER_ROUTES.HOME) ? 'bg-primary-600/30 border-b-2 text-primary-300' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            <span className="sm:hidden">🎰</span>
                            <span className="hidden sm:inline">🎰 Casino</span>
                        </span>
                        
                        <span 
                            onClick={() => handleNavigate(USER_ROUTES.APUESTAS_DEPORTIVAS)} 
                            className={`px-4 sm:px-6 py-3 font-semibold cursor-pointer hover:bg-primary-600/20 transition-all duration-300 flex items-center space-x-1 border-primary-500 whitespace-nowrap text-sm sm:text-base ${
                                isActiveRoute(USER_ROUTES.APUESTAS_DEPORTIVAS) ? 'bg-primary-600/30 border-b-2 text-primary-300' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            <span>⚽</span>
                            <span className="hidden lg:inline">Apuestas Deportivas</span>
                            <span className="lg:hidden hidden sm:inline">Apuestas</span>
                        </span>
                    </div>
                </div>
            </header>
            
            <div className="flex min-h-screen bg-casino-gradient">
                {/* Sidebar izquierdo con ligas mexicanas y deportes */}
                <div className="hidden lg:block w-80 p-4 overflow-y-auto">
                    <LigasMexicanas />
                    <DeportesDisponibles />
                </div>
                
                {/* Contenido principal */}
                <div className="flex-1 flex justify-center">
                    <Switch>
                        <Route path={USER_ROUTES.USER_PROFILE} component={UserProfile} />
                        <Route path={USER_ROUTES.HOME} component={Dashboard} />
                        
                        {/* Rutas principales de quinielas */}
                        <Route path={USER_ROUTES.QUINIELAS} component={QuinielasPage} />
                        <Route path={USER_ROUTES.MIS_PARTICIPACIONES} component={MisParticipacionesPage} />
                        <Route path={USER_ROUTES.GESTIONAR_QUINIELA} component={GestionarQuinielaPage} />
                        
                        {/* Rutas específicas de apuestas */}
                        <Route path={USER_ROUTES.APUESTAS_DETAIL} component={ApuestaDetailsPage} />
                        <Route path={USER_ROUTES.APUESTAS_POR_DEPORTE} component={ApuestasPorDeportePage} />
                        <Route path={USER_ROUTES.APUESTAS_DEPORTIVAS} component={ApuestasDeportivasPage} />

                        {/* Rutas específicas de quinielas */}
                        <Route path={USER_ROUTES.QUINIELA} component={QuinielaDetailPage} />
                        <Route path={USER_ROUTES.CREAR_QUINIELA} component={CrearQuinielaPage} />
                        
                        {/* Rutas legacy para compatibilidad */}
                        <Route path={USER_ROUTES.QUINIELAS_LIST} component={QuinielasListPage} />
                        <Route path={USER_ROUTES.QUINIELAS_CREADAS} component={MisParticipacionesPage} />
                        <Route path={USER_ROUTES.ARMAR_QUINIELA} component={CrearQuinielaPage} />
                    </Switch>
                </div>

                {/* Sidebar derecho con carrito de apuestas */}
                <div className="hidden xl:block w-80 p-4 overflow-y-auto">
                    <CarritoApuestasSidebar />
                </div>
            </div>

            {/* Carrito flotante para móviles */}
            <CarritoFlotante />
            
            {/* Botones flotantes de navegación */}
            <BotonesFlotantes />
        </main>
    )
}

export default UserLayout;
