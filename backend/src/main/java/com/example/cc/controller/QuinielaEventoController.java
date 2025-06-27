package com.example.cc.controller;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.TipoPrediccion;
import com.example.cc.service.quinielaEvento.QuinielaEventoService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiniela-eventos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuinielaEventoController {

    private final QuinielaEventoService quinielaEventoService;

    /**
     * Obtener eventos disponibles para crear quinielas
     */
    @GetMapping("/disponibles")
    public ResponseEntity<List<EventoDeportivo>> obtenerEventosDisponibles() {
        List<EventoDeportivo> eventos = quinielaEventoService.obtenerEventosDisponibles();
        return ResponseEntity.ok(eventos);
    }

    /**
     * Agregar eventos a una quiniela
     */
    @PostMapping("/quiniela/{quinielaId}/eventos")
    public ResponseEntity<Void> agregarEventosAQuiniela(@PathVariable Long quinielaId,
                                                       @RequestBody List<Long> eventosIds) {
        try {
            quinielaEventoService.agregarEventosAQuiniela(quinielaId, eventosIds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Configurar tipo de predicción para un evento
     */
    @PostMapping("/quiniela/{quinielaId}/evento/{eventoId}/tipo-prediccion")
    public ResponseEntity<Void> configurarTipoPrediccion(@PathVariable Long quinielaId,
                                                        @PathVariable Long eventoId,
                                                        @RequestBody TipoPrediccion tipoPrediccion) {
        try {
            quinielaEventoService.configurarTipoPrediccion(quinielaId, eventoId, tipoPrediccion);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
