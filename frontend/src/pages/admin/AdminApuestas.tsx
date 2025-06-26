import { useState, useEffect } from 'react';
import {
    CurrencyDollarIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { useApuestas } from '../../hooks/useApuestas';

interface Apuesta {
    id: number;
    usuario: string;
    evento: string;
    tipoApuesta: string;
    monto: number;
    cuota: number;
    ganancia: number;
    estado: 'PENDIENTE' | 'GANADA' | 'PERDIDA' | 'CANCELADA';
    fechaCreacion: string;
    fechaResultado?: string;
}

const AdminApuestas = () => {
    const { 
        obtenerMisApuestas
    } = useApuestas();

    const [apuestasList, setApuestasList] = useState<Apuesta[]>([]);
    const [filteredApuestas, setFilteredApuestas] = useState<Apuesta[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterDateRange, setFilterDateRange] = useState<string>('all');
    const [selectedApuesta, setSelectedApuesta] = useState<Apuesta | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Datos de ejemplo hasta integrar completamente con el hook
    useEffect(() => {
        const mockApuestas: Apuesta[] = [
            {
                id: 1,
                usuario: 'carlos_gamer',
                evento: 'Real Madrid vs Barcelona',
                tipoApuesta: 'Resultado Final',
                monto: 100,
                cuota: 2.5,
                ganancia: 250,
                estado: 'GANADA',
                fechaCreacion: '2024-01-20T10:00:00Z',
                fechaResultado: '2024-01-20T22:00:00Z'
            },
            {
                id: 2,
                usuario: 'maria_bet',
                evento: 'Lakers vs Warriors',
                tipoApuesta: 'Over/Under',
                monto: 50,
                cuota: 1.8,
                ganancia: 90,
                estado: 'PENDIENTE',
                fechaCreacion: '2024-01-21T15:30:00Z'
            },
            {
                id: 3,
                usuario: 'jose_sport',
                evento: 'Liverpool vs Chelsea',
                tipoApuesta: 'Ambas Marcan',
                monto: 75,
                cuota: 3.2,
                ganancia: 240,
                estado: 'PERDIDA',
                fechaCreacion: '2024-01-19T16:45:00Z',
                fechaResultado: '2024-01-19T21:00:00Z'
            },
            {
                id: 4,
                usuario: 'ana_lucky',
                evento: 'Quiniela Premier League',
                tipoApuesta: 'Quiniela Completa',
                monto: 25,
                cuota: 15.5,
                ganancia: 387.5,
                estado: 'PENDIENTE',
                fechaCreacion: '2024-01-21T09:15:00Z'
            }
        ];

        setApuestasList(mockApuestas);
        setFilteredApuestas(mockApuestas);
    }, []);

    // Cargar datos reales si están disponibles
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                await obtenerMisApuestas();
            } catch (error) {
                console.error('Error cargando apuestas:', error);
            }
        };
        cargarDatos();
    }, [obtenerMisApuestas]);

    // Filtrar apuestas
    useEffect(() => {
        let filtered = apuestasList;

        if (searchTerm) {
            filtered = filtered.filter(apuesta =>
                apuesta.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apuesta.evento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apuesta.tipoApuesta.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(apuesta => apuesta.estado === filterStatus);
        }

        if (filterDateRange !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (filterDateRange) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
            }

            filtered = filtered.filter(apuesta =>
                new Date(apuesta.fechaCreacion) >= filterDate
            );
        }

        setFilteredApuestas(filtered);
    }, [apuestasList, searchTerm, filterStatus, filterDateRange]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'GANADA': return 'bg-green-100 text-green-800';
            case 'PERDIDA': return 'bg-red-100 text-red-800';
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELADA': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'GANADA': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'PERDIDA': return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case 'PENDIENTE': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const handleViewApuesta = (apuesta: Apuesta) => {
        setSelectedApuesta(apuesta);
        setShowModal(true);
    };

    // Calcular estadísticas
    const totalApuestas = filteredApuestas.length;
    const apuestasGanadas = filteredApuestas.filter(a => a.estado === 'GANADA').length;
    const apuestasPendientes = filteredApuestas.filter(a => a.estado === 'PENDIENTE').length;
    const montoTotal = filteredApuestas.reduce((sum, a) => sum + a.monto, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            <CurrencyDollarIcon className="inline h-8 w-8 mr-2" />
                            Gestión de Apuestas
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Monitorea y administra todas las apuestas del casino
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Apuestas
                                    </dt>
                                    <dd className="text-2xl font-semibold text-gray-900">
                                        {totalApuestas}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Ganadas
                                    </dt>
                                    <dd className="text-2xl font-semibold text-green-600">
                                        {apuestasGanadas}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ClockIcon className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Pendientes
                                    </dt>
                                    <dd className="text-2xl font-semibold text-yellow-600">
                                        {apuestasPendientes}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CurrencyDollarIcon className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Monto Total
                                    </dt>
                                    <dd className="text-2xl font-semibold text-gray-900">
                                        ${montoTotal.toFixed(2)}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar apuestas..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="PENDIENTE">Pendientes</option>
                            <option value="GANADA">Ganadas</option>
                            <option value="PERDIDA">Perdidas</option>
                            <option value="CANCELADA">Canceladas</option>
                        </select>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterDateRange}
                            onChange={(e) => setFilterDateRange(e.target.value)}
                        >
                            <option value="all">Todas las fechas</option>
                            <option value="today">Hoy</option>
                            <option value="week">Última semana</option>
                            <option value="month">Último mes</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Apuestas Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Apuestas ({filteredApuestas.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Evento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cuota
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredApuestas.map((apuesta) => (
                                <tr key={apuesta.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {apuesta.usuario}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {apuesta.evento}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {apuesta.tipoApuesta}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${apuesta.monto}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {apuesta.cuota}x
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(apuesta.estado)}
                                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(apuesta.estado)}`}>
                                                {apuesta.estado}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(apuesta.fechaCreacion).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewApuesta(apuesta)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="Ver detalles"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Apuesta Details Modal */}
            {showModal && selectedApuesta && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Detalles de la Apuesta
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">ID</label>
                                    <p className="text-sm text-gray-900">#{selectedApuesta.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Usuario</label>
                                    <p className="text-sm text-gray-900">{selectedApuesta.usuario}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Evento</label>
                                <p className="text-sm text-gray-900">{selectedApuesta.evento}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tipo de Apuesta</label>
                                <p className="text-sm text-gray-900">{selectedApuesta.tipoApuesta}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Monto</label>
                                    <p className="text-sm text-gray-900">${selectedApuesta.monto}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Cuota</label>
                                    <p className="text-sm text-gray-900">{selectedApuesta.cuota}x</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Ganancia Potencial</label>
                                <p className="text-sm text-gray-900">${selectedApuesta.ganancia}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Estado</label>
                                <div className="flex items-center mt-1">
                                    {getStatusIcon(selectedApuesta.estado)}
                                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedApuesta.estado)}`}>
                                        {selectedApuesta.estado}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                                <p className="text-sm text-gray-900">
                                    {new Date(selectedApuesta.fechaCreacion).toLocaleString()}
                                </p>
                            </div>
                            {selectedApuesta.fechaResultado && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Fecha de Resultado</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(selectedApuesta.fechaResultado).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminApuestas;
