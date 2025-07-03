import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import type {
    SimpleSportType,
    SimpleLeagueType,
    SimpleTeamType,
    TheSportsDBState
} from "../../types/TheSportsDBTypes";
import type { RootState } from '../store';

/**
 * Estado inicial del slice de TheSportsDB
 */
const initialState: TheSportsDBState = {
    // Datos
    sports: [],
    leagues: [],
    teams: [],
    
    // Estados de carga
    sportsLoading: false,
    leaguesLoading: false,
    teamsLoading: false,
    
    // Errores
    sportsError: null,
    leaguesError: null,
    teamsError: null,
    
    // Cache
    lastSportsUpdate: null,
    lastLeaguesUpdate: null,
    lastTeamsUpdate: null,
    
    // Filtros activos
    selectedSport: null,
    selectedLeague: null,
};

/**
 * Slice de Redux para manejar el estado de TheSportsDB
 */
const theSportsDBSlice = createSlice({
    name: 'theSportsDB',
    initialState,
    reducers: {
        // ===== DEPORTES =====
        setSportsLoading: (state, action: PayloadAction<boolean>) => {
            state.sportsLoading = action.payload;
            if (action.payload) {
                state.sportsError = null;
            }
        },
        
        setSports: (state, action: PayloadAction<SimpleSportType[]>) => {
            state.sports = action.payload;
            state.sportsLoading = false;
            state.sportsError = null;
            state.lastSportsUpdate = new Date().toISOString();
        },
        
        setSportsError: (state, action: PayloadAction<string>) => {
            state.sportsError = action.payload;
            state.sportsLoading = false;
        },
        
        clearSports: (state) => {
            state.sports = [];
            state.sportsError = null;
            state.lastSportsUpdate = null;
        },

        // ===== LIGAS =====
        setLeaguesLoading: (state, action: PayloadAction<boolean>) => {
            state.leaguesLoading = action.payload;
            if (action.payload) {
                state.leaguesError = null;
            }
        },
        
        setLeagues: (state, action: PayloadAction<SimpleLeagueType[]>) => {
            state.leagues = action.payload;
            state.leaguesLoading = false;
            state.leaguesError = null;
            state.lastLeaguesUpdate = new Date().toISOString();
        },
        
        setLeaguesError: (state, action: PayloadAction<string>) => {
            state.leaguesError = action.payload;
            state.leaguesLoading = false;
        },
        
        clearLeagues: (state) => {
            state.leagues = [];
            state.leaguesError = null;
            state.lastLeaguesUpdate = null;
        },

        // ===== EQUIPOS =====
        setTeamsLoading: (state, action: PayloadAction<boolean>) => {
            state.teamsLoading = action.payload;
            if (action.payload) {
                state.teamsError = null;
            }
        },
        
        setTeams: (state, action: PayloadAction<SimpleTeamType[]>) => {
            state.teams = action.payload;
            state.teamsLoading = false;
            state.teamsError = null;
            state.lastTeamsUpdate = new Date().toISOString();
        },
        
        setTeamsError: (state, action: PayloadAction<string>) => {
            state.teamsError = action.payload;
            state.teamsLoading = false;
        },
        
        clearTeams: (state) => {
            state.teams = [];
            state.teamsError = null;
            state.lastTeamsUpdate = null;
        },

        // ===== FILTROS =====
        setSelectedSport: (state, action: PayloadAction<string | null>) => {
            state.selectedSport = action.payload;
            // Limpiar liga seleccionada cuando cambie el deporte
            if (action.payload !== state.selectedSport) {
                state.selectedLeague = null;
            }
        },
        
        setSelectedLeague: (state, action: PayloadAction<string | null>) => {
            state.selectedLeague = action.payload;
        },
        
        clearFilters: (state) => {
            state.selectedSport = null;
            state.selectedLeague = null;
        },

        // ===== LIMPIAR TODO =====
        clearAllData: (state) => {
            state.sports = [];
            state.leagues = [];
            state.teams = [];
            state.sportsError = null;
            state.leaguesError = null;
            state.teamsError = null;
            state.lastSportsUpdate = null;
            state.lastLeaguesUpdate = null;
            state.lastTeamsUpdate = null;
            state.selectedSport = null;
            state.selectedLeague = null;
        },

        // ===== RESETEAR ESTADO =====
        resetTheSportsDBState: () => initialState,
    },
});

// ===== EXPORTAR ACCIONES =====
export const {
    setSportsLoading,
    setSports,
    setSportsError,
    clearSports,
    setLeaguesLoading,
    setLeagues,
    setLeaguesError,
    clearLeagues,
    setTeamsLoading,
    setTeams,
    setTeamsError,
    clearTeams,
    setSelectedSport,
    setSelectedLeague,
    clearFilters,
    clearAllData,
    resetTheSportsDBState,
} = theSportsDBSlice.actions;

// ===== SELECTORES BASE =====
const selectTheSportsDBState = (state: RootState) => state.theSportsDB;

// ===== SELECTORES MEMOIZADOS =====
export const theSportsDBSelector = {
    // Datos
    sports: createSelector([selectTheSportsDBState], (state) => state.sports),
    leagues: createSelector([selectTheSportsDBState], (state) => state.leagues),
    teams: createSelector([selectTheSportsDBState], (state) => state.teams),
    
    // Estados de carga
    sportsLoading: createSelector([selectTheSportsDBState], (state) => state.sportsLoading),
    leaguesLoading: createSelector([selectTheSportsDBState], (state) => state.leaguesLoading),
    teamsLoading: createSelector([selectTheSportsDBState], (state) => state.teamsLoading),
    
    // Errores
    sportsError: createSelector([selectTheSportsDBState], (state) => state.sportsError),
    leaguesError: createSelector([selectTheSportsDBState], (state) => state.leaguesError),
    teamsError: createSelector([selectTheSportsDBState], (state) => state.teamsError),
    
    // Filtros
    selectedSport: createSelector([selectTheSportsDBState], (state) => state.selectedSport),
    selectedLeague: createSelector([selectTheSportsDBState], (state) => state.selectedLeague),
    
    // Cache
    lastSportsUpdate: createSelector([selectTheSportsDBState], (state) => state.lastSportsUpdate),
    lastLeaguesUpdate: createSelector([selectTheSportsDBState], (state) => state.lastLeaguesUpdate),
    lastTeamsUpdate: createSelector([selectTheSportsDBState], (state) => state.lastTeamsUpdate),
    
    // Selectores derivados
    leaguesBySport: createSelector(
        [selectTheSportsDBState],
        (state) => {
            if (!state.selectedSport) return state.leagues;
            return state.leagues.filter((league: SimpleLeagueType) => 
                league.sport.toLowerCase() === state.selectedSport?.toLowerCase()
            );
        }
    ),
    
    teamsByLeague: createSelector(
        [selectTheSportsDBState],
        (state) => {
            if (!state.selectedLeague) return state.teams;
            return state.teams.filter((team: SimpleTeamType) => 
                team.league === state.selectedLeague
            );
        }
    ),
    
    // Estado general
    isLoading: createSelector(
        [selectTheSportsDBState],
        (state) => state.sportsLoading || state.leaguesLoading || state.teamsLoading
    ),
    
    hasAnyError: createSelector(
        [selectTheSportsDBState],
        (state) => Boolean(state.sportsError || state.leaguesError || state.teamsError)
    ),
    
    // Información de caché
    isCacheValid: createSelector(
        [selectTheSportsDBState],
        (state) => {
            const now = new Date();
            const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos
            
            if (!state.lastSportsUpdate) return false;
            
            const lastUpdate = new Date(state.lastSportsUpdate);
            return (now.getTime() - lastUpdate.getTime()) < oneHour;
        }
    ),
};

// ===== EXPORTAR REDUCER =====
export default theSportsDBSlice.reducer;
