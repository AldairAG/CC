// Tipos para las cuotas dinámicas
export interface CuotaEvento {
  id: number;
  eventoId: number;
  tipoResultado: string;
  cuotaActual: number;
  cuotaAnterior: number;
  fechaActualizacion: string;
  activa: boolean;
}

export interface CuotaHistorial {
  id: number;
  cuotaEventoId: number;
  cuotaAnterior: number;
  cuotaNueva: number;
  fechaCambio: string;
  motivoCambio: string;
  volumenAcumulado: number;
}

export interface TendenciaCuota {
  tipoResultado: string;
  cuotaActual: number;
  tendencia: 'SUBIENDO' | 'BAJANDO' | 'ESTABLE';
  porcentajeCambio: number;
  volumenTotal: number;
}

export interface VolumenApuestas {
  eventoId: number;
  tipoResultado: string;
  volumenTotal: number;
  numeroApuestas: number;
  fechaUltimaApuesta: string;
}

export interface EstadisticasCuotas {
  eventoId: number;
  totalMercados: number;
  mercadoMasPopular: string;
  volumenTotalEvento: number;
  ultimaActualizacion: string;
}

export interface ConfiguracionCuotas {
  intervaloActualizacion: number;
  limiteTendencia: number;
  notificacionesCambios: boolean;
  filtrosTendencia: string[];
}

export interface AlertaCuota {
  id: number;
  eventoId: number;
  tipoResultado: string;
  cuotaObjetivo: number;
  direccion: 'MAYOR' | 'MENOR';
  activa: boolean;
  fechaCreacion: string;
}

export interface ResumenCuotas {
  totalEventos: number;
  totalCuotas: number;
  cuotasActualizadas: number;
  tendenciasPositivas: number;
  tendenciasNegativas: number;
  ultimaActualizacion: string;
}

export interface FiltroCuotas {
  eventoId?: number;
  tipoResultado?: string;
  tendencia?: 'SUBIENDO' | 'BAJANDO' | 'ESTABLE';
  cuotaMinima?: number;
  cuotaMaxima?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  activa?: boolean;
}

export interface PaginacionCuotas {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CuotasDinamicasState {
  // Datos principales
  cuotasEvento: CuotaEvento[];
  historialCuotas: CuotaHistorial[];
  tendenciaCuotas: TendenciaCuota[];
  volumenApuestas: VolumenApuestas[];
  estadisticasCuotas: EstadisticasCuotas | null;
  resumenCuotas: ResumenCuotas | null;
  alertasCuotas: AlertaCuota[];
  
  // Configuración
  configuracion: ConfiguracionCuotas;
  
  // Filtros y búsqueda
  filtros: FiltroCuotas;
  busqueda: string;
  
  // Paginación
  paginacion: PaginacionCuotas;
  
  // Estados de carga
  loading: {
    cuotasEvento: boolean;
    historialCuotas: boolean;
    tendenciaCuotas: boolean;
    volumenApuestas: boolean;
    estadisticasCuotas: boolean;
    resumenCuotas: boolean;
    alertasCuotas: boolean;
    actualizandoCuotas: boolean;
    procesandoAlertas: boolean;
  };
  
  // Estados de error
  error: {
    cuotasEvento: string | null;
    historialCuotas: string | null;
    tendenciaCuotas: string | null;
    volumenApuestas: string | null;
    estadisticasCuotas: string | null;
    resumenCuotas: string | null;
    alertasCuotas: string | null;
    actualizarCuotas: string | null;
    procesarAlertas: string | null;
  };
  
  // Estado de conexión en tiempo real
  conexionTiempoReal: {
    conectado: boolean;
    ultimaActualizacion: string | null;
    intentosReconexion: number;
  };
}

// Tipo para las cuotas detalladas con información del evento
export interface CuotasMercadoDetalladas {
  eventoId: number;
  nombreEvento: string;
  equipoLocal: string;
  equipoVisitante: string;
  cuotasPorMercado: Record<string, CuotaEvento[]>;
  totalCuotas: number;
  totalMercados: number;
}

// Tipo para la respuesta de generación de cuotas
export interface RespuestaGeneracionCuotas {
  status: string;
  message: string;
  eventoId: number;
  nombreEvento: string;
  totalCuotas: number;
  mercados: number;
}

// Tipo para la respuesta de generación de cuotas faltantes
export interface RespuestaGeneracionCuotasFaltantes {
  status: string;
  message: string;
  totalEventos: number;
  eventosConCuotasGeneradas: number;
  eventosConErrores: number;
}