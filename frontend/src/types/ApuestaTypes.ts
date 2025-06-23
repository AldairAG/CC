export interface Apuesta {
  id: string;
  eventoId: string;
  eventoNombre: string;
  equipoLocal: string;
  equipoVisitante: string;
  tipoApuesta: TipoApuesta;
  opcionSeleccionada: string;
  cuota: number;
  montoApuesta: number;
  gananciasPotenciales: number;
  fechaCreacion: Date;
  fechaEvento: string;
}

export const TipoApuesta = {
  GANADOR: 'ganador',
  EMPATE: 'empate',
  MARCADOR_EXACTO: 'marcador_exacto',
  OVER_UNDER: 'over_under',
  DOBLE_OPORTUNIDAD: 'doble_oportunidad',
  HANDICAP: 'handicap'
} as const;

export type TipoApuesta = typeof TipoApuesta[keyof typeof TipoApuesta];

export interface OpcionApuesta {
  id: string;
  nombre: string;
  cuota: number;
  activa: boolean;
}

export interface CuotasEvento {
  eventoId: string;
  local: OpcionApuesta;
  empate: OpcionApuesta;
  visitante: OpcionApuesta;
  overUnder?: {
    over25: OpcionApuesta;
    under25: OpcionApuesta;
  };
  marcadorExacto?: OpcionApuesta[];
}

export interface EstadisticasCarrito {
  totalApuestas: number;
  montoTotal: number;
  gananciasPotenciales: number;
  cuotaTotal: number;
}

export interface CarritoApuestasState {
  apuestas: Apuesta[];
  isOpen: boolean;
  estadisticas: EstadisticasCarrito;
}
