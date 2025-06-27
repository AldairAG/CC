// Tipos basados en las entidades del backend

// Imports de tipos existentes
import type {
  UserDocument,
  SupportTicket,
  TSVData
} from './UserProfileTypes';

import type {
  TransactionHistory,
  UserStatistics,
  PaginatedResponse
} from '../service/casino/profileService';

/**
 * Tipo basado en la entidad Perfil.java del backend
 */
export interface PerfilType {
  idPerfil: number;
  fotoPerfil?: string;
  nombre?: string;
  apellido?: string;
  fechaRegistro?: string; // ISO date string
  fechaNacimiento?: string; // ISO date string  
  telefono?: string;
  lada?: string;
  username?: string;
}

/**
 * Tipo basado en PerfilUsuarioResponse.java del backend
 * Incluye información del usuario y del perfil
 */
export interface PerfilUsuarioCompleto {
  // Datos del usuario
  idUsuario: number;
  email: string;
  saldoUsuario: number;
  estadoCuenta: boolean;
  
  // Datos del perfil
  idPerfil?: number;
  fotoPerfil?: string;
  nombre?: string;
  apellido?: string;
  fechaRegistro?: string; // ISO date string
  fechaNacimiento?: string; // ISO date string
  telefono?: string;
  lada?: string;
  username?: string;
  
  // Información adicional
  tiene2FAHabilitado: boolean;
  documentosSubidos: number;
  ultimaActividad?: string; // ISO date string
}

/**
 * Tipo para actualizar el perfil (request)
 */
export interface ActualizarPerfilRequest {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  fechaNacimiento?: string; // ISO date string (YYYY-MM-DD)
  fotoPerfil?: string;
  lada?: string;
}

/**
 * Tipo para cambiar contraseña
 */
export interface CambiarPasswordRequest {
  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

/**
 * Estado del perfil en Redux
 */
export interface ProfileState {
  loading: boolean;
  error: string | null;

  // Perfil actual del usuario
  perfilCompleto: PerfilUsuarioCompleto | null;
  
  // Otros datos del perfil
  documents: UserDocument[];
  transactionHistory: TransactionHistory[];
  paginatedTransactions: PaginatedResponse<TransactionHistory> | null;
  supportTickets: SupportTicket[];
  tsvStatus: TSVData;
  statistics: UserStatistics | null;

  // Estados de operaciones
  uploadingDocument: boolean;
  updatingProfile: boolean;
  changingPassword: boolean;
  creating2FA: boolean;
  creatingTicket: boolean;
  fetchingProfile: boolean;
}
