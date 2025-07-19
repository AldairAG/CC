package com.example.cc.controller;

import com.example.cc.dto.request.ActualizarPerfilRequest;
import com.example.cc.dto.request.CambiarPasswordRequest;
import com.example.cc.dto.request.CrearTicketSoporteRequest;
import com.example.cc.dto.request.GameHistory;
import com.example.cc.dto.response.*;
import com.example.cc.entities.DocumentoIdentidad;
import com.example.cc.service.perfil.IPerfilUsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cc/perfil")
public class PerfilController {

    @Autowired
    private IPerfilUsuarioService perfilService;

    // ========== GESTIÓN DE PERFIL ==========

    /**
     * Obtener información del perfil de usuario
     */
    @GetMapping("/{idUsuario}")
    public ResponseEntity<?> obtenerPerfil(@PathVariable Long idUsuario) {
        try {
            PerfilUsuarioResponse perfil = perfilService.obtenerPerfilUsuario(idUsuario);
            return ResponseEntity.ok(perfil);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Actualizar información del perfil de usuario
     */
    @PutMapping("/{idUsuario}")
    public ResponseEntity<?> actualizarPerfil(
            @PathVariable Long idUsuario,
            @Valid @RequestBody ActualizarPerfilRequest request) {
        try {
            perfilService.actualizarPerfil(idUsuario, request);
            return ResponseEntity.ok(Map.of("mensaje", "Perfil actualizado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cambiar contraseña del usuario
     */
    @PutMapping("/{idUsuario}/password")
    public ResponseEntity<?> cambiarPassword(
            @PathVariable Long idUsuario,
            @Valid @RequestBody CambiarPasswordRequest request) {
        try {
            perfilService.cambiarPassword(idUsuario, request);
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña cambiada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== GESTIÓN DE DOCUMENTOS ==========

    /**
     * Subir documento de identidad
     */
    @PostMapping(value = "/{idUsuario}/documentos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirDocumento(
            @PathVariable Long idUsuario,
            @RequestParam("tipo") DocumentoIdentidad.TipoDocumento tipo,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            DocumentoIdentidadResponse documento = perfilService.subirDocumento(idUsuario, tipo, archivo);
            return ResponseEntity.ok(documento);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Obtener todos los documentos del usuario
     */
    @GetMapping("/{idUsuario}/documentos")
    public ResponseEntity<List<DocumentoIdentidadResponse>> obtenerDocumentos(
            @PathVariable Long idUsuario) {
        List<DocumentoIdentidadResponse> documentos = perfilService.obtenerDocumentos(idUsuario);
        return ResponseEntity.ok(documentos);
    }

    /**
     * Eliminar documento
     */
    @DeleteMapping("/{idUsuario}/documentos/{idDocumento}")
    public ResponseEntity<?> eliminarDocumento(
            @PathVariable Long idUsuario,
            @PathVariable Long idDocumento) {
        try {
            perfilService.eliminarDocumento(idUsuario, idDocumento);
            return ResponseEntity.ok(Map.of("mensaje", "Documento eliminado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== HISTORIAL DE TRANSACCIONES ==========

    /**
     * Obtener historial completo de transacciones
     */
    @GetMapping("/{idUsuario}/transacciones")
    public ResponseEntity<List<TransaccionResponse>> obtenerHistorialTransacciones(
            @PathVariable Long idUsuario) {
        List<TransaccionResponse> transacciones = perfilService.obtenerHistorialTransacciones(idUsuario);
        return ResponseEntity.ok(transacciones);
    }

    /**
     * Obtener historial paginado de transacciones
     */
    @GetMapping("/{idUsuario}/transacciones/paginado")
    public ResponseEntity<Page<TransaccionResponse>> obtenerHistorialTransaccionesPaginado(
            @PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fechaCreacion") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TransaccionResponse> transacciones = perfilService.obtenerHistorialTransaccionesPaginado(idUsuario,
                pageable);
        return ResponseEntity.ok(transacciones);
    }

    /**
     * Obtener solo depósitos
     */
    @GetMapping("/{idUsuario}/depositos")
    public ResponseEntity<List<TransaccionResponse>> obtenerDepositos(
            @PathVariable Long idUsuario) {
        List<TransaccionResponse> depositos = perfilService.obtenerDepositos(idUsuario);
        return ResponseEntity.ok(depositos);
    }

    /**
     * Obtener solo retiros
     */
    @GetMapping("/{idUsuario}/retiros")
    public ResponseEntity<List<TransaccionResponse>> obtenerRetiros(
            @PathVariable Long idUsuario) {
        List<TransaccionResponse> retiros = perfilService.obtenerRetiros(idUsuario);
        return ResponseEntity.ok(retiros);
    }

    // ========== SOPORTE TÉCNICO ==========

    /**
     * Crear ticket de soporte
     */
    @PostMapping("/{idUsuario}/soporte/tickets")
    public ResponseEntity<?> crearTicketSoporte(
            @PathVariable Long idUsuario,
            @Valid @RequestBody CrearTicketSoporteRequest request) {
        try {
            TicketSoporteResponse ticket = perfilService.crearTicketSoporte(idUsuario, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Obtener todos los tickets del usuario
     */
    @GetMapping("/{idUsuario}/soporte/tickets")
    public ResponseEntity<List<TicketSoporteResponse>> obtenerMisTickets(
            @PathVariable Long idUsuario) {
        List<TicketSoporteResponse> tickets = perfilService.obtenerMisTickets(idUsuario);
        return ResponseEntity.ok(tickets);
    }

    /**
     * Obtener un ticket específico
     */
    @GetMapping("/{idUsuario}/soporte/tickets/{idTicket}")
    public ResponseEntity<TicketSoporteResponse> obtenerTicketPorId(
            @PathVariable Long idUsuario,
            @PathVariable Long idTicket) {
        return perfilService.obtenerTicketPorId(idUsuario, idTicket)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ========== AUTENTICACIÓN 2FA ==========

    /**
     * Obtener configuración actual de 2FA
     */
    @GetMapping("/{idUsuario}/2fa")
    public ResponseEntity<Autenticacion2FAResponse> obtenerConfiguracion2FA(
            @PathVariable Long idUsuario) {
        Autenticacion2FAResponse config = perfilService.obtenerConfiguracion2FA(idUsuario);
        return ResponseEntity.ok(config);
    }

    /**
     * Habilitar autenticación 2FA
     */
    @PostMapping("/{idUsuario}/2fa/habilitar")
    public ResponseEntity<Autenticacion2FAResponse> habilitarAutenticacion2FA(
            @PathVariable Long idUsuario) {
        try {
            Autenticacion2FAResponse config = perfilService.habilitarAutenticacion2FA(idUsuario);
            return ResponseEntity.ok(config);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Deshabilitar autenticación 2FA
     */
    @PostMapping("/{idUsuario}/2fa/deshabilitar")
    public ResponseEntity<?> deshabilitarAutenticacion2FA(
            @PathVariable Long idUsuario) {
        try {
            perfilService.deshabilitarAutenticacion2FA(idUsuario);
            return ResponseEntity.ok(Map.of("mensaje", "2FA deshabilitado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Verificar código 2FA
     */
    @PostMapping("/{idUsuario}/2fa/verificar")
    public ResponseEntity<?> verificarCodigo2FA(
            @PathVariable Long idUsuario,
            @RequestBody Map<String, String> request) {
        try {
            String codigo = request.get("codigo");
            if (codigo == null || codigo.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Código requerido"));
            }

            boolean valido = perfilService.verificarCodigo2FA(idUsuario, codigo);
            if (valido) {
                return ResponseEntity.ok(Map.of("valido", true, "mensaje", "Código válido"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("valido", false, "error", "Código inválido"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("valido", false, "error", e.getMessage()));
        }
    }

    /**
     * Generar códigos de backup para 2FA
     */
    @PostMapping("/{idUsuario}/2fa/codigos-backup")
    public ResponseEntity<?> generarCodigosBackup(
            @PathVariable Long idUsuario) {
        try {
            String codigos = perfilService.generarCodigosBackup(idUsuario);
            return ResponseEntity.ok(Map.of("codigos", codigos));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ========== ESTADÍSTICAS DEL USUARIO ==========

    /**
     * Obtener estadísticas completas del usuario
     */
    @GetMapping("/{idUsuario}/estadisticas")
    public ResponseEntity<EstadisticasUsuarioResponse> obtenerEstadisticasCompletas(
            @PathVariable Long idUsuario) {
        EstadisticasUsuarioResponse estadisticas = perfilService.obtenerEstadisticasCompletas(idUsuario);
        return ResponseEntity.ok(estadisticas);
    }

    /**
     * Obtener el historial de juego del usuario
     */
    @GetMapping("/{idUsuario}/gameHistory")
    public ResponseEntity<List<GameHistory>> obtenerEstadisticasCompletas(
            @PathVariable Long idUsuario,
            @RequestParam()@PageableDefault(size = 30, page = 0)  Pageable pageable) {
        List<GameHistory> historial = perfilService.obtenerHistorialDeJuegoByUserId(idUsuario,pageable);
        return ResponseEntity.ok(historial);
    }
}
