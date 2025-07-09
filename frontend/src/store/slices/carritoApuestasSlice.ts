import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import type { EventoDeportivoType } from "../../types/EventoDeportivoTypes";
import { TipoApuesta } from "../../types/ApuestaType";
import type { RootState } from "../store";

// Interfaz para un slip de apuesta en el carrito
export interface BettingSlip {
  id: string;
  evento: EventoDeportivoType;
  tipoApuesta: TipoApuesta;
  prediccion: string;
  cuota: number;
  cuotaId: number;
  montoApostado: number;
  gananciasPotenciales: number;
  fechaAgregado: string; // ISO string
}

// Estado del carrito de apuestas
interface CarritoApuestasState {
  // Slips de apuesta
  slips: BettingSlip[];
  
  // Configuración
  tipoApuesta: 'simple' | 'multiple';
  isVisible: boolean;
  
  // Estados de carga
  loading: {
    procesandoApuestas: boolean;
    agregandoSlip: boolean;
  };
  
  // Errores
  error: {
    procesarApuestas: string | null;
    agregarSlip: string | null;
  };
  
  // Configuraciones
  montoMinimo: number;
  montoMaximo: number;
  cuotaMinima: number;
  cuotaMaxima: number;
}

// Estado inicial
const initialState: CarritoApuestasState = {
  slips: [],
  tipoApuesta: 'simple',
  isVisible: false,
  loading: {
    procesandoApuestas: false,
    agregandoSlip: false,
  },
  error: {
    procesarApuestas: null,
    agregarSlip: null,
  },
  montoMinimo: 10,
  montoMaximo: 10000,
  cuotaMinima: 1.01,
  cuotaMaxima: 50.0,
};

// Función auxiliar para generar ID único
const generateSlipId = (evento: EventoDeportivoType, tipoApuesta: TipoApuesta, prediccion: string): string => {
  return `${evento.id}-${tipoApuesta}-${prediccion.replace(/\s+/g, '-')}`;
};

// Función auxiliar para calcular ganancias potenciales
const calculatePotentialWinnings = (monto: number, cuota: number): number => {
  return Math.round((monto * cuota - monto) * 100) / 100;
};

// Slice del carrito de apuestas
export const carritoApuestasSlice = createSlice({
  name: 'carritoApuestas',
  initialState,
  reducers: {
    // Agregar slip al carrito
    agregarSlip: (state, action: PayloadAction<{
      evento: EventoDeportivoType;
      tipoApuesta: TipoApuesta;
      prediccion: string;
      cuota: number;
      cuotaId: number;
      montoInicial?: number;
    }>) => {
      const { evento, tipoApuesta, prediccion, cuota, cuotaId, montoInicial = 0 } = action.payload;
      const id = generateSlipId(evento, tipoApuesta, prediccion);
      
      // Verificar si ya existe
      const existeSlip = state.slips.find(slip => slip.id === id);
      if (existeSlip) {
        state.error.agregarSlip = 'Esta apuesta ya está en tu carrito';
        return;
      }

      // Validar cuota
      if (cuota < state.cuotaMinima || cuota > state.cuotaMaxima) {
        state.error.agregarSlip = `La cuota debe estar entre ${state.cuotaMinima} y ${state.cuotaMaxima}`;
        return;
      }

      const gananciasPotenciales = calculatePotentialWinnings(montoInicial, cuota);

      const nuevoSlip: BettingSlip = {
        id,
        evento,
        tipoApuesta,
        prediccion,
        cuota,
        cuotaId,
        montoApostado: montoInicial,
        gananciasPotenciales,
        fechaAgregado: new Date().toISOString()
      };

      state.slips.push(nuevoSlip);
      state.isVisible = true;
      state.error.agregarSlip = null;
    },

    // Actualizar monto de un slip
    actualizarMontoSlip: (state, action: PayloadAction<{ id: string; nuevoMonto: number }>) => {
      const { id, nuevoMonto } = action.payload;
      
      // Validar monto básico (solo no negativos y no mayor al máximo)
      if (nuevoMonto < 0) return;
      if (nuevoMonto > state.montoMaximo) return;

      const slip = state.slips.find(s => s.id === id);
      if (slip) {
        slip.montoApostado = nuevoMonto;
        slip.gananciasPotenciales = calculatePotentialWinnings(nuevoMonto, slip.cuota);
      }
    },

    // Remover slip del carrito
    removerSlip: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.slips = state.slips.filter(slip => slip.id !== id);
    },

    // Limpiar todo el carrito
    limpiarCarrito: (state) => {
      state.slips = [];
      state.error.procesarApuestas = null;
      state.error.agregarSlip = null;
    },

    // Cambiar tipo de apuesta
    cambiarTipoApuesta: (state, action: PayloadAction<'simple' | 'multiple'>) => {
      state.tipoApuesta = action.payload;
    },

    // Toggle visibilidad del carrito
    toggleVisibilidad: (state) => {
      state.isVisible = !state.isVisible;
    },

    // Mostrar carrito
    mostrarCarrito: (state) => {
      state.isVisible = true;
    },

    // Ocultar carrito
    ocultarCarrito: (state) => {
      state.isVisible = false;
    },

    // Estados de carga - Procesar apuestas
    setProcesandoApuestas: (state, action: PayloadAction<boolean>) => {
      state.loading.procesandoApuestas = action.payload;
      if (action.payload) {
        state.error.procesarApuestas = null;
      }
    },

    // Estados de carga - Agregar slip
    setAgregandoSlip: (state, action: PayloadAction<boolean>) => {
      state.loading.agregandoSlip = action.payload;
      if (action.payload) {
        state.error.agregarSlip = null;
      }
    },

    // Establecer error de procesar apuestas
    setErrorProcesarApuestas: (state, action: PayloadAction<string>) => {
      state.error.procesarApuestas = action.payload;
      state.loading.procesandoApuestas = false;
    },

    // Establecer error de agregar slip
    setErrorAgregarSlip: (state, action: PayloadAction<string>) => {
      state.error.agregarSlip = action.payload;
      state.loading.agregandoSlip = false;
    },

    // Limpiar errores
    limpiarErrores: (state) => {
      state.error.procesarApuestas = null;
      state.error.agregarSlip = null;
    },

    // Actualizar configuraciones
    actualizarConfiguraciones: (state, action: PayloadAction<{
      montoMinimo?: number;
      montoMaximo?: number;
      cuotaMinima?: number;
      cuotaMaxima?: number;
    }>) => {
      const { montoMinimo, montoMaximo, cuotaMinima, cuotaMaxima } = action.payload;
      
      if (montoMinimo !== undefined) state.montoMinimo = montoMinimo;
      if (montoMaximo !== undefined) state.montoMaximo = montoMaximo;
      if (cuotaMinima !== undefined) state.cuotaMinima = cuotaMinima;
      if (cuotaMaxima !== undefined) state.cuotaMaxima = cuotaMaxima;
    },

    // Reordenar slips
    reordenarSlips: (state, action: PayloadAction<string[]>) => {
      const nuevoOrden = action.payload;
      const slipsOrdenados = nuevoOrden
        .map(id => state.slips.find(slip => slip.id === id))
        .filter(Boolean) as BettingSlip[];
      
      state.slips = slipsOrdenados;
    },

    // Duplicar slip (útil para apuestas similares)
    duplicarSlip: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const slipOriginal = state.slips.find(s => s.id === id);
      
      if (slipOriginal) {
        const nuevoId = `${slipOriginal.id}-copia-${Date.now()}`;
        const slipDuplicado: BettingSlip = {
          ...slipOriginal,
          id: nuevoId,
          montoApostado: 0,
          gananciasPotenciales: 0,
          fechaAgregado: new Date().toISOString()
        };
        
        state.slips.push(slipDuplicado);
      }
    },
  },
});

// Exportar acciones
export const {
  agregarSlip,
  actualizarMontoSlip,
  removerSlip,
  limpiarCarrito,
  cambiarTipoApuesta,
  toggleVisibilidad,
  mostrarCarrito,
  ocultarCarrito,
  setProcesandoApuestas,
  setAgregandoSlip,
  setErrorProcesarApuestas,
  setErrorAgregarSlip,
  limpiarErrores,
  actualizarConfiguraciones,
  reordenarSlips,
  duplicarSlip,
} = carritoApuestasSlice.actions;

// Selectores básicos
export const selectCarritoApuestas = (state: RootState) => state.carritoApuestas;
export const selectSlips = (state: RootState) => state.carritoApuestas.slips;
export const selectTipoApuesta = (state: RootState) => state.carritoApuestas.tipoApuesta;
export const selectIsVisible = (state: RootState) => state.carritoApuestas.isVisible;
export const selectLoading = (state: RootState) => state.carritoApuestas.loading;
export const selectError = (state: RootState) => state.carritoApuestas.error;

// Selectores memoizados con reselect
export const selectEstadisticasCarrito = createSelector(
  [selectSlips, selectTipoApuesta],
  (slips, tipoApuesta) => {
    const totalStake = slips.reduce((total: number, slip: BettingSlip) => total + slip.montoApostado, 0);
    const totalPotentialWinnings = slips.reduce((total: number, slip: BettingSlip) => total + slip.gananciasPotenciales, 0);
    
    // Para apuestas múltiples
    const multipleCuota = slips.reduce((cuota: number, slip: BettingSlip) => cuota * slip.cuota, 1);
    const multiplePotentialWinnings = totalStake * multipleCuota - totalStake;

    return {
      cantidadSlips: slips.length,
      totalApostado: totalStake,
      gananciasPotencialesSimples: totalPotentialWinnings,
      gananciasPotencialesMultiples: multiplePotentialWinnings,
      cuotaMultiple: multipleCuota,
      promedioMontoSlip: slips.length > 0 ? totalStake / slips.length : 0,
      promedioCuota: slips.length > 0 ? slips.reduce((acc: number, slip: BettingSlip) => acc + slip.cuota, 0) / slips.length : 0,
      gananciasPotencialesFinales: tipoApuesta === 'simple' ? totalPotentialWinnings : multiplePotentialWinnings
    };
  }
);

export const selectValidacionesCarrito = createSelector(
  [selectSlips, selectEstadisticasCarrito, (state: RootState) => state.carritoApuestas.montoMinimo],
  (slips, estadisticas, montoMinimo) => {
    const slipsSinMonto = slips.filter((slip: BettingSlip) => slip.montoApostado <= 0);
    const slipsConMontoInsuficiente = slips.filter((slip: BettingSlip) => slip.montoApostado > 0 && slip.montoApostado < montoMinimo);
    
    return {
      carritoVacio: slips.length === 0,
      tieneSlipsSinMonto: slipsSinMonto.length > 0,
      tieneSlipsConMontoInsuficiente: slipsConMontoInsuficiente.length > 0,
      montoTotalValido: estadisticas.totalApostado > 0,
      puedeApostar: slips.length > 0 && 
                   slipsSinMonto.length === 0 && 
                   slipsConMontoInsuficiente.length === 0,
      maximoSlipsAlcanzado: slips.length >= 10, // Límite configurable
      tieneErrores: slips.some((slip: BettingSlip) => slip.cuota < 1.01 || slip.cuota > 50),
      montoMinimo
    };
  }
);

// Selector para verificar si una apuesta específica está en el carrito
export const selectEstaEnCarrito = createSelector(
  [selectSlips, (_: RootState, evento: EventoDeportivoType, tipoApuesta: TipoApuesta, prediccion: string) => ({ evento, tipoApuesta, prediccion })],
  (slips, { evento, tipoApuesta, prediccion }) => {
    const id = generateSlipId(evento, tipoApuesta, prediccion);
    return slips.some((slip: BettingSlip) => slip.id === id);
  }
);

// Selector para obtener un slip específico
export const selectSlipPorId = createSelector(
  [selectSlips, (_: RootState, id: string) => id],
  (slips, id) => slips.find((slip: BettingSlip) => slip.id === id)
);

// Selector para obtener slips por evento
export const selectSlipsPorEvento = createSelector(
  [selectSlips, (_: RootState, eventoId: number) => eventoId],
  (slips, eventoId) => slips.filter((slip: BettingSlip) => slip.evento.id === eventoId)
);

// Selector para obtener slips por tipo de apuesta
export const selectSlipsPorTipo = createSelector(
  [selectSlips, (_: RootState, tipoApuesta: TipoApuesta) => tipoApuesta],
  (slips, tipoApuesta) => slips.filter((slip: BettingSlip) => slip.tipoApuesta === tipoApuesta)
);

// Exportar el reducer
export default carritoApuestasSlice.reducer;
