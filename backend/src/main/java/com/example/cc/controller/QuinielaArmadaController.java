package com.example.cc.controller;

import com.example.cc.entities.QuinielaArmada;
import com.example.cc.entities.objectsEmbed.QuinielaArmadaId;
import com.example.cc.service.quinielaArmada.IQuinielaArmadaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cc/quinielas-armadas")
public class QuinielaArmadaController {

    @Autowired
    private IQuinielaArmadaService quinielaArmadaService;

    @GetMapping
    public ResponseEntity<List<QuinielaArmada>> getAllQuinielasArmadas() {
        return ResponseEntity.ok(quinielaArmadaService.findAll());
    }

    @GetMapping("/{usuarioId}/{quinielaId}")
    public ResponseEntity<QuinielaArmada> getQuinielaArmadaById(
            @PathVariable Long usuarioId,
            @PathVariable Long quinielaId) {
        QuinielaArmadaId id = new QuinielaArmadaId(usuarioId, quinielaId);
        return quinielaArmadaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<QuinielaArmada> createQuinielaArmada(@RequestBody QuinielaArmada quinielaArmada) {
        return ResponseEntity.ok(quinielaArmadaService.save(quinielaArmada));
    }

    @DeleteMapping("/{usuarioId}/{quinielaId}")
    public ResponseEntity<Void> deleteQuinielaArmada(
            @PathVariable Long usuarioId,
            @PathVariable Long quinielaId) {
        QuinielaArmadaId id = new QuinielaArmadaId(usuarioId, quinielaId);
        if (!quinielaArmadaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        quinielaArmadaService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<QuinielaArmada>> getQuinielasArmadasByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(quinielaArmadaService.findByUsuarioId(usuarioId));
    }

    @GetMapping("/quiniela/{quinielaId}")
    public ResponseEntity<List<QuinielaArmada>> getQuinielasArmadasByQuiniela(@PathVariable Long quinielaId) {
        return ResponseEntity.ok(quinielaArmadaService.findByQuinielaId(quinielaId));
    }

    @GetMapping("/usuario/{usuarioId}/quiniela/{quinielaId}")
    public ResponseEntity<List<QuinielaArmada>> getQuinielasArmadasByUsuarioAndQuiniela(
            @PathVariable Long usuarioId,
            @PathVariable Long quinielaId) {
        return ResponseEntity.ok(quinielaArmadaService.findByUsuarioIdAndQuinielaId(usuarioId, quinielaId));
    }
}
