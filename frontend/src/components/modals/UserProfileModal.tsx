import React, { useState, useCallback } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import type { UserProfileUpdate } from '../../types/UserProfileTypes';

interface UserProfileModalProps {
    userId: number;
    isOpen: boolean;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, isOpen, onClose }) => {
    const { getUserProfile, loading, error } = useUserProfile();
    const [profile, setProfile] = useState<UserProfileUpdate | null>(null);

    const loadProfile = useCallback(async () => {
        const profileData = await getUserProfile(userId);
        setProfile(profileData);
    }, [getUserProfile, userId]);

    React.useEffect(() => {
        if (isOpen && userId) {
            loadProfile();
        }
    }, [isOpen, userId, loadProfile]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Perfil de Usuario</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2">Cargando perfil...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {profile && !loading && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {profile.nombres?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    {profile.nombres} {profile.apellidos}
                                </h3>
                                <p className="text-gray-600 text-sm">{profile.email}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Teléfono:</span>
                                    <p className="font-medium">{profile.telefono || 'No especificado'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Fecha de Nacimiento:</span>
                                    <p className="font-medium">
                                        {profile.fechaNacimiento 
                                            ? new Date(profile.fechaNacimiento).toLocaleDateString() 
                                            : 'No especificado'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={loadProfile}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileModal;
