import React, { useEffect, useState } from 'react';
import {
    UserIcon,
    PencilIcon,
    UserPlusIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useAdmin } from '../../hooks/useAdmin';
import UserEditTab from './UserEditTab';
import UserCreateModal from '../modals/UserCreateModal';
import type { CreateUserRequest } from '../../types/AdminTypes';
import UserViewTab from './UserViewTab';

type TabType = 'view' | 'edit' | 'create';

const UserManagementTabs: React.FC = () => {
    const { selectedUser, selectUser, handleCreateUser: createUserAction } = useAdmin();
    const [activeTab, setActiveTab] = useState<TabType>('view');
    const [createModalOpen, setCreateModalOpen] = useState(false);

    useEffect(()=>{

    },[])

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
    };

    const handleBackToList = () => {
        selectUser(null);
    };

    const handleCreateUser = () => {
        setCreateModalOpen(true);
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

    if (!selectedUser) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <UserIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">No hay usuario seleccionado</p>
                    <p className="text-gray-400 text-sm">Selecciona un usuario de la lista para ver sus detalles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 h-full">
            {/* Header con navegación */}
            <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleBackToList}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            Volver a la lista
                        </button>
                        <div className="h-6 border-l border-gray-300" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {selectedUser.username}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {selectedUser.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleCreateUser}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <UserPlusIcon className="h-4 w-4 mr-2" />
                        Nuevo Usuario
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    <button
                        onClick={() => handleTabChange('view')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                            activeTab === 'view'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <UserIcon className="h-4 w-4 mr-2" />
                        Ver Detalles
                    </button>
                    <button
                        onClick={() => handleTabChange('edit')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                            activeTab === 'edit'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Editar Usuario
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="h-full">
                 {activeTab === 'view' && <UserViewTab />} 
                {activeTab === 'edit' && <UserEditTab />}
            </div>

            {/* Modal para crear usuario */}
            <UserCreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSave={handleSaveNewUser}
            />
        </div>
    );
};

export default UserManagementTabs;
