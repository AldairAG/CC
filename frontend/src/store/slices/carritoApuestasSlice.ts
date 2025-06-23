import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ApuestaCarrito {
  id: string; // ID único para el carrito
  idEvento: number;
  equipoLocal: string;
  equipoVisitante: string;
  fechaPartido: string;
  tipoApuesta: string;
  tipoApuestaDescripcion: string;
  cuota: number;
  montoApuesta: number;
  gananciaPotencial: number;
  prediccionUsuario: string;
  detalleApuesta: string;
  fechaAgregado: string;
}

interface CarritoApuestasState {
  apuestas: ApuestaCarrito[];
  isOpen: boolean;
  totalApuestas: number;
  totalMonto: number;
  totalGananciaPotencial: number;
  isCreating: boolean;
  error: string | null;
}

const initialState: CarritoApuestasState = {
  apuestas: [],
  isOpen: false,
  totalApuestas: 0,
  totalMonto: 0,
  totalGananciaPotencial: 0,
  isCreating: false,
  error: null,
};

const carritoApuestasSlice = createSlice({
  name: 'carritoApuestas',
  initialState,
  reducers: {
    // Agregar apuesta al carrito
    agregarApuesta: (state, action: PayloadAction<Omit<ApuestaCarrito, 'id' | 'fechaAgregado'>>) => {
      const nuevaApuesta: ApuestaCarrito = {
        ...action.payload,
        id: `${action.payload.idEvento}-${action.payload.tipoApuesta}-${Date.now()}`,
        fechaAgregado: new Date().toISOString(),
      };
      
      // Verificar si ya existe una apuesta similar
      const existeApuesta = state.apuestas.find(
        apuesta => apuesta.idEvento === nuevaApuesta.idEvento && 
                  apuesta.tipoApuesta === nuevaApuesta.tipoApuesta
      );
      
      if (!existeApuesta) {
        state.apuestas.push(nuevaApuesta);
        carritoApuestasSlice.caseReducers.calcularTotales(state);
      }
    },

    // Remover apuesta del carrito
    removerApuesta: (state, action: PayloadAction<string>) => {
      state.apuestas = state.apuestas.filter(apuesta => apuesta.id !== action.payload);
      carritoApuestasSlice.caseReducers.calcularTotales(state);
    },

    // Actualizar monto de una apuesta
    actualizarMontoApuesta: (state, action: PayloadAction<{ id: string; nuevoMonto: number }>) => {
      const { id, nuevoMonto } = action.payload;
      const apuesta = state.apuestas.find(a => a.id === id);
      if (apuesta) {
        apuesta.montoApuesta = nuevoMonto;
        apuesta.gananciaPotencial = nuevoMonto * apuesta.cuota;
        carritoApuestasSlice.caseReducers.calcularTotales(state);
      }
    },

    // Actualizar cuota de una apuesta
    actualizarCuotaApuesta: (state, action: PayloadAction<{ id: string; nuevaCuota: number }>) => {
      const { id, nuevaCuota } = action.payload;
      const apuesta = state.apuestas.find(a => a.id === id);
      if (apuesta) {
        apuesta.cuota = nuevaCuota;
        apuesta.gananciaPotencial = apuesta.montoApuesta * nuevaCuota;
        carritoApuestasSlice.caseReducers.calcularTotales(state);
      }
    },

    // Limpiar carrito
    limpiarCarrito: (state) => {
      state.apuestas = [];
      carritoApuestasSlice.caseReducers.calcularTotales(state);
    },

    // Abrir/cerrar carrito
    toggleCarrito: (state) => {
      state.isOpen = !state.isOpen;
    },

    abrirCarrito: (state) => {
      state.isOpen = true;
    },

    cerrarCarrito: (state) => {
      state.isOpen = false;
    },

    // Estados de creación
    setCreando: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Calcular totales
    calcularTotales: (state) => {
      state.totalApuestas = state.apuestas.length;
      state.totalMonto = state.apuestas.reduce((total, apuesta) => total + apuesta.montoApuesta, 0);
      state.totalGananciaPotencial = state.apuestas.reduce((total, apuesta) => total + apuesta.gananciaPotencial, 0);
    },

    // Remover apuestas de un evento específico
    removerApuestasEvento: (state, action: PayloadAction<number>) => {
      state.apuestas = state.apuestas.filter(apuesta => apuesta.idEvento !== action.payload);
      carritoApuestasSlice.caseReducers.calcularTotales(state);
    },
  },
});

export const {
  agregarApuesta,
  removerApuesta,
  actualizarMontoApuesta,
  actualizarCuotaApuesta,
  limpiarCarrito,
  toggleCarrito,
  abrirCarrito,
  cerrarCarrito,
  setCreando,
  setError,
  calcularTotales,
  removerApuestasEvento,
} = carritoApuestasSlice.actions;

// Selectores
export const carritoApuestasSelector = {
  apuestas: (state: { carritoApuestas: CarritoApuestasState }) => state.carritoApuestas.apuestas,
  isOpen: (state: { carritoApuestas: CarritoApuestasState }) => state.carritoApuestas.isOpen,
  totalApuestas: (state: { carritoApuestas: CarritoApuestasState }) => state.carritoApuestas.totalApuestas,
  totalMonto: (state: { carritoApuestas: CarritoApuestasState }) => state.carritoApuestas.totalMonto,
  totalGananciaPotencial: (state: { carritoApuestas: CarritoApuestasState }) => state.carritoApuestas.totalGananciaPotencial,
  isCreating: (state: { carritoApuestas: CarritoApuestasState }) => state.carritoApuestas.isCreating,
  error: (state: { carritoApuestas: CarritoApuestasState }) => state.carritoApuestas.error,
  hayApuestas: (state: { carritoApuestas: CarritoApuestasState }) => state.carritoApuestas.apuestas.length > 0,
  apuestasPorEvento: (state: { carritoApuestas: CarritoApuestasState }, idEvento: number) => 
    state.carritoApuestas.apuestas.filter(apuesta => apuesta.idEvento === idEvento),
};

export default carritoApuestasSlice.reducer;
