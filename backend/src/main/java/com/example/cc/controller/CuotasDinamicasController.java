package com.example.cc.controller;

import com.example.cc.entities.CuotaEvento;
import com.example.cc.entities.CuotaHistorial;
import com.example.cc.entities.TipoResultado;
import com.example.cc.entities.VolumenApuestas;
import com.example.cc.service.apuestas.CuotasDinamicasService;
import com.example.cc.service.apuestas.CuotaEventoService;
import com.example.cc.repository.CuotaHistorialRepository;
import com.example.cc.repository.VolumenApuestasRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cc/cuotas-dinamicas")
@RequiredArgsConstructor
@Slf4j
public class CuotasDinamicasController {

    private final CuotasDinamicasService cuotasDinamicasService;
    private final CuotaEventoService cuotaEventoService;
    private final CuotaHistorialRepository cuotaHistorialRepository;
    private final VolumenApuestasRepository volumenApuestasRepository;

    /**
     * Obtener cuotas actuales para un evento
     */
    @GetMapping("/evento/{eventoId}/cuotas")
    public ResponseEntity<List<CuotaEvento>> getCuotasEvento(@PathVariable Long eventoId) {
        try {
            List<CuotaEvento> cuotas = cuotaEventoService.getCuotasByEventoId(eventoId);
            return ResponseEntity.ok(cuotas);
        } catch (Exception e) {
            log.error("Error obteniendo cuotas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener historial de cambios de cuotas para un evento
     */
    @GetMapping("/evento/{eventoId}/historial")
    public ResponseEntity<List<CuotaHistorial>> getHistorialCuotas(@PathVariable Long eventoId) {
        try {
            List<CuotaHistorial> historial = cuotaHistorialRepository
                .findByEventoDeportivoIdOrderByFechaCambioDesc(eventoId);
            return ResponseEntity.ok(historial);
        } catch (Exception e) {
            log.error("Error obteniendo historial para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener volumen de apuestas para un evento
     */
    @GetMapping("/evento/{eventoId}/volumen")
    public ResponseEntity<List<VolumenApuestas>> getVolumenApuestas(@PathVariable Long eventoId) {
        try {
            List<VolumenApuestas> volumen = volumenApuestasRepository.findByEventoDeportivoId(eventoId);
            return ResponseEntity.ok(volumen);
        } catch (Exception e) {
            log.error("Error obteniendo volumen para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener tendencia de una cuota específica
     */
    @GetMapping("/evento/{eventoId}/tendencia/{tipoResultado}")
    public ResponseEntity<String> getTendenciaCuota(
            @PathVariable Long eventoId,
            @PathVariable TipoResultado tipoResultado) {
        try {
            String tendencia = cuotasDinamicasService.obtenerTendenciaCuota(eventoId, tipoResultado);
            return ResponseEntity.ok(tendencia);
        } catch (Exception e) {
            log.error("Error obteniendo tendencia para evento {} tipo {}: {}", 
                     eventoId, tipoResultado, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Forzar actualización manual de cuotas (solo para admin)
     */
    @PostMapping("/evento/{eventoId}/actualizar")
    public ResponseEntity<String> actualizarCuotasManual(@PathVariable Long eventoId) {
        try {
            cuotasDinamicasService.actualizarCuotasPorVolumen(eventoId);
            
            // TODO: Notificar via WebSocket cuando se implemente
            log.info("Cuotas actualizadas manualmente para evento: {}", eventoId);
                
            return ResponseEntity.ok("Cuotas actualizadas exitosamente");
        } catch (Exception e) {
            log.error("Error actualizando cuotas manualmente para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().body("Error actualizando cuotas");
        }
    }

    /**
     * Registrar nueva apuesta y actualizar volumen
     */
    @PostMapping("/apuesta/registrar")
    public ResponseEntity<String> registrarApuesta(
            @RequestBody RegistrarApuestaRequest request) {
        try {
            // Actualizar volumen y disparar recálculo de cuotas
            cuotasDinamicasService.actualizarVolumenApuesta(
                request.getEventoId(), 
                request.getTipoResultado(), 
                request.getMontoApuesta()
            );
            
            // Notificar cambios (sin WebSocket por ahora)
            log.info("Apuesta registrada para evento: {}, tipo: {}, monto: {}", 
                    request.getEventoId(), request.getTipoResultado(), request.getMontoApuesta());
            
            return ResponseEntity.ok("Apuesta registrada y cuotas actualizadas");
        } catch (Exception e) {
            log.error("Error registrando apuesta: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error registrando apuesta");
        }
    }

    /**
     * Obtener estadísticas de cambios para un evento
     */
    @GetMapping("/evento/{eventoId}/estadisticas")
    public ResponseEntity<Map<String, Object>> getEstadisticasEvento(@PathVariable Long eventoId) {
        try {
            Object[] stats = cuotaHistorialRepository.getEstadisticasCambiosPorEvento(eventoId);
            
            if (stats != null && stats.length >= 4) {
                Map<String, Object> estadisticas = Map.of(
                    "eventoId", stats[0],
                    "totalCambios", stats[1],
                    "promedioCambioPorcentual", stats[2],
                    "maximoCambioPorcentual", stats[3]
                );
                return ResponseEntity.ok(estadisticas);
            }
            
            return ResponseEntity.ok(Map.of("mensaje", "Sin estadísticas disponibles"));
        } catch (Exception e) {
            log.error("Error obteniendo estadísticas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener eventos con mayor actividad de cuotas
     */
    @GetMapping("/eventos/mayor-actividad")
    public ResponseEntity<List<Object[]>> getEventosMayorActividad() {
        try {
            List<Object[]> eventos = volumenApuestasRepository.getEventosConMayorVolumen();
            return ResponseEntity.ok(eventos);
        } catch (Exception e) {
            log.error("Error obteniendo eventos con mayor actividad: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener distribución de apuestas para un evento
     */
    @GetMapping("/evento/{eventoId}/distribucion")
    public ResponseEntity<List<Object[]>> getDistribucionApuestas(@PathVariable Long eventoId) {
        try {
            List<Object[]> distribucion = volumenApuestasRepository
                .getDistribucionApuestasPorEvento(eventoId);
            return ResponseEntity.ok(distribucion);
        } catch (Exception e) {
            log.error("Error obteniendo distribución para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }



    /**
     * DTO para registrar apuesta
     */
    public static class RegistrarApuestaRequest {
        private Long eventoId;
        private TipoResultado tipoResultado;
        private BigDecimal montoApuesta;

        // Getters y setters
        public Long getEventoId() { return eventoId; }
        public void setEventoId(Long eventoId) { this.eventoId = eventoId; }

        public TipoResultado getTipoResultado() { return tipoResultado; }
        public void setTipoResultado(TipoResultado tipoResultado) { this.tipoResultado = tipoResultado; }

        public BigDecimal getMontoApuesta() { return montoApuesta; }
        public void setMontoApuesta(BigDecimal montoApuesta) { this.montoApuesta = montoApuesta; }
    }
}
