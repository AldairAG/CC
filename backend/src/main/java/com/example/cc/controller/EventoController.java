package com.example.cc.controller;

import com.example.cc.entities.Evento;
import com.example.cc.service.evento.IEventoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/cc/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    @Autowired
    private IEventoService eventoService;

    @GetMapping
    public ResponseEntity<List<Evento>> getAllEventos() {
        return ResponseEntity.ok(eventoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> getEventoById(@PathVariable Long id) {
        return eventoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Evento> createEvento(@RequestBody Evento evento) {
        return ResponseEntity.ok(eventoService.save(evento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evento> updateEvento(@PathVariable Long id, @RequestBody Evento evento) {
        return eventoService.findById(id)
                .map(existingEvento -> {
                    evento.setIdEvento(id);
                    return ResponseEntity.ok(eventoService.save(evento));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        if (!eventoService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        eventoService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<Evento>> getEventosByFecha(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date fecha) {
        return ResponseEntity.ok(eventoService.findByFechaPartido(fecha));
    }

    @GetMapping("/equipo-local/{equipo}")
    public ResponseEntity<List<Evento>> getEventosByEquipoLocal(@PathVariable String equipo) {
        return ResponseEntity.ok(eventoService.findByEquipoLocal(equipo));
    }

    @GetMapping("/equipo-visitante/{equipo}")
    public ResponseEntity<List<Evento>> getEventosByEquipoVisitante(@PathVariable String equipo) {
        return ResponseEntity.ok(eventoService.findByEquipoVisitante(equipo));
    }

    @GetMapping("/quiniela/{quinielaId}")
    public ResponseEntity<List<Evento>> getEventosByQuiniela(@PathVariable Long quinielaId) {
        return ResponseEntity.ok(eventoService.findByQuinielaId(quinielaId));
    }
}
