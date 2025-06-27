import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import type { 
    QuinielaType, 
    QuinielaResumenType, 
    QuinielaParticipacionType,
    RankingParticipacionType,
    EstadisticasQuinielaType,
    EstadoQuiniela,
    TipoQuiniela
} from "../../types/QuinielaType";

interface QuinielaState {
    // Quinielas principales
    quinielasActivas: QuinielaResumenType[];
    quinielasPopulares: QuinielaResumenType[];
    quinielasMayorPool: QuinielaResumenType[];
    quinielasProximasCerrar: QuinielaResumenType[];
    quinielasCreadasPorUsuario: QuinielaResumenType[];
    
    // Quiniela actual seleccionada
    quinielaActual: QuinielaType | null;
    
    // Participaciones del usuario
    participacionesUsuario: QuinielaParticipacionType[];
    participacionActual: QuinielaParticipacionType | null;
    
    // Rankings y estadísticas
    rankingQuiniela: RankingParticipacionType[];
    estadisticasDashboard: EstadisticasQuinielaType | null;
    
    // Estados de carga
    loading: {
        quinielasActivas: boolean;
        quinielasPopulares: boolean;
        quinielasMayorPool: boolean;
        quinielasProximasCerrar: boolean;
        quinielaActual: boolean;
        participaciones: boolean;
        ranking: boolean;
        estadisticas: boolean;
        creandoQuiniela: boolean;
        participandoEnQuiniela: boolean;
    };
    
    // Estados de error
    error: {
        quinielasActivas: string | null;
        quinielasPopulares: string | null;
        quinielasMayorPool: string | null;
        quinielasProximasCerrar: string | null;
        quinielaActual: string | null;
        participaciones: string | null;
        ranking: string | null;
        estadisticas: string | null;
        crearQuiniela: string | null;
        participarEnQuiniela: string | null;
    };
    
    // Filtros y paginación
    filtros: {
        tipo: TipoQuiniela | null;
        estado: EstadoQuiniela | null;
        busqueda: string;
    };
    
    paginacion: {
        quinielasActivas: {
            page: number;
            size: number;
            totalElements: number;
            totalPages: number;
        };
        participacionesUsuario: {
            page: number;
            size: number;
            totalElements: number;
            totalPages: number;
        };
    };
}

const initialState: QuinielaState = {
    quinielasActivas: [],
    quinielasPopulares: [],
    quinielasMayorPool: [],
    quinielasProximasCerrar: [],
    quinielasCreadasPorUsuario: [],
    quinielaActual: null,
    participacionesUsuario: [],
    participacionActual: null,
    rankingQuiniela: [],
    estadisticasDashboard: null,
    
    loading: {
        quinielasActivas: false,
        quinielasPopulares: false,
        quinielasMayorPool: false,
        quinielasProximasCerrar: false,
        quinielaActual: false,
        participaciones: false,
        ranking: false,
        estadisticas: false,
        creandoQuiniela: false,
        participandoEnQuiniela: false,
    },
    
    error: {
        quinielasActivas: null,
        quinielasPopulares: null,
        quinielasMayorPool: null,
        quinielasProximasCerrar: null,
        quinielaActual: null,
        participaciones: null,
        ranking: null,
        estadisticas: null,
        crearQuiniela: null,
        participarEnQuiniela: null,
    },
    
    filtros: {
        tipo: null,
        estado: null,
        busqueda: '',
    },
    
    paginacion: {
        quinielasActivas: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
        },
        participacionesUsuario: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
        },
    },
};

const quinielaSlice = createSlice({
    name: 'quiniela',
    initialState,
    reducers: {
        // Acciones para quinielas activas
        setQuinielasActivasLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.quinielasActivas = action.payload;
            if (action.payload) {
                state.error.quinielasActivas = null;
            }
        },
        setQuinielasActivas: (state, action: PayloadAction<{
            quinielas: QuinielaResumenType[];
            paginacion: {
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            };
        }>) => {
            state.quinielasActivas = action.payload.quinielas;
            state.paginacion.quinielasActivas = action.payload.paginacion;
            state.loading.quinielasActivas = false;
            state.error.quinielasActivas = null;
        },
        setQuinielasActivasError: (state, action: PayloadAction<string>) => {
            state.error.quinielasActivas = action.payload;
            state.loading.quinielasActivas = false;
        },

        // Acciones para quinielas populares
        setQuinielasPopularesLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.quinielasPopulares = action.payload;
            if (action.payload) {
                state.error.quinielasPopulares = null;
            }
        },
        setQuinielasPopulares: (state, action: PayloadAction<QuinielaResumenType[]>) => {
            state.quinielasPopulares = action.payload;
            state.loading.quinielasPopulares = false;
            state.error.quinielasPopulares = null;
        },
        setQuinielasPopularesError: (state, action: PayloadAction<string>) => {
            state.error.quinielasPopulares = action.payload;
            state.loading.quinielasPopulares = false;
        },

        // Acciones para quinielas con mayor pool
        setQuinielasMayorPoolLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.quinielasMayorPool = action.payload;
            if (action.payload) {
                state.error.quinielasMayorPool = null;
            }
        },
        setQuinielasMayorPool: (state, action: PayloadAction<QuinielaResumenType[]>) => {
            state.quinielasMayorPool = action.payload;
            state.loading.quinielasMayorPool = false;
            state.error.quinielasMayorPool = null;
        },
        setQuinielasMayorPoolError: (state, action: PayloadAction<string>) => {
            state.error.quinielasMayorPool = action.payload;
            state.loading.quinielasMayorPool = false;
        },

        // Acciones para quinielas próximas a cerrar
        setQuinielasProximasCerrarLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.quinielasProximasCerrar = action.payload;
            if (action.payload) {
                state.error.quinielasProximasCerrar = null;
            }
        },
        setQuinielasProximasCerrar: (state, action: PayloadAction<QuinielaResumenType[]>) => {
            state.quinielasProximasCerrar = action.payload;
            state.loading.quinielasProximasCerrar = false;
            state.error.quinielasProximasCerrar = null;
        },
        setQuinielasProximasCerrarError: (state, action: PayloadAction<string>) => {
            state.error.quinielasProximasCerrar = action.payload;
            state.loading.quinielasProximasCerrar = false;
        },

        // Acciones para quiniela actual
        setQuinielaActualLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.quinielaActual = action.payload;
            if (action.payload) {
                state.error.quinielaActual = null;
            }
        },
        setQuinielaActual: (state, action: PayloadAction<QuinielaType>) => {
            state.quinielaActual = action.payload;
            state.loading.quinielaActual = false;
            state.error.quinielaActual = null;
        },
        setQuinielaActualError: (state, action: PayloadAction<string>) => {
            state.error.quinielaActual = action.payload;
            state.loading.quinielaActual = false;
        },
        clearQuinielaActual: (state) => {
            state.quinielaActual = null;
            state.error.quinielaActual = null;
        },

        // Acciones para participaciones del usuario
        setParticipacionesLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.participaciones = action.payload;
            if (action.payload) {
                state.error.participaciones = null;
            }
        },
        setParticipacionesUsuario: (state, action: PayloadAction<{
            participaciones: QuinielaParticipacionType[];
            paginacion: {
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            };
        }>) => {
            state.participacionesUsuario = action.payload.participaciones;
            state.paginacion.participacionesUsuario = action.payload.paginacion;
            state.loading.participaciones = false;
            state.error.participaciones = null;
        },
        setParticipacionesError: (state, action: PayloadAction<string>) => {
            state.error.participaciones = action.payload;
            state.loading.participaciones = false;
        },
        addParticipacion: (state, action: PayloadAction<QuinielaParticipacionType>) => {
            state.participacionesUsuario.unshift(action.payload);
            state.participacionActual = action.payload;
        },

        // Acciones para ranking
        setRankingLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.ranking = action.payload;
            if (action.payload) {
                state.error.ranking = null;
            }
        },
        setRankingQuiniela: (state, action: PayloadAction<RankingParticipacionType[]>) => {
            state.rankingQuiniela = action.payload;
            state.loading.ranking = false;
            state.error.ranking = null;
        },
        setRankingError: (state, action: PayloadAction<string>) => {
            state.error.ranking = action.payload;
            state.loading.ranking = false;
        },

        // Acciones para estadísticas
        setEstadisticasLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.estadisticas = action.payload;
            if (action.payload) {
                state.error.estadisticas = null;
            }
        },
        setEstadisticasDashboard: (state, action: PayloadAction<EstadisticasQuinielaType>) => {
            state.estadisticasDashboard = action.payload;
            state.loading.estadisticas = false;
            state.error.estadisticas = null;
        },
        setEstadisticasError: (state, action: PayloadAction<string>) => {
            state.error.estadisticas = action.payload;
            state.loading.estadisticas = false;
        },

        // Acciones para crear quiniela
        setCreandoQuinielaLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.creandoQuiniela = action.payload;
            if (action.payload) {
                state.error.crearQuiniela = null;
            }
        },
        setCrearQuinielaError: (state, action: PayloadAction<string>) => {
            state.error.crearQuiniela = action.payload;
            state.loading.creandoQuiniela = false;
        },
        quinielaCreadaExitosamente: (state, action: PayloadAction<QuinielaType>) => {
            state.quinielaActual = action.payload;
            state.loading.creandoQuiniela = false;
            state.error.crearQuiniela = null;
        },

        // Acciones para participar en quiniela
        setParticipandoEnQuinielaLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.participandoEnQuiniela = action.payload;
            if (action.payload) {
                state.error.participarEnQuiniela = null;
            }
        },
        setParticiparEnQuinielaError: (state, action: PayloadAction<string>) => {
            state.error.participarEnQuiniela = action.payload;
            state.loading.participandoEnQuiniela = false;
        },
        participacionExitosa: (state, action: PayloadAction<QuinielaParticipacionType>) => {
            state.participacionActual = action.payload;
            state.participacionesUsuario.unshift(action.payload);
            state.loading.participandoEnQuiniela = false;
            state.error.participarEnQuiniela = null;
            
            // Actualizar contador de participantes en quiniela actual si existe
            if (state.quinielaActual && state.quinielaActual.id === action.payload.quinielaId) {
                state.quinielaActual.participantesActuales += 1;
            }
        },

        // Acciones para filtros
        setFiltroTipo: (state, action: PayloadAction<TipoQuiniela | null>) => {
            state.filtros.tipo = action.payload;
        },
        setFiltroEstado: (state, action: PayloadAction<EstadoQuiniela | null>) => {
            state.filtros.estado = action.payload;
        },
        setFiltroBusqueda: (state, action: PayloadAction<string>) => {
            state.filtros.busqueda = action.payload;
        },
        clearFiltros: (state) => {
            state.filtros = {
                tipo: null,
                estado: null,
                busqueda: '',
            };
        },

        // Acciones para quinielas creadas por usuario
        setQuinielasCreadasPorUsuario: (state, action: PayloadAction<QuinielaResumenType[]>) => {
            state.quinielasCreadasPorUsuario = action.payload;
        },

        // Acción para actualizar pool de quiniela
        actualizarPoolQuiniela: (state, action: PayloadAction<{ quinielaId: number; nuevoPool: number }>) => {
            const { quinielaId, nuevoPool } = action.payload;
            
            // Actualizar en quiniela actual
            if (state.quinielaActual && state.quinielaActual.id === quinielaId) {
                state.quinielaActual.poolActual = nuevoPool;
            }
            
            // Actualizar en listas de quinielas
            const listas = [
                state.quinielasActivas,
                state.quinielasPopulares,
                state.quinielasMayorPool,
                state.quinielasProximasCerrar,
                state.quinielasCreadasPorUsuario
            ];
            
            listas.forEach(lista => {
                const quiniela = lista.find(q => q.id === quinielaId);
                if (quiniela) {
                    quiniela.poolActual = nuevoPool;
                }
            });
        },

        // Limpiar todos los datos
        clearQuinielaData: () => {
            return initialState;
        },

        // Limpiar errores
        clearErrors: (state) => {
            state.error = {
                quinielasActivas: null,
                quinielasPopulares: null,
                quinielasMayorPool: null,
                quinielasProximasCerrar: null,
                quinielaActual: null,
                participaciones: null,
                ranking: null,
                estadisticas: null,
                crearQuiniela: null,
                participarEnQuiniela: null,
            };
        },
    },
});

// Exportar acciones
export const {
    setQuinielasActivasLoading,
    setQuinielasActivas,
    setQuinielasActivasError,
    setQuinielasPopularesLoading,
    setQuinielasPopulares,
    setQuinielasPopularesError,
    setQuinielasMayorPoolLoading,
    setQuinielasMayorPool,
    setQuinielasMayorPoolError,
    setQuinielasProximasCerrarLoading,
    setQuinielasProximasCerrar,
    setQuinielasProximasCerrarError,
    setQuinielaActualLoading,
    setQuinielaActual,
    setQuinielaActualError,
    clearQuinielaActual,
    setParticipacionesLoading,
    setParticipacionesUsuario,
    setParticipacionesError,
    addParticipacion,
    setRankingLoading,
    setRankingQuiniela,
    setRankingError,
    setEstadisticasLoading,
    setEstadisticasDashboard,
    setEstadisticasError,
    setCreandoQuinielaLoading,
    setCrearQuinielaError,
    quinielaCreadaExitosamente,
    setParticipandoEnQuinielaLoading,
    setParticiparEnQuinielaError,
    participacionExitosa,
    setFiltroTipo,
    setFiltroEstado,
    setFiltroBusqueda,
    clearFiltros,
    setQuinielasCreadasPorUsuario,
    actualizarPoolQuiniela,
    clearQuinielaData,
    clearErrors,
} = quinielaSlice.actions;

// Selectores usando createSelector para optimización
const selectQuinielaState = (state: { quiniela: QuinielaState }) => state.quiniela;

export const quinielaSelector = {
    // Selectores básicos
    quinielasActivas: createSelector([selectQuinielaState], (state) => state.quinielasActivas),
    quinielasPopulares: createSelector([selectQuinielaState], (state) => state.quinielasPopulares),
    quinielasMayorPool: createSelector([selectQuinielaState], (state) => state.quinielasMayorPool),
    quinielasProximasCerrar: createSelector([selectQuinielaState], (state) => state.quinielasProximasCerrar),
    quinielasCreadasPorUsuario: createSelector([selectQuinielaState], (state) => state.quinielasCreadasPorUsuario),
    quinielaActual: createSelector([selectQuinielaState], (state) => state.quinielaActual),
    participacionesUsuario: createSelector([selectQuinielaState], (state) => state.participacionesUsuario),
    participacionActual: createSelector([selectQuinielaState], (state) => state.participacionActual),
    rankingQuiniela: createSelector([selectQuinielaState], (state) => state.rankingQuiniela),
    estadisticasDashboard: createSelector([selectQuinielaState], (state) => state.estadisticasDashboard),
    
    // Selectores de loading
    loading: createSelector([selectQuinielaState], (state) => state.loading),
    isLoadingQuinielasActivas: createSelector([selectQuinielaState], (state) => state.loading.quinielasActivas),
    isLoadingQuinielaActual: createSelector([selectQuinielaState], (state) => state.loading.quinielaActual),
    isCreandoQuiniela: createSelector([selectQuinielaState], (state) => state.loading.creandoQuiniela),
    isParticiparEnQuiniela: createSelector([selectQuinielaState], (state) => state.loading.participandoEnQuiniela),
    
    // Selectores de errores
    errors: createSelector([selectQuinielaState], (state) => state.error),
    errorQuinielasActivas: createSelector([selectQuinielaState], (state) => state.error.quinielasActivas),
    errorQuinielaActual: createSelector([selectQuinielaState], (state) => state.error.quinielaActual),
    errorCrearQuiniela: createSelector([selectQuinielaState], (state) => state.error.crearQuiniela),
    errorParticiparEnQuiniela: createSelector([selectQuinielaState], (state) => state.error.participarEnQuiniela),
    
    // Selectores de filtros
    filtros: createSelector([selectQuinielaState], (state) => state.filtros),
    paginacion: createSelector([selectQuinielaState], (state) => state.paginacion),
    
    // Selectores computados
    hasQuinielasActivas: createSelector([selectQuinielaState], (state) => state.quinielasActivas.length > 0),
    hasParticipaciones: createSelector([selectQuinielaState], (state) => state.participacionesUsuario.length > 0),
    totalQuinielasActivas: createSelector([selectQuinielaState], (state) => state.paginacion.quinielasActivas.totalElements),
    
    // Selector para verificar si el usuario ya participa en la quiniela actual
    yaParticipaEnQuinielaActual: createSelector(
        [selectQuinielaState],
        (state) => {
            if (!state.quinielaActual) return false;
            return state.participacionesUsuario.some(
                p => p.quinielaId === state.quinielaActual!.id
            );
        }
    ),
    
    // Selector para quinielas filtradas
    quinielasActivasFiltradas: createSelector(
        [selectQuinielaState],
        (state) => {
            let quinielas = state.quinielasActivas;
            
            if (state.filtros.tipo) {
                quinielas = quinielas.filter(q => q.tipoQuiniela === state.filtros.tipo);
            }
            
            if (state.filtros.estado) {
                quinielas = quinielas.filter(q => q.estado === state.filtros.estado);
            }
            
            if (state.filtros.busqueda) {
                const busqueda = state.filtros.busqueda.toLowerCase();
                quinielas = quinielas.filter(q => 
                    q.nombre.toLowerCase().includes(busqueda) ||
                    q.descripcion.toLowerCase().includes(busqueda)
                );
            }
            
            return quinielas;
        }
    ),
};

export default quinielaSlice.reducer;