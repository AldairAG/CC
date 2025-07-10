package com.example.cc.controller;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.Deporte;
import com.example.cc.entities.Liga;
import com.example.cc.service.deportes.IEventoDeportivoService;
import com.example.cc.service.apuestas.CuotaEventoService;
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
public class EventoDeportivoController {

    private final IEventoDeportivoService eventoDeportivoService;
    private final IDeporteService deporteService;
    private final ILigaService ligaService;
    private final EventoDeportivoScheduler eventoScheduler;
    private final com.example.cc.service.external.ITheSportsDbService theSportsDbService;
    private final CuotaEventoService cuotaEventoService;

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

    /**
     * Generar cuotas completas para un evento específico
     */
    @PostMapping("/{eventoId}/generar-cuotas")
    public ResponseEntity<Map<String, Object>> generarCuotasEvento(@PathVariable Long eventoId) {
        try {
            Optional<EventoDeportivo> eventoOpt = eventoDeportivoService.getEventoById(eventoId);
            if (eventoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            EventoDeportivo evento = eventoOpt.get();
            var cuotasGeneradas = cuotaEventoService.generarCuotasParaEvento(eventoId);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Cuotas generadas exitosamente",
                "eventoId", eventoId,
                "nombreEvento", evento.getNombreEvento(),
                "totalCuotas", cuotasGeneradas.size(),
                "mercados", cuotasGeneradas.stream()
                    .map(cuota -> cuota.getTipoResultado().getMercado())
                    .distinct()
                    .count()
            ));
            
        } catch (Exception e) {
            log.error("Error al generar cuotas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al generar cuotas: " + e.getMessage()
            ));
        }
    }

    /**
     * Generar cuotas para todos los eventos que no tienen cuotas
     */
    @PostMapping("/generar-cuotas-faltantes")
    public ResponseEntity<Map<String, Object>> generarCuotasFaltantes() {
        try {
            List<EventoDeportivo> todosLosEventos = eventoDeportivoService.getAllEventos();
            int eventosConCuotas = 0;
            int eventosConErrores = 0;
            
            for (EventoDeportivo evento : todosLosEventos) {
                try {
                    var cuotasExistentes = cuotaEventoService.getCuotasByEventoId(evento.getId());
                    if (cuotasExistentes.isEmpty()) {
                        cuotaEventoService.generarCuotasParaEvento(evento.getId());
                        eventosConCuotas++;
                        log.info("Cuotas generadas para evento: {}", evento.getNombreEvento());
                    }
                } catch (Exception e) {
                    eventosConErrores++;
                    log.error("Error generando cuotas para evento {}: {}", evento.getId(), e.getMessage());
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Proceso completado",
                "totalEventos", todosLosEventos.size(),
                "eventosConCuotasGeneradas", eventosConCuotas,
                "eventosConErrores", eventosConErrores
            ));
            
        } catch (Exception e) {
            log.error("Error al generar cuotas faltantes: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al generar cuotas faltantes: " + e.getMessage()
            ));
        }
    }

    /**
     * Verificar si un evento tiene cuotas completas
     */
    @GetMapping("/{eventoId}/verificar-cuotas")
    public ResponseEntity<Map<String, Object>> verificarCuotasCompletas(@PathVariable Long eventoId) {
        try {
            Optional<EventoDeportivo> eventoOpt = eventoDeportivoService.getEventoById(eventoId);
            if (eventoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            EventoDeportivo evento = eventoOpt.get();
            boolean cuotasCompletas = theSportsDbService.verificarCuotasCompletas(eventoId);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "eventoId", eventoId,
                "nombreEvento", evento.getNombreEvento(),
                "cuotasCompletas", cuotasCompletas,
                "message", cuotasCompletas ? "El evento tiene cuotas completas" : "El evento tiene cuotas incompletas"
            ));
            
        } catch (Exception e) {
            log.error("Error al verificar cuotas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al verificar cuotas: " + e.getMessage()
            ));
        }
    }

    /**
     * Determinar qué cuotas faltan para un evento
     */
    @GetMapping("/{eventoId}/cuotas-faltantes")
    public ResponseEntity<Map<String, Object>> determinarCuotasFaltantes(@PathVariable Long eventoId) {
        try {
            Optional<EventoDeportivo> eventoOpt = eventoDeportivoService.getEventoById(eventoId);
            if (eventoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            EventoDeportivo evento = eventoOpt.get();
            var tiposFaltantes = theSportsDbService.determinarCuotasFaltantes(eventoId);
            
            // Agrupar por mercado para respuesta más organizada
            Map<String, Long> cuotasFaltantesPorMercado = tiposFaltantes.stream()
                    .collect(Collectors.groupingBy(
                        tipo -> tipo.getMercado(),
                        Collectors.counting()
                    ));
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "eventoId", eventoId,
                "nombreEvento", evento.getNombreEvento(),
                "totalCuotasFaltantes", tiposFaltantes.size(),
                "cuotasFaltantesPorMercado", cuotasFaltantesPorMercado,
                "detallesTiposFaltantes", tiposFaltantes.stream().limit(10).map(Enum::name).collect(Collectors.toList())
            ));
            
        } catch (Exception e) {
            log.error("Error al determinar cuotas faltantes para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al determinar cuotas faltantes: " + e.getMessage()
            ));
        }
    }

    /**
     * Crear cuotas faltantes para un evento específico
     */
    @PostMapping("/{eventoId}/crear-cuotas-faltantes")
    public ResponseEntity<Map<String, Object>> crearCuotasFaltantes(@PathVariable Long eventoId) {
        try {
            Optional<EventoDeportivo> eventoOpt = eventoDeportivoService.getEventoById(eventoId);
            if (eventoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            EventoDeportivo evento = eventoOpt.get();
            boolean cuotasCreadas = theSportsDbService.crearCuotasFaltantes(eventoId);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "eventoId", eventoId,
                "nombreEvento", evento.getNombreEvento(),
                "cuotasCreadas", cuotasCreadas,
                "message", cuotasCreadas ? "Cuotas faltantes creadas exitosamente" : "No fue necesario crear cuotas adicionales"
            ));
            
        } catch (Exception e) {
            log.error("Error al crear cuotas faltantes para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al crear cuotas faltantes: " + e.getMessage()
            ));
        }
    }

    /**
     * Verificar y crear cuotas para eventos activos (programados y en vivo)
     */
    @PostMapping("/verificar-cuotas-eventos-activos")
    public ResponseEntity<Map<String, Object>> verificarCuotasEventosActivos() {
        try {
            var resumen = theSportsDbService.verificarCuotasEventosActivos();
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Verificación de cuotas completada",
                "totalEventos", resumen.getTotalEventos(),
                "eventosCompletos", resumen.getEventosCompletos(),
                "eventosConCuotasCreadas", resumen.getEventosConCuotasCreadas(),
                "eventosConErrores", resumen.getEventosConErrores(),
                "resumen", resumen.toString()
            ));
            
        } catch (Exception e) {
            log.error("Error al verificar cuotas de eventos activos: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al verificar cuotas de eventos activos: " + e.getMessage()
            ));
        }
    }

    /**
     * Verificar y crear cuotas para eventos por estados específicos
     */
    @PostMapping("/verificar-cuotas-por-estados")
    public ResponseEntity<Map<String, Object>> verificarCuotasPorEstados(
            @RequestBody Map<String, List<String>> requestBody) {
        try {
            List<String> estados = requestBody.get("estados");
            if (estados == null || estados.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Se requiere la lista de estados"
                ));
            }
            
            var resumen = theSportsDbService.verificarCuotasEventosPorEstados(estados);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Verificación de cuotas por estados completada",
                "estadosVerificados", estados,
                "totalEventos", resumen.getTotalEventos(),
                "eventosCompletos", resumen.getEventosCompletos(),
                "eventosConCuotasCreadas", resumen.getEventosConCuotasCreadas(),
                "eventosConErrores", resumen.getEventosConErrores(),
                "resumen", resumen.toString()
            ));
            
        } catch (Exception e) {
            log.error("Error al verificar cuotas por estados: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al verificar cuotas por estados: " + e.getMessage()
            ));
        }
    }

    /**
     * Verificar cuotas para eventos próximos
     */
    @PostMapping("/verificar-cuotas-proximos")
    public ResponseEntity<Map<String, Object>> verificarCuotasEventosProximos(
            @RequestParam(defaultValue = "7") int diasAdelante) {
        try {
            var resumen = theSportsDbService.verificarCuotasEventosProximos(diasAdelante);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Verificación de cuotas para eventos próximos completada",
                "diasAdelante", diasAdelante,
                "totalEventos", resumen.getTotalEventos(),
                "eventosCompletos", resumen.getEventosCompletos(),
                "eventosConCuotasCreadas", resumen.getEventosConCuotasCreadas(),
                "eventosConErrores", resumen.getEventosConErrores(),
                "resumen", resumen.toString()
            ));
            
        } catch (Exception e) {
            log.error("Error al verificar cuotas de eventos próximos: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al verificar cuotas de eventos próximos: " + e.getMessage()
            ));
        }
    }

    /**
     * Obtener estadísticas de cuotas para un evento específico
     */
    @GetMapping("/{eventoId}/estadisticas-cuotas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasCuotas(@PathVariable Long eventoId) {
        try {
            Optional<EventoDeportivo> eventoOpt = eventoDeportivoService.getEventoById(eventoId);
            if (eventoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            var estadisticas = theSportsDbService.obtenerEstadisticasCuotasEvento(eventoId);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Estadísticas de cuotas obtenidas exitosamente",
                "datos", estadisticas
            ));
            
        } catch (Exception e) {
            log.error("Error al obtener estadísticas de cuotas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al obtener estadísticas de cuotas: " + e.getMessage()
            ));
        }
    }

    /**
     * Obtener verificación detallada de cuotas para un evento
     */
    @GetMapping("/{eventoId}/cuotas-detalladas")
    public ResponseEntity<Map<String, Object>> obtenerCuotasDetalladas(@PathVariable Long eventoId) {
        try {
            Optional<EventoDeportivo> eventoOpt = eventoDeportivoService.getEventoById(eventoId);
            if (eventoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            var cuotasDetalladas = theSportsDbService.verificarCuotasDetalladasEvento(eventoId);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Información detallada de cuotas obtenida exitosamente",
                "datos", cuotasDetalladas
            ));
            
        } catch (Exception e) {
            log.error("Error al obtener cuotas detalladas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al obtener cuotas detalladas: " + e.getMessage()
            ));
        }
    }

    /**
     * Forzar creación de cuotas para un evento
     */
    @PostMapping("/{eventoId}/forzar-creacion-cuotas")
    public ResponseEntity<Map<String, Object>> forzarCreacionCuotas(@PathVariable Long eventoId) {
        try {
            Optional<EventoDeportivo> eventoOpt = eventoDeportivoService.getEventoById(eventoId);
            if (eventoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            EventoDeportivo evento = eventoOpt.get();
            boolean cuotasCreadas = theSportsDbService.forzarCreacionCuotas(eventoId);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "eventoId", eventoId,
                "nombreEvento", evento.getNombreEvento(),
                "cuotasCreadas", cuotasCreadas,
                "message", cuotasCreadas ? "Cuotas creadas exitosamente" : "No se pudieron crear cuotas"
            ));
            
        } catch (Exception e) {
            log.error("Error al forzar creación de cuotas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al forzar creación de cuotas: " + e.getMessage()
            ));
        }
    }

    /**
     * Ejecutar manualmente la verificación de cuotas programada
     */
    @PostMapping("/ejecutar-verificacion-cuotas")
    public ResponseEntity<Map<String, Object>> ejecutarVerificacionCuotas() {
        try {
            log.info("🎯 Ejecutando verificación manual de cuotas desde API");
            
            // Usar el scheduler para ejecutar la verificación
            eventoScheduler.forzarVerificacionCuotas();
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Verificación de cuotas ejecutada exitosamente",
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            log.error("Error al ejecutar verificación de cuotas: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al ejecutar verificación de cuotas: " + e.getMessage()
            ));
        }
    }

    /**
     * Ejecutar manualmente la verificación de cuotas para eventos próximos
     */
    @PostMapping("/ejecutar-verificacion-cuotas-proximos")
    public ResponseEntity<Map<String, Object>> ejecutarVerificacionCuotasProximos() {
        try {
            log.info("📅 Ejecutando verificación manual de cuotas eventos próximos desde API");
            
            // Usar el scheduler para ejecutar la verificación
            eventoScheduler.forzarVerificacionCuotasProximos();
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Verificación de cuotas eventos próximos ejecutada exitosamente",
                "timestamp", LocalDateTime.now()
            ));
            
        } catch (Exception e) {
            log.error("Error al ejecutar verificación de cuotas próximos: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", "Error al ejecutar verificación de cuotas próximos: " + e.getMessage()
            ));
        }
    }
}
