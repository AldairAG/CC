import axios from 'axios';
import type { EventoDeportivoType } from '../../types/EventoDeportivoTypes';
import type { DeporteType, LigaType, FiltrosEventoDeportivo, EstadisticasEventos } from '../../types/DeporteLigaTypes';

// Cliente base para nuestro backend
const backendClient = axios.create({
  baseURL: 'http://localhost:8080/cc/eventos-deportivos',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventoDeportivoService = {
  // Obtener eventos con filtros
  getEventos: async (filtros?: FiltrosEventoDeportivo): Promise<EventoDeportivoType[]> => {
    const params = new URLSearchParams();
    
    if (filtros?.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros?.fechaFin) params.append('fechaFin', filtros.fechaFin);
    if (filtros?.deporteNombre) params.append('deporteNombre', filtros.deporteNombre);
    if (filtros?.ligaNombre) params.append('ligaNombre', filtros.ligaNombre);
    
    const url = params.toString() ? `?${params.toString()}` : '';
    const response = await backendClient.get<EventoDeportivoType[]>(`/${url}`);
    return response.data;
  },

  // Obtener eventos próximos (siguientes 7 días)
  getEventosProximos: async (): Promise<EventoDeportivoType[]> => {
    const response = await backendClient.get<EventoDeportivoType[]>('/proximos');
    return response.data;
  },

  // Obtener eventos por deporte (usando nombre del deporte)
  getEventosPorDeporte: async (deporteNombre: string): Promise<EventoDeportivoType[]> => {
    const response = await backendClient.get<EventoDeportivoType[]>(`/deporte/${encodeURIComponent(deporteNombre)}`);
    return response.data;
  },

  // Obtener eventos por liga (usando nombre de la liga)
  getEventosPorLiga: async (ligaNombre: string): Promise<EventoDeportivoType[]> => {
    const response = await backendClient.get<EventoDeportivoType[]>(`/liga/${encodeURIComponent(ligaNombre)}`);
    return response.data;
  },

  // Obtener todos los deportes disponibles
  getDeportes: async (): Promise<DeporteType[]> => {
    const response = await backendClient.get<DeporteType[]>('/deportes');
    return response.data;
  },

  // Obtener todas las ligas disponibles
  getLigas: async (): Promise<LigaType[]> => {
    const response = await backendClient.get<LigaType[]>('/ligas');
    return response.data;
  },

  // Obtener ligas por deporte
  getLigasPorDeporte: async (deporteNombre: string): Promise<LigaType[]> => {
    const response = await backendClient.get<LigaType[]>(`/deportes/${encodeURIComponent(deporteNombre)}/ligas`);
    return response.data;
  },

  // Obtener estadísticas de eventos
  getEstadisticas: async (): Promise<EstadisticasEventos> => {
    const response = await backendClient.get<EstadisticasEventos>('/estadisticas');
    return response.data;
  },

  // Forzar sincronización manual
  forzarSincronizacion: async (): Promise<{ status: string; message: string }> => {
    const response = await backendClient.post<{ status: string; message: string }>('/sincronizar');
    return response.data;
  },

  // Limpiar eventos antiguos
  limpiarEventosAntiguos: async (): Promise<{ status: string; message: string }> => {
    const response = await backendClient.delete<{ status: string; message: string }>('/limpiar-antiguos');
    return response.data;
  }
};

// Funciones de utilidad para trabajar con los datos
export const eventoUtils = {
  // Extraer nombres únicos de deportes de una lista de eventos
  getDeportesUnicos: (eventos: EventoDeportivoType[]): string[] => {
    const deportes = eventos.map(evento => evento.deporte.nombre);
    return [...new Set(deportes)].sort();
  },

  // Extraer nombres únicos de ligas de una lista de eventos
  getLigasUnicas: (eventos: EventoDeportivoType[]): string[] => {
    const ligas = eventos.map(evento => evento.liga.nombre);
    return [...new Set(ligas)].sort();
  },

  // Filtrar eventos por deporte
  filtrarPorDeporte: (eventos: EventoDeportivoType[], deporteNombre: string): EventoDeportivoType[] => {
    return eventos.filter(evento => evento.deporte.nombre === deporteNombre);
  },

  // Filtrar eventos por liga
  filtrarPorLiga: (eventos: EventoDeportivoType[], ligaNombre: string): EventoDeportivoType[] => {
    return eventos.filter(evento => evento.liga.nombre === ligaNombre);
  },

  // Filtrar eventos por estado
  filtrarPorEstado: (eventos: EventoDeportivoType[], estado: string): EventoDeportivoType[] => {
    return eventos.filter(evento => evento.estado === estado);
  },

  // Agrupar eventos por deporte
  agruparPorDeporte: (eventos: EventoDeportivoType[]): Record<string, EventoDeportivoType[]> => {
    return eventos.reduce((acc, evento) => {
      const deporte = evento.deporte.nombre;
      if (!acc[deporte]) {
        acc[deporte] = [];
      }
      acc[deporte].push(evento);
      return acc;
    }, {} as Record<string, EventoDeportivoType[]>);
  },

  // Agrupar eventos por liga
  agruparPorLiga: (eventos: EventoDeportivoType[]): Record<string, EventoDeportivoType[]> => {
    return eventos.reduce((acc, evento) => {
      const liga = evento.liga.nombre;
      if (!acc[liga]) {
        acc[liga] = [];
      }
      acc[liga].push(evento);
      return acc;
    }, {} as Record<string, EventoDeportivoType[]>);
  }
};

export default eventoDeportivoService;
