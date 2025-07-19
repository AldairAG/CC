import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit';
import type {
    AdminState,
    AdminStats,
    AdminUser,
    AdminBet,
    AdminQuiniela,
    AdminEvent,
    AdminNotification,
    AdminRole,
    AdminConfig,
} from '../../types/AdminTypes';
import type { CryptoTransaction } from '../../types/CryptoTypes';

// Estado inicial
const initialState: AdminState = {
    stats: null,
    users: [],
    bets: [],
    quinielas: [],
    events: [],
    notifications: [],
    roles: [],
    configs: [],
    cryptoTransactions: [],
    loading: false,
    error: null,
    selectedUser: null,
    selectedBet: null,
    selectedQuiniela: null,
    selectedEvent: null
};

// Selector base
const selectAdminState = (state: { admin: AdminState }) => state.admin;

// ========== SLICE ==========
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        // ========== LOADING STATES ==========
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // ========== ERROR STATES ==========
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },

        // ========== STATS ==========
        setStats: (state, action: PayloadAction<AdminStats>) => {
            state.stats = action.payload;
        },
        clearStats: (state) => {
            state.stats = null;
        },

        // ========== USERS ==========
        setUsers: (state, action: PayloadAction<AdminUser[]>) => {
            state.users = action.payload;
        },
        addUser: (state, action: PayloadAction<AdminUser>) => {
            state.users.push(action.payload);
        },
        updateUserInState: (state, action: PayloadAction<AdminUser>) => {
            const index = state.users.findIndex(user => user.idUsuario === action.payload.idUsuario);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },
        removeUser: (state, action: PayloadAction<number>) => {
            state.users = state.users.filter(user => user.idUsuario !== action.payload);
        },
        clearUsers: (state) => {
            state.users = [];
        },

        // ========== BETS ==========
        setBets: (state, action: PayloadAction<AdminBet[]>) => {
            state.bets = action.payload;
        },
        addBet: (state, action: PayloadAction<AdminBet>) => {
            state.bets.push(action.payload);
        },
        updateBetInState: (state, action: PayloadAction<AdminBet>) => {
            const index = state.bets.findIndex(bet => bet.idApuesta === action.payload.idApuesta);
            if (index !== -1) {
                state.bets[index] = action.payload;
            }
        },
        removeBet: (state, action: PayloadAction<number>) => {
            state.bets = state.bets.filter(bet => bet.idApuesta !== action.payload);
        },
        clearBets: (state) => {
            state.bets = [];
        },

        // ========== QUINIELAS ==========
        setQuinielas: (state, action: PayloadAction<AdminQuiniela[]>) => {
            state.quinielas = action.payload;
        },
        addQuiniela: (state, action: PayloadAction<AdminQuiniela>) => {
            state.quinielas.push(action.payload);
        },
        updateQuinielaInState: (state, action: PayloadAction<AdminQuiniela>) => {
            const index = state.quinielas.findIndex(q => q.idQuiniela === action.payload.idQuiniela);
            if (index !== -1) {
                state.quinielas[index] = action.payload;
            }
        },
        removeQuiniela: (state, action: PayloadAction<number>) => {
            state.quinielas = state.quinielas.filter(q => q.idQuiniela !== action.payload);
        },
        clearQuinielas: (state) => {
            state.quinielas = [];
        },

        // ========== EVENTS ==========
        setEvents: (state, action: PayloadAction<AdminEvent[]>) => {
            state.events = action.payload;
        },
        addEvent: (state, action: PayloadAction<AdminEvent>) => {
            state.events.push(action.payload);
        },
        updateEventInState: (state, action: PayloadAction<AdminEvent>) => {
            const index = state.events.findIndex(event => event.idEvento === action.payload.idEvento);
            if (index !== -1) {
                state.events[index] = action.payload;
            }
        },
        removeEvent: (state, action: PayloadAction<number>) => {
            state.events = state.events.filter(event => event.idEvento !== action.payload);
        },
        clearEvents: (state) => {
            state.events = [];
        },

        // ========== NOTIFICATIONS ==========
        setNotifications: (state, action: PayloadAction<AdminNotification[]>) => {
            state.notifications = action.payload;
        },
        addNotification: (state, action: PayloadAction<AdminNotification>) => {
            state.notifications.unshift(action.payload);
        },
        updateNotificationInState: (state, action: PayloadAction<AdminNotification>) => {
            const index = state.notifications.findIndex(n => n.idNotificacion === action.payload.idNotificacion);
            if (index !== -1) {
                state.notifications[index] = action.payload;
            }
        },
        removeNotification: (state, action: PayloadAction<number>) => {
            state.notifications = state.notifications.filter(n => n.idNotificacion !== action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },

        // ========== ROLES ==========
        setRoles: (state, action: PayloadAction<AdminRole[]>) => {
            state.roles = action.payload;
        },
        addRole: (state, action: PayloadAction<AdminRole>) => {
            state.roles.push(action.payload);
        },
        updateRoleInState: (state, action: PayloadAction<AdminRole>) => {
            const index = state.roles.findIndex(role => role.idRol === action.payload.idRol);
            if (index !== -1) {
                state.roles[index] = action.payload;
            }
        },
        removeRole: (state, action: PayloadAction<number>) => {
            state.roles = state.roles.filter(role => role.idRol !== action.payload);
        },
        clearRoles: (state) => {
            state.roles = [];
        },

        // ========== CONFIGS ==========
        setConfigs: (state, action: PayloadAction<AdminConfig[]>) => {
            state.configs = action.payload;
        },
        addConfig: (state, action: PayloadAction<AdminConfig>) => {
            state.configs.push(action.payload);
        },
        updateConfigInState: (state, action: PayloadAction<AdminConfig>) => {
            const index = state.configs.findIndex(config => config.clave === action.payload.clave);
            if (index !== -1) {
                state.configs[index] = action.payload;
            }
        },
        removeConfig: (state, action: PayloadAction<string>) => {
            state.configs = state.configs.filter(config => config.clave !== action.payload);
        },
        clearConfigs: (state) => {
            state.configs = [];
        },

        // ========== CRYPTO TRANSACTIONS ==========
        setCryptoTransactions: (state, action: PayloadAction<CryptoTransaction[]>) => {
            state.cryptoTransactions = action.payload;
        },
        addCryptoTransaction: (state, action: PayloadAction<CryptoTransaction>) => {
            state.cryptoTransactions.push(action.payload);
        },
        updateCryptoTransactionInState: (state, action: PayloadAction<CryptoTransaction>) => {
            const index = state.cryptoTransactions.findIndex(tx => tx.id === action.payload.id);
            if (index !== -1) {
                state.cryptoTransactions[index] = action.payload;
            }
        },
        removeCryptoTransaction: (state, action: PayloadAction<number>) => {
            state.cryptoTransactions = state.cryptoTransactions.filter(tx => tx.id !== action.payload);
        },
        clearCryptoTransactions: (state) => {
            state.cryptoTransactions = [];
        },

        // ========== SELECTED ITEMS ==========
        setSelectedUser: (state, action: PayloadAction<AdminUser | null>) => {
            state.selectedUser = action.payload;
        },
        setSelectedBet: (state, action: PayloadAction<AdminBet | null>) => {
            state.selectedBet = action.payload;
        },
        setSelectedQuiniela: (state, action: PayloadAction<AdminQuiniela | null>) => {
            state.selectedQuiniela = action.payload;
        },
        setSelectedEvent: (state, action: PayloadAction<AdminEvent | null>) => {
            state.selectedEvent = action.payload;
        },

        // ========== RESET ACTIONS ==========
        resetAdminState: (state) => {
            Object.assign(state, initialState);
        },
        clearAllData: (state) => {
            state.stats = null;
            state.users = [];
            state.bets = [];
            state.quinielas = [];
            state.events = [];
            state.notifications = [];
            state.roles = [];
            state.configs = [];
            state.cryptoTransactions = [];
            state.selectedUser = null;
            state.selectedBet = null;
            state.selectedQuiniela = null;
            state.selectedEvent = null;
        }
    }
});

// ========== ACTIONS ==========
export const {
    // Loading y Error
    setLoading,
    setError,
    clearError,

    // Stats
    setStats,
    clearStats,

    // Users
    setUsers,
    addUser,
    updateUserInState,
    removeUser,
    clearUsers,

    // Bets
    setBets,
    addBet,
    updateBetInState,
    removeBet,
    clearBets,

    // Quinielas
    setQuinielas,
    addQuiniela,
    updateQuinielaInState,
    removeQuiniela,
    clearQuinielas,

    // Events
    setEvents,
    addEvent,
    updateEventInState,
    removeEvent,
    clearEvents,

    // Notifications
    setNotifications,
    addNotification,
    updateNotificationInState,
    removeNotification,
    clearNotifications,

    // Roles
    setRoles,
    addRole,
    updateRoleInState,
    removeRole,
    clearRoles,

    // Configs
    setConfigs,
    addConfig,
    updateConfigInState,
    removeConfig,
    clearConfigs,

    // Crypto Transactions
    setCryptoTransactions,
    addCryptoTransaction,
    updateCryptoTransactionInState,
    removeCryptoTransaction,
    clearCryptoTransactions,

    // Selected Items
    setSelectedUser,
    setSelectedBet,
    setSelectedQuiniela,
    setSelectedEvent,

    // Reset
    resetAdminState,
    clearAllData
} = adminSlice.actions;

// ========== SELECTORS ==========
export const adminSelector = {
    // Estado base
    state: createSelector([selectAdminState], (state) => state),
    
    // Datos principales
    stats: createSelector([selectAdminState], (state) => state.stats),
    users: createSelector([selectAdminState], (state) => state.users),
    bets: createSelector([selectAdminState], (state) => state.bets),
    quinielas: createSelector([selectAdminState], (state) => state.quinielas),
    events: createSelector([selectAdminState], (state) => state.events),
    notifications: createSelector([selectAdminState], (state) => state.notifications),
    roles: createSelector([selectAdminState], (state) => state.roles),
    configs: createSelector([selectAdminState], (state) => state.configs),
    cryptoTransactions: createSelector([selectAdminState], (state) => state.cryptoTransactions),

    // Estados
    loading: createSelector([selectAdminState], (state) => state.loading),
    error: createSelector([selectAdminState], (state) => state.error),

    // Elementos seleccionados
    selectedUser: createSelector([selectAdminState], (state) => state.selectedUser),
    selectedBet: createSelector([selectAdminState], (state) => state.selectedBet),
    selectedQuiniela: createSelector([selectAdminState], (state) => state.selectedQuiniela),
    selectedEvent: createSelector([selectAdminState], (state) => state.selectedEvent),

    // Computed values
    pendingBetsCount: createSelector([selectAdminState], (state) => 
        state.bets.filter(bet => bet.estado === 'PENDIENTE').length
    ),
    activeUsersCount: createSelector([selectAdminState], (state) => 
        state.users.filter(user => user.activo).length
    ),
    unreadNotificationsCount: createSelector([selectAdminState], (state) => 
        state.notifications.filter(notification => !notification.leida).length
    ),
    pendingCryptoTransactionsCount: createSelector([selectAdminState], (state) => 
        state.cryptoTransactions.filter(tx => tx.status === 'PENDING').length
    ),
    activeQuinielasCount: createSelector([selectAdminState], (state) => 
        state.quinielas.filter(q => q.estado === 'ACTIVA').length
    ),

    // Flags de existencia de datos
    hasUsers: createSelector([selectAdminState], (state) => state.users.length > 0),
    hasBets: createSelector([selectAdminState], (state) => state.bets.length > 0),
    hasQuinielas: createSelector([selectAdminState], (state) => state.quinielas.length > 0),
    hasEvents: createSelector([selectAdminState], (state) => state.events.length > 0),
    hasNotifications: createSelector([selectAdminState], (state) => state.notifications.length > 0),
    hasRoles: createSelector([selectAdminState], (state) => state.roles.length > 0),
    hasConfigs: createSelector([selectAdminState], (state) => state.configs.length > 0),
    hasCryptoTransactions: createSelector([selectAdminState], (state) => state.cryptoTransactions.length > 0),
    isInitialized: createSelector([selectAdminState], (state) => state.stats !== null),
};

export default adminSlice.reducer;
