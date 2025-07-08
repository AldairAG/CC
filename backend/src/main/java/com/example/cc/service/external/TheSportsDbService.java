package com.example.cc.service.external;

import com.example.cc.dto.external.LiveScoreResponse;
import com.example.cc.dto.external.TheSportsDbEventResponse;
import com.example.cc.dto.response.TheSportsDbSportResponse;
import com.example.cc.dto.response.TheSportsDbLeagueResponse;
import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.Deporte;
import com.example.cc.entities.Liga;
import com.example.cc.repository.EventoDeportivoRepository;
import com.example.cc.service.deportes.IDeporteService;
import com.example.cc.service.deportes.ILigaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class TheSportsDbService implements ITheSportsDbService {

    private final RestTemplate restTemplate;
    private final EventoDeportivoRepository eventoRepository;
    private final IDeporteService deporteService;
    private final ILigaService ligaService;

    @Value("${thesportsdb.api.base-url}")
    private String baseUrl;

    @Value("${thesportsdb.api.base-url-v1}")
    private String baseUrlV1;

    @Value("${thesportsdb.api.key}")
    private String apiKey;

    public TheSportsDbService(RestTemplate restTemplate,
            EventoDeportivoRepository eventoRepository,
            IDeporteService deporteService,
            ILigaService ligaService) {
        this.restTemplate = restTemplate;
        this.eventoRepository = eventoRepository;
        this.deporteService = deporteService;
        this.ligaService = ligaService;
    }

    /**
     * Crear headers HTTP con la API key
     */
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        if (apiKey != null && !apiKey.isEmpty()) {
            headers.set("X-API-KEY", apiKey);
            // También podríamos usar Authorization header si la API lo requiere
            // headers.set("Authorization", "Bearer " + apiKey);
        }
        return headers;
    }

    /**
     * Hacer petición GET con headers que incluyen API key
     */
    private <T> T makeGetRequestWithHeaders(String url, Class<T> responseType) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<?> entity = new HttpEntity<>(headers);

            log.debug("Realizando petición GET a: {} con API key en header", url);
            ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.GET, entity, responseType);

            return response.getBody();
        } catch (RestClientException e) {
            log.error("Error en petición GET a {}: {}", url, e.getMessage());
            throw e;
        }
    }

    /**
     * Obtener eventos de los próximos 7 días
     */
    public List<TheSportsDbEventResponse.EventData> getUpcomingEvents() {
        List<TheSportsDbEventResponse.EventData> allEvents = new ArrayList<>();

        try {
            // Obtener eventos para los próximos 15 días
            LocalDate today = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            for (int i = 0; i < 15; i++) {
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
     * Obtener eventos por fecha específica usando v2 API con livescores y guardar
     * en BD
     */
    @Transactional
    private List<TheSportsDbEventResponse.EventData> getEventsByDate(String date) {
        try {
            // API v2 endpoint para eventos por fecha - usando endpoint correcto
            String url = baseUrlV1 + "/eventsday.php?d=" + date;
            log.debug("Llamando a URL v2: {}", url);

            TheSportsDbEventResponse response = makeGetRequestWithHeaders(url, TheSportsDbEventResponse.class);

            if (response != null && response.getEvents() != null) {
                log.info("Obtenidos {} eventos para la fecha {}", response.getEvents().size(), date);

                // Procesar y guardar eventos con livescores
                List<TheSportsDbEventResponse.EventData> eventosConLivescores = new ArrayList<>();

                for (TheSportsDbEventResponse.EventData evento : response.getEvents()) {
                    // Obtener livescore actual para este evento
                    TheSportsDbEventResponse.EventData eventoConLivescore = obtenerLivescoreEvento(evento.getIdEvent());

                    if (eventoConLivescore != null) {
                        eventosConLivescores.add(eventoConLivescore);
                        // Guardar o actualizar en la base de datos
                        guardarOActualizarEvento(eventoConLivescore);
                    } else {
                        // Si no hay livescore, usar el evento original
                        eventosConLivescores.add(evento);
                        guardarOActualizarEvento(evento);
                    }
                }

                return eventosConLivescores;
            }

        } catch (RestClientException e) {
            log.error("Error al obtener eventos v2 para la fecha {}: {}", date, e.getMessage());
        } catch (Exception e) {
            log.error("Error inesperado al procesar eventos para la fecha {}: {}", date, e.getMessage());
        }

        return new ArrayList<>();
    }

    /**
     * Obtener livescore específico de un evento
     */
    private TheSportsDbEventResponse.EventData obtenerLivescoreEvento(String eventoId) {
        try {
            if (eventoId == null || eventoId.isEmpty()) {
                return null;
            }

            // Endpoint para obtener detalles específicos del evento con livescore
            String url = baseUrl + "/lookupevent.php?id=" + eventoId;
            log.debug("🔴 Obteniendo livescore para evento: {}", eventoId);

            TheSportsDbEventResponse response = makeGetRequestWithHeaders(url, TheSportsDbEventResponse.class);

            if (response != null && response.getEvents() != null && !response.getEvents().isEmpty()) {
                TheSportsDbEventResponse.EventData evento = response.getEvents().get(0);

                // Verificar si tiene marcadores actualizados
                if (evento.getIntHomeScore() != null || evento.getIntAwayScore() != null) {
                    log.info("✅ Livescore obtenido para evento {}: {} - {}",
                            eventoId, evento.getIntHomeScore(), evento.getIntAwayScore());
                    return evento;
                }
            }

        } catch (RestClientException e) {
            log.debug("No se pudo obtener livescore para evento {}: {}", eventoId, e.getMessage());
        }

        return null;
    }

    /**
     * Guardar o actualizar evento en la base de datos
     */
    @Transactional
    private void guardarOActualizarEvento(TheSportsDbEventResponse.EventData eventoData) {
        try {
            if (eventoData.getIdEvent() == null || eventoData.getIdEvent().isEmpty()) {
                log.warn("⚠️ Evento sin ID externo, omitiendo...");
                return;
            }

            // Buscar si el evento ya existe
            Optional<EventoDeportivo> eventoExistente = eventoRepository.findByEventoIdExterno(eventoData.getIdEvent());

            EventoDeportivo evento;
            boolean esNuevo = false;

            if (eventoExistente.isPresent()) {
                evento = eventoExistente.get();
                log.debug("🔄 Actualizando evento existente: {}", eventoData.getIdEvent());
            } else {
                evento = new EventoDeportivo();
                evento.setEventoIdExterno(eventoData.getIdEvent());
                esNuevo = true;
                log.debug("🆕 Creando nuevo evento: {}", eventoData.getIdEvent());
            }

            // Actualizar datos básicos
            evento.setNombreEvento(eventoData.getStrEvent());
            evento.setEquipoLocal(eventoData.getStrHomeTeam());
            evento.setEquipoVisitante(eventoData.getStrAwayTeam());
            evento.setTemporada(eventoData.getStrSeason());
            evento.setDescripcion(eventoData.getStrDescriptionEN());

            // Actualizar marcadores si están disponibles
            if (eventoData.getIntHomeScore() != null && !eventoData.getIntHomeScore().isEmpty()) {
                try {
                    evento.setMarcadorLocal(Integer.parseInt(eventoData.getIntHomeScore()));
                } catch (NumberFormatException e) {
                    log.debug("No se pudo parsear marcador local: {}", eventoData.getIntHomeScore());
                }
            }

            if (eventoData.getIntAwayScore() != null && !eventoData.getIntAwayScore().isEmpty()) {
                try {
                    evento.setMarcadorVisitante(Integer.parseInt(eventoData.getIntAwayScore()));
                } catch (NumberFormatException e) {
                    log.debug("No se pudo parsear marcador visitante: {}", eventoData.getIntAwayScore());
                }
            }

            // Determinar estado basado en el status y marcadores
            String estado = determinarEstadoEvento(eventoData);
            evento.setEstado(estado);

            // Determinar resultado si hay marcadores
            if (evento.getMarcadorLocal() != null && evento.getMarcadorVisitante() != null) {
                if (evento.getMarcadorLocal() > evento.getMarcadorVisitante()) {
                    evento.setResultado("LOCAL");
                } else if (evento.getMarcadorVisitante() > evento.getMarcadorLocal()) {
                    evento.setResultado("VISITANTE");
                } else {
                    evento.setResultado("EMPATE");
                }
            }

            // Parsear fecha del evento
            try {
                LocalDateTime fechaEvento = parsearFechaEvento(eventoData.getDateEvent(), eventoData.getStrTime());
                evento.setFechaEvento(fechaEvento);
            } catch (Exception e) {
                log.error("Error al parsear fecha del evento {}: {}", eventoData.getIdEvent(), e.getMessage());
                // Si es un evento nuevo y no se puede parsear la fecha, usar la fecha actual
                if (esNuevo) {
                    evento.setFechaEvento(LocalDateTime.now());
                }
            }

            // Obtener o crear deporte y liga si es un evento nuevo
            if (esNuevo) {
                // Buscar deporte
                Deporte deporte = null;
                if (eventoData.getStrSport() != null) {
                    try {
                        Optional<Deporte> deporteExistente = deporteService
                                .getDeporteByNombre(eventoData.getStrSport());
                        if (deporteExistente.isPresent()) {
                            deporte = deporteExistente.get();
                        } else {
                            // Crear nuevo deporte
                            Deporte nuevoDeporte = new Deporte();
                            nuevoDeporte.setNombre(eventoData.getStrSport());
                            nuevoDeporte.setActivo(true);
                            deporte = deporteService.createDeporteSafe(nuevoDeporte);
                        }
                    } catch (Exception e) {
                        log.error("Error al obtener deporte {}: {}", eventoData.getStrSport(), e.getMessage());
                    }
                }

                // Buscar liga
                Liga liga = null;
                if (eventoData.getStrLeague() != null && deporte != null) {
                    try {
                        Optional<Liga> ligaExistente = ligaService.getLigaByNombre(eventoData.getStrLeague());
                        if (ligaExistente.isPresent()) {
                            liga = ligaExistente.get();
                        } else {
                            // Crear nueva liga
                            Liga nuevaLiga = new Liga();
                            nuevaLiga.setNombre(eventoData.getStrLeague());
                            nuevaLiga.setDeporte(deporte);
                            nuevaLiga.setActiva(true);
                            liga = ligaService.createLigaSafe(nuevaLiga);
                        }
                    } catch (Exception e) {
                        log.error("Error al obtener liga {}: {}", eventoData.getStrLeague(), e.getMessage());
                    }
                }

                if (deporte != null) {
                    evento.setDeporte(deporte);
                }
                if (liga != null) {
                    evento.setLiga(liga);
                }

                // Si no se pudieron obtener deporte y liga, omitir el evento
                if (deporte == null || liga == null) {
                    log.warn("⚠️ No se pudo crear evento {} por falta de deporte o liga", eventoData.getIdEvent());
                    return;
                }
            }

            // Guardar en la base de datos
            EventoDeportivo eventoGuardado = eventoRepository.save(evento);

            if (esNuevo) {
                log.info("✅ Evento creado: {} (ID: {})", eventoGuardado.getNombreEvento(), eventoGuardado.getId());
            } else {
                log.info("🔄 Evento actualizado con livescore: {} - Marcador: {} - {}",
                        eventoGuardado.getNombreEvento(),
                        eventoGuardado.getMarcadorLocal(),
                        eventoGuardado.getMarcadorVisitante());
            }

        } catch (Exception e) {
            log.error("❌ Error al guardar/actualizar evento {}: {}", eventoData.getIdEvent(), e.getMessage(), e);
        }
    }

    /**
     * Determinar el estado del evento basado en el status de TheSportsDB
     */
    private String determinarEstadoEvento(TheSportsDbEventResponse.EventData eventoData) {
        if (eventoData.getStrStatus() == null) {
            return "programado";
        }

        String status = eventoData.getStrStatus().toLowerCase();

        // Estados en vivo
        if (status.contains("1h") || status.contains("2h") ||
                status.contains("q1") || status.contains("q2") ||
                status.contains("q3") || status.contains("q4") ||
                status.contains("live") || status.contains("in progress") ||
                status.contains("halftime") || status.contains("ht")) {
            return "en_vivo";
        }

        // Estados finalizados
        if (status.contains("full time") || status.contains("ft") ||
                status.contains("finished") || status.contains("final") ||
                status.contains("completed") || status.contains("ended")) {
            return "finalizado";
        }

        // Estados cancelados/pospuestos
        if (status.contains("cancelled") || status.contains("canceled") ||
                status.contains("postponed") || status.contains("suspended")) {
            return "cancelado";
        }

        // Por defecto, programado
        return "programado";
    }

    /**
     * Parsear fecha y hora del evento
     */
    private LocalDateTime parsearFechaEvento(String fechaStr, String horaStr) throws DateTimeParseException {
        if (fechaStr == null || fechaStr.isEmpty()) {
            throw new DateTimeParseException("Fecha vacía", fechaStr, 0);
        }

        LocalDate fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        if (horaStr != null && !horaStr.isEmpty()) {
            try {
                LocalTime hora = LocalTime.parse(horaStr, DateTimeFormatter.ofPattern("HH:mm:ss"));
                return LocalDateTime.of(fecha, hora);
            } catch (DateTimeParseException e) {
                log.debug("No se pudo parsear la hora {}, usando medianoche", horaStr);
            }
        }

        return LocalDateTime.of(fecha, LocalTime.MIDNIGHT);
    }

    /**
     * Obtener eventos de ligas específicas (opcional)
     */
    public List<TheSportsDbEventResponse.EventData> getEventsByLeague(String leagueId) {
        try {
            String url = baseUrl + "/eventsnextleague.php?id=" + leagueId;
            log.debug("Obteniendo eventos de liga: {}", url);

            TheSportsDbEventResponse response = makeGetRequestWithHeaders(url, TheSportsDbEventResponse.class);

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
            String url = baseUrlV1 + "/eventsport.php?s=" + sport;
            log.debug("Obteniendo eventos de deporte: {}", url);

            TheSportsDbEventResponse response = makeGetRequestWithHeaders(url, TheSportsDbEventResponse.class);

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
            String url = baseUrl + "/all/sports";
            log.info("Obteniendo todos los deportes desde: {}", url);

            TheSportsDbSportResponse response = makeGetRequestWithHeaders(url, TheSportsDbSportResponse.class);

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
            String url = baseUrl + "/all/leagues";
            log.info("Obteniendo todas las ligas desde: {}", url);

            TheSportsDbLeagueResponse response = makeGetRequestWithHeaders(url, TheSportsDbLeagueResponse.class);

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

    // ===== MÉTODOS ESPECÍFICOS PARA V2 API =====

    /**
     * Obtener eventos por fecha usando v2 API (más actualizados)
     */
    @Override
    public List<TheSportsDbEventResponse.EventData> obtenerEventosPorFechaV2(String date) {
        try {
            // Endpoint v2 específico para eventos por fecha con mejor actualización
            String url = baseUrl + "/eventsday.php?d=" + date;
            log.info("🔄 Obteniendo eventos v2 para fecha: {}", date);

            TheSportsDbEventResponse response = makeGetRequestWithHeaders(url, TheSportsDbEventResponse.class);

            if (response != null && response.getEvents() != null) {
                log.info("✅ Obtenidos {} eventos v2 para {}", response.getEvents().size(), date);
                return response.getEvents();
            } else {
                log.warn("⚠️ No se encontraron eventos v2 para la fecha {}", date);
                return new ArrayList<>();
            }

        } catch (RestClientException e) {
            log.error("❌ Error al obtener eventos v2 para fecha {}: {}", date, e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Obtener eventos de la siguiente semana usando v2 API
     */
    @Override
    public List<TheSportsDbEventResponse.EventData> obtenerEventosProximaSemanaV2() {
        List<TheSportsDbEventResponse.EventData> allEvents = new ArrayList<>();

        try {
            LocalDate today = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            log.info("🔄 Obteniendo eventos v2 para los próximos 7 días...");

            for (int i = 0; i < 7; i++) {
                LocalDate targetDate = today.plusDays(i);
                String dateStr = targetDate.format(formatter);

                List<TheSportsDbEventResponse.EventData> dailyEvents = obtenerEventosPorFechaV2(dateStr);
                allEvents.addAll(dailyEvents);

                // Pequeña pausa para no sobrecargar la API
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }

            log.info("✅ Total de eventos v2 obtenidos para la semana: {}", allEvents.size());

        } catch (Exception e) {
            log.error("❌ Error al obtener eventos v2 de la semana: {}", e.getMessage(), e);
        }

        return allEvents;
    }

    /**
     * Obtener eventos en vivo usando v2 API
     */
    @Override
    public List<TheSportsDbEventResponse.EventData> obtenerEventosEnVivoV2() {
        try {
            // Endpoint v2 para eventos en vivo (si está disponible)
            String url = baseUrl + "/livescore/all";
            log.info("🔴 Obteniendo eventos en vivo v2...");

            TheSportsDbEventResponse response = makeGetRequestWithHeaders(url, TheSportsDbEventResponse.class);

            if (response != null && response.getEvents() != null) {
                // Filtrar eventos que estén realmente en vivo
                List<TheSportsDbEventResponse.EventData> liveEvents = response.getEvents().stream()
                        .filter(event -> isEventLive(event))
                        .toList();

                log.info("✅ Encontrados {} eventos en vivo", liveEvents.size());
                return liveEvents;
            } else {
                log.warn("⚠️ No se encontraron eventos en vivo");
                return new ArrayList<>();
            }

        } catch (RestClientException e) {
            log.error("❌ Error al obtener eventos en vivo v2: {}", e.getMessage());

            // Fallback: obtener eventos del día actual y filtrar los que podrían estar en
            // vivo
            String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            return obtenerEventosPorFechaV2(today).stream()
                    .filter(event -> isEventLive(event))
                    .toList();
        }
    }

    /**
     * Helper para determinar si un evento está en vivo
     */
    private boolean isEventLive(TheSportsDbEventResponse.EventData event) {
        if (event.getStrStatus() == null)
            return false;

        String status = event.getStrStatus().toLowerCase();
        return status.contains("1h") || status.contains("2h") ||
                status.contains("q1") || status.contains("q2") ||
                status.contains("q3") || status.contains("q4") ||
                status.contains("live") || status.contains("in progress");
    }

    /**
     * Método mejorado para obtener eventos próximos usando v2
     */
    public List<TheSportsDbEventResponse.EventData> getUpcomingEventsV2() {
        log.info("🚀 Iniciando obtención de eventos próximos usando v2 API...");
        return obtenerEventosProximaSemanaV2();
    }

    /**
     * Obtener livescores actuales de todos los eventos usando v2 API
     */
    public List<LiveScoreResponse.LiveScore> getLiveScores() {
        log.info("🚀 Iniciando obtención de livescores usando v2 API...");
        List<LiveScoreResponse.LiveScore> liveScores = new ArrayList<>();

        try {
            // Endpoint para obtener livescores
            String url = baseUrl + "/livescore/all";
            log.debug("Llamando a URL para livescores: {}", url);

            LiveScoreResponse response = makeGetRequestWithHeaders(url, LiveScoreResponse.class);

            if (response != null && response.getLiveScore() != null) {
                liveScores.addAll(response.getLiveScore());
                log.info("✅ Obtenidos {} livescores", liveScores.size());
            } else {
                log.warn("⚠️ No se encontraron livescores");
            }

        }catch(

    RestClientException e)
    {
        log.error("❌ Error al obtener livescores: {}", e.getMessage(), e);
    }

    return liveScores;
    }

    /**
     * Obtener livescores actuales de todos los eventos del día y guardarlos en BD
     */
    @Transactional
    public List<EventoDeportivo> obtenerYGuardarLivescoresActuales() {
        log.info("🔴 Iniciando obtención de livescores actuales...");
        List<EventoDeportivo> eventosActualizados = new ArrayList<>();

        try {
            // Obtener eventos del día actual
            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime endOfDay = today.atTime(23, 59, 59);

            // Obtener eventos del día actual desde la base de datos
            List<EventoDeportivo> eventosDelDia = eventoRepository.findByFechaEventoBetween(startOfDay, endOfDay);
            List<LiveScoreResponse.LiveScore> liveScores = getLiveScores();

            // Obtener también eventos de ayer por si hay partidos que se extendieron
            /*
             * LocalDate yesterday = LocalDate.now().minusDays(1);
             * LocalDateTime startOfYesterday = yesterday.atStartOfDay();
             * LocalDateTime endOfYesterday = yesterday.atTime(23, 59, 59);
             * List<EventoDeportivo> eventosAyer =
             * eventoRepository.findByFechaEventoBetween(startOfYesterday, endOfYesterday);
             * eventosDelDia.addAll(eventosAyer);
             */

            // Para cada evento, obtener livescore actualizado desde TheSportsDB
            for (EventoDeportivo evento : eventosDelDia) {
                try {
                    if (evento.getEventoIdExterno() != null) {
                        // Obtener livescore actualizado
                        LiveScoreResponse.LiveScore eventoActualizado = liveScores.stream()
                                .filter(score -> score.getIdEvent().equals(evento.getEventoIdExterno()))
                                .findFirst()
                                .orElse(null);

                        if (eventoActualizado != null) {
                            // Actualizar el evento con los nuevos datos
                            evento.setMarcadorLocal(eventoActualizado.getIntHomeScore());
                            evento.setMarcadorVisitante(eventoActualizado.getIntAwayScore());
                            evento.setEstado(determinarEstadoPorStatus(eventoActualizado.getStrStatus()));

                            // Actualizar fecha si el evento fue reprogramado
                            if (eventoActualizado.getStrDate() != null && !eventoActualizado.getStrDate().isEmpty()) {
                                try {
                                    LocalDateTime nuevaFecha = parsearFechaLivescore(
                                            eventoActualizado.getStrDate(),
                                            eventoActualizado.getStrEventTime());

                                    // Solo actualizar la fecha si es diferente (evento reprogramado)
                                    if (!nuevaFecha.toLocalDate().equals(evento.getFechaEvento().toLocalDate())) {
                                        evento.setFechaEvento(nuevaFecha);
                                    }
                                } catch (Exception e) {
                                    log.debug("No se pudo parsear nueva fecha para evento {}: {}",
                                            evento.getEventoIdExterno(), e.getMessage());
                                }
                            }

                            // Actualizar resultado si está disponible
                            if (eventoActualizado.getStrStatus() != null) {
                                String resultado = determinarResultadoPorMarcadores(
                                        eventoActualizado.getIntHomeScore(),
                                        eventoActualizado.getIntAwayScore(),
                                        eventoActualizado.getStrStatus());
                                if (resultado != null) {
                                    evento.setResultado(resultado);
                                }
                            }

                            // Guardar cambios en la base de datos
                            eventoRepository.save(evento);
                            eventosActualizados.add(evento);
                        }
                    }

                    // Pequeña pausa entre llamadas para no sobrecargar la API
                    Thread.sleep(100);

                } catch (Exception e) {
                    log.error("Error al actualizar livescore para evento {}: {}", evento.getEventoIdExterno(),
                            e.getMessage());
                    // Agregar el evento sin actualizar en caso de error
                    eventosActualizados.add(evento);
                }
            }

            log.info("✅ Procesados {} eventos con livescores actuales", eventosActualizados.size());

            // Obtener los eventos actualizados desde la base de datos ya están en
            // eventosActualizados

        } catch (Exception e) {
            log.error("❌ Error al obtener livescores actuales: {}", e.getMessage(), e);
        }

        return eventosActualizados;
    }

    /**
     * Obtener livescores específicos para eventos en vivo
     */
    @Transactional
    public List<EventoDeportivo> obtenerLivescoresEventosEnVivo() {
        log.info("🔴 Obteniendo livescores de eventos en vivo...");
        List<EventoDeportivo> eventosEnVivo = new ArrayList<>();

        try {
            // Obtener eventos en vivo desde la base de datos
            List<EventoDeportivo> eventosEnVivoDb = eventoRepository.findByEstadoOrderByFechaEventoAsc("en_vivo");

            for (EventoDeportivo evento : eventosEnVivoDb) {
                try {
                    // Obtener livescore actualizado
                    TheSportsDbEventResponse.EventData eventoActualizado = obtenerLivescoreEvento(
                            evento.getEventoIdExterno());

                    if (eventoActualizado != null) {
                        // Actualizar el evento con los nuevos datos
                        guardarOActualizarEvento(eventoActualizado);

                        // Recargar el evento actualizado
                        Optional<EventoDeportivo> eventoRecargado = eventoRepository
                                .findByEventoIdExterno(evento.getEventoIdExterno());
                        if (eventoRecargado.isPresent()) {
                            eventosEnVivo.add(eventoRecargado.get());
                        }
                    } else {
                        // Si no hay livescore, mantener el evento actual
                        eventosEnVivo.add(evento);
                    }

                    // Pequeña pausa entre llamadas
                    Thread.sleep(100);

                } catch (Exception e) {
                    log.error("Error al actualizar livescore para evento {}: {}", evento.getEventoIdExterno(),
                            e.getMessage());
                    // Agregar el evento sin actualizar en caso de error
                    eventosEnVivo.add(evento);
                }
            }

            log.info("✅ Livescores actualizados para {} eventos en vivo", eventosEnVivo.size());

        } catch (Exception e) {
            log.error("❌ Error al obtener livescores de eventos en vivo: {}", e.getMessage(), e);
        }

        return eventosEnVivo;
    }

    /**
     * Obtener livescores completos del día actual - combina BD y API
     */
    @Transactional
    public List<EventoDeportivo> obtenerLivescoresCompletosDelDia() {
        log.info("🚀 Iniciando obtención completa de livescores del día...");
        List<EventoDeportivo> todosLosEventos = new ArrayList<>();

        try {
            // 1. Primero obtener eventos frescos desde TheSportsDB API para hoy
            LocalDate today = LocalDate.now();
            String todayStr = today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            log.info("📡 Obteniendo eventos frescos desde API para: {}", todayStr);
            List<TheSportsDbEventResponse.EventData> eventosFrescosHoy = getEventsByDate(todayStr);

            // También obtener de ayer por si hay eventos que se extendieron
            String yesterdayStr = today.minusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            log.info("📡 Obteniendo eventos de ayer desde API para: {}", yesterdayStr);
            List<TheSportsDbEventResponse.EventData> eventosFrescosAyer = getEventsByDate(yesterdayStr);

            log.info("✅ Eventos obtenidos desde API - Hoy: {}, Ayer: {}",
                    eventosFrescosHoy.size(), eventosFrescosAyer.size());

            // 2. Ahora obtener todos los eventos actualizados desde la base de datos
            LocalDateTime startOfToday = today.atStartOfDay();
            LocalDateTime endOfToday = today.atTime(23, 59, 59);
            LocalDateTime startOfYesterday = today.minusDays(1).atStartOfDay();
            LocalDateTime endOfYesterday = today.minusDays(1).atTime(23, 59, 59);

            List<EventoDeportivo> eventosHoyBD = eventoRepository.findByFechaEventoBetween(startOfToday, endOfToday);
            List<EventoDeportivo> eventosAyerBD = eventoRepository.findByFechaEventoBetween(startOfYesterday,
                    endOfYesterday);

            // 3. Combinar todos los eventos sin duplicados
            todosLosEventos.addAll(eventosHoyBD);
            todosLosEventos.addAll(eventosAyerBD);

            // 4. Actualizar livescores para eventos que podrían estar en vivo o finalizando
            List<EventoDeportivo> eventosActualizados = new ArrayList<>();

            for (EventoDeportivo evento : todosLosEventos) {
                try {
                    if (evento.getEventoIdExterno() != null &&
                            (evento.getEstado().equals("en_vivo") ||
                                    evento.getEstado().equals("programado") ||
                                    evento.getFechaEvento().isAfter(LocalDateTime.now().minusHours(6)))) {

                        // Obtener livescore actualizado para eventos recientes o en vivo
                        TheSportsDbEventResponse.EventData eventoActualizado = obtenerLivescoreEvento(
                                evento.getEventoIdExterno());

                        if (eventoActualizado != null) {
                            guardarOActualizarEvento(eventoActualizado);
                        }

                        // Recargar desde BD
                        Optional<EventoDeportivo> eventoRecargado = eventoRepository
                                .findByEventoIdExterno(evento.getEventoIdExterno());
                        if (eventoRecargado.isPresent()) {
                            eventosActualizados.add(eventoRecargado.get());
                        } else {
                            eventosActualizados.add(evento);
                        }

                        // Pausa para no sobrecargar la API
                        Thread.sleep(150);
                    } else {
                        // Para eventos antiguos o finalizados, usar datos existentes
                        eventosActualizados.add(evento);
                    }

                } catch (Exception e) {
                    log.error("Error al actualizar evento {}: {}", evento.getEventoIdExterno(), e.getMessage());
                    eventosActualizados.add(evento);
                }
            }

            // 5. Ordenar por fecha y estado
            eventosActualizados.sort((e1, e2) -> {
                // Primero por estado (en_vivo primero, luego programado, luego finalizado)
                int estadoComparison = compararEstados(e1.getEstado(), e2.getEstado());
                if (estadoComparison != 0) {
                    return estadoComparison;
                }
                // Luego por fecha
                return e1.getFechaEvento().compareTo(e2.getFechaEvento());
            });

            log.info("🎯 Livescores completos obtenidos: {} eventos totales", eventosActualizados.size());
            log.info("📈 Distribución por estado:");

            long enVivo = eventosActualizados.stream().filter(e -> "en_vivo".equals(e.getEstado())).count();
            long programados = eventosActualizados.stream().filter(e -> "programado".equals(e.getEstado())).count();
            long finalizados = eventosActualizados.stream().filter(e -> "finalizado".equals(e.getEstado())).count();
            long cancelados = eventosActualizados.stream().filter(e -> "cancelado".equals(e.getEstado())).count();

            log.info("   🔴 En vivo: {}", enVivo);
            log.info("   ⏱️ Programados: {}", programados);
            log.info("   ✅ Finalizados: {}", finalizados);
            log.info("   ❌ Cancelados: {}", cancelados);

            return eventosActualizados;

        } catch (Exception e) {
            log.error("❌ Error al obtener livescores completos del día: {}", e.getMessage(), e);
            return todosLosEventos;
        }
    }

    /**
     * Helper para comparar estados de eventos (para ordenamiento)
     */
    private int compararEstados(String estado1, String estado2) {
        Map<String, Integer> prioridades = Map.of(
                "en_vivo", 1,
                "programado", 2,
                "finalizado", 3,
                "cancelado", 4);

        int prioridad1 = prioridades.getOrDefault(estado1, 5);
        int prioridad2 = prioridades.getOrDefault(estado2, 5);

        return Integer.compare(prioridad1, prioridad2);
    }

    /**
     * Obtener solo eventos en vivo del día actual con livescores actualizados
     */
    @Transactional
    public List<EventoDeportivo> obtenerEventosEnVivoDelDia() {
        log.info("🔴 Obteniendo eventos en vivo del día actual...");

        try {
            // Obtener todos los livescores del día
            List<EventoDeportivo> todosLosEventos = obtenerLivescoresCompletosDelDia();

            // Filtrar solo los eventos en vivo
            List<EventoDeportivo> eventosEnVivo = todosLosEventos.stream()
                    .filter(evento -> "en_vivo".equals(evento.getEstado()))
                    .sorted((e1, e2) -> e1.getFechaEvento().compareTo(e2.getFechaEvento()))
                    .toList();

            log.info("🔴 Eventos en vivo encontrados: {}", eventosEnVivo.size());

            return eventosEnVivo;

        } catch (Exception e) {
            log.error("❌ Error al obtener eventos en vivo del día: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Obtener eventos programados para las próximas horas
     */
    @Transactional
    public List<EventoDeportivo> obtenerEventosProximasHoras(int horas) {
        log.info("⏱️ Obteniendo eventos de las próximas {} horas...", horas);

        try {
            LocalDateTime ahora = LocalDateTime.now();
            LocalDateTime limite = ahora.plusHours(horas);

            List<EventoDeportivo> eventosProximos = eventoRepository.findByFechaEventoBetween(ahora, limite)
                    .stream()
                    .filter(evento -> "programado".equals(evento.getEstado()) || "en_vivo".equals(evento.getEstado()))
                    .sorted((e1, e2) -> e1.getFechaEvento().compareTo(e2.getFechaEvento()))
                    .toList();

            log.info("⏱️ Eventos próximos encontrados: {}", eventosProximos.size());

            return eventosProximos;

        } catch (Exception e) {
            log.error("❌ Error al obtener eventos próximos: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Parsear fecha desde LiveScore (formato puede ser diferente)
     */
    private LocalDateTime parsearFechaLivescore(String fechaStr, String horaStr) throws DateTimeParseException {
        if (fechaStr == null || fechaStr.isEmpty()) {
            throw new DateTimeParseException("Fecha de livescore vacía", fechaStr, 0);
        }

        try {
            // Intentar diferentes formatos de fecha comunes en APIs
            LocalDate fecha;

            // Formato ISO: yyyy-MM-dd
            if (fechaStr.matches("\\d{4}-\\d{2}-\\d{2}")) {
                fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }
            // Formato dd/MM/yyyy
            else if (fechaStr.matches("\\d{2}/\\d{2}/\\d{4}")) {
                fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            }
            // Formato MM/dd/yyyy (estadounidense)
            else if (fechaStr.matches("\\d{2}/\\d{2}/\\d{4}")) {
                fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("MM/dd/yyyy"));
            }
            // Formato dd-MM-yyyy
            else if (fechaStr.matches("\\d{2}-\\d{2}-\\d{4}")) {
                fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
            }
            // Si no coincide con ningún formato, usar el formato por defecto
            else {
                fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }

            // Parsear hora si está disponible
            if (horaStr != null && !horaStr.isEmpty()) {
                try {
                    LocalTime hora;

                    // Formato HH:mm:ss
                    if (horaStr.matches("\\d{2}:\\d{2}:\\d{2}")) {
                        hora = LocalTime.parse(horaStr, DateTimeFormatter.ofPattern("HH:mm:ss"));
                    }
                    // Formato HH:mm
                    else if (horaStr.matches("\\d{2}:\\d{2}")) {
                        hora = LocalTime.parse(horaStr, DateTimeFormatter.ofPattern("HH:mm"));
                    }
                    // Si no se puede parsear, usar medianoche
                    else {
                        hora = LocalTime.MIDNIGHT;
                    }

                    return LocalDateTime.of(fecha, hora);
                } catch (DateTimeParseException e) {
                    log.debug("No se pudo parsear la hora del livescore {}, usando medianoche", horaStr);
                }
            }

            return LocalDateTime.of(fecha, LocalTime.MIDNIGHT);

        } catch (DateTimeParseException e) {
            log.error("Error al parsear fecha de livescore: {} - {}", fechaStr, e.getMessage());
            throw e;
        }
    }

    /**
     * Determinar estado basado en el status del livescore
     */
    private String determinarEstadoPorStatus(String status) {
        if (status == null || status.isEmpty()) {
            return "programado";
        }

        String statusLower = status.toLowerCase().trim();

        // Estados en vivo (más variaciones)
        if (statusLower.contains("live") || statusLower.contains("1h") || statusLower.contains("2h") ||
                statusLower.contains("q1") || statusLower.contains("q2") || statusLower.contains("q3")
                || statusLower.contains("q4") ||
                statusLower.contains("in progress") || statusLower.contains("halftime") || statusLower.contains("ht") ||
                statusLower.contains("half time") || statusLower.contains("break") || statusLower.contains("interval")
                ||
                statusLower.contains("overtime") || statusLower.contains("extra time") || statusLower.contains("et") ||
                statusLower.contains("penalty") || statusLower.contains("penalties")) {
            return "en_vivo";
        }

        // Estados finalizados
        if (statusLower.contains("full time") || statusLower.contains("ft") || statusLower.contains("final") ||
                statusLower.contains("finished") || statusLower.contains("completed") || statusLower.contains("ended")
                ||
                statusLower.contains("result") || statusLower.contains("aet")
                || statusLower.contains("after extra time")) {
            return "finalizado";
        }

        // Estados cancelados/pospuestos
        if (statusLower.contains("cancelled") || statusLower.contains("canceled") || statusLower.contains("postponed")
                ||
                statusLower.contains("suspended") || statusLower.contains("abandoned") || statusLower.contains("void")
                ||
                statusLower.contains("delayed") || statusLower.contains("rescheduled")) {
            return "cancelado";
        }

        // Estados próximos/programados
        if (statusLower.contains("scheduled") || statusLower.contains("upcoming") || statusLower.contains("fixture") ||
                statusLower.contains("not started") || statusLower.contains("vs") || statusLower.isEmpty()) {
            return "programado";
        }

        // Por defecto, programado
        return "programado";
    }

    /**
     * Determinar resultado basado en marcadores y estado
     */
    private String determinarResultadoPorMarcadores(Integer marcadorLocal, Integer marcadorVisitante, String estado) {
        // Solo determinar resultado si el evento ha finalizado
        if (estado == null || !estado.toLowerCase().contains("final") && !estado.toLowerCase().contains("ft") &&
                !estado.toLowerCase().contains("finished") && !estado.toLowerCase().contains("completed")) {
            return null; // No hay resultado aún
        }

        // Si no hay marcadores, no se puede determinar resultado
        if (marcadorLocal == null || marcadorVisitante == null) {
            return null;
        }

        // Determinar ganador
        if (marcadorLocal > marcadorVisitante) {
            return "LOCAL";
        } else if (marcadorVisitante > marcadorLocal) {
            return "VISITANTE";
        } else {
            return "EMPATE";
        }
    }
}
