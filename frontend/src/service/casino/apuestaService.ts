import {apiClient} from './ApiCliente';

export interface CrearApuestaRequest {
  idUsuario: number;
  idEvento: number;
  tipoApuesta: string;
  montoApuesta: number;
  cuotaApuesta: number;
  prediccionUsuario: string;
  detalleApuesta?: string;
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

export interface EstadisticasApuestaResponse {
  totalApuestas: number;
  apuestasGanadas: number;
  apuestasPerdidas: number;
  apuestasPendientes: number;
  totalApostado: number;
  totalGanado: number;
  gananciaNeta: number;
  porcentajeExito: number;
  saldoActual: number;
  mayorGanancia: number;
  mayorPerdida: number;
  ultimasApuestas: ApuestaResponse[];
}

export interface CuotaEventoResponse {
  idEvento: number;
  equipoLocal?: string;
  equipoVisitante?: string;
  fechaPartido?: string;
  tipoApuesta: string;
  descripcionApuesta: string;
  cuota: number;
  activa: boolean;
  limiteMaximo: number;
  detalle: string;
}

class ApuestaService {
  // Crear nueva apuesta
  async crearApuesta(apuesta: CrearApuestaRequest): Promise<ApuestaResponse> {
    try {
      
      const response = await apiClient.post('/apuestas',apuesta);
      return response.data;
    } catch (error) {
      console.error('Error al crear apuesta:', error);
      throw error;
    }
  }

  // Obtener mis apuestas
  async obtenerMisApuestas(): Promise<ApuestaResponse[]> {
    try {
      const response = await apiClient.get('/apuestas/mis-apuestas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener apuestas:', error);
      throw error;
    }
  }

  // Obtener mis apuestas con paginación
  async obtenerMisApuestasPaginado(page: number = 0, size: number = 10) {
    try {
      const response = await apiClient.get(`/apuestas/mis-apuestas/paginado?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener apuestas paginadas:', error);
      throw error;
    }
  }  // Obtener apuesta por ID
  async obtenerApuestaPorId(idApuesta: number): Promise<ApuestaResponse | null> {
    try {
      const response = await apiClient.get(`/apuestas/${idApuesta}`);
      return response.data;
    } catch (error) {
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return null;
      }
      console.error('Error al obtener apuesta:', error);
      throw error;
    }
  }

  // Cancelar apuesta
  async cancelarApuesta(idApuesta: number, motivo?: string): Promise<boolean> {
    try {
      const params = motivo ? `?motivo=${encodeURIComponent(motivo)}` : '';
      await apiClient.put(`/apuestas/${idApuesta}/cancelar${params}`);
      return true;
    } catch (error) {
      console.error('Error al cancelar apuesta:', error);
      throw error;
    }
  }

  // Obtener estadísticas del usuario
  async obtenerEstadisticas(): Promise<EstadisticasApuestaResponse> {
    try {
      const response = await apiClient.get('/apuestas/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Calcular ganancia potencial
  async calcularGanancia(monto: number, cuota: number): Promise<{ monto: number; cuota: number; gananciaPotencial: number }> {
    try {
      const response = await apiClient.get(`/apuestas/calcular-ganancia?monto=${monto}&cuota=${cuota}`);
      return response.data;
    } catch (error) {
      console.error('Error al calcular ganancia:', error);
      throw error;
    }
  }

  // Obtener cuotas de un evento
  async obtenerCuotasEvento(idEvento: number): Promise<CuotaEventoResponse[]> {
    try {
      const response = await apiClient.get(`/apuestas/evento/${idEvento}/cuotas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cuotas:', error);
      throw error;
    }
  }

  // Validar si se puede realizar una apuesta
  async validarApuesta(idEvento: number, monto: number, tipoApuesta: string): Promise<{
    puedeApostar: boolean;
    saldoSuficiente: boolean;
    dentroLimite: boolean;
    eventoAbierto: boolean;
    noEsDuplicada: boolean;
  }> {
    try {
      const response = await apiClient.get(`/apuestas/validar?idEvento=${idEvento}&monto=${monto}&tipoApuesta=${tipoApuesta}`);
      return response.data;
    } catch (error) {
      console.error('Error al validar apuesta:', error);
      throw error;
    }
  }

  // Funciones auxiliares
  calcularGananciaLocal(monto: number, cuota: number): number {
    return Number((monto * cuota).toFixed(2));
  }

  formatearEstadoApuesta(estado: string): string {
    const estados = {
      'PENDIENTE': 'Pendiente',
      'GANADA': 'Ganada',
      'PERDIDA': 'Perdida',
      'CANCELADA': 'Cancelada',
      'REEMBOLSADA': 'Reembolsada',
      'EN_VIVO': 'En Vivo'
    };
    return estados[estado as keyof typeof estados] || estado;
  }

  formatearTipoApuesta(tipo: string): string {
    const tipos = {
      'GANADOR_PARTIDO': 'Ganador del Partido',
      'MARCADOR_EXACTO': 'Marcador Exacto',
      'TOTAL_GOLES': 'Total de Goles',
      'AMBOS_EQUIPOS_ANOTAN': 'Ambos Equipos Anotan',
      'PRIMER_GOLEADOR': 'Primer Goleador',
      'HANDICAP': 'Hándicap',
      'MITAD_TIEMPO': 'Resultado Primer Tiempo',
      'DOBLE_OPORTUNIDAD': 'Doble Oportunidad',
      'GOLES_MAS_MENOS': 'Más/Menos Goles',
      'CORNER_KICKS': 'Córners'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  }
}

export const apuestaService = new ApuestaService();
