import type { EventResponseApi } from "./EventType";

export interface QuinielaType {
    idQuiniela: number;
    nombreQuiniela: string;
    premioAcumulado: number;
    numeroParticipantes: number;
    fechaInicio: string;
    fechaFin: string;
    precioParticipacion: number;
    estado: string;
    strDescripcion: string;
    urlBanner: string;
    allowDoubleBets: boolean;
    allowTripleBets: boolean;
    tipoPremio: string;
    tiposApuestas: string[];
    eventos: EventResponseApi[];
}

// Nuevos tipos para quinielas creadas por usuarios
export interface QuinielaCreada {
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
    estado: 'ACTIVA' | 'EN_CURSO' | 'FINALIZADA' | 'CANCELADA';
    tipoDistribucion: 'WINNER_TAKES_ALL' | 'TOP_3' | 'PERCENTAGE' | 'ELIMINATION' | 'ACCUMULATIVE' | 'TEAMS';
    porcentajePremiosPrimero: number;
    porcentajePremiosSegundo: number;
    porcentajePremiosTercero: number;
    esPublica: boolean;
    codigoInvitacion?: string;
    esCrypto: boolean;
    cryptoTipo?: string;
    premiosDistribuidos: boolean;
    eventos?: EventoQuiniela[];
    participaciones?: ParticipacionQuiniela[];
    premios?: PremioQuiniela[];
}

export interface EventoQuiniela {
    id: number;
    eventoId: number;
    nombreEvento: string;
    fechaEvento: string;
    equipoLocal: string;
    equipoVisitante: string;
    resultadoLocal?: number;
    resultadoVisitante?: number;
    puntosPorAcierto: number;
    puntosPorResultadoExacto: number;
    estado: 'PROGRAMADO' | 'EN_VIVO' | 'FINALIZADO' | 'CANCELADO';
    finalizado: boolean;
}

export interface ParticipacionQuiniela {
    id: number;
    usuarioId: number;
    fechaParticipacion: string;
    montoPagado: number;
    puntosObtenidos: number;
    posicionFinal?: number;
    premioGanado?: number;
    premioReclamado: boolean;
    estado: 'ACTIVA' | 'ELIMINADA' | 'FINALIZADA';
}

export interface PremioQuiniela {
    id: number;
    posicion: number;
    montoPremio: number;
    porcentajePremio: number;
    usuarioGanadorId?: number;
    fechaAsignacion?: string;
    premioReclamado: boolean;
    descripcion?: string;
}

export interface PrediccionQuiniela {
    id?: number;
    eventoId: number;
    prediccionLocal: number;
    prediccionVisitante: number;
    puntosObtenidos?: number;
    esResultadoExacto?: boolean;
    esAciertoGanador?: boolean;
}

// DTOs para requests
export interface CrearQuinielaRequest {
    nombre: string;
    descripcion: string;
    fechaInicio: string | Date;
    fechaFin: string|Date;
    precioEntrada: number;
    maxParticipantes?: number;
    tipoDistribucion: 'WINNER_TAKES_ALL' | 'TOP_3' | 'PERCENTAGE' | 'ELIMINATION' | 'ACCUMULATIVE' | 'TEAMS';
    porcentajePremiosPrimero?: number;
    porcentajePremiosSegundo?: number;
    porcentajePremiosTercero?: number;
    esPublica?: boolean;
    eventos: EventoQuinielaRequest[];
}

export interface EventoQuinielaRequest {
    eventoId: number;
    nombreEvento: string;
    fechaEvento: string;
    equipoLocal: string;
    equipoVisitante: string;
    puntosPorAcierto?: number;
    puntosPorResultadoExacto?: number;
}

export interface UnirseQuinielaRequest {
    quinielaId?: number;
    codigoInvitacion?: string;
}

export interface HacerPrediccionesRequest {
    quinielaId: number;
    predicciones: PrediccionEvento[];
}

export interface PrediccionEvento {
    eventoId: number;
    tipoPrediccion: string;
    resultadoPredichoLocal: number;
    resultadoPredichoVisitante: number;
}

// Response type para la API
export interface QuinielaResponse {
    id: number;
    nombre: string;
    descripcion: string;
    creadorId: number;
    fechaCreacion: string;
    fechaInicio: string;
    fechaFin: string;
    precioEntrada: number;
    maxParticipantes?: number;
    participantes: number;
    estado: 'ACTIVA' | 'EN_CURSO' | 'FINALIZADA' | 'CANCELADA';
    tipoDistribucion: 'WINNER_TAKES_ALL' | 'TOP_3' | 'PERCENTAGE' | 'ELIMINATION' | 'ACCUMULATIVE' | 'TEAMS';
    porcentajePremiosPrimero: number;
    porcentajePremiosSegundo: number;
    porcentajePremiosTercero: number;
    esPublica: boolean;
    codigoInvitacion?: string;
    premiosDistribuidos: boolean;
    eventos?: EventoQuiniela[];
}