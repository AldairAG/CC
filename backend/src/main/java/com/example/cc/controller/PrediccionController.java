package com.example.cc.controller;

import com.example.cc.entities.Prediccion;
import com.example.cc.service.prediccion.IPrediccionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cc/predicciones")
@CrossOrigin(origins = "*")
public class PrediccionController {

    @Autowired
    private IPrediccionService prediccionService;

    @GetMapping
    public ResponseEntity<List<Prediccion>> getAllPredicciones() {
        return ResponseEntity.ok(prediccionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prediccion> getPrediccionById(@PathVariable Long id) {
        return prediccionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Prediccion> createPrediccion(@RequestBody Prediccion prediccion) {
        return ResponseEntity.ok(prediccionService.save(prediccion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prediccion> updatePrediccion(@PathVariable Long id, @RequestBody Prediccion prediccion) {
        return prediccionService.findById(id)
                .map(existingPrediccion -> {
                    prediccion.setIdPrediccion(id);
                    return ResponseEntity.ok(prediccionService.save(prediccion));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrediccion(@PathVariable Long id) {
        if (!prediccionService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        prediccionService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/usuario/{usuarioId}/quiniela/{quinielaId}")
    public ResponseEntity<List<Prediccion>> getPrediccionesByUsuarioQuiniela(
            @PathVariable Long usuarioId,
            @PathVariable Long quinielaId) {
        return ResponseEntity.ok(prediccionService.findByUsuarioQuinielaId(usuarioId, quinielaId));
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<Prediccion>> getPrediccionesByEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(prediccionService.findByEventoId(eventoId));
    }

    @PutMapping("/{id}/acierto")
    public ResponseEntity<Void> actualizarAcierto(@PathVariable Long id, @RequestParam Boolean acertada) {
        prediccionService.actualizarAcierto(id, acertada);
        return ResponseEntity.ok().build();
    }
}
