package com.example.cc.controller;

import com.example.cc.entities.Apuesta;
import com.example.cc.service.apuestas.ApuestaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cc/apuestas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ApuestaController {

    private final ApuestaService apuestaService;

    /**
     * Crear una nueva apuesta
     */
    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> crearApuesta(@RequestBody Map<String, Object> requestData) {
        try {
            // Obtener el ID del usuario autenticado
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            // Extraer datos de la solicitud
            Long eventoId = Long.parseLong(requestData.get("eventoId").toString());
            Long cuotaId = Long.parseLong(requestData.get("cuotaId").toString());
            BigDecimal montoApostado = new BigDecimal(requestData.get("montoApostado").toString());
            
            // Validar monto mínimo
            if (montoApostado.compareTo(new BigDecimal("10.00")) < 0) {
                return ResponseEntity.badRequest().body("El monto mínimo de apuesta es $10.00");
            }
            
            // Crear la apuesta
            Apuesta nuevaApuesta = apuestaService.crearApuesta(usuarioId, eventoId, cuotaId, montoApostado);
            return ResponseEntity.ok(nuevaApuesta);
            
        } catch (Exception e) {
            log.error("Error al crear apuesta: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Obtener apuestas del usuario actual
     */
    @GetMapping("/mis-apuestas")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> getMisApuestas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            // Obtener el ID del usuario autenticado
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            // Obtener apuestas con paginación
            Pageable pageable = PageRequest.of(page, size);
            Page<Apuesta> apuestas = apuestaService.getApuestasByUsuario(usuarioId, pageable);
            
            return ResponseEntity.ok(apuestas);
            
        } catch (Exception e) {
            log.error("Error al obtener apuestas del usuario: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener detalles de una apuesta específica
     */
    @GetMapping("/{apuestaId}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> getDetalleApuesta(@PathVariable Long apuestaId) {
        try {
            // Obtener el ID del usuario autenticado
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            // Obtener la apuesta
            return apuestaService.getApuestaById(apuestaId)
                    .map(apuesta -> {
                        // Verificar que la apuesta pertenece al usuario
                        if (!apuesta.getUsuario().getIdUsuario().equals(usuarioId)) {
                            return ResponseEntity.status(403).body("No tiene permiso para ver esta apuesta");
                        }
                        return ResponseEntity.ok(apuesta);
                    })
                    .orElse(ResponseEntity.notFound().build());
            
        } catch (Exception e) {
            log.error("Error al obtener detalle de apuesta {}: {}", apuestaId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Cancelar una apuesta
     */
    @PutMapping("/{apuestaId}/cancelar")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> cancelarApuesta(@PathVariable Long apuestaId) {
        try {
            // Obtener el ID del usuario autenticado
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            // Intentar cancelar la apuesta
            boolean resultado = apuestaService.cancelarApuesta(apuestaId, usuarioId);
            
            if (resultado) {
                return ResponseEntity.ok("Apuesta cancelada correctamente");
            } else {
                return ResponseEntity.badRequest().body("No se pudo cancelar la apuesta");
            }
            
        } catch (Exception e) {
            log.error("Error al cancelar apuesta {}: {}", apuestaId, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Procesar resultados de apuestas para un evento
     * (Acceso solo para administradores)
     */
    @PostMapping("/procesar-evento/{eventoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> procesarResultadosApuestas(@PathVariable Long eventoId) {
        try {
            apuestaService.procesarResultadosApuestas(eventoId);
            return ResponseEntity.ok("Resultados de apuestas procesados correctamente");
        } catch (Exception e) {
            log.error("Error al procesar resultados de apuestas para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
