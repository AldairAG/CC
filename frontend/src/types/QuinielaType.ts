// Enums de Quiniela (usando const assertions)
export const TipoQuiniela = {
    CLASICA: 'CLASICA',
    CLASICA_MEJORADA: 'CLASICA_MEJORADA',
    EXPRESS: 'EXPRESS',
    SUPERVIVENCIA: 'SUPERVIVENCIA',
    PREDICTOR_EXACTO: 'PREDICTOR_EXACTO',
    CHALLENGE_MENSUAL: 'CHALLENGE_MENSUAL',
    SOCIAL_GRUPOS: 'SOCIAL_GRUPOS',
    MULTI_DEPORTE: 'MULTI_DEPORTE',
    COMBO_ACUMULADA: 'COMBO_ACUMULADA'
} as const;

export type TipoQuiniela = typeof TipoQuiniela[keyof typeof TipoQuiniela];

export const TipoDistribucion = {
    WINNER_TAKES_ALL: 'WINNER_TAKES_ALL',
    TOP_3_CLASICA: 'TOP_3_CLASICA',
    TOP_5_PIRAMIDE: 'TOP_5_PIRAMIDE',
    TOP_10_ESCALONADA: 'TOP_10_ESCALONADA',
    POR_ACIERTOS_PROGRESIVO: 'POR_ACIERTOS_PROGRESIVO',
    GARANTIZADA_PROGRESIVA: 'GARANTIZADA_PROGRESIVA',
    SISTEMA_LIGAS: 'SISTEMA_LIGAS',
    PERSONALIZADA: 'PERSONALIZADA'
} as const;

export type TipoDistribucion = typeof TipoDistribucion[keyof typeof TipoDistribucion];

export const EstadoQuiniela = {
    BORRADOR: 'BORRADOR',
    ACTIVA: 'ACTIVA',
    CERRADA: 'CERRADA',
    EN_RESOLUCION: 'EN_RESOLUCION',
    FINALIZADA: 'FINALIZADA',
    CANCELADA: 'CANCELADA'
} as const;

export type EstadoQuiniela = typeof EstadoQuiniela[keyof typeof EstadoQuiniela];

export const EstadoParticipacion = {
    ACTIVA: 'ACTIVA',
    PREDICCIONES_COMPLETADAS: 'PREDICCIONES_COMPLETADAS',
    FINALIZADA: 'FINALIZADA',
    GANADORA: 'GANADORA',
    CANCELADA: 'CANCELADA'
} as const;

export type EstadoParticipacion = typeof EstadoParticipacion[keyof typeof EstadoParticipacion];

// Configuración específica para distribución de premios
export interface ConfiguracionDistribucion {
    // Configuración para TOP_3_CLASICA, TOP_5_PIRAMIDE, etc.
    porcentajes?: {
        primerLugar?: number;
        segundoLugar?: number;
        tercerLugar?: number;
        cuartoLugar?: number;
        quintoLugar?: number;
        [key: string]: number | undefined; // Para posiciones adicionales
    };
    
    // Configuración para POR_ACIERTOS_PROGRESIVO
    bonusPorAcierto?: {
        puntosPorAcierto?: number;
        puntosPorResultadoExacto?: number;
        multiplicadorRachaAciertos?: number;
        bonusPrediccionPerfecta?: number;
    };
    
    // Configuración para SISTEMA_LIGAS
    configuracionLigas?: {
        numeroLigas?: number;
        participantesPorLiga?: number;
        porcentajeAscenso?: number;
        porcentajeDescenso?: number;
    };
    
    // Configuración para PERSONALIZADA
    premiosPersonalizados?: Array<{
        posicion: number;
        porcentaje?: number;
        montoFijo?: number;
        descripcion?: string;
    }>;
    
    // Configuración general
    premioMinimoGarantizado?: number;
    aplicarComisionesAntes?: boolean;
    distribucionAutomatica?: boolean;
    requiereReclamacion?: boolean;
    diasParaReclamar?: number;
    
    // Configuración para crypto
    permiteCrypto?: boolean;
    cryptoTiposPermitidos?: string[];
    
    // Configuración avanzada
    multiplicadorEventoEspecial?: number;
    bonusParticipacionCompleta?: number;
    penalizacionParticipacionIncompleta?: number;
}

// Tipos de datos principales
export interface QuinielaType {
    id: number;
    codigoUnico: string;
    nombre: string;
    descripcion: string;
    tipoQuiniela: TipoQuiniela;
    tipoDistribucion: TipoDistribucion;
    costoParticipacion: number;
    premioMinimo: number;
    poolActual: number;
    participantesActuales: number;
    maxParticipantes: number;
    fechaInicio: string; // ISO string
    fechaCierre: string; // ISO string
    fechaFinalizacion?: string; // ISO string
    estado: EstadoQuiniela;
    esPublica: boolean;
    requiereAprobacion: boolean;
    reglasEspeciales?: string;
    requiereMinParticipantes?: number;
    porcentajeCasa?: number;
    porcentajeCreador?: number;
    configuracionDistribucion?: ConfiguracionDistribucion;
    creadorId: number;
    nombreCreador?: string;
    totalEventos?: number;
    fechaCreacion: string; // ISO string
    fechaActualizacion: string; // ISO string
}

export interface QuinielaResumenType {
    id: number;
    codigoUnico: string;
    nombre: string;
    descripcion: string;
    tipoQuiniela: TipoQuiniela;
    tipoDistribucion: TipoDistribucion;
    costoParticipacion: number;
    poolActual: number;
    participantesActuales: number;
    maxParticipantes: number;
    fechaInicio: string; // ISO string
    fechaCierre: string; // ISO string
    estado: EstadoQuiniela;
    esPublica: boolean;
    nombreCreador?: string;
    totalEventos?: number;
}

export interface CrearQuinielaRequestType {
    nombre: string;
    descripcion: string;
    tipoQuiniela: TipoQuiniela;
    tipoDistribucion: TipoDistribucion;
    costoParticipacion: number;
    premioMinimo: number;
    maxParticipantes: number;
    fechaInicio: string; // ISO string
    fechaCierre: string; // ISO string
    creadorId: number;
    esPublica?: boolean;
    requiereAprobacion?: boolean;
    reglasEspeciales?: string;
    requiereMinParticipantes?: number;
    porcentajeCasa?: number;
    porcentajeCreador?: number;
    configuracionDistribucion?: ConfiguracionDistribucion;
}

export interface RankingParticipacionType {
    participacionId: number;
    nombreUsuario: string;
    aciertos: number;
    puntuacion: number;
    premioGanado: number;
    posicion: number;
}

export interface PrediccionRequestType {
    eventoId: number;
    prediccion: string;
    confianza: number; // 1-5 nivel de confianza
}

export interface QuinielaParticipacionType {
    id: number;
    quinielaId: number;
    usuarioId: number;
    fechaParticipacion: string; // ISO string
    montoApostado: number;
    estado: EstadoParticipacion;
    aciertos?: number;
    puntuacion?: number;
    premioGanado?: number;
    posicionFinal?: number;
}

// Tipos de respuesta de la API
export interface QuinielasResponse {
    content: QuinielaResumenType[];
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

export interface EstadisticasQuinielaType {
    totalQuinielas: number;
    quinielasActivas: number;
    totalUsuarios: number;
    totalParticipaciones: number;
    poolTotalActivo: number;
    quinielasProximasACerrar: number;
}
