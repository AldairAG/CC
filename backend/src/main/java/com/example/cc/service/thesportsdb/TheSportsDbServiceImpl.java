package com.example.cc.service.thesportsdb;

import com.example.cc.dto.response.TheSportsDbEventResponse;
import com.example.cc.dto.response.TheSportsDbTeamResponse;
import com.example.cc.dto.response.TheSportsDbLeagueResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
@Slf4j
public class TheSportsDbServiceImpl implements ITheSportsDbService {
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Value("${thesportsdb.api.key:722804}")
    private String apiKey;
    
    private static final String BASE_URL = "https://www.thesportsdb.com/api/v1/json";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    // Estadísticas de uso
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong successfulRequests = new AtomicLong(0);
    private final AtomicLong failedRequests = new AtomicLong(0);
    
    // ===== MÉTODOS DE EVENTOS =====
    
    @Override
    @Cacheable(value = "thesportsdb-events", key = "#idEvento")
    public Optional<TheSportsDbEventResponse> buscarEventoPorId(String idEvento) {
        log.info("Buscando evento por ID: {}", idEvento);
        
        try {
            String url = String.format("%s/%s/lookupevent.php?id=%s", BASE_URL, apiKey, idEvento);
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para evento con ID: {}", idEvento);
                return Optional.empty();
            }
            
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode eventsNode = jsonNode.get("events");
            
            if (eventsNode != null && eventsNode.isArray() && eventsNode.size() > 0) {
                TheSportsDbEventResponse evento = mapearEvento(eventsNode.get(0));
                log.info("Evento encontrado: {} vs {}", evento.getStrHomeTeam(), evento.getStrAwayTeam());
                return Optional.of(evento);
            }
            
            log.warn("No se encontró evento con ID: {}", idEvento);
            return Optional.empty();
            
        } catch (Exception e) {
            log.error("Error al buscar evento por ID {}: {}", idEvento, e.getMessage());
            failedRequests.incrementAndGet();
            return Optional.empty();
        }
    }
    
    @Override
    @Cacheable(value = "thesportsdb-events-teams", key = "#equipoLocal + '_' + #equipoVisitante")
    public List<TheSportsDbEventResponse> buscarEventosPorEquipos(String equipoLocal, String equipoVisitante) {
        log.info("Buscando eventos entre {} y {}", equipoLocal, equipoVisitante);
        
        try {
            // Buscar eventos del equipo local
            List<TheSportsDbEventResponse> eventosLocal = buscarEventosPorEquipo(equipoLocal);
            
            // Filtrar eventos donde juegue contra el equipo visitante
            List<TheSportsDbEventResponse> eventosCoincidentes = eventosLocal.stream()
                    .filter(evento -> 
                        (evento.getStrHomeTeam().equalsIgnoreCase(equipoLocal) && 
                         evento.getStrAwayTeam().equalsIgnoreCase(equipoVisitante)) ||
                        (evento.getStrHomeTeam().equalsIgnoreCase(equipoVisitante) && 
                         evento.getStrAwayTeam().equalsIgnoreCase(equipoLocal))
                    )
                    .toList();
            
            log.info("Encontrados {} eventos entre {} y {}", eventosCoincidentes.size(), equipoLocal, equipoVisitante);
            return eventosCoincidentes;
            
        } catch (Exception e) {
            log.error("Error al buscar eventos por equipos {} vs {}: {}", equipoLocal, equipoVisitante, e.getMessage());
            failedRequests.incrementAndGet();
            return new ArrayList<>();
        }
    }
    
    @Override
    @Cacheable(value = "thesportsdb-events-date", key = "#fecha.toString()")
    public List<TheSportsDbEventResponse> buscarEventosPorFecha(LocalDate fecha) {
        log.info("Buscando eventos para la fecha: {}", fecha);
        
        try {
            String fechaStr = fecha.format(DATE_FORMATTER);
            String url = String.format("%s/%s/eventsday.php?d=%s", BASE_URL, apiKey, fechaStr);
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para fecha: {}", fecha);
                return new ArrayList<>();
            }
            
            return procesarRespuestaEventos(response);
            
        } catch (Exception e) {
            log.error("Error al buscar eventos por fecha {}: {}", fecha, e.getMessage());
            failedRequests.incrementAndGet();
            return new ArrayList<>();
        }
    }
    
    @Override
    @Cacheable(value = "thesportsdb-events-league", key = "#idLiga")
    public List<TheSportsDbEventResponse> buscarEventosPorLiga(String idLiga) {
        log.info("Buscando eventos de la liga: {}", idLiga);
        
        try {
            String url = String.format("%s/%s/eventsnextleague.php?id=%s", BASE_URL, apiKey, idLiga);
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para liga: {}", idLiga);
                return new ArrayList<>();
            }
            
            return procesarRespuestaEventos(response);
            
        } catch (Exception e) {
            log.error("Error al buscar eventos por liga {}: {}", idLiga, e.getMessage());
            failedRequests.incrementAndGet();
            return new ArrayList<>();
        }
    }
    
    @Override
    @Cacheable(value = "thesportsdb-events-team", key = "#nombreEquipo")
    public List<TheSportsDbEventResponse> buscarEventosPorEquipo(String nombreEquipo) {
        log.info("Buscando eventos del equipo: {}", nombreEquipo);
        
        try {
            String url = String.format("%s/%s/eventsnext.php?id=%s", BASE_URL, apiKey, 
                    java.net.URLEncoder.encode(nombreEquipo, "UTF-8"));
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para equipo: {}", nombreEquipo);
                return new ArrayList<>();
            }
            
            return procesarRespuestaEventos(response);
            
        } catch (Exception e) {
            log.error("Error al buscar eventos por equipo {}: {}", nombreEquipo, e.getMessage());
            failedRequests.incrementAndGet();
            return new ArrayList<>();
        }
    }
    
    @Override
    public List<TheSportsDbEventResponse> obtenerEventosEnVivo() {
        log.info("Obteniendo eventos en vivo");
        
        try {
            String url = String.format("%s/%s/liveevents.php", BASE_URL, apiKey);
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("No hay eventos en vivo disponibles");
                return new ArrayList<>();
            }
            
            return procesarRespuestaEventos(response);
            
        } catch (Exception e) {
            log.error("Error al obtener eventos en vivo: {}", e.getMessage());
            failedRequests.incrementAndGet();
            return new ArrayList<>();
        }
    }
    
    @Override
    public List<TheSportsDbEventResponse> obtenerProximosEventos(String idLiga) {
        log.info("Obteniendo próximos eventos de la liga: {}", idLiga);
        
        try {
            String url = String.format("%s/%s/eventsnextleague.php?id=%s", BASE_URL, apiKey, idLiga);
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para próximos eventos de liga: {}", idLiga);
                return new ArrayList<>();
            }
            
            return procesarRespuestaEventos(response);
            
        } catch (Exception e) {
            log.error("Error al obtener próximos eventos de liga {}: {}", idLiga, e.getMessage());
            failedRequests.incrementAndGet();
            return new ArrayList<>();
        }
    }
    
    // ===== MÉTODOS DE EQUIPOS =====
    
    @Override
    @Cacheable(value = "thesportsdb-team-name", key = "#nombreEquipo")
    public Optional<TheSportsDbTeamResponse> buscarEquipoPorNombre(String nombreEquipo) {
        log.info("Buscando equipo por nombre: {}", nombreEquipo);
        
        try {
            String url = String.format("%s/%s/searchteams.php?t=%s", BASE_URL, apiKey, 
                    java.net.URLEncoder.encode(nombreEquipo, "UTF-8"));
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para equipo: {}", nombreEquipo);
                return Optional.empty();
            }
            
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode teamsNode = jsonNode.get("teams");
            
            if (teamsNode != null && teamsNode.isArray() && teamsNode.size() > 0) {
                TheSportsDbTeamResponse equipo = mapearEquipo(teamsNode.get(0));
                log.info("Equipo encontrado: {}", equipo.getStrTeam());
                return Optional.of(equipo);
            }
            
            log.warn("No se encontró equipo con nombre: {}", nombreEquipo);
            return Optional.empty();
            
        } catch (Exception e) {
            log.error("Error al buscar equipo por nombre {}: {}", nombreEquipo, e.getMessage());
            failedRequests.incrementAndGet();
            return Optional.empty();
        }
    }
    
    @Override
    @Cacheable(value = "thesportsdb-teams-league", key = "#idLiga")
    public List<TheSportsDbTeamResponse> buscarEquiposPorLiga(String idLiga) {
        log.info("Buscando equipos de la liga: {}", idLiga);
        
        try {
            String url = String.format("%s/%s/lookup_all_teams.php?id=%s", BASE_URL, apiKey, idLiga);
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para liga: {}", idLiga);
                return new ArrayList<>();
            }
            
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode teamsNode = jsonNode.get("teams");
            
            List<TheSportsDbTeamResponse> equipos = new ArrayList<>();
            if (teamsNode != null && teamsNode.isArray()) {
                for (JsonNode teamNode : teamsNode) {
                    equipos.add(mapearEquipo(teamNode));
                }
            }
            
            log.info("Encontrados {} equipos en la liga: {}", equipos.size(), idLiga);
            return equipos;
            
        } catch (Exception e) {
            log.error("Error al buscar equipos por liga {}: {}", idLiga, e.getMessage());
            failedRequests.incrementAndGet();
            return new ArrayList<>();
        }
    }
    
    @Override
    @Cacheable(value = "thesportsdb-team-id", key = "#idEquipo")
    public Optional<TheSportsDbTeamResponse> buscarEquipoPorId(String idEquipo) {
        log.info("Buscando equipo por ID: {}", idEquipo);
        
        try {
            String url = String.format("%s/%s/lookupteam.php?id=%s", BASE_URL, apiKey, idEquipo);
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para equipo con ID: {}", idEquipo);
                return Optional.empty();
            }
            
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode teamsNode = jsonNode.get("teams");
            
            if (teamsNode != null && teamsNode.isArray() && teamsNode.size() > 0) {
                TheSportsDbTeamResponse equipo = mapearEquipo(teamsNode.get(0));
                log.info("Equipo encontrado: {}", equipo.getStrTeam());
                return Optional.of(equipo);
            }
            
            log.warn("No se encontró equipo con ID: {}", idEquipo);
            return Optional.empty();
            
        } catch (Exception e) {
            log.error("Error al buscar equipo por ID {}: {}", idEquipo, e.getMessage());
            failedRequests.incrementAndGet();
            return Optional.empty();
        }
    }
    
    // ===== MÉTODOS DE LIGAS =====
    
    @Override
    @Cacheable(value = "thesportsdb-all-leagues")
    public List<TheSportsDbLeagueResponse> obtenerTodasLasLigas() {
        log.info("Obteniendo todas las ligas");
        
        try {
            String url = String.format("%s/%s/league.php", BASE_URL, apiKey);
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para todas las ligas");
                return new ArrayList<>();
            }
            
            return procesarRespuestaLigas(response);
            
        } catch (Exception e) {
            log.error("Error al obtener todas las ligas: {}", e.getMessage());
            failedRequests.incrementAndGet();
            return new ArrayList<>();
        }
    }
    
    @Override
    @Cacheable(value = "thesportsdb-leagues-sport", key = "#deporte")
    public List<TheSportsDbLeagueResponse> buscarLigasPorDeporte(String deporte) {
        log.info("Buscando ligas por deporte: {}", deporte);
        
        try {
            String url = String.format("%s/%s/search_all_leagues.php?s=%s", BASE_URL, apiKey, 
                    java.net.URLEncoder.encode(deporte, "UTF-8"));
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para deporte: {}", deporte);
                return new ArrayList<>();
            }
            
            return procesarRespuestaLigas(response);
            
        } catch (Exception e) {
            log.error("Error al buscar ligas por deporte {}: {}", deporte, e.getMessage());
            failedRequests.incrementAndGet();
            return new ArrayList<>();
        }
    }
    
    @Override
    @Cacheable(value = "thesportsdb-league-name", key = "#nombreLiga")
    public Optional<TheSportsDbLeagueResponse> buscarLigaPorNombre(String nombreLiga) {
        log.info("Buscando liga por nombre: {}", nombreLiga);
        
        try {
            String url = String.format("%s/%s/searchleagues.php?l=%s", BASE_URL, apiKey, 
                    java.net.URLEncoder.encode(nombreLiga, "UTF-8"));
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para liga: {}", nombreLiga);
                return Optional.empty();
            }
            
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode leaguesNode = jsonNode.get("leagues");
            
            if (leaguesNode != null && leaguesNode.isArray() && leaguesNode.size() > 0) {
                TheSportsDbLeagueResponse liga = mapearLiga(leaguesNode.get(0));
                log.info("Liga encontrada: {}", liga.getStrLeague());
                return Optional.of(liga);
            }
            
            log.warn("No se encontró liga con nombre: {}", nombreLiga);
            return Optional.empty();
            
        } catch (Exception e) {
            log.error("Error al buscar liga por nombre {}: {}", nombreLiga, e.getMessage());
            failedRequests.incrementAndGet();
            return Optional.empty();
        }
    }
    
    @Override
    @Cacheable(value = "thesportsdb-leagues-country", key = "#pais")
    public List<TheSportsDbLeagueResponse> buscarLigasPorPais(String pais) {
        log.info("Buscando ligas por país: {}", pais);
        
        try {
            String url = String.format("%s/%s/search_all_leagues.php?c=%s", BASE_URL, apiKey, 
                    java.net.URLEncoder.encode(pais, "UTF-8"));
            String response = realizarPeticion(url);
            
            if (response == null || response.trim().isEmpty()) {
                log.warn("Respuesta vacía para país: {}", pais);
                return new ArrayList<>();
            }
            
            return procesarRespuestaLigas(response);
            
        } catch (Exception e) {
            log.error("Error al buscar ligas por país {}: {}", pais, e.getMessage());
            failedRequests.incrementAndGet();
            return new ArrayList<>();
        }
    }
    
    // ===== MÉTODOS DE UTILIDAD =====
    
    @Override
    public boolean verificarConectividad() {
        log.info("Verificando conectividad con TheSportsDB API");
        
        try {
            String url = String.format("%s/%s/lookupteam.php?id=133604", BASE_URL, apiKey); // Arsenal FC
            String response = realizarPeticion(url);
            
            if (response != null && !response.trim().isEmpty()) {
                JsonNode jsonNode = objectMapper.readTree(response);
                boolean conectado = jsonNode.get("teams") != null;
                log.info("Conectividad verificada: {}", conectado ? "OK" : "ERROR");
                return conectado;
            }
            
            return false;
            
        } catch (Exception e) {
            log.error("Error al verificar conectividad: {}", e.getMessage());
            return false;
        }
    }
    
    @Override
    public String obtenerEstadoApi() {
        if (verificarConectividad()) {
            return "API de TheSportsDB operativa - Clave: " + apiKey;
        } else {
            return "API de TheSportsDB no disponible";
        }
    }
    
    @Override
    public void limpiarCache() {
        log.info("Limpiando caché de TheSportsDB");
        // Aquí se implementaría la limpieza de caché si se usa
        // Por ejemplo, si usas Spring Cache:
        // cacheManager.getCache("thesportsdb-events").clear();
    }
    
    @Override
    public String obtenerEstadisticasUso() {
        long total = totalRequests.get();
        long exitosas = successfulRequests.get();
        long fallidas = failedRequests.get();
        double tasaExito = total > 0 ? (double) exitosas / total * 100 : 0;
        
        return String.format(
            "Estadísticas TheSportsDB API - Total: %d, Exitosas: %d, Fallidas: %d, Tasa éxito: %.2f%%",
            total, exitosas, fallidas, tasaExito
        );
    }
    
    // ===== MÉTODOS PRIVADOS AUXILIARES =====
    
    private String realizarPeticion(String url) {
        totalRequests.incrementAndGet();
        
        try {
            log.debug("Realizando petición a: {}", url);
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                successfulRequests.incrementAndGet();
                return response.getBody();
            } else {
                log.warn("Respuesta no válida de TheSportsDB: {}", response.getStatusCode());
                failedRequests.incrementAndGet();
                return null;
            }
            
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP al realizar petición: {} - {}", e.getStatusCode(), e.getMessage());
            failedRequests.incrementAndGet();
            return null;
        } catch (ResourceAccessException e) {
            log.error("Error de conectividad al realizar petición: {}", e.getMessage());
            failedRequests.incrementAndGet();
            return null;
        } catch (Exception e) {
            log.error("Error inesperado al realizar petición: {}", e.getMessage());
            failedRequests.incrementAndGet();
            return null;
        }
    }
    
    private List<TheSportsDbEventResponse> procesarRespuestaEventos(String response) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(response);
        JsonNode eventsNode = jsonNode.get("events");
        
        List<TheSportsDbEventResponse> eventos = new ArrayList<>();
        if (eventsNode != null && eventsNode.isArray()) {
            for (JsonNode eventNode : eventsNode) {
                eventos.add(mapearEvento(eventNode));
            }
        }
        
        return eventos;
    }
    
    private List<TheSportsDbLeagueResponse> procesarRespuestaLigas(String response) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(response);
        JsonNode leaguesNode = jsonNode.get("leagues");
        
        List<TheSportsDbLeagueResponse> ligas = new ArrayList<>();
        if (leaguesNode != null && leaguesNode.isArray()) {
            for (JsonNode leagueNode : leaguesNode) {
                ligas.add(mapearLiga(leagueNode));
            }
        }
        
        return ligas;
    }
    
    private TheSportsDbEventResponse mapearEvento(JsonNode eventNode) {
        TheSportsDbEventResponse evento = TheSportsDbEventResponse.builder()
                .idEvent(getStringValue(eventNode, "idEvent"))
                .strEvent(getStringValue(eventNode, "strEvent"))
                .strSport(getStringValue(eventNode, "strSport"))
                .strLeague(getStringValue(eventNode, "strLeague"))
                .strSeason(getStringValue(eventNode, "strSeason"))
                .strHomeTeam(getStringValue(eventNode, "strHomeTeam"))
                .strAwayTeam(getStringValue(eventNode, "strAwayTeam"))
                .intHomeScore(getStringValue(eventNode, "intHomeScore"))
                .intAwayScore(getStringValue(eventNode, "intAwayScore"))
                .strStatus(getStringValue(eventNode, "strStatus"))
                .dateEvent(getStringValue(eventNode, "dateEvent"))
                .strTime(getStringValue(eventNode, "strTime"))
                .strVenue(getStringValue(eventNode, "strVenue"))
                .strDescriptionEN(getStringValue(eventNode, "strDescriptionEN"))
                .strThumb(getStringValue(eventNode, "strThumb"))
                .strBanner(getStringValue(eventNode, "strBanner"))
                .strVideo(getStringValue(eventNode, "strVideo"))
                .strTimestamp(getStringValue(eventNode, "strTimestamp"))
                .build();
        
        // Procesar campos adicionales
        procesarCamposAdicionales(evento);
        
        return evento;
    }
    
    private TheSportsDbTeamResponse mapearEquipo(JsonNode teamNode) {
        return TheSportsDbTeamResponse.builder()
                .idTeam(getStringValue(teamNode, "idTeam"))
                .strTeam(getStringValue(teamNode, "strTeam"))
                .strSport(getStringValue(teamNode, "strSport"))
                .strLeague(getStringValue(teamNode, "strLeague"))
                .strDescriptionEN(getStringValue(teamNode, "strDescriptionEN"))
                .strCountry(getStringValue(teamNode, "strCountry"))
                .strBadge(getStringValue(teamNode, "strBadge"))
                .strLogo(getStringValue(teamNode, "strLogo"))
                .strWebsite(getStringValue(teamNode, "strWebsite"))
                .strFacebook(getStringValue(teamNode, "strFacebook"))
                .strTwitter(getStringValue(teamNode, "strTwitter"))
                .strInstagram(getStringValue(teamNode, "strInstagram"))
                .strYoutube(getStringValue(teamNode, "strYoutube"))
                .intFormedYear(getStringValue(teamNode, "intFormedYear"))
                .strStadium(getStringValue(teamNode, "strStadium"))
                .strStadiumThumb(getStringValue(teamNode, "strStadiumThumb"))
                .strStadiumDescription(getStringValue(teamNode, "strStadiumDescription"))
                .strStadiumLocation(getStringValue(teamNode, "strStadiumLocation"))
                .build();
    }
    
    private TheSportsDbLeagueResponse mapearLiga(JsonNode leagueNode) {
        return TheSportsDbLeagueResponse.builder()
                .idLeague(getStringValue(leagueNode, "idLeague"))
                .strLeague(getStringValue(leagueNode, "strLeague"))
                .strSport(getStringValue(leagueNode, "strSport"))
                .strLeagueAlternate(getStringValue(leagueNode, "strLeagueAlternate"))
                .strDivision(getStringValue(leagueNode, "strDivision"))
                .strDescriptionEN(getStringValue(leagueNode, "strDescriptionEN"))
                .strCountry(getStringValue(leagueNode, "strCountry"))
                .strWebsite(getStringValue(leagueNode, "strWebsite"))
                .strFacebook(getStringValue(leagueNode, "strFacebook"))
                .strTwitter(getStringValue(leagueNode, "strTwitter"))
                .strYoutube(getStringValue(leagueNode, "strYoutube"))
                .strRSS(getStringValue(leagueNode, "strRSS"))
                .strBadge(getStringValue(leagueNode, "strBadge"))
                .strLogo(getStringValue(leagueNode, "strLogo"))
                .strBanner(getStringValue(leagueNode, "strBanner"))
                .strComplete(getStringValue(leagueNode, "strComplete"))
                .intFormedYear(getStringValue(leagueNode, "intFormedYear"))
                .strCurrentSeason(getStringValue(leagueNode, "strCurrentSeason"))
                .build();
    }
    
    private void procesarCamposAdicionales(TheSportsDbEventResponse evento) {
        // Nombre del evento
        if (evento.getStrEvent() != null && !evento.getStrEvent().trim().isEmpty()) {
            evento.setNombreEvento(evento.getStrEvent());
        } else if (evento.getStrHomeTeam() != null && evento.getStrAwayTeam() != null) {
            evento.setNombreEvento(evento.getStrHomeTeam() + " vs " + evento.getStrAwayTeam());
        }
        
        // Estado del evento
        String status = evento.getStrStatus();
        if (status != null) {
            switch (status.toLowerCase()) {
                case "finished", "ft" -> evento.setEstadoEvento("FINALIZADO");
                case "live", "in progress" -> evento.setEstadoEvento("EN_VIVO");
                case "not started", "ns" -> evento.setEstadoEvento("PROGRAMADO");
                case "postponed" -> evento.setEstadoEvento("POSPUESTO");
                case "cancelled" -> evento.setEstadoEvento("CANCELADO");
                default -> evento.setEstadoEvento("DESCONOCIDO");
            }
        }
          // Fecha y hora del evento
        try {
            if (evento.getDateEvent() != null && evento.getStrTime() != null) {
                // Aquí puedes implementar el parsing de fecha según el formato de TheSportsDB
                // Por simplicidad, solo guardamos la información tal como viene
                log.debug("Procesando fecha: {} {}", evento.getDateEvent(), evento.getStrTime());
            }
        } catch (Exception e) {
            log.debug("Error al procesar fecha del evento: {}", e.getMessage());
        }
        
        // Evento finalizado
        evento.setEventoFinalizado("FINALIZADO".equals(evento.getEstadoEvento()));
        
        // Resultado del partido
        if (evento.getIntHomeScore() != null && evento.getIntAwayScore() != null &&
            !evento.getIntHomeScore().trim().isEmpty() && !evento.getIntAwayScore().trim().isEmpty()) {
            evento.setResultadoPartido(evento.getIntHomeScore() + " - " + evento.getIntAwayScore());
        }
    }
    
    private String getStringValue(JsonNode node, String fieldName) {
        JsonNode fieldNode = node.get(fieldName);
        return fieldNode != null && !fieldNode.isNull() ? fieldNode.asText() : null;
    }
}
