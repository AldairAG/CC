package com.example.cc.controller;

import com.example.cc.entities.Liga;
import com.example.cc.service.deportes.ILigaService;
import com.example.cc.service.deportes.IDeporteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/cc/ligas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class LigaController {

    private final ILigaService ligaService;
    private final IDeporteService deporteService;

    /**
     * Obtener todas las ligas
     */
    @GetMapping
    public ResponseEntity<List<Liga>> getAllLigas() {
        try {
            List<Liga> ligas = ligaService.getAllLigas();
            return ResponseEntity.ok(ligas);
        } catch (Exception e) {
            log.error("Error al obtener ligas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener ligas activas
     */
    @GetMapping("/activas")
    public ResponseEntity<List<Liga>> getLigasActivas() {
        try {
            List<Liga> ligas = ligaService.getLigasActivas();
            return ResponseEntity.ok(ligas);
        } catch (Exception e) {
            log.error("Error al obtener ligas activas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener liga por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Liga> getLigaById(@PathVariable Long id) {
        try {
            return ligaService.getLigaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error al obtener liga por ID {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener liga por nombre
     */
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<Liga> getLigaByNombre(@PathVariable String nombre) {
        try {
            return ligaService.getLigaByNombre(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error al obtener liga por nombre {}: {}", nombre, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener liga por ID externo
     */
    @GetMapping("/externo/{ligaIdExterno}")
    public ResponseEntity<Liga> getLigaByIdExterno(@PathVariable String ligaIdExterno) {
        try {
            return ligaService.getLigaByIdExterno(ligaIdExterno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error al obtener liga por ID externo {}: {}", ligaIdExterno, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener ligas por deporte
     */
    @GetMapping("/deporte/{deporteId}")
    public ResponseEntity<List<Liga>> getLigasByDeporte(@PathVariable Long deporteId) {
        try {
            return deporteService.getDeporteById(deporteId)
                .map(deporte -> {
                    List<Liga> ligas = ligaService.getLigasByDeporte(deporte);
                    return ResponseEntity.ok(ligas);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error al obtener ligas por deporte {}: {}", deporteId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener ligas activas por deporte
     */
    @GetMapping("/deporte/{deporteId}/activas")
    public ResponseEntity<List<Liga>> getLigasActivasByDeporte(@PathVariable Long deporteId) {
        try {
            return deporteService.getDeporteById(deporteId)
                .map(deporte -> {
                    List<Liga> ligas = ligaService.getLigasActivasByDeporte(deporte);
                    return ResponseEntity.ok(ligas);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error al obtener ligas activas por deporte {}: {}", deporteId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener ligas por país
     */
    @GetMapping("/pais/{pais}")
    public ResponseEntity<List<Liga>> getLigasByPais(@PathVariable String pais) {
        try {
            List<Liga> ligas = ligaService.getLigasByPais(pais);
            return ResponseEntity.ok(ligas);
        } catch (Exception e) {
            log.error("Error al obtener ligas por país {}: {}", pais, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener ligas populares
     */
    @GetMapping("/populares")
    public ResponseEntity<List<Liga>> getLigasPopulares() {
        try {
            List<Liga> ligas = ligaService.getLigasPopulares();
            return ResponseEntity.ok(ligas);
        } catch (Exception e) {
            log.error("Error al obtener ligas populares: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Buscar ligas por nombre parcial
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Liga>> searchLigas(@RequestParam String q) {
        try {
            List<Liga> ligas = ligaService.searchLigasByNombre(q);
            return ResponseEntity.ok(ligas);
        } catch (Exception e) {
            log.error("Error al buscar ligas: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Crear nueva liga
     */
    @PostMapping
    public ResponseEntity<Liga> createLiga(@Valid @RequestBody Liga liga) {
        try {
            Liga nuevaLiga = ligaService.createLiga(liga);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaLiga);
        } catch (IllegalArgumentException e) {
            log.error("Error de validación al crear liga: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error al crear liga: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Actualizar liga existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Liga> updateLiga(@PathVariable Long id, @Valid @RequestBody Liga liga) {
        try {
            Liga ligaActualizada = ligaService.updateLiga(id, liga);
            return ResponseEntity.ok(ligaActualizada);
        } catch (RuntimeException e) {
            log.error("Error al actualizar liga: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error al actualizar liga: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Eliminar liga (desactivar)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLiga(@PathVariable Long id) {
        try {
            ligaService.deleteLiga(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error al eliminar liga: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error al eliminar liga: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Verificar si existe una liga
     */
    @GetMapping("/existe/{nombre}")
    public ResponseEntity<Boolean> existsLiga(@PathVariable String nombre) {
        try {
            boolean existe = ligaService.existsLiga(nombre);
            return ResponseEntity.ok(existe);
        } catch (Exception e) {
            log.error("Error al verificar existencia de liga: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
