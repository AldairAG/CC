import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ligaService } from '../service/api/deporteLigaService';
import type { LigaType, CrearLigaRequest, ActualizarLigaRequest, DeporteType } from '../types/DeporteLigaTypes';

export interface UseLigaState {
  ligas: LigaType[];
  ligaActual: LigaType | null;
  loading: boolean;
  error: string | null;
}

export const useLiga = () => {
  const [state, setState] = useState<UseLigaState>({
    ligas: [],
    ligaActual: null,
    loading: false,
    error: null
  });

  // Función auxiliar para manejar errores
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Error en useLiga:', error);
    
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

  // Cargar todas las ligas
  const cargarLigas = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const ligas = await ligaService.getAllLigas();
      setState(prev => ({ ...prev, ligas, loading: false }));
      return ligas;
    } catch (error) {
      handleError(error, 'Error al cargar ligas');
      return [];
    }
  }, [handleError]);

  // Cargar ligas activas
  const cargarLigasActivas = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const ligas = await ligaService.getLigasActivas();
      setState(prev => ({ ...prev, ligas, loading: false }));
      return ligas;
    } catch (error) {
      handleError(error, 'Error al cargar ligas activas');
      return [];
    }
  }, [handleError]);

  // Cargar liga por ID
  const cargarLiga = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const liga = await ligaService.getLigaById(id);
      setState(prev => ({ ...prev, ligaActual: liga, loading: false }));
      return liga;
    } catch (error) {
      handleError(error, `Error al cargar liga con ID: ${id}`);
      return null;
    }
  }, [handleError]);

  // Cargar ligas por deporte
  const cargarLigasPorDeporte = useCallback(async (deporteId: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const ligas = await ligaService.getLigasByDeporte(deporteId);
      setState(prev => ({ ...prev, ligas, loading: false }));
      return ligas;
    } catch (error) {
      handleError(error, `Error al cargar ligas del deporte con ID: ${deporteId}`);
      return [];
    }
  }, [handleError]);

  // Crear nueva liga
  const crearLiga = useCallback(async (ligaData: CrearLigaRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const nuevaLiga = await ligaService.crearLiga(ligaData);
      
      // Actualizar la lista local
      setState(prev => ({
        ...prev,
        ligas: [...prev.ligas, nuevaLiga],
        ligaActual: nuevaLiga,
        loading: false
      }));
      
      toast.success('Liga creada exitosamente');
      return nuevaLiga;
    } catch (error) {
      handleError(error, 'Error al crear liga');
      return null;
    }
  }, [handleError]);

  // Actualizar liga
  const actualizarLiga = useCallback(async (ligaData: ActualizarLigaRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const ligaActualizada = await ligaService.actualizarLiga(ligaData);
      
      // Actualizar la lista local
      setState(prev => ({
        ...prev,
        ligas: prev.ligas.map(l => l.id === ligaActualizada.id ? ligaActualizada : l),
        ligaActual: prev.ligaActual?.id === ligaActualizada.id ? ligaActualizada : prev.ligaActual,
        loading: false
      }));
      
      toast.success('Liga actualizada exitosamente');
      return ligaActualizada;
    } catch (error) {
      handleError(error, 'Error al actualizar liga');
      return null;
    }
  }, [handleError]);

  // Eliminar liga
  const eliminarLiga = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await ligaService.eliminarLiga(id);
      
      // Actualizar la lista local
      setState(prev => ({
        ...prev,
        ligas: prev.ligas.filter(l => l.id !== id),
        ligaActual: prev.ligaActual?.id === id ? null : prev.ligaActual,
        loading: false
      }));
      
      toast.success('Liga eliminada exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Error al eliminar liga');
      return false;
    }
  }, [handleError]);

  // Activar/desactivar liga
  const toggleLiga = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const ligaActualizada = await ligaService.toggleLiga(id);
      
      // Actualizar la lista local
      setState(prev => ({
        ...prev,
        ligas: prev.ligas.map(l => l.id === ligaActualizada.id ? ligaActualizada : l),
        ligaActual: prev.ligaActual?.id === ligaActualizada.id ? ligaActualizada : prev.ligaActual,
        loading: false
      }));
      
      const mensaje = ligaActualizada.activa ? 'Liga activada' : 'Liga desactivada';
      toast.success(mensaje);
      return ligaActualizada;
    } catch (error) {
      handleError(error, 'Error al cambiar estado de la liga');
      return null;
    }
  }, [handleError]);

  // Limpiar liga actual
  const clearLigaActual = useCallback(() => {
    setState(prev => ({ ...prev, ligaActual: null }));
  }, []);

  // Buscar liga por nombre
  const buscarPorNombre = useCallback((nombre: string): LigaType | undefined => {
    return state.ligas.find(liga => 
      liga.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }, [state.ligas]);

  // Filtrar ligas activas
  const getLigasActivas = useCallback((): LigaType[] => {
    return state.ligas.filter(liga => liga.activa);
  }, [state.ligas]);

  // Filtrar ligas por deporte
  const getLigasPorDeporte = useCallback((deporte: DeporteType): LigaType[] => {
    return state.ligas.filter(liga => liga.deporte.id === deporte.id);
  }, [state.ligas]);

  // Agrupar ligas por deporte
  const agruparPorDeporte = useCallback((): Record<string, LigaType[]> => {
    return state.ligas.reduce((acc, liga) => {
      const deporteNombre = liga.deporte.nombre;
      if (!acc[deporteNombre]) {
        acc[deporteNombre] = [];
      }
      acc[deporteNombre].push(liga);
      return acc;
    }, {} as Record<string, LigaType[]>);
  }, [state.ligas]);

  // Obtener deportes únicos de las ligas cargadas
  const getDeportesUnicos = useCallback((): DeporteType[] => {
    const deportesMap = new Map<number, DeporteType>();
    state.ligas.forEach(liga => {
      deportesMap.set(liga.deporte.id, liga.deporte);
    });
    return Array.from(deportesMap.values());
  }, [state.ligas]);

  return {
    // Estado
    ...state,
    
    // Acciones
    cargarLigas,
    cargarLigasActivas,
    cargarLiga,
    cargarLigasPorDeporte,
    crearLiga,
    actualizarLiga,
    eliminarLiga,
    toggleLiga,
    clearLigaActual,
    clearError,
    
    // Utilidades
    buscarPorNombre,
    getLigasActivas,
    getLigasPorDeporte,
    agruparPorDeporte,
    getDeportesUnicos
  };
};
