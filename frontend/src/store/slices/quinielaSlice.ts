import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import type { QuinielaType } from "../../types/QuinielaType";

/**
 * Interface que define la estructura del estado de quinielas
 */
interface QuinielaState {
  quinielas: QuinielaType[];
  quinielaActual: QuinielaType | null;
  quinielasFiltradas: QuinielaType[];
}

/**
 * Estado inicial para el slice de quinielas
 */
const initialState: QuinielaState = {
  quinielas: [],
  quinielaActual: null,
  quinielasFiltradas: [],
};

/**
 * @file quinielaSlice.ts
 * @description Este archivo define el `quinielaSlice` para gestionar el estado relacionado con las quinielas en la aplicación.
 * Utiliza Redux Toolkit's `createSlice` para manejar la información de quinielas.
 */
const quinielaSlice = createSlice({
  name: "quiniela",
  initialState,
  reducers: {
    // Acciones para manejar las quinielas
    setQuinielas: (state, action: PayloadAction<QuinielaType[]>) => {
      state.quinielas = action.payload;
      state.quinielasFiltradas = action.payload;
    },

    setQuinielaActual: (state, action: PayloadAction<QuinielaType | null>) => {
      state.quinielaActual = action.payload;
    },

    addQuiniela: (state, action: PayloadAction<QuinielaType>) => {
      state.quinielas.push(action.payload);
      state.quinielasFiltradas = state.quinielas;
    },

    updateQuiniela: (state, action: PayloadAction<QuinielaType>) => {
      const index = state.quinielas.findIndex(q => q.idQuiniela === action.payload.idQuiniela);
      if (index !== -1) {
        state.quinielas[index] = action.payload;
      }
      if (state.quinielaActual?.idQuiniela === action.payload.idQuiniela) {
        state.quinielaActual = action.payload;
      }
      // Actualizar también en la lista filtrada
      const indexFiltrado = state.quinielasFiltradas.findIndex(q => q.idQuiniela === action.payload.idQuiniela);
      if (indexFiltrado !== -1) {
        state.quinielasFiltradas[indexFiltrado] = action.payload;
      }
    },

    removeQuiniela: (state, action: PayloadAction<number>) => {
      state.quinielas = state.quinielas.filter(q => q.idQuiniela !== action.payload);
      state.quinielasFiltradas = state.quinielasFiltradas.filter(q => q.idQuiniela !== action.payload);
      if (state.quinielaActual?.idQuiniela === action.payload) {
        state.quinielaActual = null;
      }
    },

    setQuinielasFiltradas: (state, action: PayloadAction<QuinielaType[]>) => {
      state.quinielasFiltradas = action.payload;
    },

    filtrarQuinielasPorNombre: (state, action: PayloadAction<string>) => {
      const criterio = action.payload.toLowerCase();
      if (criterio === "") {
        state.quinielasFiltradas = state.quinielas;
      } else {
        state.quinielasFiltradas = state.quinielas.filter(
          q => q.nombreQuiniela.toLowerCase().includes(criterio)
        );
      }
    },

    filtrarQuinielasPorEstado: (state, action: PayloadAction<string>) => {
      const estado = action.payload.toLowerCase();
      if (estado === "") {
        state.quinielasFiltradas = state.quinielas;
      } else {
        state.quinielasFiltradas = state.quinielas.filter(
          q => q.estado.toLowerCase() === estado
        );
      }
    },

    filtrarQuinielasPorTipoPremio: (state, action: PayloadAction<string>) => {
      const tipoPremio = action.payload.toLowerCase();
      if (tipoPremio === "") {
        state.quinielasFiltradas = state.quinielas;
      } else {
        state.quinielasFiltradas = state.quinielas.filter(
          q => q.tipoPremio.toLowerCase() === tipoPremio
        );
      }
    },

    filtrarQuinielasPorParticipantes: (state, action: PayloadAction<number>) => {
      const minParticipantes = action.payload;
      state.quinielasFiltradas = state.quinielas.filter(
        q => q.numeroParticipantes >= minParticipantes
      );
    },

    filtrarQuinielasPorPremioAcumulado: (state, action: PayloadAction<{ min: number; max: number }>) => {
      const { min, max } = action.payload;
      state.quinielasFiltradas = state.quinielas.filter(
        q => q.premioAcumulado >= min && q.premioAcumulado <= max
      );
    },

    filtrarQuinielasPorTipoApuesta: (state, action: PayloadAction<string>) => {
      const tipoApuesta = action.payload.toLowerCase();
      if (tipoApuesta === "") {
        state.quinielasFiltradas = state.quinielas;
      } else {
        state.quinielasFiltradas = state.quinielas.filter(
          q => q.tiposApuestas.some(tipo => tipo.toLowerCase().includes(tipoApuesta))
        );
      }
    },

    clearQuinielas: (state) => {
      state.quinielas = [];
      state.quinielasFiltradas = [];
      state.quinielaActual = null;
    },
  }
});

export const {
  setQuinielas,
  setQuinielaActual,
  addQuiniela,
  updateQuiniela,
  removeQuiniela,
  setQuinielasFiltradas,
  filtrarQuinielasPorNombre,
  filtrarQuinielasPorEstado,
  filtrarQuinielasPorTipoPremio,
  filtrarQuinielasPorParticipantes,
  filtrarQuinielasPorPremioAcumulado,
  filtrarQuinielasPorTipoApuesta,
  clearQuinielas
} = quinielaSlice.actions;

/**
 * Selector para obtener todas las quinielas
 */
const selectAllQuinielas = (state: { quiniela: QuinielaState }) => state.quiniela.quinielas;

/**
 * Selector para obtener las quinielas filtradas
 */
const selectQuinielasFiltradas = (state: { quiniela: QuinielaState }) => state.quiniela.quinielasFiltradas;

/**
 * Selector para obtener una quiniela por ID
 */
const selectQuinielaById = createSelector(
  [
    selectAllQuinielas,
    (_: { quiniela: QuinielaState }, idQuiniela: number) => idQuiniela
  ],
  (quinielas, idQuiniela) => quinielas.find(q => q.idQuiniela === idQuiniela) || null
);

/**
 * Selector para obtener quinielas por tipo de premio
 */
const selectQuinielasByTipoPremio = createSelector(
  [
    selectAllQuinielas,
    (_: { quiniela: QuinielaState }, tipoPremio: string) => tipoPremio
  ],
  (quinielas, tipoPremio) => quinielas.filter(q => q.tipoPremio.toLowerCase() === tipoPremio.toLowerCase())
);

/**
 * Selector para obtener quinielas con premio acumulado bajo un umbral
 */
const selectQuinielasBajoPremio = createSelector(
  [
    selectAllQuinielas,
    (_: { quiniela: QuinielaState }, maxPremio: number) => maxPremio
  ],
  (quinielas, maxPremio) => quinielas.filter(q => q.premioAcumulado <= maxPremio)
);

/**
 * Objeto que contiene selectores para acceder al estado de quinielas
 */
export const quinielaSelector = {
  quinielas: selectAllQuinielas,
  quinielasFiltradas: selectQuinielasFiltradas,
  quinielaActual: (state: { quiniela: QuinielaState }) => state.quiniela.quinielaActual,
  quinielaById: selectQuinielaById,
  quinielasByTipoPremio: selectQuinielasByTipoPremio,
  quinielasBajoPremio: selectQuinielasBajoPremio
};
export default quinielaSlice.reducer;