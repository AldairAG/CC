import { useState } from 'react';
import { 
    BellIcon, 
    ExclamationTriangleIcon, 
    InformationCircleIcon,
    CheckCircleIcon,
    XMarkIcon,
    PlusIcon,
    FunnelIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Tipos mock para notificaciones
interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    status: 'active' | 'sent' | 'scheduled' | 'draft';
    targetAudience: 'all' | 'premium' | 'new' | 'inactive';
    createdAt: string;
    scheduledAt?: string;
    readCount?: number;
    totalSent?: number;
}

// Datos mock
const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Nuevo Evento Deportivo',
        message: 'Se ha agregado un nuevo partido de Champions League',
        type: 'info',
        status: 'active',
        targetAudience: 'all',
        createdAt: '2024-01-15 10:30',
        readCount: 1250,
        totalSent: 2100
    },
    {
        id: '2',
        title: 'Mantenimiento Programado',
        message: 'El sistema estará en mantenimiento mañana de 02:00 a 04:00',
        type: 'warning',
        status: 'scheduled',
        targetAudience: 'all',
        createdAt: '2024-01-15 09:15',
        scheduledAt: '2024-01-16 01:30'
    },
    {
        id: '3',
        title: 'Promoción Especial',
        message: 'Bono del 50% en tu primer depósito en criptomonedas',
        type: 'success',
        status: 'sent',
        targetAudience: 'new',
        createdAt: '2024-01-14 16:20',
        readCount: 890,
        totalSent: 1200
    },
    {
        id: '4',
        title: 'Error en Procesamiento',
        message: 'Se detectaron errores en algunas transacciones',
        type: 'error',
        status: 'draft',
        targetAudience: 'premium',
        createdAt: '2024-01-14 11:45'
    }
];

const AdminNotificaciones = () => {
    const [notifications] = useState<Notification[]>(mockNotifications);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'info': return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
            case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
            case 'success': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'error': return <XMarkIcon className="h-5 w-5 text-red-500" />;
            default: return <BellIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            sent: 'bg-blue-100 text-blue-800',
            scheduled: 'bg-yellow-100 text-yellow-800',
            draft: 'bg-gray-100 text-gray-800'
        };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {status}
            </span>
        );
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesType = selectedType === 'all' || notification.type === selectedType;
        const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesType && matchesStatus && matchesSearch;
    });

    // Estadísticas
    const stats = [
        {
            name: 'Notificaciones Activas',
            value: notifications.filter(n => n.status === 'active').length,
            icon: BellIcon,
            color: 'text-blue-600'
        },
        {
            name: 'Programadas',
            value: notifications.filter(n => n.status === 'scheduled').length,
            icon: ExclamationTriangleIcon,
            color: 'text-yellow-600'
        },
        {
            name: 'Enviadas Hoy',
            value: notifications.filter(n => n.status === 'sent').length,
            icon: CheckCircleIcon,
            color: 'text-green-600'
        },
        {
            name: 'Borradores',
            value: notifications.filter(n => n.status === 'draft').length,
            icon: InformationCircleIcon,
            color: 'text-gray-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
                    <p className="text-gray-600">Gestiona las notificaciones del sistema</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nueva Notificación
                </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filtros y Búsqueda */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <FunnelIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filtros:</span>
                    </div>
                    
                    <select 
                        value={selectedType} 
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="info">Información</option>
                        <option value="warning">Advertencia</option>
                        <option value="success">Éxito</option>
                        <option value="error">Error</option>
                    </select>

                    <select 
                        value={selectedStatus} 
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activas</option>
                        <option value="sent">Enviadas</option>
                        <option value="scheduled">Programadas</option>
                        <option value="draft">Borradores</option>
                    </select>

                    <div className="flex-1 min-w-64">
                        <div className="relative">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar notificaciones..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Notificaciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Notificación</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Audiencia</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Estadísticas</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredNotifications.map((notification) => (
                                <tr key={notification.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <div>
                                            <div className="font-semibold text-gray-900">{notification.title}</div>
                                            <div className="text-sm text-gray-600 truncate max-w-xs">
                                                {notification.message}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(notification.type)}
                                            <span className="text-sm capitalize">{notification.type}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        {getStatusBadge(notification.status)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-900 capitalize">
                                            {notification.targetAudience}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {notification.readCount && notification.totalSent ? (
                                            <div className="text-sm">
                                                <div>{notification.readCount}/{notification.totalSent}</div>
                                                <div className="text-gray-500">
                                                    {Math.round((notification.readCount / notification.totalSent) * 100)}% leído
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="text-sm">
                                            <div>{notification.createdAt}</div>
                                            {notification.scheduledAt && (
                                                <div className="text-yellow-600">
                                                    📅 {notification.scheduledAt}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-900 text-sm">
                                                Editar
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 text-sm">
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal placeholder */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Nueva Notificación</h3>
                        <p className="text-gray-600 mb-4">Funcionalidad en desarrollo...</p>
                        <button 
                            onClick={() => setShowCreateModal(false)}
                            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotificaciones;
