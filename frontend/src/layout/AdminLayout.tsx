import { 
    UserGroupIcon,
    TrophyIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    CogIcon,
    BellIcon,
    CalendarDaysIcon
} from "@heroicons/react/24/outline";
import { ADMIN_ROUTES } from "../constants/ROUTERS";
import { Link, Route, Switch } from "react-router-dom";

// Importar componentes de administración existentes
import AdminDashboard from "../pages/admin/AdminDashboard";

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
    {
        href: ADMIN_ROUTES.ADMIN_CONFIG,
        label: "Configuración",
        icon: CogIcon,
    }
]

const AdminLayout = () => {
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
                                                ${window.location.pathname === route.href 
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
                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                                <BellIcon className="h-5 w-5" />
                            </button>
                            <div className="text-sm text-gray-600">
                                Admin User
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
                                    ${window.location.pathname === route.href 
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
                <Switch>
                    <Route exact path={ADMIN_ROUTES.ADMIN_LAYOUT} component={AdminDashboard} />
                    <Route path={ADMIN_ROUTES.ADMIN_DASHBOARD} component={AdminDashboard} />
                </Switch>
            </main>
        </div>
    )
}

export default AdminLayout;