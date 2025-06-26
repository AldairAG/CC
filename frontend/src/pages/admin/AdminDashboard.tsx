import { useEffect, useState, useCallback } from 'react';
import {
    ChartBarIcon,
    UserGroupIcon,
    TrophyIcon,
    CurrencyDollarIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useQuiniela } from '../../hooks/useQuiniela';
import type { QuinielaResponse } from '../../types/QuinielaType';

const AdminDashboard = () => {
    const { 
        quinielasPublicas, 
        cargarQuinielasPublicas, 
        cargarMisQuinielas
    } = useQuiniela();
    
    const [stats, setStats] = useState({
        totalQuinielas: 0,
        quinielasActivas: 0,
        totalUsuarios: 0,
        gananciasHoy: 0,
        crecimientoSemanal: 0
    });

    const [loading, setLoading] = useState(true);

    const cargarDatos = useCallback(async () => {
        try {
            setLoading(true);
            await Promise.all([
                cargarQuinielasPublicas(),
                cargarMisQuinielas()
            ]);
            
            // Calcular estadísticas
            const quinielasActivas = quinielasPublicas.filter((q: QuinielaResponse) => q.estado === 'ACTIVA').length;
            
            setStats({
                totalQuinielas: quinielasPublicas.length,
                quinielasActivas,
                totalUsuarios: 150, // Placeholder - would come from user service
                gananciasHoy: 2450.50,
                crecimientoSemanal: 15.3
            });
        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
        } finally {
            setLoading(false);
        }
    }, [cargarQuinielasPublicas, cargarMisQuinielas, quinielasPublicas]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const statCards = [
        {
            title: 'Total Quinielas',
            value: stats.totalQuinielas,
            icon: TrophyIcon,
            color: 'bg-blue-500',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Quinielas Activas',
            value: stats.quinielasActivas,
            icon: ChartBarIcon,
            color: 'bg-green-500',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Usuarios Registrados',
            value: stats.totalUsuarios,
            icon: UserGroupIcon,
            color: 'bg-purple-500',
            change: '+23%',
            changeType: 'positive'
        },
        {
            title: 'Ganancias Hoy',
            value: `€${stats.gananciasHoy.toFixed(2)}`,
            icon: CurrencyDollarIcon,
            color: 'bg-yellow-500',
            change: '-2%',
            changeType: 'negative'
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">🎲 Dashboard Casino</h1>
                    <p className="text-gray-600">Panel de control administrativo</p>
                </div>
                <div className="text-sm text-gray-500">
                    Última actualización: {new Date().toLocaleString('es-ES')}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <div className="flex items-center mt-2">
                                    {stat.changeType === 'positive' ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm ${
                                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color}`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quinielas Recientes */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Quinielas Recientes</h3>
                    <div className="space-y-3">
                        {quinielasPublicas.slice(0, 5).map((quiniela) => (
                            <div key={quiniela.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900">{quiniela.nombre}</h4>
                                    <p className="text-sm text-gray-600">
                                        {quiniela.participantes} participantes
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        quiniela.estado === 'ACTIVA' 
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {quiniela.estado}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actividad del Sistema */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Actividad del Sistema</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Quinielas creadas hoy</span>
                            <span className="font-semibold text-gray-900">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Nuevos usuarios</span>
                            <span className="font-semibold text-gray-900">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Apuestas procesadas</span>
                            <span className="font-semibold text-gray-900">87</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Revenue total</span>
                            <span className="font-semibold text-green-600">€12,450.00</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alertas y Notificaciones */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Alertas y Notificaciones</h3>
                <div className="space-y-3">
                    <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-800">
                                3 quinielas necesitan revisión manual para distribución de premios
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-800">
                                Actualización del sistema programada para mañana a las 2:00 AM
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-800">
                                Backup automático completado exitosamente
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    📊 Ver Reportes Detallados
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    🏆 Crear Nueva Quiniela
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    👥 Gestionar Usuarios
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
