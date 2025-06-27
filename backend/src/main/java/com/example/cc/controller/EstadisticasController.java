package com.example.cc.controller;

import com.example.cc.dto.QuinielaResumenDto;
import com.example.cc.entities.QuinielaParticipacion;
import com.example.cc.service.estadisticas.EstadisticasService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estadisticas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EstadisticasController {

    private final EstadisticasService estadisticasService;

    /**
     * Obtener estadísticas del dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasDashboard() {
        Map<String, Object> stats = estadisticasService.obtenerEstadisticasDashboard();
        return ResponseEntity.ok(stats);
    }

    /**
     * Obtener quinielas populares
     */
    @GetMapping("/quinielas/populares")
    public ResponseEntity<List<QuinielaResumenDto>> obtenerQuinielasPopulares(@RequestParam(defaultValue = "10") int limite) {
        List<QuinielaResumenDto> quinielas = estadisticasService.obtenerQuinielasPopulares(limite);
        return ResponseEntity.ok(quinielas);
    }

    /**
     * Obtener quinielas con mayor pool
     */
    @GetMapping("/quinielas/mayor-pool")
    public ResponseEntity<List<QuinielaResumenDto>> obtenerQuinielasMayorPool(@RequestParam(defaultValue = "10") int limite) {
        List<QuinielaResumenDto> quinielas = estadisticasService.obtenerQuinielasMayorPool(limite);
        return ResponseEntity.ok(quinielas);
    }

    /**
     * Obtener quinielas próximas a cerrar
     */
    @GetMapping("/quinielas/proximas-cerrar")
    public ResponseEntity<List<QuinielaResumenDto>> obtenerQuinielasProximasACerrar(@RequestParam(defaultValue = "10") int limite) {
        List<QuinielaResumenDto> quinielas = estadisticasService.obtenerQuinielasProximasACerrar(limite);
        return ResponseEntity.ok(quinielas);
    }

    /**
     * Obtener estadísticas de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasUsuario(@PathVariable Long usuarioId) {
        Map<String, Object> stats = estadisticasService.obtenerEstadisticasUsuario(usuarioId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Obtener histórico de participaciones de un usuario
     */
    @GetMapping("/usuario/{usuarioId}/historico")
    public ResponseEntity<Page<QuinielaParticipacion>> obtenerHistoricoUsuario(@PathVariable Long usuarioId, Pageable pageable) {
        Page<QuinielaParticipacion> historico = estadisticasService.obtenerHistoricoUsuario(usuarioId, pageable);
        return ResponseEntity.ok(historico);
    }

    /**
     * Obtener estadísticas por tipo de quiniela
     */
    @GetMapping("/tipos")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasPorTipo() {
        Map<String, Object> stats = estadisticasService.obtenerEstadisticasPorTipo();
        return ResponseEntity.ok(stats);
    }

    /**
     * Obtener top ganadores
     */
    @GetMapping("/top-ganadores")
    public ResponseEntity<List<Map<String, Object>>> obtenerTopGanadores(@RequestParam(defaultValue = "10") int limite) {
        List<Map<String, Object>> topGanadores = estadisticasService.obtenerTopGanadores(limite);
        return ResponseEntity.ok(topGanadores);
    }
}
