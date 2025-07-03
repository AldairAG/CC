export interface ApuestaType {
    id: number;
    usuario: UsuarioType;
    eventoDeportivo: EventoDeportivoType;
    cuotaEvento: CuotaEventoType;
    tipoApuesta: TipoApuesta;
    prediccion: string;
    montoApostado: number;
    valorCuotaMomento: number;
    montoPotencialGanancia?: number;
    montoGanancia?: number;
    estado: EstadoApuesta;
    esGanadora?: boolean;
    fechaCreacion: string;
    fechaResolucion?: string;
    fechaActualizacion?: string;
    descripcion?: string;
}

export interface CrearApuestaRequestType {
    eventoId: number;
    cuotaId: number;
    montoApostado: number;
    tipoApuesta?: TipoApuesta;
    prediccion?: string;
    descripcion?: string;
}

export interface ApuestasResponse {
    content: ApuestaType[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface UsuarioType {
    idUsuario: number;
    nombreUsuario: string;
    email: string;
    nombre: string;
    apellido: string;
}

export interface EventoDeportivoType {
    id: number;
    nombre: string;
    descripcion?: string;
    fechaInicio: string;
    fechaFin?: string;
    equipoLocal: string;
    equipoVisitante: string;
    estado: string;
    resultado?: string;
    deporte: string;
    liga?: string;
}

export interface CuotaEventoType {
    id: number;
    eventoDeportivo: EventoDeportivoType;
    tipoApuesta: TipoApuesta;
    descripcion: string;
    valorCuota: number;
    activa: boolean;
    fechaCreacion: string;
    fechaActualizacion?: string;
}

export interface EstadisticasApuestaType {
    totalApuestas: number;
    montoTotalApostado: number;
    apuestasGanadas: number;
    apuestasPerdidas: number;
    apuestasPendientes: number;
    gananciaTotal: number;
    rentabilidad: number;
}

export interface ResumenApuestaType {
    apuestaId: number;
    eventoNombre: string;
    tipoApuesta: TipoApuesta;
    prediccion: string;
    montoApostado: number;
    estado: EstadoApuesta;
    fechaCreacion: string;
    ganancia?: number;
}

export type EstadoApuesta = 
    | 'PENDIENTE'
    | 'ACEPTADA'
    | 'CANCELADA'
    | 'RECHAZADA'
    | 'RESUELTA';

export const EstadoApuesta = {
    PENDIENTE: 'PENDIENTE' as EstadoApuesta,
    ACEPTADA: 'ACEPTADA' as EstadoApuesta,
    CANCELADA: 'CANCELADA' as EstadoApuesta,
    RECHAZADA: 'RECHAZADA' as EstadoApuesta,
    RESUELTA: 'RESUELTA' as EstadoApuesta
};

export type TipoApuesta = 
    | 'RESULTADO_GENERAL'
    | 'RESULTADO_EXACTO'
    | 'TOTAL_GOLES'
    | 'GOLES_LOCAL'
    | 'GOLES_VISITANTE'
    | 'AMBOS_EQUIPOS_ANOTAN'
    | 'PRIMER_GOLEADOR'
    | 'HANDICAP'
    | 'DOBLE_OPORTUNIDAD'
    | 'MITAD_TIEMPO'
    | 'GOLES_PRIMERA_MITAD'
    | 'CORNER_KICKS'
    | 'TARJETAS'
    | 'AMBAS_MITADES_GOLEAN';

export const TipoApuesta = {
    RESULTADO_GENERAL: 'RESULTADO_GENERAL' as TipoApuesta,
    RESULTADO_EXACTO: 'RESULTADO_EXACTO' as TipoApuesta,
    TOTAL_GOLES: 'TOTAL_GOLES' as TipoApuesta,
    GOLES_LOCAL: 'GOLES_LOCAL' as TipoApuesta,
    GOLES_VISITANTE: 'GOLES_VISITANTE' as TipoApuesta,
    AMBOS_EQUIPOS_ANOTAN: 'AMBOS_EQUIPOS_ANOTAN' as TipoApuesta,
    PRIMER_GOLEADOR: 'PRIMER_GOLEADOR' as TipoApuesta,
    HANDICAP: 'HANDICAP' as TipoApuesta,
    DOBLE_OPORTUNIDAD: 'DOBLE_OPORTUNIDAD' as TipoApuesta,
    MITAD_TIEMPO: 'MITAD_TIEMPO' as TipoApuesta,
    GOLES_PRIMERA_MITAD: 'GOLES_PRIMERA_MITAD' as TipoApuesta,
    CORNER_KICKS: 'CORNER_KICKS' as TipoApuesta,
    TARJETAS: 'TARJETAS' as TipoApuesta,
    AMBAS_MITADES_GOLEAN: 'AMBAS_MITADES_GOLEAN' as TipoApuesta
};

// Tipos auxiliares para mejor experiencia de desarrollo
export interface FiltrosApuesta {
    estado?: EstadoApuesta;
    tipoApuesta?: TipoApuesta;
    fechaDesde?: string;
    fechaHasta?: string;
    montoMinimo?: number;
    montoMaximo?: number;
}

export interface ApuestaDetalle extends ApuestaType {
    historialCambios?: HistorialCambioApuesta[];
}

export interface HistorialCambioApuesta {
    id: number;
    fechaCambio: string;
    estadoAnterior: EstadoApuesta;
    estadoNuevo: EstadoApuesta;
    comentario?: string;
}