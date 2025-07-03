import { useState } from 'react';
import {
    TrophyIcon,
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    ClockIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";

interface Quiniela {
    id: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';
    participantes: number;
    maxParticipantes: number;
    premioTotal: number;
    costoPorEvento: number;
    totalEventos: number;
    eventosCompletados: number;
    creador: string;
}

const AdminQuinielas = () => {
    const [filterStatus, setFilterStatus] = useState('TODOS');
    
    const [quinielas] = useState<Quiniela[]>([
        {
            id: 1,
            nombre: 'Liga Española Julio 2024',
            descripcion: 'Quiniela de partidos de la Liga Española',
            fechaInicio: '2024-07-01',
            fechaFin: '2024-07-31',
            estado: 'ACTIVA',
            participantes: 45,
            maxParticipantes: 100,
            premioTotal: 2500.00,
            costoPorEvento: 5.00,
            totalEventos: 20,
            eventosCompletados: 8,
            creador: 'admin_system'
        },
        {
            id: 2,
            nombre: 'NBA Finals 2024',
            descripcion: 'Predicciones de los playoffs de la NBA',
            fechaInicio: '2024-06-15',
            fechaFin: '2024-06-30',
            estado: 'FINALIZADA',
            participantes: 78,
            maxParticipantes: 100,
            premioTotal: 3900.00,
            costoPorEvento: 10.00,
            totalEventos: 15,
            eventosCompletados: 15,
            creador: 'maria_admin'
        },
        {
            id: 3,
            nombre: 'Copa América Especial',
            descripcion: 'Quiniela especial de la Copa América',
            fechaInicio: '2024-06-20',
            fechaFin: '2024-07-15',
            estado: 'ACTIVA',
            participantes: 123,
            maxParticipantes: 150,
            premioTotal: 6150.00,
            costoPorEvento: 7.50,
            totalEventos: 25,
            eventosCompletados: 18,
            creador: 'carlos_admin'
        }
    ]);

    const filteredQuinielas = quinielas.filter(quiniela => {
        return filterStatus === 'TODOS' || quiniela.estado === filterStatus;
    });

    const getStatusBadge = (estado: string) => {
        const styles = {
            'ACTIVA': 'bg-green-100 text-green-800 border-green-200',
            'FINALIZADA': 'bg-blue-100 text-blue-800 border-blue-200',
            'CANCELADA': 'bg-red-100 text-red-800 border-red-200'
        };
        return styles[estado as keyof typeof styles] || styles.ACTIVA;
    };

    const getStatusIcon = (estado: string) => {
        switch(estado) {
            case 'ACTIVA': return <ClockIcon className="h-4 w-4" />;
            case 'FINALIZADA': return <CheckCircleIcon className="h-4 w-4" />;
            case 'CANCELADA': return <TrashIcon className="h-4 w-4" />;
            default: return <ClockIcon className="h-4 w-4" />;
        }
    };

    const getProgressPercentage = (completados: number, total: number) => {
        return (completados / total) * 100;
    };

    const totalQuinielas = quinielas.length;
    const quinielasActivas = quinielas.filter(q => q.estado === 'ACTIVA').length;
    const totalParticipantes = quinielas.reduce((sum, q) => sum + q.participantes, 0);
    const totalPremios = quinielas.reduce((sum, q) => sum + q.premioTotal, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Quinielas</h1>
                    <p className="text-gray-600 mt-2">Administra y monitorea todas las quinielas del casino</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nueva Quiniela
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <TrophyIcon className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Quinielas</h3>
                            <p className="text-2xl font-bold text-gray-900">{totalQuinielas}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <ClockIcon className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Quinielas Activas</h3>
                            <p className="text-2xl font-bold text-green-600">{quinielasActivas}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <UserGroupIcon className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Participantes</h3>
                            <p className="text-2xl font-bold text-purple-600">{totalParticipantes}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Premios</h3>
                            <p className="text-2xl font-bold text-orange-600">${totalPremios.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="TODOS">Todos los estados</option>
                        <option value="ACTIVA">Activas</option>
                        <option value="FINALIZADA">Finalizadas</option>
                        <option value="CANCELADA">Canceladas</option>
                    </select>
                </div>
            </div>

            {/* Quinielas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredQuinielas.map((quiniela) => (
                    <div key={quiniela.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiniela.nombre}</h3>
                                <p className="text-sm text-gray-600 mb-2">{quiniela.descripcion}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(quiniela.estado)}`}>
                                    {getStatusIcon(quiniela.estado)}
                                    <span className="ml-1">{quiniela.estado}</span>
                                </span>
                            </div>
                            <div className="flex space-x-2 ml-4">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <EyeIcon className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                    <PencilIcon className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Participantes</span>
                                    <UserGroupIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="mt-1">
                                    <span className="text-lg font-semibold text-gray-900">{quiniela.participantes}</span>
                                    <span className="text-sm text-gray-500">/{quiniela.maxParticipantes}</span>
                                </div>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${(quiniela.participantes / quiniela.maxParticipantes) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Progreso</span>
                                    <ClockIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="mt-1">
                                    <span className="text-lg font-semibold text-gray-900">{quiniela.eventosCompletados}</span>
                                    <span className="text-sm text-gray-500">/{quiniela.totalEventos}</span>
                                </div>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full" 
                                            style={{ width: `${getProgressPercentage(quiniela.eventosCompletados, quiniela.totalEventos)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Info */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-sm text-gray-600">Premio Total</span>
                                    <p className="text-lg font-bold text-green-600">${quiniela.premioTotal.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-gray-600">Costo por Evento</span>
                                    <p className="text-lg font-semibold text-gray-900">${quiniela.costoPorEvento}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Inicio: {quiniela.fechaInicio}</span>
                                <span>Fin: {quiniela.fechaFin}</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                                Creado por: {quiniela.creador}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No results */}
            {filteredQuinielas.length === 0 && (
                <div className="text-center py-12">
                    <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron quinielas</h3>
                    <p className="text-gray-600">No hay quinielas que coincidan con los filtros seleccionados.</p>
                </div>
            )}
        </div>
    );
};

export default AdminQuinielas;
