import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { eventoDeportivoService, eventoUtils } from '../service/api/eventoDeportivoService';
import { deporteService, ligaService } from '../service/api/deporteLigaService';
import type { EventoDeportivoType } from '../types/EventoDeportivoTypes';
import type { DeporteType, LigaType, FiltrosEventoDeportivo, EstadisticasEventos } from '../types/DeporteLigaTypes';

export interface UseEventoDeportivoState {
  eventos: EventoDeportivoType[];
  deportes: DeporteType[];
  ligas: LigaType[];
  estadisticas: EstadisticasEventos | null;
  loading: boolean;
  error: string | null;
}

export const useEventoDeportivo = () => {
  const [state, setState] = useState<UseEventoDeportivoState>({
    eventos: [],
    deportes: [],
    ligas: [],
    estadisticas: null,
    loading: false,
    error: null
  });

  // Función auxiliar para manejar errores
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Error en useEventoDeportivo:', error);
    
    let errorMessage = customMessage || 'Error desconocido';
    
    if (error && typeof error === 'object') {
      if ('response' in error && error.response && typeof error.response === 'object') {
        if ('data' in error.response && error.response.data && typeof error.response.data === 'object') {
          if ('message' in error.response.data && typeof error.response.data.message === 'string') {
            errorMessage = error.response.data.message;
          }
        }
      } else if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      }
    }
    
    setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    toast.error(errorMessage);
  }, []);

  // Limpiar errores
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Cargar eventos con filtros
  const cargarEventos = useCallback(async (filtros?: FiltrosEventoDeportivo) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const eventos = await eventoDeportivoService.getEventos(filtros);
      setState(prev => ({ ...prev, eventos, loading: false }));
      return eventos;
    } catch (error) {
      handleError(error, 'Error al cargar eventos');
      return [];
    }
  }, [handleError]);

  // Cargar eventos próximos
  const cargarEventosProximos = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const eventos = await eventoDeportivoService.getEventosProximos();
      setState(prev => ({ ...prev, eventos, loading: false }));
      return eventos;
    } catch (error) {
      handleError(error, 'Error al cargar eventos próximos');
      return [];
    }
  }, [handleError]);

  // Cargar eventos por deporte
  const cargarEventosPorDeporte = useCallback(async (deporteNombre: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const eventos = await eventoDeportivoService.getEventosPorDeporte(deporteNombre);
      setState(prev => ({ ...prev, eventos, loading: false }));
      return eventos;
    } catch (error) {
      handleError(error, `Error al cargar eventos del deporte: ${deporteNombre}`);
      return [];
    }
  }, [handleError]);

  // Cargar eventos por liga
  const cargarEventosPorLiga = useCallback(async (ligaNombre: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const eventos = await eventoDeportivoService.getEventosPorLiga(ligaNombre);
      setState(prev => ({ ...prev, eventos, loading: false }));
      return eventos;
    } catch (error) {
      handleError(error, `Error al cargar eventos de la liga: ${ligaNombre}`);
      return [];
    }
  }, [handleError]);

  // Cargar deportes disponibles
  const cargarDeportes = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const deportes = await deporteService.getDeportesActivos();
      setState(prev => ({ ...prev, deportes, loading: false }));
      return deportes;
    } catch (error) {
      handleError(error, 'Error al cargar deportes');
      return [];
    }
  }, [handleError]);

  // Cargar ligas disponibles
  const cargarLigas = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const ligas = await ligaService.getLigasActivas();
      setState(prev => ({ ...prev, ligas, loading: false }));
      return ligas;
    } catch (error) {
      handleError(error, 'Error al cargar ligas');
      return [];
    }
  }, [handleError]);

  // Cargar ligas por deporte
  const cargarLigasPorDeporte = useCallback(async (deporteNombre: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const ligas = await eventoDeportivoService.getLigasPorDeporte(deporteNombre);
      setState(prev => ({ ...prev, ligas, loading: false }));
      return ligas;
    } catch (error) {
      handleError(error, `Error al cargar ligas del deporte: ${deporteNombre}`);
      return [];
    }
  }, [handleError]);

  // Cargar estadísticas
  const cargarEstadisticas = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const estadisticas = await eventoDeportivoService.getEstadisticas();
      setState(prev => ({ ...prev, estadisticas, loading: false }));
      return estadisticas;
    } catch (error) {
      handleError(error, 'Error al cargar estadísticas');
      return null;
    }
  }, [handleError]);

  // Forzar sincronización
  const forzarSincronizacion = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const resultado = await eventoDeportivoService.forzarSincronizacion();
      setState(prev => ({ ...prev, loading: false }));
      
      if (resultado.status === 'success') {
        toast.success(resultado.message);
      } else {
        toast.warning(resultado.message);
      }
      
      return resultado;
    } catch (error) {
      handleError(error, 'Error al forzar sincronización');
      return { status: 'error', message: 'Error al forzar sincronización' };
    }
  }, [handleError]);

  // Limpiar eventos antiguos
  const limpiarEventosAntiguos = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const resultado = await eventoDeportivoService.limpiarEventosAntiguos();
      setState(prev => ({ ...prev, loading: false }));
      
      if (resultado.status === 'success') {
        toast.success(resultado.message);
      } else {
        toast.warning(resultado.message);
      }
      
      return resultado;
    } catch (error) {
      handleError(error, 'Error al limpiar eventos antiguos');
      return { status: 'error', message: 'Error al limpiar eventos antiguos' };
    }
  }, [handleError]);

  // Utilidades para trabajar con los datos
  const utils = {
    getDeportesUnicos: () => eventoUtils.getDeportesUnicos(state.eventos),
    getLigasUnicas: () => eventoUtils.getLigasUnicas(state.eventos),
    filtrarPorDeporte: (deporteNombre: string) => eventoUtils.filtrarPorDeporte(state.eventos, deporteNombre),
    filtrarPorLiga: (ligaNombre: string) => eventoUtils.filtrarPorLiga(state.eventos, ligaNombre),
    filtrarPorEstado: (estado: string) => eventoUtils.filtrarPorEstado(state.eventos, estado),
    agruparPorDeporte: () => eventoUtils.agruparPorDeporte(state.eventos),
    agruparPorLiga: () => eventoUtils.agruparPorLiga(state.eventos)
  };

  

  return {
    // Estado
    ...state,
    
    // Acciones
    cargarEventos,
    cargarEventosProximos,
    cargarEventosPorDeporte,
    cargarEventosPorLiga,
    cargarDeportes,
    cargarLigas,
    cargarLigasPorDeporte,
    cargarEstadisticas,
    forzarSincronizacion,
    limpiarEventosAntiguos,
    clearError,
    
    // Utilidades
    utils
  };
};
