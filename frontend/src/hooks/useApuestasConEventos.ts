import { useState, useCallback } from 'react';
import { apuestasAPI, type CrearApuestaRequest, type ApuestaResponse } from '../service/api/apuestasAPI';

export const useApuestas = () => {
  const [apuestas, setApuestas] = useState<ApuestaResponse[]>([]);
  const [apuesta, setApuesta] = useState<ApuestaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearApuesta = useCallback(async (request: CrearApuestaRequest): Promise<ApuestaResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const nuevaApuesta = await apuestasAPI.crearApuesta(request);
      setApuesta(nuevaApuesta);
      // Actualizar lista si existe
      setApuestas(prev => [nuevaApuesta, ...prev]);
      return nuevaApuesta;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMessage = error?.response?.data?.error || 'Error al crear apuesta';
      setError(errorMessage);
      console.error('Error al crear apuesta:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerMisApuestas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apuestasAPI.obtenerMisApuestas();
      setApuestas(data);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error?.response?.data?.error || 'Error al obtener apuestas');
      console.error('Error al obtener apuestas:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerApuestaPorId = useCallback(async (idApuesta: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apuestasAPI.obtenerApuestaPorId(idApuesta);
      setApuesta(data);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error?.response?.data?.error || 'Error al obtener apuesta');
      console.error('Error al obtener apuesta:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelarApuesta = useCallback(async (idApuesta: number, motivo?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apuestasAPI.cancelarApuesta(idApuesta, motivo);
      // Actualizar la apuesta en la lista
      setApuestas(prev => prev.map(apuesta => 
        apuesta.idApuesta === idApuesta 
          ? { ...apuesta, estadoApuesta: 'CANCELADA', estadoApuestaDescripcion: 'Cancelada' }
          : apuesta
      ));
      return result;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error?.response?.data?.error || 'Error al cancelar apuesta');
      console.error('Error al cancelar apuesta:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const calcularGanancia = useCallback(async (monto: number, cuota: number) => {
    try {
      const result = await apuestasAPI.calcularGanancia(monto, cuota);
      return result.gananciaPotencial;
    } catch (err: unknown) {
      console.error('Error al calcular ganancia:', err);
      return monto * cuota; // Cálculo básico como fallback
    }
  }, []);

  const validarApuesta = useCallback(async (idEvento: number, monto: number, tipoApuesta: string) => {
    try {
      return await apuestasAPI.validarApuesta(idEvento, monto, tipoApuesta);
    } catch (err: unknown) {
      console.error('Error al validar apuesta:', err);
      return { puedeApostar: false, error: 'Error de validación' };
    }
  }, []);

  const obtenerEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apuestasAPI.obtenerEstadisticas();
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error?.response?.data?.error || 'Error al obtener estadísticas');
      console.error('Error al obtener estadísticas:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función auxiliar para crear apuesta con evento automático
  const crearApuestaConEvento = useCallback(async (
    equipoLocal: string,
    equipoVisitante: string,
    tipoApuesta: string,
    montoApuesta: number,
    cuotaApuesta: number,
    prediccionUsuario: string,
    detalleApuesta?: string,
    idEventoExterno?: string,
    fechaEvento?: string
  ) => {
    const request: CrearApuestaRequest = {
      equipoLocal,
      equipoVisitante,
      tipoApuesta,
      montoApuesta,
      cuotaApuesta,
      prediccionUsuario,
      detalleApuesta,
      idEventoExterno,
      fechaEvento
    };

    return await crearApuesta(request);
  }, [crearApuesta]);

  return {
    apuestas,
    apuesta,
    loading,
    error,
    crearApuesta,
    crearApuestaConEvento,
    obtenerMisApuestas,
    obtenerApuestaPorId,
    cancelarApuesta,
    calcularGanancia,
    validarApuesta,
    obtenerEstadisticas,
    setError: (error: string | null) => setError(error)
  };
};
