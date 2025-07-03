import { useState } from 'react';
import {
    UserIcon,
    ShieldCheckIcon,
    KeyIcon,
    UserPlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    userCount: number;
    createdAt: string;
    isDefault: boolean;
}

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'suspended';
    lastLogin: string;
    createdAt: string;
}

// Datos mock
const mockRoles: Role[] = [
    {
        id: '1',
        name: 'Super Admin',
        description: 'Acceso completo al sistema',
        permissions: ['users.read', 'users.write', 'users.delete', 'bets.read', 'bets.write', 'config.write'],
        userCount: 2,
        createdAt: '2024-01-01',
        isDefault: false
    },
    {
        id: '2',
        name: 'Admin',
        description: 'Administrador con permisos limitados',
        permissions: ['users.read', 'users.write', 'bets.read', 'bets.write'],
        userCount: 5,
        createdAt: '2024-01-01',
        isDefault: true
    },
    {
        id: '3',
        name: 'Moderador',
        description: 'Moderación de contenido y usuarios',
        permissions: ['users.read', 'bets.read', 'notifications.write'],
        userCount: 12,
        createdAt: '2024-01-01',
        isDefault: false
    },
    {
        id: '4',
        name: 'Soporte',
        description: 'Atención al cliente y soporte técnico',
        permissions: ['users.read', 'tickets.read', 'tickets.write'],
        userCount: 8,
        createdAt: '2024-01-01',
        isDefault: false
    }
];

const mockAdminUsers: AdminUser[] = [
    {
        id: '1',
        name: 'Carlos Rodriguez',
        email: 'carlos@casino.com',
        role: 'Super Admin',
        status: 'active',
        lastLogin: '2024-01-15 14:30',
        createdAt: '2024-01-01'
    },
    {
        id: '2',
        name: 'Ana Martinez',
        email: 'ana@casino.com',
        role: 'Admin',
        status: 'active',
        lastLogin: '2024-01-15 12:15',
        createdAt: '2024-01-05'
    },
    {
        id: '3',
        name: 'Luis Garcia',
        email: 'luis@casino.com',
        role: 'Moderador',
        status: 'inactive',
        lastLogin: '2024-01-14 09:45',
        createdAt: '2024-01-10'
    }
];

const AdminRoles = () => {
    const [activeTab, setActiveTab] = useState<'roles' | 'admins'>('roles');
    const [roles] = useState<Role[]>(mockRoles);
    const [adminUsers] = useState<AdminUser[]>(mockAdminUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAdmins = adminUsers.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            suspended: 'bg-red-100 text-red-800'
        };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Roles y Permisos</h1>
                    <p className="text-gray-600">Gestiona roles, permisos y administradores</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <UserPlusIcon className="h-5 w-5" />
                    {activeTab === 'roles' ? 'Nuevo Rol' : 'Nuevo Admin'}
                </button>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Roles</p>
                            <p className="text-3xl font-bold text-gray-900">{roles.length}</p>
                        </div>
                        <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Administradores</p>
                            <p className="text-3xl font-bold text-gray-900">{adminUsers.length}</p>
                        </div>
                        <UserIcon className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Activos</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {adminUsers.filter(u => u.status === 'active').length}
                            </p>
                        </div>
                        <UserIcon className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Permisos Únicos</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {new Set(roles.flatMap(r => r.permissions)).size}
                            </p>
                        </div>
                        <KeyIcon className="h-8 w-8 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('roles')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'roles'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheckIcon className="h-5 w-5" />
                                Roles ({roles.length})
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('admins')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'admins'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                Administradores ({adminUsers.length})
                            </div>
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {/* Búsqueda */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder={`Buscar ${activeTab === 'roles' ? 'roles' : 'administradores'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                    </div>

                    {/* Contenido de Roles */}
                    {activeTab === 'roles' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRoles.map((role) => (
                                <div key={role.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                    {role.name}
                                                    {role.isDefault && (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                            Por defecto
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-600">{role.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Usuarios: {role.userCount}</p>
                                        </div>
                                        
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-2">Permisos:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions.slice(0, 3).map((permission) => (
                                                    <span
                                                        key={permission}
                                                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                                    >
                                                        {permission}
                                                    </span>
                                                ))}
                                                {role.permissions.length > 3 && (
                                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                        +{role.permissions.length - 3} más
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                                            <button className="flex-1 text-blue-600 hover:text-blue-900 text-sm flex items-center justify-center gap-1">
                                                <EyeIcon className="h-4 w-4" />
                                                Ver
                                            </button>
                                            <button className="flex-1 text-green-600 hover:text-green-900 text-sm flex items-center justify-center gap-1">
                                                <PencilIcon className="h-4 w-4" />
                                                Editar
                                            </button>
                                            {!role.isDefault && (
                                                <button className="flex-1 text-red-600 hover:text-red-900 text-sm flex items-center justify-center gap-1">
                                                    <TrashIcon className="h-4 w-4" />
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Contenido de Administradores */}
                    {activeTab === 'admins' && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Rol</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Último Acceso</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha Creación</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredAdmins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-100 p-2 rounded-full">
                                                        <UserIcon className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{admin.name}</div>
                                                        <div className="text-sm text-gray-600">{admin.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                {getStatusBadge(admin.status)}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-900">
                                                {admin.lastLogin}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-900">
                                                {admin.createdAt}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <button className="text-blue-600 hover:text-blue-900 text-sm">
                                                        Editar
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900 text-sm">
                                                        Suspender
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal placeholder */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {activeTab === 'roles' ? 'Nuevo Rol' : 'Nuevo Administrador'}
                        </h3>
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

export default AdminRoles;
