import { apiClient } from "./ApiCliente";
import type {
    AdminStats,
    AdminUser,
    AdminBet,
    AdminQuiniela,
    AdminEvent,
    AdminNotification,
    AdminRole,
    AdminConfig,
    CreateUserRequest,
    UpdateUserRequest,
    CreateNotificationRequest,
    CreateRoleRequest,
    UpdateRoleRequest,
    UpdateConfigRequest
} from "../../types/AdminTypes";
import type { CryptoTransaction } from "../../types/CryptoTypes";

const BASE_URL = '/admin';

export const AdminService = {
    // ========== DASHBOARD STATS ==========
    /**
     * Obtiene las estadísticas generales del dashboard
     */
    getStats: async (): Promise<AdminStats> => {
        const response = await apiClient.get<AdminStats>(`${BASE_URL}/stats`);
        return response.data;
    },

    // ========== GESTIÓN DE USUARIOS ==========
    /**
     * Obtiene todos los usuarios del sistema
     */
    getAllUsers: async (): Promise<AdminUser[]> => {
        const response = await apiClient.get<AdminUser[]>(`${BASE_URL}/usuarios`);
        return response.data;
    },

    /**
     * Obtiene un usuario específico por ID
     */
    getUserById: async (id: number): Promise<AdminUser> => {
        const response = await apiClient.get<AdminUser>(`${BASE_URL}/usuarios/${id}`);
        return response.data;
    },

    /**
     * Crea un nuevo usuario
     */
    createUser: async (userData: CreateUserRequest): Promise<AdminUser> => {
        const response = await apiClient.post<AdminUser>(`${BASE_URL}/usuarios`, userData);
        return response.data;
    },

    /**
     * Actualiza un usuario existente
     */
    updateUser: async (userData: UpdateUserRequest): Promise<AdminUser> => {
        const response = await apiClient.put<AdminUser>(`${BASE_URL}/usuarios/${userData.idUsuario}`, userData);
        return response.data;
    },

    /**
     * Desactiva/activa un usuario
     */
    toggleUserStatus: async (id: number): Promise<AdminUser> => {
        const response = await apiClient.patch<AdminUser>(`${BASE_URL}/usuarios/${id}/toggle`);
        return response.data;
    },

    /**
     * Elimina un usuario (eliminación física)
     */
    deleteUser: async (id: number): Promise<void> => {
        await apiClient.delete(`${BASE_URL}/usuarios/${id}`);
    },

    // ========== GESTIÓN DE APUESTAS ==========
    /**
     * Obtiene todas las apuestas del sistema
     */
    getAllBets: async (): Promise<AdminBet[]> => {
        const response = await apiClient.get<AdminBet[]>(`${BASE_URL}/apuestas`);
        return response.data;
    },

    /**
     * Obtiene apuestas por estado
     */
    getBetsByStatus: async (estado: string): Promise<AdminBet[]> => {
        const response = await apiClient.get<AdminBet[]>(`${BASE_URL}/apuestas/estado/${estado}`);
        return response.data;
    },

    /**
     * Actualiza el estado de una apuesta
     */
    updateBetStatus: async (idApuesta: number, estado: string): Promise<AdminBet> => {
        const response = await apiClient.patch<AdminBet>(`${BASE_URL}/apuestas/${idApuesta}/estado`, { estado });
        return response.data;
    },

    /**
     * Cancela una apuesta
     */
    cancelBet: async (idApuesta: number): Promise<AdminBet> => {
        const response = await apiClient.patch<AdminBet>(`${BASE_URL}/apuestas/${idApuesta}/cancelar`);
        return response.data;
    },

    // ========== GESTIÓN DE QUINIELAS ==========
    /**
     * Obtiene todas las quinielas del sistema
     */
    getAllQuinielas: async (): Promise<AdminQuiniela[]> => {
        const response = await apiClient.get<AdminQuiniela[]>(`${BASE_URL}/quinielas`);
        return response.data;
    },

    /**
     * Finaliza una quiniela
     */
    finalizeQuiniela: async (idQuiniela: number): Promise<AdminQuiniela> => {
        const response = await apiClient.patch<AdminQuiniela>(`${BASE_URL}/quinielas/${idQuiniela}/finalizar`);
        return response.data;
    },

    /**
     * Cancela una quiniela
     */
    cancelQuiniela: async (idQuiniela: number): Promise<AdminQuiniela> => {
        const response = await apiClient.patch<AdminQuiniela>(`${BASE_URL}/quinielas/${idQuiniela}/cancelar`);
        return response.data;
    },

    // ========== GESTIÓN DE EVENTOS ==========
    /**
     * Obtiene todos los eventos deportivos
     */
    getAllEvents: async (): Promise<AdminEvent[]> => {
        const response = await apiClient.get<AdminEvent[]>(`${BASE_URL}/eventos`);
        return response.data;
    },

    /**
     * Actualiza el estado de un evento
     */
    updateEventStatus: async (idEvento: number, estado: string): Promise<AdminEvent> => {
        const response = await apiClient.patch<AdminEvent>(`${BASE_URL}/eventos/${idEvento}/estado`, { estado });
        return response.data;
    },

    /**
     * Cancela un evento
     */
    cancelEvent: async (idEvento: number): Promise<AdminEvent> => {
        const response = await apiClient.patch<AdminEvent>(`${BASE_URL}/eventos/${idEvento}/cancelar`);
        return response.data;
    },

    // ========== GESTIÓN DE NOTIFICACIONES ==========
    /**
     * Obtiene todas las notificaciones
     */
    getAllNotifications: async (): Promise<AdminNotification[]> => {
        const response = await apiClient.get<AdminNotification[]>(`${BASE_URL}/notificaciones`);
        return response.data;
    },

    /**
     * Crea una nueva notificación
     */
    createNotification: async (notificationData: CreateNotificationRequest): Promise<AdminNotification> => {
        const response = await apiClient.post<AdminNotification>(`${BASE_URL}/notificaciones`, notificationData);
        return response.data;
    },

    /**
     * Marca una notificación como leída
     */
    markNotificationAsRead: async (idNotificacion: number): Promise<AdminNotification> => {
        const response = await apiClient.patch<AdminNotification>(`${BASE_URL}/notificaciones/${idNotificacion}/leer`);
        return response.data;
    },

    /**
     * Elimina una notificación
     */
    deleteNotification: async (idNotificacion: number): Promise<void> => {
        await apiClient.delete(`${BASE_URL}/notificaciones/${idNotificacion}`);
    },

    // ========== GESTIÓN DE ROLES ==========
    /**
     * Obtiene todos los roles del sistema
     */
    getAllRoles: async (): Promise<AdminRole[]> => {
        const response = await apiClient.get<AdminRole[]>(`${BASE_URL}/roles`);
        return response.data;
    },

    /**
     * Crea un nuevo rol
     */
    createRole: async (roleData: CreateRoleRequest): Promise<AdminRole> => {
        const response = await apiClient.post<AdminRole>(`${BASE_URL}/roles`, roleData);
        return response.data;
    },

    /**
     * Actualiza un rol existente
     */
    updateRole: async (roleData: UpdateRoleRequest): Promise<AdminRole> => {
        const response = await apiClient.put<AdminRole>(`${BASE_URL}/roles/${roleData.idRol}`, roleData);
        return response.data;
    },

    /**
     * Desactiva/activa un rol
     */
    toggleRoleStatus: async (idRol: number): Promise<AdminRole> => {
        const response = await apiClient.patch<AdminRole>(`${BASE_URL}/roles/${idRol}/toggle`);
        return response.data;
    },

    /**
     * Elimina un rol
     */
    deleteRole: async (idRol: number): Promise<void> => {
        await apiClient.delete(`${BASE_URL}/roles/${idRol}`);
    },

    // ========== GESTIÓN DE CONFIGURACIÓN ==========
    /**
     * Obtiene todas las configuraciones del sistema
     */
    getAllConfigs: async (): Promise<AdminConfig[]> => {
        const response = await apiClient.get<AdminConfig[]>(`${BASE_URL}/configuracion`);
        return response.data;
    },

    /**
     * Actualiza una configuración
     */
    updateConfig: async (configData: UpdateConfigRequest): Promise<AdminConfig> => {
        const response = await apiClient.put<AdminConfig>(`${BASE_URL}/configuracion/${configData.clave}`, configData);
        return response.data;
    },

    // ========== GESTIÓN DE CRYPTO ==========
    /**
     * Obtiene todas las transacciones de criptomonedas
     */
    getAllCryptoTransactions: async (): Promise<CryptoTransaction[]> => {
        const response = await apiClient.get<CryptoTransaction[]>(`${BASE_URL}/crypto/transacciones`);
        return response.data;
    },

    /**
     * Obtiene transacciones por estado
     */
    getCryptoTransactionsByStatus: async (estado: string): Promise<CryptoTransaction[]> => {
        const response = await apiClient.get<CryptoTransaction[]>(`${BASE_URL}/crypto/transacciones/estado/${estado}`);
        return response.data;
    },

    /**
     * Aprueba una transacción de crypto
     */
    approveCryptoTransaction: async (idTransaccion: number): Promise<CryptoTransaction> => {
        const response = await apiClient.patch<CryptoTransaction>(`${BASE_URL}/crypto/transacciones/${idTransaccion}/aprobar`);
        return response.data;
    },

    /**
     * Rechaza una transacción de crypto
     */
    rejectCryptoTransaction: async (idTransaccion: number, motivo?: string): Promise<CryptoTransaction> => {
        const response = await apiClient.patch<CryptoTransaction>(`${BASE_URL}/crypto/transacciones/${idTransaccion}/rechazar`, { motivo });
        return response.data;
    },

    // ========== REPORTES ==========
    /**
     * Genera reporte de usuarios
     */
    generateUserReport: async (fechaInicio: string, fechaFin: string): Promise<Blob> => {
        const response = await apiClient.get(`${BASE_URL}/reportes/usuarios`, {
            params: { fechaInicio, fechaFin },
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Genera reporte de apuestas
     */
    generateBetsReport: async (fechaInicio: string, fechaFin: string): Promise<Blob> => {
        const response = await apiClient.get(`${BASE_URL}/reportes/apuestas`, {
            params: { fechaInicio, fechaFin },
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Genera reporte financiero
     */
    generateFinancialReport: async (fechaInicio: string, fechaFin: string): Promise<Blob> => {
        const response = await apiClient.get(`${BASE_URL}/reportes/financiero`, {
            params: { fechaInicio, fechaFin },
            responseType: 'blob'
        });
        return response.data;
    }
};
