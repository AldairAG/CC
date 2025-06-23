package com.example.cc.controller;

import com.example.cc.dto.request.CrearApuestaRequest;
import com.example.cc.dto.response.ApuestaResponse;
import com.example.cc.dto.response.CuotaEventoResponse;
import com.example.cc.dto.response.EstadisticasApuestaResponse;
import com.example.cc.dto.response.CuotaEventoResponse;
import com.example.cc.entities.enums.EstadoApuesta;
import com.example.cc.entities.enums.TipoApuesta;
import com.example.cc.service.apuesta.ApuestaService;
import com.example.cc.service.usuario.IUsuarioService;
import com.example.cc.entities.Usuario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/cc/apuestas")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Apuestas", description = "API para gestión de apuestas deportivas")
public class ApuestaController {

    private final ApuestaService apuestaService;
    private final IUsuarioService usuarioService;

    /**
     * Obtiene el ID del usuario a partir del Principal (email)
     */
    private Long obtenerIdUsuario(Principal principal) {
        if (principal == null) {
            throw new IllegalArgumentException("Usuario no autenticado");
        }
        
        String email = principal.getName();
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email de usuario inválido");
        }
          return usuarioService.findByEmail(email)
                .map(Usuario::getIdUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + email));
    }

    @Operation(summary = "Crear una nueva apuesta")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Apuesta creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "409", description = "Conflicto - apuesta duplicada o saldo insuficiente"),
            @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")    public ResponseEntity<?> crearApuesta(
            @Valid @RequestBody CrearApuestaRequest request) {
        try {
            log.info("Procesando solicitud de apuesta: {}", request.getCuotaApuesta());

            ApuestaResponse apuesta = apuestaService.crearApuesta(request, request.getIdUsuario());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(apuesta);
            
        } catch (RuntimeException e) {
            log.error("Error al crear apuesta: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error interno al crear apuesta", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Obtener apuestas del usuario autenticado")
    @GetMapping("/mis-apuestas")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")    public ResponseEntity<?> obtenerMisApuestas(Principal principal) {
        try {
            Long idUsuario = obtenerIdUsuario(principal);
            List<ApuestaResponse> apuestas = apuestaService.obtenerApuestasPorUsuario(idUsuario);
            return ResponseEntity.ok(apuestas);
        } catch (Exception e) {
            log.error("Error al obtener apuestas del usuario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Obtener apuestas del usuario con paginación")
    @GetMapping("/mis-apuestas/paginado")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> obtenerMisApuestasPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
          try {
            Long idUsuario = obtenerIdUsuario(principal);
            Pageable pageable = PageRequest.of(page, size);
            Page<ApuestaResponse> apuestas = apuestaService.obtenerApuestasPorUsuarioPaginado(idUsuario, pageable);
            return ResponseEntity.ok(apuestas);
        } catch (Exception e) {
            log.error("Error al obtener apuestas paginadas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Obtener una apuesta específica por ID")
    @GetMapping("/{idApuesta}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> obtenerApuestaPorId(
            @PathVariable Long idApuesta,
            Principal principal) {
          try {
            Long idUsuario = obtenerIdUsuario(principal);
            Optional<ApuestaResponse> apuesta = apuestaService.obtenerApuestaPorId(idApuesta, idUsuario);
            
            if (apuesta.isPresent()) {
                return ResponseEntity.ok(apuesta.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error al obtener apuesta por ID", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Cancelar una apuesta pendiente")
    @PutMapping("/{idApuesta}/cancelar")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> cancelarApuesta(
            @PathVariable Long idApuesta,
            @RequestParam(required = false, defaultValue = "Cancelada por el usuario") String motivo,
            Principal principal) {
          try {
            Long idUsuario = obtenerIdUsuario(principal);
            boolean cancelada = apuestaService.cancelarApuesta(idApuesta, idUsuario, motivo);
            
            if (cancelada) {
                return ResponseEntity.ok(Map.of("mensaje", "Apuesta cancelada exitosamente"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "No se pudo cancelar la apuesta"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al cancelar apuesta", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Obtener estadísticas de apuestas del usuario")
    @GetMapping("/estadisticas")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")    public ResponseEntity<?> obtenerEstadisticas(Principal principal) {
        try {
            Long idUsuario = obtenerIdUsuario(principal);
            EstadisticasApuestaResponse estadisticas = apuestaService.obtenerEstadisticasUsuario(idUsuario);
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            log.error("Error al obtener estadísticas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Calcular ganancia potencial")
    @GetMapping("/calcular-ganancia")
    public ResponseEntity<?> calcularGanancia(
            @RequestParam BigDecimal monto,
            @RequestParam BigDecimal cuota) {
        
        try {
            BigDecimal ganancia = apuestaService.calcularGananciaPotencial(monto, cuota);
            return ResponseEntity.ok(Map.of(
                    "monto", monto,
                    "cuota", cuota,
                    "gananciaPotencial", ganancia
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Parámetros inválidos"));
        }
    }

    // Endpoints para administradores

    @Operation(summary = "Resolver apuesta como ganada (Solo administradores)")
    @PutMapping("/admin/{idApuesta}/ganar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resolverComoGanada(@PathVariable Long idApuesta) {
        try {
            ApuestaResponse apuesta = apuestaService.resolverApuestaComoGanada(idApuesta);
            return ResponseEntity.ok(apuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al resolver apuesta como ganada", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Resolver apuesta como perdida (Solo administradores)")
    @PutMapping("/admin/{idApuesta}/perder")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resolverComoPerdida(@PathVariable Long idApuesta) {
        try {
            ApuestaResponse apuesta = apuestaService.resolverApuestaComoPerdida(idApuesta);
            return ResponseEntity.ok(apuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al resolver apuesta como perdida", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Reembolsar apuesta (Solo administradores)")
    @PutMapping("/admin/{idApuesta}/reembolsar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reembolsarApuesta(
            @PathVariable Long idApuesta,
            @RequestParam String motivo) {
        
        try {
            ApuestaResponse apuesta = apuestaService.reembolsarApuesta(idApuesta, motivo);
            return ResponseEntity.ok(apuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al reembolsar apuesta", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Obtener apuestas por evento (Solo administradores)")
    @GetMapping("/admin/evento/{idEvento}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtenerApuestasPorEvento(@PathVariable Long idEvento) {
        try {
            List<ApuestaResponse> apuestas = apuestaService.obtenerApuestasPorEvento(idEvento);
            return ResponseEntity.ok(apuestas);
        } catch (Exception e) {
            log.error("Error al obtener apuestas por evento", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Obtener apuestas por estado (Solo administradores)")
    @GetMapping("/admin/estado/{estado}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtenerApuestasPorEstado(@PathVariable EstadoApuesta estado) {
        try {
            List<ApuestaResponse> apuestas = apuestaService.obtenerApuestasPorEstado(estado);
            return ResponseEntity.ok(apuestas);
        } catch (Exception e) {
            log.error("Error al obtener apuestas por estado", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Obtener top ganancias (Solo administradores)")
    @GetMapping("/admin/top-ganancias")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtenerTopGanancias(
            @RequestParam(defaultValue = "10") int limite) {
        
        try {
            List<ApuestaResponse> topGanancias = apuestaService.obtenerTopGanancias(limite);
            return ResponseEntity.ok(topGanancias);
        } catch (Exception e) {
            log.error("Error al obtener top ganancias", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Procesar apuestas pendientes (Solo administradores)")
    @PostMapping("/admin/procesar-pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> procesarApuestasPendientes() {
        try {
            apuestaService.procesarApuestasPendientes();
            return ResponseEntity.ok(Map.of("mensaje", "Apuestas pendientes procesadas"));
        } catch (Exception e) {
            log.error("Error al procesar apuestas pendientes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    // Endpoints de validación

    @Operation(summary = "Validar si el usuario puede realizar una apuesta")
    @GetMapping("/validar")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> validarApuesta(
            @RequestParam Long idEvento,
            @RequestParam BigDecimal monto,
            @RequestParam TipoApuesta tipoApuesta,
            Principal principal) {
          try {
            Long idUsuario = obtenerIdUsuario(principal);
            
            boolean saldoSuficiente = apuestaService.validarSaldoSuficiente(idUsuario, monto);
            boolean dentroLimite = apuestaService.validarLimiteApuesta(idUsuario, monto);
            boolean eventoAbierto = apuestaService.validarEventoAbierto(idEvento);
            boolean noEsDuplicada = apuestaService.validarApuestaDuplicada(idUsuario, idEvento, tipoApuesta);
            
            boolean puedeApostar = saldoSuficiente && dentroLimite && eventoAbierto && noEsDuplicada;
            
            return ResponseEntity.ok(Map.of(
                    "puedeApostar", puedeApostar,
                    "saldoSuficiente", saldoSuficiente,
                    "dentroLimite", dentroLimite,
                    "eventoAbierto", eventoAbierto,
                    "noEsDuplicada", noEsDuplicada
            ));
            
        } catch (Exception e) {
            log.error("Error al validar apuesta", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @Operation(summary = "Obtener cuotas disponibles para un evento")
    @GetMapping("/evento/{idEvento}/cuotas")
    public ResponseEntity<?> obtenerCuotasEvento(@PathVariable Long idEvento) {
        try {
            // Por ahora devolvemos cuotas ficticias
            // En un sistema real, estas cuotas vendrían de un proveedor de datos deportivos
            List<CuotaEventoResponse> cuotas = List.of(
                CuotaEventoResponse.builder()
                    .idEvento(idEvento)
                    .tipoApuesta(TipoApuesta.GANADOR_PARTIDO)
                    .descripcionApuesta("Ganador del Partido")
                    .cuota(new BigDecimal("2.50"))
                    .activa(true)
                    .limiteMaximo(new BigDecimal("5000.00"))
                    .detalle("Equipo Local")
                    .build(),
                CuotaEventoResponse.builder()
                    .idEvento(idEvento)
                    .tipoApuesta(TipoApuesta.GANADOR_PARTIDO)
                    .descripcionApuesta("Ganador del Partido")
                    .cuota(new BigDecimal("1.85"))
                    .activa(true)
                    .limiteMaximo(new BigDecimal("5000.00"))
                    .detalle("Equipo Visitante")
                    .build(),
                CuotaEventoResponse.builder()
                    .idEvento(idEvento)
                    .tipoApuesta(TipoApuesta.TOTAL_GOLES)
                    .descripcionApuesta("Total de Goles")
                    .cuota(new BigDecimal("1.90"))
                    .activa(true)
                    .limiteMaximo(new BigDecimal("3000.00"))
                    .detalle("Más de 2.5 goles")
                    .build(),
                CuotaEventoResponse.builder()
                    .idEvento(idEvento)
                    .tipoApuesta(TipoApuesta.TOTAL_GOLES)
                    .descripcionApuesta("Total de Goles")
                    .cuota(new BigDecimal("1.95"))
                    .activa(true)
                    .limiteMaximo(new BigDecimal("3000.00"))
                    .detalle("Menos de 2.5 goles")
                    .build()
            );
            
            return ResponseEntity.ok(cuotas);
        } catch (Exception e) {
            log.error("Error al obtener cuotas del evento", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }
}
