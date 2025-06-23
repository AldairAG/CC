import { createSlice } from '@reduxjs/toolkit';
import type { EventType } from '../../types/EventType';
import type { Sport } from '../../types/SportType';

interface DeportesState {
    ligas: { id: number; name: string }[];
    deportes: Sport[];
    eventos: EventType[];
    evento: EventType;
    liveMatches: EventType[];
    todayMatches: EventType[];
    popularMatches: EventType[];
    selectedSport: string | null;
    sportMatches: EventType[];
    isLoading: boolean;
    error: string | null;
}

const initialState: DeportesState = {
    ligas: [],
    deportes: [],
    eventos: [],
    evento: {} as EventType,
    liveMatches: [],
    todayMatches: [],
    popularMatches: [],
    selectedSport: null,
    sportMatches: [],
    isLoading: false,
    error: null,
}

const deporteSlice = createSlice({
    name: 'deportes',
    initialState,
    reducers: {
        setLigas: (state, action) => {
            state.ligas = action.payload;
        },
        setDeportes: (state, action) => {
            state.deportes = action.payload;
        },
        setEventos: (state, action) => {
            state.eventos = action.payload;
        },
        setEvento: (state, action) => {
            state.evento = action.payload;
        },
        clearEventos: (state) => {
            state.eventos = [];
        },        clearEvento: (state) => {
            state.evento = {} as EventType;
        },
        setLiveMatches: (state, action) => {
            state.liveMatches = action.payload;
        },
        setTodayMatches: (state, action) => {
            state.todayMatches = action.payload;
        },        setPopularMatches: (state, action) => {
            state.popularMatches = action.payload;
        },
        setSelectedSport: (state, action) => {
            state.selectedSport = action.payload;
        },
        setSportMatches: (state, action) => {
            state.sportMatches = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    }
});

export const { 
    setLigas, 
    setDeportes, 
    setEventos,
    setEvento,
    clearEvento,
    clearEventos,
    setLiveMatches,
    setTodayMatches,
    setPopularMatches,
    setSelectedSport,
    setSportMatches,
    setLoading,
    setError,
    clearError
} = deporteSlice.actions;

export const deportesSelector = {
    ligas: (state: { deportes: DeportesState }) => state.deportes.ligas,
    deportes: (state: { deportes: DeportesState }) => state.deportes.deportes,
    eventos: (state: { deportes: DeportesState }) => state.deportes.eventos,
    evento: (state: { deportes: DeportesState }) => state.deportes.evento,
    liveMatches: (state: { deportes: DeportesState }) => state.deportes.liveMatches,
    todayMatches: (state: { deportes: DeportesState }) => state.deportes.todayMatches,
    popularMatches: (state: { deportes: DeportesState }) => state.deportes.popularMatches,
    selectedSport: (state: { deportes: DeportesState }) => state.deportes.selectedSport,
    sportMatches: (state: { deportes: DeportesState }) => state.deportes.sportMatches,
    isLoading: (state: { deportes: DeportesState }) => state.deportes.isLoading,
    error: (state: { deportes: DeportesState }) => state.deportes.error,
}

export default deporteSlice.reducer;
