import { apiClient } from "./ApiCliente";
import type { QuinielaType } from "../../types/QuinielaType";
import type {
  CrearQuinielaRequest,
  UnirseQuinielaRequest,
  HacerPrediccionesRequest,
  QuinielaResponse,
  ParticipacionQuiniela,
  EstadisticasQuinielaResponse,
  FiltrosBusquedaAvanzada
} from "../../types/QuinielaServiceTypes";

const BASE_URL = "/quinielas";

/**
 * Servicio para gestionar las operaciones relacionadas con quinielas
 * Conecta con QuinielaController del backend
 */
export const QuinielaService = {
  // =================== ENDPOINTS PRINCIPALES ===================
    /**
   * Crea una nueva quiniela
   * POST /cc/quinielas/crear
   * @param request Datos de la quiniela a crear
   * @returns La quiniela creada con su ID asignado
   */
  crearQuiniela: async (request: CrearQuinielaRequest): Promise<QuinielaResponse> => {
    console.log("Creando quiniela con datos:", request);
    
    const response = await apiClient.post<QuinielaResponse>(`${BASE_URL}/crear`, request, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  /**
   * Unirse a una quiniela existente
   * POST /cc/quinielas/unirse
   * @param request Datos para unirse a la quiniela
   * @returns Información de la participación
   */
  unirseQuiniela: async (request: UnirseQuinielaRequest): Promise<ParticipacionQuiniela> => {
    const response = await apiClient.post<ParticipacionQuiniela>(`${BASE_URL}/unirse`, request, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  /**
   * Hacer predicciones en una quiniela
   * POST /cc/quinielas/predicciones
   * @param request Datos de las predicciones
   * @returns Mensaje de confirmación
   */
  hacerPredicciones: async (request: HacerPrediccionesRequest): Promise<string> => {
    const response = await apiClient.post<string>(`${BASE_URL}/predicciones`, request, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  /**
   * Distribuir premios de una quiniela
   * POST /cc/quinielas/distribuir-premios/{quinielaId}
   * @param quinielaId ID de la quiniela
   * @returns Mensaje de confirmación
   */
  distribuirPremios: async (quinielaId: number): Promise<string> => {
    const response = await apiClient.post<string>(`${BASE_URL}/distribuir-premios/${quinielaId}`, {}, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  /**
   * Obtiene todas las quinielas públicas
   * GET /cc/quinielas/publicas
   * @returns Lista de quinielas públicas
   */
  obtenerQuinielasPublicas: async (): Promise<QuinielaResponse[]> => {
    const response = await apiClient.get<QuinielaResponse[]>(`${BASE_URL}/publicas`);
    return response.data;
  },

  /**
   * Obtiene las quinielas creadas por el usuario
   * GET /cc/quinielas/mis-quinielas
   * @returns Lista de mis quinielas
   */
  obtenerMisQuinielas: async (): Promise<QuinielaResponse[]> => {
    const response = await apiClient.get<QuinielaResponse[]>(`${BASE_URL}/mis-quinielas`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  /**
   * Obtiene las quinielas en las que participa el usuario
   * GET /cc/quinielas/mis-participaciones
   * @returns Lista de participaciones
   */
  obtenerMisParticipaciones: async (): Promise<QuinielaResponse[]> => {
    const response = await apiClient.get<QuinielaResponse[]>(`${BASE_URL}/mis-participaciones`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  /**
   * Obtiene una quiniela por su ID
   * GET /cc/quinielas/{id}
   * @param id ID de la quiniela a buscar
   * @returns La quiniela encontrada
   */
  obtenerQuinielaPorId: async (id: number): Promise<QuinielaResponse> => {
    const response = await apiClient.get<QuinielaResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },
  // =================== ENDPOINTS DE FILTRADO ===================

  /**
   * Obtiene quinielas por estado
   * GET /cc/quinielas/filtrar/estado/{estado}
   * @param estado Estado de las quinielas a buscar
   * @returns Lista de quinielas con el estado especificado
   */
  obtenerQuinielasPorEstado: async (estado: string): Promise<QuinielaResponse[]> => {
    const response = await apiClient.get<QuinielaResponse[]>(`${BASE_URL}/filtrar/estado/${encodeURIComponent(estado)}`);
    return response.data;
  },

  /**
   * Obtiene quinielas con precio máximo
   * GET /cc/quinielas/filtrar/precio-maximo?precioMaximo={precio}
   * @param precioMaximo Precio máximo de participación
   * @returns Lista de quinielas con precio dentro del límite
   */
  obtenerQuinielasPorPrecioMaximo: async (precioMaximo: number): Promise<QuinielaResponse[]> => {
    const response = await apiClient.get<QuinielaResponse[]>(`${BASE_URL}/filtrar/precio-maximo?precioMaximo=${precioMaximo}`);
    return response.data;
  },

  /**
   * Obtiene quinielas por tipo de premio
   * GET /cc/quinielas/filtrar/tipo-premio/{tipoPremio}
   * @param tipoPremio Tipo de premio de las quinielas
   * @returns Lista de quinielas con el tipo de premio especificado
   */
  obtenerQuinielasPorTipoPremio: async (tipoPremio: string): Promise<QuinielaResponse[]> => {
    const response = await apiClient.get<QuinielaResponse[]>(`${BASE_URL}/filtrar/tipo-premio/${encodeURIComponent(tipoPremio)}`);
    return response.data;
  },

  /**
   * Obtiene quinielas entre dos fechas
   * GET /cc/quinielas/filtrar/fecha-rango?fechaInicio={fecha}&fechaFin={fecha}
   * @param fechaInicio Fecha de inicio en formato yyyy-MM-dd
   * @param fechaFin Fecha de fin en formato yyyy-MM-dd
   * @returns Lista de quinielas dentro del rango de fechas
   */
  obtenerQuinielasPorRangoFecha: async (fechaInicio: string, fechaFin: string): Promise<QuinielaResponse[]> => {
    const response = await apiClient.get<QuinielaResponse[]>(
      `${BASE_URL}/filtrar/fecha-rango?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`
    );
    return response.data;
  },

  /**
   * Búsqueda avanzada con múltiples filtros
   * GET /cc/quinielas/busqueda-avanzada
   * @param filtros Objeto con los filtros a aplicar
   * @returns Lista de quinielas que cumplen los criterios
   */
  busquedaAvanzadaQuinielas: async (filtros: FiltrosBusquedaAvanzada): Promise<QuinielaResponse[]> => {
    const params = new URLSearchParams();
    
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.precioMaximo) params.append('precioMaximo', filtros.precioMaximo.toString());
    if (filtros.tipoPremio) params.append('tipoPremio', filtros.tipoPremio);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}/busqueda-avanzada?${queryString}` : `${BASE_URL}/busqueda-avanzada`;
    
    const response = await apiClient.get<QuinielaResponse[]>(url);
    return response.data;
  },

  /**
   * Obtiene todas las quinielas con paginación
   * GET /cc/quinielas/todas?page={page}&size={size}
   * @param page Número de página (por defecto 0)
   * @param size Tamaño de página (por defecto 10)
   * @returns Lista paginada de quinielas
   */
  obtenerTodasQuinielas: async (page: number = 0, size: number = 10): Promise<QuinielaResponse[]> => {
    const response = await apiClient.get<QuinielaResponse[]>(`${BASE_URL}/todas?page=${page}&size=${size}`);
    return response.data;
  },

  // =================== ENDPOINTS DE ADMINISTRACIÓN ===================

  /**
   * Actualiza el premio acumulado de una quiniela
   * PUT /cc/quinielas/{id}/premio-acumulado?nuevoPremio={premio}
   * @param id ID de la quiniela
   * @param nuevoPremio Nuevo valor del premio acumulado
   * @returns Mensaje de confirmación
   */
  actualizarPremioAcumulado: async (id: number, nuevoPremio: number): Promise<string> => {
    const response = await apiClient.put<string>(`${BASE_URL}/${id}/premio-acumulado?nuevoPremio=${nuevoPremio}`, {}, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  /**
   * Actualiza el estado de una quiniela
   * PUT /cc/quinielas/{id}/estado?nuevoEstado={estado}
   * @param id ID de la quiniela
   * @param nuevoEstado Nuevo estado de la quiniela
   * @returns Mensaje de confirmación
   */
  actualizarEstadoQuiniela: async (id: number, nuevoEstado: string): Promise<string> => {
    const response = await apiClient.put<string>(`${BASE_URL}/${id}/estado?nuevoEstado=${encodeURIComponent(nuevoEstado)}`, {}, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  /**
   * Elimina una quiniela del sistema
   * DELETE /cc/quinielas/{id}
   * @param id ID de la quiniela a eliminar
   * @returns Mensaje de confirmación
   */
  eliminarQuiniela: async (id: number): Promise<string> => {
    const response = await apiClient.delete<string>(`${BASE_URL}/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  /**
   * Finaliza una quiniela
   * POST /cc/quinielas/{id}/finalizar
   * @param id ID de la quiniela a finalizar
   * @returns Mensaje de confirmación
   */
  finalizarQuiniela: async (id: number): Promise<string> => {
    const response = await apiClient.post<string>(`${BASE_URL}/${id}/finalizar`, {}, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  // =================== ENDPOINTS DE ESTADÍSTICAS ===================
  /**
   * Obtiene estadísticas detalladas de una quiniela
   * GET /cc/quinielas/estadisticas/{id}
   * @param id ID de la quiniela
   * @returns Estadísticas de la quiniela
   */
  obtenerEstadisticasQuiniela: async (id: number): Promise<EstadisticasQuinielaResponse> => {
    const response = await apiClient.get<EstadisticasQuinielaResponse>(`${BASE_URL}/estadisticas/${id}`);
    return response.data;
  },

  // =================== MÉTODOS DE COMPATIBILIDAD ===================
  // Mantenemos algunos métodos con nombres anteriores para compatibilidad

  /**
   * @deprecated Usar obtenerQuinielasPublicas en su lugar
   */
  getAllQuinielas: async (): Promise<QuinielaResponse[]> => {
    return QuinielaService.obtenerQuinielasPublicas();
  },

  /**
   * @deprecated Usar obtenerQuinielaPorId en su lugar
   */
  getQuinielaById: async (id: number): Promise<QuinielaResponse> => {
    return QuinielaService.obtenerQuinielaPorId(id);
  },

  /**
   * @deprecated Usar obtenerQuinielasPorEstado en su lugar
   */
  getQuinielasByEstado: async (estado: string): Promise<QuinielaResponse[]> => {
    return QuinielaService.obtenerQuinielasPorEstado(estado);
  },

  /**
   * @deprecated Usar obtenerQuinielasPorRangoFecha en su lugar
   */
  getQuinielasByFechas: async (fechaInicio: string, fechaFin: string): Promise<QuinielaResponse[]> => {
    return QuinielaService.obtenerQuinielasPorRangoFecha(fechaInicio, fechaFin);
  },

  /**
   * @deprecated Usar obtenerQuinielasPorPrecioMaximo en su lugar
   */
  getQuinielasByPrecioMaximo: async (precio: number): Promise<QuinielaResponse[]> => {
    return QuinielaService.obtenerQuinielasPorPrecioMaximo(precio);
  },

  /**
   * @deprecated Usar actualizarPremioAcumulado en su lugar
   */
  actualizarPremio: async (id: number, nuevoPremio: number): Promise<void> => {
    await QuinielaService.actualizarPremioAcumulado(id, nuevoPremio);
  },

  /**
   * @deprecated Usar actualizarEstadoQuiniela en su lugar
   */
  actualizarEstado: async (id: number, nuevoEstado: string): Promise<void> => {
    await QuinielaService.actualizarEstadoQuiniela(id, nuevoEstado);
  },

  /**
   * @deprecated Este método está obsoleto. Usar crearQuiniela para crear nuevas quinielas.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  actualizarQuiniela: async (id: number, quiniela: Partial<QuinielaType>): Promise<QuinielaType> => {
    throw new Error('Método deprecated. Usar crearQuiniela para crear o implementar endpoint de actualización específico.');
  }
};

export default QuinielaService;