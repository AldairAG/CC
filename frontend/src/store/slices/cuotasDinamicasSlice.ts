import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import type { RootState } from '../store';
import type {
  CuotaEvento,
  CuotaHistorial,
  TendenciaCuota,
  VolumenApuestas,
  EstadisticasCuotas,
  ConfiguracionCuotas,
  AlertaCuota,
  ResumenCuotas,
  FiltroCuotas,
  PaginacionCuotas,
  CuotasDinamicasState
} from '../../types/CuotasDinamicasTypes';

const initialState: CuotasDinamicasState = {
  // Datos principales
  cuotasEvento: [],
  historialCuotas: [],
  tendenciaCuotas: [],
  volumenApuestas: [],
  estadisticasCuotas: null,
  resumenCuotas: null,
  alertasCuotas: [],
  
  // Configuración
  configuracion: {
    intervaloActualizacion: 5000, // 5 segundos
    limiteTendencia: 5, // 5%
    notificacionesCambios: true,
    filtrosTendencia: ['SUBIENDO', 'BAJANDO']
  },
  
  // Filtros y búsqueda
  filtros: {
    eventoId: undefined,
    tipoResultado: undefined,
    tendencia: undefined,
    cuotaMinima: undefined,
    cuotaMaxima: undefined,
    fechaDesde: undefined,
    fechaHasta: undefined,
    activa: undefined
  },
  busqueda: '',
  
  // Paginación
  paginacion: {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  },
  
  // Estados de carga
  loading: {
    cuotasEvento: false,
    historialCuotas: false,
    tendenciaCuotas: false,
    volumenApuestas: false,
    estadisticasCuotas: false,
    resumenCuotas: false,
    alertasCuotas: false,
    actualizandoCuotas: false,
    procesandoAlertas: false
  },
  
  // Estados de error
  error: {
    cuotasEvento: null,
    historialCuotas: null,
    tendenciaCuotas: null,
    volumenApuestas: null,
    estadisticasCuotas: null,
    resumenCuotas: null,
    alertasCuotas: null,
    actualizarCuotas: null,
    procesarAlertas: null
  },
  
  // Estado de conexión en tiempo real
  conexionTiempoReal: {
    conectado: false,
    ultimaActualizacion: null,
    intentosReconexion: 0
  }
};

const cuotasDinamicasSlice = createSlice({
  name: 'cuotasDinamicas',
  initialState,
  reducers: {
    // Acciones para cuotas de evento
    setCuotasEventoLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.cuotasEvento = action.payload;
      if (action.payload) {
        state.error.cuotasEvento = null;
      }
    },
    setCuotasEvento: (state, action: PayloadAction<CuotaEvento[]>) => {
      state.cuotasEvento = action.payload;
      state.loading.cuotasEvento = false;
      state.error.cuotasEvento = null;
    },
    setCuotasEventoError: (state, action: PayloadAction<string>) => {
      state.error.cuotasEvento = action.payload;
      state.loading.cuotasEvento = false;
    },
    actualizarCuotaEvento: (state, action: PayloadAction<CuotaEvento>) => {
      const index = state.cuotasEvento.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.cuotasEvento[index] = action.payload;
      } else {
        state.cuotasEvento.push(action.payload);
      }
      state.conexionTiempoReal.ultimaActualizacion = new Date().toISOString();
    },
    
    // Acciones para historial de cuotas
    setHistorialCuotasLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.historialCuotas = action.payload;
      if (action.payload) {
        state.error.historialCuotas = null;
      }
    },
    setHistorialCuotas: (state, action: PayloadAction<CuotaHistorial[]>) => {
      state.historialCuotas = action.payload;
      state.loading.historialCuotas = false;
      state.error.historialCuotas = null;
    },
    setHistorialCuotasError: (state, action: PayloadAction<string>) => {
      state.error.historialCuotas = action.payload;
      state.loading.historialCuotas = false;
    },
    agregarHistorialCuota: (state, action: PayloadAction<CuotaHistorial>) => {
      state.historialCuotas.unshift(action.payload);
    },
    
    // Acciones para tendencias
    setTendenciaCuotasLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.tendenciaCuotas = action.payload;
      if (action.payload) {
        state.error.tendenciaCuotas = null;
      }
    },
    setTendenciaCuotas: (state, action: PayloadAction<TendenciaCuota[]>) => {
      state.tendenciaCuotas = action.payload;
      state.loading.tendenciaCuotas = false;
      state.error.tendenciaCuotas = null;
    },
    setTendenciaCuotasError: (state, action: PayloadAction<string>) => {
      state.error.tendenciaCuotas = action.payload;
      state.loading.tendenciaCuotas = false;
    },
    
    // Acciones para volumen de apuestas
    setVolumenApuestasLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.volumenApuestas = action.payload;
      if (action.payload) {
        state.error.volumenApuestas = null;
      }
    },
    setVolumenApuestas: (state, action: PayloadAction<VolumenApuestas[]>) => {
      state.volumenApuestas = action.payload;
      state.loading.volumenApuestas = false;
      state.error.volumenApuestas = null;
    },
    setVolumenApuestasError: (state, action: PayloadAction<string>) => {
      state.error.volumenApuestas = action.payload;
      state.loading.volumenApuestas = false;
    },
    
    // Acciones para estadísticas
    setEstadisticasCuotasLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.estadisticasCuotas = action.payload;
      if (action.payload) {
        state.error.estadisticasCuotas = null;
      }
    },
    setEstadisticasCuotas: (state, action: PayloadAction<EstadisticasCuotas>) => {
      state.estadisticasCuotas = action.payload;
      state.loading.estadisticasCuotas = false;
      state.error.estadisticasCuotas = null;
    },
    setEstadisticasCuotasError: (state, action: PayloadAction<string>) => {
      state.error.estadisticasCuotas = action.payload;
      state.loading.estadisticasCuotas = false;
    },
    
    // Acciones para resumen
    setResumenCuotasLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.resumenCuotas = action.payload;
      if (action.payload) {
        state.error.resumenCuotas = null;
      }
    },
    setResumenCuotas: (state, action: PayloadAction<ResumenCuotas>) => {
      state.resumenCuotas = action.payload;
      state.loading.resumenCuotas = false;
      state.error.resumenCuotas = null;
    },
    setResumenCuotasError: (state, action: PayloadAction<string>) => {
      state.error.resumenCuotas = action.payload;
      state.loading.resumenCuotas = false;
    },
    
    // Acciones para alertas
    setAlertasCuotasLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.alertasCuotas = action.payload;
      if (action.payload) {
        state.error.alertasCuotas = null;
      }
    },
    setAlertasCuotas: (state, action: PayloadAction<AlertaCuota[]>) => {
      state.alertasCuotas = action.payload;
      state.loading.alertasCuotas = false;
      state.error.alertasCuotas = null;
    },
    setAlertasCuotasError: (state, action: PayloadAction<string>) => {
      state.error.alertasCuotas = action.payload;
      state.loading.alertasCuotas = false;
    },
    agregarAlertaCuota: (state, action: PayloadAction<AlertaCuota>) => {
      state.alertasCuotas.push(action.payload);
    },
    removerAlertaCuota: (state, action: PayloadAction<number>) => {
      state.alertasCuotas = state.alertasCuotas.filter(a => a.id !== action.payload);
    },
    actualizarAlertaCuota: (state, action: PayloadAction<AlertaCuota>) => {
      const index = state.alertasCuotas.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.alertasCuotas[index] = action.payload;
      }
    },
    
    // Acciones para filtros
    setFiltros: (state, action: PayloadAction<Partial<FiltroCuotas>>) => {
      state.filtros = { ...state.filtros, ...action.payload };
    },
    limpiarFiltros: (state) => {
      state.filtros = {
        eventoId: undefined,
        tipoResultado: undefined,
        tendencia: undefined,
        cuotaMinima: undefined,
        cuotaMaxima: undefined,
        fechaDesde: undefined,
        fechaHasta: undefined,
        activa: undefined
      };
    },
    setBusqueda: (state, action: PayloadAction<string>) => {
      state.busqueda = action.payload;
    },
    
    // Acciones para paginación
    setPaginacion: (state, action: PayloadAction<Partial<PaginacionCuotas>>) => {
      state.paginacion = { ...state.paginacion, ...action.payload };
    },
    siguientePagina: (state) => {
      if (state.paginacion.page < state.paginacion.totalPages - 1) {
        state.paginacion.page += 1;
      }
    },
    paginaAnterior: (state) => {
      if (state.paginacion.page > 0) {
        state.paginacion.page -= 1;
      }
    },
    
    // Acciones para configuración
    setConfiguracion: (state, action: PayloadAction<Partial<ConfiguracionCuotas>>) => {
      state.configuracion = { ...state.configuracion, ...action.payload };
    },
    
    // Acciones para conexión en tiempo real
    setConexionTiempoReal: (state, action: PayloadAction<{ conectado: boolean; intentosReconexion?: number }>) => {
      state.conexionTiempoReal.conectado = action.payload.conectado;
      if (action.payload.intentosReconexion !== undefined) {
        state.conexionTiempoReal.intentosReconexion = action.payload.intentosReconexion;
      }
      state.conexionTiempoReal.ultimaActualizacion = new Date().toISOString();
    },
    
    // Acciones para limpiar errores
    limpiarError: (state, action: PayloadAction<keyof CuotasDinamicasState['error']>) => {
      state.error[action.payload] = null;
    },
    limpiarTodosErrores: (state) => {
      Object.keys(state.error).forEach(key => {
        state.error[key as keyof CuotasDinamicasState['error']] = null;
      });
    },
    
    // Acción para limpiar todo el estado
    limpiarEstado: (state) => {
      Object.assign(state, initialState);
    }
  }
});

// Exportar las acciones
export const {
  setCuotasEventoLoading,
  setCuotasEvento,
  setCuotasEventoError,
  actualizarCuotaEvento,
  setHistorialCuotasLoading,
  setHistorialCuotas,
  setHistorialCuotasError,
  agregarHistorialCuota,
  setTendenciaCuotasLoading,
  setTendenciaCuotas,
  setTendenciaCuotasError,
  setVolumenApuestasLoading,
  setVolumenApuestas,
  setVolumenApuestasError,
  setEstadisticasCuotasLoading,
  setEstadisticasCuotas,
  setEstadisticasCuotasError,
  setResumenCuotasLoading,
  setResumenCuotas,
  setResumenCuotasError,
  setAlertasCuotasLoading,
  setAlertasCuotas,
  setAlertasCuotasError,
  agregarAlertaCuota,
  removerAlertaCuota,
  actualizarAlertaCuota,
  setFiltros,
  limpiarFiltros,
  setBusqueda,
  setPaginacion,
  siguientePagina,
  paginaAnterior,
  setConfiguracion,
  setConexionTiempoReal,
  limpiarError,
  limpiarTodosErrores,
  limpiarEstado
} = cuotasDinamicasSlice.actions;

// Selectores básicos
export const selectCuotasEvento = (state: RootState) => state.cuotasDinamicas.cuotasEvento;
export const selectHistorialCuotas = (state: RootState) => state.cuotasDinamicas.historialCuotas;
export const selectTendenciaCuotas = (state: RootState) => state.cuotasDinamicas.tendenciaCuotas;
export const selectVolumenApuestas = (state: RootState) => state.cuotasDinamicas.volumenApuestas;
export const selectEstadisticasCuotas = (state: RootState) => state.cuotasDinamicas.estadisticasCuotas;
export const selectResumenCuotas = (state: RootState) => state.cuotasDinamicas.resumenCuotas;
export const selectAlertasCuotas = (state: RootState) => state.cuotasDinamicas.alertasCuotas;
export const selectFiltros = (state: RootState) => state.cuotasDinamicas.filtros;
export const selectBusqueda = (state: RootState) => state.cuotasDinamicas.busqueda;
export const selectPaginacion = (state: RootState) => state.cuotasDinamicas.paginacion;
export const selectConfiguracion = (state: RootState) => state.cuotasDinamicas.configuracion;
export const selectLoading = (state: RootState) => state.cuotasDinamicas.loading;
export const selectError = (state: RootState) => state.cuotasDinamicas.error;
export const selectConexionTiempoReal = (state: RootState) => state.cuotasDinamicas.conexionTiempoReal;

// Selectores memoizados
export const selectCuotasEventoFiltradas = createSelector(
  [selectCuotasEvento, selectFiltros, selectBusqueda],
  (cuotas, filtros, busqueda) => {
    let cuotasFiltradas = cuotas;
    
    // Aplicar filtros
    if (filtros.eventoId) {
      cuotasFiltradas = cuotasFiltradas.filter(c => c.eventoId === filtros.eventoId);
    }
    
    if (filtros.tipoResultado) {
      cuotasFiltradas = cuotasFiltradas.filter(c => c.tipoResultado === filtros.tipoResultado);
    }
    
    if (filtros.cuotaMinima) {
      cuotasFiltradas = cuotasFiltradas.filter(c => c.cuotaActual >= filtros.cuotaMinima!);
    }
    
    if (filtros.cuotaMaxima) {
      cuotasFiltradas = cuotasFiltradas.filter(c => c.cuotaActual <= filtros.cuotaMaxima!);
    }
    
    if (filtros.activa !== undefined) {
      cuotasFiltradas = cuotasFiltradas.filter(c => c.activa === filtros.activa);
    }
    
    // Aplicar búsqueda
    if (busqueda) {
      cuotasFiltradas = cuotasFiltradas.filter(c => 
        c.tipoResultado.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    
    return cuotasFiltradas;
  }
);

export const selectTendenciaCuotasFiltradas = createSelector(
  [selectTendenciaCuotas, selectFiltros, selectBusqueda],
  (tendencias, filtros, busqueda) => {
    let tendenciasFiltradas = tendencias;
    
    // Aplicar filtros
    if (filtros.tendencia) {
      tendenciasFiltradas = tendenciasFiltradas.filter(t => t.tendencia === filtros.tendencia);
    }
    
    if (filtros.cuotaMinima) {
      tendenciasFiltradas = tendenciasFiltradas.filter(t => t.cuotaActual >= filtros.cuotaMinima!);
    }
    
    if (filtros.cuotaMaxima) {
      tendenciasFiltradas = tendenciasFiltradas.filter(t => t.cuotaActual <= filtros.cuotaMaxima!);
    }
    
    // Aplicar búsqueda
    if (busqueda) {
      tendenciasFiltradas = tendenciasFiltradas.filter(t => 
        t.tipoResultado.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    
    return tendenciasFiltradas;
  }
);

export const selectAlertasCuotasActivas = createSelector(
  [selectAlertasCuotas],
  (alertas) => alertas.filter(a => a.activa)
);

export const selectEstadisticasGenerales = createSelector(
  [selectCuotasEvento, selectTendenciaCuotas, selectVolumenApuestas],
  (cuotas, tendencias, volumen) => ({
    totalCuotas: cuotas.length,
    cuotasActivas: cuotas.filter(c => c.activa).length,
    tendenciasSubiendo: tendencias.filter(t => t.tendencia === 'SUBIENDO').length,
    tendenciasBajando: tendencias.filter(t => t.tendencia === 'BAJANDO').length,
    tendenciasEstables: tendencias.filter(t => t.tendencia === 'ESTABLE').length,
    volumenTotal: volumen.reduce((acc, v) => acc + v.volumenTotal, 0),
    totalApuestas: volumen.reduce((acc, v) => acc + v.numeroApuestas, 0)
  })
);

export const selectIsLoading = createSelector(
  [selectLoading],
  (loading) => Object.values(loading).some(l => l)
);

export const selectHasError = createSelector(
  [selectError],
  (error) => Object.values(error).some(e => e !== null)
);

export default cuotasDinamicasSlice.reducer;