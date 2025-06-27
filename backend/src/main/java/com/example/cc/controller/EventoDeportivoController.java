package com.example.cc.controller;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.service.deportes.EventoDeportivoService;
import com.example.cc.scheduler.EventoDeportivoScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eventos-deportivos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EventoDeportivoController {

    private final EventoDeportivoService eventoDeportivoService;
    private final EventoDeportivoScheduler eventoScheduler;

    /**
     * Obtener eventos por rango de fechas
     */
    @GetMapping
    public ResponseEntity<List<EventoDeportivo>> getEventos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
            @RequestParam(required = false) String deporte,
            @RequestParam(required = false) String liga) {

        try {
            List<EventoDeportivo> eventos;

            if (deporte != null && !deporte.trim().isEmpty()) {
                eventos = eventoDeportivoService.getEventosPorDeporte(deporte);
            } else if (liga != null && !liga.trim().isEmpty()) {
                eventos = eventoDeportivoService.getEventosPorLiga(liga);
            } else if (fechaInicio != null && fechaFin != null) {
                eventos = eventoDeportivoService.getEventosPorFechas(fechaInicio, fechaFin);
            } else {
                // Por defecto, obtener eventos de los próximos 7 días
                LocalDateTime inicio = LocalDateTime.now();
                LocalDateTime fin = inicio.plusDays(7);
                eventos = eventoDeportivoService.getEventosPorFechas(inicio, fin);
            }

            return ResponseEntity.ok(eventos);

        } catch (Exception e) {
            log.error("Error al obtener eventos: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener eventos de los próximos 7 días
     */
    @GetMapping("/proximos")
    public ResponseEntity<List<EventoDeportivo>> getEventosProximos() {
        try {
            LocalDateTime inicio = LocalDateTime.now();
            LocalDateTime fin = inicio.plusDays(7);
            List<EventoDeportivo> eventos = eventoDeportivoService.getEventosPorFechas(inicio, fin);
            return ResponseEntity.ok(eventos);
        } catch (Exception e) {
            log.error("Error al obtener eventos próximos: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener eventos por deporte específico
     */
    @GetMapping("/deporte/{deporte}")
    public ResponseEntity<List<EventoDeportivo>> getEventosPorDeporte(@PathVariable String deporte) {
        try {
            List<EventoDeportivo> eventos = eventoDeportivoService.getEventosPorDeporte(deporte);
            return ResponseEntity.ok(eventos);
        } catch (Exception e) {
            log.error("Error al obtener eventos por deporte: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener eventos por liga específica
     */
    @GetMapping("/liga/{liga}")
    public ResponseEntity<List<EventoDeportivo>> getEventosPorLiga(@PathVariable String liga) {
        try {
            List<EventoDeportivo> eventos = eventoDeportivoService.getEventosPorLiga(liga);
            return ResponseEntity.ok(eventos);
        } catch (Exception e) {
            log.error("Error al obtener eventos por liga: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Forzar sincronización manual (útil para pruebas)
     */
    @PostMapping("/sincronizar")
    public ResponseEntity<Map<String, String>> forzarSincronizacion() {
        try {
            log.info("Iniciando sincronización manual solicitada por API");
            eventoScheduler.forzarSincronizacion();
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Sincronización iniciada correctamente"
            ));
            
        } catch (Exception e) {
            log.error("Error al forzar sincronización: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al iniciar sincronización: " + e.getMessage()
            ));
        }
    }

    /**
     * Limpiar eventos antiguos manualmente
     */
    @DeleteMapping("/limpiar-antiguos")
    public ResponseEntity<Map<String, String>> limpiarEventosAntiguos() {
        try {
            eventoDeportivoService.limpiarEventosAntiguos();
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Eventos antiguos eliminados correctamente"
            ));
            
        } catch (Exception e) {
            log.error("Error al limpiar eventos antiguos: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al limpiar eventos: " + e.getMessage()
            ));
        }
    }

    /**
     * Obtener estadísticas de eventos
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> getEstadisticas() {
        try {
            LocalDateTime inicio = LocalDateTime.now();
            LocalDateTime fin = inicio.plusDays(7);
            List<EventoDeportivo> eventosProximos = eventoDeportivoService.getEventosPorFechas(inicio, fin);
            
            // Contar eventos por deporte
            Map<String, Long> eventosPorDeporte = eventosProximos.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    evento -> evento.getDeporte() != null ? evento.getDeporte() : "Sin especificar",
                    java.util.stream.Collectors.counting()
                ));
            
            // Contar eventos por estado
            Map<String, Long> eventosPorEstado = eventosProximos.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    evento -> evento.getEstado() != null ? evento.getEstado() : "Sin especificar",
                    java.util.stream.Collectors.counting()
                ));
            
            return ResponseEntity.ok(Map.of(
                "totalEventosProximos", eventosProximos.size(),
                "eventosPorDeporte", eventosPorDeporte,
                "eventosPorEstado", eventosPorEstado,
                "fechaConsulta", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            log.error("Error al obtener estadísticas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
