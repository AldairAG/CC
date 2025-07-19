import { 
    UserGroupIcon,
    TrophyIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    BellIcon,
    CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { ADMIN_ROUTES } from "../constants/ROUTERS";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";

// Importar componentes de administración existentes
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminBets from "../pages/admin/AdminBets";
import AdminQuinielas from "../pages/admin/AdminQuinielas";
import AdminCrypto from "../pages/admin/AdminCrypto";
//import AdminConfig from "../pages/admin/AdminConfig";
import AdminEvents from "../pages/admin/AdminEvents";
import AdminNotificaciones from "../pages/admin/AdminNotificaciones";
//import AdminRoles from "../pages/admin/AdminRoles";

const routes = [
    {
        href: ADMIN_ROUTES.ADMIN_DASHBOARD,
        label: "Dashboard",
        icon: ChartBarIcon,
    },
    {
        href: ADMIN_ROUTES.ADMIN_USERS,
        label: "Usuarios",
        icon: UserGroupIcon,
    },
    {
        href: ADMIN_ROUTES.ADMIN_QUINIELAS,
        label: "Quinielas",
        icon: TrophyIcon,
    },
    {
        href: ADMIN_ROUTES.ADMIN_APUESTAS,
        label: "Apuestas",
        icon: CurrencyDollarIcon,
    },
    {
        href: ADMIN_ROUTES.ADMIN_EVENTOS,
        label: "Eventos",
        icon: CalendarDaysIcon,
    },
    {
        href: ADMIN_ROUTES.ADMIN_CRYPTO,
        label: "Crypto",
        icon: BanknotesIcon,
    },
    {
        href: ADMIN_ROUTES.ADMIN_NOTIFICACIONES,
        label: "Notificaciones",
        icon: BellIcon,
    },
/*     {
        href: ADMIN_ROUTES.ADMIN_ROLES,
        label: "Roles",
        icon: ShieldCheckIcon,
    },
    {
        href: ADMIN_ROUTES.ADMIN_CONFIG,
        label: "Configuración",
        icon: CogIcon,
    } */
]

const AdminLayout = () => {
    const location = useLocation();
    const { user, logout } = useUser();
    const { 
        stats,
        unreadNotificationsCount,
        loadAllData,
        loading,
        error,
        clearAdminError
    } = useAdmin();

    // Cargar datos iniciales al montar el componente
    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // Limpiar errores después de mostrarlos
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearAdminError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearAdminError]);

    const handleLogout = () => {
        logout();
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <h1 className="text-red-500 font-bold text-2xl">🎲 Admin Casino</h1>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:block">
                            <ul className="flex space-x-1">
                                {routes.map((route) => (
                                    <li key={route.href}>
                                        <Link
                                            to={route.href}
                                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
                                                ${location.pathname === route.href 
                                                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                }`}
                                        >
                                            <route.icon className="h-4 w-4" />
                                            {route.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <button 
                                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                                title="Notificaciones"
                            >
                                <BellIcon className="h-5 w-5" />
                                {unreadNotificationsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                                    </span>
                                )}
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="text-sm text-gray-600">
                                    {user?.username || 'Admin User'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded"
                                >
                                    Salir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-gray-200">
                    <div className="px-2 py-3 space-y-1">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                to={route.href}
                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium
                                    ${location.pathname === route.href 
                                        ? "bg-blue-100 text-blue-700" 
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    }`}
                            >
                                <route.icon className="h-4 w-4" />
                                {route.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Mostrar loading global */}
                {loading && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            <span className="text-blue-700 text-sm">Cargando datos...</span>
                        </div>
                    </div>
                )}

                {/* Mostrar errores globales */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="text-red-600 mr-2">⚠️</div>
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                            <button
                                onClick={clearAdminError}
                                className="text-red-500 hover:text-red-700"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Mostrar estadísticas básicas en el dashboard */}
                {location.pathname === ADMIN_ROUTES.ADMIN_DASHBOARD && stats && (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <UserGroupIcon className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Usuarios Totales</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsuarios}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Apuestas Totales</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalApuestas}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <TrophyIcon className="h-8 w-8 text-yellow-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Quinielas Totales</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalQuinielas}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <BanknotesIcon className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
                                    <p className="text-2xl font-bold text-gray-900">${(stats.totalEventos|0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Switch>
                    <Route exact path={ADMIN_ROUTES.ADMIN_LAYOUT} component={AdminDashboard} />
                    <Route path={ADMIN_ROUTES.ADMIN_DASHBOARD} component={AdminDashboard} />
                    <Route path={ADMIN_ROUTES.ADMIN_USERS} component={AdminUsers} />
                    <Route path={ADMIN_ROUTES.ADMIN_APUESTAS} component={AdminBets} />
                    <Route path={ADMIN_ROUTES.ADMIN_QUINIELAS} component={AdminQuinielas} />
                    <Route path={ADMIN_ROUTES.ADMIN_EVENTOS} component={AdminEvents} />
                    <Route path={ADMIN_ROUTES.ADMIN_CRYPTO} component={AdminCrypto} />
                    <Route path={ADMIN_ROUTES.ADMIN_NOTIFICACIONES} component={AdminNotificaciones} />
{/*                     <Route path={ADMIN_ROUTES.ADMIN_ROLES} component={AdminRoles} />
                    <Route path={ADMIN_ROUTES.ADMIN_CONFIG} component={AdminConfig} /> */}
                </Switch>
            </main>
        </div>
    )
}

export default AdminLayout;