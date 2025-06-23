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