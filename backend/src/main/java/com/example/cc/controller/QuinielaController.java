package com.example.cc.controller;

import com.example.cc.entities.Quiniela;
import com.example.cc.service.quiniela.IQuinielaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/cc/quinielas")
@CrossOrigin(origins = "*")
public class QuinielaController {

    @Autowired
    private IQuinielaService quinielaService;

    @GetMapping
    public ResponseEntity<List<Quiniela>> getAllQuinielas() {
        return ResponseEntity.ok(quinielaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiniela> getQuinielaById(@PathVariable Long id) {
        return quinielaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Quiniela> createQuiniela(@RequestBody Quiniela quiniela) {
        return ResponseEntity.ok(quinielaService.save(quiniela));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiniela> updateQuiniela(@PathVariable Long id, @RequestBody Quiniela quiniela) {
        return quinielaService.findById(id)
                .map(existingQuiniela -> {
                    quiniela.setIdQuiniela(id);
                    return ResponseEntity.ok(quinielaService.save(quiniela));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiniela(@PathVariable Long id) {
        if (!quinielaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        quinielaService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Quiniela>> getQuinielasByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(quinielaService.findByEstado(estado));
    }

    @GetMapping("/fechas")
    public ResponseEntity<List<Quiniela>> getQuinielasByFechas(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaInicio,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaFin) {
        return ResponseEntity.ok(quinielaService.findByFechaInicioBetween(fechaInicio, fechaFin));
    }

    @GetMapping("/precio/{precio}")
    public ResponseEntity<List<Quiniela>> getQuinielasByPrecioMaximo(@PathVariable Float precio) {
        return ResponseEntity.ok(quinielaService.findByPrecioParticipacionLessThanEqual(precio));
    }

    @PutMapping("/{id}/premio")
    public ResponseEntity<Void> actualizarPremio(@PathVariable Long id, @RequestParam BigDecimal nuevoPremio) {
        quinielaService.actualizarPremioAcumulado(id, nuevoPremio);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Void> actualizarEstado(@PathVariable Long id, @RequestParam String nuevoEstado) {
        quinielaService.actualizarEstado(id, nuevoEstado);
        return ResponseEntity.ok().build();
    }
}
