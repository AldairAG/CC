import { useState } from 'react';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/navigation/Tabs';
import EditProfile from '../../../features/user/EditProfile';
import ChangePassword from '../../../features/user/ChangePassword';
import TwoFactorAuth from '../../../features/user/TwoFactorAuth';
import DocumentUploadComponent from '../../../features/user/DocumentUpload';
import GameHistory from '../../../features/user/GameHistory';
import TechnicalSupport from '../../../features/user/TechnicalSupport';

const tabs = [
    { id: 'profile', label: 'Editar Perfil', icon: '👤' },
    /* { id: 'wallet', label: 'Billetera', icon: '💰' }, */
    { id: 'password', label: 'Cambiar Contraseña', icon: '🔒' },
    { id: 'tsv', label: 'Autenticación 2FA', icon: '🔐' },
    { id: 'documents', label: 'Documentos', icon: '📄' },
    { id: 'history', label: 'Historial de Juego', icon: '📊' },
    { id: 'support', label: 'Soporte Técnico', icon: '🎧' }
];

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const {
        user,
        fetchingProfile:loading,
        error,
        documents,
        supportTickets,
        statistics,
        perfilCompleto,
        clearError
    } = useUserProfile();

    // Get statistics summary for header
    const getStatsDisplay = () => {
        if (!statistics) return null;

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/40 hover:border-amber-400/60 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-300/80 text-sm font-semibold tracking-wide uppercase">Total Apuestas</p>
                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mt-2">
                                    {statistics.totalApuestas}
                                </p>
                            </div>
                            <div className="text-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">🎯</div>
                        </div>
                        <div className="mt-4 h-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full">
                            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-3/4"></div>
                        </div>
                    </div>
                </div>

                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/40 hover:border-green-400/60 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-300/80 text-sm font-semibold tracking-wide uppercase">Total Ganancias</p>
                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400 mt-2">
                                    ${statistics.totalGanancias.toLocaleString()}
                                </p>
                            </div>
                            <div className="text-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">💰</div>
                        </div>
                        <div className="mt-4 h-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-4/5"></div>
                        </div>
                    </div>
                </div>

                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/40 hover:border-blue-400/60 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-300/80 text-sm font-semibold tracking-wide uppercase">Nivel</p>
                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400 mt-2">
                                    VIP
                                </p>
                            </div>
                            <div className="text-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">⭐</div>
                        </div>
                        <div className="mt-4 h-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-2/3"></div>
                        </div>
                    </div>
                </div>

                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/40 hover:border-purple-400/60 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-300/80 text-sm font-semibold tracking-wide uppercase">Racha Actual</p>
                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400 mt-2">
                                    5
                                </p>
                            </div>
                            <div className="text-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">�</div>
                        </div>
                        <div className="mt-4 h-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-1/2"></div>
                        </div>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden relative">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-orange-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-slate-500/2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Enhanced Header */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-700/90 to-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-600/50 hover:border-amber-500/40 transition-all duration-500 overflow-hidden">
                        {/* Floating orbs */}
                        <div className="absolute top-6 right-6 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>
                        <div className="absolute top-10 right-10 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-60"></div>

                        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center gap-8">
                            {/* Enhanced Avatar */}
                            <div className="relative group/avatar">
                                <div className="absolute -inset-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full blur opacity-50 group-hover/avatar:opacity-75 transition duration-300"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-amber-500/20 hover:ring-amber-500/40 transition-all duration-300">
                                    <span className="text-white text-3xl font-black">
                                        {perfilCompleto?.username?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {/* Enhanced User Info */}
                            <div className="flex-1 min-w-0 space-y-4">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 mb-3 tracking-tight">
                                        ¡Bienvenido, {perfilCompleto?.username || 'Usuario'}!
                                    </h1>
                                    <p className="text-slate-300 font-semibold text-lg lg:text-xl flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        {user?.email}
                                    </p>
                                </div>

                                <div className="relative group/balance">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover/balance:opacity-40 transition duration-300"></div>
                                    <div className="relative bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
                                        <p className="text-green-300/80 text-sm font-semibold tracking-wide uppercase mb-2">Saldo Disponible</p>
                                        <p className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
                                            ${user?.saldoUsuario?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                </div>

                                {getStatsDisplay()}
                            </div>

                            {/* Enhanced Quick Actions */}
                            <div className="flex flex-col gap-4 min-w-fit">
                                <button
                                    onClick={() => setActiveTab('wallet')}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-green-500/30 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center gap-3">
                                        <span className="text-2xl">💰</span>
                                        <span>Billetera</span>
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('documents')}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center gap-3">
                                        <span className="text-2xl">📄</span>
                                        <span>Documentos</span>
                                    </span>
                                    {getNotificationCount('documents') > 0 && (
                                        <span className="absolute -top-2 -right-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full shadow-lg animate-bounce">
                                            {getNotificationCount('documents')}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('support')}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-purple-500/30 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center gap-3">
                                        <span className="text-2xl">🎧</span>
                                        <span>Soporte</span>
                                    </span>
                                    {getNotificationCount('support') > 0 && (
                                        <span className="absolute -top-2 -right-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full shadow-lg animate-bounce">
                                            {getNotificationCount('support')}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Error Message */}
                {error && (
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <div className="relative bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-500/40 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-red-400 text-3xl animate-pulse">⚠️</span>
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-red-300 font-bold text-lg">Error</h3>
                                    <p className="text-red-200 font-medium">{error}</p>
                                </div>
                                <div className="ml-auto">
                                    <button
                                        onClick={clearError}
                                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <span className="text-2xl">✕</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Main Tabs Section */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-700/90 to-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-600/50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/3 to-orange-500/3 opacity-50"></div>

                        <Tabs defaultValue="profile" activeTab={activeTab} setActiveTab={setActiveTab}>
                            <TabsList className="relative z-10 p-6 border-b border-slate-700/50 flex flex-wrap gap-3 mb-0 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="group relative flex items-center px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-none transform hover:scale-105 active:scale-95 min-w-fit"
                                        activeClassName="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl border border-amber-500/30"
                                        inactiveClassName="bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-slate-300 hover:text-white border border-slate-600/30 hover:border-amber-500/30 hover:bg-gradient-to-r hover:from-slate-600/60 hover:to-slate-700/60"
                                    >
                                        <span className="mr-3 text-2xl group-hover:scale-110 transition-transform duration-300">{tab.icon}</span>
                                        <span className="font-bold text-sm lg:text-base">{tab.label}</span>

                                        {/* Enhanced notification badge */}
                                        {getNotificationCount(tab.id) > 0 && (
                                            <span className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full shadow-xl animate-pulse border-2 border-white/20">
                                                {getNotificationCount(tab.id)}
                                            </span>
                                        )}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* Enhanced Tab Contents */}
                            <div className="relative z-10 p-8">
                                {loading && (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="text-center bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-amber-500/30 max-w-md w-full">
                                            <div className="relative mb-8">
                                                <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-500/20 border-t-amber-500 mx-auto"></div>
                                                <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-orange-500 animate-spin mx-auto" style={{
                                                    animationDelay: '0.5s',
                                                    animationDuration: '1.5s'
                                                }}></div>
                                            </div>
                                            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-3">
                                                Cargando perfil
                                            </h3>
                                            <p className="text-slate-300 font-semibold">Obteniendo información del usuario...</p>
                                            <div className="mt-6 flex justify-center space-x-2">
                                                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
                                                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!loading && (
                                    <>
                                        <TabsContent value="profile" className="mt-0">
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
                                                <div className="relative bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-600/40 p-8">
                                                    <EditProfile />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="password" className="mt-0">
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
                                                <div className="relative bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-600/40 p-8">
                                                    <ChangePassword />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="tsv" className="mt-0">
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
                                                <div className="relative bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-600/40 p-8">
                                                    <TwoFactorAuth />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="documents" className="mt-0">
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-15 group-hover:opacity-25 transition duration-300"></div>
                                                <div className="relative bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-600/40 p-8">
                                                    <DocumentUploadComponent />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="history" className="mt-0">
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
                                                <div className="relative bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-600/40 p-8">
                                                    <GameHistory />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="support" className="mt-0">
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-15 group-hover:opacity-25 transition duration-300"></div>
                                                <div className="relative bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-600/40 p-8">
                                                    <TechnicalSupport />
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </>
                                )}
                            </div>
                        </Tabs>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserProfile;