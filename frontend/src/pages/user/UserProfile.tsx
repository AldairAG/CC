import { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import EditProfile from '../../components/user/EditProfile';
import ChangePassword from '../../components/user/ChangePassword';
import TwoFactorAuth from '../../components/user/TwoFactorAuth';
import DocumentUploadComponent from '../../components/user/DocumentUpload';
import GameHistory from '../../components/user/GameHistory';
import TechnicalSupport from '../../components/user/TechnicalSupport';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, loading, error, clearError } = useUserProfile();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const tabs = [
        { id: 'profile', label: 'Editar Perfil', icon: '👤' },
        { id: 'password', label: 'Cambiar Contraseña', icon: '🔒' },
        { id: 'tsv', label: 'Autenticación 2FA', icon: '🔐' },
        { id: 'documents', label: 'Documentos', icon: '📄' },
        { id: 'history', label: 'Historial de Juego', icon: '📊' },
        { id: 'support', label: 'Soporte Técnico', icon: '🎧' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <EditProfile />;
            case 'password':
                return <ChangePassword />;
            case 'tsv':
                return <TwoFactorAuth />;
            case 'documents':
                return <DocumentUploadComponent />;
            case 'history':
                return <GameHistory />;
            case 'support':
                return <TechnicalSupport />;
            default:
                return <EditProfile />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Bienvenido, {user?.username || 'Usuario'}
                            </h1>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-sm text-green-600 font-semibold">
                                Saldo: ${user?.saldo?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="text-red-400">⚠️</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={clearError}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="mr-3 text-lg">{tab.icon}</span>
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {loading && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <span className="ml-2 text-gray-600">Cargando...</span>
                                </div>
                            )}
                            {!loading && renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;