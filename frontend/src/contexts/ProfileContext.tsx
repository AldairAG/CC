import React, { createContext, useContext } from 'react';
import type { UserType } from '../types/UserTypes';
import type {
  DocumentUploadRequest,
  UserDocument,
  SupportTicket,
  TSVData
} from '../types/UserProfileTypes';
import type { 
  TransactionHistory, 
  UserStatistics, 
  CreateTicketRequest 
} from '../service/casino/profileService';
import type {
  PerfilUsuarioCompleto,
  ActualizarPerfilRequest,
  CambiarPasswordRequest
} from '../types/PerfilTypes';

// Context type definition
interface ProfileContextType {
  // User data
  user: UserType | null;
  loading: boolean;
  error: string | null;
  
  // Profile data
  documents: UserDocument[];
  transactionHistory: TransactionHistory[];
  supportTickets: SupportTicket[];
  tsvStatus: TSVData;
  statistics: UserStatistics | null;
  
  // Profile actions
  updateProfile: (profileData: ActualizarPerfilRequest) => Promise<{ success: boolean; message: string; }>;
  changePassword: (passwordData: CambiarPasswordRequest) => Promise<{ success: boolean; message: string; }>;
  getUserProfile: (userId: number) => Promise<PerfilUsuarioCompleto | null>;
  // Document actions
  uploadDocument: (document: DocumentUploadRequest) => Promise<{ success: boolean; message: string; document?: UserDocument; }>;
  fetchDocuments: () => Promise<UserDocument[]>;
  deleteDocument: (documentId: number) => Promise<{ success: boolean; message: string; }>;
  
  // Transaction actions
  fetchTransactionHistory: () => Promise<TransactionHistory[]>;
  fetchTransactionHistoryPaginated: (page?: number, size?: number, sortBy?: string, sortDir?: 'asc' | 'desc') => Promise<{ content: TransactionHistory[]; totalElements: number; totalPages: number; size: number; number: number; first: boolean; last: boolean; }>;
  
  // Support actions
  createSupportTicket: (ticketData: CreateTicketRequest) => Promise<{ success: boolean; message: string; ticket?: SupportTicket; }>;
  fetchSupportTickets: () => Promise<SupportTicket[]>;
  fetchSupportTicketById: (ticketId: number) => Promise<SupportTicket | null>;
  
  // 2FA actions
  fetch2FAStatus: () => Promise<TSVData>;
  enable2FA: () => Promise<{ success: boolean; message: string; data?: TSVData; }>;
  disable2FA: () => Promise<{ success: boolean; message: string; }>;
  verify2FACode: (code: string) => Promise<{ valido: boolean; mensaje?: string; }>;
  generateBackupCodes: () => Promise<{ success: boolean; codigos?: string; message?: string; }>;
  
  // Statistics actions
  fetchUserStatistics: () => Promise<UserStatistics | null>;
  
  // Utility actions
  clearError: () => void;
}

// Create context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider component
export const ProfileProvider: React.FC<{ 
  children: React.ReactNode; 
  value: ProfileContextType 
}> = ({ children, value }) => {
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the context
export const useProfileContext = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};

export default ProfileContext;
