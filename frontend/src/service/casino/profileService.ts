import { apiClient } from './ApiCliente';
import type { 
  DocumentUploadRequest, 
  UserDocument, 
  SupportTicket, 
  TSVData, 
  GameHistory
} from '../../types/UserProfileTypes';
import type { 
  PerfilUsuarioCompleto,
  ActualizarPerfilRequest,
  CambiarPasswordRequest 
} from '../../types/PerfilTypes';

// Interfaces adicionales para el servicio
export interface TransactionHistory {
  id: number;
  tipo: 'DEPOSITO' | 'RETIRO' | 'APUESTA' | 'GANANCIA';
  monto: number;
  fecha: string;
  descripcion: string;
  estado: 'COMPLETADO' | 'PENDIENTE' | 'FALLIDO';
  referencia?: string;
}

export interface UserStatistics {
  totalApuestas: number;
  totalGanancias: number;
  totalPerdidas: number;
  juegosFavoritos: string[];
  tiempoTotalJuego: number;
  ultimaActividad: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CreateTicketRequest {
  asunto: string;
  descripcion: string;
  categoria: 'TECNICO' | 'CUENTA' | 'JUEGO' | 'OTRO';
}

export const profileService = {
  
  // ========== GESTIÓN DE PERFIL ==========
  
  /**
   * Obtener perfil de usuario por ID
   */
  async getUserProfile(userId: number): Promise<PerfilUsuarioCompleto> {
    const response = await apiClient.get(`/perfil/${userId}`);
    return response.data;
  },

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId: number, profileData: ActualizarPerfilRequest): Promise<void> {
    const response = await apiClient.put(`/perfil/${userId}`, {
      nombre: profileData.nombre,
      apellido: profileData.apellido,
      telefono: profileData.telefono,
      fechaNacimiento: profileData.fechaNacimiento,
      fotoPerfil: profileData.fotoPerfil,
      lada: profileData.lada,
    });
    return response.data;
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(userId: number, passwordData: CambiarPasswordRequest): Promise<void> {
    const response = await apiClient.put(`/perfil/${userId}/password`, {
      passwordActual: passwordData.passwordActual,
      nuevaPassword: passwordData.nuevaPassword,
      confirmarPassword: passwordData.confirmarPassword,
    });
    return response.data;
  },

  // ========== GESTIÓN DE DOCUMENTOS ==========

  /**
   * Subir documento de identidad
   */
  async uploadDocument(userId: number, documentData: DocumentUploadRequest): Promise<UserDocument> {
    const formData = new FormData();
    formData.append('archivo', documentData.file);
    formData.append('tipo', documentData.type);

    const response = await apiClient.post(`/perfil/${userId}/documentos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Obtener documentos del usuario
   */
  async getDocuments(userId: number): Promise<UserDocument[]> {
    const response = await apiClient.get(`/perfil/${userId}/documentos`);
    return response.data;
  },

  /**
   * Eliminar documento
   */
  async deleteDocument(userId: number, documentId: number): Promise<void> {
    const response = await apiClient.delete(`/perfil/${userId}/documentos/${documentId}`);
    return response.data;
  },

  // ========== HISTORIAL DE TRANSACCIONES ==========

  /**
   * Obtener historial completo de transacciones
   */
  async getTransactionHistory(userId: number): Promise<TransactionHistory[]> {
    const response = await apiClient.get(`/perfil/${userId}/transacciones`);
    return response.data;
  },

  /**
   * Obtener historial paginado de transacciones
   */
  async getTransactionHistoryPaginated(
    userId: number, 
    page: number = 0, 
    size: number = 10,
    sortBy: string = 'fechaCreacion',
    sortDir: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<TransactionHistory>> {
    const response = await apiClient.get(`/perfil/${userId}/transacciones/paginado`, {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  /**
   * Obtener solo depósitos
   */
  async getDeposits(userId: number): Promise<TransactionHistory[]> {
    const response = await apiClient.get(`/perfil/${userId}/depositos`);
    return response.data;
  },

  /**
   * Obtener solo retiros
   */
  async getWithdrawals(userId: number): Promise<TransactionHistory[]> {
    const response = await apiClient.get(`/perfil/${userId}/retiros`);
    return response.data;
  },

  // ========== SOPORTE TÉCNICO ==========

  /**
   * Crear ticket de soporte
   */
  async createSupportTicket(userId: number, ticketData: CreateTicketRequest): Promise<SupportTicket> {
    const response = await apiClient.post(`/perfil/${userId}/soporte/tickets`, ticketData);
    return response.data;
  },

  /**
   * Obtener mis tickets de soporte
   */
  async getSupportTickets(userId: number): Promise<SupportTicket[]> {
    const response = await apiClient.get(`/perfil/${userId}/soporte/tickets`);
    return response.data;
  },

  /**
   * Obtener ticket específico
   */
  async getSupportTicketById(userId: number, ticketId: number): Promise<SupportTicket> {
    const response = await apiClient.get(`/perfil/${userId}/soporte/tickets/${ticketId}`);
    return response.data;
  },

  // ========== AUTENTICACIÓN 2FA ==========

  /**
   * Obtener configuración 2FA
   */
  async get2FAConfiguration(userId: number): Promise<TSVData> {
    const response = await apiClient.get(`/perfil/${userId}/2fa`);
    return response.data;
  },

  /**
   * Habilitar 2FA
   */
  async enable2FA(userId: number): Promise<TSVData> {
    const response = await apiClient.post(`/perfil/${userId}/2fa/habilitar`);
    return response.data;
  },

  /**
   * Deshabilitar 2FA
   */
  async disable2FA(userId: number): Promise<void> {
    const response = await apiClient.post(`/perfil/${userId}/2fa/deshabilitar`);
    return response.data;
  },

  /**
   * Verificar código 2FA
   */
  async verify2FACode(userId: number, code: string): Promise<{ valido: boolean; mensaje?: string }> {
    const response = await apiClient.post(`/perfil/${userId}/2fa/verificar`, { codigo: code });
    return response.data;
  },

  /**
   * Generar códigos de backup
   */
  async generateBackupCodes(userId: number): Promise<{ codigos: string }> {
    const response = await apiClient.post(`/perfil/${userId}/2fa/codigos-backup`);
    return response.data;
  },

  // ========== ESTADÍSTICAS ==========

  /**
   * Obtener estadísticas del usuario
   */
  async getUserStatistics(userId: number): Promise<UserStatistics> {
    const response = await apiClient.get(`/perfil/${userId}/estadisticas`);
    return response.data;
  },

  /**
   * Obtener estadísticas del usuario
   */
  async getUserGameHistory(userId: number): Promise<GameHistory[]> {
    const response = await apiClient.get(`/perfil/${userId}/gameHistory`);
    return response.data;
  },

  // ========== MÉTODOS AUXILIARES ==========

  /**
   * Validar archivo antes de subirlo
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

    if (file.size > maxSize) {
      return { valid: false, error: 'El archivo no puede ser mayor a 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Solo se permiten archivos JPG, PNG o PDF' };
    }

    return { valid: true };
  },

  /**
   * Formatear monto para mostrar
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  },

  /**
   * Formatear fecha
   */
  formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  },

  /**
   * Obtener color del estado
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'COMPLETADO': 'green',
      'PENDIENTE': 'yellow',
      'FALLIDO': 'red',
      'APROBADO': 'green',
      'RECHAZADO': 'red',
      'ABIERTO': 'blue',
      'EN_PROCESO': 'orange',
      'CERRADO': 'gray'
    };
    return colors[status] || 'gray';
  }
};
