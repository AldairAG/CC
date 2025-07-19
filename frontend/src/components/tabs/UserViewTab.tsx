import React, { useEffect, useState } from 'react';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    TicketIcon
} from '@heroicons/react/24/outline';
import { useAdmin } from '../../hooks/useAdmin';
import { formatCurrency, formatDate } from '../../types/UserModalTypes';

const UserViewTab: React.FC = () => {
    const { selectedUser } = useAdmin();
    const [isLoading,setIsLoading]=useState(true);

    useEffect(()=>{
        if(selectedUser?.idUsuario){
            setIsLoading(false);
        }
    },[selectedUser?.idUsuario])

    if(isLoading)(
        <span>Cargando data...</span>
    )

    if (!selectedUser) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No hay usuario seleccionado</p>
            </div>
        );
    }

    const getStatusBadge = (estado: string) => {
        const styles = {
            'ACTIVO': 'bg-green-100 text-green-800 border-green-200',
            'INACTIVO': 'bg-gray-100 text-gray-800 border-gray-200',
            'SUSPENDIDO': 'bg-red-100 text-red-800 border-red-200'
        };
        return styles[estado as keyof typeof styles] || styles.ACTIVO;
    };

    const getDocumentStatusBadge = (estado: string) => {
        const styles = {
            'VERIFICADO': 'bg-green-100 text-green-800',
            'PENDIENTE': 'bg-yellow-100 text-yellow-800',
            'RECHAZADO': 'bg-red-100 text-red-800'
        };
        return styles[estado as keyof typeof styles] || styles.PENDIENTE;
    };

    return (
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Detalles del Usuario
                </h2>
                <p className="text-sm text-gray-500">
                    Información completa del usuario {selectedUser.username}
                </p>
            </div>

            {/* Información Personal */}
            <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <UserIcon className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Información Personal
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            ID Usuario
                        </label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUser.idUsuario}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <div className="mt-1 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-900">{selectedUser.email}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre de Usuario
                        </label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUser.username}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nombres Completos
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {selectedUser.nombreCompleto} {selectedUser.apellidos}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Teléfono
                        </label>
                        <div className="mt-1 flex items-center">
                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-900">
                                {selectedUser.lada} {selectedUser.telefono}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha de Nacimiento
                        </label>
                        <div className="mt-1 flex items-center">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-900">
                                {formatDate(selectedUser.fechaNacimiento)}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha de Registro
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {formatDate(selectedUser.fechaRegistro)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Información Financiera */}
            <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Información Financiera
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700">
                            Saldo Actual
                        </label>
                        <p className="mt-1 text-2xl font-bold text-blue-600">
                            {formatCurrency(selectedUser.saldoUsuario)}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700">
                            Total Apuestas
                        </label>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {selectedUser.totalApuestas}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700">
                            Ganancias/Pérdidas
                        </label>
                        <p className={`mt-1 text-2xl font-bold ${
                            selectedUser.gananciasPerdidas >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {selectedUser.gananciasPerdidas >= 0 ? '+' : ''}
                            {formatCurrency(selectedUser.gananciasPerdidas)}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700">
                            Transacciones
                        </label>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {selectedUser.transaccionesCrypto}
                        </p>
                    </div>
                </div>
            </div>

            {/* Seguridad y Acceso */}
            <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Seguridad y Acceso
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Estado de la Cuenta
                        </label>
                        <div className="mt-1 flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedUser.estado)}`}>
                                {selectedUser.activo}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                                ({selectedUser.estado ? 'Activa' : 'Inactiva'})
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Roles
                        </label>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {selectedUser.rol}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Autenticación 2FA
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {selectedUser.twoFactorEnabled ? (
                                <span className="text-green-600">Activada</span>
                            ) : (
                                <span className="text-red-600">Desactivada</span>
                            )}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Último Acceso
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                            {selectedUser.ultimaConexion}
                        </p>
                    </div>
                </div>
            </div>

            {/* Documentos de Identidad */}
            <div className="bg-yellow-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <DocumentTextIcon className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Documentos de Identidad
                    </h3>
                </div>
                {selectedUser.documentos.length > 0 ? (
                    <div className="space-y-3">
                        {selectedUser.documentos.map((doc, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900">{doc.tipoDocumento  }</p>
                                    <p className="text-sm text-gray-500">
                                        Subido el {formatDate(doc.fechaSubida)}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusBadge(doc.estado)}`}>
                                    {doc.estado}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">
                        No hay documentos registrados
                    </p>
                )}
            </div>

            {/* Tickets de Soporte */}
            <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <TicketIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Tickets de Soporte
                    </h3>
                </div>
                {(selectedUser.tickets||[]).length > 0 ? (
                    <div className="space-y-3">
                        {selectedUser.tickets.slice(0, 5).map((ticket, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900">#{ticket.id} - {ticket.titulo}</p>
                                    <p className="text-sm text-gray-500">
                                        Creado el {formatDate(ticket.fechaCreacion)}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    ticket.estado === 'RESUELTO' ? 'bg-green-100 text-green-800' :
                                    ticket.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {ticket.estado}
                                </span>
                            </div>
                        ))}
                        {selectedUser.tickets.length > 5 && (
                            <p className="text-sm text-gray-500 text-center">
                                Y {selectedUser.tickets.length - 5} tickets más...
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">
                        No hay tickets de soporte
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserViewTab;
