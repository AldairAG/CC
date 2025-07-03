/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
    quinielaSelector,
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
    setPrediccionesLoading,
    setPredicciones,
    setPrediccionesError,
    clearPredicciones
} from '../store/slices/quinielaSlice';
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
import type { Prediccion } from '../types/ParticipacionType';

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
    const predicciones = useSelector(quinielaSelector.predicciones);

    // Estados de carga
    const loading = useSelector(quinielaSelector.loading);
    const isLoadingQuinielasActivas = useSelector(quinielaSelector.isLoadingQuinielasActivas);
    const isLoadingQuinielaActual = useSelector(quinielaSelector.isLoadingQuinielaActual);
    const isCreandoQuiniela = useSelector(quinielaSelector.isCreandoQuiniela);
    const isParticipandoEnQuiniela = useSelector(quinielaSelector.isParticiparEnQuiniela);
    const isLoadingPredicciones = useSelector(quinielaSelector.isLoadingPredicciones);

    // Estados de error
    const errors = useSelector(quinielaSelector.errors);
    const errorQuinielasActivas = useSelector(quinielaSelector.errorQuinielasActivas);
    const errorQuinielaActual = useSelector(quinielaSelector.errorQuinielaActual);
    const errorCrearQuiniela = useSelector(quinielaSelector.errorCrearQuiniela);
    const errorParticiparEnQuiniela = useSelector(quinielaSelector.errorParticiparEnQuiniela);
    const errorPredicciones = useSelector(quinielaSelector.errorPredicciones);

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
        dispatch(setQuinielasActivasLoading(true));
        try {
            const response = await QuinielaService.obtenerQuinielasActivas(page, size);
            dispatch(setQuinielasActivas({
                quinielas: response.content,
                paginacion: {
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                }
            }));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar quinielas activas';
            dispatch(setQuinielasActivasError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga quinielas populares
     */
    const loadQuinielasPopulares = useCallback(async (limit: number = 10): Promise<QuinielaResumenType[]> => {
        dispatch(setQuinielasPopularesLoading(true));
        try {
            const response = await QuinielaService.obtenerQuinielasPopulares(limit);
            dispatch(setQuinielasPopulares(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar quinielas populares';
            dispatch(setQuinielasPopularesError(errorMessage));
            return [];
        }
    }, [dispatch]);

    /**
     * Carga quinielas con mayor pool
     */
    const loadQuinielasMayorPool = useCallback(async (limit: number = 10): Promise<QuinielaResumenType[]> => {
        dispatch(setQuinielasMayorPoolLoading(true));
        try {
            const response = await QuinielaService.obtenerQuinielasMayorPool(limit);
            dispatch(setQuinielasMayorPool(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar quinielas con mayor pool';
            dispatch(setQuinielasMayorPoolError(errorMessage));
            return [];
        }
    }, [dispatch]);

    /**
     * Carga quinielas próximas a cerrar
     */
    const loadQuinielasProximasCerrar = useCallback(async (limit: number = 10): Promise<QuinielaResumenType[]> => {
        dispatch(setQuinielasProximasCerrarLoading(true));
        try {
            const response = await QuinielaService.obtenerQuinielasProximasACerrar(limit);
            dispatch(setQuinielasProximasCerrar(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar quinielas próximas a cerrar';
            dispatch(setQuinielasProximasCerrarError(errorMessage));
            return [];
        }
    }, [dispatch]);

    /**
     * Carga el detalle de una quiniela específica
     */
    const loadQuinielaDetail = useCallback(async (quinielaId: number): Promise<QuinielaType | null> => {
        dispatch(setQuinielaActualLoading(true));
        try {
            const response = await QuinielaService.obtenerQuinielaPorId(quinielaId);
            dispatch(setQuinielaActual(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar detalle de la quiniela';
            dispatch(setQuinielaActualError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga quiniela por código único
     */
    const loadQuinielaByCode = useCallback(async (codigo: string): Promise<QuinielaType | null> => {
        dispatch(setQuinielaActualLoading(true));
        try {
            const response = await QuinielaService.obtenerQuinielaPorCodigo(codigo);
            dispatch(setQuinielaActual(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar quiniela por código';
            dispatch(setQuinielaActualError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga participaciones del usuario
     */
    const loadParticipacionesUsuario = useCallback(async (usuarioId: number, page: number = 0, size: number = 10): Promise<QuinielaParticipacionType[]> => {
        dispatch(setParticipacionesLoading(true));
        try {
            const response = await QuinielaService.obtenerParticipacionesUsuario(usuarioId, page, size);
            // Manejar respuesta que puede ser array o objeto paginado
            if (Array.isArray(response)) {
                dispatch(setParticipacionesUsuario({
                    participaciones: response,
                    paginacion: {
                        page: 0,
                        size: response.length,
                        totalElements: response.length,
                        totalPages: 1,
                    }
                }));
                return response;
            } else {
                dispatch(setParticipacionesUsuario({
                    participaciones: response.content || [],
                    paginacion: {
                        page: response.number || 0,
                        size: response.size || 10,
                        totalElements: response.totalElements || 0,
                        totalPages: response.totalPages || 1,
                    }
                }));
                return response.content || [];
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar participaciones del usuario';
            dispatch(setParticipacionesError(errorMessage));
            return [];
        }
    }, [dispatch]);

    /**
     * Carga participaciones del usuario con relaciones completas
     */
    const loadParticipacionesUsuarioConRelaciones = useCallback(async (usuarioId: number): Promise<QuinielaParticipacionType[]> => {
        dispatch(setParticipacionesLoading(true));
        try {
            const response = await QuinielaService.obtenerParticipacionesUsuarioConRelaciones(usuarioId);
            dispatch(setParticipacionesUsuario({
                participaciones: response,
                paginacion: {
                    page: 0,
                    size: response.length,
                    totalElements: response.length,
                    totalPages: 1,
                }
            }));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar participaciones del usuario con relaciones';
            dispatch(setParticipacionesError(errorMessage));
            return [];
        }
    }, [dispatch]);

    /**
     * Carga el ranking de una quiniela
     */
    const loadRankingQuiniela = useCallback(async (quinielaId: number): Promise<RankingParticipacionType[]> => {
        dispatch(setRankingLoading(true));
        try {
            const response = await QuinielaService.obtenerRanking(quinielaId);
            dispatch(setRankingQuiniela(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar ranking de la quiniela';
            dispatch(setRankingError(errorMessage));
            return [];
        }
    }, [dispatch]);

    /**
     * Carga estadísticas del dashboard
     */
    const loadEstadisticasDashboard = useCallback(async (): Promise<EstadisticasQuinielaType | null> => {
        dispatch(setEstadisticasLoading(true));
        try {
            const response = await QuinielaService.obtenerEstadisticasDashboard();
            dispatch(setEstadisticasDashboard(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar estadísticas del dashboard';
            dispatch(setEstadisticasError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga quinielas creadas por un usuario
     */
    const loadQuinielasCreadasPorUsuario = useCallback(async (usuarioId: number): Promise<QuinielaResumenType[]> => {
        try {
            const response = await QuinielaService.obtenerQuinielasCreadasPorUsuario(usuarioId);
            const quinielas = Array.isArray(response) ? response : response.content || [];
            dispatch(setQuinielasCreadasPorUsuario(quinielas));
            return quinielas;
        } catch (error: any) {
            console.error('Error al cargar quinielas creadas por usuario:', error);
            return [];
        }
    }, [dispatch]);

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
        dispatch(setCreandoQuinielaLoading(true));
        try {
            const response = await QuinielaService.crearQuiniela(datosQuiniela);
            dispatch(quinielaCreadaExitosamente(response));
            
            // Navegar al detalle de la quiniela creada
            navigateToQuinielaDetail(response.id);
            
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear la quiniela';
            dispatch(setCrearQuinielaError(errorMessage));
            return null;
        }
    }, [dispatch, navigateToQuinielaDetail]);

    /**
     * Obtiene las predicciones realizadas en una participación
     * @param participacionId ID de la participación
     * @returns Lista de predicciones
     */
    const loadPrediccionesUsuario = useCallback(async (participacionId: number): Promise<Prediccion[]> => {
        dispatch(setPrediccionesLoading(true));
        try {
            const response = await QuinielaService.obtenerPrediccionesPorParticipacion(participacionId);
            dispatch(setPredicciones(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al obtener predicciones de la participación';
            dispatch(setPrediccionesError(errorMessage));
            console.error(errorMessage);
            return [];
        }
    }, [dispatch]);

    /**
     * Participa en una quiniela
     */
    const participateInQuiniela = useCallback(async (quinielaId: number, usuarioId: number): Promise<QuinielaParticipacionType | null> => {
        dispatch(setParticipandoEnQuinielaLoading(true));
        try {
            const response = await QuinielaService.participarEnQuiniela(quinielaId, usuarioId);
            dispatch(participacionExitosa(response));
            
            // Actualizar el pool de la quiniela si es la actual
            if (quinielaActual && quinielaActual.id === quinielaId) {
                dispatch(actualizarPoolQuiniela({
                    quinielaId,
                    nuevoPool: quinielaActual.poolActual + quinielaActual.costoParticipacion
                }));
            }
            
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al participar en la quiniela';
            dispatch(setParticiparEnQuinielaError(errorMessage));
            return null;
        }
    }, [dispatch, quinielaActual]);

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
                dispatch(setParticipacionesUsuario({
                    participaciones: nuevasParticipaciones,
                    paginacion: paginacion.participacionesUsuario
                }));
            }
            
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al realizar predicciones';
            throw new Error(errorMessage);
        }
    }, [dispatch, participacionesUsuario, paginacion]);

    /**
     * Activa una quiniela (DEPRECATED - las quinielas ahora se crean directamente activas)
     * @deprecated Las quinielas se activan automáticamente al crearlas
     */
    const activateQuiniela = useCallback(async (quinielaId: number, usuarioId: number): Promise<QuinielaType | null> => {
        try {
            const response = await QuinielaService.activarQuiniela(quinielaId, usuarioId);
            
            // Si es la quiniela actual, actualizar el estado
            if (quinielaActual && quinielaActual.id === quinielaId) {
                dispatch(setQuinielaActual(response));
            }
            
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al activar la quiniela';
            throw new Error(errorMessage);
        }
    }, [dispatch, quinielaActual]);

    /**
     * Cancela participación en una quiniela
     */
    const cancelParticipacion = useCallback(async (participacionId: number): Promise<boolean> => {
        try {
            await QuinielaService.cancelarParticipacion(participacionId);
            
            // Remover la participación del estado local
            const nuevasParticipaciones = participacionesUsuario.filter(p => p.id !== participacionId);
            dispatch(setParticipacionesUsuario({
                participaciones: nuevasParticipaciones,
                paginacion: paginacion.participacionesUsuario
            }));
            
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cancelar participación';
            throw new Error(errorMessage);
        }
    }, [dispatch, participacionesUsuario, paginacion]);

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
        dispatch(setFiltroTipo(tipo));
    }, [dispatch]);

    /**
     * Aplica filtro por estado de quiniela
     */
    const applyFilterByState = useCallback((estado: EstadoQuiniela | null) => {
        dispatch(setFiltroEstado(estado));
    }, [dispatch]);

    /**
     * Aplica filtro de búsqueda por texto
     */
    const applySearchFilter = useCallback((busqueda: string) => {
        dispatch(setFiltroBusqueda(busqueda));
    }, [dispatch]);

    /**
     * Limpia todos los filtros
     */
    const clearAllFilters = useCallback(() => {
        dispatch(clearFiltros());
    }, [dispatch]);

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
        dispatch(clearQuinielaActual());
    }, [dispatch]);

    /**
     * Limpia las predicciones actuales
     */
    const clearPrediccionesActuales = useCallback(() => {
        dispatch(clearPredicciones());
    }, [dispatch]);

    /**
     * Limpia todos los datos de quinielas
     */
    const clearAllQuinielaData = useCallback(() => {
        dispatch(clearQuinielaData());
    }, [dispatch]);

    /**
     * Limpia todos los errores
     */
    const clearAllErrors = useCallback(() => {
        dispatch(clearErrors());
    }, [dispatch]);

    /**
     * Actualiza el pool de una quiniela
     */
    const updateQuinielaPool = useCallback((quinielaId: number, nuevoPool: number) => {
        dispatch(actualizarPoolQuiniela({ quinielaId, nuevoPool }));
    }, [dispatch]);

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
        loadParticipacionesUsuarioConRelaciones,
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
        loadPrediccionesUsuario,
        clearPrediccionesActuales,

        // ===== PREDICCIONES =====
        predicciones,
        isLoadingPredicciones,
        errorPredicciones,

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