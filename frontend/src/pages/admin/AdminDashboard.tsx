import { useEffect } from 'react';
import {
    CurrencyDollarIcon,
    UserGroupIcon,
    TrophyIcon,
    ChartBarIcon,
    CalendarDaysIcon
} from "@heroicons/react/24/outline";
import { useAdmin } from '../../hooks/useAdmin';

const AdminDashboard = () => {
    const {
        stats,
        loading,
        error,
        activeUsersCount,
        pendingBetsCount,
        activeQuinielasCount,
        unreadNotificationsCount,
        pendingCryptoTransactionsCount,
        loadStats
    } = useAdmin();

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 text-lg mb-4">Error al cargar las estadísticas</div>
                <div className="text-gray-600 mb-4">{error}</div>
                <button onClick={loadStats} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Reintentar
                </button>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-600 text-lg">No hay datos disponibles</div>
                <button onClick={loadStats} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Cargar datos
                </button>
            </div>
        );
    }

    const dashboardCards = [
        {
            title: "Usuarios Totales",
            value: (stats.totalUsuarios|0).toLocaleString(),
            subValue: `${activeUsersCount} activos`,
            icon: UserGroupIcon,
            color: "blue"
        },
        {
            title: "Ingresos Totales",
            value: `$${(stats.totalEventos|0).toLocaleString()}`,
            subValue: "Este mes",
            icon: CurrencyDollarIcon,
            color: "green"
        },
        {
            title: "Apuestas Totales",
            value: (stats.totalApuestas|0).toLocaleString(),
            subValue: `${pendingBetsCount} pendientes`,
            icon: TrophyIcon,
            color: "purple"
        },
        {
            title: "Quinielas Activas",
            value: (activeQuinielasCount|0).toLocaleString(),
            subValue: `${stats.totalQuinielas} totales`,
            icon: CalendarDaysIcon,
            color: "orange"
        }
    ];

    const getCardColorClasses = (color: string) => {
        const colors = {
            blue: "bg-blue-50 border-blue-200",
            green: "bg-green-50 border-green-200",
            purple: "bg-purple-50 border-purple-200",
            orange: "bg-orange-50 border-orange-200"
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    const getIconColorClasses = (color: string) => {
        const colors = {
            blue: "text-blue-600 bg-blue-100",
            green: "text-green-600 bg-green-100",
            purple: "text-purple-600 bg-purple-100",
            orange: "text-orange-600 bg-orange-100"
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard del Casino</h1>
                    <p className="text-gray-600 mt-2">Resumen de actividad y estadísticas principales</p>
                </div>
                <button
                    onClick={loadStats}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Actualizar datos
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardCards.map((card, index) => (
                    <div key={index} className={`p-6 rounded-xl border-2 ${getCardColorClasses(card.color)}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                <p className="text-sm text-gray-500 mt-1">{card.subValue}</p>
                            </div>
                            <div className={`p-3 rounded-full ${getIconColorClasses(card.color)}`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Vista General</h3>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Dashboard implementado con useAdmin hook</p>
                        <p className="text-sm text-gray-400">Datos: {unreadNotificationsCount} notificaciones, {pendingCryptoTransactionsCount} transacciones crypto</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
