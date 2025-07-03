package com.example.cc.controller;

import com.example.cc.entities.CuotaEvento;
import com.example.cc.service.apuestas.CuotaEventoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cc/cuotas-evento")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CuotaEventoController {

    private final CuotaEventoService cuotaEventoService;

    /**
     * Obtener cuotas para un evento específico
     */
    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<CuotaEvento>> getCuotasByEventoId(@PathVariable Long eventoId) {
        try {
            List<CuotaEvento> cuotas = cuotaEventoService.getCuotasByEventoId(eventoId);
            return ResponseEntity.ok(cuotas);
        } catch (Exception e) {
            log.error("Error al obtener cuotas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generar cuotas para un evento
     * (Acceso solo para administradores)
     */
    @PostMapping("/generar/{eventoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CuotaEvento>> generarCuotasParaEvento(@PathVariable Long eventoId) {
        try {
            List<CuotaEvento> cuotas = cuotaEventoService.generarCuotasParaEvento(eventoId);
            return ResponseEntity.ok(cuotas);
        } catch (Exception e) {
            log.error("Error al generar cuotas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Actualizar cuotas de un evento
     * (Acceso solo para administradores)
     */
    @PutMapping("/actualizar/{eventoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> actualizarCuotas(
            @PathVariable Long eventoId,
            @RequestBody Map<String, BigDecimal> cuotas) {
        
        try {
            BigDecimal cuotaLocal = cuotas.get("local");
            BigDecimal cuotaVisitante = cuotas.get("visitante");
            BigDecimal cuotaEmpate = cuotas.get("empate");
            
            if (cuotaLocal == null || cuotaVisitante == null || cuotaEmpate == null) {
                return ResponseEntity.badRequest().body("Se requieren cuotas para local, visitante y empate");
            }
            
            cuotaEventoService.actualizarCuotas(eventoId, cuotaLocal, cuotaVisitante, cuotaEmpate);
            return ResponseEntity.ok("Cuotas actualizadas correctamente");
            
        } catch (Exception e) {
            log.error("Error al actualizar cuotas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Cerrar cuotas para un evento
     * (Acceso solo para administradores)
     */
    @PutMapping("/cerrar/{eventoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> cerrarCuotasEvento(@PathVariable Long eventoId) {
        try {
            cuotaEventoService.cerrarCuotasEvento(eventoId);
            return ResponseEntity.ok("Cuotas cerradas correctamente");
        } catch (Exception e) {
            log.error("Error al cerrar cuotas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
