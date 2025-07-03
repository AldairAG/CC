package com.example.cc.controller;

import com.example.cc.dto.CrearQuinielaRequest;
import com.example.cc.dto.PrediccionRequest;
import com.example.cc.dto.QuinielaResponseDto;
import com.example.cc.dto.RankingParticipacionDto;
import com.example.cc.entities.Quiniela;
import com.example.cc.entities.QuinielaParticipacion;
import com.example.cc.entities.QuinielaEvento;
import com.example.cc.service.quiniela.QuinielaService;
import com.example.cc.entities.PrediccionEvento;
import com.example.cc.repository.QuinielaParticipacionRepository;
import com.example.cc.mapper.QuinielaMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import java.util.Arrays;
import java.util.ArrayList;

@RestController
@RequestMapping("/cc/quinielas")
@RequiredArgsConstructor
public class QuinielaController {

    private final QuinielaService quinielaService;
    private final QuinielaParticipacionRepository participacionRepository;
    private final QuinielaMapper quinielaMapper;

    /**
     * Crear nueva quiniela
     */
    @PostMapping
    public ResponseEntity<QuinielaResponseDto> crearQuiniela(@RequestBody CrearQuinielaRequest request) {
        try {
            Quiniela quiniela = quinielaService.crearQuiniela(request);
            QuinielaResponseDto response = quinielaMapper.toResponseDto(quiniela);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Activar quiniela (DEPRECATED - las quinielas ahora se crean directamente activas)
     * Este endpoint se mantiene por compatibilidad con versiones anteriores
     */
    @Deprecated
    @PostMapping("/{quinielaId}/activar")
    public ResponseEntity<Quiniela> activarQuiniela(@PathVariable Long quinielaId, @RequestParam Long usuarioId) {
        try {
            Quiniela quiniela = quinielaService.activarQuiniela(quinielaId, usuarioId);
            return ResponseEntity.ok(quiniela);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener quinielas activas
     */
    @GetMapping("/activas")
    public ResponseEntity<Page<Quiniela>> obtenerQuinielasActivas(Pageable pageable) {
        Page<Quiniela> quinielas = quinielaService.obtenerQuinielasActivas(pageable);
        return ResponseEntity.ok(quinielas);
    }

    /**
     * Obtener quiniela por ID
     */
    @GetMapping("/{quinielaId}")
    public ResponseEntity<Quiniela> obtenerQuiniela(@PathVariable Long quinielaId) {
        try {
            Quiniela quiniela = quinielaService.obtenerQuinielaPorId(quinielaId);
            return ResponseEntity.ok(quiniela);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Participar en quiniela
     */
    @PostMapping("/{quinielaId}/participar")
    public ResponseEntity<QuinielaParticipacion> participarEnQuiniela(@PathVariable Long quinielaId,
            @RequestParam Long usuarioId) {
        try {
            QuinielaParticipacion participacion = quinielaService.participarEnQuiniela(quinielaId, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(participacion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Realizar predicciones
     */
    @PostMapping("/participaciones/{participacionId}/predicciones")
    public ResponseEntity<List<PrediccionEvento>> realizarPredicciones(
            @PathVariable Long participacionId,
            @RequestBody List<PrediccionRequest> predicciones) {
        try {
            List<PrediccionEvento> prediccionesGuardadas = quinielaService.realizarPredicciones(participacionId,
                    predicciones);
            return ResponseEntity.ok(prediccionesGuardadas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener ranking de una quiniela
     */
    @GetMapping("/{quinielaId}/ranking")
    public ResponseEntity<List<RankingParticipacionDto>> obtenerRanking(@PathVariable Long quinielaId) {
        try {
            List<RankingParticipacionDto> ranking = quinielaService.obtenerRanking(quinielaId);
            return ResponseEntity.ok(ranking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Procesar resultados de una quiniela (solo admin)
     */
    @PostMapping("/{quinielaId}/procesar-resultados")
    public ResponseEntity<Void> procesarResultados(@PathVariable Long quinielaId) {
        try {
            quinielaService.procesarResultados(quinielaId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Verificar si un usuario puede participar en una quiniela
     */
    @GetMapping("/{quinielaId}/puede-participar/{usuarioId}")
    public ResponseEntity<java.util.Map<String, Boolean>> puedeParticipar(@PathVariable Long quinielaId, @PathVariable Long usuarioId) {
        try {
            boolean puedeParticipar = quinielaService.puedeParticipar(quinielaId, usuarioId);
            java.util.Map<String, Boolean> response = new java.util.HashMap<>();
            response.put("puedeParticipar", puedeParticipar);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            java.util.Map<String, Boolean> response = new java.util.HashMap<>();
            response.put("puedeParticipar", false);
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener participaciones de un usuario
     */
    @GetMapping("/participaciones/usuario/{usuarioId}")
    public ResponseEntity<Page<QuinielaParticipacion>> obtenerParticipacionesUsuario(
            @PathVariable Long usuarioId, 
            Pageable pageable) {
        try {
            Page<QuinielaParticipacion> participaciones = quinielaService.obtenerParticipacionesUsuario(usuarioId, pageable);
            return ResponseEntity.ok(participaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener participaciones de un usuario con relaciones cargadas
     */
    @GetMapping("/participaciones/usuario/{usuarioId}/with-relations")
    public ResponseEntity<List<QuinielaParticipacion>> obtenerParticipacionesUsuarioConRelaciones(
            @PathVariable Long usuarioId) {
        try {
            List<QuinielaParticipacion> participaciones = quinielaService.obtenerParticipacionesUsuarioConRelaciones(usuarioId);
            return ResponseEntity.ok(participaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener eventos de una quiniela
     */
    @GetMapping("/{quinielaId}/eventos")
    public ResponseEntity<List<com.example.cc.entities.QuinielaEvento>> obtenerEventosQuiniela(@PathVariable Long quinielaId) {
        try {
            List<com.example.cc.entities.QuinielaEvento> eventos = quinielaService.obtenerEventosQuiniela(quinielaId);
            return ResponseEntity.ok(eventos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener predicciones de un usuario para una quiniela específica
     */
    @GetMapping("/predicciones/usuario/{usuarioId}/quiniela/{quinielaId}")
    public ResponseEntity<List<PrediccionEvento>> obtenerPrediccionesUsuarioPorQuiniela(
            @PathVariable Long usuarioId,
            @PathVariable Long quinielaId) {
        try {
            List<PrediccionEvento> predicciones = quinielaService.obtenerPrediccionesUsuarioPorQuiniela(usuarioId, quinielaId);
            return ResponseEntity.ok(predicciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener predicciones por ID de participación
     */
    @GetMapping("/participaciones/{participacionId}/predicciones")
    public ResponseEntity<List<PrediccionEvento>> obtenerPrediccionesPorParticipacion(
            @PathVariable Long participacionId) {
        try {
            List<PrediccionEvento> predicciones = quinielaService.obtenerPrediccionesPorParticipacion(participacionId);
            return ResponseEntity.ok(predicciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
