import { useState, useCallback } from 'react';
import { useUser } from './useUser';
import { 
  getUserProfileAsync,
  updateProfileAsync,
  changePasswordAsync,
  uploadDocumentAsync,
  fetchDocumentsAsync,
  deleteDocumentAsync,
  fetchTransactionHistoryAsync,
  fetchTransactionHistoryPaginatedAsync,
  createSupportTicketAsync,
  fetchSupportTicketsAsync,
  fetch2FAStatusAsync,
  enable2FAAsync,
  disable2FAAsync,
  verify2FACodeAsync,
  fetchUserStatisticsAsync,
  selectPerfilCompleto,
  selectFetchingProfile,
  selectProfileError,
  selectProfileLoading,
  selectDocuments,
  selectTransactionHistory,
  selectPaginatedTransactions,
  selectSupportTickets,
  selectTSVStatus,
  selectUserStatistics,
  selectUploadingDocument,
  selectUpdatingProfile,
  selectChangingPassword,
  selectCreating2FA,
  selectCreatingTicket,
  clearError
} from '../store/slices/profileSlice';
import { profileService } from '../service/casino/profileService';
import type {
  DocumentUploadRequest
} from '../types/UserProfileTypes';
import type {
  CreateTicketRequest
} from '../service/casino/profileService';
import type {
  PerfilUsuarioCompleto,
  ActualizarPerfilRequest,
  CambiarPasswordRequest
} from '../types/PerfilTypes';
import { useAppDispatch, useAppSelector } from '../store/hooks';


export const useUserProfile = () => {
  const { user } = useUser();
  const dispatch = useAppDispatch();
  
  // Redux selectors
  const perfilCompleto = useAppSelector(selectPerfilCompleto);
  const fetchingProfile = useAppSelector(selectFetchingProfile);
  const profileError = useAppSelector(selectProfileError);
  const profileLoading = useAppSelector(selectProfileLoading);
  const documents = useAppSelector(selectDocuments);
  const transactionHistory = useAppSelector(selectTransactionHistory);
  const paginatedTransactions = useAppSelector(selectPaginatedTransactions);
  const supportTickets = useAppSelector(selectSupportTickets);
  const tsvStatus = useAppSelector(selectTSVStatus);
  const statistics = useAppSelector(selectUserStatistics);
  
  // Loading states
  const uploadingDocument = useAppSelector(selectUploadingDocument);
  const updatingProfile = useAppSelector(selectUpdatingProfile);
  const changingPassword = useAppSelector(selectChangingPassword);
  const creating2FA = useAppSelector(selectCreating2FA);
  const creatingTicket = useAppSelector(selectCreatingTicket);

  // Local state for additional functionality
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Profile management
  const updateProfile = useCallback(async (profileData: ActualizarPerfilRequest) => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { success: false, message: 'Usuario no encontrado' };
    }

    try {
      const result = await dispatch(updateProfileAsync({ userId: user.idUsuario, profileData })).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setLocalError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const changePassword = useCallback(async (passwordData: CambiarPasswordRequest) => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { success: false, message: 'Usuario no encontrado' };
    }

    try {
      const result = await dispatch(changePasswordAsync({ userId: user.idUsuario, passwordData })).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setLocalError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  // Document management
  const uploadDocument = useCallback(async (document: DocumentUploadRequest) => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { success: false, message: 'Usuario no encontrado' };
    }

    try {
      const newDocument = await dispatch(uploadDocumentAsync({ userId: user.idUsuario, document })).unwrap();
      return { success: true, document: newDocument, message: 'Documento subido exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir el documento';
      setLocalError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const fetchDocuments = useCallback(async () => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return [];
    }

    try {
      const docs = await dispatch(fetchDocumentsAsync(user.idUsuario)).unwrap();
      return docs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los documentos';
      setLocalError(errorMessage);
      return [];
    }
  }, [user?.idUsuario, dispatch]);

  const deleteDocument = useCallback(async (documentId: number) => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { success: false, message: 'Usuario no encontrado' };
    }

    try {
      await dispatch(deleteDocumentAsync({ userId: user.idUsuario, documentId })).unwrap();
      return { success: true, message: 'Documento eliminado exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el documento';
      setLocalError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  // Transaction history
  const fetchTransactionHistory = useCallback(async () => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return [];
    }

    try {
      const history = await dispatch(fetchTransactionHistoryAsync(user.idUsuario)).unwrap();
      return history;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el historial de transacciones';
      setLocalError(errorMessage);
      return [];
    }
  }, [user?.idUsuario, dispatch]);

  const fetchTransactionHistoryPaginated = useCallback(async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'fechaCreacion',
    sortDir: 'asc' | 'desc' = 'desc'
  ) => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true };
    }

    try {
      const paginatedHistory = await dispatch(fetchTransactionHistoryPaginatedAsync({
        userId: user.idUsuario,
        page,
        size,
        sortBy,
        sortDir
      })).unwrap();
      return paginatedHistory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el historial paginado';
      setLocalError(errorMessage);
      return { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true };
    }
  }, [user?.idUsuario, dispatch]);

  // Support system
  const createSupportTicket = useCallback(async (ticketData: CreateTicketRequest) => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { success: false, message: 'Usuario no encontrado' };
    }

    try {
      const newTicket = await dispatch(createSupportTicketAsync({ userId: user.idUsuario, ticketData })).unwrap();
      return { success: true, ticket: newTicket, message: 'Ticket creado exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el ticket de soporte';
      setLocalError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const fetchSupportTickets = useCallback(async () => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return [];
    }

    try {
      const tickets = await dispatch(fetchSupportTicketsAsync(user.idUsuario)).unwrap();
      return tickets;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los tickets de soporte';
      setLocalError(errorMessage);
      return [];
    }
  }, [user?.idUsuario, dispatch]);

  const fetchSupportTicketById = useCallback(async (ticketId: number) => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return null;
    }

    try {
      setLocalLoading(true);
      setLocalError(null);
      const ticket = await profileService.getSupportTicketById(user.idUsuario, ticketId);
      return ticket;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el ticket';
      setLocalError(errorMessage);
      return null;
    } finally {
      setLocalLoading(false);
    }
  }, [user?.idUsuario]);

  // Two-Factor Authentication (2FA)
  const fetch2FAStatus = useCallback(async () => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { enabled: false };
    }

    try {
      const status = await dispatch(fetch2FAStatusAsync(user.idUsuario)).unwrap();
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el estado de 2FA';
      setLocalError(errorMessage);
      return { enabled: false };
    }
  }, [user?.idUsuario, dispatch]);

  const enable2FA = useCallback(async () => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { success: false, message: 'Usuario no encontrado' };
    }

    try {
      const result = await dispatch(enable2FAAsync(user.idUsuario)).unwrap();
      return { success: true, data: result, message: '2FA habilitado exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al habilitar 2FA';
      setLocalError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const disable2FA = useCallback(async () => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { success: false, message: 'Usuario no encontrado' };
    }

    try {
      await dispatch(disable2FAAsync(user.idUsuario)).unwrap();
      return { success: true, message: '2FA deshabilitado exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al deshabilitar 2FA';
      setLocalError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const verify2FACode = useCallback(async (code: string) => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { valido: false, mensaje: 'Usuario no encontrado' };
    }

    try {
      const result = await dispatch(verify2FACodeAsync({ userId: user.idUsuario, code })).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar el código';
      setLocalError(errorMessage);
      return { valido: false, mensaje: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const generateBackupCodes = useCallback(async () => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return { success: false, message: 'Usuario no encontrado' };
    }

    try {
      setLocalLoading(true);
      setLocalError(null);
      const result = await profileService.generateBackupCodes(user.idUsuario);
      return { success: true, codigos: result.codigos };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar códigos de backup';
      setLocalError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, [user?.idUsuario]);

  // Statistics
  const fetchUserStatistics = useCallback(async () => {
    if (!user?.idUsuario) {
      setLocalError('Usuario no encontrado');
      return null;
    }

    try {
      const stats = await dispatch(fetchUserStatisticsAsync(user.idUsuario)).unwrap();
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las estadísticas';
      setLocalError(errorMessage);
      return null;
    }
  }, [user?.idUsuario, dispatch]);

  // Obtener perfil de usuario por ID
  const getUserProfile = useCallback(async (userId: number): Promise<PerfilUsuarioCompleto | null> => {
    try {
      const result = await dispatch(getUserProfileAsync(userId)).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener el perfil del usuario';
      setLocalError(errorMessage);
      return null;
    }
  }, [dispatch]);

  const clearErrorLocal = useCallback(() => {
    setLocalError(null);
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    // Combined loading states
    loading: localLoading || profileLoading || fetchingProfile || uploadingDocument || updatingProfile || changingPassword || creating2FA || creatingTicket,
    error: localError || profileError,
    
    // Redux state data
    perfilCompleto,
    documents,
    transactionHistory,
    paginatedTransactions,
    supportTickets,
    tsvStatus,
    statistics,

    // Specific loading states
    fetchingProfile,
    uploadingDocument,
    updatingProfile,
    changingPassword,
    creating2FA,
    creatingTicket,

    // Profile Actions
    updateProfile,
    changePassword,
    getUserProfile,

    // Document Actions
    uploadDocument,
    fetchDocuments,
    deleteDocument,

    // Transaction Actions
    fetchTransactionHistory,
    fetchTransactionHistoryPaginated,

    // Support Actions
    createSupportTicket,
    fetchSupportTickets,
    fetchSupportTicketById,

    // 2FA Actions
    fetch2FAStatus,
    enable2FA,
    disable2FA,
    verify2FACode,
    generateBackupCodes,

    // Statistics Actions
    fetchUserStatistics,

    // Utility Actions
    clearError: clearErrorLocal
  };
};
