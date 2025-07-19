package com.example.cc.controller;

import com.example.cc.dto.apuesta.ApuestaMapper;
import com.example.cc.dto.apuesta.ApuestaResponseDTO;
import com.example.cc.dto.apuesta.CrearApuestaRequestDTO;
import com.example.cc.entities.Apuesta;
import com.example.cc.entities.EventoDeportivo;
import com.example.cc.service.apuestas.ApuestaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cc/apuestas")
@RequiredArgsConstructor
@Slf4j
@Validated
public class ApuestaController {

    private final ApuestaService apuestaService;
    private final ApuestaMapper apuestaMapper;

    /**
     * Obtener eventos con más apuestas
     */
    @GetMapping("/eventos-con-mas-apuestas")    
    public ResponseEntity<List<EventoDeportivo>> obtenerEventosConMasApuestas(
            @RequestParam(defaultValue = "5") int limite) {
        try {
            var eventos = apuestaService.obtenerEventosConMasApuestas(limite);
            return ResponseEntity.ok(eventos);
        } catch (Exception e) {
            log.error("Error al obtener eventos con más apuestas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Alias para eventos con más apuestas (para compatibilidad con frontend)
     */
    @GetMapping("/eventos-mas-apuestas")    
    public ResponseEntity<List<EventoDeportivo>> obtenerEventosConMasApuestasAlias(
            @RequestParam(defaultValue = "5") int limite) {
        return obtenerEventosConMasApuestas(limite);
    }

    /**
     * Obtener apuestas activas del usuario
     */
    @GetMapping("/activas")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> getApuestasActivas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Apuesta> apuestas = apuestaService.getApuestasActivas(usuarioId, pageable);
            
            com.example.cc.dto.apuesta.ApuestasPageResponseDTO response = apuestaService.convertirAPageResponseDTO(apuestas);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al obtener apuestas activas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener historial de apuestas del usuario
     */
    @GetMapping("/historial")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> getHistorialApuestas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Apuesta> apuestas = apuestaService.getHistorialApuestas(usuarioId, pageable);
            
            com.example.cc.dto.apuesta.ApuestasPageResponseDTO response = apuestaService.convertirAPageResponseDTO(apuestas);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al obtener historial de apuestas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener apuestas recientes del usuario
     */
    @GetMapping("/recientes")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> getApuestasRecientes(
            @RequestParam(defaultValue = "5") int limite) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            List<com.example.cc.dto.apuesta.ResumenApuestaDTO> apuestas = apuestaService.getApuestasRecientesDTO(usuarioId, limite);
            
            return ResponseEntity.ok(apuestas);
        } catch (Exception e) {
            log.error("Error al obtener apuestas recientes: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener apuestas por estado
     */
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> getApuestasPorEstado(
            @PathVariable String estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Apuesta> apuestas = apuestaService.getApuestasPorEstado(usuarioId, estado, pageable);
            
            com.example.cc.dto.apuesta.ApuestasPageResponseDTO response = apuestaService.convertirAPageResponseDTO(apuestas);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al obtener apuestas por estado: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener apuestas por evento
     */
    @GetMapping("/evento/{eventoId}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> getApuestasPorEvento(
            @PathVariable Long eventoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Apuesta> apuestas = apuestaService.getApuestasPorEvento(usuarioId, eventoId, pageable);
            
            com.example.cc.dto.apuesta.ApuestasPageResponseDTO response = apuestaService.convertirAPageResponseDTO(apuestas);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al obtener apuestas por evento: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Verificar si una apuesta es válida
     */
    @GetMapping("/verificar")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> verificarApuesta(
            @RequestParam Long eventoId,
            @RequestParam Long cuotaId,
            @RequestParam BigDecimal monto) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            boolean valida = apuestaService.verificarApuestaValida(usuarioId, eventoId, cuotaId, monto);
            
            return ResponseEntity.ok(Map.of("valida", valida));
        } catch (Exception e) {
            log.error("Error al verificar apuesta: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("valida", false));
        }
    }

    /**
     * Obtener límites de apuesta del usuario
     */
    @GetMapping("/limites")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> getLimitesApuesta() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            var limites = apuestaService.getLimitesApuesta(usuarioId);
            
            return ResponseEntity.ok(limites);
        } catch (Exception e) {
            log.error("Error al obtener límites de apuesta: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Buscar apuestas
     */
    @GetMapping("/buscar")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> buscarApuestas(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Apuesta> apuestas = apuestaService.buscarApuestas(usuarioId, q, pageable);
            
            com.example.cc.dto.apuesta.ApuestasPageResponseDTO response = apuestaService.convertirAPageResponseDTO(apuestas);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al buscar apuestas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener apuestas filtradas del usuario
     */
    @GetMapping("/mis-apuestas/filtradas")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> getApuestasFiltradas(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String tipoApuesta,
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin,
            @RequestParam(required = false) BigDecimal montoMin,
            @RequestParam(required = false) BigDecimal montoMax,
            @RequestParam(required = false) Long eventoId,
            @RequestParam(required = false) String busqueda,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName());
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Apuesta> apuestas = apuestaService.getApuestasFiltradas(
                usuarioId, estado, tipoApuesta, fechaInicio, fechaFin, 
                montoMin, montoMax, eventoId, busqueda, pageable);
            
            com.example.cc.dto.apuesta.ApuestasPageResponseDTO response = apuestaService.convertirAPageResponseDTO(apuestas);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al obtener apuestas filtradas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Crear una nueva apuesta
     */
    //@PreAuthorize("hasRole('CLIENTE')")
    @PostMapping("/{usuarioId}")
    public ResponseEntity<?> crearApuesta(@Valid @RequestBody CrearApuestaRequestDTO request,
        @PathVariable Long usuarioId) {
        try {
            // Obtener el ID del usuario autenticado
            /*Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = Long.parseLong(auth.getName()); */
            
            // Validar que el monto sea válido (ya se valida con las anotaciones, pero agregamos verificación extra)
            if (!request.isMontoValido()) {
                return ResponseEntity.badRequest()
                    .body("El monto de apuesta debe estar entre $10.00 y $10,000.00");
            }
            
            // Crear la apuesta usando el DTO
            Apuesta nuevaApuesta = apuestaService.crearApuesta(
                usuarioId, 
                request.getEventoId(), 
                request.getCuotaId(), 
                request.getMontoApostadoEscalado()
            );
            
            // Convertir a DTO de respuesta
            ApuestaResponseDTO response = apuestaMapper.toResponseDTO(nuevaApuesta);
            
            log.info("Apuesta creada exitosamente con ID: {}", nuevaApuesta.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error al crear apuesta para usuario {}: {}", 
                SecurityContextHolder.getContext().getAuthentication().getName(), 
                e.getMessage(), e);
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
            
            com.example.cc.dto.apuesta.ApuestasPageResponseDTO response = apuestaService.convertirAPageResponseDTO(apuestas);
            
            return ResponseEntity.ok(response);
            
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

    /**
     * Endpoint para obtener estadísticas de apuestas de un usuario
     */
    @GetMapping("/estadisticas/{usuarioId}")
    public ResponseEntity<com.example.cc.dto.apuestas.EstadisticasApuestaDTO> getEstadisticasApuestasUsuario(@PathVariable Long usuarioId) {
        try {
            com.example.cc.dto.apuestas.EstadisticasApuestaDTO estadisticas = apuestaService.obtenerEstadisticasApuestasUsuario(usuarioId);
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            log.error("Error obteniendo estadísticas de apuestas", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Alias para estadísticas (mantener compatibilidad)
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<com.example.cc.dto.apuestas.EstadisticasApuestaDTO> getEstadisticasApuestasUsuarioQuery(@RequestParam Long usuarioId) {
        return getEstadisticasApuestasUsuario(usuarioId);
    }
}
