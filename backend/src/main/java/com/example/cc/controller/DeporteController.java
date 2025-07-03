package com.example.cc.controller;

import com.example.cc.entities.Deporte;
import com.example.cc.service.deportes.IDeporteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/cc/deportes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class DeporteController {

    private final IDeporteService deporteService;

    /**
     * Obtener todos los deportes
     */
    @GetMapping
    public ResponseEntity<List<Deporte>> getAllDeportes() {
        try {
            List<Deporte> deportes = deporteService.getAllDeportes();
            return ResponseEntity.ok(deportes);
        } catch (Exception e) {
            log.error("Error al obtener deportes: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener deportes activos
     */
    @GetMapping("/activos")
    public ResponseEntity<List<Deporte>> getDeportesActivos() {
        try {
            List<Deporte> deportes = deporteService.getDeportesActivos();
            return ResponseEntity.ok(deportes);
        } catch (Exception e) {
            log.error("Error al obtener deportes activos: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener deporte por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Deporte> getDeporteById(@PathVariable Long id) {
        try {
            return deporteService.getDeporteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error al obtener deporte por ID {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener deporte por nombre
     */
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<Deporte> getDeporteByNombre(@PathVariable String nombre) {
        try {
            return deporteService.getDeporteByNombre(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error al obtener deporte por nombre {}: {}", nombre, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Buscar deportes por nombre parcial
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Deporte>> searchDeportes(@RequestParam String q) {
        try {
            List<Deporte> deportes = deporteService.searchDeportesByNombre(q);
            return ResponseEntity.ok(deportes);
        } catch (Exception e) {
            log.error("Error al buscar deportes: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Crear nuevo deporte
     */
    @PostMapping
    public ResponseEntity<Deporte> createDeporte(@Valid @RequestBody Deporte deporte) {
        try {
            Deporte nuevoDeporte = deporteService.createDeporte(deporte);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDeporte);
        } catch (IllegalArgumentException e) {
            log.error("Error de validación al crear deporte: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error al crear deporte: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Actualizar deporte existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Deporte> updateDeporte(@PathVariable Long id, @Valid @RequestBody Deporte deporte) {
        try {
            Deporte deporteActualizado = deporteService.updateDeporte(id, deporte);
            return ResponseEntity.ok(deporteActualizado);
        } catch (RuntimeException e) {
            log.error("Error al actualizar deporte: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error al actualizar deporte: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Eliminar deporte (desactivar)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeporte(@PathVariable Long id) {
        try {
            deporteService.deleteDeporte(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error al eliminar deporte: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error al eliminar deporte: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Verificar si existe un deporte
     */
    @GetMapping("/existe/{nombre}")
    public ResponseEntity<Boolean> existsDeporte(@PathVariable String nombre) {
        try {
            boolean existe = deporteService.existsDeporte(nombre);
            return ResponseEntity.ok(existe);
        } catch (Exception e) {
            log.error("Error al verificar existencia de deporte: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
