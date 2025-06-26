export interface UserProfileUpdate {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  lada?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DocumentUploadRequest {
  type: 'INE' | 'COMPROBANTE_DOMICILIO';
  file: File;
}

export interface UserDocument {
  id: number;
  tipo: string;
  nombreArchivo: string;
  fechaSubida: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  url?: string;
}

export interface GameHistory {
  id: number;
  tipo: 'APUESTA' | 'CASINO' | 'QUINIELA';
  fecha: string;
  descripcion: string;
  monto: number;
  resultado: string;
  estado: string;
}

export interface SupportTicket {
  id: number;
  asunto: string;
  descripcion: string;
  categoria: 'TECNICO' | 'CUENTA' | 'JUEGO' | 'OTRO';
  estado: 'ABIERTO' | 'EN_PROCESO' | 'CERRADO';
  fechaCreacion: string;
  fechaActualizacion?: string;
  respuestas?: SupportMessage[];
}

export interface SupportMessage {
  id: number;
  mensaje: string;
  autor: 'USUARIO' | 'SOPORTE';
  fecha: string;
}

export interface TSVData {
  enabled: boolean;
  secret?: string;
  qrCode?: string;
}
