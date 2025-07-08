package com.example.cc.service.external;

import com.example.cc.dto.external.TheSportsDbEventResponse;
import com.example.cc.dto.response.TheSportsDbSportResponse;
import com.example.cc.dto.response.TheSportsDbLeagueResponse;

import java.util.List;

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
}
