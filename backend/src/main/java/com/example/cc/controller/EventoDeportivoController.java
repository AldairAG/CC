package com.example.cc.controller;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.Deporte;
import com.example.cc.entities.Liga;
import com.example.cc.service.deportes.IEventoDeportivoService;
import com.example.cc.service.deportes.IDeporteService;
import com.example.cc.service.deportes.ILigaService;
import com.example.cc.scheduler.EventoDeportivoScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cc/eventos-deportivos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EventoDeportivoController {

    private final IEventoDeportivoService eventoDeportivoService;
    private final IDeporteService deporteService;
    private final ILigaService ligaService;
    private final EventoDeportivoScheduler eventoScheduler;
    private final com.example.cc.service.external.ITheSportsDbService theSportsDbService;

    /**
     * Obtener eventos por rango de fechas
     */
    @GetMapping
    public ResponseEntity<List<EventoDeportivo>> getEventos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
            @RequestParam(required = false) String deporteNombre,
            @RequestParam(required = false) String ligaNombre) {

        try {
            List<EventoDeportivo> eventos;

            if (deporteNombre != null && !deporteNombre.trim().isEmpty()) {
                Optional<Deporte> deporteOpt = deporteService.getDeporteByNombre(deporteNombre);
                if (deporteOpt.isPresent()) {
                    eventos = eventoDeportivoService.getEventosPorDeporte(deporteOpt.get());
                } else {
                    return ResponseEntity.ok(List.of()); // Sin eventos si no existe el deporte
                }
            } else if (ligaNombre != null && !ligaNombre.trim().isEmpty()) {
                Optional<Liga> ligaOpt = ligaService.getLigaByNombre(ligaNombre);
                if (ligaOpt.isPresent()) {
                    eventos = eventoDeportivoService.getEventosPorLiga(ligaOpt.get());
                } else {
                    return ResponseEntity.ok(List.of()); // Sin eventos si no existe la liga
                }
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
    @GetMapping("/deporte/{deporteNombre}")
    public ResponseEntity<List<EventoDeportivo>> getEventosPorDeporte(@PathVariable String deporteNombre) {
        try {
            Optional<Deporte> deporteOpt = deporteService.getDeporteByNombre(deporteNombre);
            if (deporteOpt.isPresent()) {
                List<EventoDeportivo> eventos = eventoDeportivoService.getEventosPorDeporte(deporteOpt.get());
                return ResponseEntity.ok(eventos);
            } else {
                return ResponseEntity.ok(List.of()); // Sin eventos si no existe el deporte
            }
        } catch (Exception e) {
            log.error("Error al obtener eventos por deporte: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener eventos por liga específica
     */
    @GetMapping("/liga/{ligaNombre}")
    public ResponseEntity<List<EventoDeportivo>> getEventosPorLiga(@PathVariable String ligaNombre) {
        try {
            Optional<Liga> ligaOpt = ligaService.getLigaByNombre(ligaNombre);
            if (ligaOpt.isPresent()) {
                List<EventoDeportivo> eventos = eventoDeportivoService.getEventosPorLiga(ligaOpt.get());
                return ResponseEntity.ok(eventos);
            } else {
                return ResponseEntity.ok(List.of()); // Sin eventos si no existe la liga
            }
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
                .collect(Collectors.groupingBy(
                    evento -> evento.getDeporte() != null ? evento.getDeporte().getNombre() : "Sin especificar",
                    Collectors.counting()
                ));
            
            // Contar eventos por estado
            Map<String, Long> eventosPorEstado = eventosProximos.stream()
                .collect(Collectors.groupingBy(
                    evento -> evento.getEstado() != null ? evento.getEstado() : "Sin especificar",
                    Collectors.counting()
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

    /**
     * Obtener todos los deportes disponibles
     */
    @GetMapping("/deportes")
    public ResponseEntity<List<Deporte>> getDeportes() {
        try {
            List<Deporte> deportes = deporteService.getDeportesActivos();
            return ResponseEntity.ok(deportes);
        } catch (Exception e) {
            log.error("Error al obtener deportes: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener todas las ligas disponibles
     */
    @GetMapping("/ligas")
    public ResponseEntity<List<Liga>> getLigas() {
        try {
            List<Liga> ligas = ligaService.getLigasActivas();
            return ResponseEntity.ok(ligas);
        } catch (Exception e) {
            log.error("Error al obtener ligas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener ligas por deporte
     */
    @GetMapping("/deportes/{deporteNombre}/ligas")
    public ResponseEntity<List<Liga>> getLigasPorDeporte(@PathVariable String deporteNombre) {
        try {
            Optional<Deporte> deporteOpt = deporteService.getDeporteByNombre(deporteNombre);
            if (deporteOpt.isPresent()) {
                List<Liga> ligas = ligaService.getLigasByDeporte(deporteOpt.get());
                return ResponseEntity.ok(ligas);
            } else {
                return ResponseEntity.ok(List.of());
            }
        } catch (Exception e) {
            log.error("Error al obtener ligas por deporte: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Buscar evento por nombre y fecha específica
     */
    @GetMapping("/buscar-por-nombre-fecha/{nombreEvento}/{fecha}")
    public ResponseEntity<EventoDeportivo> obtenerEventoPorNombreYFecha(
            @PathVariable String nombreEvento,
            @PathVariable String fecha,
            @RequestParam(required = false) String equipoLocal,
            @RequestParam(required = false) String equipoVisitante) {
        
        try {
            LocalDateTime fechaEvento = LocalDateTime.parse(fecha);
            LocalDateTime fechaFin = fechaEvento.plusDays(1);
            
            Optional<EventoDeportivo> evento = eventoDeportivoService.buscarPorNombreYFecha(
                nombreEvento, fechaEvento, fechaFin, equipoLocal, equipoVisitante);
            
            if (evento.isPresent()) {
                return ResponseEntity.ok(evento.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error al buscar evento por nombre y fecha: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener eventos por fecha específica
     */
    @GetMapping("/por-fecha")
    public ResponseEntity<List<EventoDeportivo>> obtenerEventosPorFecha(
            @RequestParam String fecha,
            @RequestParam(required = false) String deporte,
            @RequestParam(required = false) String liga) {
        
        try {
            LocalDateTime fechaEvento = LocalDateTime.parse(fecha + "T00:00:00");
            LocalDateTime fechaFin = fechaEvento.plusDays(1);
            
            List<EventoDeportivo> eventos = eventoDeportivoService.buscarPorFecha(
                fechaEvento, fechaFin, deporte, liga);
            
            return ResponseEntity.ok(eventos);
        } catch (Exception e) {
            log.error("Error al obtener eventos por fecha: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // ===== ENDPOINTS PARA LIVESCORES =====

    /**
     * Obtener livescores actuales de todos los eventos del día
     */
    @GetMapping("/livescores/actuales")
    public ResponseEntity<List<EventoDeportivo>> obtenerLivescoresActuales() {
        try {
            log.info("🔴 Solicitud de livescores actuales recibida");
            List<EventoDeportivo> eventosConLivescores = theSportsDbService.obtenerYGuardarLivescoresActuales();
            
            log.info("✅ Devueltos {} eventos con livescores actuales", eventosConLivescores.size());
            return ResponseEntity.ok(eventosConLivescores);
            
        } catch (Exception e) {
            log.error("❌ Error al obtener livescores actuales: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(List.of()); // Retornar lista vacía en caso de error
        }
    }

    /**
     * Obtener livescores específicos para eventos en vivo
     */
    @GetMapping("/livescores/en-vivo")
    public ResponseEntity<List<EventoDeportivo>> obtenerLivescoresEnVivo() {
        try {
            log.info("🔴 Solicitud de livescores en vivo recibida");
            List<EventoDeportivo> eventosEnVivo = theSportsDbService.obtenerLivescoresEventosEnVivo();
            
            log.info("✅ Devueltos {} eventos en vivo con livescores", eventosEnVivo.size());
            return ResponseEntity.ok(eventosEnVivo);
            
        } catch (Exception e) {
            log.error("❌ Error al obtener livescores en vivo: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(List.of()); // Retornar lista vacía en caso de error
        }
    }

    /**
     * Forzar actualización de livescores (para uso administrativo)
     */
    @PostMapping("/livescores/actualizar")
    public ResponseEntity<Map<String, Object>> actualizarLivescores() {
        try {
            log.info("🔄 Iniciando actualización forzada de livescores...");
            
            // Obtener livescores actuales y en vivo
            List<EventoDeportivo> livescoresActuales = theSportsDbService.obtenerYGuardarLivescoresActuales();
            List<EventoDeportivo> livescoresEnVivo = theSportsDbService.obtenerLivescoresEventosEnVivo();
            
            Map<String, Object> resultado = Map.of(
                "livescores_actuales", livescoresActuales.size(),
                "livescores_en_vivo", livescoresEnVivo.size(),
                "total_eventos_actualizados", livescoresActuales.size() + livescoresEnVivo.size(),
                "timestamp", LocalDateTime.now()
            );
            
            log.info("✅ Actualización de livescores completada: {}", resultado);
            return ResponseEntity.ok(resultado);
            
        } catch (Exception e) {
            log.error("❌ Error al actualizar livescores: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage(), "timestamp", LocalDateTime.now()));
        }
    }
}
