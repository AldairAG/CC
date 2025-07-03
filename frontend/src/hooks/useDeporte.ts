import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { deporteService } from '../service/api/deporteLigaService';
import type { DeporteType, CrearDeporteRequest, ActualizarDeporteRequest } from '../types/DeporteLigaTypes';

export interface UseDeporteState {
  deportes: DeporteType[];
  deporteActual: DeporteType | null;
  loading: boolean;
  error: string | null;
}

export const useDeporte = () => {
  const [state, setState] = useState<UseDeporteState>({
    deportes: [],
    deporteActual: null,
    loading: false,
    error: null
  });

  // Función auxiliar para manejar errores
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Error en useDeporte:', error);
    
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

  // Cargar todos los deportes
  const cargarDeportes = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const deportes = await deporteService.getAllDeportes();
      setState(prev => ({ ...prev, deportes, loading: false }));
      return deportes;
    } catch (error) {
      handleError(error, 'Error al cargar deportes');
      return [];
    }
  }, [handleError]);

  // Cargar deportes activos
  const cargarDeportesActivos = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const deportes = await deporteService.getDeportesActivos();
      setState(prev => ({ ...prev, deportes, loading: false }));
      return deportes;
    } catch (error) {
      handleError(error, 'Error al cargar deportes activos');
      return [];
    }
  }, [handleError]);

  // Cargar deporte por ID
  const cargarDeporte = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const deporte = await deporteService.getDeporteById(id);
      setState(prev => ({ ...prev, deporteActual: deporte, loading: false }));
      return deporte;
    } catch (error) {
      handleError(error, `Error al cargar deporte con ID: ${id}`);
      return null;
    }
  }, [handleError]);

  // Crear nuevo deporte
  const crearDeporte = useCallback(async (deporteData: CrearDeporteRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const nuevoDeporte = await deporteService.crearDeporte(deporteData);
      
      // Actualizar la lista local
      setState(prev => ({
        ...prev,
        deportes: [...prev.deportes, nuevoDeporte],
        deporteActual: nuevoDeporte,
        loading: false
      }));
      
      toast.success('Deporte creado exitosamente');
      return nuevoDeporte;
    } catch (error) {
      handleError(error, 'Error al crear deporte');
      return null;
    }
  }, [handleError]);

  // Actualizar deporte
  const actualizarDeporte = useCallback(async (deporteData: ActualizarDeporteRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const deporteActualizado = await deporteService.actualizarDeporte(deporteData);
      
      // Actualizar la lista local
      setState(prev => ({
        ...prev,
        deportes: prev.deportes.map(d => d.id === deporteActualizado.id ? deporteActualizado : d),
        deporteActual: prev.deporteActual?.id === deporteActualizado.id ? deporteActualizado : prev.deporteActual,
        loading: false
      }));
      
      toast.success('Deporte actualizado exitosamente');
      return deporteActualizado;
    } catch (error) {
      handleError(error, 'Error al actualizar deporte');
      return null;
    }
  }, [handleError]);

  // Eliminar deporte
  const eliminarDeporte = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await deporteService.eliminarDeporte(id);
      
      // Actualizar la lista local
      setState(prev => ({
        ...prev,
        deportes: prev.deportes.filter(d => d.id !== id),
        deporteActual: prev.deporteActual?.id === id ? null : prev.deporteActual,
        loading: false
      }));
      
      toast.success('Deporte eliminado exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Error al eliminar deporte');
      return false;
    }
  }, [handleError]);

  // Activar/desactivar deporte
  const toggleDeporte = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const deporteActualizado = await deporteService.toggleDeporte(id);
      
      // Actualizar la lista local
      setState(prev => ({
        ...prev,
        deportes: prev.deportes.map(d => d.id === deporteActualizado.id ? deporteActualizado : d),
        deporteActual: prev.deporteActual?.id === deporteActualizado.id ? deporteActualizado : prev.deporteActual,
        loading: false
      }));
      
      const mensaje = deporteActualizado.activo ? 'Deporte activado' : 'Deporte desactivado';
      toast.success(mensaje);
      return deporteActualizado;
    } catch (error) {
      handleError(error, 'Error al cambiar estado del deporte');
      return null;
    }
  }, [handleError]);

  // Limpiar deporte actual
  const clearDeporteActual = useCallback(() => {
    setState(prev => ({ ...prev, deporteActual: null }));
  }, []);

  // Buscar deporte por nombre
  const buscarPorNombre = useCallback((nombre: string): DeporteType | undefined => {
    return state.deportes.find(deporte => 
      deporte.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }, [state.deportes]);

  // Filtrar deportes activos
  const getDeportesActivos = useCallback((): DeporteType[] => {
    return state.deportes.filter(deporte => deporte.activo);
  }, [state.deportes]);

  return {
    // Estado
    ...state,
    
    // Acciones
    cargarDeportes,
    cargarDeportesActivos,
    cargarDeporte,
    crearDeporte,
    actualizarDeporte,
    eliminarDeporte,
    toggleDeporte,
    clearDeporteActual,
    clearError,
    
    // Utilidades
    buscarPorNombre,
    getDeportesActivos
  };
};
