import { useState, useCallback } from 'react';
import { eventosAPI, type EventoResponse, type SincronizacionResponse } from '../service/api/eventosAPI';

export const useEventos = () => {
  const [eventos, setEventos] = useState<EventoResponse[]>([]);
  const [evento, setEvento] = useState<EventoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerTodosLosEventos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventosAPI.obtenerTodos();
      setEventos(data);    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error?.response?.data?.error || 'Error al obtener eventos');
      console.error('Error al obtener eventos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerEventoPorId = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventosAPI.obtenerPorId(id);
      setEvento(data);
      return data;    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error?.response?.data?.error || 'Error al obtener evento');
      console.error('Error al obtener evento:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarOCrearEvento = useCallback(async (equipoLocal: string, equipoVisitante: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventosAPI.buscarOCrearEvento(equipoLocal, equipoVisitante);
      setEvento(data);
      return data;    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string; error?: string } } };
      const errorMessage = error?.response?.data?.mensaje || error?.response?.data?.error || 'Error al buscar evento';
      setError(errorMessage);
      console.error('Error al buscar evento:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const sincronizarEventos = useCallback(async (fecha: string): Promise<SincronizacionResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventosAPI.sincronizarEventosPorFecha(fecha);
      // Actualizar la lista de eventos después de la sincronización
      await obtenerTodosLosEventos();
      return data;    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMessage = error?.response?.data?.error || 'Error al sincronizar eventos';
      setError(errorMessage);
      console.error('Error al sincronizar eventos:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [obtenerTodosLosEventos]);

  const obtenerEventosPorFecha = useCallback(async (fecha: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventosAPI.obtenerPorFecha(fecha);
      setEventos(data);
      return data;    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error?.response?.data?.error || 'Error al obtener eventos por fecha');
      console.error('Error al obtener eventos por fecha:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const crearEvento = useCallback(async (eventoData: Partial<EventoResponse>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventosAPI.crearEvento(eventoData);
      // Actualizar la lista de eventos después de crear
      await obtenerTodosLosEventos();
      return data;    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error?.response?.data?.error || 'Error al crear evento');
      console.error('Error al crear evento:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [obtenerTodosLosEventos]);

  return {
    eventos,
    evento,
    loading,
    error,
    obtenerTodosLosEventos,
    obtenerEventoPorId,
    buscarOCrearEvento,
    sincronizarEventos,
    obtenerEventosPorFecha,
    crearEvento,
    setError: (error: string | null) => setError(error)
  };
};
