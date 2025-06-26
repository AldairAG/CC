import { useState, useEffect } from 'react';
import {
    CalendarDaysIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    PlayIcon,
    PauseIcon
} from '@heroicons/react/24/outline';
import { useEventos } from '../../hooks/useEventos';
import { useTheSportsDb } from '../../hooks/useTheSportsDb';

interface Evento {
    id: number;
    nombre: string;
    liga: string;
    equipoLocal: string;
    equipoVisitante: string;
    fechaInicio: string;
    estado: 'PROGRAMADO' | 'EN_VIVO' | 'FINALIZADO' | 'CANCELADO';
    cuotas: {
        local: number;
        empate?: number;
        visitante: number;
    };
    deporte: string;
    categoria: string;
}

const AdminEventos = () => {
    const { obtenerTodosLosEventos } = useEventos();
    const { testConectividad } = useTheSportsDb();
    
    const [eventosList, setEventosList] = useState<Evento[]>([]);
    const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterDeporte, setFilterDeporte] = useState<string>('all');
    const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Datos de ejemplo hasta integrar completamente con los hooks
    useEffect(() => {
        const mockEventos: Evento[] = [
            {
                id: 1,
                nombre: 'El Clásico',
                liga: 'La Liga',
                equipoLocal: 'Real Madrid',
                equipoVisitante: 'FC Barcelona',
                fechaInicio: '2024-01-25T20:00:00Z',
                estado: 'PROGRAMADO',
                cuotas: { local: 2.1, empate: 3.2, visitante: 2.8 },
                deporte: 'Fútbol',
                categoria: 'Primera División'
            },
            {
                id: 2,
                nombre: 'NBA Finals Game 1',
                liga: 'NBA',
                equipoLocal: 'Lakers',
                equipoVisitante: 'Warriors',
                fechaInicio: '2024-01-24T02:00:00Z',
                estado: 'EN_VIVO',
                cuotas: { local: 1.9, visitante: 1.8 },
                deporte: 'Baloncesto',
                categoria: 'NBA'
            },
            {
                id: 3,
                nombre: 'Premier League',
                liga: 'Premier League',
                equipoLocal: 'Liverpool',
                equipoVisitante: 'Chelsea',
                fechaInicio: '2024-01-23T15:30:00Z',
                estado: 'FINALIZADO',
                cuotas: { local: 1.7, empate: 3.8, visitante: 4.2 },
                deporte: 'Fútbol',
                categoria: 'Premier League'
            },
            {
                id: 4,
                nombre: 'Champions League',
                liga: 'UEFA Champions League',
                equipoLocal: 'Manchester City',
                equipoVisitante: 'PSG',
                fechaInicio: '2024-01-26T21:00:00Z',
                estado: 'PROGRAMADO',
                cuotas: { local: 1.6, empate: 4.1, visitante: 5.2 },
                deporte: 'Fútbol',
                categoria: 'Champions League'
            }
        ];

        setTimeout(() => {
            setEventosList(mockEventos);
            setFilteredEventos(mockEventos);
            setLoading(false);
        }, 1000);
    }, []);

    // Cargar datos reales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                await Promise.all([
                    obtenerTodosLosEventos(),
                    testConectividad()
                ]);
            } catch (error) {
                console.error('Error cargando eventos:', error);
            }
        };
        cargarDatos();
    }, [obtenerTodosLosEventos, testConectividad]);

    // Filtrar eventos
    useEffect(() => {
        let filtered = eventosList;

        if (searchTerm) {
            filtered = filtered.filter(evento =>
                evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                evento.equipoLocal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                evento.equipoVisitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                evento.liga.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(evento => evento.estado === filterStatus);
        }

        if (filterDeporte !== 'all') {
            filtered = filtered.filter(evento => evento.deporte === filterDeporte);
        }

        setFilteredEventos(filtered);
    }, [eventosList, searchTerm, filterStatus, filterDeporte]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PROGRAMADO': return 'bg-blue-100 text-blue-800';
            case 'EN_VIVO': return 'bg-green-100 text-green-800';
            case 'FINALIZADO': return 'bg-gray-100 text-gray-800';
            case 'CANCELADO': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PROGRAMADO': return <CalendarDaysIcon className="h-4 w-4" />;
            case 'EN_VIVO': return <PlayIcon className="h-4 w-4 text-green-500" />;
            case 'FINALIZADO': return <PauseIcon className="h-4 w-4" />;
            case 'CANCELADO': return <TrashIcon className="h-4 w-4 text-red-500" />;
            default: return <CalendarDaysIcon className="h-4 w-4" />;
        }
    };

    const handleViewEvento = (evento: Evento) => {
        setSelectedEvento(evento);
        setShowModal(true);
    };

    const handleToggleEventoStatus = (eventoId: number) => {
        setEventosList(prev => prev.map(evento => {
            if (evento.id === eventoId) {
                let newStatus: 'PROGRAMADO' | 'EN_VIVO' | 'FINALIZADO' | 'CANCELADO';
                switch (evento.estado) {
                    case 'PROGRAMADO':
                        newStatus = 'EN_VIVO';
                        break;
                    case 'EN_VIVO':
                        newStatus = 'FINALIZADO';
                        break;
                    case 'FINALIZADO':
                        newStatus = 'PROGRAMADO';
                        break;
                    default:
                        newStatus = 'PROGRAMADO';
                }
                return { ...evento, estado: newStatus };
            }
            return evento;
        }));
    };

    // Calcular estadísticas
    const totalEventos = filteredEventos.length;
    const eventosEnVivo = filteredEventos.filter(e => e.estado === 'EN_VIVO').length;
    const eventosProgramados = filteredEventos.filter(e => e.estado === 'PROGRAMADO').length;
    const eventosFinalizados = filteredEventos.filter(e => e.estado === 'FINALIZADO').length;

    const deportes = [...new Set(eventosList.map(e => e.deporte))];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            <CalendarDaysIcon className="inline h-8 w-8 mr-2" />
                            Gestión de Eventos
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Administra eventos deportivos y sus cuotas
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nuevo Evento
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Eventos
                                    </dt>
                                    <dd className="text-2xl font-semibold text-gray-900">
                                        {totalEventos}
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
                                <PlayIcon className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        En Vivo
                                    </dt>
                                    <dd className="text-2xl font-semibold text-green-600">
                                        {eventosEnVivo}
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
                                <CalendarDaysIcon className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Programados
                                    </dt>
                                    <dd className="text-2xl font-semibold text-blue-600">
                                        {eventosProgramados}
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
                                <PauseIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Finalizados
                                    </dt>
                                    <dd className="text-2xl font-semibold text-gray-600">
                                        {eventosFinalizados}
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
                                placeholder="Buscar eventos..."
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
                            <option value="PROGRAMADO">Programados</option>
                            <option value="EN_VIVO">En Vivo</option>
                            <option value="FINALIZADO">Finalizados</option>
                            <option value="CANCELADO">Cancelados</option>
                        </select>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterDeporte}
                            onChange={(e) => setFilterDeporte(e.target.value)}
                        >
                            <option value="all">Todos los deportes</option>
                            {deportes.map(deporte => (
                                <option key={deporte} value={deporte}>{deporte}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Eventos Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Eventos ({filteredEventos.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Evento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Liga/Competición
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha/Hora
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cuotas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEventos.map((evento) => (
                                <tr key={evento.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {evento.equipoLocal} vs {evento.equipoVisitante}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {evento.nombre}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {evento.deporte}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {evento.liga}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(evento.fechaInicio).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(evento.estado)}
                                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(evento.estado)}`}>
                                                {evento.estado}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex space-x-2">
                                            <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                                                L: {evento.cuotas.local}
                                            </span>
                                            {evento.cuotas.empate && (
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                    E: {evento.cuotas.empate}
                                                </span>
                                            )}
                                            <span className="bg-red-100 px-2 py-1 rounded text-xs">
                                                V: {evento.cuotas.visitante}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewEvento(evento)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Ver detalles"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                title="Editar"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleEventoStatus(evento.id)}
                                                className="text-yellow-600 hover:text-yellow-900"
                                                title="Cambiar estado"
                                            >
                                                {evento.estado === 'PROGRAMADO' ? '▶️' : evento.estado === 'EN_VIVO' ? '⏸️' : '🔄'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Evento Details Modal */}
            {showModal && selectedEvento && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Detalles del Evento
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nombre del Evento</label>
                                <p className="text-sm text-gray-900">{selectedEvento.nombre}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Equipo Local</label>
                                    <p className="text-sm text-gray-900">{selectedEvento.equipoLocal}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Equipo Visitante</label>
                                    <p className="text-sm text-gray-900">{selectedEvento.equipoVisitante}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Liga/Competición</label>
                                <p className="text-sm text-gray-900">{selectedEvento.liga}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Deporte</label>
                                <p className="text-sm text-gray-900">{selectedEvento.deporte}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Fecha y Hora</label>
                                <p className="text-sm text-gray-900">
                                    {new Date(selectedEvento.fechaInicio).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Estado</label>
                                <div className="flex items-center mt-1">
                                    {getStatusIcon(selectedEvento.estado)}
                                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEvento.estado)}`}>
                                        {selectedEvento.estado}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Cuotas</label>
                                <div className="flex space-x-2 mt-1">
                                    <span className="bg-blue-100 px-3 py-1 rounded text-sm">
                                        Local: {selectedEvento.cuotas.local}
                                    </span>
                                    {selectedEvento.cuotas.empate && (
                                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                                            Empate: {selectedEvento.cuotas.empate}
                                        </span>
                                    )}
                                    <span className="bg-red-100 px-3 py-1 rounded text-sm">
                                        Visitante: {selectedEvento.cuotas.visitante}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Cerrar
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                                Editar Evento
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Crear Nuevo Evento
                            </h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre del Evento</label>
                                <input type="text" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Equipo Local</label>
                                    <input type="text" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Equipo Visitante</label>
                                    <input type="text" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Liga/Competición</label>
                                <input type="text" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deporte</label>
                                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Seleccionar deporte</option>
                                    <option value="Fútbol">Fútbol</option>
                                    <option value="Baloncesto">Baloncesto</option>
                                    <option value="Tenis">Tenis</option>
                                    <option value="Béisbol">Béisbol</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                                <input type="datetime-local" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Cancelar
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                                Crear Evento
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEventos;
