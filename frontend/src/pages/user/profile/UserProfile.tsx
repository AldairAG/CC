import { useState, useEffect } from 'react';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { ProfileProvider } from '../../../contexts/ProfileContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/navigation/Tabs';
import EditProfile from '../../../features/user/EditProfile';
import ChangePassword from '../../../features/user/ChangePassword';
import TwoFactorAuth from '../../../features/user/TwoFactorAuth';
import DocumentUploadComponent from '../../../features/user/DocumentUpload';
import GameHistory from '../../../features/user/GameHistory';
import TechnicalSupport from '../../../features/user/TechnicalSupport';
import CryptoToFiatConverter from '../../../components/crypto/CryptoToFiatConverter';

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total Apuestas</p>
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                                {statistics.totalApuestas}
                            </p>
                        </div>
                        <div className="text-2xl">🎯</div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total Ganancias</p>
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                ${statistics.totalGanancias.toLocaleString()}
                            </p>
                        </div>
                        <div className="text-2xl">💰</div>
                    </div>
                </div>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-50 rounded-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-2xl font-black">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800"></div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 mb-2">
                                Bienvenido, {user?.username || 'Usuario'}
                            </h1>
                            <p className="text-slate-300 font-medium text-lg mb-2">{user?.email}</p>
                            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-4">
                                Saldo: ${user?.saldo?.toLocaleString() || '0'}
                            </p>
                            {getStatsDisplay()}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setActiveTab('wallet')}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-500/30"
                            >
                                💰 Billetera
                            </button>
                            <button
                                onClick={() => setActiveTab('documents')}
                                className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-500/30"
                            >
                                📄 Documentos
                                {getNotificationCount('documents') > 0 && (
                                    <span className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full shadow-lg">
                                        {getNotificationCount('documents')}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('support')}
                                className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-purple-500/30"
                            >
                                🎧 Soporte
                                {getNotificationCount('support') > 0 && (
                                    <span className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full shadow-lg">
                                        {getNotificationCount('support')}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="relative bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 mb-6 shadow-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-red-400 text-xl">⚠️</span>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-red-300 font-medium">{error}</p>
                            </div>
                            <div className="ml-auto">
                                <button
                                    onClick={clearError}
                                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                                >
                                    <span className="text-xl">✕</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Tabs Section */}
                <div className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-30"></div>
                    
                    <Tabs defaultValue="profile" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <TabsList className="relative z-10 p-6 border-b border-slate-700/50 flex flex-wrap gap-2 mb-0">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="relative flex items-center px-6 py-4 rounded-xl font-bold transition-all duration-300 border-none transform hover:scale-105 active:scale-95"
                                    activeClassName="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg border border-amber-500/30"
                                    inactiveClassName="bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-slate-300 hover:text-white border border-slate-600/30 hover:border-amber-500/30"
                                >
                                    <span className="mr-2 text-xl">{tab.icon}</span>
                                    <span className="font-bold">{tab.label}</span>

                                    {/* Notification badge */}
                                    {getNotificationCount(tab.id) > 0 && (
                                        <span className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full shadow-lg font-bold">
                                            {getNotificationCount(tab.id)}
                                        </span>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Tab Contents */}
                        <div className="relative z-10 p-6">
                            {loading && (
                                <div className="flex items-center justify-center py-16">
                                    <div className="text-center bg-slate-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-amber-500/30 max-w-md w-full">
                                        <div className="relative mb-6">
                                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/20 border-t-amber-500 mx-auto"></div>
                                            <div className="rounded-full h-16 w-16 border-4 border-transparent border-t-orange-500 animate-spin mx-auto" style={{
                                                position: 'absolute',
                                                inset: '0',
                                                animationDelay: '0.5s',
                                                animationDuration: '1.5s'
                                            }}></div>
                                        </div>
                                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
                                            Cargando perfil
                                        </h3>
                                        <p className="text-slate-300 font-medium">Obteniendo información del usuario...</p>
                                        <div className="mt-4 flex justify-center space-x-1">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!loading && (
                                <>
                                    <TabsContent value="profile" className="mt-0">
                                        <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-6">
                                            <EditProfile />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="wallet" className="mt-0">
                                        <div className="space-y-6">
                                            <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-6 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-50"></div>
                                                <div className="relative z-10">
                                                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-4">
                                                        💰 Gestión de Billetera
                                                    </h3>
                                                    <p className="text-slate-300 font-medium mb-6">
                                                        Convierte tus criptomonedas a saldo del casino para empezar a jugar.
                                                    </p>
                                                    <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30">
                                                        <CryptoToFiatConverter />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="password" className="mt-0">
                                        <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-6">
                                            <ChangePassword />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="tsv" className="mt-0">
                                        <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-6">
                                            <TwoFactorAuth />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="documents" className="mt-0">
                                        <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-6">
                                            <DocumentUploadComponent />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="history" className="mt-0">
                                        <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-6">
                                            <GameHistory />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="support" className="mt-0">
                                        <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-600/30 p-6">
                                            <TechnicalSupport />
                                        </div>
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