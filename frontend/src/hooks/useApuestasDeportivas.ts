/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    apuestaSelector,
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
    setFiltroFechas,
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
} from '../store/slices/apuestaSlice';
import { ApuestaService } from '../service/casino/apuestaService';

import { 
    type ApuestaType,
    type ApuestaDetalle,
    type CrearApuestaRequestType,
    type ApuestasResponse,
    type EstadisticasApuestaType,
    type ResumenApuestaType,
    type FiltrosApuesta,
    EstadoApuesta,
    type TipoApuesta
} from '../types/ApuestaType';
import useUser from './useUser';

/**
 * Hook personalizado `useApuestasDeportivas` para gestionar el estado de las apuestas deportivas y todas sus operaciones.
 *
 * @returns {object} Un objeto con las siguientes propiedades y funciones:
 * 
 * - `misApuestas` {ApuestaType[]}: Lista de mis apuestas.
 * - `apuestasActivas` {ApuestaType[]}: Lista de apuestas activas.
 * - `apuestasFinalizadas` {ApuestaType[]}: Lista de apuestas finalizadas.
 * - `apuestasRecientes` {ResumenApuestaType[]}: Lista de apuestas recientes.
 * - `apuestasPorTipo` {ApuestaType[]}: Lista de apuestas por tipo.
 * - `apuestasPorEstado` {ApuestaType[]}: Lista de apuestas por estado.
 * - `apuestasPorEvento` {ApuestaType[]}: Lista de apuestas por evento.
 * - `resultadosBusqueda` {ApuestaType[]}: Resultados de búsqueda.
 * - `apuestaActual` {ApuestaDetalle | null}: Apuesta actualmente seleccionada.
 * - `estadisticasApuestas` {EstadisticasApuestaType | null}: Estadísticas de apuestas.
 * - `loading` {object}: Estados de carga para diferentes operaciones.
 * - `errors` {object}: Estados de error para diferentes operaciones.
 * - `filtros` {object}: Filtros aplicados a las apuestas.
 * - `paginacion` {object}: Información de paginación.
 * - Funciones de carga: `loadMisApuestas`, `loadApuestaDetalle`, etc.
 * - Funciones de acciones: `createApuesta`, `cancelApuesta`, etc.
 * - Funciones de navegación y utilidades.
 */
export const useApuestasDeportivas = () => {
    const dispatch = useDispatch();
    const {user}=useUser();

    // ===== SELECTORES DEL ESTADO =====
    const misApuestas = useSelector(apuestaSelector.misApuestas);
    const apuestasActivas = useSelector(apuestaSelector.apuestasActivas);
    const apuestasFinalizadas = useSelector(apuestaSelector.apuestasFinalizadas);
    const apuestasRecientes = useSelector(apuestaSelector.apuestasRecientes);
    const apuestasPorTipo = useSelector(apuestaSelector.apuestasPorTipo);
    const apuestasPorEstado = useSelector(apuestaSelector.apuestasPorEstado);
    const apuestasPorEvento = useSelector(apuestaSelector.apuestasPorEvento);
    const resultadosBusqueda = useSelector(apuestaSelector.resultadosBusqueda);
    const apuestaActual = useSelector(apuestaSelector.apuestaActual);
    const estadisticasApuestas = useSelector(apuestaSelector.estadisticasApuestas);

    // Estados de carga
    const loading = useSelector(apuestaSelector.loading);
    const isLoadingMisApuestas = useSelector(apuestaSelector.isLoadingMisApuestas);
    const isLoadingApuestasActivas = useSelector(apuestaSelector.isLoadingApuestasActivas);
    const isLoadingBusqueda = useSelector(apuestaSelector.isLoadingBusqueda);
    const isCreandoApuesta = useSelector(apuestaSelector.isCreandoApuesta);
    const isCancelandoApuesta = useSelector(apuestaSelector.isCancelandoApuesta);

    // Estados de error
    const errors = useSelector(apuestaSelector.errors);
    const errorMisApuestas = useSelector(apuestaSelector.errorMisApuestas);
    const errorBusqueda = useSelector(apuestaSelector.errorBusqueda);
    const errorCrearApuesta = useSelector(apuestaSelector.errorCrearApuesta);
    const errorCancelarApuesta = useSelector(apuestaSelector.errorCancelarApuesta);

    // Filtros y datos computados
    const filtros = useSelector(apuestaSelector.filtros);
    const paginacion = useSelector(apuestaSelector.paginacion);
    const hasMisApuestas = useSelector(apuestaSelector.hasMisApuestas);
    const hasApuestasActivas = useSelector(apuestaSelector.hasApuestasActivas);
    const hasResultadosBusqueda = useSelector(apuestaSelector.hasResultadosBusqueda);
    const tienesFiltrosActivos = useSelector(apuestaSelector.tienesFiltrosActivos);
    const contadorFiltrosActivos = useSelector(apuestaSelector.contadorFiltrosActivos);
    const misApuestasFiltradas = useSelector(apuestaSelector.misApuestasFiltradas);
    const resumenEstadisticas = useSelector(apuestaSelector.resumenEstadisticas);
    const totalMisApuestas = useSelector(apuestaSelector.totalMisApuestas);

    // Selectores específicos
    const filtroEstado = useSelector(apuestaSelector.filtroEstado);
    const filtroTipoApuesta = useSelector(apuestaSelector.filtroTipoApuesta);
    const filtroFechas = useSelector(apuestaSelector.filtroFechas);
    const filtroMontos = useSelector(apuestaSelector.filtroMontos);
    const filtroBusqueda = useSelector(apuestaSelector.filtroBusqueda);
    const filtroEventoId = useSelector(apuestaSelector.filtroEventoId);
    const limites = useSelector(apuestaSelector.limites);
    const pageSize = useSelector(apuestaSelector.pageSize);

    // ===== FUNCIONES DE CARGA DE DATOS =====

    /**
     * Carga mis apuestas con paginación
     */
    const loadMisApuestas = useCallback(async (page: number = 0, size: number = 10): Promise<ApuestasResponse | null> => {
        dispatch(setMisApuestasLoading(true));
        try {
            const response = await ApuestaService.obtenerMisApuestas(page, size);
            dispatch(setMisApuestas({
                apuestas: response.content,
                paginacion: {
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                }
            }));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar mis apuestas';
            dispatch(setMisApuestasError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga apuestas activas
     */
    const loadApuestasActivas = useCallback(async (page: number = 0, size: number = 10): Promise<ApuestasResponse | null> => {
        dispatch(setApuestasActivasLoading(true));
        try {
            const response = await ApuestaService.obtenerApuestasActivas(page, size);
            dispatch(setApuestasActivas({
                apuestas: response.content,
                paginacion: {
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                }
            }));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar apuestas activas';
            dispatch(setApuestasActivasError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga apuestas finalizadas
     */
    const loadApuestasFinalizadas = useCallback(async (page: number = 0, size: number = 10): Promise<ApuestasResponse | null> => {
        dispatch(setApuestasFinalizadasLoading(true));
        try {
            const response = await ApuestaService.obtenerHistorialApuestas(page, size);
            dispatch(setApuestasFinalizadas({
                apuestas: response.content,
                paginacion: {
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                }
            }));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar apuestas finalizadas';
            dispatch(setApuestasFinalizadasError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga apuestas recientes
     */
    const loadApuestasRecientes = useCallback(async (limite: number = 5): Promise<ResumenApuestaType[]> => {
        dispatch(setApuestasRecientesLoading(true));
        try {
            const response = await ApuestaService.obtenerApuestasRecientes(limite);
            dispatch(setApuestasRecientes(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar apuestas recientes';
            dispatch(setApuestasRecientesError(errorMessage));
            return [];
        }
    }, [dispatch]);

    /**
     * Carga apuestas por tipo
     */
    const loadApuestasPorTipo = useCallback(async (tipo: TipoApuesta, page: number = 0, size: number = 10): Promise<ApuestasResponse | null> => {
        dispatch(setApuestasPorTipoLoading(true));
        try {
            const response = await ApuestaService.obtenerApuestasPorTipo(tipo, page, size);
            dispatch(setApuestasPorTipo({
                apuestas: response.content,
                tipo,
                paginacion: {
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                }
            }));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar apuestas por tipo';
            dispatch(setApuestasPorTipoError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga apuestas por estado
     */
    const loadApuestasPorEstado = useCallback(async (estado: EstadoApuesta, page: number = 0, size: number = 10): Promise<ApuestasResponse | null> => {
        dispatch(setApuestasPorEstadoLoading(true));
        try {
            const response = await ApuestaService.obtenerApuestasPorEstado(estado, page, size);
            dispatch(setApuestasPorEstado({
                apuestas: response.content,
                estado,
                paginacion: {
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                }
            }));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar apuestas por estado';
            dispatch(setApuestasPorEstadoError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga apuestas por evento
     */
    const loadApuestasPorEvento = useCallback(async (eventoId: number, page: number = 0, size: number = 10): Promise<ApuestasResponse | null> => {
        dispatch(setApuestasPorEventoLoading(true));
        try {
            const response = await ApuestaService.obtenerApuestasPorEvento(eventoId, page, size);
            dispatch(setApuestasPorEvento({
                apuestas: response.content,
                eventoId,
                paginacion: {
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                }
            }));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar apuestas por evento';
            dispatch(setApuestasPorEventoError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga el detalle de una apuesta específica
     */
    const loadApuestaDetail = useCallback(async (apuestaId: number): Promise<ApuestaDetalle | null> => {
        dispatch(setApuestaActualLoading(true));
        try {
            const response = await ApuestaService.obtenerApuestaPorId(apuestaId);
            dispatch(setApuestaActual(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar detalle de la apuesta';
            dispatch(setApuestaActualError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga apuestas filtradas
     */
    const loadApuestasFiltradas = useCallback(async (filtros: FiltrosApuesta, page: number = 0, size: number = 10): Promise<ApuestasResponse | null> => {
        dispatch(setMisApuestasLoading(true));
        try {
            const response = await ApuestaService.obtenerApuestasFiltradas(filtros, page, size);
            dispatch(setMisApuestas({
                apuestas: response.content,
                paginacion: {
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                }
            }));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar apuestas filtradas';
            dispatch(setMisApuestasError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga estadísticas de apuestas
     */
    const loadEstadisticasApuestas = useCallback(async (): Promise<EstadisticasApuestaType | null> => {
        dispatch(setEstadisticasLoading(true));
        try {
            const response = await ApuestaService.obtenerEstadisticasApuestas();
            dispatch(setEstadisticasApuestas(response));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar estadísticas de apuestas';
            dispatch(setEstadisticasError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Carga límites de apuesta
     */
    const loadLimitesApuesta = useCallback(async (): Promise<{ minimo: number; maximo: number; disponible: number } | null> => {
        try {
            const response = await ApuestaService.obtenerLimitesApuesta();
            dispatch(setLimitesApuesta(response));
            return response;
        } catch (error: any) {
            console.error('Error al cargar límites de apuesta:', error);
            return null;
        }
    }, [dispatch]);

    // ===== FUNCIONES DE ACCIONES =====

    /**
     * Crea una nueva apuesta
     */
    const createApuesta = useCallback(async (datosApuesta: CrearApuestaRequestType): Promise<ApuestaType | null> => {
        dispatch(setCreandoApuestaLoading(true));
        try {
            const response = await ApuestaService.crearApuesta(datosApuesta,user?.idUsuario || 0);
            dispatch(apuestaCreadaExitosamente(response));

            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear la apuesta';
            dispatch(setCrearApuestaError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Cancela una apuesta
     */
    const cancelApuesta = useCallback(async (apuestaId: number): Promise<boolean> => {
        dispatch(setCancelandoApuestaLoading(true));
        try {
            const mensaje = await ApuestaService.cancelarApuesta(apuestaId);
            dispatch(apuestaCanceladaExitosamente({ apuestaId, mensaje }));
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cancelar la apuesta';
            dispatch(setCancelarApuestaError(errorMessage));
            return false;
        }
    }, [dispatch]);

    /**
     * Procesa resultados de un evento (solo administradores)
     */
    const procesarResultadosEvento = useCallback(async (eventoId: number): Promise<boolean> => {
        dispatch(setProcesandoResultadosLoading(true));
        try {
            const mensaje = await ApuestaService.procesarResultadosEvento(eventoId);
            dispatch(resultadosProcesadosExitosamente());
            console.log('Resultados procesados:', mensaje);
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al procesar resultados del evento';
            dispatch(setProcesarResultadosError(errorMessage));
            return false;
        }
    }, [dispatch]);

    // ===== FUNCIONES DE BÚSQUEDA =====

    /**
     * Busca apuestas por criterio
     */
    const searchApuestas = useCallback(async (query: string, page: number = 0, size: number = 10): Promise<ApuestasResponse | null> => {
        dispatch(setBusquedaLoading(true));
        try {
            const response = await ApuestaService.buscarApuestas(query, page, size);
            dispatch(setResultadosBusqueda({
                apuestas: response.content,
                query,
                paginacion: {
                    page: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                }
            }));
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al buscar apuestas';
            dispatch(setBusquedaError(errorMessage));
            return null;
        }
    }, [dispatch]);

    /**
     * Limpia los resultados de búsqueda
     */
    const clearSearchResults = useCallback(() => {
        dispatch(clearResultadosBusqueda());
    }, [dispatch]);

    // ===== FUNCIONES DE FILTROS =====

    /**
     * Aplica filtro por estado de apuesta
     */
    const applyFilterByState = useCallback((estado: EstadoApuesta | null) => {
        dispatch(setFiltroEstado(estado));
    }, [dispatch]);

    /**
     * Aplica filtro por tipo de apuesta
     */
    const applyFilterByType = useCallback((tipo: TipoApuesta | null) => {
        dispatch(setFiltroTipoApuesta(tipo));
    }, [dispatch]);

    /**
     * Aplica filtro por fechas
     */
    const applyDateFilter = useCallback((fechaDesde?: string | null, fechaHasta?: string | null) => {
        dispatch(setFiltroFechas({ fechaDesde, fechaHasta }));
    }, [dispatch]);

    /**
     * Aplica filtro por montos
     */
    const applyAmountFilter = useCallback((montoMinimo?: number | null, montoMaximo?: number | null) => {
        dispatch(setFiltroMontos({ montoMinimo, montoMaximo }));
    }, [dispatch]);

    /**
     * Aplica filtro por evento
     */
    const applyEventFilter = useCallback((eventoId: number | null) => {
        dispatch(setFiltroEventoId(eventoId));
    }, [dispatch]);

    /**
     * Aplica filtro de búsqueda por texto
     */
    const applySearchFilter = useCallback((busqueda: string) => {
        dispatch(setFiltroBusqueda(busqueda));
    }, [dispatch]);

    /**
     * Aplica múltiples filtros
     */
    const applyMultipleFilters = useCallback((filtros: Partial<FiltrosApuesta>) => {
        dispatch(setFiltros(filtros));
    }, [dispatch]);

    /**
     * Limpia todos los filtros
     */
    const clearAllFilters = useCallback(() => {
        dispatch(clearFiltros());
    }, [dispatch]);

    // ===== FUNCIONES DE VALIDACIÓN =====

    /**
     * Verifica si una apuesta es válida
     */
    const validateApuesta = useCallback(async (eventoId: number, cuotaId: number, monto: number): Promise<boolean> => {
        try {
            return await ApuestaService.verificarApuestaValida(eventoId, cuotaId, monto);
        } catch (error) {
            console.error('Error al validar apuesta:', error);
            return false;
        }
    }, []);

    /**
     * Valida el monto de una apuesta
     */
    const validateMontoApuesta = useCallback((monto: number): boolean => {
        return ApuestaService.validarMontoApuesta(monto);
    }, []);

    /**
     * Calcula la ganancia potencial de una apuesta
     */
    const calculatePotentialWinnings = useCallback((montoApostado: number, valorCuota: number): number => {
        return ApuestaService.calcularGananciaPotencial(montoApostado, valorCuota);
    }, []);

    // ===== FUNCIONES DE UTILIDAD =====

    /**
     * Limpia la apuesta actual seleccionada
     */
    const clearCurrentApuesta = useCallback(() => {
        dispatch(clearApuestaActual());
    }, [dispatch]);

    /**
     * Limpia todos los datos de apuestas
     */
    const clearAllApuestaData = useCallback(() => {
        dispatch(clearApuestaData());
    }, [dispatch]);

    /**
     * Limpia todos los errores
     */
    const clearAllErrors = useCallback(() => {
        dispatch(clearErrors());
    }, [dispatch]);

    /**
     * Actualiza una apuesta localmente
     */
    const updateApuestaLocal = useCallback((apuestaUpdate: Partial<ApuestaType> & { id: number }) => {
        dispatch(actualizarApuestaLocal(apuestaUpdate));
    }, [dispatch]);

    /**
     * Agrega una nueva apuesta al estado local
     */
    const addApuestaToState = useCallback((apuesta: ApuestaType) => {
        dispatch(addApuesta(apuesta));
    }, [dispatch]);

    /**
     * Remueve una apuesta del estado local
     */
    const removeApuestaFromState = useCallback((apuestaId: number) => {
        dispatch(removeApuesta(apuestaId));
    }, [dispatch]);

    /**
     * Establece el tamaño de página
     */
    const setPageSizeConfig = useCallback((size: number) => {
        dispatch(setPageSize(size));
    }, [dispatch]);

    /**
     * Limpia mis apuestas
     */
    const clearMisApuestasData = useCallback(() => {
        dispatch(clearMisApuestas());
    }, [dispatch]);

    /**
     * Limpia apuestas activas
     */
    const clearApuestasActivasData = useCallback(() => {
        dispatch(clearApuestasActivas());
    }, [dispatch]);

    /**
     * Carga el dashboard completo de apuestas
     */
    const loadCompleteDashboard = useCallback(async () => {
        try {
            await Promise.all([
                loadApuestasRecientes(5),
                loadEstadisticasApuestas(),
                loadLimitesApuesta(),
            ]);
        } catch (error) {
            console.error('Error al cargar dashboard completo de apuestas:', error);
        }
    }, [loadApuestasRecientes, loadEstadisticasApuestas, loadLimitesApuesta]);

    /**
     * Refresca todas las vistas principales
     */
    const refreshAllViews = useCallback(async (page: number = 0, size: number = 10) => {
        try {
            await Promise.all([
                loadMisApuestas(page, size),
                loadApuestasActivas(page, size),
                loadApuestasRecientes(5),
                loadEstadisticasApuestas(),
            ]);
        } catch (error) {
            console.error('Error al refrescar todas las vistas:', error);
        }
    }, [loadMisApuestas, loadApuestasActivas, loadApuestasRecientes, loadEstadisticasApuestas]);

    /**
     * Verifica si se puede cancelar una apuesta
     */
    const canCancelApuesta = useCallback((apuesta: ApuestaType): boolean => {
        return apuesta.estado === EstadoApuesta.PENDIENTE || apuesta.estado === EstadoApuesta.ACEPTADA;
    }, []);

    /**
     * Obtiene el color del estado de una apuesta
     */
    const getEstadoColor = useCallback((estado: EstadoApuesta): string => {
        switch (estado) {
            case EstadoApuesta.PENDIENTE:
                return 'warning';
            case EstadoApuesta.ACEPTADA:
                return 'info';
            case EstadoApuesta.RESUELTA:
                return 'success';
            case EstadoApuesta.CANCELADA:
                return 'error';
            case EstadoApuesta.RECHAZADA:
                return 'error';
            default:
                return 'default';
        }
    }, []);

    return {
        // ===== ESTADO =====
        misApuestas,
        apuestasActivas,
        apuestasFinalizadas,
        apuestasRecientes,
        apuestasPorTipo,
        apuestasPorEstado,
        apuestasPorEvento,
        resultadosBusqueda,
        apuestaActual,
        estadisticasApuestas,

        // Estados de carga
        loading,
        isLoadingMisApuestas,
        isLoadingApuestasActivas,
        isLoadingBusqueda,
        isCreandoApuesta,
        isCancelandoApuesta,

        // Estados de error
        errors,
        errorMisApuestas,
        errorBusqueda,
        errorCrearApuesta,
        errorCancelarApuesta,

        // Filtros y datos computados
        filtros,
        paginacion,
        hasMisApuestas,
        hasApuestasActivas,
        hasResultadosBusqueda,
        tienesFiltrosActivos,
        contadorFiltrosActivos,
        misApuestasFiltradas,
        resumenEstadisticas,
        totalMisApuestas,

        // Selectores específicos
        filtroEstado,
        filtroTipoApuesta,
        filtroFechas,
        filtroMontos,
        filtroBusqueda,
        filtroEventoId,
        limites,
        pageSize,

        // ===== FUNCIONES DE CARGA =====
        loadMisApuestas,
        loadApuestasActivas,
        loadApuestasFinalizadas,
        loadApuestasRecientes,
        loadApuestasPorTipo,
        loadApuestasPorEstado,
        loadApuestasPorEvento,
        loadApuestaDetail,
        loadApuestasFiltradas,
        loadEstadisticasApuestas,
        loadLimitesApuesta,
        loadCompleteDashboard,
        refreshAllViews,

        // ===== FUNCIONES DE ACCIONES =====
        createApuesta,
        cancelApuesta,
        procesarResultadosEvento,

        // ===== FUNCIONES DE BÚSQUEDA =====
        searchApuestas,
        clearSearchResults,

        // ===== FUNCIONES DE FILTROS =====
        applyFilterByState,
        applyFilterByType,
        applyDateFilter,
        applyAmountFilter,
        applyEventFilter,
        applySearchFilter,
        applyMultipleFilters,
        clearAllFilters,

        // ===== FUNCIONES DE VALIDACIÓN =====
        validateApuesta,
        validateMontoApuesta,
        calculatePotentialWinnings,
        canCancelApuesta,

        // ===== FUNCIONES DE UTILIDAD =====
        clearCurrentApuesta,
        clearAllApuestaData,
        clearAllErrors,
        updateApuestaLocal,
        addApuestaToState,
        removeApuestaFromState,
        setPageSizeConfig,
        clearMisApuestasData,
        clearApuestasActivasData,
        getEstadoColor,
    };
};

export default useApuestasDeportivas;