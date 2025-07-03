import type { DeporteType, LigaType } from './DeporteLigaTypes';

// Enums para Evento Deportivo
export const EstadoEvento = {
    PROGRAMADO: 'programado',
    EN_VIVO: 'en_vivo',
    FINALIZADO: 'finalizado',
    CANCELADO: 'cancelado'
} as const;

export type EstadoEvento = typeof EstadoEvento[keyof typeof EstadoEvento];

export const ResultadoEvento = {
    LOCAL: 'LOCAL',
    VISITANTE: 'VISITANTE',
    EMPATE: 'EMPATE'
} as const;

export type ResultadoEvento = typeof ResultadoEvento[keyof typeof ResultadoEvento];

export const TipoDeporte = {
    FUTBOL: 'futbol',
    BALONCESTO: 'baloncesto',
    TENIS: 'tenis',
    BEISBOL: 'beisbol',
    FUTBOL_AMERICANO: 'futbol_americano',
    HOCKEY: 'hockey',
    VOLEIBOL: 'voleibol',
    OTROS: 'otros'
} as const;

export type TipoDeporte = typeof TipoDeporte[keyof typeof TipoDeporte];

// Tipos principales
export interface EventoDeportivoType {
    id: number;
    eventoIdExterno: string;
    nombreEvento: string;
    liga: LigaType;    // Cambiado de string a LigaType
    deporte: DeporteType; // Cambiado de string a DeporteType
    equipoLocal: string;
    equipoVisitante: string;
    fechaEvento: string; // ISO string
    estado: EstadoEvento;
    temporada?: string;
    descripcion?: string;
    resultado?: ResultadoEvento;
    marcadorLocal?: number;
    marcadorVisitante?: number;
    fechaCreacion: string; // ISO string
    fechaActualizacion: string; // ISO string
}

export interface EventoDeportivoResumenType {
    id: number;
    nombreEvento: string;
    liga: string;
    deporte: string;
    equipoLocal: string;
    equipoVisitante: string;
    fechaEvento: string; // ISO string
    estado: EstadoEvento;
    resultado?: ResultadoEvento;
    marcadorLocal?: number;
    marcadorVisitante?: number;
}

// Tipos para filtros de búsqueda
export interface FiltrosEventoType {
    fechaInicio?: string; // ISO string
    fechaFin?: string; // ISO string
    deporte?: string;
    liga?: string;
    estado?: EstadoEvento;
    equipos?: string[]; // Para buscar eventos de equipos específicos
}

// Tipos para respuestas paginadas
export interface EventosResponse {
    content: EventoDeportivoResumenType[];
    pageable: {
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    empty: boolean;
}

// Tipos para estadísticas
export interface EstadisticasEventosType {
    totalEventosProximos: number;
    eventosPorDeporte: Record<string, number>;
    eventosPorEstado: Record<string, number>;
    fechaConsulta: string; // ISO string
}

// Tipos para respuestas de operaciones
export interface RespuestaOperacionType {
    status: 'success' | 'error';
    message: string;
}

// Tipos para configuración de eventos en quinielas
export interface EventoQuinielaConfigType {
    eventoId: number;
    quinielaId: number;
    puntosPorAcierto?: number;
    multiplicadorPuntos?: number;
    esObligatorio?: boolean;
    tipoPrediccion?: string;
    fechaCreacion: string; // ISO string
}

// Tipo para agregar eventos a quiniela
export interface AgregarEventosQuinielaRequestType {
    eventosIds: number[];
}

// Tipo para configurar tipo de predicción
export interface ConfigurarTipoPrediccionRequestType {
    tipoPrediccion: string;
    puntosPorAcierto?: number;
    multiplicadorPuntos?: number;
    esObligatorio?: boolean;
}

// Tipos para diferentes deportes con sus características específicas
export interface DeporteConfigType {
    nombre: string;
    tiposPrediccionDisponibles: string[];
    formatoMarcador: 'numerico' | 'sets' | 'puntos';
    permiteDuracion: boolean;
    ligasPrincipales: string[];
}

// Tipo para eventos disponibles para quinielas
export interface EventoDisponibleQuinielaType {
    id: number;
    nombreEvento: string;
    liga: string;
    deporte: string;
    equipoLocal: string;
    equipoVisitante: string;
    fechaEvento: string; // ISO string
    estado: EstadoEvento;
    yaEnQuiniela?: boolean; // Indica si ya está en alguna quiniela activa
    numeroQuinielas?: number; // Número de quinielas que incluyen este evento
}
