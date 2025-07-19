import React, { useState, useEffect } from 'react';
import {
    UserIcon,
    EnvelopeIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useAdmin } from '../../hooks/useAdmin';
import type { UserFormErrors } from '../../types/UserModalTypes';

interface UserEditFormData {
    idUsuario: number;
    email: string;
    username: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    fechaNacimiento: string;
    lada: string;
    estado: string;
    estadoCuenta: boolean;
    saldoUsuario: number;
    roles: string[];
    autenticacion2FA: boolean;
}

const UserEditTab: React.FC = () => {
    const { selectedUser, handleUpdateUser } = useAdmin();
    const [formData, setFormData] = useState<UserEditFormData>({
        idUsuario: 0,
        email: '',
        username: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        fechaNacimiento: '',
        lada: '',
        estado: 'ACTIVO',
        estadoCuenta: true,
        saldoUsuario: 0,
        roles: [],
        autenticacion2FA: false
    });

    const [errors, setErrors] = useState<UserFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab] = useState<'basic' | 'account' | 'activity'>('basic');
    const [hasChanges, setHasChanges] = useState(false);

    // Roles disponibles
    //const availableRoles = ['USER', 'ADMIN', 'MODERATOR', 'BETTOR', 'VIP'];

    useEffect(() => {
        if (selectedUser) {
            const userData = {
                idUsuario: selectedUser.idUsuario,
                email: selectedUser.email,
                username: selectedUser.username,
                nombres: selectedUser.username, // Placeholder
                apellidos: selectedUser.apellidos, // Placeholder
                telefono: 'selectedUser.telefono', // Placeholder
                fechaNacimiento: selectedUser.fechaNacimiento, // Placeholder
                lada: '+1', // Placeholder
                estado: selectedUser.estado,
                estadoCuenta: selectedUser.activo,
                saldoUsuario: selectedUser.saldoUsuario,
                roles: selectedUser.rol,
                autenticacion2FA: false // Placeholder
            };
            setFormData(userData);
            setErrors({});
            setHasChanges(false);
        }
    }, [selectedUser]);

    const handleInputChange = (field: keyof UserEditFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        setHasChanges(true);

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field as keyof UserFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

/*     const handleRoleToggle = (role: string) => {
        setFormData(prev => ({
            ...prev,
            roles: prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role]
        }));
        setHasChanges(true);
    }; */

    const validateForm = (): UserFormErrors => {
        const validationErrors: UserFormErrors = {};

        // Validaciones básicas
        if (!formData.email) {
            validationErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            validationErrors.email = 'El formato del email no es válido';
        }

        if (!formData.username) {
            validationErrors.username = 'El nombre de usuario es requerido';
        } else if (formData.username.length < 3) {
            validationErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        }

        if (!formData.nombres) {
            validationErrors.nombres = 'Los nombres son requeridos';
        }

        if (!formData.apellidos) {
            validationErrors.apellidos = 'Los apellidos son requeridos';
        }

        if (!formData.telefono) {
            validationErrors.telefono = 'El teléfono es requerido';
        }

        if (!formData.fechaNacimiento) {
            validationErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
        } else {
            const birthDate = new Date(formData.fechaNacimiento);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 18) {
                validationErrors.fechaNacimiento = 'El usuario debe ser mayor de 18 años';
            }
        }

        if (formData.saldoUsuario < 0) {
            validationErrors.saldoUsuario = 'El saldo no puede ser negativo';
        }

        if (formData.roles.length === 0) {
            validationErrors.general = 'Debe seleccionar al menos un rol';
        }

        return validationErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await handleUpdateUser({
                idUsuario: formData.idUsuario,
                email: formData.email,
                username: formData.username,
                saldoUsuario: formData.saldoUsuario,
                rol: formData.roles,
                activo: formData.estadoCuenta
            });
            setHasChanges(false);
            setErrors({});
        } catch (error: any) {
            setErrors({
                general: error.message || 'Error al actualizar usuario'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (selectedUser) {
            const userData = {
                idUsuario: selectedUser.idUsuario,
                email: selectedUser.email,
                username: selectedUser.username,
                nombres: selectedUser.username, // Placeholder
                apellidos: '', // Placeholder
                telefono: '', // Placeholder
                fechaNacimiento: '1990-01-01', // Placeholder
                lada: '+1', // Placeholder
                estado: selectedUser.estado,
                estadoCuenta: selectedUser.activo,
                saldoUsuario: selectedUser.saldoUsuario,
                roles: selectedUser.rol,
                autenticacion2FA: false // Placeholder
            };
            setFormData(userData);
            setErrors({});
            setHasChanges(false);
        }
    };

    if (!selectedUser) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No hay usuario seleccionado para editar</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Editar Usuario
                </h2>
                <p className="text-sm text-gray-500">
                    Modificar información de {selectedUser.username}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error general */}
                {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm text-red-700">{errors.general}</span>
                    </div>
                )}

                {/* Indicador de cambios */}
                {hasChanges && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-700">
                            Hay cambios sin guardar. No olvides guardar los cambios.
                        </p>
                    </div>
                )}

                {/* Datos Básicos */}
                {activeTab === 'basic' && (
                    <div className="space-y-4">
                        <div className="flex items-center mb-4">
                            <UserIcon className="h-5 w-5 text-gray-600 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900">
                                Información Personal
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email *
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="usuario@ejemplo.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre de Usuario *
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.username ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="johndoe"
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombres *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombres}
                                    onChange={(e) => handleInputChange('nombres', e.target.value)}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nombres ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="John"
                                />
                                {errors.nombres && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nombres}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Apellidos *
                                </label>
                                <input
                                    type="text"
                                    value={formData.apellidos}
                                    onChange={(e) => handleInputChange('apellidos', e.target.value)}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.apellidos ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Doe"
                                />
                                {errors.apellidos && (
                                    <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Teléfono *
                                </label>
                                <div className="mt-1 flex">
                                    <input
                                        type="text"
                                        value={formData.lada}
                                        onChange={(e) => handleInputChange('lada', e.target.value)}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="+1"
                                    />
                                    <input
                                        type="text"
                                        value={formData.telefono}
                                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                                        className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.telefono ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="1234567890"
                                    />
                                </div>
                                {errors.telefono && (
                                    <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Fecha de Nacimiento *
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        value={formData.fechaNacimiento}
                                        onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.fechaNacimiento ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                {errors.fechaNacimiento && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fechaNacimiento}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Estado de la Cuenta
                                </label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => handleInputChange('estado', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="ACTIVO">Activo</option>
                                    <option value="INACTIVO">Inactivo</option>
                                    <option value="SUSPENDIDO">Suspendido</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Saldo de Usuario
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.saldoUsuario}
                                        onChange={(e) => handleInputChange('saldoUsuario', parseFloat(e.target.value) || 0)}
                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.saldoUsuario ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.saldoUsuario && (
                                    <p className="mt-1 text-sm text-red-600">{errors.saldoUsuario}</p>
                                )}
                            </div>

                            <div>
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.estadoCuenta}
                                            onChange={(e) => handleInputChange('estadoCuenta', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Cuenta Activa
                                        </span>
                                    </label>
                                </div>

                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.autenticacion2FA}
                                            onChange={(e) => handleInputChange('autenticacion2FA', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Autenticación 2FA Activada
                                        </span>
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        <XMarkIcon className="h-4 w-4 inline mr-1" />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || !hasChanges}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckIcon className="h-4 w-4 inline mr-1" />
                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserEditTab;
