import { useState } from 'react';
import {
    CalendarDaysIcon,
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlayIcon,
    PauseIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";

interface Event {
    id: number;
    nombre: string;
    deporte: string;
    liga: string;
    equipoLocal: string;
    equipoVisitante: string;
    fechaEvento: string;
    estado: 'PROGRAMADO' | 'EN_VIVO' | 'FINALIZADO' | 'CANCELADO' | 'SUSPENDIDO';
    cuotas: {
        local: number;
        empate?: number;
        visitante: number;
    };
    totalApuestas: number;
    montoTotal: number;
    resultado?: string;
}

const AdminEvents = () => {
    const [filterStatus, setFilterStatus] = useState('TODOS');
    const [filterSport, setFilterSport] = useState('TODOS');
    
    const [events] = useState<Event[]>([
        {
            id: 1,
            nombre: 'Real Madrid vs Barcelona',
            deporte: 'Fútbol',
            liga: 'La Liga',
            equipoLocal: 'Real Madrid',
            equipoVisitante: 'Barcelona',
            fechaEvento: '2024-07-02 20:00',
            estado: 'PROGRAMADO',
            cuotas: { local: 2.1, empate: 3.2, visitante: 3.8 },
            totalApuestas: 156,
            montoTotal: 12400.00
        },
        {
            id: 2,
            nombre: 'Lakers vs Warriors',
            deporte: 'Basketball',
            liga: 'NBA',
            equipoLocal: 'Los Angeles Lakers',
            equipoVisitante: 'Golden State Warriors',
            fechaEvento: '2024-07-02 21:30',
            estado: 'EN_VIVO',
            cuotas: { local: 1.8, visitante: 2.0 },
            totalApuestas: 89,
            montoTotal: 8950.00
        },
        {
            id: 3,
            nombre: 'Argentina vs Brasil',
            deporte: 'Fútbol',
            liga: 'Copa América',
            equipoLocal: 'Argentina',
            equipoVisitante: 'Brasil',
            fechaEvento: '2024-07-01 19:00',
            estado: 'FINALIZADO',
            cuotas: { local: 2.5, empate: 3.0, visitante: 2.8 },
            totalApuestas: 234,
            montoTotal: 18750.00,
            resultado: '2-1'
        },
        {
            id: 4,
            nombre: 'Chelsea vs Arsenal',
            deporte: 'Fútbol',
            liga: 'Premier League',
            equipoLocal: 'Chelsea',
            equipoVisitante: 'Arsenal',
            fechaEvento: '2024-07-03 16:00',
            estado: 'PROGRAMADO',
            cuotas: { local: 2.3, empate: 3.1, visitante: 3.2 },
            totalApuestas: 67,
            montoTotal: 5340.00
        }
    ]);

    const filteredEvents = events.filter(event => {
        const matchesStatus = filterStatus === 'TODOS' || event.estado === filterStatus;
        const matchesSport = filterSport === 'TODOS' || event.deporte === filterSport;
        return matchesStatus && matchesSport;
    });

    const getStatusBadge = (estado: string) => {
        const styles = {
            'PROGRAMADO': 'bg-blue-100 text-blue-800 border-blue-200',
            'EN_VIVO': 'bg-green-100 text-green-800 border-green-200',
            'FINALIZADO': 'bg-gray-100 text-gray-800 border-gray-200',
            'CANCELADO': 'bg-red-100 text-red-800 border-red-200',
            'SUSPENDIDO': 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
        return styles[estado as keyof typeof styles] || styles.PROGRAMADO;
    };

    const getStatusIcon = (estado: string) => {
        switch(estado) {
            case 'PROGRAMADO': return <ClockIcon className="h-4 w-4" />;
            case 'EN_VIVO': return <PlayIcon className="h-4 w-4" />;
            case 'FINALIZADO': return <CheckCircleIcon className="h-4 w-4" />;
            case 'CANCELADO': return <XCircleIcon className="h-4 w-4" />;
            case 'SUSPENDIDO': return <PauseIcon className="h-4 w-4" />;
            default: return <ClockIcon className="h-4 w-4" />;
        }
    };

    const getSportIcon = (deporte: string) => {
        switch(deporte) {
            case 'Fútbol': return '⚽';
            case 'Basketball': return '🏀';
            case 'Tennis': return '🎾';
            case 'Baseball': return '⚾';
            default: return '🏆';
        }
    };

    const totalEvents = events.length;
    const liveEvents = events.filter(e => e.estado === 'EN_VIVO').length;
    const scheduledEvents = events.filter(e => e.estado === 'PROGRAMADO').length;
    const totalBetsAmount = events.reduce((sum, e) => sum + e.montoTotal, 0);

    const sports = [...new Set(events.map(e => e.deporte))];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Eventos Deportivos</h1>
                    <p className="text-gray-600 mt-2">Administra eventos deportivos y sus apuestas</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nuevo Evento
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Eventos</h3>
                            <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <PlayIcon className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Eventos en Vivo</h3>
                            <p className="text-2xl font-bold text-green-600">{liveEvents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <ClockIcon className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Programados</h3>
                            <p className="text-2xl font-bold text-yellow-600">{scheduledEvents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-bold">$</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Apostado</h3>
                            <p className="text-2xl font-bold text-purple-600">${totalBetsAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Estado:</span>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="TODOS">Todos los estados</option>
                            <option value="PROGRAMADO">Programados</option>
                            <option value="EN_VIVO">En Vivo</option>
                            <option value="FINALIZADO">Finalizados</option>
                            <option value="CANCELADO">Cancelados</option>
                            <option value="SUSPENDIDO">Suspendidos</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Deporte:</span>
                        <select
                            value={filterSport}
                            onChange={(e) => setFilterSport(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="TODOS">Todos los deportes</option>
                            {sports.map(sport => (
                                <option key={sport} value={sport}>{sport}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Eventos Deportivos ({filteredEvents.length})
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
                                    Deporte / Liga
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha y Hora
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cuotas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Apuestas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Apostado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {event.equipoLocal} vs {event.equipoVisitante}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: #{event.id}
                                            </div>
                                            {event.resultado && (
                                                <div className="text-sm font-medium text-green-600">
                                                    Resultado: {event.resultado}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-2">{getSportIcon(event.deporte)}</span>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {event.deporte}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {event.liga}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {event.fechaEvento}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(event.estado)}`}>
                                            {getStatusIcon(event.estado)}
                                            <span className="ml-1">{event.estado}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="space-y-1">
                                            <div>Local: {event.cuotas.local}</div>
                                            {event.cuotas.empate && <div>Empate: {event.cuotas.empate}</div>}
                                            <div>Visitante: {event.cuotas.visitante}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {event.totalApuestas}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                        ${event.montoTotal.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900">
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* No results */}
            {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                    <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron eventos</h3>
                    <p className="text-gray-600">No hay eventos que coincidan con los filtros seleccionados.</p>
                </div>
            )}
        </div>
    );
};

export default AdminEvents;
