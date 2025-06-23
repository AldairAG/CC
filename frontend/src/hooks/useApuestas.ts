import { useState, useCallback } from 'react';
import { apuestaService, type ApuestaResponse, type EstadisticasApuestaResponse, type CrearApuestaRequest, type CuotaEventoResponse } from '../service/casino/apuestaService';

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export const useApuestas = () => {
  const [apuestas, setApuestas] = useState<ApuestaResponse[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasApuestaResponse | null>(null);
  const [cuotasEvento, setCuotasEvento] = useState<CuotaEventoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Crear nueva apuesta
  const crearApuesta = useCallback(async (apuestaData: CrearApuestaRequest): Promise<ApuestaResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);      
      
      const nuevaApuesta = await apuestaService.crearApuesta(apuestaData);
      
      // Actualizar la lista de apuestas
      setApuestas(prev => [nuevaApuesta, ...prev]);
        return nuevaApuesta;
    } catch (err: unknown) { 
      const errorMessage = (err as ApiError).response?.data?.error || 'Error al crear la apuesta';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener mis apuestas
  const obtenerMisApuestas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apuestasData = await apuestaService.obtenerMisApuestas();
      setApuestas(apuestasData);
      
      return apuestasData;    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.error || 'Error al obtener las apuestas';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cancelar apuesta
  const cancelarApuesta = useCallback(async (idApuesta: number, motivo?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const exito = await apuestaService.cancelarApuesta(idApuesta, motivo);
      
      if (exito) {
        // Actualizar el estado local
        setApuestas(prev => 
          prev.map(apuesta => 
            apuesta.idApuesta === idApuesta 
              ? { ...apuesta, estadoApuesta: 'CANCELADA', estadoApuestaDescripcion: 'Cancelada' }
              : apuesta
          )
        );
      }
        return exito;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.error || 'Error al cancelar la apuesta';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener estadísticas
  const obtenerEstadisticas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const estadisticasData = await apuestaService.obtenerEstadisticas();
      setEstadisticas(estadisticasData);
      
      return estadisticasData;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.error || 'Error al obtener las estadísticas';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener cuotas de un evento
  const obtenerCuotasEvento = useCallback(async (idEvento: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const cuotas = await apuestaService.obtenerCuotasEvento(idEvento);
      setCuotasEvento(cuotas);
      
      return cuotas;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.error || 'Error al obtener las cuotas';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validar apuesta
  const validarApuesta = useCallback(async (idEvento: number, monto: number, tipoApuesta: string) => {
    try {
      setError(null);
      
      const validacion = await apuestaService.validarApuesta(idEvento, monto, tipoApuesta);
      return validacion;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.error || 'Error al validar la apuesta';
      setError(errorMessage);
      return {
        puedeApostar: false,
        saldoSuficiente: false,
        dentroLimite: false,
        eventoAbierto: false,
        noEsDuplicada: false
      };
    }
  }, []);

  // Calcular ganancia potencial
  const calcularGanancia = useCallback((monto: number, cuota: number): number => {
    return apuestaService.calcularGananciaLocal(monto, cuota);
  }, []);

  // Formatear estado de apuesta
  const formatearEstado = useCallback((estado: string): string => {
    return apuestaService.formatearEstadoApuesta(estado);
  }, []);

  // Formatear tipo de apuesta
  const formatearTipo = useCallback((tipo: string): string => {
    return apuestaService.formatearTipoApuesta(tipo);
  }, []);

  // Filtrar apuestas por estado
  const filtrarApuestasPorEstado = useCallback((estado: string) => {
    return apuestas.filter(apuesta => apuesta.estadoApuesta === estado);
  }, [apuestas]);

  // Obtener apuesta por ID
  const obtenerApuestaPorId = useCallback(async (idApuesta: number): Promise<ApuestaResponse | null> => {
    try {
      setError(null);      const apuesta = await apuestaService.obtenerApuestaPorId(idApuesta);
      return apuesta;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.error || 'Error al obtener la apuesta';
      setError(errorMessage);
      return null;
    }
  }, []);

  return {
    // Estado
    apuestas,
    estadisticas,
    cuotasEvento,
    isLoading,
    error,
    
    // Acciones
    crearApuesta,
    obtenerMisApuestas,
    cancelarApuesta,
    obtenerEstadisticas,
    obtenerCuotasEvento,
    validarApuesta,
    obtenerApuestaPorId,
    clearError,
    
    // Utilidades
    calcularGanancia,
    formatearEstado,
    formatearTipo,
    filtrarApuestasPorEstado,
    
    // Getters calculados
    apuestasPendientes: filtrarApuestasPorEstado('PENDIENTE'),
    apuestasGanadas: filtrarApuestasPorEstado('GANADA'),
    apuestasPerdidas: filtrarApuestasPorEstado('PERDIDA'),
    apuestasCanceladas: filtrarApuestasPorEstado('CANCELADA'),
  };
};
