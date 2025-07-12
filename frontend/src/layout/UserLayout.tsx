import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useState } from "react";
import { USER_ROUTES } from "../constants/ROUTERS";
import UserProfile from "../pages/user/profile/UserProfile";
import Dashboard from "../pages/user/apuestas/ApuestasDeportivasPage";
import UserProfileButton from "../components/ui/UserProfileButton";
import { useUser } from "../hooks/useUser";
import LigasMexicanas from "../components/navigation/LigasMexicanas";
import DeportesDisponibles from "../components/navigation/DeportesDisponibles";
import CarritoApuestasSidebar from "../components/navigation/CarritoApuestasSidebar";
import CarritoFlotante from "../components/navigation/CarritoFlotante";
import BotonesFlotantes from "../components/navigation/BotonesFlotantes";
import ApuestasLayout from "./ApuestasLayout";
import CryptoLayout from "./CryptoLayout";

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
                        className={`lg:hidden p-2 text-white hover:bg-primary-600/20 rounded-lg transition-colors relative ${
                            isSidebarOpen ? 'bg-primary-600/30' : ''
                        }`}
                        aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isSidebarOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                        {/* Indicador de notificación */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full opacity-80 lg:hidden"></div>
                    </button>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-500 animate-glow">
                        24bet
                    </h1>
                    
                    <div className='flex gap-2 sm:gap-4 items-center'>
                        {/* Botón carrito para móviles */}
                        <button
                            onClick={toggleCart}
                            className={`xl:hidden p-2 text-white hover:bg-primary-600/20 rounded-lg transition-colors relative ${
                                isCartOpen ? 'bg-primary-600/30' : ''
                            }`}
                            aria-label={isCartOpen ? "Cerrar carrito" : "Abrir carrito"}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7" />
                            </svg>
                            {/* Indicador de items en carrito */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full opacity-80 xl:hidden"></div>
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
                {/* Overlay para móviles cuando el sidebar está abierto */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar izquierdo con ligas mexicanas y deportes */}
                <div className={`
                    fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:block w-80 h-full lg:h-auto bg-casino-gradient lg:bg-transparent p-4 overflow-y-auto z-50
                    top-0 left-0 lg:top-auto lg:left-auto lg:z-auto
                    border-r lg:border-r-0 border-primary-600/30
                `}>
                    {/* Header del sidebar móvil */}
                    <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-primary-600/30">
                        <h2 className="text-xl font-bold text-primary-400">Menú</h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 text-white hover:bg-primary-600/20 rounded-lg transition-colors"
                            aria-label="Cerrar menú"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <LigasMexicanas onItemClick={() => setIsSidebarOpen(false)} />
                    <DeportesDisponibles onItemClick={() => setIsSidebarOpen(false)} />
                </div>
                
                {/* Contenido principal */}
                <div className="flex-1 flex justify-center px-4 lg:px-0 pt-4 lg:pt-0">
                    <div className="w-full max-w-6xl">
                        <Switch>
                            <Route path={USER_ROUTES.USER_PROFILE} component={UserProfile} />
                            <Route path={USER_ROUTES.HOME} component={Dashboard} />
                            <Route path={USER_ROUTES.CRYPTO_DASHBOARD} component={CryptoLayout} />

                            {/* Rutas específicas de apuestas */}
                            <Route path={USER_ROUTES.APUESTAS_DEPORTIVAS} component={ApuestasLayout} />
                        </Switch>
                    </div>
                </div>

                {/* Sidebar derecho con carrito de apuestas */}
                <div className={`
                    fixed xl:relative xl:translate-x-0 transition-transform duration-300 ease-in-out
                    ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
                    xl:block w-80 h-full xl:h-auto bg-casino-gradient xl:bg-transparent p-4 overflow-y-auto z-50
                    top-0 right-0 xl:top-auto xl:right-auto xl:z-auto
                    border-l xl:border-l-0 border-primary-600/30
                `}>
                    {/* Header del carrito móvil */}
                    <div className="xl:hidden flex items-center justify-between mb-4 pb-4 border-b border-primary-600/30">
                        <h2 className="text-xl font-bold text-primary-400">Carrito de Apuestas</h2>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 text-white hover:bg-primary-600/20 rounded-lg transition-colors"
                            aria-label="Cerrar carrito"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <CarritoApuestasSidebar />
                </div>

                {/* Overlay para el carrito en móviles */}
                {isCartOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 xl:hidden"
                        onClick={() => setIsCartOpen(false)}
                    />
                )}
            </div>

            {/* Carrito flotante para móviles */}
            <CarritoFlotante />
            
            {/* Botones flotantes de navegación */}
            {/* <BotonesFlotantes /> */}
        </main>
    )
}

export default UserLayout;
