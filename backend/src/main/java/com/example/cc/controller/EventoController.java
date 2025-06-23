package com.example.cc.controller;

import com.example.cc.entities.Evento;
import com.example.cc.service.evento.IEventoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/cc/eventos")
@CrossOrigin(origins = "*")
@Slf4j
public class EventoController {

    @Autowired
    private IEventoService eventoService;

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
            @RequestParam String equipoVisitante) {

        try {
            log.info("Buscando evento: {} vs {}", equipoLocal, equipoVisitante);

            Optional<Evento> evento = eventoService.buscarOCrearEvento(equipoLocal, equipoVisitante);

            if (evento.isPresent()) {
                return ResponseEntity.ok(evento.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("mensaje", "Evento no encontrado en ninguna fuente"));
            }

        } catch (Exception e) {
            log.error("Error al buscar o crear evento", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @PostMapping("/sincronizar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> sincronizarEventosPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        try {
            log.info("Sincronizando eventos para la fecha: {}", fecha);

            List<Evento> eventosNuevos = eventoService.sincronizarEventosPorFecha(fecha);

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
}
