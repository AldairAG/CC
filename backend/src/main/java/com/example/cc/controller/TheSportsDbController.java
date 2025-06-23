package com.example.cc.controller;

import com.example.cc.entities.Evento;
import com.example.cc.service.thesportsdb.TheSportsDbService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/thesportsdb")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TheSportsDbController {

    private final TheSportsDbService theSportsDbService;

    /**
     * Busca un evento por equipos en TheSportsDB
     * GET /api/thesportsdb/eventos/buscar-por-equipos?equipoLocal=Real Madrid&equipoVisitante=Barcelona
     */
    @GetMapping("/eventos/buscar-por-equipos")
    public ResponseEntity<?> buscarEventoPorEquipos(
            @RequestParam String equipoLocal,
            @RequestParam String equipoVisitante) {
        
        log.info("Buscando evento por equipos - Local: {}, Visitante: {}", equipoLocal, equipoVisitante);
        
        try {
            Optional<Evento> evento = theSportsDbService.buscarEventoPorEquipos(equipoLocal, equipoVisitante);
            
            if (evento.isPresent()) {
                return ResponseEntity.ok(evento.get());
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("Error al buscar evento por equipos: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body("Error al buscar evento: " + e.getMessage());
        }
    }

    /**
     * Busca eventos por fecha en TheSportsDB
     * GET /api/thesportsdb/eventos/buscar-por-fecha?fecha=2025-06-23
     */
    @GetMapping("/eventos/buscar-por-fecha")
    public ResponseEntity<?> buscarEventosPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        log.info("Buscando eventos por fecha: {}", fecha);
        
        try {
            List<Evento> eventos = theSportsDbService.buscarEventosPorFecha(fecha);
            return ResponseEntity.ok(eventos);
            
        } catch (Exception e) {
            log.error("Error al buscar eventos por fecha: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body("Error al buscar eventos: " + e.getMessage());
        }
    }

    /**
     * Busca un evento por ID externo en TheSportsDB
     * GET /api/thesportsdb/eventos/buscar-por-id/123456
     */
    @GetMapping("/eventos/buscar-por-id/{idEventoExterno}")
    public ResponseEntity<?> buscarEventoPorIdExterno(@PathVariable String idEventoExterno) {
        
        log.info("Buscando evento por ID externo: {}", idEventoExterno);
        
        try {
            Optional<Evento> evento = theSportsDbService.buscarEventoPorIdExterno(idEventoExterno);
            
            if (evento.isPresent()) {
                return ResponseEntity.ok(evento.get());
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("Error al buscar evento por ID externo: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body("Error al buscar evento: " + e.getMessage());
        }
    }

    /**
     * Endpoint para probar la conectividad con TheSportsDB
     * GET /api/thesportsdb/test
     */
    @GetMapping("/test")
    public ResponseEntity<?> testConectividad() {
        log.info("Probando conectividad con TheSportsDB");
        
        try {
            // Buscar eventos de hoy como prueba
            List<Evento> eventos = theSportsDbService.buscarEventosPorFecha(LocalDate.now());
            
            return ResponseEntity.ok().body(Map.of(
                "status", "OK",
                "message", "Conectividad exitosa con TheSportsDB",
                "eventosEncontrados", eventos.size(),
                "fecha", LocalDate.now(),
                "timestamp", System.currentTimeMillis()
            ));
            
        } catch (Exception e) {
            log.error("Error al probar conectividad: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                        "status", "ERROR",
                        "message", "Error de conectividad: " + e.getMessage(),
                        "timestamp", System.currentTimeMillis()
                    ));
        }
    }

    /**
     * Endpoint para obtener información sobre la API
     * GET /api/thesportsdb/info
     */
    @GetMapping("/info")
    public ResponseEntity<?> obtenerInformacion() {
        return ResponseEntity.ok().body(Map.of(
            "apiName", "TheSportsDB Integration",
            "version", "1.0",
            "endpoints", List.of(
                "GET /api/thesportsdb/eventos/buscar-por-equipos?equipoLocal={local}&equipoVisitante={visitante}",
                "GET /api/thesportsdb/eventos/buscar-por-fecha?fecha={yyyy-MM-dd}",
                "GET /api/thesportsdb/eventos/buscar-por-id/{idEventoExterno}",
                "GET /api/thesportsdb/test",
                "GET /api/thesportsdb/info"
            ),
            "description", "API para acceder a los servicios de TheSportsDB",
            "baseUrl", "https://www.thesportsdb.com/api/v1/json/",
            "timestamp", System.currentTimeMillis()
        ));
    }
}
