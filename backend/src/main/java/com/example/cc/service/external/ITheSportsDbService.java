package com.example.cc.service.external;

import com.example.cc.dto.external.TheSportsDbEventResponse;
import com.example.cc.dto.response.TheSportsDbSportResponse;
import com.example.cc.dto.response.TheSportsDbLeagueResponse;
import com.example.cc.entities.TipoResultado;
import com.example.cc.service.external.TheSportsDbService.ResumenCuotasOperacion;

import java.util.List;
import java.util.Map;

/**
 * Interfaz para el servicio de integración con TheSportsDB
 */
public interface ITheSportsDbService {

    /**
     * Obtener eventos próximos desde TheSportsDB
     * @return Lista de eventos próximos
     */
    List<TheSportsDbEventResponse.EventData> getUpcomingEvents();

    /**
     * Obtener eventos por liga
     * @param leagueId ID de la liga
     * @return Lista de eventos de la liga
     */
    List<TheSportsDbEventResponse.EventData> getEventsByLeague(String leagueId);

    /**
     * Obtener eventos por deporte
     * @param sport Nombre del deporte
     * @return Lista de eventos del deporte
     */
    List<TheSportsDbEventResponse.EventData> getEventsBySport(String sport);

    /**
     * Obtener todos los deportes disponibles desde TheSportsDB
     * @return Lista de deportes disponibles
     */
    List<TheSportsDbSportResponse.SportData> obtenerTodosLosDeportes();

    /**
     * Obtener todas las ligas disponibles desde TheSportsDB
     * @return Lista de ligas disponibles
     */
    List<TheSportsDbLeagueResponse.LeagueData> obtenerTodasLasLigas();

    // ===== MÉTODOS ESPECÍFICOS PARA V2 API =====

    /**
     * Obtener eventos por fecha usando v2 API (más actualizados)
     * @param date Fecha en formato yyyy-MM-dd
     * @return Lista de eventos para la fecha específica
     */
    List<TheSportsDbEventResponse.EventData> obtenerEventosPorFechaV2(String date);

    /**
     * Obtener eventos de la siguiente semana usando v2 API
     * @return Lista de eventos de los próximos 7 días
     */
    List<TheSportsDbEventResponse.EventData> obtenerEventosProximaSemanaV2();

    /**
     * Obtener eventos en vivo usando v2 API
     * @return Lista de eventos que están siendo jugados ahora
     */
    List<TheSportsDbEventResponse.EventData> obtenerEventosEnVivoV2();

    // ===== MÉTODOS PARA LIVESCORES Y GUARDADO EN BD =====

    /**
     * Obtener livescores actuales de todos los eventos del día y guardarlos en BD
     * @return Lista de eventos deportivos actualizados con livescores
     */
    List<com.example.cc.entities.EventoDeportivo> obtenerYGuardarLivescoresActuales();

    /**
     * Obtener livescores específicos para eventos en vivo y actualizarlos en BD
     * @return Lista de eventos deportivos en vivo con livescores actualizados
     */
    List<com.example.cc.entities.EventoDeportivo> obtenerLivescoresEventosEnVivo();

    // ===== MÉTODOS PARA VERIFICACIÓN Y CREACIÓN DE CUOTAS =====

    /**
     * Verificar si un evento tiene todas sus cuotas completas
     * @param eventoId ID del evento a verificar
     * @return true si tiene todas las cuotas, false si faltan algunas
     */
    boolean verificarCuotasCompletas(Long eventoId);

    /**
     * Determinar qué tipos de cuotas faltan para un evento
     * @param eventoId ID del evento a verificar
     * @return Lista de tipos de resultado que faltan
     */
    List<TipoResultado> determinarCuotasFaltantes(Long eventoId);

    /**
     * Crear cuotas faltantes para un evento específico
     * @param eventoId ID del evento
     * @return true si se crearon cuotas, false si no fue necesario o hubo error
     */
    boolean crearCuotasFaltantes(Long eventoId);

    /**
     * Verificar y crear cuotas para múltiples eventos
     * @param eventosIds Lista de IDs de eventos a verificar
     * @return ResumenCuotasOperacion con estadísticas de la operación
     */
    ResumenCuotasOperacion verificarYCrearCuotasMultiples(List<Long> eventosIds);

    /**
     * Verificar cuotas para eventos "programados" y "en_vivo"
     * @return ResumenCuotasOperacion con el resultado de la operación
     */
    ResumenCuotasOperacion verificarCuotasEventosActivos();

    /**
     * Verificar y crear cuotas para eventos por estados específicos
     * @param estados Lista de estados a verificar (ej: ["programado", "en_vivo"])
     * @return ResumenCuotasOperacion con estadísticas de la operación
     */
    ResumenCuotasOperacion verificarCuotasEventosPorEstados(List<String> estados);

    /**
     * Verificar cuotas para eventos de hoy y los próximos días
     * @param diasAdelante Número de días a verificar desde hoy
     * @return ResumenCuotasOperacion con estadísticas de la operación
     */
    ResumenCuotasOperacion verificarCuotasEventosProximos(int diasAdelante);

    /**
     * Obtener estadísticas de cuotas para un evento específico
     * @param eventoId ID del evento
     * @return Map con estadísticas de cuotas
     */
    Map<String, Object> obtenerEstadisticasCuotasEvento(Long eventoId);

    /**
     * Verificar cuotas para un evento específico con detalles completos
     * @param eventoId ID del evento
     * @return Map con información detallada del estado de las cuotas
     */
    Map<String, Object> verificarCuotasDetalladasEvento(Long eventoId);

    /**
     * Forzar creación de cuotas para un evento, incluso si ya existen
     * @param eventoId ID del evento
     * @return true si se crearon cuotas, false en caso contrario
     */
    boolean forzarCreacionCuotas(Long eventoId);
}
