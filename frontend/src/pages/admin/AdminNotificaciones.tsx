import { useState, useEffect } from 'react';
import {
    BellIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    CheckIcon,
    XMarkIcon,
    PlusIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useNotificaciones } from '../../hooks/useNotificaciones';

interface Notification {
    id: number;
    titulo: string;
    mensaje: string;
    tipo: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    usuario?: string;
    categoria: 'SISTEMA' | 'APUESTAS' | 'CRYPTO' | 'USUARIO' | 'EVENTO';
    estado: 'ENVIADA' | 'LEIDA' | 'PENDIENTE' | 'FALLIDA';
    fechaCreacion: string;
    fechaEnvio?: string;
    fechaLectura?: string;
    esGlobal: boolean;
    prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
}

const AdminNotificaciones = () => {
    const { 
        notificaciones, 
        obtenerNotificaciones, 
        marcarComoLeida,
        enviarNotificacion,
        loading 
    } = useNotificaciones();

    const [notificationsList, setNotificationsList] = useState<Notification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Datos de ejemplo
    useEffect(() => {
        const mockNotifications: Notification[] = [
            {
                id: 1,
                titulo: 'Sistema de Mantenimiento',
                mensaje: 'El sistema entrará en mantenimiento el domingo a las 2:00 AM',
                tipo: 'WARNING',
                categoria: 'SISTEMA',
                estado: 'ENVIADA',
                fechaCreacion: '2024-01-20T10:00:00Z',
                fechaEnvio: '2024-01-20T10:05:00Z',
                esGlobal: true,
                prioridad: 'ALTA'
            },
            {
                id: 2,
                titulo: 'Nueva Apuesta Ganada',
                mensaje: 'Tu apuesta en el partido Real Madrid vs Barcelona ha sido ganada. Ganancia: $250',
                tipo: 'SUCCESS',
                usuario: 'carlos_gamer',
                categoria: 'APUESTAS',
                estado: 'LEIDA',
                fechaCreacion: '2024-01-20T22:00:00Z',
                fechaEnvio: '2024-01-20T22:01:00Z',
                fechaLectura: '2024-01-20T22:30:00Z',
                esGlobal: false,
                prioridad: 'MEDIA'
            },
            {
                id: 3,
                titulo: 'Transacción Crypto Fallida',
                mensaje: 'La transacción de retiro de Bitcoin ha fallado. Revisa los detalles en tu wallet.',
                tipo: 'ERROR',
                usuario: 'maria_crypto',
                categoria: 'CRYPTO',
                estado: 'ENVIADA',
                fechaCreacion: '2024-01-21T15:30:00Z',
                fechaEnvio: '2024-01-21T15:31:00Z',
                esGlobal: false,
                prioridad: 'ALTA'
            },
            {
                id: 4,
                titulo: 'Nuevo Evento Disponible',
                mensaje: 'Ya está disponible para apostar: Lakers vs Warriors - NBA Finals',
                tipo: 'INFO',
                categoria: 'EVENTO',
                estado: 'PENDIENTE',
                fechaCreacion: '2024-01-21T16:45:00Z',
                esGlobal: true,
                prioridad: 'MEDIA'
            },
            {
                id: 5,
                titulo: 'Verificación de Cuenta',
                mensaje: 'Tu cuenta requiere verificación adicional para retiros superiores a $1000',
                tipo: 'WARNING',
                usuario: 'jose_player',
                categoria: 'USUARIO',
                estado: 'ENVIADA',
                fechaCreacion: '2024-01-19T14:20:00Z',
                fechaEnvio: '2024-01-19T14:25:00Z',
                esGlobal: false,
                prioridad: 'ALTA'
            }
        ];

        setNotificationsList(mockNotifications);
        setFilteredNotifications(mockNotifications);
    }, []);

    // Cargar datos reales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                await obtenerNotificaciones();
            } catch (error) {
                console.error('Error cargando notificaciones:', error);
            }
        };
        cargarDatos();
    }, [obtenerNotificaciones]);

    // Filtrar notificaciones
    useEffect(() => {
        let filtered = notificationsList;

        if (searchTerm) {
            filtered = filtered.filter(notification =>
                notification.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notification.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notification.usuario?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(notification => notification.estado === filterStatus);
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(notification => notification.tipo === filterType);
        }

        if (filterCategory !== 'all') {
            filtered = filtered.filter(notification => notification.categoria === filterCategory);
        }

        setFilteredNotifications(filtered);
    }, [notificationsList, searchTerm, filterStatus, filterType, filterCategory]);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'SUCCESS': return 'bg-green-100 text-green-800';
            case 'WARNING': return 'bg-yellow-100 text-yellow-800';
            case 'ERROR': return 'bg-red-100 text-red-800';
            case 'INFO': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'WARNING': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
            case 'ERROR': return <XMarkIcon className="h-5 w-5 text-red-500" />;
            case 'INFO': return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
            default: return <BellIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ENVIADA': return 'bg-green-100 text-green-800';
            case 'LEIDA': return 'bg-gray-100 text-gray-800';
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
            case 'FALLIDA': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICA': return 'bg-red-500 text-white';
            case 'ALTA': return 'bg-orange-500 text-white';
            case 'MEDIA': return 'bg-yellow-500 text-white';
            case 'BAJA': return 'bg-green-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const handleViewNotification = (notification: Notification) => {
        setSelectedNotification(notification);
        setShowModal(true);
    };

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await marcarComoLeida(notificationId);
            setNotificationsList(prev => prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, estado: 'LEIDA', fechaLectura: new Date().toISOString() }
                    : notification
            ));
        } catch (error) {
            console.error('Error marcando como leída:', error);
        }
    };

    // Calcular estadísticas
    const totalNotificaciones = filteredNotifications.length;
    const notificacionesEnviadas = filteredNotifications.filter(n => n.estado === 'ENVIADA').length;
    const notificacionesPendientes = filteredNotifications.filter(n => n.estado === 'PENDIENTE').length;
    const notificacionesLeidas = filteredNotifications.filter(n => n.estado === 'LEIDA').length;
    const notificacionesGlobales = filteredNotifications.filter(n => n.esGlobal).length;

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
                            <BellIcon className="inline h-8 w-8 mr-2" />
                            Gestión de Notificaciones
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Administra y envía notificaciones a los usuarios
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nueva Notificación
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BellIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total
                                    </dt>
                                    <dd className="text-2xl font-semibold text-gray-900">
                                        {totalNotificaciones}
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
                                <CheckIcon className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Enviadas
                                    </dt>
                                    <dd className="text-2xl font-semibold text-green-600">
                                        {notificacionesEnviadas}
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
                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Pendientes
                                    </dt>
                                    <dd className="text-2xl font-semibold text-yellow-600">
                                        {notificacionesPendientes}
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
                                <CheckCircleIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Leídas
                                    </dt>
                                    <dd className="text-2xl font-semibold text-gray-600">
                                        {notificacionesLeidas}
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
                                <BellIcon className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Globales
                                    </dt>
                                    <dd className="text-2xl font-semibold text-blue-600">
                                        {notificacionesGlobales}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="col-span-2">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar notificaciones..."
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
                            <option value="ENVIADA">Enviadas</option>
                            <option value="LEIDA">Leídas</option>
                            <option value="PENDIENTE">Pendientes</option>
                            <option value="FALLIDA">Fallidas</option>
                        </select>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="INFO">Información</option>
                            <option value="SUCCESS">Éxito</option>
                            <option value="WARNING">Advertencia</option>
                            <option value="ERROR">Error</option>
                        </select>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="all">Todas las categorías</option>
                            <option value="SISTEMA">Sistema</option>
                            <option value="APUESTAS">Apuestas</option>
                            <option value="CRYPTO">Crypto</option>
                            <option value="USUARIO">Usuario</option>
                            <option value="EVENTO">Evento</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notifications Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Notificaciones ({filteredNotifications.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Notificación
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Prioridad
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
                            {filteredNotifications.map((notification) => (
                                <tr key={notification.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {notification.titulo}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {notification.mensaje}
                                            </div>
                                            {notification.esGlobal && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                                    Global
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {notification.usuario || 'Todos'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getTypeIcon(notification.tipo)}
                                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.tipo)}`}>
                                                {notification.tipo}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {notification.categoria}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.estado)}`}>
                                            {notification.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(notification.prioridad)}`}>
                                            {notification.prioridad}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(notification.fechaCreacion).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewNotification(notification)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Ver detalles"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                            {notification.estado !== 'LEIDA' && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Marcar como leída"
                                                >
                                                    <CheckIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notification Details Modal */}
            {showModal && selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Detalles de la Notificación
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
                                <label className="text-sm font-medium text-gray-500">Título</label>
                                <p className="text-sm text-gray-900">{selectedNotification.titulo}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Mensaje</label>
                                <p className="text-sm text-gray-900">{selectedNotification.mensaje}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Usuario</label>
                                    <p className="text-sm text-gray-900">{selectedNotification.usuario || 'Todos (Global)'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Categoría</label>
                                    <p className="text-sm text-gray-900">{selectedNotification.categoria}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tipo</label>
                                    <div className="flex items-center mt-1">
                                        {getTypeIcon(selectedNotification.tipo)}
                                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedNotification.tipo)}`}>
                                            {selectedNotification.tipo}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Prioridad</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(selectedNotification.prioridad)} mt-1`}>
                                        {selectedNotification.prioridad}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Estado</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedNotification.estado)} mt-1`}>
                                    {selectedNotification.estado}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(selectedNotification.fechaCreacion).toLocaleString()}
                                    </p>
                                </div>
                                {selectedNotification.fechaEnvio && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Fecha de Envío</label>
                                        <p className="text-sm text-gray-900">
                                            {new Date(selectedNotification.fechaEnvio).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {selectedNotification.fechaLectura && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Fecha de Lectura</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(selectedNotification.fechaLectura).toLocaleString()}
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

            {/* Create Notification Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Nueva Notificación
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
                                <label className="block text-sm font-medium text-gray-700">Título</label>
                                <input type="text" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                                <textarea rows={3} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                    <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="INFO">Información</option>
                                        <option value="SUCCESS">Éxito</option>
                                        <option value="WARNING">Advertencia</option>
                                        <option value="ERROR">Error</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                    <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="SISTEMA">Sistema</option>
                                        <option value="APUESTAS">Apuestas</option>
                                        <option value="CRYPTO">Crypto</option>
                                        <option value="USUARIO">Usuario</option>
                                        <option value="EVENTO">Evento</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                                    <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="BAJA">Baja</option>
                                        <option value="MEDIA">Media</option>
                                        <option value="ALTA">Alta</option>
                                        <option value="CRITICA">Crítica</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Usuario (opcional)</label>
                                    <input type="text" placeholder="Dejar vacío para envío global" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label className="ml-2 block text-sm text-gray-900">
                                    Enviar inmediatamente
                                </label>
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
                                Crear Notificación
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotificaciones;
