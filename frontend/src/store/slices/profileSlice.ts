import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { profileService } from '../../service/casino/profileService';
import type {
    DocumentUploadRequest,
    UserDocument,
    SupportTicket,
    TSVData
} from '../../types/UserProfileTypes';
import type {
    TransactionHistory,
    UserStatistics,
    CreateTicketRequest,
    PaginatedResponse
} from '../../service/casino/profileService';
import type {
    PerfilUsuarioCompleto,
    ActualizarPerfilRequest,
    CambiarPasswordRequest
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
};

// Async thunks

// Profile management
export const updateProfileAsync = createAsyncThunk(
    'profile/updateProfile',
    async ({ userId, profileData }: { userId: number; profileData: ActualizarPerfilRequest }, { rejectWithValue }) => {
        try {
            await profileService.updateProfile(userId, profileData);
            return { success: true, message: 'Perfil actualizado exitosamente' };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al actualizar el perfil');
        }
    }
);

export const changePasswordAsync = createAsyncThunk(
    'profile/changePassword',
    async ({ userId, passwordData }: { userId: number; passwordData: CambiarPasswordRequest }, { rejectWithValue }) => {
        try {
            await profileService.changePassword(userId, passwordData);
            return { success: true, message: 'Contraseña cambiada exitosamente' };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al cambiar la contraseña');
        }
    }
);

// Document management
export const uploadDocumentAsync = createAsyncThunk(
    'profile/uploadDocument',
    async ({ userId, document }: { userId: number; document: DocumentUploadRequest }, { rejectWithValue }) => {
        try {
            // Validate file
            const validation = profileService.validateFile(document.file);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            const newDocument = await profileService.uploadDocument(userId, document);
            return newDocument;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al subir el documento');
        }
    }
);

export const fetchDocumentsAsync = createAsyncThunk(
    'profile/fetchDocuments',
    async (userId: number, { rejectWithValue }) => {
        try {
            const documents = await profileService.getDocuments(userId);
            return documents;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar los documentos');
        }
    }
);

export const deleteDocumentAsync = createAsyncThunk(
    'profile/deleteDocument',
    async ({ userId, documentId }: { userId: number; documentId: number }, { rejectWithValue }) => {
        try {
            await profileService.deleteDocument(userId, documentId);
            return documentId;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al eliminar el documento');
        }
    }
);

// Transaction history
export const fetchTransactionHistoryAsync = createAsyncThunk(
    'profile/fetchTransactionHistory',
    async (userId: number, { rejectWithValue }) => {
        try {
            const history = await profileService.getTransactionHistory(userId);
            return history;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar el historial de transacciones');
        }
    }
);

export const fetchTransactionHistoryPaginatedAsync = createAsyncThunk(
    'profile/fetchTransactionHistoryPaginated',
    async ({
        userId,
        page = 0,
        size = 10,
        sortBy = 'fechaCreacion',
        sortDir = 'desc' as 'asc' | 'desc'
    }: {
        userId: number;
        page?: number;
        size?: number;
        sortBy?: string;
        sortDir?: 'asc' | 'desc'
    }, { rejectWithValue }) => {
        try {
            const paginatedHistory = await profileService.getTransactionHistoryPaginated(userId, page, size, sortBy, sortDir);
            return paginatedHistory;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar el historial paginado');
        }
    }
);

// Support system
export const createSupportTicketAsync = createAsyncThunk(
    'profile/createSupportTicket',
    async ({ userId, ticketData }: { userId: number; ticketData: CreateTicketRequest }, { rejectWithValue }) => {
        try {
            const newTicket = await profileService.createSupportTicket(userId, ticketData);
            return newTicket;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al crear el ticket de soporte');
        }
    }
);

export const fetchSupportTicketsAsync = createAsyncThunk(
    'profile/fetchSupportTickets',
    async (userId: number, { rejectWithValue }) => {
        try {
            const tickets = await profileService.getSupportTickets(userId);
            return tickets;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar los tickets de soporte');
        }
    }
);

// 2FA management
export const fetch2FAStatusAsync = createAsyncThunk(
    'profile/fetch2FAStatus',
    async (userId: number, { rejectWithValue }) => {
        try {
            const status = await profileService.get2FAConfiguration(userId);
            return status;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar el estado de 2FA');
        }
    }
);

export const enable2FAAsync = createAsyncThunk(
    'profile/enable2FA',
    async (userId: number, { rejectWithValue }) => {
        try {
            const result = await profileService.enable2FA(userId);
            return result;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al habilitar 2FA');
        }
    }
);

export const disable2FAAsync = createAsyncThunk(
    'profile/disable2FA',
    async (userId: number, { rejectWithValue }) => {
        try {
            await profileService.disable2FA(userId);
            return { enabled: false };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al deshabilitar 2FA');
        }
    }
);

export const verify2FACodeAsync = createAsyncThunk(
    'profile/verify2FACode',
    async ({ userId, code }: { userId: number; code: string }, { rejectWithValue }) => {
        try {
            const result = await profileService.verify2FACode(userId, code);
            return result;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al verificar el código');
        }
    }
);

// Statistics
export const fetchUserStatisticsAsync = createAsyncThunk(
    'profile/fetchUserStatistics',
    async (userId: number, { rejectWithValue }) => {
        try {
            const stats = await profileService.getUserStatistics(userId);
            return stats;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar las estadísticas');
        }
    }
);

// Get user profile by ID
export const getUserProfileAsync = createAsyncThunk(
    'profile/getUserProfile',
    async (userId: number, { rejectWithValue }) => {
        try {
            const profile = await profileService.getUserProfile(userId);
            return profile;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener el perfil del usuario');
        }
    }
);

// Profile slice
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Clear loading states
        clearLoading: (state) => {
            state.loading = false;
            state.uploadingDocument = false;
            state.updatingProfile = false;
            state.changingPassword = false;
            state.creating2FA = false;
            state.creatingTicket = false;
        },

        // Reset profile state
        resetProfileState: () => {
            return { ...initialState };
        },

        // Clear profile data
        clearPerfilCompleto: (state) => {
            state.perfilCompleto = null;
        },

        // Update TSV status locally
        updateTSVStatus: (state, action: PayloadAction<TSVData>) => {
            state.tsvStatus = action.payload;
        },

        // Remove document locally (optimistic update)
        removeDocumentOptimistic: (state, action: PayloadAction<number>) => {
            state.documents = state.documents.filter(doc => doc.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        // Update profile
        builder
            .addCase(updateProfileAsync.pending, (state) => {
                state.updatingProfile = true;
                state.error = null;
            })
            .addCase(updateProfileAsync.fulfilled, (state) => {
                state.updatingProfile = false;
            })
            .addCase(updateProfileAsync.rejected, (state, action) => {
                state.updatingProfile = false;
                state.error = action.payload as string;
            });

        // Change password
        builder
            .addCase(changePasswordAsync.pending, (state) => {
                state.changingPassword = true;
                state.error = null;
            })
            .addCase(changePasswordAsync.fulfilled, (state) => {
                state.changingPassword = false;
            })
            .addCase(changePasswordAsync.rejected, (state, action) => {
                state.changingPassword = false;
                state.error = action.payload as string;
            });

        // Upload document
        builder
            .addCase(uploadDocumentAsync.pending, (state) => {
                state.uploadingDocument = true;
                state.error = null;
            })
            .addCase(uploadDocumentAsync.fulfilled, (state, action) => {
                state.uploadingDocument = false;
                state.documents.push(action.payload);
            })
            .addCase(uploadDocumentAsync.rejected, (state, action) => {
                state.uploadingDocument = false;
                state.error = action.payload as string;
            });

        // Fetch documents
        builder
            .addCase(fetchDocumentsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocumentsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload;
            })
            .addCase(fetchDocumentsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete document
        builder
            .addCase(deleteDocumentAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDocumentAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = state.documents.filter(doc => doc.id !== action.payload);
            })
            .addCase(deleteDocumentAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                // Restore document if deletion failed (revert optimistic update)
            });

        // Fetch transaction history
        builder
            .addCase(fetchTransactionHistoryAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionHistoryAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.transactionHistory = action.payload;
            })
            .addCase(fetchTransactionHistoryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch paginated transaction history
        builder
            .addCase(fetchTransactionHistoryPaginatedAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionHistoryPaginatedAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.paginatedTransactions = action.payload;
            })
            .addCase(fetchTransactionHistoryPaginatedAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create support ticket
        builder
            .addCase(createSupportTicketAsync.pending, (state) => {
                state.creatingTicket = true;
                state.error = null;
            })
            .addCase(createSupportTicketAsync.fulfilled, (state, action) => {
                state.creatingTicket = false;
                state.supportTickets.unshift(action.payload);
            })
            .addCase(createSupportTicketAsync.rejected, (state, action) => {
                state.creatingTicket = false;
                state.error = action.payload as string;
            });

        // Fetch support tickets
        builder
            .addCase(fetchSupportTicketsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSupportTicketsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.supportTickets = action.payload;
            })
            .addCase(fetchSupportTicketsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch 2FA status
        builder
            .addCase(fetch2FAStatusAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetch2FAStatusAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.tsvStatus = action.payload;
            })
            .addCase(fetch2FAStatusAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Enable 2FA
        builder
            .addCase(enable2FAAsync.pending, (state) => {
                state.creating2FA = true;
                state.error = null;
            })
            .addCase(enable2FAAsync.fulfilled, (state, action) => {
                state.creating2FA = false;
                state.tsvStatus = action.payload;
            })
            .addCase(enable2FAAsync.rejected, (state, action) => {
                state.creating2FA = false;
                state.error = action.payload as string;
            });

        // Disable 2FA
        builder
            .addCase(disable2FAAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(disable2FAAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.tsvStatus = action.payload;
            })
            .addCase(disable2FAAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Verify 2FA code
        builder
            .addCase(verify2FACodeAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verify2FACodeAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verify2FACodeAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch user statistics
        builder
            .addCase(fetchUserStatisticsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserStatisticsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload;
            })
            .addCase(fetchUserStatisticsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Get user profile by ID
        builder
            .addCase(getUserProfileAsync.pending, (state) => {
                state.fetchingProfile = true;
                state.error = null;
            })
            .addCase(getUserProfileAsync.fulfilled, (state, action) => {
                state.fetchingProfile = false;
                state.perfilCompleto = action.payload;
            })
            .addCase(getUserProfileAsync.rejected, (state, action) => {
                state.fetchingProfile = false;
                state.error = action.payload as string;
            });
    },
});

// Export actions
export const {
    clearError,
    clearLoading,
    resetProfileState,
    clearPerfilCompleto,
    updateTSVStatus,
    removeDocumentOptimistic
} = profileSlice.actions;

// Selectors
export const selectProfile = (state: { profile: ProfileState }) => state.profile;
export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.loading;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;
export const selectPerfilCompleto = (state: { profile: ProfileState }) => state.profile.perfilCompleto;
export const selectDocuments = (state: { profile: ProfileState }) => state.profile.documents;
export const selectTransactionHistory = (state: { profile: ProfileState }) => state.profile.transactionHistory;
export const selectPaginatedTransactions = (state: { profile: ProfileState }) => state.profile.paginatedTransactions;
export const selectSupportTickets = (state: { profile: ProfileState }) => state.profile.supportTickets;
export const selectTSVStatus = (state: { profile: ProfileState }) => state.profile.tsvStatus;
export const selectUserStatistics = (state: { profile: ProfileState }) => state.profile.statistics;

// Loading selectors
export const selectUploadingDocument = (state: { profile: ProfileState }) => state.profile.uploadingDocument;
export const selectUpdatingProfile = (state: { profile: ProfileState }) => state.profile.updatingProfile;
export const selectChangingPassword = (state: { profile: ProfileState }) => state.profile.changingPassword;
export const selectCreating2FA = (state: { profile: ProfileState }) => state.profile.creating2FA;
export const selectCreatingTicket = (state: { profile: ProfileState }) => state.profile.creatingTicket;
export const selectFetchingProfile = (state: { profile: ProfileState }) => state.profile.fetchingProfile;

export default profileSlice.reducer;
