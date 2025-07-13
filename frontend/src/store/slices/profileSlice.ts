import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
    UserDocument,
    SupportTicket,
    TSVData
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
    loading: boolean;
    error: string | null;

    // Perfil completo del usuario
    perfilCompleto: PerfilUsuarioCompleto | null;

    // Profile data
    documents: UserDocument[];
    transactionHistory: TransactionHistory[];
    paginatedTransactions: PaginatedResponse<TransactionHistory> | null;
    supportTickets: SupportTicket[];
    tsvStatus: TSVData;
    statistics: UserStatistics | null;

    // Operation states
    uploadingDocument: boolean;
    updatingProfile: boolean;
    changingPassword: boolean;
    creating2FA: boolean;
    creatingTicket: boolean;
    fetchingProfile: boolean;
    fetchingDocuments: boolean;
    fetchingTransactions: boolean;
    fetchingTickets: boolean;
    fetchingStatistics: boolean;
    deleting2FA: boolean;
    verifying2FA: boolean;
}

// Initial state
const initialState: ProfileState = {
    loading: false,
    error: null,

    perfilCompleto: null,

    documents: [],
    transactionHistory: [],
    paginatedTransactions: null,
    supportTickets: [],
    tsvStatus: { enabled: false },
    statistics: null,

    uploadingDocument: false,
    updatingProfile: false,
    changingPassword: false,
    creating2FA: false,
    creatingTicket: false,
    fetchingProfile: false,
    fetchingDocuments: false,
    fetchingTransactions: false,
    fetchingTickets: false,
    fetchingStatistics: false,
    deleting2FA: false,
    verifying2FA: false,
};

// Profile slice
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        // ========== GENERAL ACTIONS ==========
        
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Set error
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },

        // Clear loading states
        clearLoading: (state) => {
            state.loading = false;
            state.uploadingDocument = false;
            state.updatingProfile = false;
            state.changingPassword = false;
            state.creating2FA = false;
            state.creatingTicket = false;
            state.fetchingProfile = false;
            state.fetchingDocuments = false;
            state.fetchingTransactions = false;
            state.fetchingTickets = false;
            state.fetchingStatistics = false;
            state.deleting2FA = false;
            state.verifying2FA = false;
        },

        // Reset profile state
        resetProfileState: () => {
            return { ...initialState };
        },

        // ========== PROFILE MANAGEMENT ==========

        // Set loading state for fetching profile
        setFetchingProfile: (state, action: PayloadAction<boolean>) => {
            state.fetchingProfile = action.payload;
            if (action.payload) state.error = null;
        },

        // Set profile data
        setPerfilCompleto: (state, action: PayloadAction<PerfilUsuarioCompleto>) => {
            state.perfilCompleto = action.payload;
            state.fetchingProfile = false;
            state.loading=false;
        },

        // Clear profile data
        clearPerfilCompleto: (state) => {
            state.perfilCompleto = null;
        },

        // Set updating profile state
        setUpdatingProfile: (state, action: PayloadAction<boolean>) => {
            state.updatingProfile = action.payload;
            if (action.payload) state.error = null;
        },

        // Update profile success
        updateProfileSuccess: (state) => {
            state.updatingProfile = false;
        },

        // Set changing password state
        setChangingPassword: (state, action: PayloadAction<boolean>) => {
            state.changingPassword = action.payload;
            if (action.payload) state.error = null;
        },

        // Change password success
        changePasswordSuccess: (state) => {
            state.changingPassword = false;
        },

        // ========== DOCUMENT MANAGEMENT ==========

        // Set uploading document state
        setUploadingDocument: (state, action: PayloadAction<boolean>) => {
            state.uploadingDocument = action.payload;
            if (action.payload) state.error = null;
        },

        // Add document
        addDocument: (state, action: PayloadAction<UserDocument>) => {
            state.documents.push(action.payload);
            state.uploadingDocument = false;
        },

        // Set fetching documents state
        setFetchingDocuments: (state, action: PayloadAction<boolean>) => {
            state.fetchingDocuments = action.payload;
            if (action.payload) state.error = null;
        },

        // Set documents
        setDocuments: (state, action: PayloadAction<UserDocument[]>) => {
            state.documents = action.payload;
            state.fetchingDocuments = false;
        },

        // Remove document (optimistic update)
        removeDocument: (state, action: PayloadAction<number>) => {
            state.documents = state.documents.filter(doc => doc.id !== action.payload);
        },

        // ========== TRANSACTION HISTORY ==========

        // Set fetching transactions state
        setFetchingTransactions: (state, action: PayloadAction<boolean>) => {
            state.fetchingTransactions = action.payload;
            if (action.payload) state.error = null;
        },

        // Set transaction history
        setTransactionHistory: (state, action: PayloadAction<TransactionHistory[]>) => {
            state.transactionHistory = action.payload;
            state.fetchingTransactions = false;
        },

        // Set paginated transactions
        setPaginatedTransactions: (state, action: PayloadAction<PaginatedResponse<TransactionHistory>>) => {
            state.paginatedTransactions = action.payload;
            state.fetchingTransactions = false;
        },

        // Clear transaction history
        clearTransactionHistory: (state) => {
            state.transactionHistory = [];
            state.paginatedTransactions = null;
        },

        // ========== SUPPORT TICKETS ==========

        // Set creating ticket state
        setCreatingTicket: (state, action: PayloadAction<boolean>) => {
            state.creatingTicket = action.payload;
            if (action.payload) state.error = null;
        },

        // Add support ticket
        addSupportTicket: (state, action: PayloadAction<SupportTicket>) => {
            state.supportTickets.unshift(action.payload);
            state.creatingTicket = false;
        },

        // Set fetching tickets state
        setFetchingTickets: (state, action: PayloadAction<boolean>) => {
            state.fetchingTickets = action.payload;
            if (action.payload) state.error = null;
        },

        // Set support tickets
        setSupportTickets: (state, action: PayloadAction<SupportTicket[]>) => {
            state.supportTickets = action.payload;
            state.fetchingTickets = false;
        },

        // Update ticket status
        updateTicketStatus: (state, action: PayloadAction<{ ticketId: number; status: 'ABIERTO' | 'EN_PROCESO' | 'CERRADO' }>) => {
            const ticket = state.supportTickets.find(t => t.id === action.payload.ticketId);
            if (ticket) {
                ticket.estado = action.payload.status;
            }
        },

        // ========== 2FA MANAGEMENT ==========

        // Set creating 2FA state
        setCreating2FA: (state, action: PayloadAction<boolean>) => {
            state.creating2FA = action.payload;
            if (action.payload) state.error = null;
        },

        // Set deleting 2FA state
        setDeleting2FA: (state, action: PayloadAction<boolean>) => {
            state.deleting2FA = action.payload;
            if (action.payload) state.error = null;
        },

        // Set verifying 2FA state
        setVerifying2FA: (state, action: PayloadAction<boolean>) => {
            state.verifying2FA = action.payload;
            if (action.payload) state.error = null;
        },

        // Update TSV status
        updateTSVStatus: (state, action: PayloadAction<TSVData>) => {
            state.tsvStatus = action.payload;
            state.creating2FA = false;
            state.deleting2FA = false;
            state.verifying2FA = false;
        },

        // ========== STATISTICS ==========

        // Set fetching statistics state
        setFetchingStatistics: (state, action: PayloadAction<boolean>) => {
            state.fetchingStatistics = action.payload;
            if (action.payload) state.error = null;
        },

        // Set user statistics
        setUserStatistics: (state, action: PayloadAction<UserStatistics>) => {
            state.statistics = action.payload;
            state.fetchingStatistics = false;
        },

        // Clear statistics
        clearStatistics: (state) => {
            state.statistics = null;
        },
    },
});

// Export actions
export const {
    clearError,
    setError,
    clearLoading,
    resetProfileState,
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
    clearStatistics
} = profileSlice.actions;

// Selectors
export const selectProfile = (state: { profile: ProfileState }) => state.profile;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;

// Profile data selectors
export const selectPerfilCompleto = (state: { profile: ProfileState }) => state.profile.perfilCompleto;
export const selectDocuments = (state: { profile: ProfileState }) => state.profile.documents;
export const selectTransactionHistory = (state: { profile: ProfileState }) => state.profile.transactionHistory;
export const selectPaginatedTransactions = (state: { profile: ProfileState }) => state.profile.paginatedTransactions;
export const selectSupportTickets = (state: { profile: ProfileState }) => state.profile.supportTickets;
export const selectTSVStatus = (state: { profile: ProfileState }) => state.profile.tsvStatus;
export const selectUserStatistics = (state: { profile: ProfileState }) => state.profile.statistics;

// Loading state selectors
export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.loading;
export const selectFetchingProfile = (state: { profile: ProfileState }) => state.profile.fetchingProfile;
export const selectUpdatingProfile = (state: { profile: ProfileState }) => state.profile.updatingProfile;
export const selectChangingPassword = (state: { profile: ProfileState }) => state.profile.changingPassword;
export const selectUploadingDocument = (state: { profile: ProfileState }) => state.profile.uploadingDocument;
export const selectFetchingDocuments = (state: { profile: ProfileState }) => state.profile.fetchingDocuments;
export const selectFetchingTransactions = (state: { profile: ProfileState }) => state.profile.fetchingTransactions;
export const selectCreatingTicket = (state: { profile: ProfileState }) => state.profile.creatingTicket;
export const selectFetchingTickets = (state: { profile: ProfileState }) => state.profile.fetchingTickets;
export const selectCreating2FA = (state: { profile: ProfileState }) => state.profile.creating2FA;
export const selectDeleting2FA = (state: { profile: ProfileState }) => state.profile.deleting2FA;
export const selectVerifying2FA = (state: { profile: ProfileState }) => state.profile.verifying2FA;
export const selectFetchingStatistics = (state: { profile: ProfileState }) => state.profile.fetchingStatistics;

export default profileSlice.reducer;
