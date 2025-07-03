import type { QuinielaType } from "./QuinielaType";

export interface Prediccion {
    id: number;
    eventoId: number;
    nombreEvento?: string;
    descripcionEvento?: string;
    prediccion: string;
    resultadoReal?: string;
    estado?: 'PENDIENTE' | 'ACIERTO' | 'FALLO';
    puntosObtenidos?: number;
    fechaPrediccion: string;
}

// Usamos la interfaz que coincide con lo que maneja el hook useQuiniela
export interface Participacion {
    id?: number;
    quinielaId: number;
    usuarioId: number;
    fechaParticipacion?: string;
    estado?: string;
    puntosTotales?: number;
    posicionActual?: number;
    predicciones?: Prediccion[];
}

// Versión más completa para uso futuro
export interface ParticipacionDetallada extends Participacion {
    montoParticipacion: number;
    quiniela?: QuinielaType;
    nombreUsuario?: string;
}
