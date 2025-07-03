import { useState } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    CurrencyDollarIcon,
    CalendarDaysIcon
} from "@heroicons/react/24/outline";

interface Bet {
    id: number;
    usuario: string;
    evento: string;
    tipo: string;
    monto: number;
    cuota: number;
    posibleGanancia: number;
    estado: 'PENDIENTE' | 'GANADA' | 'PERDIDA' | 'CANCELADA';
    fechaApuesta: string;
    fechaEvento: string;
}

const AdminBets = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('TODOS');
    const [dateFilter, setDateFilter] = useState('HOY');
    
    const [bets] = useState<Bet[]>([
        {
            id: 1,
            usuario: 'carlos_garcia',
            evento: 'Real Madrid vs Barcelona',
            tipo: 'Ganador del partido',
            monto: 150.00,
            cuota: 2.5,
            posibleGanancia: 375.00,
            estado: 'PENDIENTE',
            fechaApuesta: '2024-07-02 09:30',
            fechaEvento: '2024-07-02 20:00'
        },
        {
            id: 2,
            usuario: 'maria_lopez',
            evento: 'Lakers vs Warriors',
            tipo: 'Más de 220.5 puntos',
            monto: 75.00,
            cuota: 1.8,
            posibleGanancia: 135.00,
            estado: 'GANADA',
            fechaApuesta: '2024-07-01 15:45',
            fechaEvento: '2024-07-01 21:30'
        },
        {
            id: 3,
            usuario: 'juan_perez',
            evento: 'Argentina vs Brasil',
            tipo: 'Empate',
            monto: 200.00,
            cuota: 3.2,
            posibleGanancia: 640.00,
            estado: 'PERDIDA',
            fechaApuesta: '2024-07-01 12:20',
            fechaEvento: '2024-07-01 19:00'
        },
        {
            id: 4,
            usuario: 'ana_silva',
            evento: 'Chelsea vs Arsenal',
            tipo: 'Menos de 2.5 goles',
            monto: 100.00,
            cuota: 1.9,
            posibleGanancia: 190.00,
            estado: 'PENDIENTE',
            fechaApuesta: '2024-07-02 10:15',
            fechaEvento: '2024-07-03 16:00'
        }
    ]);

    const filteredBets = bets.filter(bet => {
        const matchesSearch = bet.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            bet.evento.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'TODOS' || bet.estado === filterStatus;
        // Para simplicidad, asumimos que HOY muestra todas las apuestas
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (estado: string) => {
        const styles = {
            'PENDIENTE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'GANADA': 'bg-green-100 text-green-800 border-green-200',
            'PERDIDA': 'bg-red-100 text-red-800 border-red-200',
            'CANCELADA': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return styles[estado as keyof typeof styles] || styles.PENDIENTE;
    };

    const getStatusIcon = (estado: string) => {
        switch(estado) {
            case 'PENDIENTE': return <ClockIcon className="h-4 w-4" />;
            case 'GANADA': return <CheckCircleIcon className="h-4 w-4" />;
            case 'PERDIDA': return <XCircleIcon className="h-4 w-4" />;
            case 'CANCELADA': return <XCircleIcon className="h-4 w-4" />;
            default: return <ClockIcon className="h-4 w-4" />;
        }
    };

    const totalBets = bets.length;
    const totalAmount = bets.reduce((sum, bet) => sum + bet.monto, 0);
    const pendingBets = bets.filter(bet => bet.estado === 'PENDIENTE').length;
    const wonBets = bets.filter(bet => bet.estado === 'GANADA').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Apuestas</h1>
                    <p className="text-gray-600 mt-2">Administra y monitorea todas las apuestas del casino</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Exportar Datos
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Apostado</h3>
                            <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <ClockIcon className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Apuestas Pendientes</h3>
                            <p className="text-2xl font-bold text-yellow-600">{pendingBets}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Apuestas Ganadas</h3>
                            <p className="text-2xl font-bold text-green-600">{wonBets}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Apuestas</h3>
                            <p className="text-2xl font-bold text-purple-600">{totalBets}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por usuario o evento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="TODOS">Todos los estados</option>
                                <option value="PENDIENTE">Pendientes</option>
                                <option value="GANADA">Ganadas</option>
                                <option value="PERDIDA">Perdidas</option>
                                <option value="CANCELADA">Canceladas</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="HOY">Hoy</option>
                                <option value="AYER">Ayer</option>
                                <option value="SEMANA">Esta semana</option>
                                <option value="MES">Este mes</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bets Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Lista de Apuestas ({filteredBets.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID / Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Evento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo de Apuesta
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cuota
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Posible Ganancia
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBets.map((bet) => (
                                <tr key={bet.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                #{bet.id}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {bet.usuario}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs">
                                            {bet.evento}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {bet.fechaEvento}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {bet.tipo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${bet.monto.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {bet.cuota}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                        ${bet.posibleGanancia.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(bet.estado)}`}>
                                            {getStatusIcon(bet.estado)}
                                            <span className="ml-1">{bet.estado}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {bet.fechaApuesta}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBets;
