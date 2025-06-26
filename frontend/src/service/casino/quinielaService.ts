import { apiClient } from "./ApiCliente";
import type {
  QuinielaCreada,
  CrearQuinielaRequest,
  UnirseQuinielaRequest,
  HacerPrediccionesRequest,
  ParticipacionQuiniela
} from '../../types/QuinielaType';
import type {
  EstadisticasQuinielaResponse,
  FiltrosBusquedaAvanzada
} from "../../types/QuinielaServiceTypes";

const BASE_URL = "/quinielas";

/**
 * Servicio para gestionar las operaciones relacionadas con quinielas creadas
 * Conecta con QuinielaController del backend usando la misma estructura que QuinielaService
 */
export const QuinielaService = {
  // =================== ENDPOINTS PRINCIPALES ===================

  /**
   * Crea una nueva quiniela
   * POST /cc/quinielas/crear
   * @param request Datos de la quiniela a crear
   * @returns La quiniela creada con su ID asignado
   */
  crearQuiniela: async (request: CrearQuinielaRequest): Promise<QuinielaCreada> => {
    const response = await apiClient.post<QuinielaCreada>(`${BASE_URL}/crear`, request, {
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
  hacerPredicciones: async (request: HacerPrediccionesRequest): Promise<void> => {
    await apiClient.post<void>(`${BASE_URL}/predicciones`, request, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
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
   * Finalizar una quiniela
   * POST /cc/quinielas/{id}/finalizar
   * @param quinielaId ID de la quiniela a finalizar
   * @returns Mensaje de confirmación
   */
  finalizarQuiniela: async (quinielaId: number): Promise<string> => {
    const response = await apiClient.post<string>(`${BASE_URL}/${quinielaId}/finalizar`, {}, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  // =================== CONSULTAS Y OBTENCIÓN DE DATOS ===================

  /**
   * Obtiene todas las quinielas públicas
   * GET /cc/quinielas/publicas
   * @returns Lista de quinielas públicas
   */
  obtenerQuinielasPublicas: async (): Promise<QuinielaCreada[]> => {
    const response = await apiClient.get<QuinielaCreada[]>(`${BASE_URL}/publicas`);
    return response.data;
  },

  /**
   * Obtiene las quinielas creadas por el usuario
   * GET /cc/quinielas/mis-quinielas
   * @returns Lista de mis quinielas
   */
  obtenerMisQuinielas: async (): Promise<QuinielaCreada[]> => {
    const response = await apiClient.get<QuinielaCreada[]>(`${BASE_URL}/mis-quinielas`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  /**
   * Obtiene las quinielas en las que participa el usuario
   * GET /cc/quinielas/mis-participaciones
   * @returns Lista de participaciones
   */
  obtenerMisParticipaciones: async (): Promise<QuinielaCreada[]> => {
    const response = await apiClient.get<QuinielaCreada[]>(`${BASE_URL}/mis-participaciones`, {
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
  obtenerQuiniela: async (id: number): Promise<QuinielaCreada> => {
    const response = await apiClient.get<QuinielaCreada>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Obtiene todas las quinielas con paginación
   * GET /cc/quinielas/todas?page={page}&size={size}
   * @param page Número de página (por defecto 0)
   * @param size Tamaño de página (por defecto 10)
   * @returns Lista paginada de quinielas
   */
  obtenerTodasQuinielas: async (page: number = 0, size: number = 10): Promise<QuinielaCreada[]> => {
    const response = await apiClient.get<QuinielaCreada[]>(`${BASE_URL}/todas?page=${page}&size=${size}`);
    return response.data;
  },

  // =================== ENDPOINTS DE FILTRADO ===================

  /**
   * Obtiene quinielas por estado
   * GET /cc/quinielas/filtrar/estado/{estado}
   * @param estado Estado de las quinielas a buscar
   * @returns Lista de quinielas con el estado especificado
   */
  obtenerQuinielasPorEstado: async (estado: string): Promise<QuinielaCreada[]> => {
    const response = await apiClient.get<QuinielaCreada[]>(`${BASE_URL}/filtrar/estado/${encodeURIComponent(estado)}`);
    return response.data;
  },

  /**
   * Obtiene quinielas con precio máximo
   * GET /cc/quinielas/filtrar/precio-maximo?precioMaximo={precio}
   * @param precioMaximo Precio máximo de participación
   * @returns Lista de quinielas con precio dentro del límite
   */
  obtenerQuinielasPorPrecioMaximo: async (precioMaximo: number): Promise<QuinielaCreada[]> => {
    const response = await apiClient.get<QuinielaCreada[]>(`${BASE_URL}/filtrar/precio-maximo?precioMaximo=${precioMaximo}`);
    return response.data;
  },

  /**
   * Obtiene quinielas por tipo de premio
   * GET /cc/quinielas/filtrar/tipo-premio/{tipoPremio}
   * @param tipoPremio Tipo de premio de las quinielas
   * @returns Lista de quinielas con el tipo de premio especificado
   */
  obtenerQuinielasPorTipoPremio: async (tipoPremio: string): Promise<QuinielaCreada[]> => {
    const response = await apiClient.get<QuinielaCreada[]>(`${BASE_URL}/filtrar/tipo-premio/${encodeURIComponent(tipoPremio)}`);
    return response.data;
  },

  /**
   * Obtiene quinielas entre dos fechas
   * GET /cc/quinielas/filtrar/fecha-rango?fechaInicio={fecha}&fechaFin={fecha}
   * @param fechaInicio Fecha de inicio en formato yyyy-MM-dd
   * @param fechaFin Fecha de fin en formato yyyy-MM-dd
   * @returns Lista de quinielas dentro del rango de fechas
   */
  obtenerQuinielasPorRangoFecha: async (fechaInicio: string, fechaFin: string): Promise<QuinielaCreada[]> => {
    const response = await apiClient.get<QuinielaCreada[]>(
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
  busquedaAvanzadaQuinielas: async (filtros: FiltrosBusquedaAvanzada): Promise<QuinielaCreada[]> => {
    const params = new URLSearchParams();

    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.precioMaximo) params.append('precioMaximo', filtros.precioMaximo.toString());
    if (filtros.tipoPremio) params.append('tipoPremio', filtros.tipoPremio);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}/busqueda-avanzada?${queryString}` : `${BASE_URL}/busqueda-avanzada`;

    const response = await apiClient.get<QuinielaCreada[]>(url);
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

  // =================== ENDPOINTS ESPECÍFICOS ===================

  /**
   * Buscar quiniela por código de invitación
   * GET /cc/quinielas/codigo/{codigo}
   * @param codigo Código de invitación
   * @returns La quiniela encontrada
   */
  buscarPorCodigoInvitacion: async (codigo: string): Promise<QuinielaCreada> => {
    const response = await apiClient.get<QuinielaCreada>(`${BASE_URL}/codigo/${encodeURIComponent(codigo)}`);
    return response.data;
  },

  // =================== MÉTODOS UTILITARIOS ===================

  /**
   * Calcula el tiempo restante hasta el inicio de una quiniela
   * @param fechaInicio Fecha de inicio en formato ISO
   * @returns String con el tiempo restante formateado
   */
  calcularTiempoRestante: (fechaInicio: string): string => {
    const inicio = new Date(fechaInicio);
    const ahora = new Date();
    const diferencia = inicio.getTime() - ahora.getTime();

    if (diferencia <= 0) {
      return 'Iniciada';
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

    if (dias > 0) {
      return `${dias}d ${horas}h`;
    } else if (horas > 0) {
      return `${horas}h ${minutos}m`;
    } else {
      return `${minutos}m`;
    }
  },

  /**
   * Formatea un monto como moneda
   * @param amount Cantidad a formatear
   * @param esCrypto Si es criptomoneda
   * @param cryptoTipo Tipo de criptomoneda
   * @returns String formateado
   */
  formatearMoneda: (amount: number, esCrypto: boolean = false, cryptoTipo?: string): string => {
    if (esCrypto && cryptoTipo) {
      return `${amount.toFixed(6)} ${cryptoTipo}`;
    }
    return `€${amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  },

  /**
   * Calcula el porcentaje de ocupación de una quiniela
   * @param actual Participantes actuales
   * @param maximo Participantes máximos
   * @returns Porcentaje de ocupación
   */
  calcularPorcentajeOcupacion: (actual: number, maximo?: number): number => {
    if (!maximo) return 0;
    return Math.min((actual / maximo) * 100, 100);
  },

  /**
   * Obtiene la clase CSS para el color del estado
   * @param estado Estado de la quiniela
   * @returns Clase CSS del color
   */
  obtenerEstadoColor: (estado: string): string => {
    switch (estado?.toUpperCase()) {
      case 'ACTIVA':
        return 'text-green-600';
      case 'EN_CURSO':
        return 'text-blue-600';
      case 'FINALIZADA':
        return 'text-gray-600';
      case 'CANCELADA':
        return 'text-red-600';
      case 'PROGRAMADA':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  },

  /**
   * Obtiene el icono para el estado
   * @param estado Estado de la quiniela
   * @returns Emoji del estado
   */
  obtenerEstadoIcono: (estado: string): string => {
    switch (estado?.toUpperCase()) {
      case 'ACTIVA':
        return '🟢';
      case 'EN_CURSO':
        return '🔵';
      case 'FINALIZADA':
        return '🏆';
      case 'CANCELADA':
        return '❌';
      case 'PROGRAMADA':
        return '🟡';
      default:
        return '⚪';
    }
  },

  /**
   * Obtiene el texto descriptivo del estado
   * @param estado Estado de la quiniela
   * @returns Descripción del estado
   */
  obtenerEstadoTexto: (estado: string): string => {
    switch (estado?.toUpperCase()) {
      case 'ACTIVA':
        return 'Activa - Aceptando participantes';
      case 'EN_CURSO':
        return 'En curso - Eventos en progreso';
      case 'FINALIZADA':
        return 'Finalizada - Premios distribuidos';
      case 'CANCELADA':
        return 'Cancelada';
      case 'PROGRAMADA':
        return 'Programada - Próximamente';
      default:
        return 'Estado desconocido';
    }
  },

  /**
   * Verifica si el usuario puede participar en la quiniela
   * @param quiniela Datos de la quiniela
   * @param usuarioId ID del usuario actual
   * @returns true si puede participar
   */
  puedeParticipar: (quiniela: QuinielaCreada, usuarioId?: number): boolean => {
    if (!quiniela || quiniela.estado !== 'ACTIVA') return false;

    // Verificar si ya está participando
    if (usuarioId && quiniela.participantesActuales && Array.isArray(quiniela.participantesActuales)) {
      const yaParticipa = quiniela.participantesActuales.some((p: { usuarioId: number; }) => p.usuarioId === usuarioId);
      if (yaParticipa) return false;
    }

    // Verificar límite de participantes
    if (quiniela.maxParticipantes && quiniela.participantesActuales >= quiniela.maxParticipantes) {
      return false;
    }

    // Verificar fecha límite
    const fechaLimite = new Date(quiniela.fechaInicio);
    const ahora = new Date();
    if (ahora >= fechaLimite) return false;

    return true;
  },

  /**
   * Verifica si el usuario es el creador de la quiniela
   * @param quiniela Datos de la quiniela
   * @param usuarioId ID del usuario actual
   * @returns true si es el creador
   */
  esCreador: (quiniela: QuinielaCreada, usuarioId?: number): boolean => {
    if (!quiniela || !usuarioId) return false;
    return quiniela.creadorId === usuarioId;
  },

  // =================== MÉTODOS DE COMPATIBILIDAD ===================

  /**
   * @deprecated Usar obtenerQuiniela en su lugar
   */
  getQuinielaById: async (id: number): Promise<QuinielaCreada> => {
    return QuinielaService.obtenerQuiniela(id);
  },

  /**
   * @deprecated Usar buscarPorCodigoInvitacion en su lugar
   */
  buscarPorCodigo: async (codigo: string): Promise<QuinielaCreada> => {
    return QuinielaService.buscarPorCodigoInvitacion(codigo);
  }
};

// Singleton instance para compatibilidad con el código existente
let instance: typeof QuinielaService | null = null;

export const quinielaService = {
  getInstance: (): typeof QuinielaService => {
    if (!instance) {
      instance = QuinielaService;
    }
    return instance;
  }
};

// Export por defecto
export default QuinielaService;
