package com.example.cc.service.external;

import com.example.cc.dto.external.TheSportsDbEventResponse;
import com.example.cc.dto.response.TheSportsDbSportResponse;
import com.example.cc.dto.response.TheSportsDbLeagueResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class TheSportsDbService implements ITheSportsDbService {

    private final RestTemplate restTemplate;
    
    @Value("${thesportsdb.api.base-url}")
    private String baseUrl;
    
    @Value("${thesportsdb.api.key}")
    private String apiKey;

    public TheSportsDbService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Obtener eventos de los próximos 7 días
     */
    public List<TheSportsDbEventResponse.EventData> getUpcomingEvents() {
        List<TheSportsDbEventResponse.EventData> allEvents = new ArrayList<>();
        
        try {
            // Obtener eventos para los próximos 7 días
            LocalDate today = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            
            for (int i = 0; i < 7; i++) {
                LocalDate targetDate = today.plusDays(i);
                String dateStr = targetDate.format(formatter);
                
                log.info("Obteniendo eventos para la fecha: {}", dateStr);
                List<TheSportsDbEventResponse.EventData> dailyEvents = getEventsByDate(dateStr);
                
                if (dailyEvents != null && !dailyEvents.isEmpty()) {
                    allEvents.addAll(dailyEvents);
                    log.info("Se encontraron {} eventos para la fecha {}", dailyEvents.size(), dateStr);
                }
                
                // Pequeña pausa para no sobrecargar la API
                Thread.sleep(500);
            }
            
            log.info("Total de eventos obtenidos: {}", allEvents.size());
            
        } catch (Exception e) {
            log.error("Error al obtener eventos de TheSportsDB: {}", e.getMessage(), e);
        }
        
        return allEvents;
    }

    /**
     * Obtener eventos por fecha específica
     */
    private List<TheSportsDbEventResponse.EventData> getEventsByDate(String date) {
        try {
            String url = baseUrl + "/eventsday.php?d=" + date;
            log.debug("Llamando a URL: {}", url);
            
            TheSportsDbEventResponse response = restTemplate.getForObject(url, TheSportsDbEventResponse.class);
            
            if (response != null && response.getEvents() != null) {
                return response.getEvents();
            }
            
        } catch (RestClientException e) {
            log.error("Error al obtener eventos para la fecha {}: {}", date, e.getMessage());
        }
        
        return new ArrayList<>();
    }

    /**
     * Obtener eventos de ligas específicas (opcional)
     */
    public List<TheSportsDbEventResponse.EventData> getEventsByLeague(String leagueId) {
        try {
            String url = baseUrl + "/eventsnextleague.php?id=" + leagueId;
            log.debug("Obteniendo eventos de liga: {}", url);
            
            TheSportsDbEventResponse response = restTemplate.getForObject(url, TheSportsDbEventResponse.class);
            
            if (response != null && response.getEvents() != null) {
                return response.getEvents();
            }
            
        } catch (RestClientException e) {
            log.error("Error al obtener eventos de liga {}: {}", leagueId, e.getMessage());
        }
        
        return new ArrayList<>();
    }

    /**
     * Obtener eventos de deportes específicos (opcional)
     */
    public List<TheSportsDbEventResponse.EventData> getEventsBySport(String sport) {
        try {
            // Este endpoint puede no estar disponible en la versión gratuita
            String url = baseUrl + "/eventsport.php?s=" + sport;
            log.debug("Obteniendo eventos de deporte: {}", url);
            
            TheSportsDbEventResponse response = restTemplate.getForObject(url, TheSportsDbEventResponse.class);
            
            if (response != null && response.getEvents() != null) {
                return response.getEvents();
            }
            
        } catch (RestClientException e) {
            log.error("Error al obtener eventos de deporte {}: {}", sport, e.getMessage());
        }
        
        return new ArrayList<>();
    }

    /**
     * Obtener todos los deportes disponibles desde TheSportsDB
     */
    @Override
    public List<TheSportsDbSportResponse.SportData> obtenerTodosLosDeportes() {
        try {
            String url = baseUrl + "/all_sports.php";
            log.info("Obteniendo todos los deportes desde: {}", url);
            
            TheSportsDbSportResponse response = restTemplate.getForObject(url, TheSportsDbSportResponse.class);
            
            if (response != null && response.getSports() != null) {
                log.info("Se encontraron {} deportes en TheSportsDB", response.getSports().size());
                return response.getSports();
            } else {
                log.warn("No se encontraron deportes en la respuesta de TheSportsDB");
                return new ArrayList<>();
            }
            
        } catch (RestClientException e) {
            log.error("Error al obtener deportes de TheSportsDB: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Obtener todas las ligas disponibles desde TheSportsDB
     */
    @Override
    public List<TheSportsDbLeagueResponse.LeagueData> obtenerTodasLasLigas() {
        try {
            String url = baseUrl + "/all_leagues.php";
            log.info("Obteniendo todas las ligas desde: {}", url);
            
            TheSportsDbLeagueResponse response = restTemplate.getForObject(url, TheSportsDbLeagueResponse.class);
            
            if (response != null && response.getLeagues() != null) {
                log.info("Se encontraron {} ligas en TheSportsDB", response.getLeagues().size());
                return response.getLeagues();
            } else {
                log.warn("No se encontraron ligas en la respuesta de TheSportsDB");
                return new ArrayList<>();
            }
            
        } catch (RestClientException e) {
            log.error("Error al obtener ligas de TheSportsDB: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
}
