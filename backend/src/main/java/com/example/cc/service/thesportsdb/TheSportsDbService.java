package com.example.cc.service.thesportsdb;

import com.example.cc.dto.thesportsdb.SportsDbEvent;
import com.example.cc.dto.thesportsdb.SportsDbEventResponse;
import com.example.cc.entities.Evento;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class TheSportsDbService {

    private final WebClient webClient;
    private final String apiKey;

    public TheSportsDbService(@Value("${thesportsdb.api.key:722804}") String apiKey) {
        this.apiKey = apiKey;
        this.webClient = WebClient.builder()
                .baseUrl("https://www.thesportsdb.com/api/v1/json/" + apiKey)
                .build();
    }

    /**
     * Busca eventos por equipos en TheSportsDB
     */
    public Optional<Evento> buscarEventoPorEquipos(String equipoLocal, String equipoVisitante) {
        try {
            log.info("Buscando evento en TheSportsDB: {} vs {}", equipoLocal, equipoVisitante);
            
            // Buscar eventos del equipo local
            SportsDbEventResponse response = webClient
                    .get()
                    .uri("/searchevents.php?e={equipoLocal} vs {equipoVisitante}", equipoLocal, equipoVisitante)
                    .retrieve()
                    .bodyToMono(SportsDbEventResponse.class)
                    .block();

            if (response != null && response.getEvents() != null && !response.getEvents().isEmpty()) {
                SportsDbEvent sportsDbEvent = response.getEvents().get(0);
                return Optional.of(convertirAEvento(sportsDbEvent));
            }

            // Si no encuentra por búsqueda exacta, buscar por equipo local
            response = webClient
                    .get()
                    .uri("/searchevents.php?e={equipo}", equipoLocal)
                    .retrieve()
                    .bodyToMono(SportsDbEventResponse.class)
                    .block();

            if (response != null && response.getEvents() != null) {
                Optional<SportsDbEvent> eventoEncontrado = response.getEvents().stream()
                        .filter(event -> 
                            (event.getStrHomeTeam() != null && event.getStrHomeTeam().equalsIgnoreCase(equipoLocal) &&
                             event.getStrAwayTeam() != null && event.getStrAwayTeam().equalsIgnoreCase(equipoVisitante)) ||
                            (event.getStrHomeTeam() != null && event.getStrHomeTeam().equalsIgnoreCase(equipoVisitante) &&
                             event.getStrAwayTeam() != null && event.getStrAwayTeam().equalsIgnoreCase(equipoLocal))
                        )
                        .findFirst();

                if (eventoEncontrado.isPresent()) {
                    return Optional.of(convertirAEvento(eventoEncontrado.get()));
                }
            }

        } catch (Exception e) {
            log.error("Error al buscar evento en TheSportsDB: {}", e.getMessage());
        }

        return Optional.empty();
    }

    /**
     * Busca eventos por fecha en TheSportsDB
     */
    public List<Evento> buscarEventosPorFecha(LocalDate fecha) {
        try {
            log.info("Buscando eventos por fecha en TheSportsDB: {}", fecha);
            
            String fechaStr = fecha.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            
            SportsDbEventResponse response = webClient
                    .get()
                    .uri("/eventsday.php?d={fecha}", fechaStr)
                    .retrieve()
                    .bodyToMono(SportsDbEventResponse.class)
                    .block();

            if (response != null && response.getEvents() != null) {
                return response.getEvents().stream()
                        .map(this::convertirAEvento)
                        .toList();
            }

        } catch (Exception e) {
            log.error("Error al buscar eventos por fecha en TheSportsDB: {}", e.getMessage());
        }

        return List.of();
    }

    /**
     * Busca un evento por ID externo en TheSportsDB
     */
    public Optional<Evento> buscarEventoPorIdExterno(String idEventoExterno) {
        try {
            log.info("Buscando evento por ID externo en TheSportsDB: {}", idEventoExterno);
            
            SportsDbEventResponse response = webClient
                    .get()
                    .uri("/lookupevent.php?id={idEvento}", idEventoExterno)
                    .retrieve()
                    .bodyToMono(SportsDbEventResponse.class)
                    .block();

            if (response != null && response.getEvents() != null && !response.getEvents().isEmpty()) {
                SportsDbEvent sportsDbEvent = response.getEvents().get(0);
                return Optional.of(convertirAEvento(sportsDbEvent));
            }

        } catch (Exception e) {
            log.error("Error al buscar evento por ID externo en TheSportsDB: {}", e.getMessage());
        }

        return Optional.empty();
    }

    /**
     * Convierte un SportsDbEvent a un Evento de nuestra entidad
     */
    private Evento convertirAEvento(SportsDbEvent sportsDbEvent) {
        Evento evento = new Evento();
        
        // Mapear campos básicos
        evento.setEquipoLocal(sportsDbEvent.getStrHomeTeam());
        evento.setEquipoVisitante(sportsDbEvent.getStrAwayTeam());
        evento.setNombreEvento(sportsDbEvent.getStrEvent());
        
        // Convertir fecha
        if (sportsDbEvent.getDateEvent() != null) {
            try {
                LocalDate fechaEvento = LocalDate.parse(sportsDbEvent.getDateEvent());
                evento.setFechaPartido(Date.valueOf(fechaEvento));
            } catch (Exception e) {
                log.warn("Error al parsear fecha: {}", sportsDbEvent.getDateEvent());
                evento.setFechaPartido(Date.valueOf(LocalDate.now()));
            }
        } else {
            evento.setFechaPartido(Date.valueOf(LocalDate.now()));
        }
        
        // Mapear información adicional
        evento.setLiga(sportsDbEvent.getStrLeague());
        evento.setDeporte(sportsDbEvent.getStrSport());
        evento.setEstadio(sportsDbEvent.getStrVenue());
        
        // Mapear resultados si están disponibles
        if (sportsDbEvent.getIntHomeScore() != null && !sportsDbEvent.getIntHomeScore().isEmpty()) {
            try {
                evento.setResultadoLocal(Integer.parseInt(sportsDbEvent.getIntHomeScore()));
            } catch (NumberFormatException e) {
                log.warn("Error al parsear resultado local: {}", sportsDbEvent.getIntHomeScore());
            }
        }
        
        if (sportsDbEvent.getIntAwayScore() != null && !sportsDbEvent.getIntAwayScore().isEmpty()) {
            try {
                evento.setResultadoVisitante(Integer.parseInt(sportsDbEvent.getIntAwayScore()));
            } catch (NumberFormatException e) {
                log.warn("Error al parsear resultado visitante: {}", sportsDbEvent.getIntAwayScore());
            }
        }
        
        // Mapear estado del evento
        if (sportsDbEvent.getStrStatus() != null) {
            switch (sportsDbEvent.getStrStatus().toLowerCase()) {
                case "not started":
                    evento.setEstado("PROGRAMADO");
                    break;
                case "match finished":
                    evento.setEstado("FINALIZADO");
                    break;
                case "in progress":
                    evento.setEstado("EN_CURSO");
                    break;
                default:
                    evento.setEstado("PROGRAMADO");
            }
        } else {
            evento.setEstado("PROGRAMADO");
        }
        
        // ID externo para referencia
        evento.setIdExterno(sportsDbEvent.getIdEvent());
        
        log.info("Evento convertido: {} vs {} - {}", 
                evento.getEquipoLocal(), evento.getEquipoVisitante(), evento.getFechaPartido());
        
        return evento;
    }
}
