import { useState } from 'react';
import {
    CurrencyDollarIcon,
    UserGroupIcon,
    TrophyIcon,
    BanknotesIcon,
    ChartBarIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon
} from "@heroicons/react/24/outline";

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    totalBets: number;
    activeBets: number;
    totalQuinielas: number;
    cryptoBalance: number;
    pendingWithdrawals: number;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 1524,
        activeUsers: 342,
        totalRevenue: 45780.50,
        totalBets: 2847,
        activeBets: 156,
        totalQuinielas: 89,
        cryptoBalance: 12.5,
        pendingWithdrawals: 8
    });

    const [timeRange, setTimeRange] = useState('7d');

    const dashboardCards = [
        {
            title: "Usuarios Totales",
            value: stats.totalUsers.toLocaleString(),
            subValue: `${stats.activeUsers} activos`,
            icon: UserGroupIcon,
            color: "blue",
            trend: "+12%",
            trendUp: true
        },
        {
            title: "Ingresos Totales",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            subValue: "Este mes",
            icon: CurrencyDollarIcon,
            color: "green",
            trend: "+8.2%",
            trendUp: true
        },
        {
            title: "Apuestas",
            value: stats.totalBets.toLocaleString(),
            subValue: `${stats.activeBets} activas`,
            icon: TrophyIcon,
            color: "purple",
            trend: "+15%",
            trendUp: true
        },
        {
            title: "Crypto Balance",
            value: `${stats.cryptoBalance} BTC`,
            subValue: `${stats.pendingWithdrawals} retiros pendientes`,
            icon: BanknotesIcon,
            color: "orange",
            trend: "-2.1%",
            trendUp: false
        }
    ];

    const recentActivity = [
        { user: "Carlos García", action: "Nueva apuesta", amount: "$250", time: "hace 5 min", type: "bet" },
        { user: "María López", action: "Retiro cripto", amount: "0.05 BTC", time: "hace 12 min", type: "withdrawal" },
        { user: "Juan Pérez", action: "Registro nuevo", amount: "+1 usuario", time: "hace 18 min", type: "signup" },
        { user: "Ana Silva", action: "Quiniela creada", amount: "15 eventos", time: "hace 25 min", type: "quiniela" },
        { user: "Luis Torres", action: "Depósito", amount: "$500", time: "hace 32 min", type: "deposit" }
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

    const getActivityIcon = (type: string) => {
        switch(type) {
            case 'bet': return '🎲';
            case 'withdrawal': return '💰';
            case 'signup': return '👤';
            case 'quiniela': return '🏆';
            case 'deposit': return '💳';
            default: return '📊';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard del Casino</h1>
                    <p className="text-gray-600 mt-2">Resumen de actividad y estadísticas principales</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select 
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="24h">Últimas 24h</option>
                        <option value="7d">Últimos 7 días</option>
                        <option value="30d">Últimos 30 días</option>
                        <option value="90d">Últimos 90 días</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardCards.map((card, index) => (
                    <div key={index} className={`p-6 rounded-xl border-2 ${getCardColorClasses(card.color)} hover:shadow-lg transition-shadow`}>
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
                        <div className="flex items-center mt-4">
                            {card.trendUp ? (
                                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                {card.trend}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Ingresos por Día</h3>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Ver más
                            </button>
                        </div>
                        {/* Placeholder for chart */}
                        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Gráfico de ingresos</p>
                                <p className="text-sm text-gray-400">Integrar con Chart.js o similar</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Ver todo
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="text-lg">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {activity.user}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {activity.action}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {activity.amount}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <UserGroupIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Gestionar Usuarios</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <TrophyIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Nueva Quiniela</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <BanknotesIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Procesar Retiros</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <EyeIcon className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Ver Reportes</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;