// Tipos adicionales para el servicio de Quinielas
import type { QuinielaType } from './QuinielaType';

export interface QuinielaFilterType {
    tipo?: string;
    estado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    costoMin?: number;
    costoMax?: number;
    esPublica?: boolean;
}

export interface ParticipacionResponse {
    participacionId: number;
    mensaje: string;
    transaccionId?: number;
    saldoRestante: number;
    prediccionesGuardadas?: number;
    poolActualizado: number;
}

export interface EstadoQuinielaResponse {
    id: number;
    nombre: string;
    estado: string;
    participantesActuales: number;
    poolActual: number;
    horasParaCierre: number;
    estadisticas: {
        prediccionesPorEvento: Record<string, {
            total: number;
            distribucion: Record<string, number>;
        }>;
        participantesNuevos24h: number;
        promedioConfianza: number;
    };
}

export interface HistorialParticipacionType {
    quinielaId: number;
    nombre: string;
    fechaParticipacion: string;
    posicionFinal?: number;
    aciertos: number;
    puntuacion: number;
    montoApostado: number;
    premioGanado: number;
    estado: string;
}

export interface EstadisticasUsuarioQuinielasType {
    totalParticipaciones: number;
    quinielasGanadas: number;
    porcentajeExito: number;
    totalApostado: number;
    totalGanado: number;
    gananciaNeta: number;
    mejorPosicion?: number;
    rachaActual: number;
}

export interface NotificacionQuinielaType {
    id: number;
    tipo: 'GANADOR_QUINIELA' | 'QUINIELA_FINALIZADA' | 'CIERRE_PROXIMO' | 'NUEVO_PARTICIPANTE';
    mensaje: string;
    quinielaId: number;
    nombreQuiniela: string;
    fecha: string;
    leida: boolean;
}

export interface ConfiguracionQuinielaType {
    permitirPrediccionesMultiples: boolean;
    requiereConfirmacion: boolean;
    mostrarRankingEnTiempoReal: boolean;
    permitirCambiarPredicciones: boolean;
    horasLimiteParaCambios: number;
}

// Tipos para eventos deportivos relacionados con quinielas
export interface EventoQuinielaType {
    id: number;
    quinielaEventoId: number;
    nombreEvento: string;
    equipoLocal: string;
    equipoVisitante: string;
    fechaEvento: string;
    estado: 'PROGRAMADO' | 'EN_VIVO' | 'FINALIZADO' | 'CANCELADO';
    puntosPorAcierto: number;
    multiplicadorPuntos: number;
    esObligatorio: boolean;
    tipoPrediccion: string;
    prediccionUsuario?: {
        prediccion: string;
        confianza: number;
        fechaPrediccion: string;
    };
    resultado?: {
        marcadorLocal: number;
        marcadorVisitante: number;
        fechaFinalizacion: string;
    };
    estadisticas?: {
        totalPredicciones: number;
        prediccionesCorrectas: number;
        porcentajeAciertos: number;
        distribuccionPredicciones: Record<string, number>;
    };
}

export interface ResumenQuinielaCrearType {
    datosBasicos: {
        nombre: string;
        descripcion: string;
        tipoQuiniela: string;
        tipoDistribucion: string;
    };
    configuracionEconomica: {
        costoParticipacion: number;
        premioMinimo: number;
        maxParticipantes: number;
        porcentajeCasa?: number;
        porcentajeCreador?: number;
    };
    configuracionTemporal: {
        fechaInicio: string;
        fechaCierre: string;
        fechaFinalizacion?: string;
    };
    configuracionPrivacidad: {
        esPublica: boolean;
        requiereAprobacion: boolean;
        requiereMinParticipantes?: number;
    };
    eventosSeleccionados: number[];
    reglasEspeciales?: string;
}

// Respuestas específicas de la API
export interface CrearQuinielaResponse {
    quiniela: QuinielaType;
    mensaje: string;
    codigoCompartir: string;
    urlCompartir: string;
}

export interface ErrorQuinielaType {
    codigo: string;
    mensaje: string;
    detalles?: string;
    campo?: string;
}

export interface ValidacionParticipacionType {
    puedeParticipar: boolean;
    motivo?: string;
    saldoSuficiente: boolean;
    yaParticipa: boolean;
    quinielaActiva: boolean;
    espaciosDisponibles: boolean;
}
