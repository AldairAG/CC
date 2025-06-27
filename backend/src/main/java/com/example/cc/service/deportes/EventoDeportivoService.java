package com.example.cc.service.deportes;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.dto.external.TheSportsDbEventResponse;
import com.example.cc.repository.EventoDeportivoRepository;
import com.example.cc.service.external.TheSportsDbService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventoDeportivoService implements IEventoDeportivoService {

    private final EventoDeportivoRepository eventoRepository;
    private final TheSportsDbService theSportsDbService;

    /**
     * Sincronizar eventos deportivos desde TheSportsDB
     */
    @Transactional
    public void sincronizarEventosDeportivos() {
        log.info("Iniciando sincronización de eventos deportivos...");
        
        try {
            // Obtener eventos de TheSportsDB
            List<TheSportsDbEventResponse.EventData> eventosExternos = theSportsDbService.getUpcomingEvents();
            
            if (eventosExternos.isEmpty()) {
                log.warn("No se obtuvieron eventos de TheSportsDB");
                return;
            }

            int eventosNuevos = 0;
            int eventosActualizados = 0;

            for (TheSportsDbEventResponse.EventData eventoExterno : eventosExternos) {
                try {
                    // Verificar si el evento ya existe
                    Optional<EventoDeportivo> eventoExistente = eventoRepository.findByEventoIdExterno(eventoExterno.getIdEvent());
                    
                    if (eventoExistente.isPresent()) {
                        // Actualizar evento existente
                        EventoDeportivo evento = eventoExistente.get();
                        actualizarEvento(evento, eventoExterno);
                        eventoRepository.save(evento);
                        eventosActualizados++;
                        
                    } else {
                        // Crear nuevo evento
                        EventoDeportivo nuevoEvento = crearEventoDesdeExterno(eventoExterno);
                        if (nuevoEvento != null) {
                            eventoRepository.save(nuevoEvento);
                            eventosNuevos++;
                        }
                    }
                    
                } catch (Exception e) {
                    log.error("Error al procesar evento {}: {}", eventoExterno.getIdEvent(), e.getMessage());
                }
            }
            
            log.info("Sincronización completada. Eventos nuevos: {}, Eventos actualizados: {}", 
                     eventosNuevos, eventosActualizados);
            
            // Limpiar eventos antiguos
            limpiarEventosAntiguos();
            
        } catch (Exception e) {
            log.error("Error durante la sincronización de eventos: {}", e.getMessage(), e);
        }
    }

    /**
     * Crear evento desde datos externos
     */
    private EventoDeportivo crearEventoDesdeExterno(TheSportsDbEventResponse.EventData eventoExterno) {
        try {
            EventoDeportivo evento = new EventoDeportivo();
            
            evento.setEventoIdExterno(eventoExterno.getIdEvent());
            evento.setNombreEvento(eventoExterno.getStrEvent());
            evento.setLiga(eventoExterno.getStrLeague());
            evento.setDeporte(eventoExterno.getStrSport());
            evento.setEquipoLocal(eventoExterno.getStrHomeTeam());
            evento.setEquipoVisitante(eventoExterno.getStrAwayTeam());
            evento.setTemporada(eventoExterno.getStrSeason());
            evento.setDescripcion(eventoExterno.getStrDescriptionEN());
            
            // Procesar fecha y hora
            LocalDateTime fechaEvento = parsearFechaEvento(
                eventoExterno.getDateEvent(), 
                eventoExterno.getStrTime()
            );
            evento.setFechaEvento(fechaEvento);
            
            // Mapear estado
            evento.setEstado(mapearEstado(eventoExterno.getStrStatus()));
            
            return evento;
            
        } catch (Exception e) {
            log.error("Error al crear evento desde datos externos: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Actualizar evento existente
     */
    private void actualizarEvento(EventoDeportivo evento, TheSportsDbEventResponse.EventData eventoExterno) {
        evento.setNombreEvento(eventoExterno.getStrEvent());
        evento.setLiga(eventoExterno.getStrLeague());
        evento.setDeporte(eventoExterno.getStrSport());
        evento.setEquipoLocal(eventoExterno.getStrHomeTeam());
        evento.setEquipoVisitante(eventoExterno.getStrAwayTeam());
        evento.setTemporada(eventoExterno.getStrSeason());
        evento.setDescripcion(eventoExterno.getStrDescriptionEN());
        
        // Actualizar fecha y hora
        LocalDateTime fechaEvento = parsearFechaEvento(
            eventoExterno.getDateEvent(), 
            eventoExterno.getStrTime()
        );
        evento.setFechaEvento(fechaEvento);
        
        // Actualizar estado
        evento.setEstado(mapearEstado(eventoExterno.getStrStatus()));
    }

    /**
     * Parsear fecha y hora del evento
     */
    private LocalDateTime parsearFechaEvento(String fechaStr, String horaStr) {
        try {
            // Parsear fecha (formato: YYYY-MM-DD)
            LocalDate fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            
            // Parsear hora si está disponible
            LocalTime hora = LocalTime.MIDNIGHT; // Por defecto medianoche
            if (horaStr != null && !horaStr.trim().isEmpty() && !horaStr.equals("null")) {
                try {
                    hora = LocalTime.parse(horaStr, DateTimeFormatter.ofPattern("HH:mm:ss"));
                } catch (DateTimeParseException e) {
                    log.debug("No se pudo parsear la hora '{}', usando medianoche", horaStr);
                }
            }
            
            return LocalDateTime.of(fecha, hora);
            
        } catch (DateTimeParseException e) {
            log.error("Error al parsear fecha '{}': {}", fechaStr, e.getMessage());
            // Retornar fecha actual como fallback
            return LocalDateTime.now();
        }
    }

    /**
     * Mapear estado del evento
     */
    private String mapearEstado(String estadoExterno) {
        if (estadoExterno == null || estadoExterno.trim().isEmpty()) {
            return "programado";
        }
        
        switch (estadoExterno.toLowerCase()) {
            case "not started":
            case "ns":
                return "programado";
            case "match finished":
            case "ft":
            case "finished":
                return "finalizado";
            case "postponed":
            case "cancelled":
                return "cancelado";
            case "live":
            case "in play":
                return "en_vivo";
            default:
                return "programado";
        }
    }

    /**
     * Limpiar eventos antiguos (más de 30 días)
     */
    @Transactional
    public void limpiarEventosAntiguos() {
        try {
            LocalDateTime fechaLimite = LocalDateTime.now().minusDays(30);
            eventoRepository.deleteEventosAntiguos(fechaLimite);
            log.info("Eventos antiguos eliminados correctamente");
        } catch (Exception e) {
            log.error("Error al limpiar eventos antiguos: {}", e.getMessage());
        }
    }

    /**
     * Obtener eventos por rango de fechas
     */
    public List<EventoDeportivo> getEventosPorFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return eventoRepository.findByFechaEventoBetween(fechaInicio, fechaFin);
    }

    /**
     * Obtener eventos por deporte
     */
    public List<EventoDeportivo> getEventosPorDeporte(String deporte) {
        return eventoRepository.findByDeporteOrderByFechaEventoAsc(deporte);
    }

    /**
     * Obtener eventos por liga
     */
    public List<EventoDeportivo> getEventosPorLiga(String liga) {
        return eventoRepository.findByLigaOrderByFechaEventoAsc(liga);
    }
}
