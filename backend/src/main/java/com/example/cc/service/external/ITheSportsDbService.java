package com.example.cc.service.external;

import com.example.cc.dto.external.TheSportsDbEventResponse;

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
}
