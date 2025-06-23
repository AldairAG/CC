package com.example.cc.controller;

import com.example.cc.entities.Evento;
import com.example.cc.service.evento.IEventoService;
import com.example.cc.service.thesportsdb.ITheSportsDbService;
import com.example.cc.repository.EventoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/cc/eventos")
@CrossOrigin(origins = "*")
@Slf4j
public class EventoController {    @Autowired
    private IEventoService eventoService;
    
    @Autowired
    private ITheSportsDbService theSportsDbService;
    
    @Autowired
    private EventoRepository eventoRepository;

    @GetMapping
    public ResponseEntity<List<Evento>> getAllEventos() {
        return ResponseEntity.ok(eventoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> getEventoById(@PathVariable Long id) {
        return eventoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Evento> createEvento(@RequestBody Evento evento) {
        return ResponseEntity.ok(eventoService.save(evento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evento> updateEvento(@PathVariable Long id, @RequestBody Evento evento) {
        return eventoService.findById(id)
                .map(existingEvento -> {
                    evento.setIdEvento(id);
                    return ResponseEntity.ok(eventoService.save(evento));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        if (!eventoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        eventoService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<Evento>> getEventosByFecha(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date fecha) {
        return ResponseEntity.ok(eventoService.findByFechaPartido(fecha));
    }

    @GetMapping("/equipo-local/{equipo}")
    public ResponseEntity<List<Evento>> getEventosByEquipoLocal(@PathVariable String equipo) {
        return ResponseEntity.ok(eventoService.findByEquipoLocal(equipo));
    }

    @GetMapping("/equipo-visitante/{equipo}")
    public ResponseEntity<List<Evento>> getEventosByEquipoVisitante(@PathVariable String equipo) {
        return ResponseEntity.ok(eventoService.findByEquipoVisitante(equipo));
    }

    @GetMapping("/quiniela/{quinielaId}")
    public ResponseEntity<List<Evento>> getEventosByQuiniela(@PathVariable Long quinielaId) {
        return ResponseEntity.ok(eventoService.findByQuinielaId(quinielaId));
    }

    // Nuevos endpoints para integración con TheSportsDB

    @GetMapping("/buscar")
    public ResponseEntity<?> buscarOCrearEvento(
            @RequestParam String equipoLocal,
            @RequestParam String equipoVisitante) {        try {
            log.info("Buscando evento: {} vs {}", equipoLocal, equipoVisitante);

            // Buscar primero en la base de datos local
            List<Evento> eventosExistentes = eventoRepository.findByEquipoLocalAndEquipoVisitante(equipoLocal, equipoVisitante);
            
            if (!eventosExistentes.isEmpty()) {
                log.info("Evento encontrado en BD local: {} vs {}", equipoLocal, equipoVisitante);
                return ResponseEntity.ok(eventosExistentes.get(0));
            }
            
            // Si no se encuentra localmente, buscar en TheSportsDB
            log.info("Buscando en TheSportsDB: {} vs {}", equipoLocal, equipoVisitante);
            List<com.example.cc.dto.response.TheSportsDbEventResponse> eventosTheSportsDb = 
                theSportsDbService.buscarEventosPorEquipos(equipoLocal, equipoVisitante);
            
            if (!eventosTheSportsDb.isEmpty()) {
                // Convertir y guardar el primer evento encontrado
                Evento eventoConvertido = convertirTheSportsDbEventoAEvento(eventosTheSportsDb.get(0));
                Evento eventoGuardado = eventoService.save(eventoConvertido);
                log.info("Evento creado desde TheSportsDB: {} vs {}", equipoLocal, equipoVisitante);
                return ResponseEntity.ok(eventoGuardado);
            }
            
            // Si no se encuentra en ninguna fuente, crear evento básico
            Evento eventoBasico = new Evento();
            eventoBasico.setEquipoLocal(equipoLocal);
            eventoBasico.setEquipoVisitante(equipoVisitante);
            eventoBasico.setNombreEvento(equipoLocal + " vs " + equipoVisitante);
            eventoBasico.setEstado("PROGRAMADO");
            eventoBasico.setFechaPartido(java.sql.Date.valueOf(java.time.LocalDate.now().plusDays(1)));
            
            Evento eventoGuardado = eventoService.save(eventoBasico);
            log.info("Evento básico creado: {} vs {}", equipoLocal, equipoVisitante);
            return ResponseEntity.ok(eventoGuardado);

        } catch (Exception e) {
            log.error("Error al buscar o crear evento", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @PostMapping("/sincronizar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> sincronizarEventosPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {        try {
            log.info("Sincronizando eventos para la fecha: {}", fecha);

            // Buscar eventos en TheSportsDB para la fecha especificada
            List<com.example.cc.dto.response.TheSportsDbEventResponse> eventosTheSportsDb = 
                theSportsDbService.buscarEventosPorFecha(fecha);
            
            List<Evento> eventosNuevos = new ArrayList<>();
            
            for (com.example.cc.dto.response.TheSportsDbEventResponse eventoTheSportsDb : eventosTheSportsDb) {
                // Verificar si el evento ya existe en la base de datos
                List<Evento> eventosExistentes = eventoRepository.findByEquipoLocalAndEquipoVisitante(
                    eventoTheSportsDb.getStrHomeTeam(), 
                    eventoTheSportsDb.getStrAwayTeam()
                );
                
                if (eventosExistentes.isEmpty()) {
                    // Convertir y guardar el evento nuevo
                    Evento eventoConvertido = convertirTheSportsDbEventoAEvento(eventoTheSportsDb);
                    Evento eventoGuardado = eventoService.save(eventoConvertido);
                    eventosNuevos.add(eventoGuardado);
                    log.info("Evento sincronizado: {} vs {}", 
                            eventoGuardado.getEquipoLocal(), eventoGuardado.getEquipoVisitante());
                }
            }

            return ResponseEntity.ok(Map.of(
                    "mensaje", "Sincronización completada",
                    "eventosNuevos", eventosNuevos.size(),
                    "eventos", eventosNuevos
            ));

        } catch (Exception e) {
            log.error("Error al sincronizar eventos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al sincronizar eventos: " + e.getMessage()));
        }
    }

    /**
     * Convierte un TheSportsDbEventResponse a una entidad Evento
     */
    private Evento convertirTheSportsDbEventoAEvento(com.example.cc.dto.response.TheSportsDbEventResponse theSportsDbEvent) {
        Evento evento = new Evento();
        
        // Mapear campos básicos
        evento.setEquipoLocal(theSportsDbEvent.getStrHomeTeam());
        evento.setEquipoVisitante(theSportsDbEvent.getStrAwayTeam());
        evento.setNombreEvento(theSportsDbEvent.getStrEvent());
        
        // Convertir fecha
        if (theSportsDbEvent.getDateEvent() != null) {
            try {
                java.time.LocalDate fechaEvento = java.time.LocalDate.parse(theSportsDbEvent.getDateEvent());
                evento.setFechaPartido(java.sql.Date.valueOf(fechaEvento));
            } catch (Exception e) {
                log.warn("Error al parsear fecha del evento desde TheSportsDB: {}. Usando fecha actual + 1 día", theSportsDbEvent.getDateEvent());
                evento.setFechaPartido(java.sql.Date.valueOf(java.time.LocalDate.now().plusDays(1)));
            }
        } else {
            // Fecha por defecto: mañana
            evento.setFechaPartido(java.sql.Date.valueOf(java.time.LocalDate.now().plusDays(1)));
        }
        
        // Mapear información adicional si está disponible
        if (theSportsDbEvent.getStrLeague() != null) {
            evento.setLiga(theSportsDbEvent.getStrLeague());
        }
        
        if (theSportsDbEvent.getStrSport() != null) {
            evento.setDeporte(theSportsDbEvent.getStrSport());
        }
        
        if (theSportsDbEvent.getStrVenue() != null) {
            evento.setEstadio(theSportsDbEvent.getStrVenue());
        }
        
        // Mapear resultados si están disponibles
        if (theSportsDbEvent.getIntHomeScore() != null && !theSportsDbEvent.getIntHomeScore().trim().isEmpty()) {
            try {
                evento.setResultadoLocal(Integer.parseInt(theSportsDbEvent.getIntHomeScore()));
            } catch (NumberFormatException e) {
                log.warn("Error al parsear resultado local: {}", theSportsDbEvent.getIntHomeScore());
            }
        }
        
        if (theSportsDbEvent.getIntAwayScore() != null && !theSportsDbEvent.getIntAwayScore().trim().isEmpty()) {
            try {
                evento.setResultadoVisitante(Integer.parseInt(theSportsDbEvent.getIntAwayScore()));
            } catch (NumberFormatException e) {
                log.warn("Error al parsear resultado visitante: {}", theSportsDbEvent.getIntAwayScore());
            }
        }
        
        // Mapear estado del evento
        if (theSportsDbEvent.getStrStatus() != null) {
            switch (theSportsDbEvent.getStrStatus().toLowerCase()) {
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
        
        log.info("Evento convertido desde TheSportsDB: {} vs {} - {}", 
                evento.getEquipoLocal(), evento.getEquipoVisitante(), evento.getFechaPartido());
        
        return evento;
    }
}
