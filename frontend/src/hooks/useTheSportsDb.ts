import { useState } from 'react';
import { theSportsDbAPI } from '../service/api/theSportsDbAPI';
import type { Evento } from '../types/EventType';

interface TestResult {
  status: string;
  message: string;
  eventosEncontrados?: number;
  fecha?: string;
  timestamp: number;
}

interface ApiInfo {
  apiName: string;
  version: string;
  endpoints: string[];
  description: string;
  baseUrl: string;
  timestamp: number;
}

export const useTheSportsDb = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarEventoPorEquipos = async (equipoLocal: string, equipoVisitante: string): Promise<Evento | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const evento = await theSportsDbAPI.buscarEventoPorEquipos(equipoLocal, equipoVisitante);
      return evento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al buscar evento por equipos:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buscarEventosPorFecha = async (fecha: string): Promise<Evento[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const eventos = await theSportsDbAPI.buscarEventosPorFecha(fecha);
      return eventos || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al buscar eventos por fecha:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const buscarEventoPorId = async (idEventoExterno: string): Promise<Evento | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const evento = await theSportsDbAPI.buscarEventoPorId(idEventoExterno);
      return evento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al buscar evento por ID:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const testConectividad = async (): Promise<TestResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await theSportsDbAPI.testConectividad();
      return resultado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al probar conectividad:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const obtenerInformacion = async (): Promise<ApiInfo | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const informacion = await theSportsDbAPI.obtenerInformacion();
      return informacion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al obtener información:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    buscarEventoPorEquipos,
    buscarEventosPorFecha,
    buscarEventoPorId,
    testConectividad,
    obtenerInformacion,
    clearError
  };
};
