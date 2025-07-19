import React, { useState, useEffect } from 'react';
import {
    XMarkIcon,
    UserIcon,
    EnvelopeIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import type { UserEditModalProps, UserEditData, UserFormErrors } from '../../types/UserModalTypes';
import { validateUserForm } from '../../types/UserModalTypes';

const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState<UserEditData>({
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
    const [activeTab, setActiveTab] = useState<'basic' | 'account' | 'activity'>('basic');

    // Roles disponibles (esto debería venir de un endpoint)
    const availableRoles = ['USER', 'ADMIN', 'MODERATOR', 'BETTOR', 'VIP'];

    useEffect(() => {
        if (user) {
            setFormData(user);
            setErrors({});
        }
    }, [user]);

    const handleInputChange = (field: keyof UserEditData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field as keyof UserFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleRoleToggle = (role: string) => {
        setFormData(prev => ({
            ...prev,
            roles: prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar formulario
        const validationErrors = validateUserForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error: any) {
            setErrors({
                general: error.message || 'Error al guardar los cambios'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Editar Usuario
                        </h2>
                        <p className="text-sm text-gray-500">
                            Modificar información de {user.username}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('basic')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'basic'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Datos Básicos
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'account'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Configuración
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'activity'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Actividad
                        </button>
                    </nav>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Error general */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700">{errors.general}</span>
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
                                            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.email ? 'border-red-300' : 'border-gray-300'
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
                                        className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.username ? 'border-red-300' : 'border-gray-300'
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
                                        className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.nombres ? 'border-red-300' : 'border-gray-300'
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
                                        className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.apellidos ? 'border-red-300' : 'border-gray-300'
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
                                            className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.telefono ? 'border-red-300' : 'border-gray-300'
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
                                            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.fechaNacimiento ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.fechaNacimiento && (
                                        <p className="mt-1 text-sm text-red-600">{errors.fechaNacimiento}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Configuración de Cuenta */}
                    {activeTab === 'account' && (
                        <div className="space-y-4">
                            <div className="flex items-center mb-4">
                                <ShieldCheckIcon className="h-5 w-5 text-gray-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">
                                    Configuración de Cuenta
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.saldoUsuario ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.saldoUsuario && (
                                        <p className="mt-1 text-sm text-red-600">{errors.saldoUsuario}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Roles del Usuario
                                </label>
                                <div className="space-y-2">
                                    {availableRoles.map(role => (
                                        <label key={role} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.roles.includes(role)}
                                                onChange={() => handleRoleToggle(role)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

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
                    )}

                    {/* Actividad */}
                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Información de Solo Lectura
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">
                                    Esta información no se puede editar desde este formulario.
                                    Para obtener detalles completos, utilice la vista de solo lectura.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;
