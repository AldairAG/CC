// Servicios de Casino - Barrel exports
export { QuinielaService } from './quinielaService';
export { EventoService } from './eventoService';
export { apiClient } from './ApiCliente';

// Re-exportar tipos relacionados
export type {
    QuinielaType,
    QuinielaResumenType,
    CrearQuinielaRequestType,
    RankingParticipacionType,
    PrediccionRequestType,
    QuinielaParticipacionType,
    QuinielasResponse,
    EstadisticasQuinielaType,
    TipoQuiniela,
    TipoDistribucion,
    EstadoQuiniela,
    EstadoParticipacion
} from '../../types/QuinielaType';

export type {
    EventoDeportivoType,
    EventoDeportivoResumenType,
    FiltrosEventoType,
    EstadisticasEventosType,
    RespuestaOperacionType,
    EventoDisponibleQuinielaType,
    ConfigurarTipoPrediccionRequestType,
    EventoQuinielaConfigType,
    EstadoEvento,
    ResultadoEvento,
    TipoDeporte
} from '../../types/EventoDeportivoTypes';
