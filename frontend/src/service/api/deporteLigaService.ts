import axios from 'axios';
import type { DeporteType, LigaType, CrearDeporteRequest, ActualizarDeporteRequest, CrearLigaRequest, ActualizarLigaRequest } from '../../types/DeporteLigaTypes';

// Cliente base para nuestro backend
const backendClient = axios.create({
  baseURL: 'http://localhost:8080/cc', // Ajustar según la configuración del backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio para Deportes
export const deporteService = {
  // Obtener todos los deportes
  getAllDeportes: async (): Promise<DeporteType[]> => {
    const response = await backendClient.get<DeporteType[]>('/deportes');
    return response.data;
  },

  // Obtener deportes activos
  getDeportesActivos: async (): Promise<DeporteType[]> => {
    const response = await backendClient.get<DeporteType[]>('/deportes/activos');
    return response.data;
  },

  // Obtener deporte por ID
  getDeporteById: async (id: number): Promise<DeporteType> => {
    const response = await backendClient.get<DeporteType>(`/deportes/${id}`);
    return response.data;
  },

  // Crear nuevo deporte
  crearDeporte: async (deporte: CrearDeporteRequest): Promise<DeporteType> => {
    const response = await backendClient.post<DeporteType>('/deportes', deporte);
    return response.data;
  },

  // Actualizar deporte
  actualizarDeporte: async (deporte: ActualizarDeporteRequest): Promise<DeporteType> => {
    const response = await backendClient.put<DeporteType>(`/deportes/${deporte.id}`, deporte);
    return response.data;
  },

  // Eliminar deporte
  eliminarDeporte: async (id: number): Promise<void> => {
    await backendClient.delete(`/deportes/${id}`);
  },

  // Activar/desactivar deporte
  toggleDeporte: async (id: number): Promise<DeporteType> => {
    const response = await backendClient.patch<DeporteType>(`/deportes/${id}/toggle`);
    return response.data;
  }
};

// Servicio para Ligas
export const ligaService = {
  // Obtener todas las ligas
  getAllLigas: async (): Promise<LigaType[]> => {
    const response = await backendClient.get<LigaType[]>('/ligas');
    return response.data;
  },

  // Obtener ligas activas
  getLigasActivas: async (): Promise<LigaType[]> => {
    const response = await backendClient.get<LigaType[]>('/ligas/activas');
    return response.data;
  },

  // Obtener liga por ID
  getLigaById: async (id: number): Promise<LigaType> => {
    const response = await backendClient.get<LigaType>(`/ligas/${id}`);
    return response.data;
  },

  // Obtener ligas por deporte
  getLigasByDeporte: async (deporteId: number): Promise<LigaType[]> => {
    const response = await backendClient.get<LigaType[]>(`/ligas/deporte/${deporteId}`);
    return response.data;
  },

  // Crear nueva liga
  crearLiga: async (liga: CrearLigaRequest): Promise<LigaType> => {
    const response = await backendClient.post<LigaType>('/ligas', liga);
    return response.data;
  },

  // Actualizar liga
  actualizarLiga: async (liga: ActualizarLigaRequest): Promise<LigaType> => {
    const response = await backendClient.put<LigaType>(`/ligas/${liga.id}`, liga);
    return response.data;
  },

  // Eliminar liga
  eliminarLiga: async (id: number): Promise<void> => {
    await backendClient.delete(`/ligas/${id}`);
  },

  // Activar/desactivar liga
  toggleLiga: async (id: number): Promise<LigaType> => {
    const response = await backendClient.patch<LigaType>(`/ligas/${id}/toggle`);
    return response.data;
  }
};

export default backendClient;
