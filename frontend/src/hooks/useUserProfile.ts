import { useState, useCallback } from 'react';
import { useUser } from './useUser';
import type { 
  UserProfileUpdate, 
  PasswordChange, 
  DocumentUploadRequest, 
  UserDocument, 
  GameHistory, 
  SupportTicket, 
  TSVData
} from '../types/UserProfileTypes';

// Mock service - En producción esto sería un servicio real
const userProfileService = {
  updateProfile: async (data: UserProfileUpdate) => {
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Perfil actualizado correctamente' };
  },

  changePassword: async (data: PasswordChange) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Contraseña actualizada correctamente' };
  },

  uploadDocument: async (document: DocumentUploadRequest) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      id: Date.now(),
      tipo: document.type,
      nombreArchivo: document.file.name,
      fechaSubida: new Date().toISOString(),
      estado: 'PENDIENTE' as const
    };
  },

  getDocuments: async (): Promise<UserDocument[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        tipo: 'INE',
        nombreArchivo: 'ine_frontal.jpg',
        fechaSubida: '2024-01-15T10:30:00Z',
        estado: 'APROBADO'
      },
      {
        id: 2,
        tipo: 'COMPROBANTE_DOMICILIO',
        nombreArchivo: 'comprobante_luz.pdf',
        fechaSubida: '2024-01-16T14:20:00Z',
        estado: 'PENDIENTE'
      }
    ];
  },
  getGameHistory: async (type?: string): Promise<GameHistory[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        tipo: 'APUESTA',
        fecha: '2024-01-20T18:30:00Z',
        descripcion: 'Apuesta Fútbol - Real Madrid vs Barcelona',
        monto: 500,
        resultado: 'Ganada',
        estado: 'COMPLETADA'
      },
      {
        id: 2,
        tipo: 'CASINO',
        fecha: '2024-01-19T20:15:00Z',
        descripcion: 'Ruleta - Mesa 1',
        monto: 200,
        resultado: 'Perdida',
        estado: 'COMPLETADA'
      },
      {
        id: 3,
        tipo: 'QUINIELA',
        fecha: '2024-01-18T16:45:00Z',
        descripcion: 'Quiniela Liga MX - Jornada 5',
        monto: 100,
        resultado: 'Ganada',
        estado: 'COMPLETADA'
      }
    ];
  },

  createSupportTicket: async (ticket: Omit<SupportTicket, 'id' | 'fechaCreacion' | 'estado'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      ...ticket,
      id: Date.now(),
      estado: 'ABIERTO' as const,
      fechaCreacion: new Date().toISOString()
    };
  },

  getSupportTickets: async (): Promise<SupportTicket[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        asunto: 'Problema con el depósito',
        descripcion: 'No se reflejó mi depósito de $1000',
        categoria: 'CUENTA',
        estado: 'EN_PROCESO',
        fechaCreacion: '2024-01-20T10:00:00Z',
        fechaActualizacion: '2024-01-20T14:30:00Z'
      }
    ];
  },

  getTSVStatus: async (): Promise<TSVData> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      enabled: false,
      secret: undefined,
      qrCode: undefined
    };
  },

  enableTSV: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      enabled: true,
      secret: 'JBSWY3DPEHPK3PXP',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    };
  },

  disableTSV: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { enabled: false };
  }
};

export const useUserProfile = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [tsvStatus, setTsvStatus] = useState<TSVData>({ enabled: false });

  // Profile management
  const updateProfile = useCallback(async (profileData: UserProfileUpdate) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userProfileService.updateProfile(profileData);
      return result;
    } catch (err) {
      setError('Error al actualizar el perfil');
      return { success: false, message: 'Error al actualizar el perfil' };
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (passwordData: PasswordChange) => {
    try {
      setLoading(true);
      setError(null);
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }      const result = await userProfileService.changePassword(passwordData);
      return result;    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Document management
  const uploadDocument = useCallback(async (document: DocumentUploadRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newDocument = await userProfileService.uploadDocument(document);
      setDocuments(prev => [...prev, newDocument]);
      return { success: true, document: newDocument };    } catch {
      setError('Error al subir el documento');
      return { success: false, message: 'Error al subir el documento' };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await userProfileService.getDocuments();
      setDocuments(docs);
      return docs;    } catch {
      setError('Error al cargar los documentos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Game history
  const fetchGameHistory = useCallback(async (type?: string) => {
    try {
      setLoading(true);
      setError(null);
      const history = await userProfileService.getGameHistory(type);
      setGameHistory(history);
      return history;    } catch {
      setError('Error al cargar el historial de juegos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Support system
  const createSupportTicket = useCallback(async (ticketData: Omit<SupportTicket, 'id' | 'fechaCreacion' | 'estado'>) => {
    try {
      setLoading(true);
      setError(null);
      const newTicket = await userProfileService.createSupportTicket(ticketData);
      setSupportTickets(prev => [newTicket, ...prev]);
      return { success: true, ticket: newTicket };    } catch {
      setError('Error al crear el ticket de soporte');
      return { success: false, message: 'Error al crear el ticket de soporte' };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSupportTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tickets = await userProfileService.getSupportTickets();
      setSupportTickets(tickets);
      return tickets;    } catch {
      setError('Error al cargar los tickets de soporte');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Two-Factor Authentication (TSV)
  const fetchTSVStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await userProfileService.getTSVStatus();
      setTsvStatus(status);
      return status;    } catch {
      setError('Error al cargar el estado de TSV');
      return { enabled: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const enableTSV = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userProfileService.enableTSV();
      setTsvStatus(result);
      return { success: true, data: result };    } catch {
      setError('Error al habilitar TSV');
      return { success: false, message: 'Error al habilitar TSV' };
    } finally {
      setLoading(false);
    }
  }, []);

  const disableTSV = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userProfileService.disableTSV();
      setTsvStatus(result);
      return { success: true };    } catch {
      setError('Error al deshabilitar TSV');
      return { success: false, message: 'Error al deshabilitar TSV' };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    documents,
    gameHistory,
    supportTickets,
    tsvStatus,
    
    // Actions
    updateProfile,
    changePassword,
    uploadDocument,
    fetchDocuments,
    fetchGameHistory,
    createSupportTicket,
    fetchSupportTickets,
    fetchTSVStatus,
    enableTSV,
    disableTSV,
    clearError
  };
};
