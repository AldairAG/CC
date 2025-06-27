/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { quinielaSelector } from '../store/slices/quinielaSlice';
import { QuinielaService } from '../service/casino/quinielaService';
import { USER_ROUTES } from '../constants/ROUTERS';

import type { 
    QuinielaType,
    QuinielaResumenType,
    CrearQuinielaRequestType, 
    PrediccionRequestType,
    QuinielaParticipacionType,
    RankingParticipacionType,
    EstadisticasQuinielaType,
    EstadoQuiniela,
    TipoQuiniela,
    QuinielasResponse
} from '../types/QuinielaType';

import type {
    EventoQuinielaType
} from '../types/QuinielaServiceTypes';

// ===== CONSTANTES DE ACCIONES DEL SLICE =====
const SLICE_ACTIONS = {
    // Quinielas Activas
    SET_QUINIELAS_ACTIVAS_LOADING: 'quiniela/setQuinielasActivasLoading',
    SET_QUINIELAS_ACTIVAS: 'quiniela/setQuinielasActivas',
    SET_QUINIELAS_ACTIVAS_ERROR: 'quiniela/setQuinielasActivasError',
    
    // Quinielas Populares
    SET_QUINIELAS_POPULARES_LOADING: 'quiniela/setQuinielasPopularesLoading',
    SET_QUINIELAS_POPULARES: 'quiniela/setQuinielasPopulares',
    SET_QUINIELAS_POPULARES_ERROR: 'quiniela/setQuinielasPopularesError',
    
    // Quinielas Mayor Pool
    SET_QUINIELAS_MAYOR_POOL_LOADING: 'quiniela/setQuinielasMayorPoolLoading',
    SET_QUINIELAS_MAYOR_POOL: 'quiniela/setQuinielasMayorPool',
    SET_QUINIELAS_MAYOR_POOL_ERROR: 'quiniela/setQuinielasMayorPoolError',
    
    // Quinielas Próximas a Cerrar
    SET_QUINIELAS_PROXIMAS_CERRAR_LOADING: 'quiniela/setQuinielasProximasCerrarLoading',
    SET_QUINIELAS_PROXIMAS_CERRAR: 'quiniela/setQuinielasProximasCerrar',
    SET_QUINIELAS_PROXIMAS_CERRAR_ERROR: 'quiniela/setQuinielasProximasCerrarError',
    
    // Quiniela Actual
    SET_QUINIELA_ACTUAL_LOADING: 'quiniela/setQuinielaActualLoading',
    SET_QUINIELA_ACTUAL: 'quiniela/setQuinielaActual',
    SET_QUINIELA_ACTUAL_ERROR: 'quiniela/setQuinielaActualError',
    CLEAR_QUINIELA_ACTUAL: 'quiniela/clearQuinielaActual',
    
    // Participaciones
    SET_PARTICIPACIONES_LOADING: 'quiniela/setParticipacionesLoading',
    SET_PARTICIPACIONES_USUARIO: 'quiniela/setParticipacionesUsuario',
    SET_PARTICIPACIONES_ERROR: 'quiniela/setParticipacionesError',
    
    // Ranking
    SET_RANKING_LOADING: 'quiniela/setRankingLoading',
    SET_RANKING_QUINIELA: 'quiniela/setRankingQuiniela',
    SET_RANKING_ERROR: 'quiniela/setRankingError',
    
    // Estadísticas
    SET_ESTADISTICAS_LOADING: 'quiniela/setEstadisticasLoading',
    SET_ESTADISTICAS_DASHBOARD: 'quiniela/setEstadisticasDashboard',
    SET_ESTADISTICAS_ERROR: 'quiniela/setEstadisticasError',
    
    // Crear Quiniela
    SET_CREANDO_QUINIELA_LOADING: 'quiniela/setCreandoQuinielaLoading',
    SET_CREAR_QUINIELA_ERROR: 'quiniela/setCrearQuinielaError',
    QUINIELA_CREADA_EXITOSAMENTE: 'quiniela/quinielaCreadaExitosamente',
    
    // Participar en Quiniela
    SET_PARTICIPANDO_EN_QUINIELA_LOADING: 'quiniela/setParticipandoEnQuinielaLoading',
    SET_PARTICIPAR_EN_QUINIELA_ERROR: 'quiniela/setParticiparEnQuinielaError',
    PARTICIPACION_EXITOSA: 'quiniela/participacionExitosa',
    
    // Filtros
    SET_FILTRO_TIPO: 'quiniela/setFiltroTipo',
    SET_FILTRO_ESTADO: 'quiniela/setFiltroEstado',
    SET_FILTRO_BUSQUEDA: 'quiniela/setFiltroBusqueda',
    CLEAR_FILTROS: 'quiniela/clearFiltros',
    
    // Utilidades
    SET_QUINIELAS_CREADAS_POR_USUARIO: 'quiniela/setQuinielasCreadasPorUsuario',
    ACTUALIZAR_POOL_QUINIELA: 'quiniela/actualizarPoolQuiniela',
    CLEAR_QUINIELA_DATA: 'quiniela/clearQuinielaData',
    CLEAR_ERRORS: 'quiniela/clearErrors',
} as const;

/**
 * Hook personalizado `useQuiniela` para gestionar el estado de las quinielas y todas sus operaciones.
 *
 * @returns {object} Un objeto con las siguientes propiedades y funciones:
 * 
 * - `quinielasActivas` {QuinielaResumenType[]}: Lista de quinielas activas.
 * - `quinielasPopulares` {QuinielaResumenType[]}: Lista de quinielas populares.
 * - `quinielasMayorPool` {QuinielaResumenType[]}: Lista de quinielas con mayor pool.
 * - `quinielasProximasCerrar` {QuinielaResumenType[]}: Lista de quinielas próximas a cerrar.
 * - `quinielaActual` {QuinielaType | null}: Quiniela actualmente seleccionada.
 * - `participacionesUsuario` {QuinielaParticipacionType[]}: Participaciones del usuario.
 * - `rankingQuiniela` {RankingParticipacionType[]}: Ranking de la quiniela actual.
 * - `estadisticasDashboard` {EstadisticasQuinielaType | null}: Estadísticas del dashboard.
 * - `loading` {object}: Estados de carga para diferentes operaciones.
 * - `errors` {object}: Estados de error para diferentes operaciones.
 * - `filtros` {object}: Filtros aplicados a las quinielas.
 * - `paginacion` {object}: Información de paginación.
 * - Funciones de carga: `loadQuinielasActivas`, `loadQuinielaDetalle`, etc.
 * - Funciones de acciones: `createQuiniela`, `participateInQuiniela`, etc.
 * - Funciones de navegación y utilidades.
 */
export const useQuiniela = () => {
    const dispatch = useDispatch();
    const navigate = useHistory();

    // ===== HELPER FUNCTION PARA DISPATCH =====
    const dispatchAction = useCallback((actionType: string, payload?: any) => {
        dispatch({ type: actionType, payload });
    }, [dispatch]);

    // ===== SELECTORES DEL ESTADO =====
    const quinielasActivas = useSelector(quinielaSelector.quinielasActivas);
    const quinielasPopulares = useSelector(quinielaSelector.quinielasPopulares);
    const quinielasMayorPool = useSelector(quinielaSelector.quinielasMayorPool);
    const quinielasProximasCerrar = useSelector(quinielaSelector.quinielasProximasCerrar);
    const quinielasCreadasPorUsuario = useSelector(quinielaSelector.quinielasCreadasPorUsuario);
    const quinielaActual = useSelector(quinielaSelector.quinielaActual);
    const participacionesUsuario = useSelector(quinielaSelector.participacionesUsuario);
    const participacionActual = useSelector(quinielaSelector.participacionActual);
    const rankingQuiniela = useSelector(quinielaSelector.rankingQuiniela);
    const estadisticasDashboard = useSelector(quinielaSelector.estadisticasDashboard);

    // Estados de carga
    const loading = useSelector(quinielaSelector.loading);
    const isLoadingQuinielasActivas = useSelector(quinielaSelector.isLoadingQuinielasActivas);
    const isLoadingQuinielaActual = useSelector(quinielaSelector.isLoadingQuinielaActual);
    const isCreandoQuiniela = useSelector(quinielaSelector.isCreandoQuiniela);
    const isParticipandoEnQuiniela = useSelector(quinielaSelector.isParticiparEnQuiniela);

    // Estados de error
    const errors = useSelector(quinielaSelector.errors);
    const errorQuinielasActivas = useSelector(quinielaSelector.errorQuinielasActivas);
    const errorQuinielaActual = useSelector(quinielaSelector.errorQuinielaActual);
    const errorCrearQuiniela = useSelector(quinielaSelector.errorCrearQuiniela);
    const errorParticiparEnQuiniela = useSelector(quinielaSelector.errorParticiparEnQuiniela);

    // Filtros y datos computados
    const filtros = useSelector(quinielaSelector.filtros);
    const paginacion = useSelector(quinielaSelector.paginacion);
    const hasQuinielasActivas = useSelector(quinielaSelector.hasQuinielasActivas);
    const hasParticipaciones = useSelector(quinielaSelector.hasParticipaciones);
    const yaParticipaEnQuinielaActual = useSelector(quinielaSelector.yaParticipaEnQuinielaActual);
    const quinielasActivasFiltradas = useSelector(quinielaSelector.quinielasActivasFiltradas);
    const totalQuinielasActivas = useSelector(quinielaSelector.totalQuinielasActivas);

    // ===== FUNCIONES DE NAVEGACIÓN =====

    /**
     * Navega a una ruta específica
     */
    const navigateTo = useCallback((to: string) => {
        navigate.push(to);
    }, [navigate]);

    /**
     * Navega al detalle de una quiniela
     */
    const navigateToQuinielaDetail = useCallback((quinielaId: number) => {
        navigateTo(USER_ROUTES.QUINIELA.replace(':id', quinielaId.toString()));
    }, [navigateTo]);

    /**
     * Navega a la página de creación de quiniela
     */
    const navigateToCreateQuiniela = useCallback(() => {
        navigateTo(USER_ROUTES.CREAR_QUINIELA);
    }, [navigateTo]);

    /**
     * Navega al ranking de una quiniela (usando lista de quinielas como fallback)
     */
    const navigateToQuinielaRanking = useCallback((quinielaId: number) => {
        navigateTo(`${USER_ROUTES.QUINIELAS_LIST}?ranking=${quinielaId}`);
    }, [navigateTo]);

    // ===== FUNCIONES DE CARGA DE DATOS =====

    /**
     * Carga quinielas activas con paginación
     */
    const loadQuinielasActivas = useCallback(async (page: number = 0, size: number = 10): Promise<QuinielasResponse | null> => {
        dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_ACTIVAS_LOADING, true);
        try {
            const response = await QuinielaService.obtenerQuinielasActivas(page, size);
            dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_ACTIVAS, {
                quinielas: response.content,
                paginacion: {
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                }
            });
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar quinielas activas';
            dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_ACTIVAS_ERROR, errorMessage);
            return null;
        }
    }, [dispatchAction]);

    /**
     * Carga quinielas populares
     */
    const loadQuinielasPopulares = useCallback(async (limit: number = 10): Promise<QuinielaResumenType[]> => {
        dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_POPULARES_LOADING, true);
        try {
            const response = await QuinielaService.obtenerQuinielasPopulares(limit);
            dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_POPULARES, response);
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar quinielas populares';
            dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_POPULARES_ERROR, errorMessage);
            return [];
        }
    }, [dispatchAction]);

    /**
     * Carga quinielas con mayor pool
     */
    const loadQuinielasMayorPool = useCallback(async (limit: number = 10): Promise<QuinielaResumenType[]> => {
        dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_MAYOR_POOL_LOADING, true);
        try {
            const response = await QuinielaService.obtenerQuinielasMayorPool(limit);
            dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_MAYOR_POOL, response);
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar quinielas con mayor pool';
            dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_MAYOR_POOL_ERROR, errorMessage);
            return [];
        }
    }, [dispatchAction]);

    /**
     * Carga quinielas próximas a cerrar
     */
    const loadQuinielasProximasCerrar = useCallback(async (limit: number = 10): Promise<QuinielaResumenType[]> => {
        dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_PROXIMAS_CERRAR_LOADING, true);
        try {
            const response = await QuinielaService.obtenerQuinielasProximasACerrar(limit);
            dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_PROXIMAS_CERRAR, response);
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar quinielas próximas a cerrar';
            dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_PROXIMAS_CERRAR_ERROR, errorMessage);
            return [];
        }
    }, [dispatchAction]);

    /**
     * Carga el detalle de una quiniela específica
     */
    const loadQuinielaDetail = useCallback(async (quinielaId: number): Promise<QuinielaType | null> => {
        dispatchAction(SLICE_ACTIONS.SET_QUINIELA_ACTUAL_LOADING, true);
        try {
            const response = await QuinielaService.obtenerQuinielaPorId(quinielaId);
            dispatchAction(SLICE_ACTIONS.SET_QUINIELA_ACTUAL, response);
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar detalle de la quiniela';
            dispatchAction(SLICE_ACTIONS.SET_QUINIELA_ACTUAL_ERROR, errorMessage);
            return null;
        }
    }, [dispatchAction]);

    /**
     * Carga quiniela por código único
     */
    const loadQuinielaByCode = useCallback(async (codigo: string): Promise<QuinielaType | null> => {
        dispatchAction(SLICE_ACTIONS.SET_QUINIELA_ACTUAL_LOADING, true);
        try {
            const response = await QuinielaService.obtenerQuinielaPorCodigo(codigo);
            dispatchAction(SLICE_ACTIONS.SET_QUINIELA_ACTUAL, response);
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar quiniela por código';
            dispatchAction(SLICE_ACTIONS.SET_QUINIELA_ACTUAL_ERROR, errorMessage);
            return null;
        }
    }, [dispatchAction]);

    /**
     * Carga participaciones del usuario
     */
    const loadParticipacionesUsuario = useCallback(async (usuarioId: number, page: number = 0, size: number = 10): Promise<QuinielaParticipacionType[]> => {
        dispatchAction(SLICE_ACTIONS.SET_PARTICIPACIONES_LOADING, true);
        try {
            const response = await QuinielaService.obtenerParticipacionesUsuario(usuarioId, page, size);
            
            // Manejar respuesta que puede ser array o objeto paginado
            if (Array.isArray(response)) {
                dispatchAction(SLICE_ACTIONS.SET_PARTICIPACIONES_USUARIO, {
                    participaciones: response,
                    paginacion: {
                        page: 0,
                        size: response.length,
                        totalElements: response.length,
                        totalPages: 1,
                    }
                });
                return response;
            } else {
                dispatchAction(SLICE_ACTIONS.SET_PARTICIPACIONES_USUARIO, {
                    participaciones: response.content || [],
                    paginacion: {
                        page: response.number || 0,
                        size: response.size || 10,
                        totalElements: response.totalElements || 0,
                        totalPages: response.totalPages || 1,
                    }
                });
                return response.content || [];
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar participaciones del usuario';
            dispatchAction(SLICE_ACTIONS.SET_PARTICIPACIONES_ERROR, errorMessage);
            return [];
        }
    }, [dispatchAction]);

    /**
     * Carga el ranking de una quiniela
     */
    const loadRankingQuiniela = useCallback(async (quinielaId: number): Promise<RankingParticipacionType[]> => {
        dispatchAction(SLICE_ACTIONS.SET_RANKING_LOADING, true);
        try {
            const response = await QuinielaService.obtenerRanking(quinielaId);
            dispatchAction(SLICE_ACTIONS.SET_RANKING_QUINIELA, response);
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar ranking de la quiniela';
            dispatchAction(SLICE_ACTIONS.SET_RANKING_ERROR, errorMessage);
            return [];
        }
    }, [dispatchAction]);

    /**
     * Carga estadísticas del dashboard
     */
    const loadEstadisticasDashboard = useCallback(async (): Promise<EstadisticasQuinielaType | null> => {
        dispatchAction(SLICE_ACTIONS.SET_ESTADISTICAS_LOADING, true);
        try {
            const response = await QuinielaService.obtenerEstadisticasDashboard();
            dispatchAction(SLICE_ACTIONS.SET_ESTADISTICAS_DASHBOARD, response);
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar estadísticas del dashboard';
            dispatchAction(SLICE_ACTIONS.SET_ESTADISTICAS_ERROR, errorMessage);
            return null;
        }
    }, [dispatchAction]);

    /**
     * Carga quinielas creadas por un usuario
     */
    const loadQuinielasCreadasPorUsuario = useCallback(async (usuarioId: number): Promise<QuinielaResumenType[]> => {
        try {
            const response = await QuinielaService.obtenerQuinielasCreadasPorUsuario(usuarioId);
            const quinielas = Array.isArray(response) ? response : response.content || [];
            dispatchAction(SLICE_ACTIONS.SET_QUINIELAS_CREADAS_POR_USUARIO, quinielas);
            return quinielas;
        } catch (error: any) {
            console.error('Error al cargar quinielas creadas por usuario:', error);
            return [];
        }
    }, [dispatchAction]);

    /**
     * Carga eventos de una quiniela
     */
    const loadEventosQuiniela = useCallback(async (quinielaId: number): Promise<EventoQuinielaType[]> => {
        try {
            const response = await QuinielaService.obtenerEventosQuiniela(quinielaId);
            return response;
        } catch (error: any) {
            console.error('Error al cargar eventos de la quiniela:', error);
            return [];
        }
    }, []);

    // ===== FUNCIONES DE ACCIONES =====

    /**
     * Crea una nueva quiniela
     */
    const createQuiniela = useCallback(async (datosQuiniela: CrearQuinielaRequestType): Promise<QuinielaType | null> => {
        dispatchAction(SLICE_ACTIONS.SET_CREANDO_QUINIELA_LOADING, true);
        try {
            const response = await QuinielaService.crearQuiniela(datosQuiniela);
            dispatchAction(SLICE_ACTIONS.QUINIELA_CREADA_EXITOSAMENTE, response);
            
            // Navegar al detalle de la quiniela creada
            navigateToQuinielaDetail(response.id);
            
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear la quiniela';
            dispatchAction(SLICE_ACTIONS.SET_CREAR_QUINIELA_ERROR, errorMessage);
            return null;
        }
    }, [dispatchAction, navigateToQuinielaDetail]);

    /**
     * Participa en una quiniela
     */
    const participateInQuiniela = useCallback(async (quinielaId: number, usuarioId: number): Promise<QuinielaParticipacionType | null> => {
        dispatchAction(SLICE_ACTIONS.SET_PARTICIPANDO_EN_QUINIELA_LOADING, true);
        try {
            const response = await QuinielaService.participarEnQuiniela(quinielaId, usuarioId);
            dispatchAction(SLICE_ACTIONS.PARTICIPACION_EXITOSA, response);
            
            // Actualizar el pool de la quiniela si es la actual
            if (quinielaActual && quinielaActual.id === quinielaId) {
                dispatchAction(SLICE_ACTIONS.ACTUALIZAR_POOL_QUINIELA, {
                    quinielaId,
                    nuevoPool: quinielaActual.poolActual + quinielaActual.costoParticipacion
                });
            }
            
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al participar en la quiniela';
            dispatchAction(SLICE_ACTIONS.SET_PARTICIPAR_EN_QUINIELA_ERROR, errorMessage);
            return null;
        }
    }, [dispatchAction, quinielaActual]);

    /**
     * Realiza predicciones para una participación
     */
    const makePredicciones = useCallback(async (participacionId: number, predicciones: PrediccionRequestType[]): Promise<any> => {
        try {
            const response = await QuinielaService.realizarPredicciones(participacionId, predicciones);
            
            // Actualizar la participación en el estado local
            const participacionIndex = participacionesUsuario.findIndex(p => p.id === participacionId);
            if (participacionIndex >= 0) {
                const nuevasParticipaciones = [...participacionesUsuario];
                nuevasParticipaciones[participacionIndex] = response;
                dispatchAction(SLICE_ACTIONS.SET_PARTICIPACIONES_USUARIO, {
                    participaciones: nuevasParticipaciones,
                    paginacion: paginacion.participacionesUsuario
                });
            }
            
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al realizar predicciones';
            throw new Error(errorMessage);
        }
    }, [dispatchAction, participacionesUsuario, paginacion]);

    /**
     * Activa una quiniela (solo para creadores/admins)
     */
    const activateQuiniela = useCallback(async (quinielaId: number, usuarioId: number): Promise<QuinielaType | null> => {
        try {
            const response = await QuinielaService.activarQuiniela(quinielaId, usuarioId);
            
            // Si es la quiniela actual, actualizar el estado
            if (quinielaActual && quinielaActual.id === quinielaId) {
                dispatchAction(SLICE_ACTIONS.SET_QUINIELA_ACTUAL, response);
            }
            
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al activar la quiniela';
            throw new Error(errorMessage);
        }
    }, [dispatchAction, quinielaActual]);

    /**
     * Cancela participación en una quiniela
     */
    const cancelParticipacion = useCallback(async (participacionId: number): Promise<boolean> => {
        try {
            await QuinielaService.cancelarParticipacion(participacionId);
            
            // Remover la participación del estado local
            const nuevasParticipaciones = participacionesUsuario.filter(p => p.id !== participacionId);
            dispatchAction(SLICE_ACTIONS.SET_PARTICIPACIONES_USUARIO, {
                participaciones: nuevasParticipaciones,
                paginacion: paginacion.participacionesUsuario
            });
            
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cancelar participación';
            throw new Error(errorMessage);
        }
    }, [dispatchAction, participacionesUsuario, paginacion]);

    // ===== FUNCIONES DE BÚSQUEDA Y FILTROS =====

    /**
     * Busca quinielas por texto
     */
    const searchQuinielas = useCallback(async (query: string, page: number = 0, size: number = 10): Promise<QuinielasResponse | null> => {
        try {
            const response = await QuinielaService.buscarQuinielas(query, page, size);
            return response;
        } catch (error: any) {
            console.error('Error al buscar quinielas:', error);
            return null;
        }
    }, []);

    /**
     * Obtiene quinielas por tipo
     */
    const getQuinielasPorTipo = useCallback(async (tipo: string, page: number = 0, size: number = 10): Promise<QuinielasResponse | null> => {
        try {
            const response = await QuinielaService.obtenerQuinielasPorTipo(tipo, page, size);
            return response;
        } catch (error: any) {
            console.error('Error al obtener quinielas por tipo:', error);
            return null;
        }
    }, []);

    /**
     * Aplica filtro por tipo de quiniela
     */
    const applyFilterByType = useCallback((tipo: TipoQuiniela | null) => {
        dispatchAction(SLICE_ACTIONS.SET_FILTRO_TIPO, tipo);
    }, [dispatchAction]);

    /**
     * Aplica filtro por estado de quiniela
     */
    const applyFilterByState = useCallback((estado: EstadoQuiniela | null) => {
        dispatchAction(SLICE_ACTIONS.SET_FILTRO_ESTADO, estado);
    }, [dispatchAction]);

    /**
     * Aplica filtro de búsqueda por texto
     */
    const applySearchFilter = useCallback((busqueda: string) => {
        dispatchAction(SLICE_ACTIONS.SET_FILTRO_BUSQUEDA, busqueda);
    }, [dispatchAction]);

    /**
     * Limpia todos los filtros
     */
    const clearAllFilters = useCallback(() => {
        dispatchAction(SLICE_ACTIONS.CLEAR_FILTROS);
    }, [dispatchAction]);

    // ===== FUNCIONES DE VALIDACIÓN =====

    /**
     * Verifica si un usuario puede participar en una quiniela
     */
    const canUserParticipate = useCallback(async (quinielaId: number, usuarioId: number): Promise<boolean> => {
        try {
            const response = await QuinielaService.puedeParticipar(quinielaId, usuarioId);
            return response;
        } catch (error: any) {
            console.error('Error al verificar si puede participar:', error);
            return false;
        }
    }, []);

    /**
     * Obtiene la participación específica de un usuario en una quiniela
     */
    const getUserParticipation = useCallback(async (quinielaId: number, usuarioId: number): Promise<QuinielaParticipacionType | null> => {
        try {
            const response = await QuinielaService.obtenerParticipacion(quinielaId, usuarioId);
            return response;
        } catch (error: any) {
            console.error('Error al obtener participación del usuario:', error);
            return null;
        }
    }, []);

    // ===== FUNCIONES DE UTILIDAD =====

    /**
     * Limpia la quiniela actual seleccionada
     */
    const clearCurrentQuiniela = useCallback(() => {
        dispatchAction(SLICE_ACTIONS.CLEAR_QUINIELA_ACTUAL);
    }, [dispatchAction]);

    /**
     * Limpia todos los datos de quinielas
     */
    const clearAllQuinielaData = useCallback(() => {
        dispatchAction(SLICE_ACTIONS.CLEAR_QUINIELA_DATA);
    }, [dispatchAction]);

    /**
     * Limpia todos los errores
     */
    const clearAllErrors = useCallback(() => {
        dispatchAction(SLICE_ACTIONS.CLEAR_ERRORS);
    }, [dispatchAction]);

    /**
     * Actualiza el pool de una quiniela
     */
    const updateQuinielaPool = useCallback((quinielaId: number, nuevoPool: number) => {
        dispatchAction(SLICE_ACTIONS.ACTUALIZAR_POOL_QUINIELA, { quinielaId, nuevoPool });
    }, [dispatchAction]);

    /**
     * Carga el dashboard completo
     */
    const loadCompleteDashboard = useCallback(async () => {
        try {
            await Promise.all([
                loadQuinielasPopulares(5),
                loadQuinielasMayorPool(5),
                loadQuinielasProximasCerrar(5),
                loadEstadisticasDashboard(),
            ]);
        } catch (error) {
            console.error('Error al cargar dashboard completo:', error);
        }
    }, [loadQuinielasPopulares, loadQuinielasMayorPool, loadQuinielasProximasCerrar, loadEstadisticasDashboard]);

    /**
     * Verifica si el usuario ya participa en la quiniela actual
     */
    const checkUserParticipation = useCallback((usuarioId: number): boolean => {
        if (!quinielaActual) return false;
        return participacionesUsuario.some(p => p.quinielaId === quinielaActual.id && p.usuarioId === usuarioId);
    }, [quinielaActual, participacionesUsuario]);

    return {
        // ===== ESTADO =====
        quinielasActivas,
        quinielasPopulares,
        quinielasMayorPool,
        quinielasProximasCerrar,
        quinielasCreadasPorUsuario,
        quinielaActual,
        participacionesUsuario,
        participacionActual,
        rankingQuiniela,
        estadisticasDashboard,

        // Estados de carga
        loading,
        isLoadingQuinielasActivas,
        isLoadingQuinielaActual,
        isCreandoQuiniela,
        isParticipandoEnQuiniela,

        // Estados de error
        errors,
        errorQuinielasActivas,
        errorQuinielaActual,
        errorCrearQuiniela,
        errorParticiparEnQuiniela,

        // Filtros y datos computados
        filtros,
        paginacion,
        hasQuinielasActivas,
        hasParticipaciones,
        yaParticipaEnQuinielaActual,
        quinielasActivasFiltradas,
        totalQuinielasActivas,

        // ===== NAVEGACIÓN =====
        navigateTo,
        navigateToQuinielaDetail,
        navigateToCreateQuiniela,
        navigateToQuinielaRanking,

        // ===== FUNCIONES DE CARGA =====
        loadQuinielasActivas,
        loadQuinielasPopulares,
        loadQuinielasMayorPool,
        loadQuinielasProximasCerrar,
        loadQuinielaDetail,
        loadQuinielaByCode,
        loadParticipacionesUsuario,
        loadRankingQuiniela,
        loadEstadisticasDashboard,
        loadQuinielasCreadasPorUsuario,
        loadEventosQuiniela,
        loadCompleteDashboard,

        // ===== FUNCIONES DE ACCIONES =====
        createQuiniela,
        participateInQuiniela,
        makePredicciones,
        activateQuiniela,
        cancelParticipacion,

        // ===== FUNCIONES DE BÚSQUEDA Y FILTROS =====
        searchQuinielas,
        getQuinielasPorTipo,
        applyFilterByType,
        applyFilterByState,
        applySearchFilter,
        clearAllFilters,

        // ===== FUNCIONES DE VALIDACIÓN =====
        canUserParticipate,
        getUserParticipation,
        checkUserParticipation,

        // ===== FUNCIONES DE UTILIDAD =====
        clearCurrentQuiniela,
        clearAllQuinielaData,
        clearAllErrors,
        updateQuinielaPool,
    };
};

export default useQuiniela;