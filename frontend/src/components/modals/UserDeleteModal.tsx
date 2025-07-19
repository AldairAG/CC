import React, { useState } from 'react';
import {
    XMarkIcon,
    ExclamationTriangleIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import type { UserDeleteModalProps } from '../../types/UserModalTypes';

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ isOpen, onClose, user, onConfirm }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleDelete = async () => {
        if (!user) return;
        
        setIsDeleting(true);
        try {
            await onConfirm(user.idUsuario);
            onClose();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            // El error se manejará en el componente padre
        } finally {
            setIsDeleting(false);
        }
    };

    const isConfirmValid = confirmText.toLowerCase() === 'eliminar';

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-medium text-gray-900">
                                Confirmar Eliminación
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <TrashIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    ¿Estás seguro de que deseas eliminar al usuario <strong>{user.username}</strong>?
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Email: <strong>{user.email}</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-red-800">
                                    Advertencia
                                </h4>
                                <div className="mt-1 text-sm text-red-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Esta acción no se puede deshacer</li>
                                        <li>Se eliminarán todos los datos relacionados</li>
                                        <li>El historial de apuestas se mantendrá para auditoría</li>
                                        <li>Las transacciones financieras se conservarán</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Input */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Para confirmar, escribe "eliminar" en el campo de abajo:
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="eliminar"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={!isConfirmValid || isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar Usuario'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDeleteModal;
