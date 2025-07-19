import { useState, useCallback } from 'react';
import { useUser } from './useUser';
import {
  // Actions for state management
  setError,
  clearError,
  setGameHistory,
  setFetchingGameHistory,
  setFetchingProfile,
  setPerfilCompleto,
  clearPerfilCompleto,
  setUpdatingProfile,
  updateProfileSuccess,
  setChangingPassword,
  changePasswordSuccess,
  setUploadingDocument,
  addDocument,
  setFetchingDocuments,
  setDocuments,
  removeDocument,
  setFetchingTransactions,
  setTransactionHistory,
  setPaginatedTransactions,
  clearTransactionHistory,
  setCreatingTicket,
  addSupportTicket,
  setFetchingTickets,
  setSupportTickets,
  updateTicketStatus,
  setCreating2FA,
  setDeleting2FA,
  setVerifying2FA,
  updateTSVStatus,
  setFetchingStatistics,
  setUserStatistics,
  clearStatistics,
  resetProfileState,
  // Selectors
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
  selectFetchingDocuments,
  selectFetchingTransactions,
  selectFetchingTickets,
  selectDeleting2FA,
  selectVerifying2FA,
  selectFetchingStatistics,
  selectGameHistory,
  selectFetchigGameHistory
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
  const gameHistory = useAppSelector(selectGameHistory);

  // Loading states
  const uploadingDocument = useAppSelector(selectUploadingDocument);
  const updatingProfile = useAppSelector(selectUpdatingProfile);
  const changingPassword = useAppSelector(selectChangingPassword);
  const creating2FA = useAppSelector(selectCreating2FA);
  const creatingTicket = useAppSelector(selectCreatingTicket);
  const fetchingDocuments = useAppSelector(selectFetchingDocuments);
  const fetchingTransactions = useAppSelector(selectFetchingTransactions);
  const fetchingTickets = useAppSelector(selectFetchingTickets);
  const deleting2FA = useAppSelector(selectDeleting2FA);
  const verifying2FA = useAppSelector(selectVerifying2FA);
  const fetchingStatistics = useAppSelector(selectFetchingStatistics);
  const fetchingGameHisotry = useAppSelector(selectFetchigGameHistory);

  // Local state for additional functionality
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Profile management
  const updateProfile = useCallback(async (profileData: ActualizarPerfilRequest) => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return { success: false, message: errorMsg };
    }

    try {
      dispatch(setUpdatingProfile(true));
      await profileService.updateProfile(user.idUsuario, profileData);
      dispatch(updateProfileSuccess());
      return { success: true, message: 'Perfil actualizado exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const changePassword = useCallback(async (passwordData: CambiarPasswordRequest) => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return { success: false, message: errorMsg };
    }

    try {
      dispatch(setChangingPassword(true));
      await profileService.changePassword(user.idUsuario, passwordData);
      dispatch(changePasswordSuccess());
      return { success: true, message: 'Contraseña cambiada exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  // Document management
  const uploadDocument = useCallback(async (document: DocumentUploadRequest) => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return { success: false, message: errorMsg };
    }

    try {
      // Validate file first
      const validation = profileService.validateFile(document.file);
      if (!validation.valid) {
        const errorMsg = validation.error || 'Archivo inválido';
        setLocalError(errorMsg);
        dispatch(setError(errorMsg));
        return { success: false, message: errorMsg };
      }

      dispatch(setUploadingDocument(true));
      const newDocument = await profileService.uploadDocument(user.idUsuario, document);
      dispatch(addDocument(newDocument));
      return { success: true, document: newDocument, message: 'Documento subido exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir el documento';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const fetchDocuments = useCallback(async () => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return [];
    }

    try {
      dispatch(setFetchingDocuments(true));
      const docs = await profileService.getDocuments(user.idUsuario);
      dispatch(setDocuments(docs));
      return docs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los documentos';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return [];
    }
  }, [user?.idUsuario, dispatch]);

  const deleteDocument = useCallback(async (documentId: number) => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return { success: false, message: errorMsg };
    }

    try {
      // Optimistic update
      dispatch(removeDocument(documentId));
      await profileService.deleteDocument(user.idUsuario, documentId);
      return { success: true, message: 'Documento eliminado exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el documento';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      // Revert optimistic update by fetching documents again
      fetchDocuments();
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch, fetchDocuments]);

  // Transaction history
  const fetchTransactionHistory = useCallback(async () => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return [];
    }

    try {
      dispatch(setFetchingTransactions(true));
      const history = await profileService.getTransactionHistory(user.idUsuario);
      dispatch(setTransactionHistory(history));
      return history;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el historial de transacciones';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
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
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true };
    }

    try {
      dispatch(setFetchingTransactions(true));
      const paginatedHistory = await profileService.getTransactionHistoryPaginated(
        user.idUsuario,
        page,
        size,
        sortBy,
        sortDir
      );
      dispatch(setPaginatedTransactions({
        transactions: paginatedHistory,
        paginacion: {
          page: paginatedHistory.number,
          size: paginatedHistory.size,
          totalElements: paginatedHistory.totalElements,
          totalPages: paginatedHistory.totalPages
        }
      }));
      return paginatedHistory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el historial paginado';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true };
    }
  }, [user?.idUsuario, dispatch]);

  // Support system
  const createSupportTicket = useCallback(async (ticketData: CreateTicketRequest) => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return { success: false, message: errorMsg };
    }

    try {
      dispatch(setCreatingTicket(true));
      const newTicket = await profileService.createSupportTicket(user.idUsuario, ticketData);
      dispatch(addSupportTicket(newTicket));
      return { success: true, ticket: newTicket, message: 'Ticket creado exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el ticket de soporte';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const fetchSupportTickets = useCallback(async () => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return [];
    }

    try {
      dispatch(setFetchingTickets(true));
      const tickets = await profileService.getSupportTickets(user.idUsuario);
      dispatch(setSupportTickets(tickets));
      return tickets;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los tickets de soporte';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
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
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return { enabled: false };
    }

    try {
      const status = await profileService.get2FAConfiguration(user.idUsuario);
      dispatch(updateTSVStatus(status));
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el estado de 2FA';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return { enabled: false };
    }
  }, [user?.idUsuario, dispatch]);

  const enable2FA = useCallback(async () => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return { success: false, message: errorMsg };
    }

    try {
      dispatch(setCreating2FA(true));
      const result = await profileService.enable2FA(user.idUsuario);
      dispatch(updateTSVStatus(result));
      return { success: true, data: result, message: '2FA habilitado exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al habilitar 2FA';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const disable2FA = useCallback(async () => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return { success: false, message: errorMsg };
    }

    try {
      dispatch(setDeleting2FA(true));
      await profileService.disable2FA(user.idUsuario);
      dispatch(updateTSVStatus({ enabled: false }));
      return { success: true, message: '2FA deshabilitado exitosamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al deshabilitar 2FA';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return { success: false, message: errorMessage };
    }
  }, [user?.idUsuario, dispatch]);

  const verify2FACode = useCallback(async (code: string) => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return { valido: false, mensaje: errorMsg };
    }

    try {
      dispatch(setVerifying2FA(true));
      const result = await profileService.verify2FACode(user.idUsuario, code);
      dispatch(setVerifying2FA(false));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar el código';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
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
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return null;
    }

    try {
      dispatch(setFetchingStatistics(true));
      const stats = await profileService.getUserStatistics(user.idUsuario);
      dispatch(setUserStatistics(stats));
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las estadísticas';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return null;
    }
  }, [user?.idUsuario, dispatch]);

  // Obtener perfil de usuario por ID
  const getUserProfile = useCallback(async (userId: number): Promise<PerfilUsuarioCompleto | null> => {
    try {
      dispatch(setFetchingProfile(true));
      const result = await profileService.getUserProfile(userId);
      dispatch(setPerfilCompleto(result));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener el perfil del usuario';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return null;
    }
  }, [dispatch]);

  const clearErrorLocal = useCallback(() => {
    setLocalError(null);
    dispatch(clearError());
  }, [dispatch]);

  // Utility functions
  const clearProfileData = useCallback(() => {
    dispatch(clearPerfilCompleto());
  }, [dispatch]);

  const clearTransactionData = useCallback(() => {
    dispatch(clearTransactionHistory());
  }, [dispatch]);

  const clearStatisticsData = useCallback(() => {
    dispatch(clearStatistics());
  }, [dispatch]);

  const resetProfile = useCallback(() => {
    dispatch(resetProfileState());
    setLocalError(null);
    setLocalLoading(false);
  }, [dispatch]);

  const updateTicketStatusLocal = useCallback((ticketId: number, status: 'ABIERTO' | 'EN_PROCESO' | 'CERRADO') => {
    dispatch(updateTicketStatus({ ticketId, status }));
  }, [dispatch]);

  const fetchGameHistory = useCallback(async () => {
    if (!user?.idUsuario) {
      const errorMsg = 'Usuario no encontrado';
      setLocalError(errorMsg);
      dispatch(setError(errorMsg));
      return null;
    }

    try {
      dispatch(setFetchingGameHistory(true));
      const stats = await profileService.getUserGameHistory(user.idUsuario);
      dispatch(setGameHistory(stats));
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las estadísticas';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      return null;
    }
  }, [user?.idUsuario, dispatch]);

  return {
    user,
    // Combined loading states
    loading: localLoading || profileLoading || fetchingProfile || uploadingDocument || fetchingGameHisotry || updatingProfile || changingPassword || creating2FA || creatingTicket || fetchingDocuments || fetchingTransactions || fetchingTickets || deleting2FA || verifying2FA || fetchingStatistics,
    error: localError || profileError,

    // Redux state data
    perfilCompleto,
    documents,
    transactionHistory,
    paginatedTransactions,
    supportTickets,
    tsvStatus,
    statistics,
    gameHistory,

    // Specific loading states
    fetchingGameHisotry,
    fetchingProfile,
    uploadingDocument,
    updatingProfile,
    changingPassword,
    creating2FA,
    creatingTicket,
    fetchingDocuments,
    fetchingTransactions,
    fetchingTickets,
    deleting2FA,
    verifying2FA,
    fetchingStatistics,

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
    fetchGameHistory,

    // Utility Actions
    clearError: clearErrorLocal,
    clearProfileData,
    clearTransactionData,
    clearStatisticsData,
    resetProfile,
    updateTicketStatus: updateTicketStatusLocal
  };
};
