import { useEffect, useState } from 'react';
import {
    UserGroupIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { useUser } from '../../hooks/useUser';
import { useUserProfile } from '../../hooks/useUserProfile';

interface Usuario {
    id: number;
    nombre: string;
    email: string;
    fechaRegistro: string;
    estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
    quinielasCreadas: number;
    quinielasParticipadas: number;
    saldoTotal: number;
}

const AdminUsers = () => {
    const { user } = useUser();
    const { userProfile } = useUserProfile();
    
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    // Datos de ejemplo - en producción vendrían del backend
    const usuariosEjemplo: Usuario[] = [
        {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan.perez@email.com',
            fechaRegistro: '2024-01-15',
            estado: 'ACTIVO',
            quinielasCreadas: 5,
            quinielasParticipadas: 12,
            saldoTotal: 250.50
        },
        {
            id: 2,
            nombre: 'María García',
            email: 'maria.garcia@email.com',
            fechaRegistro: '2024-02-20',
            estado: 'ACTIVO',
            quinielasCreadas: 2,
            quinielasParticipadas: 8,
            saldoTotal: 125.75
        },
        {
            id: 3,
            nombre: 'Carlos López',
            email: 'carlos.lopez@email.com',
            fechaRegistro: '2024-03-10',
            estado: 'SUSPENDIDO',
            quinielasCreadas: 0,
            quinielasParticipadas: 3,
            saldoTotal: 0.00
        },
        {
            id: 4,
            nombre: 'Ana Martínez',
            email: 'ana.martinez@email.com',
            fechaRegistro: '2024-04-05',
            estado: 'ACTIVO',
            quinielasCreadas: 8,
            quinielasParticipadas: 15,
            saldoTotal: 450.25
        },
        {
            id: 5,
            nombre: 'Luis Rodríguez',
            email: 'luis.rodriguez@email.com',
            fechaRegistro: '2024-05-12',
            estado: 'INACTIVO',
            quinielasCreadas: 1,
            quinielasParticipadas: 2,
            saldoTotal: 50.00
        }
    ];

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                setLoading(true);
                // Simular carga de datos
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUsuarios(usuariosEjemplo);
            } catch (error) {
                console.error('Error cargando usuarios:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarUsuarios();
    }, []);

    const usuariosFiltrados = usuarios.filter(usuario => {
        const coincideNombre = usuario.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) ||
                              usuario.email.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideEstado = filtroEstado === '' || usuario.estado === filtroEstado;
        
        return coincideNombre && coincideEstado;
    });

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'ACTIVO':
                return 'bg-green-100 text-green-800';
            case 'INACTIVO':
                return 'bg-gray-100 text-gray-800';
            case 'SUSPENDIDO':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleVerUsuario = (usuario: Usuario) => {
        setUsuarioSeleccionado(usuario);
        setModalAbierto(true);
    };

    const handleCambiarEstado = (id: number, nuevoEstado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO') => {
        setUsuarios(prev => prev.map(usuario => 
            usuario.id === id ? { ...usuario, estado: nuevoEstado } : usuario
        ));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">👥 Gestión de Usuarios</h1>
                    <p className="text-gray-600">Administra todos los usuarios del casino</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                    <PlusIcon className="h-5 w-5" />
                    Nuevo Usuario
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <UserGroupIcon className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Usuarios</p>
                            <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Usuarios Activos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {usuarios.filter(u => u.estado === 'ACTIVO').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">S</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Suspendidos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {usuarios.filter(u => u.estado === 'SUSPENDIDO').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">$</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Saldo Total</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${usuarios.reduce((sum, u) => sum + u.saldoTotal, 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar por nombre o email
                        </label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrar por estado
                        </label>
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los estados</option>
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                            <option value="SUSPENDIDO">Suspendido</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={() => {
                                setFiltroNombre('');
                                setFiltroEstado('');
                            }}
                            className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Lista de Usuarios ({usuariosFiltrados.length})
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
                                    Registro
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actividad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Saldo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {usuariosFiltrados.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {usuario.nombre}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {usuario.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getEstadoColor(usuario.estado)}`}>
                                            {usuario.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div>
                                            <div>Creadas: {usuario.quinielasCreadas}</div>
                                            <div>Participadas: {usuario.quinielasParticipadas}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${usuario.saldoTotal.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleVerUsuario(usuario)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Ver detalles"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                title="Editar"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            {usuario.estado !== 'SUSPENDIDO' && (
                                                <button
                                                    onClick={() => handleCambiarEstado(usuario.id, 'SUSPENDIDO')}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Suspender"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                            {usuario.estado === 'SUSPENDIDO' && (
                                                <button
                                                    onClick={() => handleCambiarEstado(usuario.id, 'ACTIVO')}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Reactivar"
                                                >
                                                    ✓
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

            {/* Modal de Detalles del Usuario */}
            {modalAbierto && usuarioSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Detalles de Usuario
                            </h3>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Nombre</label>
                                    <p className="text-gray-900">{usuarioSeleccionado.nombre}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <p className="text-gray-900">{usuarioSeleccionado.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Estado</label>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getEstadoColor(usuarioSeleccionado.estado)}`}>
                                        {usuarioSeleccionado.estado}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Saldo Total</label>
                                    <p className="text-gray-900 font-semibold">${usuarioSeleccionado.saldoTotal.toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Quinielas Creadas</label>
                                    <p className="text-gray-900">{usuarioSeleccionado.quinielasCreadas}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Quinielas Participadas</label>
                                    <p className="text-gray-900">{usuarioSeleccionado.quinielasParticipadas}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setModalAbierto(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Cerrar
                            </button>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                                Editar Usuario
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
