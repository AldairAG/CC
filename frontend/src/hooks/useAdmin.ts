import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    // Loading y Error
    setLoading,
    setError,
    clearError,

    // Stats
    setStats,

    // Users
    setUsers,
    addUser,
    updateUserInState,
    removeUser,

    // Bets
    setBets,
    updateBetInState,

    // Quinielas
    setQuinielas,
    updateQuinielaInState,

    // Events
    setEvents,
    updateEventInState,

    // Notifications
    setNotifications,
    addNotification,

    // Roles
    setRoles,
    addRole,
    updateRoleInState,

    // Configs
    setConfigs,
    updateConfigInState,

    // Crypto Transactions
    setCryptoTransactions,
    updateCryptoTransactionInState,

    // Selected Items
    setSelectedUser,
    setSelectedBet,
    setSelectedQuiniela,
    setSelectedEvent,

    // Reset
    resetAdminState,
    clearAllData,

    // Selectors
    adminSelector
} from '../store/slices/adminSlice';

import { AdminService } from '../service/casino';
import type {
    CreateUserRequest,
    UpdateUserRequest,
    CreateNotificationRequest,
    CreateRoleRequest,
    UpdateRoleRequest,
    UpdateConfigRequest
} from '../types/AdminTypes';

/**
 * Hook personalizado para gestionar todas las funcionalidades administrativas
 * 
 * @returns {object} Objeto con selectores, acciones y métodos para gestión administrativa
 */
export const useAdmin = () => {
    const dispatch = useAppDispatch();

    // ========== SELECTORS ==========
    const state = useAppSelector(adminSelector.state);
    const stats = useAppSelector(adminSelector.stats);
    const users = useAppSelector(adminSelector.users);
    const bets = useAppSelector(adminSelector.bets);
    const quinielas = useAppSelector(adminSelector.quinielas);
    const events = useAppSelector(adminSelector.events);
    const notifications = useAppSelector(adminSelector.notifications);
    const roles = useAppSelector(adminSelector.roles);
    const configs = useAppSelector(adminSelector.configs);
    const cryptoTransactions = useAppSelector(adminSelector.cryptoTransactions);
    const loading = useAppSelector(adminSelector.loading);
    const error = useAppSelector(adminSelector.error);
    const selectedUser = useAppSelector(adminSelector.selectedUser);
    const selectedBet = useAppSelector(adminSelector.selectedBet);
    const selectedQuiniela = useAppSelector(adminSelector.selectedQuiniela);
    const selectedEvent = useAppSelector(adminSelector.selectedEvent);

    // Computed selectors
    const pendingBetsCount = useAppSelector(adminSelector.pendingBetsCount);
    const activeUsersCount = useAppSelector(adminSelector.activeUsersCount);
    const unreadNotificationsCount = useAppSelector(adminSelector.unreadNotificationsCount);
    const pendingCryptoTransactionsCount = useAppSelector(adminSelector.pendingCryptoTransactionsCount);
    const activeQuinielasCount = useAppSelector(adminSelector.activeQuinielasCount);

    // ========== STATS ACTIONS ==========
    const loadStats = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const stats = await AdminService.getStats();
            dispatch(setStats(stats));
            return stats;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al obtener estadísticas';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // ========== USER ACTIONS ==========
    const loadUsers = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const users = await AdminService.getAllUsers();
            dispatch(setUsers(users));
            return users;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al obtener usuarios';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleCreateUser = useCallback(async (userData: CreateUserRequest) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const newUser = await AdminService.createUser(userData);
            dispatch(addUser(newUser));
            return newUser;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear usuario';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleUpdateUser = useCallback(async (userData: UpdateUserRequest) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const updatedUser = await AdminService.updateUser(userData);
            dispatch(updateUserInState(updatedUser));
            return updatedUser;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar usuario';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleToggleUserStatus = useCallback(async (userId: number) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const updatedUser = await AdminService.toggleUserStatus(userId);
            dispatch(updateUserInState(updatedUser));
            return updatedUser;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cambiar estado del usuario';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleDeleteUser = useCallback(async (userId: number) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            await AdminService.deleteUser(userId);
            dispatch(removeUser(userId));
            return userId;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al eliminar usuario';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // ========== BET ACTIONS ==========
    const loadBets = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const bets = await AdminService.getAllBets();
            dispatch(setBets(bets));
            return bets;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al obtener apuestas';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleUpdateBetStatus = useCallback(async (idApuesta: number, estado: string) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const updatedBet = await AdminService.updateBetStatus(idApuesta, estado);
            dispatch(updateBetInState(updatedBet));
            return updatedBet;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar estado de apuesta';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // ========== QUINIELA ACTIONS ==========
    const loadQuinielas = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const quinielas = await AdminService.getAllQuinielas();
            dispatch(setQuinielas(quinielas));
            return quinielas;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al obtener quinielas';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleFinalizeQuiniela = useCallback(async (idQuiniela: number) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const finalizedQuiniela = await AdminService.finalizeQuiniela(idQuiniela);
            dispatch(updateQuinielaInState(finalizedQuiniela));
            return finalizedQuiniela;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al finalizar quiniela';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // ========== EVENT ACTIONS ==========
    const loadEvents = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const events = await AdminService.getAllEvents();
            dispatch(setEvents(events));
            return events;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al obtener eventos';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleUpdateEventStatus = useCallback(async (idEvento: number, estado: string) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const updatedEvent = await AdminService.updateEventStatus(idEvento, estado);
            dispatch(updateEventInState(updatedEvent));
            return updatedEvent;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar estado del evento';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // ========== NOTIFICATION ACTIONS ==========
    const loadNotifications = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const notifications = await AdminService.getAllNotifications();
            dispatch(setNotifications(notifications));
            return notifications;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al obtener notificaciones';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleCreateNotification = useCallback(async (notificationData: CreateNotificationRequest) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const newNotification = await AdminService.createNotification(notificationData);
            dispatch(addNotification(newNotification));
            return newNotification;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear notificación';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // ========== ROLE ACTIONS ==========
    const loadRoles = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const roles = await AdminService.getAllRoles();
            dispatch(setRoles(roles));
            return roles;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al obtener roles';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleCreateRole = useCallback(async (roleData: CreateRoleRequest) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const newRole = await AdminService.createRole(roleData);
            dispatch(addRole(newRole));
            return newRole;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear rol';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleUpdateRole = useCallback(async (roleData: UpdateRoleRequest) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const updatedRole = await AdminService.updateRole(roleData);
            dispatch(updateRoleInState(updatedRole));
            return updatedRole;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar rol';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // ========== CONFIG ACTIONS ==========
    const loadConfigs = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const configs = await AdminService.getAllConfigs();
            dispatch(setConfigs(configs));
            return configs;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al obtener configuraciones';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleUpdateConfig = useCallback(async (configData: UpdateConfigRequest) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const updatedConfig = await AdminService.updateConfig(configData);
            dispatch(updateConfigInState(updatedConfig));
            return updatedConfig;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar configuración';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // ========== CRYPTO ACTIONS ==========
    const loadCryptoTransactions = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const transactions = await AdminService.getAllCryptoTransactions();
            dispatch(setCryptoTransactions(transactions));
            return transactions;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al obtener transacciones crypto';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleApproveCryptoTransaction = useCallback(async (idTransaccion: number) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const approvedTransaction = await AdminService.approveCryptoTransaction(idTransaccion);
            dispatch(updateCryptoTransactionInState(approvedTransaction));
            return approvedTransaction;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al aprobar transacción';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleRejectCryptoTransaction = useCallback(async (idTransaccion: number) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const rejectCryptoTransaction = await AdminService.rejectCryptoTransaction(idTransaccion);
            dispatch(updateCryptoTransactionInState(rejectCryptoTransaction));
            return rejectCryptoTransaction;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al aprobar transacción';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch])

    // ========== UTILITY ACTIONS ==========
    const clearAdminError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const selectUser = useCallback((user: typeof selectedUser) => {
        dispatch(setSelectedUser(user));
    }, [dispatch]);

    const selectBet = useCallback((bet: typeof selectedBet) => {
        dispatch(setSelectedBet(bet));
    }, [dispatch]);

    const selectQuiniela = useCallback((quiniela: typeof selectedQuiniela) => {
        dispatch(setSelectedQuiniela(quiniela));
    }, [dispatch]);

    const selectEvent = useCallback((event: typeof selectedEvent) => {
        dispatch(setSelectedEvent(event));
    }, [dispatch]);

    const resetAdmin = useCallback(() => {
        dispatch(resetAdminState());
    }, [dispatch]);

    const clearAllAdminData = useCallback(() => {
        dispatch(clearAllData());
    }, [dispatch]);

    // Función para cargar todos los datos iniciales
    const loadAllData = useCallback(async () => {
        const promises = [
            loadStats(),
            loadUsers(),
            loadBets(),
            loadQuinielas(),
            loadEvents(),
            loadNotifications(),
            //loadRoles(),
            loadCryptoTransactions()
        ];

        return Promise.allSettled(promises);
    }, [loadStats, loadUsers, loadBets, loadQuinielas, loadEvents, loadNotifications, loadRoles, loadConfigs, loadCryptoTransactions]);

    return {
        // ========== STATE ==========
        state,

        // Data
        stats,
        users,
        bets,
        quinielas,
        events,
        notifications,
        roles,
        configs,
        cryptoTransactions,

        // State flags
        loading,
        error,
        selectedUser,
        selectedBet,
        selectedQuiniela,
        selectedEvent,

        // Computed Values
        pendingBetsCount,
        activeUsersCount,
        unreadNotificationsCount,
        pendingCryptoTransactionsCount,
        activeQuinielasCount,

        // Estado derivado
        hasUsers: useAppSelector(adminSelector.hasUsers),
        hasBets: useAppSelector(adminSelector.hasBets),
        hasQuinielas: useAppSelector(adminSelector.hasQuinielas),
        hasEvents: useAppSelector(adminSelector.hasEvents),
        hasNotifications: useAppSelector(adminSelector.hasNotifications),
        hasRoles: useAppSelector(adminSelector.hasRoles),
        hasConfigs: useAppSelector(adminSelector.hasConfigs),
        hasCryptoTransactions: useAppSelector(adminSelector.hasCryptoTransactions),
        isInitialized: useAppSelector(adminSelector.isInitialized),

        // ========== ACTIONS ==========

        // Stats Actions
        loadStats,

        // User Actions
        loadUsers,
        handleCreateUser,
        handleUpdateUser,
        handleToggleUserStatus,
        handleDeleteUser,

        // Bet Actions
        loadBets,
        handleUpdateBetStatus,

        // Quiniela Actions
        loadQuinielas,
        handleFinalizeQuiniela,

        // Event Actions
        loadEvents,
        handleUpdateEventStatus,

        // Notification Actions
        loadNotifications,
        handleCreateNotification,

        // Role Actions
        loadRoles,
        handleCreateRole,
        handleUpdateRole,

        // Config Actions
        loadConfigs,
        handleUpdateConfig,

        // Crypto Actions
        loadCryptoTransactions,
        handleApproveCryptoTransaction,
        handleRejectCryptoTransaction,

        // Utility Actions
        clearAdminError,
        selectUser,
        selectBet,
        selectQuiniela,
        selectEvent,
        resetAdmin,
        clearAllAdminData,
        loadAllData
    };
};
