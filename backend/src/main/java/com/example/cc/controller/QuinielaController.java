package com.example.cc.controller;

import com.example.cc.dto.CrearQuinielaRequest;
import com.example.cc.dto.PrediccionRequest;
import com.example.cc.dto.RankingParticipacionDto;
import com.example.cc.entities.Quiniela;
import com.example.cc.entities.QuinielaParticipacion;
import com.example.cc.entities.PrediccionEvento;
import com.example.cc.service.QuinielaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quinielas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuinielaController {

    private final QuinielaService quinielaService;

    /**
     * Crear nueva quiniela
     */
    @PostMapping
    public ResponseEntity<Quiniela> crearQuiniela(@RequestBody CrearQuinielaRequest request) {
        try {
            Quiniela quiniela = quinielaService.crearQuiniela(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(quiniela);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Activar quiniela
     */
    @PostMapping("/{quinielaId}/activar")
    public ResponseEntity<Quiniela> activarQuiniela(@PathVariable Long quinielaId, 
                                                   @RequestParam Long usuarioId) {
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
            // Aquí podrías agregar un método en el servicio para obtener por ID
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
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
            List<PrediccionEvento> prediccionesGuardadas = quinielaService.realizarPredicciones(participacionId, predicciones);
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
}
