import { apiClient } from "./ApiCliente";
import type { QuinielaType } from "../../types/QuinielaType";

const BASE_URL = "/quinielas";

/**
 * Servicio para gestionar las operaciones relacionadas con quinielas
 */
export const QuinielaService = {
  /**
   * Crea una nueva quiniela
   * @param quiniela Datos de la quiniela a crear
   * @returns La quiniela creada con su ID asignado
   */
  crearQuiniela: async (quiniela: Omit<QuinielaType, "idQuiniela">): Promise<QuinielaType> => {
    const response = await apiClient.post<QuinielaType>(BASE_URL, quiniela);
    return response.data;
  },

  /**
   * Actualiza una quiniela existente
   * @param id ID de la quiniela a actualizar
   * @param quiniela Datos actualizados de la quiniela
   * @returns La quiniela actualizada
   */
  actualizarQuiniela: async (id: number, quiniela: Partial<QuinielaType>): Promise<QuinielaType> => {
    const quinielaConId = { ...quiniela, idQuiniela: id };
    const response = await apiClient.put<QuinielaType>(`${BASE_URL}/${id}`, quinielaConId);
    return response.data;
  },

  /**
   * Elimina una quiniela del sistema
   * @param id ID de la quiniela a eliminar
   */
  eliminarQuiniela: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Obtiene una quiniela por su ID
   * @param id ID de la quiniela a buscar
   * @returns La quiniela encontrada
   */
  getQuinielaById: async (id: number): Promise<QuinielaType> => {
    const response = await apiClient.get<QuinielaType>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Obtiene todas las quinielas registradas en el sistema
   * @returns Lista de todas las quinielas
   */
  getAllQuinielas: async (): Promise<QuinielaType[]> => {
    const response = await apiClient.get<QuinielaType[]>(BASE_URL);
    return response.data;
  },

  /**
   * Obtiene quinielas por estado
   * @param estado Estado de las quinielas a buscar
   * @returns Lista de quinielas con el estado especificado
   */
  getQuinielasByEstado: async (estado: string): Promise<QuinielaType[]> => {
    const response = await apiClient.get<QuinielaType[]>(`${BASE_URL}/estado/${encodeURIComponent(estado)}`);
    return response.data;
  },

  /**
   * Obtiene quinielas entre dos fechas
   * @param fechaInicio Fecha de inicio en formato yyyy-MM-dd
   * @param fechaFin Fecha de fin en formato yyyy-MM-dd
   * @returns Lista de quinielas dentro del rango de fechas
   */
  getQuinielasByFechas: async (fechaInicio: string, fechaFin: string): Promise<QuinielaType[]> => {
    const response = await apiClient.get<QuinielaType[]>(
      `${BASE_URL}/fechas?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`
    );
    return response.data;
  },

  /**
   * Obtiene quinielas con precio de participación menor o igual al precio dado
   * @param precio Precio máximo de participación
   * @returns Lista de quinielas con precio de participación dentro del límite
   */
  getQuinielasByPrecioMaximo: async (precio: number): Promise<QuinielaType[]> => {
    const response = await apiClient.get<QuinielaType[]>(`${BASE_URL}/precio/${precio}`);
    return response.data;
  },

  /**
   * Actualiza el premio acumulado de una quiniela
   * @param id ID de la quiniela
   * @param nuevoPremio Nuevo valor del premio acumulado
   */
  actualizarPremio: async (id: number, nuevoPremio: number): Promise<void> => {
    await apiClient.put(`${BASE_URL}/${id}/premio?nuevoPremio=${nuevoPremio}`);
  },

  /**
   * Actualiza el estado de una quiniela
   * @param id ID de la quiniela
   * @param nuevoEstado Nuevo estado de la quiniela
   */
  actualizarEstado: async (id: number, nuevoEstado: string): Promise<void> => {
    await apiClient.put(`${BASE_URL}/${id}/estado?nuevoEstado=${encodeURIComponent(nuevoEstado)}`);
  }
};

export default QuinielaService;