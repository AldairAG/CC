import { Evento } from '../../types/EventType';

const API_BASE_URL = 'http://localhost:8080/api/thesportsdb';

export const theSportsDbAPI = {
  // Buscar evento por equipos
  buscarEventoPorEquipos: async (equipoLocal: string, equipoVisitante: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/eventos/buscar-por-equipos?equipoLocal=${encodeURIComponent(equipoLocal)}&equipoVisitante=${encodeURIComponent(equipoVisitante)}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json() as Evento;
    } catch (error) {
      console.error('Error al buscar evento por equipos:', error);
      throw error;
    }
  },

  // Buscar eventos por fecha
  buscarEventosPorFecha: async (fecha: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/eventos/buscar-por-fecha?fecha=${fecha}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json() as Evento[];
    } catch (error) {
      console.error('Error al buscar eventos por fecha:', error);
      throw error;
    }
  },

  // Buscar evento por ID externo
  buscarEventoPorId: async (idEventoExterno: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/eventos/buscar-por-id/${encodeURIComponent(idEventoExterno)}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json() as Evento;
    } catch (error) {
      console.error('Error al buscar evento por ID:', error);
      throw error;
    }
  },

  // Probar conectividad
  testConectividad: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al probar conectividad:', error);
      throw error;
    }
  },

  // Obtener información de la API
  obtenerInformacion: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/info`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener información:', error);
      throw error;
    }
  }
};
