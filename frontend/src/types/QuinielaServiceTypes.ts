// Tipos específicos para el servicio de quinielas

export interface CrearQuinielaRequest {
  nombre: string;
  descripcion: string;
  fechaInicio: string; // formato: yyyy-MM-dd'T'HH:mm:ss
  fechaFin: string; // formato: yyyy-MM-dd'T'HH:mm:ss
  precioEntrada: number;
  maxParticipantes?: number;
  tipoDistribucion: string;
  porcentajePremiosPrimero?: number;
  porcentajePremiosSegundo?: number;
  porcentajePremiosTercero?: number;
  esPublica: boolean;
  esCrypto: boolean;
  cryptoTipo?: string;
  eventos?: EventoQuinielaRequest[];
}

export interface EventoQuinielaRequest {
  eventoId: string;
  nombreEvento: string;
  fechaEvento: string;
  equipoLocal: string;
  equipoVisitante: string;
  puntosPorAcierto?: number;
  puntosPorResultadoExacto?: number;
}

export interface UnirseQuinielaRequest {
  quinielaId: number;
  codigoInvitacion?: string;
}

export interface HacerPrediccionesRequest {
  quinielaId: number;
  predicciones: PrediccionEvento[];
}

export interface PrediccionEvento {
  eventoId: number;
  resultadoPredichoLocal: number;
  resultadoPredichoVisitante: number;
  tipoPrediccion: string;
}

export interface QuinielaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  creadorId: number;
  fechaCreacion: string;
  fechaInicio: string;
  fechaFin: string;
  precioEntrada: number;
  premioTotal?: number;
  maxParticipantes?: number;
  participantesActuales: number;
  estado: string;
  tipoDistribucion: string;
  porcentajePremiosPrimero?: number;
  porcentajePremiosSegundo?: number;
  porcentajePremiosTercero?: number;
  esPublica: boolean;
  codigoInvitacion?: string;
  esCrypto: boolean;
  cryptoTipo?: string;
  premiosDistribuidos: boolean;
  eventos?: EventoQuinielaResponse[];
}

export interface EventoQuinielaResponse {
  id: number;
  eventoId: string;
  nombreEvento: string;
  fechaEvento: string;
  equipoLocal: string;
  equipoVisitante: string;
  resultadoLocal?: number;
  resultadoVisitante?: number;
  puntosPorAcierto: number;
  puntosPorResultadoExacto: number;
  estado: string;
  finalizado: boolean;
}

export interface ParticipacionQuiniela {
  id: number;
  usuarioId: number;
  fechaParticipacion: string;
  montoPagado: number;
  puntosObtenidos?: number;
  posicionFinal?: number;
  premioGanado?: number;
}

export interface EstadisticasQuinielaResponse {
  id: number;
  nombre: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
  precioParticipacion: number;
  premioAcumulado?: number;
  tipoPremio: string;
  numeroParticipantes?: number;
  numeroEventos: number;
  numeroPredicciones: number;
  activa: boolean;
  finalizada: boolean;
  descripcion: string;
}

export interface FiltrosBusquedaAvanzada {
  estado?: string;
  precioMaximo?: number;
  tipoPremio?: string;
  fechaInicio?: string;
  fechaFin?: string;
}
