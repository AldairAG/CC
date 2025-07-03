import { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { ProfileProvider } from '../../contexts/ProfileContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/navigation/Tabs';
import EditProfile from '../../features/user/EditProfile';
import ChangePassword from '../../features/user/ChangePassword';
import TwoFactorAuth from '../../features/user/TwoFactorAuth';
import DocumentUploadComponent from '../../features/user/DocumentUpload';
import GameHistory from '../../features/user/GameHistory';
import TechnicalSupport from '../../features/user/TechnicalSupport';
import CryptoToFiatConverter from '../../components/crypto/CryptoToFiatConverter';

const tabs = [
    { id: 'profile', label: 'Editar Perfil', icon: '👤' },
    { id: 'wallet', label: 'Billetera', icon: '💰' },
    { id: 'password', label: 'Cambiar Contraseña', icon: '🔒' },
    { id: 'tsv', label: 'Autenticación 2FA', icon: '🔐' },
    { id: 'documents', label: 'Documentos', icon: '📄' },
    { id: 'history', label: 'Historial de Juego', icon: '📊' },
    { id: 'support', label: 'Soporte Técnico', icon: '🎧' }
];


const UserProfile = () => {
    const profileData = useUserProfile();

    return (
        <ProfileProvider value={profileData}>
            <UserProfileContent />
        </ProfileProvider>
    );
};

const UserProfileContent = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const {
        user,
        loading,
        error,
        documents,
        supportTickets,
        statistics,
        getUserProfile,
        clearError
    } = useUserProfile();

    // Load initial data when component mounts
    useEffect(() => {
        const loadInitialData = async () => {
            if (user?.idUsuario) {
                try {
                    await getUserProfile(Number(user.idUsuario));
                    console.log('Loading initial profile data for user:', user.idUsuario);
                } catch (error) {
                    console.error('Error loading initial profile data:', error);
                }
            }
        };

        loadInitialData();
    }, [user?.idUsuario, getUserProfile]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    // Get statistics summary for header
    const getStatsDisplay = () => {
        if (!statistics) return null;

        return (
            <div className="flex space-x-4 text-sm">
                <span className="text-gray-600">
                    Apuestas: <span className="font-semibold text-gray-900">{statistics.totalApuestas}</span>
                </span>
                <span className="text-gray-600">
                    Ganancias: <span className="font-semibold text-green-600">
                        ${statistics.totalGanancias.toLocaleString()}
                    </span>
                </span>
            </div>
        );
    };

    // Get notification count for tabs
    const getNotificationCount = (tabId: string) => {
        switch (tabId) {
            case 'support':
                return supportTickets.filter(ticket => ticket.estado === 'ABIERTO').length;
            case 'documents':
                return documents.filter(doc => doc.estado === 'PENDIENTE').length;
            default: return 0;
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
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Bienvenido, {user?.username || 'Usuario'}
                            </h1>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-sm text-green-600 font-semibold">
                                Saldo: ${user?.saldo?.toLocaleString() || '0'}
                            </p>
                            {getStatsDisplay()}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('wallet')}
                                className="px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            >
                                💰 Billetera
                            </button>
                            <button
                                onClick={() => setActiveTab('documents')}
                                className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                📄 Documentos
                                {getNotificationCount('documents') > 0 && (
                                    <span className="ml-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                        {getNotificationCount('documents')}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('support')}
                                className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                🎧 Soporte
                                {getNotificationCount('support') > 0 && (
                                    <span className="ml-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                        {getNotificationCount('support')}
                                    </span>
                                )}
                            </button>
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
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {/* You could add a success state here if needed */}
                {/* Main Tabs Section */}
                <div className="bg-white rounded-lg shadow-sm">
                    <Tabs defaultValue="profile" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <TabsList className="p-6 border-b flex flex-wrap gap-2 border-none mb-0">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="flex items-center px-4 py-3 rounded-lg transition-colors border-none relative"
                                    activeClassName="bg-blue-50 text-blue-700 font-semibold border-none"
                                    inactiveClassName="text-gray-600 hover:bg-gray-50 border-none"
                                >
                                    <span className="mr-2 text-lg">{tab.icon}</span>
                                    <span>{tab.label}</span>

                                    {/* Notification badge */}
                                    {getNotificationCount(tab.id) > 0 && (
                                        <span className="absolute -top-1 -right-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                            {getNotificationCount(tab.id)}
                                        </span>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Tab Contents */}
                        <div className="p-6">
                            {loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                        <p className="mt-4 text-gray-600">Cargando información del perfil...</p>
                                    </div>
                                </div>
                            )}

                            {!loading && (
                                <>
                                    <TabsContent value="profile" className="mt-0">
                                        <EditProfile />
                                    </TabsContent>

                                    <TabsContent value="wallet" className="mt-0">
                                        <div className="space-y-6">
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Gestión de Billetera</h3>
                                                <p className="text-gray-600 mb-4">
                                                    Convierte tus criptomonedas a saldo del casino para empezar a jugar.
                                                </p>
                                                <div className="bg-white rounded-lg p-1">
                                                    <CryptoToFiatConverter />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="password" className="mt-0">
                                        <ChangePassword />
                                    </TabsContent>

                                    <TabsContent value="tsv" className="mt-0">
                                        <TwoFactorAuth />
                                    </TabsContent>

                                    <TabsContent value="documents" className="mt-0">
                                        <DocumentUploadComponent />
                                    </TabsContent>

                                    <TabsContent value="history" className="mt-0">
                                        <GameHistory />
                                    </TabsContent>

                                    <TabsContent value="support" className="mt-0">
                                        <TechnicalSupport />
                                    </TabsContent>
                                </>
                            )}
                        </div>
                    </Tabs>
                </div>
                
            </div>
        </div>
    );
};

export default UserProfile;