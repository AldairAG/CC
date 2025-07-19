import { useState } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    UserPlusIcon,
    EyeIcon,
    PencilIcon,
    CheckCircleIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import { useAdmin } from '../../hooks/useAdmin';
import type { AdminUser, CreateUserRequest } from '../../types/AdminTypes';
import UserManagementTabs from '../../components/tabs/UserManagementTabs';
import UserDeleteModal from '../../components/modals/UserDeleteModal';
import UserCreateModal from '../../components/modals/UserCreateModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('TODOS');
    const { 
        users, 
        selectedUser, 
        selectUser, 
        handleDeleteUser: deleteUserAction, 
        handleCreateUser: createUserAction,
        loading 
    } = useAdmin();
    
    // Estados para los modales
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

    // Si hay un usuario seleccionado, mostrar las pestañas
    if (selectedUser) {
        return (
            <div className="h-full">
                <UserManagementTabs />
            </div>
        );
    }

    if (loading) {
        return <LoadingSpinner size="large" text="Cargando usuarios..." />;
    }

    // Handlers para los modales
    const handleCreateUser = () => {
        setCreateModalOpen(true);
    };

    const handleViewUser = (user: AdminUser) => {
        selectUser(user);
    };

    const handleEditUser = (user: AdminUser) => {
        selectUser(user);
    };

    const handleDeleteUser = (user: AdminUser) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleSaveNewUser = async (userData: CreateUserRequest) => {
        try {
            await createUserAction(userData);
            setCreateModalOpen(false);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    };

    const handleConfirmDelete = async (userId: number) => {
        try {
            await deleteUserAction(userId);
            setDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    };

    const closeModals = () => {
        setCreateModalOpen(false);
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const filteredUsers = (users || []).filter(user => {
        const matchesSearch = (user.username || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
            (user.email || "").toLowerCase().includes((searchTerm || "").toLowerCase());
        const matchesFilter = filterStatus === 'TODOS' || user.estado === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (estado: string) => {
        const styles = {
            'ACTIVO': 'bg-green-100 text-green-800 border-green-200',
            'INACTIVO': 'bg-gray-100 text-gray-800 border-gray-200',
            'SUSPENDIDO': 'bg-red-100 text-red-800 border-red-200'
        };
        return styles[estado as keyof typeof styles] || styles.ACTIVO;
    };

    const getStatusIcon = (estado: string) => {
        switch (estado) {
            case 'ACTIVO': return <CheckCircleIcon className="h-4 w-4" />;
            case 'SUSPENDIDO': return <TrashIcon className="h-4 w-4" />;
            default: return <div className="h-4 w-4 rounded-full bg-gray-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                    <p className="text-gray-600 mt-2">Administra usuarios del casino</p>
                </div>
                <button 
                    onClick={handleCreateUser}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <UserPlusIcon className="h-5 w-5 mr-2" />
                    Nuevo Usuario
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar usuario por nombre o email..."
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
                                <option value="ACTIVO">Activos</option>
                                <option value="INACTIVO">Inactivos</option>
                                <option value="SUSPENDIDO">Suspendidos</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Total Usuarios</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{users?.length || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Usuarios Activos</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                        {users?.filter(u => u.estado === 'ACTIVO').length || 0}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Usuarios Suspendidos</h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">
                        {users?.filter(u => u.estado === 'SUSPENDIDO').length || 0}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Saldo Total</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                        ${users?.reduce((sum, u) => sum + u.saldoUsuario, 0).toLocaleString() || 0}
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Lista de Usuarios ({filteredUsers.length})
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
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Saldo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Apuestas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ganancias/Pérdidas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Último Acceso
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.idUsuario} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.username}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(user.estado)}`}>
                                            {getStatusIcon(user.estado)}
                                            <span className="ml-1">{user.estado}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${user.saldoUsuario.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.totalApuestas}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={user.gananciasPerdidas >= 0 ? 'text-green-600' : 'text-red-600'}>
                                            {user.gananciasPerdidas >= 0 ? '+' : ''}${(user.gananciasPerdidas||0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.ultimoAcceso}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => handleViewUser(user)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Ver detalles"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleEditUser(user)}
                                                className="text-green-600 hover:text-green-900"
                                                title="Editar usuario"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Eliminar usuario"
                                            >
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

            {/* Modales */}
            <UserCreateModal
                isOpen={createModalOpen}
                onClose={closeModals}
                onSave={handleSaveNewUser}
            />

            <UserDeleteModal
                isOpen={deleteModalOpen}
                onClose={closeModals}
                user={userToDelete ? {
                    idUsuario: userToDelete.idUsuario,
                    username: userToDelete.username,
                    email: userToDelete.email
                } : null}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default AdminUsers;
