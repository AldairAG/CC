import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import {
    type ApuestaType,
    type ApuestaDetalle,
    type ResumenApuestaType,
    type EstadisticasApuestaType,
    EstadoApuesta,
    type TipoApuesta,
} from "../../types/ApuestaType";
import type { EventoDeportivoType } from "../../types/EventoDeportivoTypes";

interface ApuestaState {
    // Apuestas principales con diferentes vistas
    misApuestas: ApuestaType[];
    apuestasActivas: ApuestaType[];
    apuestasFinalizadas: ApuestaType[];
    apuestasRecientes: ResumenApuestaType[];
    apuestasPorTipo: ApuestaType[];
    apuestasPorEstado: ApuestaType[];
    apuestasPorEvento: ApuestaType[];
    resultadosBusqueda: ApuestaType[];
    eventosConMasApuestas: EventoDeportivoType[];

    // Apuesta actual seleccionada
    apuestaActual: ApuestaDetalle | null;

    // Estadísticas y resúmenes
    estadisticasApuestas: EstadisticasApuestaType | null;

    // Estados de carga
    loading: {
        misApuestas: boolean;
        eventosConMasApuestas: boolean;
        apuestasActivas: boolean;
        apuestasFinalizadas: boolean;
        apuestasRecientes: boolean;
        apuestasPorTipo: boolean;
        apuestasPorEstado: boolean;
        apuestasPorEvento: boolean;
        busqueda: boolean;
        apuestaActual: boolean;
        estadisticas: boolean;
        creandoApuesta: boolean;
        cancelandoApuesta: boolean;
        procesandoResultados: boolean;
    };

    // Estados de error
    error: {
        misApuestas: string | null;
        apuestasActivas: string | null;
        apuestasFinalizadas: string | null;
        apuestasRecientes: string | null;
        apuestasPorTipo: string | null;
        apuestasPorEstado: string | null;
        apuestasPorEvento: string | null;
        busqueda: string | null;
        apuestaActual: string | null;
        estadisticas: string | null;
        crearApuesta: string | null;
        cancelarApuesta: string | null;
        procesarResultados: string | null;
        eventosConMasApuestas: string | null;
    };

    // Filtros y búsqueda
    filtros: {
        estado: EstadoApuesta | null;
        tipoApuesta: TipoApuesta | null;
        fechaDesde: string | null;
        fechaHasta: string | null;
        montoMinimo: number | null;
        montoMaximo: number | null;
        eventoId: number | null;
        busqueda: string;
    };

    // Paginación para diferentes vistas
    paginacion: {
        misApuestas: {
            page: number;
            size: number;
            totalElements: number;
            totalPages: number;
        };
        apuestasActivas: {
            page: number;
            size: number;
            totalElements: number;
            totalPages: number;
        };
        apuestasFinalizadas: {
            page: number;
            size: number;
            totalElements: number;
            totalPages: number;
        };
        apuestasPorTipo: {
            page: number;
            size: number;
            totalElements: number;
            totalPages: number;
        };
        apuestasPorEstado: {
            page: number;
            size: number;
            totalElements: number;
            totalPages: number;
        };
        apuestasPorEvento: {
            page: number;
            size: number;
            totalElements: number;
            totalPages: number;
        };
        resultadosBusqueda: {
            page: number;
            size: number;
            totalElements: number;
            totalPages: number;
        };
    };

    // Configuración adicional
    configuracion: {
        limites: {
            minimo: number;
            maximo: number;
            disponible: number;
        } | null;
        pageSize: number;
    };
}

const initialState: ApuestaState = {
    misApuestas: [],
    apuestasActivas: [],
    apuestasFinalizadas: [],
    apuestasRecientes: [],
    apuestasPorTipo: [],
    apuestasPorEstado: [],
    apuestasPorEvento: [],
    resultadosBusqueda: [],
    eventosConMasApuestas: [],
    apuestaActual: null,
    estadisticasApuestas: null,

    loading: {
        eventosConMasApuestas: false,
        misApuestas: false,
        apuestasActivas: false,
        apuestasFinalizadas: false,
        apuestasRecientes: false,
        apuestasPorTipo: false,
        apuestasPorEstado: false,
        apuestasPorEvento: false,
        busqueda: false,
        apuestaActual: false,
        estadisticas: false,
        creandoApuesta: false,
        cancelandoApuesta: false,
        procesandoResultados: false,
    },

    error: {
        eventosConMasApuestas: null,
        misApuestas: null,
        apuestasActivas: null,
        apuestasFinalizadas: null,
        apuestasRecientes: null,
        apuestasPorTipo: null,
        apuestasPorEstado: null,
        apuestasPorEvento: null,
        busqueda: null,
        apuestaActual: null,
        estadisticas: null,
        crearApuesta: null,
        cancelarApuesta: null,
        procesarResultados: null,
    },

    filtros: {
        estado: null,
        tipoApuesta: null,
        fechaDesde: null,
        fechaHasta: null,
        montoMinimo: null,
        montoMaximo: null,
        eventoId: null,
        busqueda: '',
    },

    paginacion: {
        misApuestas: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
        },
        apuestasActivas: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
        },
        apuestasFinalizadas: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
        },
        apuestasPorTipo: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
        },
        apuestasPorEstado: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
        },
        apuestasPorEvento: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
        },
        resultadosBusqueda: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
        },
    },

    configuracion: {
        limites: null,
        pageSize: 10,
    },
};

const apuestaSlice = createSlice({
    name: 'apuesta',
    initialState,
    reducers: {
        // Acciones para mis apuestas
        setMisApuestasLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.misApuestas = action.payload;
            if (action.payload) {
                state.error.misApuestas = null;
            }
        },
        setMisApuestas: (state, action: PayloadAction<{
            apuestas: ApuestaType[];
            paginacion: {
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            };
        }>) => {
            state.misApuestas = action.payload.apuestas;
            state.paginacion.misApuestas = action.payload.paginacion;
            state.loading.misApuestas = false;
            state.error.misApuestas = null;
        },
        setMisApuestasError: (state, action: PayloadAction<string>) => {
            state.error.misApuestas = action.payload;
            state.loading.misApuestas = false;
        },

        // Acciones para apuestas activas
        setApuestasActivasLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.apuestasActivas = action.payload;
            if (action.payload) {
                state.error.apuestasActivas = null;
            }
        },
        setApuestasActivas: (state, action: PayloadAction<{
            apuestas: ApuestaType[];
            paginacion: {
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            };
        }>) => {
            state.apuestasActivas = action.payload.apuestas;
            state.paginacion.apuestasActivas = action.payload.paginacion;
            state.loading.apuestasActivas = false;
            state.error.apuestasActivas = null;
        },
        setApuestasActivasError: (state, action: PayloadAction<string>) => {
            state.error.apuestasActivas = action.payload;
            state.loading.apuestasActivas = false;
        },
        setEventosConMasApuestas: (state, action: PayloadAction<EventoDeportivoType[]>) => {
            state.eventosConMasApuestas = action.payload;
            state.loading.eventosConMasApuestas = false;
            state.error.eventosConMasApuestas = null;
        },
        setEventosConMasApuestasLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.eventosConMasApuestas = action.payload;
            if (action.payload) {
                state.error.eventosConMasApuestas = null;
            }
        },
        setEventosConMasApuestasError: (state, action: PayloadAction<string>) => {
            state.error.eventosConMasApuestas = action.payload;
            state.loading.eventosConMasApuestas = false;
        },

        // Acciones para apuestas finalizadas
        setApuestasFinalizadasLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.apuestasFinalizadas = action.payload;
            if (action.payload) {
                state.error.apuestasFinalizadas = null;
            }
        },
        setApuestasFinalizadas: (state, action: PayloadAction<{
            apuestas: ApuestaType[];
            paginacion: {
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            };
        }>) => {
            state.apuestasFinalizadas = action.payload.apuestas;
            state.paginacion.apuestasFinalizadas = action.payload.paginacion;
            state.loading.apuestasFinalizadas = false;
            state.error.apuestasFinalizadas = null;
        },
        setApuestasFinalizadasError: (state, action: PayloadAction<string>) => {
            state.error.apuestasFinalizadas = action.payload;
            state.loading.apuestasFinalizadas = false;
        },

        // Acciones para apuestas recientes
        setApuestasRecientesLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.apuestasRecientes = action.payload;
            if (action.payload) {
                state.error.apuestasRecientes = null;
            }
        },
        setApuestasRecientes: (state, action: PayloadAction<ResumenApuestaType[]>) => {
            state.apuestasRecientes = action.payload;
            state.loading.apuestasRecientes = false;
            state.error.apuestasRecientes = null;
        },
        setApuestasRecientesError: (state, action: PayloadAction<string>) => {
            state.error.apuestasRecientes = action.payload;
            state.loading.apuestasRecientes = false;
        },

        // Acciones para apuestas por tipo
        setApuestasPorTipoLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.apuestasPorTipo = action.payload;
            if (action.payload) {
                state.error.apuestasPorTipo = null;
            }
        },
        setApuestasPorTipo: (state, action: PayloadAction<{
            apuestas: ApuestaType[];
            tipo: TipoApuesta;
            paginacion: {
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            };
        }>) => {
            state.apuestasPorTipo = action.payload.apuestas;
            state.paginacion.apuestasPorTipo = action.payload.paginacion;
            state.loading.apuestasPorTipo = false;
            state.error.apuestasPorTipo = null;
        },
        setApuestasPorTipoError: (state, action: PayloadAction<string>) => {
            state.error.apuestasPorTipo = action.payload;
            state.loading.apuestasPorTipo = false;
        },

        // Acciones para apuestas por estado
        setApuestasPorEstadoLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.apuestasPorEstado = action.payload;
            if (action.payload) {
                state.error.apuestasPorEstado = null;
            }
        },
        setApuestasPorEstado: (state, action: PayloadAction<{
            apuestas: ApuestaType[];
            estado: EstadoApuesta;
            paginacion: {
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            };
        }>) => {
            state.apuestasPorEstado = action.payload.apuestas;
            state.paginacion.apuestasPorEstado = action.payload.paginacion;
            state.loading.apuestasPorEstado = false;
            state.error.apuestasPorEstado = null;
        },
        setApuestasPorEstadoError: (state, action: PayloadAction<string>) => {
            state.error.apuestasPorEstado = action.payload;
            state.loading.apuestasPorEstado = false;
        },

        // Acciones para apuestas por evento
        setApuestasPorEventoLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.apuestasPorEvento = action.payload;
            if (action.payload) {
                state.error.apuestasPorEvento = null;
            }
        },
        setApuestasPorEvento: (state, action: PayloadAction<{
            apuestas: ApuestaType[];
            eventoId: number;
            paginacion: {
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            };
        }>) => {
            state.apuestasPorEvento = action.payload.apuestas;
            state.paginacion.apuestasPorEvento = action.payload.paginacion;
            state.loading.apuestasPorEvento = false;
            state.error.apuestasPorEvento = null;
        },
        setApuestasPorEventoError: (state, action: PayloadAction<string>) => {
            state.error.apuestasPorEvento = action.payload;
            state.loading.apuestasPorEvento = false;
        },

        // Acciones para búsqueda
        setBusquedaLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.busqueda = action.payload;
            if (action.payload) {
                state.error.busqueda = null;
            }
        },
        setResultadosBusqueda: (state, action: PayloadAction<{
            apuestas: ApuestaType[];
            query: string;
            paginacion: {
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            };
        }>) => {
            state.resultadosBusqueda = action.payload.apuestas;
            state.paginacion.resultadosBusqueda = action.payload.paginacion;
            state.loading.busqueda = false;
            state.error.busqueda = null;
        },
        setBusquedaError: (state, action: PayloadAction<string>) => {
            state.error.busqueda = action.payload;
            state.loading.busqueda = false;
        },
        clearResultadosBusqueda: (state) => {
            state.resultadosBusqueda = [];
            state.paginacion.resultadosBusqueda = initialState.paginacion.resultadosBusqueda;
            state.error.busqueda = null;
        },

        // Acciones para apuesta actual
        setApuestaActualLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.apuestaActual = action.payload;
            if (action.payload) {
                state.error.apuestaActual = null;
            }
        },
        setApuestaActual: (state, action: PayloadAction<ApuestaDetalle>) => {
            state.apuestaActual = action.payload;
            state.loading.apuestaActual = false;
            state.error.apuestaActual = null;
        },
        setApuestaActualError: (state, action: PayloadAction<string>) => {
            state.error.apuestaActual = action.payload;
            state.loading.apuestaActual = false;
        },
        clearApuestaActual: (state) => {
            state.apuestaActual = null;
            state.error.apuestaActual = null;
        },

        // Acciones para estadísticas
        setEstadisticasLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.estadisticas = action.payload;
            if (action.payload) {
                state.error.estadisticas = null;
            }
        },
        setEstadisticasApuestas: (state, action: PayloadAction<EstadisticasApuestaType>) => {
            state.estadisticasApuestas = action.payload;
            state.loading.estadisticas = false;
            state.error.estadisticas = null;
        },
        setEstadisticasError: (state, action: PayloadAction<string>) => {
            state.error.estadisticas = action.payload;
            state.loading.estadisticas = false;
        },

        // Acciones para crear apuesta
        setCreandoApuestaLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.creandoApuesta = action.payload;
            if (action.payload) {
                state.error.crearApuesta = null;
            }
        },
        setCrearApuestaError: (state, action: PayloadAction<string>) => {
            state.error.crearApuesta = action.payload;
            state.loading.creandoApuesta = false;
        },
        apuestaCreadaExitosamente: (state, action: PayloadAction<ApuestaType>) => {
            // Agregar la nueva apuesta al principio de las listas relevantes
            state.misApuestas.unshift(action.payload);
            state.apuestasActivas.unshift(action.payload);
            
            // Actualizar estadísticas localmente
            if (state.estadisticasApuestas) {
                state.estadisticasApuestas.totalApuestas += 1;
                state.estadisticasApuestas.montoTotalApostado += action.payload.montoApostado;
                state.estadisticasApuestas.apuestasPendientes += 1;
            }

            state.loading.creandoApuesta = false;
            state.error.crearApuesta = null;
        },

        // Acciones para cancelar apuesta
        setCancelandoApuestaLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.cancelandoApuesta = action.payload;
            if (action.payload) {
                state.error.cancelarApuesta = null;
            }
        },
        setCancelarApuestaError: (state, action: PayloadAction<string>) => {
            state.error.cancelarApuesta = action.payload;
            state.loading.cancelandoApuesta = false;
        },
        apuestaCanceladaExitosamente: (state, action: PayloadAction<{ apuestaId: number; mensaje: string }>) => {
            const { apuestaId } = action.payload;
            
            // Actualizar estado de la apuesta en todas las listas
            const listas = [
                state.misApuestas,
                state.apuestasActivas,
                state.apuestasFinalizadas,
                state.apuestasPorTipo,
                state.apuestasPorEstado,
                state.apuestasPorEvento,
                state.resultadosBusqueda,
            ];

            listas.forEach(lista => {
                const index = lista.findIndex(apuesta => apuesta.id === apuestaId);
                if (index !== -1) {
                    lista[index].estado = EstadoApuesta.CANCELADA;
                }
            });

            // Actualizar apuesta actual si coincide
            if (state.apuestaActual && state.apuestaActual.id === apuestaId) {
                state.apuestaActual.estado = EstadoApuesta.CANCELADA;
            }

            state.loading.cancelandoApuesta = false;
            state.error.cancelarApuesta = null;
        },

        // Acciones para procesar resultados
        setProcesandoResultadosLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.procesandoResultados = action.payload;
            if (action.payload) {
                state.error.procesarResultados = null;
            }
        },
        setProcesarResultadosError: (state, action: PayloadAction<string>) => {
            state.error.procesarResultados = action.payload;
            state.loading.procesandoResultados = false;
        },
        resultadosProcesadosExitosamente: (state) => {
            state.loading.procesandoResultados = false;
            state.error.procesarResultados = null;
        },

        // Acciones para filtros de estado
        setFiltroEstado: (state, action: PayloadAction<EstadoApuesta | null>) => {
            state.filtros.estado = action.payload;
        },

        // Acciones para filtros de tipo de apuesta
        setFiltroTipoApuesta: (state, action: PayloadAction<TipoApuesta | null>) => {
            state.filtros.tipoApuesta = action.payload;
        },

        // Acciones para filtros de fechas
        setFiltroFechaDesde: (state, action: PayloadAction<string | null>) => {
            state.filtros.fechaDesde = action.payload;
        },
        setFiltroFechaHasta: (state, action: PayloadAction<string | null>) => {
            state.filtros.fechaHasta = action.payload;
        },
        setFiltroFechas: (state, action: PayloadAction<{ fechaDesde?: string | null; fechaHasta?: string | null }>) => {
            if (action.payload.fechaDesde !== undefined) {
                state.filtros.fechaDesde = action.payload.fechaDesde;
            }
            if (action.payload.fechaHasta !== undefined) {
                state.filtros.fechaHasta = action.payload.fechaHasta;
            }
        },

        // Acciones para filtros de montos
        setFiltroMontoMinimo: (state, action: PayloadAction<number | null>) => {
            state.filtros.montoMinimo = action.payload;
        },
        setFiltroMontoMaximo: (state, action: PayloadAction<number | null>) => {
            state.filtros.montoMaximo = action.payload;
        },
        setFiltroMontos: (state, action: PayloadAction<{ montoMinimo?: number | null; montoMaximo?: number | null }>) => {
            if (action.payload.montoMinimo !== undefined) {
                state.filtros.montoMinimo = action.payload.montoMinimo;
            }
            if (action.payload.montoMaximo !== undefined) {
                state.filtros.montoMaximo = action.payload.montoMaximo;
            }
        },

        // Acciones para filtro de evento
        setFiltroEventoId: (state, action: PayloadAction<number | null>) => {
            state.filtros.eventoId = action.payload;
        },

        // Acciones para búsqueda
        setFiltroBusqueda: (state, action: PayloadAction<string>) => {
            state.filtros.busqueda = action.payload;
        },

        // Limpiar filtros
        clearFiltros: (state) => {
            state.filtros = {
                estado: null,
                tipoApuesta: null,
                fechaDesde: null,
                fechaHasta: null,
                montoMinimo: null,
                montoMaximo: null,
                eventoId: null,
                busqueda: '',
            };
        },

        // Establecer múltiples filtros
        setFiltros: (state, action: PayloadAction<Partial<typeof state.filtros>>) => {
            state.filtros = { ...state.filtros, ...action.payload };
        },

        // Acciones para configuración
        setLimitesApuesta: (state, action: PayloadAction<{
            minimo: number;
            maximo: number;
            disponible: number;
        }>) => {
            state.configuracion.limites = action.payload;
        },

        setPageSize: (state, action: PayloadAction<number>) => {
            state.configuracion.pageSize = action.payload;
            // Reiniciar todas las páginas a 0 cuando cambia el tamaño
            Object.keys(state.paginacion).forEach(key => {
                const paginationKey = key as keyof typeof state.paginacion;
                state.paginacion[paginationKey].page = 0;
                state.paginacion[paginationKey].size = action.payload;
            });
        },

        // Actualizar apuesta en las listas localmente
        actualizarApuestaLocal: (state, action: PayloadAction<Partial<ApuestaType> & { id: number }>) => {
            const { id, ...updates } = action.payload;
            
            // Actualizar en todas las listas
            const listas = [
                state.misApuestas,
                state.apuestasActivas,
                state.apuestasFinalizadas,
                state.apuestasPorTipo,
                state.apuestasPorEstado,
                state.apuestasPorEvento,
                state.resultadosBusqueda,
            ];

            listas.forEach(lista => {
                const index = lista.findIndex(apuesta => apuesta.id === id);
                if (index !== -1) {
                    lista[index] = { ...lista[index], ...updates };
                }
            });

            // Actualizar apuesta actual si coincide
            if (state.apuestaActual && state.apuestaActual.id === id) {
                state.apuestaActual = { ...state.apuestaActual, ...updates };
            }
        },

        // Agregar nueva apuesta
        addApuesta: (state, action: PayloadAction<ApuestaType>) => {
            state.misApuestas.unshift(action.payload);
            
            // Si es activa también la agregamos a esa lista
            if (action.payload.estado === EstadoApuesta.PENDIENTE || action.payload.estado === EstadoApuesta.ACEPTADA) {
                state.apuestasActivas.unshift(action.payload);
            }
        },

        // Remover apuesta
        removeApuesta: (state, action: PayloadAction<number>) => {
            const apuestaId = action.payload;
            
            state.misApuestas = state.misApuestas.filter(a => a.id !== apuestaId);
            state.apuestasActivas = state.apuestasActivas.filter(a => a.id !== apuestaId);
            state.apuestasFinalizadas = state.apuestasFinalizadas.filter(a => a.id !== apuestaId);
            state.apuestasPorTipo = state.apuestasPorTipo.filter(a => a.id !== apuestaId);
            state.apuestasPorEstado = state.apuestasPorEstado.filter(a => a.id !== apuestaId);
            state.apuestasPorEvento = state.apuestasPorEvento.filter(a => a.id !== apuestaId);
            state.resultadosBusqueda = state.resultadosBusqueda.filter(a => a.id !== apuestaId);
            
            if (state.apuestaActual && state.apuestaActual.id === apuestaId) {
                state.apuestaActual = null;
            }
        },

        // Limpiar todos los datos
        clearApuestaData: () => {
            return initialState;
        },

        // Limpiar errores
        clearErrors: (state) => {
            state.error = {
                eventosConMasApuestas: null,
                misApuestas: null,
                apuestasActivas: null,
                apuestasFinalizadas: null,
                apuestasRecientes: null,
                apuestasPorTipo: null,
                apuestasPorEstado: null,
                apuestasPorEvento: null,
                busqueda: null,
                apuestaActual: null,
                estadisticas: null,
                crearApuesta: null,
                cancelarApuesta: null,
                procesarResultados: null,
            };
        },

        // Limpiar datos específicos
        clearMisApuestas: (state) => {
            state.misApuestas = [];
            state.paginacion.misApuestas = initialState.paginacion.misApuestas;
        },
        clearApuestasActivas: (state) => {
            state.apuestasActivas = [];
            state.paginacion.apuestasActivas = initialState.paginacion.apuestasActivas;
        },
    },
});

// Exportar acciones
export const {
    setEventosConMasApuestasLoading,
    setEventosConMasApuestasError,
    setEventosConMasApuestas,
    setMisApuestasLoading,
    setMisApuestas,
    setMisApuestasError,
    setApuestasActivasLoading,
    setApuestasActivas,
    setApuestasActivasError,
    setApuestasFinalizadasLoading,
    setApuestasFinalizadas,
    setApuestasFinalizadasError,
    setApuestasRecientesLoading,
    setApuestasRecientes,
    setApuestasRecientesError,
    setApuestasPorTipoLoading,
    setApuestasPorTipo,
    setApuestasPorTipoError,
    setApuestasPorEstadoLoading,
    setApuestasPorEstado,
    setApuestasPorEstadoError,
    setApuestasPorEventoLoading,
    setApuestasPorEvento,
    setApuestasPorEventoError,
    setBusquedaLoading,
    setResultadosBusqueda,
    setBusquedaError,
    clearResultadosBusqueda,
    setApuestaActualLoading,
    setApuestaActual,
    setApuestaActualError,
    clearApuestaActual,
    setEstadisticasLoading,
    setEstadisticasApuestas,
    setEstadisticasError,
    setCreandoApuestaLoading,
    setCrearApuestaError,
    apuestaCreadaExitosamente,
    setCancelandoApuestaLoading,
    setCancelarApuestaError,
    apuestaCanceladaExitosamente,
    setProcesandoResultadosLoading,
    setProcesarResultadosError,
    resultadosProcesadosExitosamente,
    setFiltroEstado,
    setFiltroTipoApuesta,
    setFiltroFechaDesde,
    setFiltroFechaHasta,
    setFiltroFechas,
    setFiltroMontoMinimo,
    setFiltroMontoMaximo,
    setFiltroMontos,
    setFiltroEventoId,
    setFiltroBusqueda,
    clearFiltros,
    setFiltros,
    setLimitesApuesta,
    setPageSize,
    actualizarApuestaLocal,
    addApuesta,
    removeApuesta,
    clearApuestaData,
    clearErrors,
    clearMisApuestas,
    clearApuestasActivas,
} = apuestaSlice.actions;

// Selectores usando createSelector para optimización
const selectApuestaState = (state: { apuesta: ApuestaState }) => state.apuesta;

export const apuestaSelector = {
    // Selectores básicos
    misApuestas: createSelector([selectApuestaState], (state) => state.misApuestas),
    eventosConMasApuestas: createSelector([selectApuestaState], (state) => state.eventosConMasApuestas),
    apuestasActivas: createSelector([selectApuestaState], (state) => state.apuestasActivas),
    apuestasFinalizadas: createSelector([selectApuestaState], (state) => state.apuestasFinalizadas),
    apuestasRecientes: createSelector([selectApuestaState], (state) => state.apuestasRecientes),
    apuestasPorTipo: createSelector([selectApuestaState], (state) => state.apuestasPorTipo),
    apuestasPorEstado: createSelector([selectApuestaState], (state) => state.apuestasPorEstado),
    apuestasPorEvento: createSelector([selectApuestaState], (state) => state.apuestasPorEvento),
    resultadosBusqueda: createSelector([selectApuestaState], (state) => state.resultadosBusqueda),
    apuestaActual: createSelector([selectApuestaState], (state) => state.apuestaActual),
    estadisticasApuestas: createSelector([selectApuestaState], (state) => state.estadisticasApuestas),

    // Selectores de loading
    loading: createSelector([selectApuestaState], (state) => state.loading),
    isLoadingMisApuestas: createSelector([selectApuestaState], (state) => state.loading.misApuestas),
    isLoadingApuestasActivas: createSelector([selectApuestaState], (state) => state.loading.apuestasActivas),
    isLoadingBusqueda: createSelector([selectApuestaState], (state) => state.loading.busqueda),
    isCreandoApuesta: createSelector([selectApuestaState], (state) => state.loading.creandoApuesta),
    isCancelandoApuesta: createSelector([selectApuestaState], (state) => state.loading.cancelandoApuesta),

    // Selectores de errores
    errors: createSelector([selectApuestaState], (state) => state.error),
    errorMisApuestas: createSelector([selectApuestaState], (state) => state.error.misApuestas),
    errorBusqueda: createSelector([selectApuestaState], (state) => state.error.busqueda),
    errorCrearApuesta: createSelector([selectApuestaState], (state) => state.error.crearApuesta),
    errorCancelarApuesta: createSelector([selectApuestaState], (state) => state.error.cancelarApuesta),

    // Selectores de filtros
    filtros: createSelector([selectApuestaState], (state) => state.filtros),
    filtroEstado: createSelector([selectApuestaState], (state) => state.filtros.estado),
    filtroTipoApuesta: createSelector([selectApuestaState], (state) => state.filtros.tipoApuesta),
    filtroFechas: createSelector([selectApuestaState], (state) => ({
        fechaDesde: state.filtros.fechaDesde,
        fechaHasta: state.filtros.fechaHasta,
    })),
    filtroMontos: createSelector([selectApuestaState], (state) => ({
        montoMinimo: state.filtros.montoMinimo,
        montoMaximo: state.filtros.montoMaximo,
    })),
    filtroBusqueda: createSelector([selectApuestaState], (state) => state.filtros.busqueda),
    filtroEventoId: createSelector([selectApuestaState], (state) => state.filtros.eventoId),

    // Selectores de paginación
    paginacion: createSelector([selectApuestaState], (state) => state.paginacion),
    paginacionMisApuestas: createSelector([selectApuestaState], (state) => state.paginacion.misApuestas),
    paginacionApuestasActivas: createSelector([selectApuestaState], (state) => state.paginacion.apuestasActivas),
    paginacionBusqueda: createSelector([selectApuestaState], (state) => state.paginacion.resultadosBusqueda),

    // Selectores de configuración
    configuracion: createSelector([selectApuestaState], (state) => state.configuracion),
    limites: createSelector([selectApuestaState], (state) => state.configuracion.limites),
    pageSize: createSelector([selectApuestaState], (state) => state.configuracion.pageSize),

    // Selectores computados
    hasMisApuestas: createSelector([selectApuestaState], (state) => state.misApuestas.length > 0),
    hasApuestasActivas: createSelector([selectApuestaState], (state) => state.apuestasActivas.length > 0),
    hasResultadosBusqueda: createSelector([selectApuestaState], (state) => state.resultadosBusqueda.length > 0),
    
    // Filtros activos
    tienesFiltrosActivos: createSelector([selectApuestaState], (state) => {
        const { filtros } = state;
        return !!(
            filtros.estado ||
            filtros.tipoApuesta ||
            filtros.fechaDesde ||
            filtros.fechaHasta ||
            filtros.montoMinimo ||
            filtros.montoMaximo ||
            filtros.eventoId ||
            filtros.busqueda
        );
    }),

    // Contador de filtros activos
    contadorFiltrosActivos: createSelector([selectApuestaState], (state) => {
        const { filtros } = state;
        let contador = 0;
        if (filtros.estado) contador++;
        if (filtros.tipoApuesta) contador++;
        if (filtros.fechaDesde) contador++;
        if (filtros.fechaHasta) contador++;
        if (filtros.montoMinimo) contador++;
        if (filtros.montoMaximo) contador++;
        if (filtros.eventoId) contador++;
        if (filtros.busqueda) contador++;
        return contador;
    }),

    // Total de elementos en diferentes vistas
    totalMisApuestas: createSelector([selectApuestaState], (state) => state.paginacion.misApuestas.totalElements),
    totalApuestasActivas: createSelector([selectApuestaState], (state) => state.paginacion.apuestasActivas.totalElements),
    totalResultadosBusqueda: createSelector([selectApuestaState], (state) => state.paginacion.resultadosBusqueda.totalElements),

    // Selector para mis apuestas con filtros aplicados localmente
    misApuestasFiltradas: createSelector(
        [selectApuestaState],
        (state) => {
            let apuestas = state.misApuestas;

            // Aplicar filtros adicionales si es necesário
            if (state.filtros.estado && apuestas.length > 0) {
                apuestas = apuestas.filter(apuesta => apuesta.estado === state.filtros.estado);
            }

            if (state.filtros.tipoApuesta && apuestas.length > 0) {
                apuestas = apuestas.filter(apuesta => apuesta.tipoApuesta === state.filtros.tipoApuesta);
            }

            if (state.filtros.montoMinimo && apuestas.length > 0) {
                apuestas = apuestas.filter(apuesta => apuesta.montoApostado >= state.filtros.montoMinimo!);
            }

            if (state.filtros.montoMaximo && apuestas.length > 0) {
                apuestas = apuestas.filter(apuesta => apuesta.montoApostado <= state.filtros.montoMaximo!);
            }

            if (state.filtros.busqueda && apuestas.length > 0) {
                const busqueda = state.filtros.busqueda.toLowerCase();
                apuestas = apuestas.filter(apuesta =>
                    apuesta.eventoDeportivo.nombre.toLowerCase().includes(busqueda) ||
                    apuesta.prediccion.toLowerCase().includes(busqueda) ||
                    apuesta.descripcion?.toLowerCase().includes(busqueda)
                );
            }

            return apuestas;
        }
    ),

    // Resumen de estadísticas rápidas
    resumenEstadisticas: createSelector(
        [selectApuestaState],
        (state) => {
            const apuestas = state.misApuestas;
            const pendientes = apuestas.filter(a => a.estado === EstadoApuesta.PENDIENTE).length;
            const ganadas = apuestas.filter(a => a.esGanadora === true).length;
            const perdidas = apuestas.filter(a => a.esGanadora === false).length;
            const montoTotal = apuestas.reduce((sum, a) => sum + a.montoApostado, 0);

            return {
                total: apuestas.length,
                pendientes,
                ganadas,
                perdidas,
                montoTotal,
                porcentajeExito: apuestas.length > 0 ? (ganadas / (ganadas + perdidas)) * 100 : 0
            };
        }
    ),
};

export default apuestaSlice.reducer;