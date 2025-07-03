import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { EventoService } from '../service/casino/eventoService';
import { eventoSelector } from '../store/slices/eventoSlice';
import type { AppDispatch } from '../store/store';
import type {
    EventoDeportivoType,
    FiltrosEventoType,
    ConfigurarTipoPrediccionRequestType,
    EstadoEvento
} from '../types/EventoDeportivoTypes';

// Importar las acciones del slice
import {
    setEventosLoading,
    setEventos,
    setEventosError,
    clearEventos,
    setEventosProximosLoading,
    setEventosProximos,
    setEventosDisponiblesLoading,
    setEventosDisponibles,
    setEventoActual,
    clearEventoActual,
    setDeportesDisponibles,
    setLigasDisponibles,
    setEquiposDisponibles,
    setEstadisticasLoading,
    setEstadisticas,
    setEstadisticasError,
    setCurrentPage,
    setFiltrosActivos,
    clearFiltros,
    addFiltro,
    addBusquedaReciente,
    setLoading,
    setError,
    clearErrors,
    resetEstado,
    updateEvento,
    removeEvento
} from '../store/slices/eventoSlice';

// ===== TIPOS PARA EL HOOK =====
// (Los tipos ahora se obtienen directamente del estado de Redux)

// ===== HOOK PRINCIPAL =====
export const useEvento = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    // ===== SELECTORES DEL ESTADO =====
    const eventos = useSelector(eventoSelector.eventos);
    const eventosProximos = useSelector(eventoSelector.eventosProximos);
    const eventosDisponibles = useSelector(eventoSelector.eventosDisponibles);
    const eventoActual = useSelector(eventoSelector.eventoActual);
    const estadisticas = useSelector(eventoSelector.estadisticas);
    const deportesDisponibles = useSelector(eventoSelector.deportesDisponibles);
    const ligasDisponibles = useSelector(eventoSelector.ligasDisponibles);
    const equiposDisponibles = useSelector(eventoSelector.equiposDisponibles);
    const loading = useSelector(eventoSelector.loading);
    const eventosLoading = useSelector(eventoSelector.eventosLoading);
    const estadisticasLoading = useSelector(eventoSelector.estadisticasLoading);
    const error = useSelector(eventoSelector.error);
    const filtrosActivos = useSelector(eventoSelector.filtrosActivos);
    const busquedasRecientes = useSelector(eventoSelector.busquedasRecientes);
    const currentPage = useSelector(eventoSelector.currentPage);
    const totalPages = useSelector(eventoSelector.totalPages);
    const totalElements = useSelector(eventoSelector.totalElements);
    const pageSize = useSelector(eventoSelector.pageSize);

    // ===== FUNCIÓN AUXILIAR PARA MANEJAR ERRORES =====
    const handleError = useCallback((error: unknown, customMessage?: string) => {
        console.error('Error en useEvento:', error);
        
        let errorMessage = customMessage || 'Error desconocido';
        
        // Manejo seguro de errores
        if (error && typeof error === 'object') {
            if ('response' in error && error.response && typeof error.response === 'object') {
                if ('data' in error.response && error.response.data && typeof error.response.data === 'object') {
                    if ('message' in error.response.data && typeof error.response.data.message === 'string') {
                        errorMessage = customMessage || error.response.data.message;
                    }
                }
            } else if ('message' in error && typeof error.message === 'string') {
                errorMessage = customMessage || error.message;
            }
        }
        
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
    }, [dispatch]);

    // ===== CARGAR EVENTOS CON FILTROS =====
    const cargarEventos = useCallback(async (filtros: FiltrosEventoType = {}) => {
        try {
            dispatch(setEventosLoading(true));
            dispatch(setFiltrosActivos(filtros));
            
            const eventosData = await EventoService.obtenerEventos(filtros);
            dispatch(setEventos(eventosData));
            
            return eventosData;
        } catch (error) {
            dispatch(setEventosError('Error al cargar eventos'));
            handleError(error, 'Error al cargar eventos');
            return [];
        }
    }, [dispatch, handleError]);

    // ===== CARGAR EVENTOS PRÓXIMOS =====
    const cargarEventosProximos = useCallback(async () => {
        try {
            dispatch(setEventosProximosLoading(true));
            
            const eventosProximosData = await EventoService.obtenerEventosProximos();
            dispatch(setEventosProximos(eventosProximosData));
            
            return eventosProximosData;
        } catch (error) {
            handleError(error, 'Error al cargar eventos próximos');
            return [];
        }
    }, [dispatch, handleError]);

    // ===== CARGAR EVENTOS POR DEPORTE =====
    const cargarEventosPorDeporte = useCallback(async (deporte: string) => {
        try {
            dispatch(setEventosLoading(true));
            dispatch(addFiltro({ deporte }));
            
            const eventosData = await EventoService.obtenerEventosPorDeporte(deporte);
            dispatch(setEventos(eventosData));
            
            return eventosData;
        } catch (error) {
            dispatch(setEventosError(`Error al cargar eventos de ${deporte}`));
            handleError(error, `Error al cargar eventos de ${deporte}`);
            return [];
        }
    }, [dispatch, handleError]);

    // ===== CARGAR EVENTOS POR LIGA =====
    const cargarEventosPorLiga = useCallback(async (liga: string) => {
        try {
            dispatch(setEventosLoading(true));
            dispatch(addFiltro({ liga }));
            
            const eventosData = await EventoService.obtenerEventosPorLiga(liga);
            dispatch(setEventos(eventosData));
            
            return eventosData;
        } catch (error) {
            dispatch(setEventosError(`Error al cargar eventos de ${liga}`));
            handleError(error, `Error al cargar eventos de ${liga}`);
            return [];
        }
    }, [dispatch, handleError]);

    // ===== BUSCAR EVENTOS =====
    const buscarEventos = useCallback(async (query: string, filtros: FiltrosEventoType = {}) => {
        try {
            dispatch(setEventosLoading(true));
            dispatch(addBusquedaReciente(query));
            dispatch(setFiltrosActivos(filtros));
            
            const eventosData = await EventoService.buscarEventos(query, filtros);
            dispatch(setEventos(eventosData));
            
            return eventosData;
        } catch (error) {
            dispatch(setEventosError('Error al buscar eventos'));
            handleError(error, 'Error al buscar eventos');
            return [];
        }
    }, [dispatch, handleError]);

    // ===== CARGAR EVENTO POR ID =====
    const cargarEventoPorId = useCallback(async (id: number) => {
        try {
            dispatch(setLoading(true));
            
            const evento = await EventoService.obtenerEventoPorId(id);
            dispatch(setEventoActual(evento));
            
            return evento;
        } catch (error) {
            handleError(error, 'Error al cargar evento');
            return null;
        }
    }, [dispatch, handleError]);

    // ===== CARGAR ESTADÍSTICAS =====
    const cargarEstadisticas = useCallback(async () => {
        try {
            dispatch(setEstadisticasLoading(true));
            
            const estadisticasData = await EventoService.obtenerEstadisticas();
            dispatch(setEstadisticas(estadisticasData));
            
            return estadisticasData;
        } catch (error) {
            dispatch(setEstadisticasError('Error al cargar estadísticas'));
            handleError(error, 'Error al cargar estadísticas');
            return null;
        }
    }, [dispatch, handleError]);

    // ===== CARGAR EVENTOS DISPONIBLES PARA QUINIELAS =====
    const cargarEventosDisponibles = useCallback(async () => {
        try {
            dispatch(setEventosDisponiblesLoading(true));
            
            const eventosDisponiblesData = await EventoService.obtenerEventosDisponibles();
            dispatch(setEventosDisponibles(eventosDisponiblesData));
            return eventosDisponiblesData;
        } catch (error) {
            handleError(error, 'Error al cargar eventos disponibles');
            return [];
        }
    }, [dispatch, handleError]);

    // ===== CARGAR LISTAS AUXILIARES =====
    const cargarDeportesDisponibles = useCallback(async () => {
        try {
            const deportes = await EventoService.obtenerDeportesDisponibles();
            dispatch(setDeportesDisponibles(deportes));
            return deportes;
        } catch (error) {
            handleError(error, 'Error al cargar deportes disponibles');
            return [];
        }
    }, [dispatch, handleError]);

    const cargarLigasDisponibles = useCallback(async (deporte?: string) => {
        try {
            const ligas = await EventoService.obtenerLigasDisponibles(deporte);
            dispatch(setLigasDisponibles(ligas));
            return ligas;
        } catch (error) {
            handleError(error, 'Error al cargar ligas disponibles');
            return [];
        }
    }, [dispatch, handleError]);

    const cargarEquiposDisponibles = useCallback(async (deporte?: string, liga?: string) => {
        try {
            const equipos = await EventoService.obtenerEquiposDisponibles(deporte, liga);
            dispatch(setEquiposDisponibles(equipos));
            return equipos;
        } catch (error) {
            handleError(error, 'Error al cargar equipos disponibles');
            return [];
        }
    }, [dispatch, handleError]);

    // ===== OPERACIONES DE ADMINISTRACIÓN =====
    const sincronizarEventos = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            
            const resultado = await EventoService.forzarSincronizacion();
            dispatch(setLoading(false));
            
            if (resultado.status === 'success') {
                toast.success(resultado.message);
            } else {
                toast.error(resultado.message);
            }
            
            return resultado;
        } catch (error) {
            handleError(error, 'Error al sincronizar eventos');
            return { status: 'error' as const, message: 'Error al sincronizar eventos' };
        }
    }, [dispatch, handleError]);

    const limpiarEventosAntiguos = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            
            const resultado = await EventoService.limpiarEventosAntiguos();
            dispatch(setLoading(false));
            
            if (resultado.status === 'success') {
                toast.success(resultado.message);
                // Recargar eventos después de limpiar
                await cargarEventosProximos();
            } else {
                toast.error(resultado.message);
            }
            
            return resultado;
        } catch (error) {
            handleError(error, 'Error al limpiar eventos antiguos');
            return { status: 'error' as const, message: 'Error al limpiar eventos antiguos' };
        }
    }, [dispatch, handleError, cargarEventosProximos]);

    // ===== OPERACIONES CON QUINIELAS =====
    const agregarEventosAQuiniela = useCallback(async (quinielaId: number, eventosIds: number[]) => {
        try {
            dispatch(setLoading(true));
            
            await EventoService.agregarEventosAQuiniela(quinielaId, eventosIds);
            dispatch(setLoading(false));
            
            toast.success(`${eventosIds.length} evento(s) agregado(s) a la quiniela exitosamente`);
            return true;
        } catch (error) {
            handleError(error, 'Error al agregar eventos a la quiniela');
            return false;
        }
    }, [dispatch, handleError]);

    const configurarTipoPrediccion = useCallback(async (
        quinielaId: number,
        eventoId: number,
        configuracion: ConfigurarTipoPrediccionRequestType
    ) => {
        try {
            dispatch(setLoading(true));
            
            await EventoService.configurarTipoPrediccion(quinielaId, eventoId, configuracion);
            dispatch(setLoading(false));
            
            toast.success('Tipo de predicción configurado exitosamente');
            return true;
        } catch (error) {
            handleError(error, 'Error al configurar tipo de predicción');
            return false;
        }
    }, [dispatch, handleError]);

    // ===== UTILIDADES =====
    const limpiarFiltros = useCallback(() => {
        dispatch(clearFiltros());
        dispatch(clearEventos());
    }, [dispatch]);

    const limpiarError = useCallback(() => {
        dispatch(clearErrors());
    }, [dispatch]);

    const limpiarEventoActual = useCallback(() => {
        dispatch(clearEventoActual());
    }, [dispatch]);

    const resetearEstado = useCallback(() => {
        dispatch(resetEstado());
    }, [dispatch]);

    const cambiarPagina = useCallback((pagina: number) => {
        dispatch(setCurrentPage(pagina));
    }, [dispatch]);

    const actualizarEvento = useCallback((evento: EventoDeportivoType) => {
        dispatch(updateEvento(evento));
    }, [dispatch]);

    const eliminarEvento = useCallback((eventoId: number) => {
        dispatch(removeEvento(eventoId));
    }, [dispatch]);

    const verificarDisponibilidadEvento = useCallback(async (eventoId: number) => {
        try {
            return await EventoService.verificarDisponibilidadEvento(eventoId);
        } catch (error) {
            console.error('Error al verificar disponibilidad:', error);
            return false;
        }
    }, []);

    // ===== FUNCIONES DE FILTRADO LOCAL =====
    const filtrarEventosPorEstado = useCallback((estado: EstadoEvento) => {
        return eventos.filter(evento => evento.estado === estado);
    }, [eventos]);

    const filtrarEventosPorFecha = useCallback((fechaInicio: string, fechaFin?: string) => {
        return eventos.filter(evento => {
            const fechaEvento = new Date(evento.fechaEvento);
            const inicio = new Date(fechaInicio);
            const fin = fechaFin ? new Date(fechaFin) : new Date(fechaInicio);
            fin.setHours(23, 59, 59, 999); // Final del día
            
            return fechaEvento >= inicio && fechaEvento <= fin;
        });
    }, [eventos]);

    // ===== CARGAR EVENTO POR NOMBRE Y FECHA =====
    const cargarEventoPorNombreYFecha = useCallback(async (
        nombreEvento: string, 
        fecha: string,
        equipoLocal?: string,
        equipoVisitante?: string
    ) => {
        try {
            dispatch(setLoading(true));
            
            const evento = await EventoService.obtenerEventoPorNombreYFecha(
                nombreEvento, 
                fecha, 
                equipoLocal, 
                equipoVisitante
            );
            
            if (evento) {
                dispatch(setEventoActual(evento));
                toast.success('Evento encontrado');
            } else {
                toast.warning('No se encontró el evento con los criterios especificados');
            }
            
            return evento;
        } catch (error) {
            handleError(error, 'Error al buscar evento por nombre y fecha');
            return null;
        }
    }, [dispatch, handleError]);

    // ===== CARGAR EVENTOS POR FECHA =====
    const cargarEventosPorFecha = useCallback(async (
        fecha: string,
        deporte?: string,
        liga?: string
    ) => {
        try {
            dispatch(setEventosLoading(true));
            
            const eventosData = await EventoService.obtenerEventosPorFecha(fecha, deporte, liga);
            dispatch(setEventos(eventosData));
            
            toast.success(`Se encontraron ${eventosData.length} eventos para la fecha ${fecha}`);
            return eventosData;
        } catch (error) {
            dispatch(setEventosError(`Error al cargar eventos de la fecha ${fecha}`));
            handleError(error, `Error al cargar eventos de la fecha ${fecha}`);
            return [];
        }
    }, [dispatch, handleError]);

    // ===== RETORNO DEL HOOK =====
    return {
        // Estado del Redux store
        eventos,
        eventosProximos,
        eventosDisponibles,
        eventoActual,
        estadisticas,
        deportesDisponibles,
        ligasDisponibles,
        equiposDisponibles,
        loading,
        eventosLoading,
        estadisticasLoading,
        error,
        filtrosActivos,
        busquedasRecientes,
        currentPage,
        totalPages,
        totalElements,
        pageSize,
        
        // Funciones de carga
        cargarEventos,
        cargarEventosProximos,
        cargarEventosPorDeporte,
        cargarEventosPorLiga,
        buscarEventos,
        cargarEventoPorId,
        cargarEstadisticas,
        cargarEventosDisponibles,
        cargarEventoPorNombreYFecha,
        cargarEventosPorFecha,
        
        // Listas auxiliares
        cargarDeportesDisponibles,
        cargarLigasDisponibles,
        cargarEquiposDisponibles,
        
        // Operaciones de administración
        sincronizarEventos,
        limpiarEventosAntiguos,
        
        // Operaciones con quinielas
        agregarEventosAQuiniela,
        configurarTipoPrediccion,
        
        // Utilidades
        limpiarFiltros,
        limpiarError,
        limpiarEventoActual,
        resetearEstado,
        cambiarPagina,
        actualizarEvento,
        eliminarEvento,
        verificarDisponibilidadEvento,
        filtrarEventosPorEstado,
        filtrarEventosPorFecha,
        
        // Getters computados
        eventosHoy: filtrarEventosPorFecha(new Date().toISOString().split('T')[0]),
        eventosProgramados: filtrarEventosPorEstado('programado'),
        eventosEnVivo: filtrarEventosPorEstado('en_vivo'),
        eventosFinalizados: filtrarEventosPorEstado('finalizado'),
        
        // Estados derivados
        tieneEventos: eventos.length > 0,
        tieneEventosProximos: eventosProximos.length > 0,
        tieneEventosDisponibles: eventosDisponibles.length > 0,
        tieneFiltrosActivos: Object.keys(filtrosActivos).length > 0,
        
        // Selectores adicionales del slice
        eventosCancelados: filtrarEventosPorEstado('cancelado'),
        totalEventos: eventos.length,
        totalEventosProximos: eventosProximos.length,
        totalEventosDisponibles: eventosDisponibles.length
    };
};
