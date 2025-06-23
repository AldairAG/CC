import { apiClient } from '../casino/ApiCliente';

export interface CrearApuestaRequest {
  idUsuario?: number; // El backend lo obtendrá del token
  idEvento?: number; // Opcional si se proporciona información para crear el evento
  tipoApuesta: string;
  montoApuesta: number;
  cuotaApuesta: number;
  prediccionUsuario: string;
  detalleApuesta?: string;
  
  // Campos para crear evento automáticamente
  equipoLocal?: string;
  equipoVisitante?: string;
  fechaEvento?: string; // formato YYYY-MM-DD
  idEventoExterno?: string; // ID del evento en TheSportsDB
}

export interface ApuestaResponse {
  idApuesta: number;
  idUsuario: number;
  emailUsuario: string;
  idEvento: number;
  equipoLocal: string;
  equipoVisitante: string;
  tipoApuesta: string;
  tipoApuestaDescripcion: string;
  estadoApuesta: string;
  estadoApuestaDescripcion: string;
  montoApuesta: number;
  cuotaApuesta: number;
  gananciaPotencial: number;
  gananciaReal?: number;
  prediccionUsuario: string;
  resultadoReal?: string;
  detalleApuesta?: string;
  fechaCreacion: string;
  fechaResolucion?: string;
  observaciones?: string;
}

export const apuestasAPI = {
  // Crear nueva apuesta (con creación automática de evento)
  crearApuesta: async (request: CrearApuestaRequest): Promise<ApuestaResponse> => {
    const response = await apiClient.post('/apuestas', request);
    return response.data;
  },

  // Obtener mis apuestas
  obtenerMisApuestas: async (): Promise<ApuestaResponse[]> => {
    const response = await apiClient.get('/apuestas/mis-apuestas');
    return response.data;
  },

  // Obtener mis apuestas paginado
  obtenerMisApuestasPaginado: async (page: number = 0, size: number = 10) => {
    const response = await apiClient.get('/apuestas/mis-apuestas/paginado', {
      params: { page, size }
    });
    return response.data;
  },

  // Obtener apuesta por ID
  obtenerApuestaPorId: async (idApuesta: number): Promise<ApuestaResponse> => {
    const response = await apiClient.get(`/apuestas/${idApuesta}`);
    return response.data;
  },

  // Cancelar apuesta
  cancelarApuesta: async (idApuesta: number, motivo?: string): Promise<{ mensaje: string }> => {
    const response = await apiClient.put(`/apuestas/${idApuesta}/cancelar`, null, {
      params: motivo ? { motivo } : {}
    });
    return response.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async () => {
    const response = await apiClient.get('/apuestas/estadisticas');
    return response.data;
  },

  // Calcular ganancia potencial
  calcularGanancia: async (monto: number, cuota: number): Promise<{ gananciaPotencial: number }> => {
    const response = await apiClient.get('/apuestas/calcular-ganancia', {
      params: { monto, cuota }
    });
    return response.data;
  },

  // Validar apuesta
  validarApuesta: async (idEvento: number, monto: number, tipoApuesta: string) => {
    const response = await apiClient.get('/apuestas/validar', {
      params: { idEvento, monto, tipoApuesta }
    });
    return response.data;
  }
};
