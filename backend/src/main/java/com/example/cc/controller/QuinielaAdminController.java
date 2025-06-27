package com.example.cc.controller;

import com.example.cc.entities.Quiniela;
import com.example.cc.entities.QuinielaParticipacion;
import com.example.cc.service.quinielaAdmin.QuinielaAdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/quinielas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuinielaAdminController {

    private final QuinielaAdminService quinielaAdminService;

    /**
     * Obtener todas las quinielas para administración
     */
    @GetMapping
    public ResponseEntity<Page<Quiniela>> obtenerTodasLasQuinielas(Pageable pageable) {
        Page<Quiniela> quinielas = quinielaAdminService.obtenerTodasLasQuinielas(pageable);
        return ResponseEntity.ok(quinielas);
    }

    /**
     * Obtener estadísticas generales
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasGenerales() {
        Map<String, Object> estadisticas = quinielaAdminService.obtenerEstadisticasGenerales();
        return ResponseEntity.ok(estadisticas);
    }

    /**
     * Cancelar una quiniela
     */
    @PostMapping("/{quinielaId}/cancelar")
    public ResponseEntity<Void> cancelarQuiniela(@PathVariable Long quinielaId,
                                               @RequestParam String motivo) {
        try {
            quinielaAdminService.cancelarQuiniela(quinielaId, motivo);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Forzar procesamiento de resultados
     */
    @PostMapping("/{quinielaId}/forzar-resultados")
    public ResponseEntity<Void> forzarProcesamientoResultados(@PathVariable Long quinielaId) {
        try {
            quinielaAdminService.forzarProcesamientoResultados(quinielaId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Modificar configuración de una quiniela
     */
    @PutMapping("/{quinielaId}/configuracion")
    public ResponseEntity<Quiniela> modificarConfiguracion(@PathVariable Long quinielaId,
                                                          @RequestBody Map<String, Object> cambios) {
        try {
            Quiniela quiniela = quinielaAdminService.modificarConfiguracion(quinielaId, cambios);
            return ResponseEntity.ok(quiniela);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener participaciones de una quiniela
     */
    @GetMapping("/{quinielaId}/participaciones")
    public ResponseEntity<List<QuinielaParticipacion>> obtenerParticipaciones(@PathVariable Long quinielaId) {
        try {
            List<QuinielaParticipacion> participaciones = quinielaAdminService.obtenerParticipaciones(quinielaId);
            return ResponseEntity.ok(participaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Generar reporte de una quiniela
     */
    @GetMapping("/{quinielaId}/reporte")
    public ResponseEntity<Map<String, Object>> generarReporte(@PathVariable Long quinielaId) {
        try {
            Map<String, Object> reporte = quinielaAdminService.generarReporte(quinielaId);
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
