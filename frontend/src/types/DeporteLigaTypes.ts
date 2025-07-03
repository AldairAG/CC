// Tipos para las nuevas entidades Deporte y Liga

export interface DeporteType {
    id: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    icono?: string;
    colorPrimario?: string;
    fechaCreacion: string; // ISO string
    fechaActualizacion: string; // ISO string
}

export interface LigaType {
    id: number;
    nombre: string;
    descripcion?: string;
    activa: boolean;
    pais?: string;
    ligaIdExterno?: string;
    logo?: string;
    temporadaActual?: number;
    fechaCreacion: string; // ISO string
    fechaActualizacion: string; // ISO string
    // Relación con deporte
    deporte: DeporteType;
}

// Versiones extendidas con relaciones (para cuando se incluyan en las respuestas)
export interface DeporteConRelaciones extends DeporteType {
    ligas?: LigaType[];
}

export interface LigaConRelaciones extends LigaType {
    deporte: DeporteType;
}

// Tipos para crear/actualizar entidades (sin campos autogenerados)
export interface CrearDeporteRequest {
    nombre: string;
    descripcion?: string;
    activo?: boolean;
    icono?: string;
    colorPrimario?: string;
}

export interface ActualizarDeporteRequest extends CrearDeporteRequest {
    id: number;
}

export interface CrearLigaRequest {
    nombre: string;
    descripcion?: string;
    activa?: boolean;
    pais?: string;
    ligaIdExterno?: string;
    logo?: string;
    temporadaActual?: number;
    deporteId: number; // ID del deporte al que pertenece
}

export interface ActualizarLigaRequest extends CrearLigaRequest {
    id: number;
}

// Tipos para filtros y consultas
export interface FiltrosEventoDeportivo {
    fechaInicio?: string;
    fechaFin?: string;
    deporteNombre?: string;
    ligaNombre?: string;
    estado?: string;
}

export interface EstadisticasEventos {
    totalEventosProximos: number;
    eventosPorDeporte: Record<string, number>;
    eventosPorEstado: Record<string, number>;
    fechaConsulta: string;
}
