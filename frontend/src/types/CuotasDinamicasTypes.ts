// Tipos para las cuotas dinámicas

// Enum para los tipos de resultado basado en el backend
export const TipoResultado = {
  // Resultado Final (1X2)
  LOCAL : 'LOCAL',
  VISITANTE : 'VISITANTE',
  EMPATE : 'EMPATE',
  
  // Clasificación
  LOCAL_CLASIFICA : 'LOCAL_CLASIFICA',
  VISITANTE_CLASIFICA : 'VISITANTE_CLASIFICA',
  
  // Doble Oportunidad
  LOCAL_EMPATE : 'LOCAL_EMPATE',
  LOCAL_VISITANTE : 'LOCAL_VISITANTE',
  VISITANTE_EMPATE : 'VISITANTE_EMPATE',
  
  // Ambos Equipos Anotan
  AMBOS_ANOTAN : 'AMBOS_ANOTAN',
  NO_AMBOS_ANOTAN : 'NO_AMBOS_ANOTAN',
  
  // Total Goles Over/Under
  OVER_0_5 : 'OVER_0_5',
  UNDER_0_5 : 'UNDER_0_5',
  OVER_1_5 : 'OVER_1_5',
  UNDER_1_5 : 'UNDER_1_5',
  OVER_2_5 : 'OVER_2_5',
  UNDER_2_5 : 'UNDER_2_5',
  OVER_3_5 : 'OVER_3_5',
  UNDER_3_5 : 'UNDER_3_5',
  
  // Hándicap Resultado
  LOCAL_MINUS_2 : 'LOCAL_MINUS_2',
  EMPATE_MINUS_2 : 'EMPATE_MINUS_2',
  VISITANTE_PLUS_2 : 'VISITANTE_PLUS_2',
  LOCAL_MINUS_1 : 'LOCAL_MINUS_1',
  EMPATE_MINUS_1 : 'EMPATE_MINUS_1',
  VISITANTE_PLUS_1 : 'VISITANTE_PLUS_1',
  
  // Hándicap Asiático
  LOCAL_MINUS_0_5_1 : 'LOCAL_MINUS_0_5_1',
  VISITANTE_PLUS_0_5_1 : 'VISITANTE_PLUS_0_5_1',
  LOCAL_MINUS_0_5 : 'LOCAL_MINUS_0_5',
  VISITANTE_PLUS_0_5 : 'VISITANTE_PLUS_0_5',
  
  // Total Goles Asiático
  OVER_1_1_5 : 'OVER_1_1_5',
  UNDER_1_1_5 : 'UNDER_1_1_5',
  OVER_0_5_1 : 'OVER_0_5_1',
  UNDER_0_5_1 : 'UNDER_0_5_1',
  
  // Marcador Correcto
  MARCADOR_1_0 : 'MARCADOR_1_0',
  MARCADOR_2_0 : 'MARCADOR_2_0',
  MARCADOR_2_1 : 'MARCADOR_2_1',
  MARCADOR_3_0 : 'MARCADOR_3_0',
  MARCADOR_0_0 : 'MARCADOR_0_0',
  MARCADOR_0_1 : 'MARCADOR_0_1',
  MARCADOR_0_2 : 'MARCADOR_0_2',
  MARCADOR_1_1 : 'MARCADOR_1_1',
  MARCADOR_1_2 : 'MARCADOR_1_2',
  MARCADOR_OTROS : 'MARCADOR_OTROS',
  
  // Primer Goleador
  PRIMER_GOLEADOR_1 : 'PRIMER_GOLEADOR_1',
  PRIMER_GOLEADOR_2 : 'PRIMER_GOLEADOR_2',
  PRIMER_GOLEADOR_3 : 'PRIMER_GOLEADOR_3',
  PRIMER_GOLEADOR_4 : 'PRIMER_GOLEADOR_4',
  PRIMER_GOLEADOR_5 : 'PRIMER_GOLEADOR_5',
  NO_GOL : 'NO_GOL',
  
  // Tarjetas
  OVER_6_5_TARJETAS : 'OVER_6_5_TARJETAS',
  UNDER_6_5_TARJETAS : 'UNDER_6_5_TARJETAS',
  OVER_4_5_TARJETAS : 'OVER_4_5_TARJETAS',
  UNDER_4_5_TARJETAS : 'UNDER_4_5_TARJETAS',
  
  // Corners
  OVER_8_CORNERS : 'OVER_8_CORNERS',
  EXACTO_8_CORNERS : 'EXACTO_8_CORNERS',
  UNDER_8_CORNERS : 'UNDER_8_CORNERS',
  OVER_6_CORNERS : 'OVER_6_CORNERS',
  EXACTO_6_CORNERS : 'EXACTO_6_CORNERS',
  UNDER_6_CORNERS : 'UNDER_6_CORNERS',
  
  // Método de Clasificación
  LOCAL_TIEMPO_REGULAR : 'LOCAL_TIEMPO_REGULAR',
  VISITANTE_TIEMPO_REGULAR : 'VISITANTE_TIEMPO_REGULAR',
  LOCAL_PENALTIS : 'LOCAL_PENALTIS',
  VISITANTE_PENALTIS : 'VISITANTE_PENALTIS',
  
  // Segunda Mitad
  SEGUNDA_MITAD_OVER_1_5 : 'SEGUNDA_MITAD_OVER_1_5',
  SEGUNDA_MITAD_UNDER_1_5 : 'SEGUNDA_MITAD_UNDER_1_5',
  SEGUNDA_MITAD_OVER_0_5 : 'SEGUNDA_MITAD_OVER_0_5',
  SEGUNDA_MITAD_UNDER_0_5 : 'SEGUNDA_MITAD_UNDER_0_5',
  SEGUNDA_MITAD_AMBOS_ANOTAN : 'SEGUNDA_MITAD_AMBOS_ANOTAN',
  SEGUNDA_MITAD_LOCAL : 'SEGUNDA_MITAD_LOCAL',
  SEGUNDA_MITAD_EMPATE : 'SEGUNDA_MITAD_EMPATE',
  SEGUNDA_MITAD_VISITANTE : 'SEGUNDA_MITAD_VISITANTE',
  
  // Tipos heredados del código anterior
  OVER : 'OVER',
  UNDER : 'UNDER',
  HANDICAP_LOCAL : 'HANDICAP_LOCAL',
  HANDICAP_VISITANTE : 'HANDICAP_VISITANTE',
  PRIMER_GOLEADOR : 'PRIMER_GOLEADOR',
  TOTAL_GOLES : 'TOTAL_GOLES',
  AMBOS_EQUIPOS_ANOTAN : 'AMBOS_EQUIPOS_ANOTAN'
} as const;

// Tipo para los valores de TipoResultado
export type TipoResultadoType = typeof TipoResultado[keyof typeof TipoResultado];

// Función auxiliar para obtener descripción del tipo de resultado
export const getTipoResultadoDescription = (tipo: TipoResultadoType): string => {
  const descriptions: Record<TipoResultadoType, string> = {
    [TipoResultado.LOCAL]: 'Victoria Equipo Local',
    [TipoResultado.VISITANTE]: 'Victoria Equipo Visitante',
    [TipoResultado.EMPATE]: 'Empate',
    [TipoResultado.LOCAL_CLASIFICA]: 'Equipo Local se clasifica',
    [TipoResultado.VISITANTE_CLASIFICA]: 'Equipo Visitante se clasifica',
    [TipoResultado.LOCAL_EMPATE]: 'Local o Empate',
    [TipoResultado.LOCAL_VISITANTE]: 'Local o Visitante',
    [TipoResultado.VISITANTE_EMPATE]: 'Visitante o Empate',
    [TipoResultado.AMBOS_ANOTAN]: 'Ambos Equipos Anotan',
    [TipoResultado.NO_AMBOS_ANOTAN]: 'No Ambos Equipos Anotan',
    [TipoResultado.OVER_0_5]: 'Over 0.5 Goles',
    [TipoResultado.UNDER_0_5]: 'Under 0.5 Goles',
    [TipoResultado.OVER_1_5]: 'Over 1.5 Goles',
    [TipoResultado.UNDER_1_5]: 'Under 1.5 Goles',
    [TipoResultado.OVER_2_5]: 'Over 2.5 Goles',
    [TipoResultado.UNDER_2_5]: 'Under 2.5 Goles',
    [TipoResultado.OVER_3_5]: 'Over 3.5 Goles',
    [TipoResultado.UNDER_3_5]: 'Under 3.5 Goles',
    [TipoResultado.LOCAL_MINUS_2]: 'Local (-2)',
    [TipoResultado.EMPATE_MINUS_2]: 'Empate (-2)',
    [TipoResultado.VISITANTE_PLUS_2]: 'Visitante (+2)',
    [TipoResultado.LOCAL_MINUS_1]: 'Local (-1)',
    [TipoResultado.EMPATE_MINUS_1]: 'Empate (-1)',
    [TipoResultado.VISITANTE_PLUS_1]: 'Visitante (+1)',
    [TipoResultado.LOCAL_MINUS_0_5_1]: 'Local (-0.5/-1)',
    [TipoResultado.VISITANTE_PLUS_0_5_1]: 'Visitante (+0.5/+1)',
    [TipoResultado.LOCAL_MINUS_0_5]: 'Local (-0.5)',
    [TipoResultado.VISITANTE_PLUS_0_5]: 'Visitante (+0.5)',
    [TipoResultado.OVER_1_1_5]: 'Over 1/1.5',
    [TipoResultado.UNDER_1_1_5]: 'Under 1/1.5',
    [TipoResultado.OVER_0_5_1]: 'Over 0.5/1',
    [TipoResultado.UNDER_0_5_1]: 'Under 0.5/1',
    [TipoResultado.MARCADOR_1_0]: '1-0',
    [TipoResultado.MARCADOR_2_0]: '2-0',
    [TipoResultado.MARCADOR_2_1]: '2-1',
    [TipoResultado.MARCADOR_3_0]: '3-0',
    [TipoResultado.MARCADOR_0_0]: '0-0',
    [TipoResultado.MARCADOR_0_1]: '0-1',
    [TipoResultado.MARCADOR_0_2]: '0-2',
    [TipoResultado.MARCADOR_1_1]: '1-1',
    [TipoResultado.MARCADOR_1_2]: '1-2',
    [TipoResultado.MARCADOR_OTROS]: 'Cualquier otro marcador',
    [TipoResultado.PRIMER_GOLEADOR_1]: 'Primer Goleador - Jugador 1',
    [TipoResultado.PRIMER_GOLEADOR_2]: 'Primer Goleador - Jugador 2',
    [TipoResultado.PRIMER_GOLEADOR_3]: 'Primer Goleador - Jugador 3',
    [TipoResultado.PRIMER_GOLEADOR_4]: 'Primer Goleador - Jugador 4',
    [TipoResultado.PRIMER_GOLEADOR_5]: 'Primer Goleador - Jugador 5',
    [TipoResultado.NO_GOL]: 'No gol',
    [TipoResultado.OVER_6_5_TARJETAS]: 'Over 6.5 Tarjetas',
    [TipoResultado.UNDER_6_5_TARJETAS]: 'Under 6.5 Tarjetas',
    [TipoResultado.OVER_4_5_TARJETAS]: 'Over 4.5 Tarjetas',
    [TipoResultado.UNDER_4_5_TARJETAS]: 'Under 4.5 Tarjetas',
    [TipoResultado.OVER_8_CORNERS]: 'Over 8 Corners',
    [TipoResultado.EXACTO_8_CORNERS]: 'Exacto 8 Corners',
    [TipoResultado.UNDER_8_CORNERS]: 'Under 8 Corners',
    [TipoResultado.OVER_6_CORNERS]: 'Over 6 Corners',
    [TipoResultado.EXACTO_6_CORNERS]: 'Exacto 6 Corners',
    [TipoResultado.UNDER_6_CORNERS]: 'Under 6 Corners',
    [TipoResultado.LOCAL_TIEMPO_REGULAR]: 'Local en tiempo regular',
    [TipoResultado.VISITANTE_TIEMPO_REGULAR]: 'Visitante en tiempo regular',
    [TipoResultado.LOCAL_PENALTIS]: 'Local en penaltis',
    [TipoResultado.VISITANTE_PENALTIS]: 'Visitante en penaltis',
    [TipoResultado.SEGUNDA_MITAD_OVER_1_5]: '2da Mitad Over 1.5',
    [TipoResultado.SEGUNDA_MITAD_UNDER_1_5]: '2da Mitad Under 1.5',
    [TipoResultado.SEGUNDA_MITAD_OVER_0_5]: '2da Mitad Over 0.5',
    [TipoResultado.SEGUNDA_MITAD_UNDER_0_5]: '2da Mitad Under 0.5',
    [TipoResultado.SEGUNDA_MITAD_AMBOS_ANOTAN]: '2da Mitad - Ambos Anotan',
    [TipoResultado.SEGUNDA_MITAD_LOCAL]: '2da Mitad - Gana Local',
    [TipoResultado.SEGUNDA_MITAD_EMPATE]: '2da Mitad - Empate',
    [TipoResultado.SEGUNDA_MITAD_VISITANTE]: '2da Mitad - Gana Visitante',
    [TipoResultado.OVER]: 'Más de X goles/puntos',
    [TipoResultado.UNDER]: 'Menos de X goles/puntos',
    [TipoResultado.HANDICAP_LOCAL]: 'Hándicap Local',
    [TipoResultado.HANDICAP_VISITANTE]: 'Hándicap Visitante',
    [TipoResultado.PRIMER_GOLEADOR]: 'Primer Goleador',
    [TipoResultado.TOTAL_GOLES]: 'Total de Goles',
    [TipoResultado.AMBOS_EQUIPOS_ANOTAN]: 'Ambos Equipos Anotan'
  };
  
  return descriptions[tipo] || tipo;
};

// Función auxiliar para obtener el mercado al que pertenece un tipo de resultado
export const getTipoResultadoMercado = (tipo: TipoResultadoType): string => {
  const resultadoFinal: TipoResultadoType[] = [TipoResultado.LOCAL, TipoResultado.VISITANTE, TipoResultado.EMPATE];
  if (resultadoFinal.includes(tipo)) {
    return 'resultado-final';
  }
  
  const clasificacion: TipoResultadoType[] = [TipoResultado.LOCAL_CLASIFICA, TipoResultado.VISITANTE_CLASIFICA];
  if (clasificacion.includes(tipo)) {
    return 'clasificacion';
  }
  
  const dobleOportunidad: TipoResultadoType[] = [TipoResultado.LOCAL_EMPATE, TipoResultado.LOCAL_VISITANTE, TipoResultado.VISITANTE_EMPATE];
  if (dobleOportunidad.includes(tipo)) {
    return 'doble-oportunidad';
  }
  
  const ambosAnotan: TipoResultadoType[] = [TipoResultado.AMBOS_ANOTAN, TipoResultado.NO_AMBOS_ANOTAN];
  if (ambosAnotan.includes(tipo)) {
    return 'ambos-anotan';
  }
  
  const totalGoles: TipoResultadoType[] = [TipoResultado.OVER_0_5, TipoResultado.UNDER_0_5, TipoResultado.OVER_1_5, TipoResultado.UNDER_1_5, TipoResultado.OVER_2_5, TipoResultado.UNDER_2_5, TipoResultado.OVER_3_5, TipoResultado.UNDER_3_5];
  if (totalGoles.includes(tipo)) {
    return 'total-goles';
  }
  
  const handicapResultado: TipoResultadoType[] = [TipoResultado.LOCAL_MINUS_2, TipoResultado.EMPATE_MINUS_2, TipoResultado.VISITANTE_PLUS_2, TipoResultado.LOCAL_MINUS_1, TipoResultado.EMPATE_MINUS_1, TipoResultado.VISITANTE_PLUS_1];
  if (handicapResultado.includes(tipo)) {
    return 'handicap-resultado';
  }
  
  const handicapAsiatico: TipoResultadoType[] = [TipoResultado.LOCAL_MINUS_0_5_1, TipoResultado.VISITANTE_PLUS_0_5_1, TipoResultado.LOCAL_MINUS_0_5, TipoResultado.VISITANTE_PLUS_0_5];
  if (handicapAsiatico.includes(tipo)) {
    return 'handicap-asiatico';
  }
  
  const totalAsiatico: TipoResultadoType[] = [TipoResultado.OVER_1_1_5, TipoResultado.UNDER_1_1_5, TipoResultado.OVER_0_5_1, TipoResultado.UNDER_0_5_1];
  if (totalAsiatico.includes(tipo)) {
    return 'total-asiatico';
  }
  
  const marcadorCorrecto: TipoResultadoType[] = [TipoResultado.MARCADOR_1_0, TipoResultado.MARCADOR_2_0, TipoResultado.MARCADOR_2_1, TipoResultado.MARCADOR_3_0, TipoResultado.MARCADOR_0_0, TipoResultado.MARCADOR_0_1, TipoResultado.MARCADOR_0_2, TipoResultado.MARCADOR_1_1, TipoResultado.MARCADOR_1_2, TipoResultado.MARCADOR_OTROS];
  if (marcadorCorrecto.includes(tipo)) {
    return 'marcador-correcto';
  }
  
  const anotadores: TipoResultadoType[] = [TipoResultado.PRIMER_GOLEADOR_1, TipoResultado.PRIMER_GOLEADOR_2, TipoResultado.PRIMER_GOLEADOR_3, TipoResultado.PRIMER_GOLEADOR_4, TipoResultado.PRIMER_GOLEADOR_5, TipoResultado.NO_GOL];
  if (anotadores.includes(tipo)) {
    return 'anotadores';
  }
  
  const tarjetas: TipoResultadoType[] = [TipoResultado.OVER_6_5_TARJETAS, TipoResultado.UNDER_6_5_TARJETAS, TipoResultado.OVER_4_5_TARJETAS, TipoResultado.UNDER_4_5_TARJETAS];
  if (tarjetas.includes(tipo)) {
    return 'tarjetas';
  }
  
  const corners: TipoResultadoType[] = [TipoResultado.OVER_8_CORNERS, TipoResultado.EXACTO_8_CORNERS, TipoResultado.UNDER_8_CORNERS, TipoResultado.OVER_6_CORNERS, TipoResultado.EXACTO_6_CORNERS, TipoResultado.UNDER_6_CORNERS];
  if (corners.includes(tipo)) {
    return 'corners';
  }
  
  const metodoClasificacion: TipoResultadoType[] = [TipoResultado.LOCAL_TIEMPO_REGULAR, TipoResultado.VISITANTE_TIEMPO_REGULAR, TipoResultado.LOCAL_PENALTIS, TipoResultado.VISITANTE_PENALTIS];
  if (metodoClasificacion.includes(tipo)) {
    return 'metodo-clasificacion';
  }
  
  const mitades: TipoResultadoType[] = [TipoResultado.SEGUNDA_MITAD_OVER_1_5, TipoResultado.SEGUNDA_MITAD_UNDER_1_5, TipoResultado.SEGUNDA_MITAD_OVER_0_5, TipoResultado.SEGUNDA_MITAD_UNDER_0_5, TipoResultado.SEGUNDA_MITAD_AMBOS_ANOTAN, TipoResultado.SEGUNDA_MITAD_LOCAL, TipoResultado.SEGUNDA_MITAD_EMPATE, TipoResultado.SEGUNDA_MITAD_VISITANTE];
  if (mitades.includes(tipo)) {
    return 'mitades';
  }
  
  return 'otros';
}

// Tipos para las cuotas dinámicas
export interface CuotaEvento {
  id: number;
  eventoId: number;
  tipoResultado: string;
  valorCuota: number;
  cuotaAnterior: number;
  fechaActualizacion: string;
  activa: boolean;
  estado:string;
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