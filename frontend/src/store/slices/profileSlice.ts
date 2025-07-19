import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type {
    UserDocument,
    SupportTicket,
    TSVData,
    GameHistory
} from '../../types/UserProfileTypes';
import type {
    TransactionHistory,
    UserStatistics,
    PaginatedResponse
} from '../../service/casino/profileService';
import type {
    PerfilUsuarioCompleto
} from '../../types/PerfilTypes';

// State interface
interface ProfileState {
    // Data principales
    perfilCompleto: PerfilUsuarioCompleto | null;
    documents: UserDocument[];
    transactionHistory: TransactionHistory[];
    paginatedTransactions: PaginatedResponse<TransactionHistory> | null;
    supportTickets: SupportTicket[];
    tsvStatus: TSVData;
    statistics: UserStatistics | null;
    gameHistory:GameHistory[];

    // Estados de carga
    loading: {
        fetchingProfile: boolean;
        updatingProfile: boolean;
        changingPassword: boolean;
        uploadingDocument: boolean;
        fetchingDocuments: boolean;
        fetchingTransactions: boolean;
        creatingTicket: boolean;
        fetchingTickets: boolean;
        creating2FA: boolean;
        deleting2FA: boolean;
        verifying2FA: boolean;
        fetchingStatistics: boolean;
        fetchingGameHistory:boolean;
    };

    // Estados de error
    error: {
        fetchingProfile: string | null;
        updatingProfile: string | null;
        changingPassword: string | null;
        uploadingDocument: string | null;
        fetchingDocuments: string | null;
        fetchingTransactions: string | null;
        creatingTicket: string | null;
        fetchingTickets: string | null;
        creating2FA: string | null;
        deleting2FA: string | null;
        verifying2FA: string | null;
        fetchingStatistics: string | null;
        fetchingGameHistory: string | null;
    };

    // Paginación para transacciones
    paginacion: {
        transactionHistory: {
            page: number;
            size: number;
            totalElements: number;
            totalPages: number;
        };
    };

    // Configuración adicional
    configuracion: {
        pageSize: number;
    };
}

// Initial state
const initialState: ProfileState = {
    perfilCompleto: null,
    documents: [],
    transactionHistory: [],
    paginatedTransactions: null,
    supportTickets: [],
    tsvStatus: { enabled: false },
    statistics: null,
    gameHistory:[],

    loading: {
        fetchingProfile: false,
        updatingProfile: false,
        changingPassword: false,
        uploadingDocument: false,
        fetchingDocuments: false,
        fetchingTransactions: false,
        creatingTicket: false,
        fetchingTickets: false,
        creating2FA: false,
        deleting2FA: false,
        verifying2FA: false,
        fetchingStatistics: false,
        fetchingGameHistory: false,
    },

    error: {
        fetchingProfile: null,
        updatingProfile: null,
        changingPassword: null,
        uploadingDocument: null,
        fetchingDocuments: null,
        fetchingTransactions: null,
        creatingTicket: null,
        fetchingTickets: null,
        creating2FA: null,
        deleting2FA: null,
        verifying2FA: null,
        fetchingStatistics: null,
        fetchingGameHistory: null,
    },

    paginacion: {
        transactionHistory: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
        },
    },

    configuracion: {
        pageSize: 10,
    },
};

// Profile slice
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        // ========== PROFILE MANAGEMENT ==========

        // Fetching profile
        setFetchingProfile: (state, action: PayloadAction<boolean>) => {
            state.loading.fetchingProfile = action.payload;
            if (action.payload) {
                state.error.fetchingProfile = null;
            }
        },
        setPerfilCompleto: (state, action: PayloadAction<PerfilUsuarioCompleto>) => {
            state.perfilCompleto = action.payload;
            state.loading.fetchingProfile = false;
            state.error.fetchingProfile = null;
        },
        setFetchingProfileError: (state, action: PayloadAction<string>) => {
            state.error.fetchingProfile = action.payload;
            state.loading.fetchingProfile = false;
        },

        // Updating profile
        setUpdatingProfile: (state, action: PayloadAction<boolean>) => {
            state.loading.updatingProfile = action.payload;
            if (action.payload) {
                state.error.updatingProfile = null;
            }
        },
        updateProfileSuccess: (state) => {
            state.loading.updatingProfile = false;
            state.error.updatingProfile = null;
        },
        setUpdatingProfileError: (state, action: PayloadAction<string>) => {
            state.error.updatingProfile = action.payload;
            state.loading.updatingProfile = false;
        },

        // Changing password
        setChangingPassword: (state, action: PayloadAction<boolean>) => {
            state.loading.changingPassword = action.payload;
            if (action.payload) {
                state.error.changingPassword = null;
            }
        },
        changePasswordSuccess: (state) => {
            state.loading.changingPassword = false;
            state.error.changingPassword = null;
        },
        setChangingPasswordError: (state, action: PayloadAction<string>) => {
            state.error.changingPassword = action.payload;
            state.loading.changingPassword = false;
        },

        // Clear profile data
        clearPerfilCompleto: (state) => {
            state.perfilCompleto = null;
        },

        // ========== DOCUMENT MANAGEMENT ==========

        // Uploading document
        setUploadingDocument: (state, action: PayloadAction<boolean>) => {
            state.loading.uploadingDocument = action.payload;
            if (action.payload) {
                state.error.uploadingDocument = null;
            }
        },
        addDocument: (state, action: PayloadAction<UserDocument>) => {
            state.documents.push(action.payload);
            state.loading.uploadingDocument = false;
            state.error.uploadingDocument = null;
        },
        setUploadingDocumentError: (state, action: PayloadAction<string>) => {
            state.error.uploadingDocument = action.payload;
            state.loading.uploadingDocument = false;
        },

        // Fetching documents
        setFetchingDocuments: (state, action: PayloadAction<boolean>) => {
            state.loading.fetchingDocuments = action.payload;
            if (action.payload) {
                state.error.fetchingDocuments = null;
            }
        },
        setDocuments: (state, action: PayloadAction<UserDocument[]>) => {
            state.documents = action.payload;
            state.loading.fetchingDocuments = false;
            state.error.fetchingDocuments = null;
        },
        setFetchingDocumentsError: (state, action: PayloadAction<string>) => {
            state.error.fetchingDocuments = action.payload;
            state.loading.fetchingDocuments = false;
        },

        // Remove document (optimistic update)
        removeDocument: (state, action: PayloadAction<number>) => {
            state.documents = state.documents.filter(doc => doc.id !== action.payload);
        },

        // ========== TRANSACTION HISTORY ==========

        // Fetching transactions
        setFetchingTransactions: (state, action: PayloadAction<boolean>) => {
            state.loading.fetchingTransactions = action.payload;
            if (action.payload) {
                state.error.fetchingTransactions = null;
            }
        },
        setTransactionHistory: (state, action: PayloadAction<TransactionHistory[]>) => {
            state.transactionHistory = action.payload;
            state.loading.fetchingTransactions = false;
            state.error.fetchingTransactions = null;
        },
        setPaginatedTransactions: (state, action: PayloadAction<{
            transactions: PaginatedResponse<TransactionHistory>;
            paginacion: {
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            };
        }>) => {
            state.paginatedTransactions = action.payload.transactions;
            state.paginacion.transactionHistory = action.payload.paginacion;
            state.loading.fetchingTransactions = false;
            state.error.fetchingTransactions = null;
        },
        setFetchingTransactionsError: (state, action: PayloadAction<string>) => {
            state.error.fetchingTransactions = action.payload;
            state.loading.fetchingTransactions = false;
        },

        // Clear transaction history
        clearTransactionHistory: (state) => {
            state.transactionHistory = [];
            state.paginatedTransactions = null;
            state.paginacion.transactionHistory = initialState.paginacion.transactionHistory;
        },

        // ========== SUPPORT TICKETS ==========

        // Creating ticket
        setCreatingTicket: (state, action: PayloadAction<boolean>) => {
            state.loading.creatingTicket = action.payload;
            if (action.payload) {
                state.error.creatingTicket = null;
            }
        },
        addSupportTicket: (state, action: PayloadAction<SupportTicket>) => {
            state.supportTickets.unshift(action.payload);
            state.loading.creatingTicket = false;
            state.error.creatingTicket = null;
        },
        setCreatingTicketError: (state, action: PayloadAction<string>) => {
            state.error.creatingTicket = action.payload;
            state.loading.creatingTicket = false;
        },

        // Fetching tickets
        setFetchingTickets: (state, action: PayloadAction<boolean>) => {
            state.loading.fetchingTickets = action.payload;
            if (action.payload) {
                state.error.fetchingTickets = null;
            }
        },
        setSupportTickets: (state, action: PayloadAction<SupportTicket[]>) => {
            state.supportTickets = action.payload;
            state.loading.fetchingTickets = false;
            state.error.fetchingTickets = null;
        },
        setFetchingTicketsError: (state, action: PayloadAction<string>) => {
            state.error.fetchingTickets = action.payload;
            state.loading.fetchingTickets = false;
        },

        // Update ticket status
        updateTicketStatus: (state, action: PayloadAction<{ ticketId: number; status: 'ABIERTO' | 'EN_PROCESO' | 'CERRADO' }>) => {
            const ticket = state.supportTickets.find(t => t.id === action.payload.ticketId);
            if (ticket) {
                ticket.estado = action.payload.status;
            }
        },

        // ========== 2FA MANAGEMENT ==========

        // Creating 2FA
        setCreating2FA: (state, action: PayloadAction<boolean>) => {
            state.loading.creating2FA = action.payload;
            if (action.payload) {
                state.error.creating2FA = null;
            }
        },
        setCreating2FAError: (state, action: PayloadAction<string>) => {
            state.error.creating2FA = action.payload;
            state.loading.creating2FA = false;
        },

        // Deleting 2FA
        setDeleting2FA: (state, action: PayloadAction<boolean>) => {
            state.loading.deleting2FA = action.payload;
            if (action.payload) {
                state.error.deleting2FA = null;
            }
        },
        setDeleting2FAError: (state, action: PayloadAction<string>) => {
            state.error.deleting2FA = action.payload;
            state.loading.deleting2FA = false;
        },

        // Verifying 2FA
        setVerifying2FA: (state, action: PayloadAction<boolean>) => {
            state.loading.verifying2FA = action.payload;
            if (action.payload) {
                state.error.verifying2FA = null;
            }
        },
        setVerifying2FAError: (state, action: PayloadAction<string>) => {
            state.error.verifying2FA = action.payload;
            state.loading.verifying2FA = false;
        },

        // Update TSV status
        updateTSVStatus: (state, action: PayloadAction<TSVData>) => {
            state.tsvStatus = action.payload;
            state.loading.creating2FA = false;
            state.loading.deleting2FA = false;
            state.loading.verifying2FA = false;
            state.error.creating2FA = null;
            state.error.deleting2FA = null;
            state.error.verifying2FA = null;
        },

        // ========== STATISTICS ==========

        // Fetching statistics
        setFetchingStatistics: (state, action: PayloadAction<boolean>) => {
            state.loading.fetchingStatistics = action.payload;
            if (action.payload) {
                state.error.fetchingStatistics = null;
            }
        },
        setUserStatistics: (state, action: PayloadAction<UserStatistics>) => {
            state.statistics = action.payload;
            state.loading.fetchingStatistics = false;
            state.error.fetchingStatistics = null;
        },
        setFetchingStatisticsError: (state, action: PayloadAction<string>) => {
            state.error.fetchingStatistics = action.payload;
            state.loading.fetchingStatistics = false;
        },

        // Clear statistics
        clearStatistics: (state) => {
            state.statistics = null;
        },

        setFetchingGameHistory: (state, action: PayloadAction<boolean>) => {
            state.loading.fetchingStatistics = action.payload;
            if (action.payload) {
                state.error.fetchingStatistics = null;
            }
        },
        setGameHistory: (state, action: PayloadAction<GameHistory[]>) => {
            state.gameHistory = action.payload;
            state.loading.fetchingGameHistory = false;
            state.error.fetchingGameHistory = null;
        },
        setFetchingGameHistoryError: (state, action: PayloadAction<string>) => {
            state.error.fetchingGameHistory = action.payload;
            state.loading.fetchingGameHistory = false;
        },

        clearGameHistory: (state) => {
            state.gameHistory = [];
        },

        // ========== GENERAL ACTIONS ==========

        // Configuration
        setPageSize: (state, action: PayloadAction<number>) => {
            state.configuracion.pageSize = action.payload;
            state.paginacion.transactionHistory.page = 0;
            state.paginacion.transactionHistory.size = action.payload;
        },

        // Clear all errors
        clearErrors: (state) => {
            state.error = {
                fetchingProfile: null,
                updatingProfile: null,
                changingPassword: null,
                uploadingDocument: null,
                fetchingDocuments: null,
                fetchingTransactions: null,
                creatingTicket: null,
                fetchingTickets: null,
                creating2FA: null,
                deleting2FA: null,
                verifying2FA: null,
                fetchingStatistics: null,
                fetchingGameHistory:null
            };
        },

        // Clear all loading states
        clearLoading: (state) => {
            state.loading = {
                fetchingProfile: false,
                updatingProfile: false,
                changingPassword: false,
                uploadingDocument: false,
                fetchingDocuments: false,
                fetchingTransactions: false,
                creatingTicket: false,
                fetchingTickets: false,
                creating2FA: false,
                deleting2FA: false,
                verifying2FA: false,
                fetchingStatistics: false,
                fetchingGameHistory:false
            };
        },

        // Reset profile state
        resetProfileState: () => {
            return { ...initialState };
        },

        // Set individual error
        setError: (state, action: PayloadAction<string>) => {
            // For backward compatibility
            state.error.fetchingProfile = action.payload;
        },

        // Clear individual error
        clearError: (state) => {
            // For backward compatibility
            state.error.fetchingProfile = null;
        },
    },
});

// Export actions
export const {
    // Profile management
    setFetchingProfile,
    setPerfilCompleto,
    setFetchingProfileError,
    setUpdatingProfile,
    updateProfileSuccess,
    setUpdatingProfileError,
    setChangingPassword,
    changePasswordSuccess,
    setChangingPasswordError,
    clearPerfilCompleto,
    
    // Document management
    setUploadingDocument,
    addDocument,
    setUploadingDocumentError,
    setFetchingDocuments,
    setDocuments,
    setFetchingDocumentsError,
    removeDocument,
    
    // Transaction history
    setFetchingTransactions,
    setTransactionHistory,
    setPaginatedTransactions,
    setFetchingTransactionsError,
    clearTransactionHistory,
    
    // Support tickets
    setCreatingTicket,
    addSupportTicket,
    setCreatingTicketError,
    setFetchingTickets,
    setSupportTickets,
    setFetchingTicketsError,
    updateTicketStatus,
    
    // 2FA management
    setCreating2FA,
    setCreating2FAError,
    setDeleting2FA,
    setDeleting2FAError,
    setVerifying2FA,
    setVerifying2FAError,
    updateTSVStatus,
    
    // Statistics
    setFetchingStatistics,
    setUserStatistics,
    setFetchingStatisticsError,
    clearStatistics,
    
    // General actions
    setPageSize,
    clearErrors,
    clearLoading,
    resetProfileState,
    setError,
    clearError,
    setFetchingGameHistory,
    clearGameHistory,
    setFetchingGameHistoryError,
    setGameHistory
} = profileSlice.actions;

// Selectores usando createSelector para optimización
const selectProfileState = (state: { profile: ProfileState }) => state.profile;

export const profileSelector = {
    // Selectores básicos de datos
    perfilCompleto: createSelector([selectProfileState], (state) => state.perfilCompleto),
    documents: createSelector([selectProfileState], (state) => state.documents),
    transactionHistory: createSelector([selectProfileState], (state) => state.transactionHistory),
    paginatedTransactions: createSelector([selectProfileState], (state) => state.paginatedTransactions),
    supportTickets: createSelector([selectProfileState], (state) => state.supportTickets),
    tsvStatus: createSelector([selectProfileState], (state) => state.tsvStatus),
    statistics: createSelector([selectProfileState], (state) => state.statistics),
    gameHistory: createSelector([selectProfileState], (state) => state.gameHistory),

    // Selectores de loading
    loading: createSelector([selectProfileState], (state) => state.loading),
    fetchingProfile: createSelector([selectProfileState], (state) => state.loading.fetchingProfile),
    updatingProfile: createSelector([selectProfileState], (state) => state.loading.updatingProfile),
    changingPassword: createSelector([selectProfileState], (state) => state.loading.changingPassword),
    uploadingDocument: createSelector([selectProfileState], (state) => state.loading.uploadingDocument),
    fetchingDocuments: createSelector([selectProfileState], (state) => state.loading.fetchingDocuments),
    fetchingTransactions: createSelector([selectProfileState], (state) => state.loading.fetchingTransactions),
    creatingTicket: createSelector([selectProfileState], (state) => state.loading.creatingTicket),
    fetchingTickets: createSelector([selectProfileState], (state) => state.loading.fetchingTickets),
    creating2FA: createSelector([selectProfileState], (state) => state.loading.creating2FA),
    deleting2FA: createSelector([selectProfileState], (state) => state.loading.deleting2FA),
    verifying2FA: createSelector([selectProfileState], (state) => state.loading.verifying2FA),
    fetchingStatistics: createSelector([selectProfileState], (state) => state.loading.fetchingStatistics),
    fetchingGameHisotry: createSelector([selectProfileState], (state) => state.loading.fetchingGameHistory),

    // Selectores de errores
    errors: createSelector([selectProfileState], (state) => state.error),
    fetchingProfileError: createSelector([selectProfileState], (state) => state.error.fetchingProfile),
    updatingProfileError: createSelector([selectProfileState], (state) => state.error.updatingProfile),
    changingPasswordError: createSelector([selectProfileState], (state) => state.error.changingPassword),
    uploadingDocumentError: createSelector([selectProfileState], (state) => state.error.uploadingDocument),
    fetchingDocumentsError: createSelector([selectProfileState], (state) => state.error.fetchingDocuments),
    fetchingTransactionsError: createSelector([selectProfileState], (state) => state.error.fetchingTransactions),
    creatingTicketError: createSelector([selectProfileState], (state) => state.error.creatingTicket),
    fetchingTicketsError: createSelector([selectProfileState], (state) => state.error.fetchingTickets),
    creating2FAError: createSelector([selectProfileState], (state) => state.error.creating2FA),
    deleting2FAError: createSelector([selectProfileState], (state) => state.error.deleting2FA),
    verifying2FAError: createSelector([selectProfileState], (state) => state.error.verifying2FA),
    fetchingStatisticsError: createSelector([selectProfileState], (state) => state.error.fetchingStatistics),
    fetchingGameHistoryError: createSelector([selectProfileState], (state) => state.error.fetchingGameHistory),

    // Selectores de paginación
    paginacion: createSelector([selectProfileState], (state) => state.paginacion),
    paginacionTransactionHistory: createSelector([selectProfileState], (state) => state.paginacion.transactionHistory),

    // Selectores de configuración
    configuracion: createSelector([selectProfileState], (state) => state.configuracion),
    pageSize: createSelector([selectProfileState], (state) => state.configuracion.pageSize),

    // Selectores computados
    hasDocuments: createSelector([selectProfileState], (state) => state.documents.length > 0),
    hasTransactionHistory: createSelector([selectProfileState], (state) => state.transactionHistory.length > 0),
    hasSupportTickets: createSelector([selectProfileState], (state) => state.supportTickets.length > 0),
    is2FAEnabled: createSelector([selectProfileState], (state) => state.tsvStatus.enabled),
    hasStatistics: createSelector([selectProfileState], (state) => state.statistics !== null),

    // Selectores de estado general
    isLoading: createSelector([selectProfileState], (state) => 
        Object.values(state.loading).some(loading => loading)
    ),
    hasErrors: createSelector([selectProfileState], (state) => 
        Object.values(state.error).some(error => error !== null)
    ),

    // Selectores de tickets por estado
    openTickets: createSelector([selectProfileState], (state) => 
        state.supportTickets.filter(ticket => ticket.estado === 'ABIERTO')
    ),
    closedTickets: createSelector([selectProfileState], (state) => 
        state.supportTickets.filter(ticket => ticket.estado === 'CERRADO')
    ),
    processingTickets: createSelector([selectProfileState], (state) => 
        state.supportTickets.filter(ticket => ticket.estado === 'EN_PROCESO')
    ),

    // Selectores de documentos por tipo
    documentsVerified: createSelector([selectProfileState], (state) => 
        state.documents.filter(doc => doc.estado === 'APROBADO')
    ),
    documentsPending: createSelector([selectProfileState], (state) => 
        state.documents.filter(doc => doc.estado === 'PENDIENTE')
    ),
    documentsRejected: createSelector([selectProfileState], (state) => 
        state.documents.filter(doc => doc.estado === 'RECHAZADO')
    ),

    // Resumen de perfil
    profileSummary: createSelector([selectProfileState], (state) => {
        const profile = state.perfilCompleto;
        if (!profile) return null;

        return {
            isComplete: !!(profile.nombre && profile.apellido && profile.email),
            documentsCount: state.documents.length,
            verifiedDocuments: state.documents.filter(doc => doc.estado === 'APROBADO').length,
            ticketsCount: state.supportTickets.length,
            openTicketsCount: state.supportTickets.filter(ticket => ticket.estado === 'ABIERTO').length,
            has2FA: state.tsvStatus.enabled,
            transactionsCount: state.transactionHistory.length,
        };
    }),
};

// Selectores legacy para compatibilidad hacia atrás
export const selectProfile = (state: { profile: ProfileState }) => state.profile;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error.fetchingProfile;
export const selectGameHistoryError = (state: { profile: ProfileState }) => state.profile.error.fetchingGameHistory;
export const selectPerfilCompleto = (state: { profile: ProfileState }) => state.profile.perfilCompleto;
export const selectDocuments = (state: { profile: ProfileState }) => state.profile.documents;
export const selectTransactionHistory = (state: { profile: ProfileState }) => state.profile.transactionHistory;
export const selectPaginatedTransactions = (state: { profile: ProfileState }) => state.profile.paginatedTransactions;
export const selectSupportTickets = (state: { profile: ProfileState }) => state.profile.supportTickets;
export const selectTSVStatus = (state: { profile: ProfileState }) => state.profile.tsvStatus;
export const selectUserStatistics = (state: { profile: ProfileState }) => state.profile.statistics;
export const selectProfileLoading = (state: { profile: ProfileState }) => profileSelector.isLoading({ profile: state.profile });
export const selectFetchingProfile = (state: { profile: ProfileState }) => state.profile.loading.fetchingProfile;
export const selectGameHistory = (state: { profile: ProfileState }) => state.profile.gameHistory;
export const selectUpdatingProfile = (state: { profile: ProfileState }) => state.profile.loading.updatingProfile;
export const selectChangingPassword = (state: { profile: ProfileState }) => state.profile.loading.changingPassword;
export const selectUploadingDocument = (state: { profile: ProfileState }) => state.profile.loading.uploadingDocument;
export const selectFetchingDocuments = (state: { profile: ProfileState }) => state.profile.loading.fetchingDocuments;
export const selectFetchingTransactions = (state: { profile: ProfileState }) => state.profile.loading.fetchingTransactions;
export const selectCreatingTicket = (state: { profile: ProfileState }) => state.profile.loading.creatingTicket;
export const selectFetchingTickets = (state: { profile: ProfileState }) => state.profile.loading.fetchingTickets;
export const selectCreating2FA = (state: { profile: ProfileState }) => state.profile.loading.creating2FA;
export const selectDeleting2FA = (state: { profile: ProfileState }) => state.profile.loading.deleting2FA;
export const selectVerifying2FA = (state: { profile: ProfileState }) => state.profile.loading.verifying2FA;
export const selectFetchingStatistics = (state: { profile: ProfileState }) => state.profile.loading.fetchingStatistics;
export const selectFetchigGameHistory = (state: { profile: ProfileState }) => state.profile.loading.fetchingGameHistory;

export default profileSlice.reducer;
