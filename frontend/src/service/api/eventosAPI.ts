import { apiClient } from '../casino/ApiCliente';

export interface EventoResponse {
  idEvento: number;
  equipoLocal: string;
  equipoVisitante: string;
  fechaPartido: string;
  nombreEvento?: string;
  liga?: string;
  deporte?: string;
  estadio?: string;
  resultadoLocal?: number;
  resultadoVisitante?: number;
  estado?: string;
  idExterno?: string;
}

export interface SincronizacionResponse {
  mensaje: string;
  eventosNuevos: number;
  eventos: EventoResponse[];
}

export const eventosAPI = {
  // Obtener todos los eventos
  obtenerTodos: async (): Promise<EventoResponse[]> => {
    const response = await apiClient.get('/eventos');
    return response.data;
  },

  // Obtener evento por ID
  obtenerPorId: async (id: number): Promise<EventoResponse> => {
    const response = await apiClient.get(`/eventos/${id}`);
    return response.data;
  },

  // Buscar o crear evento por equipos (integración con TheSportsDB)
  buscarOCrearEvento: async (equipoLocal: string, equipoVisitante: string): Promise<EventoResponse> => {
    const response = await apiClient.get('/eventos/buscar', {
      params: {
        equipoLocal,
        equipoVisitante
      }
    });
    return response.data;
  },

  // Sincronizar eventos por fecha desde TheSportsDB (solo admin)
  sincronizarEventosPorFecha: async (fecha: string): Promise<SincronizacionResponse> => {
    const response = await apiClient.post('/eventos/sincronizar', null, {
      params: {
        fecha
      }
    });
    return response.data;
  },

  // Obtener eventos por fecha
  obtenerPorFecha: async (fecha: string): Promise<EventoResponse[]> => {
    const response = await apiClient.get(`/eventos/fecha/${fecha}`);
    return response.data;
  },

  // Crear evento manualmente (solo admin)
  crearEvento: async (evento: Partial<EventoResponse>): Promise<EventoResponse> => {
    const response = await apiClient.post('/eventos', evento);
    return response.data;
  }
};
