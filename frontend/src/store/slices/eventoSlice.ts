import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import type {
    EventoDeportivoType,
    FiltrosEventoType,
    EstadisticasEventosType,
    EventoDisponibleQuinielaType,
    EstadoEvento,
} from "../../types/EventoDeportivoTypes";

/**
 * Interface para el estado del slice de eventos deportivos
 */
interface EventoState {
    // Eventos principales
    eventos: EventoDeportivoType[];
    eventosProximos: EventoDeportivoType[];
    eventosDisponibles: EventoDisponibleQuinielaType[];
    eventoActual: EventoDeportivoType | null;
    
    // Listas auxiliares
    deportesDisponibles: string[];
    ligasDisponibles: string[];
    equiposDisponibles: string[];
    
    // Estadísticas
    estadisticas: EstadisticasEventosType | null;
    
    // Estados de carga
    loading: boolean;
    eventosLoading: boolean;
    eventosProximosLoading: boolean;
    eventosDisponiblesLoading: boolean;
    estadisticasLoading: boolean;
    
    // Paginación
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    
    // Filtros activos
    filtrosActivos: FiltrosEventoType;
    
    // Estados de error
    error: string | null;
    eventosError: string | null;
    estadisticasError: string | null;
    
    // Última actualización
    lastUpdated: string | null;
    
    // Cache de búsquedas
    busquedasRecientes: string[];
    
    // Configuración
    autoRefresh: boolean;
}

/**
 * Estado inicial del slice de eventos deportivos
 */
const initialState: EventoState = {
    eventos: [],
    eventosProximos: [],
    eventosDisponibles: [],
    eventoActual: null,
    deportesDisponibles: [],
    ligasDisponibles: [],
    equiposDisponibles: [],
    estadisticas: null,
    loading: false,
    eventosLoading: false,
    eventosProximosLoading: false,
    eventosDisponiblesLoading: false,
    estadisticasLoading: false,
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
    filtrosActivos: {},
    error: null,
    eventosError: null,
    estadisticasError: null,
    lastUpdated: null,
    busquedasRecientes: [],
    autoRefresh: false
};

/**
 * @file eventoSlice.ts
 * @description Este archivo define el `eventoSlice` para manejar el estado relacionado con eventos deportivos en la aplicación.
 * Utiliza Redux Toolkit's `createSlice` para manejar información de eventos, filtros, y estado de carga.
 */

/**
 * @constant eventoSlice
 * @description Un slice de Redux para manejar el estado de eventos deportivos.
 * Contiene lo siguiente:
 * - `name`: El nombre del slice, establecido como 'evento'.
 * - `initialState`: El estado inicial del slice de eventos.
 * - `reducers`: Un objeto que contiene funciones reducer para manejar actualizaciones de estado.
 */
const eventoSlice = createSlice({
    name: 'evento',
    initialState,
    reducers: {
        // ===== ACTIONS PARA EVENTOS PRINCIPALES =====
        
        /**
         * Establecer loading state para eventos
         */
        setEventosLoading: (state, action: PayloadAction<boolean>) => {
            state.eventosLoading = action.payload;
            if (action.payload) {
                state.eventosError = null;
            }
        },
        
        /**
         * Establecer la lista de eventos
         */
        setEventos: (state, action: PayloadAction<EventoDeportivoType[]>) => {
            state.eventos = action.payload;
            state.eventosLoading = false;
            state.eventosError = null;
            state.lastUpdated = new Date().toISOString();
        },
        
        /**
         * Establecer error para eventos
         */
        setEventosError: (state, action: PayloadAction<string>) => {
            state.eventosError = action.payload;
            state.eventosLoading = false;
        },
        
        /**
         * Limpiar eventos
         */
        clearEventos: (state) => {
            state.eventos = [];
            state.eventosError = null;
            state.filtrosActivos = {};
        },
        
        // ===== ACTIONS PARA EVENTOS PRÓXIMOS =====
        
        /**
         * Establecer loading state para eventos próximos
         */
        setEventosProximosLoading: (state, action: PayloadAction<boolean>) => {
            state.eventosProximosLoading = action.payload;
        },
        
        /**
         * Establecer eventos próximos
         */
        setEventosProximos: (state, action: PayloadAction<EventoDeportivoType[]>) => {
            state.eventosProximos = action.payload;
            state.eventosProximosLoading = false;
            state.lastUpdated = new Date().toISOString();
        },
        
        // ===== ACTIONS PARA EVENTOS DISPONIBLES =====
        
        /**
         * Establecer loading state para eventos disponibles
         */
        setEventosDisponiblesLoading: (state, action: PayloadAction<boolean>) => {
            state.eventosDisponiblesLoading = action.payload;
        },
        
        /**
         * Establecer eventos disponibles para quinielas
         */
        setEventosDisponibles: (state, action: PayloadAction<EventoDisponibleQuinielaType[]>) => {
            state.eventosDisponibles = action.payload;
            state.eventosDisponiblesLoading = false;
            state.error = null;
        },
        
        // ===== ACTIONS PARA EVENTO ACTUAL =====
        
        /**
         * Establecer evento actual
         */
        setEventoActual: (state, action: PayloadAction<EventoDeportivoType | null>) => {
            state.eventoActual = action.payload;
            state.loading = false;
        },
        
        /**
         * Limpiar evento actual
         */
        clearEventoActual: (state) => {
            state.eventoActual = null;
        },
        
        // ===== ACTIONS PARA LISTAS AUXILIARES =====
        
        /**
         * Establecer deportes disponibles
         */
        setDeportesDisponibles: (state, action: PayloadAction<string[]>) => {
            state.deportesDisponibles = action.payload;
        },
        
        /**
         * Establecer ligas disponibles
         */
        setLigasDisponibles: (state, action: PayloadAction<string[]>) => {
            state.ligasDisponibles = action.payload;
        },
        
        /**
         * Establecer equipos disponibles
         */
        setEquiposDisponibles: (state, action: PayloadAction<string[]>) => {
            state.equiposDisponibles = action.payload;
        },
        
        // ===== ACTIONS PARA ESTADÍSTICAS =====
        
        /**
         * Establecer loading state para estadísticas
         */
        setEstadisticasLoading: (state, action: PayloadAction<boolean>) => {
            state.estadisticasLoading = action.payload;
            if (action.payload) {
                state.estadisticasError = null;
            }
        },
        
        /**
         * Establecer estadísticas
         */
        setEstadisticas: (state, action: PayloadAction<EstadisticasEventosType>) => {
            state.estadisticas = action.payload;
            state.estadisticasLoading = false;
            state.estadisticasError = null;
        },
        
        /**
         * Establecer error para estadísticas
         */
        setEstadisticasError: (state, action: PayloadAction<string>) => {
            state.estadisticasError = action.payload;
            state.estadisticasLoading = false;
        },
        
        // ===== ACTIONS PARA PAGINACIÓN =====
        
        /**
         * Establecer datos de paginación
         */
        setPaginacion: (state, action: PayloadAction<{
            currentPage: number;
            totalPages: number;
            totalElements: number;
            pageSize: number;
        }>) => {
            const { currentPage, totalPages, totalElements, pageSize } = action.payload;
            state.currentPage = currentPage;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
            state.pageSize = pageSize;
        },
        
        /**
         * Cambiar página actual
         */
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        
        // ===== ACTIONS PARA FILTROS =====
        
        /**
         * Establecer filtros activos
         */
        setFiltrosActivos: (state, action: PayloadAction<FiltrosEventoType>) => {
            state.filtrosActivos = action.payload;
        },
        
        /**
         * Limpiar filtros activos
         */
        clearFiltros: (state) => {
            state.filtrosActivos = {};
        },
        
        /**
         * Agregar filtro específico
         */
        addFiltro: (state, action: PayloadAction<Partial<FiltrosEventoType>>) => {
            state.filtrosActivos = { ...state.filtrosActivos, ...action.payload };
        },
        
        /**
         * Remover filtro específico
         */
        removeFiltro: (state, action: PayloadAction<keyof FiltrosEventoType>) => {
            delete state.filtrosActivos[action.payload];
        },
        
        // ===== ACTIONS PARA BÚSQUEDAS =====
        
        /**
         * Agregar búsqueda reciente
         */
        addBusquedaReciente: (state, action: PayloadAction<string>) => {
            const busqueda = action.payload.trim();
            if (busqueda && !state.busquedasRecientes.includes(busqueda)) {
                state.busquedasRecientes.unshift(busqueda);
                // Mantener solo las últimas 10 búsquedas
                state.busquedasRecientes = state.busquedasRecientes.slice(0, 10);
            }
        },
        
        /**
         * Limpiar búsquedas recientes
         */
        clearBusquedasRecientes: (state) => {
            state.busquedasRecientes = [];
        },
        
        // ===== ACTIONS PARA ESTADOS GENERALES =====
        
        /**
         * Establecer loading general
         */
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
            if (action.payload) {
                state.error = null;
            }
        },
        
        /**
         * Establecer error general
         */
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        
        /**
         * Limpiar todos los errores
         */
        clearErrors: (state) => {
            state.error = null;
            state.eventosError = null;
            state.estadisticasError = null;
        },
        
        /**
         * Establecer configuración de auto-refresh
         */
        setAutoRefresh: (state, action: PayloadAction<boolean>) => {
            state.autoRefresh = action.payload;
        },
        
        /**
         * Resetear todo el estado
         */
        resetEstado: () => initialState,  
        
        // ===== ACTIONS PARA ACTUALIZAR EVENTO ESPECÍFICO =====
        
        /**
         * Actualizar un evento específico en la lista
         */
        updateEvento: (state, action: PayloadAction<EventoDeportivoType>) => {
            const eventoActualizado = action.payload;
            const index = state.eventos.findIndex(evento => evento.id === eventoActualizado.id);
            if (index !== -1) {
                state.eventos[index] = eventoActualizado;
            }
            
            // También actualizar en eventos próximos si existe
            const indexProximos = state.eventosProximos.findIndex(evento => evento.id === eventoActualizado.id);
            if (indexProximos !== -1) {
                state.eventosProximos[indexProximos] = eventoActualizado;
            }
            
            // Actualizar evento actual si coincide
            if (state.eventoActual?.id === eventoActualizado.id) {
                state.eventoActual = eventoActualizado;
            }
        },
        
        /**
         * Remover evento de todas las listas
         */
        removeEvento: (state, action: PayloadAction<number>) => {
            const eventoId = action.payload;
            state.eventos = state.eventos.filter(evento => evento.id !== eventoId);
            state.eventosProximos = state.eventosProximos.filter(evento => evento.id !== eventoId);
            state.eventosDisponibles = state.eventosDisponibles.filter(evento => evento.id !== eventoId);
            
            if (state.eventoActual?.id === eventoId) {
                state.eventoActual = null;
            }
        }
    }
});

// Exportar las acciones
export const {
    // Eventos principales
    setEventosLoading,
    setEventos,
    setEventosError,
    clearEventos,
    
    // Eventos próximos
    setEventosProximosLoading,
    setEventosProximos,
    
    // Eventos disponibles
    setEventosDisponiblesLoading,
    setEventosDisponibles,
    
    // Evento actual
    setEventoActual,
    clearEventoActual,
    
    // Listas auxiliares
    setDeportesDisponibles,
    setLigasDisponibles,
    setEquiposDisponibles,
    
    // Estadísticas
    setEstadisticasLoading,
    setEstadisticas,
    setEstadisticasError,
    
    // Paginación
    setPaginacion,
    setCurrentPage,
    
    // Filtros
    setFiltrosActivos,
    clearFiltros,
    addFiltro,
    removeFiltro,
    
    // Búsquedas
    addBusquedaReciente,
    clearBusquedasRecientes,
    
    // Estados generales
    setLoading,
    setError,
    clearErrors,
    setAutoRefresh,
    resetEstado,
    
    // Actualización de eventos
    updateEvento,
    removeEvento
} = eventoSlice.actions;

// ===== SELECTORES CON CREATESELECTOR =====

/**
 * Selector para obtener eventos filtrados por estado
 */
const selectEventosPorEstado = createSelector(
    [(state: { evento: EventoState }) => state.evento.eventos, (_: unknown, estado: EstadoEvento) => estado],
    (eventos, estado) => eventos.filter(evento => evento.estado === estado)
);

/**
 * Selector para obtener eventos de hoy
 */
const selectEventosHoy = createSelector(
    [(state: { evento: EventoState }) => state.evento.eventos],
    (eventos) => {
        const hoy = new Date().toISOString().split('T')[0];
        return eventos.filter(evento => 
            evento.fechaEvento.startsWith(hoy)
        );
    }
);

/**
 * Selector para obtener eventos por deporte
 */
const selectEventosPorDeporte = createSelector(
    [(state: { evento: EventoState }) => state.evento.eventos, (_: unknown, deporte: string) => deporte],
    (eventos, deporte) => eventos.filter(evento => evento.deporte.nombre === deporte)
);

/**
 * Selector para verificar si hay filtros activos
 */
const selectTieneFiltrosActivos = createSelector(
    [(state: { evento: EventoState }) => state.evento.filtrosActivos],
    (filtros) => Object.keys(filtros).length > 0
);

/**
 * Selector para obtener estado de carga general
 */
const selectIsLoading = createSelector(
    [(state: { evento: EventoState }) => state.evento],
    (eventoState) => eventoState.loading || 
                     eventoState.eventosLoading || 
                     eventoState.eventosProximosLoading || 
                     eventoState.estadisticasLoading
);

/**
 * Selector para obtener todos los errores
 */
const selectHasErrors = createSelector(
    [(state: { evento: EventoState }) => state.evento],
    (eventoState) => !!(eventoState.error || 
                       eventoState.eventosError || 
                       eventoState.estadisticasError)
);

/**
 * Objeto con todos los selectores del evento slice
 */
export const eventoSelector = {
    // Datos principales
    eventos: (state: { evento: EventoState }) => state.evento.eventos,
    eventosProximos: (state: { evento: EventoState }) => state.evento.eventosProximos,
    eventosDisponibles: (state: { evento: EventoState }) => state.evento.eventosDisponibles,
    eventoActual: (state: { evento: EventoState }) => state.evento.eventoActual,
    
    // Listas auxiliares
    deportesDisponibles: (state: { evento: EventoState }) => state.evento.deportesDisponibles,
    ligasDisponibles: (state: { evento: EventoState }) => state.evento.ligasDisponibles,
    equiposDisponibles: (state: { evento: EventoState }) => state.evento.equiposDisponibles,
    
    // Estadísticas
    estadisticas: (state: { evento: EventoState }) => state.evento.estadisticas,
    
    // Estados de carga
    loading: (state: { evento: EventoState }) => state.evento.loading,
    eventosLoading: (state: { evento: EventoState }) => state.evento.eventosLoading,
    eventosProximosLoading: (state: { evento: EventoState }) => state.evento.eventosProximosLoading,
    eventosDisponiblesLoading: (state: { evento: EventoState }) => state.evento.eventosDisponiblesLoading,
    estadisticasLoading: (state: { evento: EventoState }) => state.evento.estadisticasLoading,
    isLoading: selectIsLoading,
    
    // Paginación
    currentPage: (state: { evento: EventoState }) => state.evento.currentPage,
    totalPages: (state: { evento: EventoState }) => state.evento.totalPages,
    totalElements: (state: { evento: EventoState }) => state.evento.totalElements,
    pageSize: (state: { evento: EventoState }) => state.evento.pageSize,
    
    // Filtros
    filtrosActivos: (state: { evento: EventoState }) => state.evento.filtrosActivos,
    tieneFiltrosActivos: selectTieneFiltrosActivos,
    
    // Búsquedas
    busquedasRecientes: (state: { evento: EventoState }) => state.evento.busquedasRecientes,
    
    // Errores
    error: (state: { evento: EventoState }) => state.evento.error,
    eventosError: (state: { evento: EventoState }) => state.evento.eventosError,
    estadisticasError: (state: { evento: EventoState }) => state.evento.estadisticasError,
    hasErrors: selectHasErrors,
    
    // Última actualización
    lastUpdated: (state: { evento: EventoState }) => state.evento.lastUpdated,
    
    // Configuración
    autoRefresh: (state: { evento: EventoState }) => state.evento.autoRefresh,
    
    // Selectores computados
    eventosHoy: selectEventosHoy,
    eventosProgramados: (state: { evento: EventoState }) => selectEventosPorEstado(state, 'programado'),
    eventosEnVivo: (state: { evento: EventoState }) => selectEventosPorEstado(state, 'en_vivo'),
    eventosFinalizados: (state: { evento: EventoState }) => selectEventosPorEstado(state, 'finalizado'),
    eventosCancelados: (state: { evento: EventoState }) => selectEventosPorEstado(state, 'cancelado'),
    
    // Contadores
    totalEventos: (state: { evento: EventoState }) => state.evento.eventos.length,
    totalEventosProximos: (state: { evento: EventoState }) => state.evento.eventosProximos.length,
    totalEventosDisponibles: (state: { evento: EventoState }) => state.evento.eventosDisponibles.length,
    
    // Estados derivados
    tieneEventos: (state: { evento: EventoState }) => state.evento.eventos.length > 0,
    tieneEventosProximos: (state: { evento: EventoState }) => state.evento.eventosProximos.length > 0,
    tieneEventosDisponibles: (state: { evento: EventoState }) => state.evento.eventosDisponibles.length > 0,
    
    // Función para filtrar eventos por deporte
    eventosPorDeporte: (deporte: string) => (state: { evento: EventoState }) => 
        selectEventosPorDeporte(state, deporte)
};

export default eventoSlice.reducer;
