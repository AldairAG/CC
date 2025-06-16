import { createSlice } from '@reduxjs/toolkit';
import type { EventType } from '../../types/EventType';

interface DeportesState {
    ligas: { id: number; name: string }[];
    deportes: { id: number; name: string }[];
    eventos: EventType[];
    evento: EventType;
}

const initialState: DeportesState = {
    ligas: [],
    deportes: [],
    eventos: [],
    evento: {} as EventType,
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
        },
        clearEvento: (state) => {
            state.evento = {} as EventType;
        },
    }
});

export const { setLigas, setDeportes, setEventos,setEvento,clearEvento,clearEventos } = deporteSlice.actions;

export const deportesSelector = {
    ligas: (state: { deportes: DeportesState }) => state.deportes.ligas,
    deportes: (state: { deportes: DeportesState }) => state.deportes.deportes,
    eventos: (state: { deportes: DeportesState }) => state.deportes.eventos,
    evento: (state: { deportes: DeportesState }) => state.deportes.evento,
}

export default deporteSlice.reducer;
