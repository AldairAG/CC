import { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import type { GameHistory as GameHistoryType } from '../../types/UserProfileTypes';

const GameHistory = () => {
    const { gameHistory, fetchGameHistory, fetchingGameHisotry:loading } = useUserProfile();
    
    const [activeTab, setActiveTab] = useState<'all' | 'apuestas' | 'casino' | 'quinielas'>('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [filteredHistory, setFilteredHistory] = useState<GameHistoryType[]>([]);

    useEffect(() => {
        fetchGameHistory();
    }, [fetchGameHistory]);

    useEffect(() => {
        let filtered = [...gameHistory];

        // Filtrar por tipo
        if (activeTab !== 'all') {
            const typeMap = {
                'apuestas': 'APUESTA',
                'casino': 'CASINO',
                'quinielas': 'QUINIELA'
            };
            filtered = filtered.filter(item => item.tipo === typeMap[activeTab]);
        }

        // Filtrar por fecha
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();
            
            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            filtered = filtered.filter(item => new Date(item.fecha) >= filterDate);
        }

        setFilteredHistory(filtered);
    }, [gameHistory, activeTab, dateFilter]);

    const tabs = [
        { id: 'all', label: 'Todo', icon: '📊', count: gameHistory.length },
        { id: 'apuestas', label: 'Apuestas', icon: '⚽', count: gameHistory.filter(h => h.tipo === 'APUESTA').length },
        { id: 'casino', label: 'Casino', icon: '🎰', count: gameHistory.filter(h => h.tipo === 'CASINO').length },
        { id: 'quinielas', label: 'Quinielas', icon: '🎯', count: gameHistory.filter(h => h.tipo === 'QUINIELA').length }
    ];

    const getResultadoColor = (resultado: string) => {
        switch (resultado.toLowerCase()) {
            case 'ganada':
                return 'text-green-600 bg-green-50';
            case 'perdida':
                return 'text-red-600 bg-red-50';
            case 'pendiente':
                return 'text-yellow-600 bg-yellow-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getResultadoIcon = (resultado: string) => {
        switch (resultado.toLowerCase()) {
            case 'ganada':
                return '✅';
            case 'perdida':
                return '❌';
            case 'pendiente':
                return '⏳';
            default:
                return '❓';
        }
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'APUESTA':
                return '⚽';
            case 'CASINO':
                return '🎰';
            case 'QUINIELA':
                return '🎯';
            default:
                return '🎮';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const getTotalStats = () => {
        const stats = {
            totalJugado: 0,
            totalGanado: 0,
            totalPerdido: 0,
            totalPartidas: filteredHistory.length,
            partidasGanadas: 0,
            partidasPerdidas: 0,
            partidasPendientes: 0
        };

        filteredHistory.forEach(item => {
            stats.totalJugado += item.monto;
            
            switch (item.resultado.toLowerCase()) {
                case 'ganada':
                    stats.totalGanado += item.monto;
                    stats.partidasGanadas++;
                    break;
                case 'perdida':
                    stats.totalPerdido += item.monto;
                    stats.partidasPerdidas++;
                    break;
                case 'pendiente':
                    stats.partidasPendientes++;
                    break;
            }
        });

        return stats;
    };

    const stats = getTotalStats();

    return (
        <div className="max-w-6xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Historial de Juego</h2>
                <p className="text-gray-600">
                    Revisa tu actividad de juegos, apuestas y estadísticas
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="text-blue-600">💰</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Total Jugado</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(stats.totalJugado)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-green-600">📈</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Total Ganado</p>
                            <p className="text-lg font-semibold text-green-600">
                                {formatCurrency(stats.totalGanado)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <span className="text-red-600">📉</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Total Perdido</p>
                            <p className="text-lg font-semibold text-red-600">
                                {formatCurrency(stats.totalPerdido)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <span className="text-purple-600">🎮</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Partidas</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {stats.totalPartidas}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'all' | 'apuestas' | 'casino' | 'quinielas')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Date Filter */}
            <div className="mb-6">
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Filtrar por fecha:</label>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="all">Todo el tiempo</option>
                        <option value="today">Hoy</option>
                        <option value="week">Última semana</option>
                        <option value="month">Último mes</option>
                        <option value="year">Último año</option>
                    </select>
                </div>
            </div>

            {/* History List */}
            <div className="bg-white rounded-lg border border-gray-200">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-600">Cargando historial...</span>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">📊</span>
                        <p>No hay registros para mostrar</p>
                        <p className="text-sm">Prueba con diferentes filtros</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Monto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Resultado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-lg mr-2">
                                                    {getTipoIcon(item.tipo)}
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {item.tipo}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {item.descripcion}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.fecha)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatCurrency(item.monto)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultadoColor(item.resultado)}`}>
                                                <span className="mr-1">{getResultadoIcon(item.resultado)}</span>
                                                {item.resultado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.estado}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Win Rate */}
            {filteredHistory.length > 0 && (
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas de Rendimiento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {stats.totalPartidas > 0 ? Math.round((stats.partidasGanadas / stats.totalPartidas) * 100) : 0}%
                            </div>
                            <div className="text-sm text-gray-600">Tasa de Victoria</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {formatCurrency(stats.totalGanado - stats.totalPerdido)}
                            </div>
                            <div className="text-sm text-gray-600">Ganancia Neta</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {stats.totalPartidas > 0 ? formatCurrency(stats.totalJugado / stats.totalPartidas) : formatCurrency(0)}
                            </div>
                            <div className="text-sm text-gray-600">Apuesta Promedio</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameHistory;
