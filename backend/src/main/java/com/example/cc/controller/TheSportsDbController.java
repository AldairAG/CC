package com.example.cc.controller;

import com.example.cc.dto.response.TheSportsDbEventResponse;
import com.example.cc.dto.response.TheSportsDbTeamResponse;
import com.example.cc.dto.response.TheSportsDbLeagueResponse;
import com.example.cc.service.thesportsdb.ITheSportsDbService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/thesportsdb")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TheSportsDbController {
    
    private final ITheSportsDbService theSportsDbService;
    
    // ===== ENDPOINTS DE EVENTOS =====
    
    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<TheSportsDbEventResponse> buscarEventoPorId(@PathVariable String idEvento) {
        log.info("Buscando evento por ID: {}", idEvento);
        
        Optional<TheSportsDbEventResponse> evento = theSportsDbService.buscarEventoPorId(idEvento);
        
        if (evento.isPresent()) {
            return ResponseEntity.ok(evento.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/eventos/equipos")
    public ResponseEntity<List<TheSportsDbEventResponse>> buscarEventosPorEquipos(
            @RequestParam String equipoLocal,
            @RequestParam String equipoVisitante) {
        
        log.info("Buscando eventos entre {} y {}", equipoLocal, equipoVisitante);
        
        List<TheSportsDbEventResponse> eventos = theSportsDbService.buscarEventosPorEquipos(equipoLocal, equipoVisitante);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/eventos/fecha/{fecha}")
    public ResponseEntity<List<TheSportsDbEventResponse>> buscarEventosPorFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        log.info("Buscando eventos para la fecha: {}", fecha);
        
        List<TheSportsDbEventResponse> eventos = theSportsDbService.buscarEventosPorFecha(fecha);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/eventos/liga/{idLiga}")
    public ResponseEntity<List<TheSportsDbEventResponse>> buscarEventosPorLiga(@PathVariable String idLiga) {
        log.info("Buscando eventos de la liga: {}", idLiga);
        
        List<TheSportsDbEventResponse> eventos = theSportsDbService.buscarEventosPorLiga(idLiga);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/eventos/equipo/{nombreEquipo}")
    public ResponseEntity<List<TheSportsDbEventResponse>> buscarEventosPorEquipo(@PathVariable String nombreEquipo) {
        log.info("Buscando eventos del equipo: {}", nombreEquipo);
        
        List<TheSportsDbEventResponse> eventos = theSportsDbService.buscarEventosPorEquipo(nombreEquipo);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/eventos/envivo")
    public ResponseEntity<List<TheSportsDbEventResponse>> obtenerEventosEnVivo() {
        log.info("Obteniendo eventos en vivo");
        
        List<TheSportsDbEventResponse> eventos = theSportsDbService.obtenerEventosEnVivo();
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/eventos/proximos/{idLiga}")
    public ResponseEntity<List<TheSportsDbEventResponse>> obtenerProximosEventos(@PathVariable String idLiga) {
        log.info("Obteniendo próximos eventos de la liga: {}", idLiga);
        
        List<TheSportsDbEventResponse> eventos = theSportsDbService.obtenerProximosEventos(idLiga);
        return ResponseEntity.ok(eventos);
    }
    
    // ===== ENDPOINTS DE EQUIPOS =====
    
    @GetMapping("/equipo/nombre/{nombreEquipo}")
    public ResponseEntity<TheSportsDbTeamResponse> buscarEquipoPorNombre(@PathVariable String nombreEquipo) {
        log.info("Buscando equipo por nombre: {}", nombreEquipo);
        
        Optional<TheSportsDbTeamResponse> equipo = theSportsDbService.buscarEquipoPorNombre(nombreEquipo);
        
        if (equipo.isPresent()) {
            return ResponseEntity.ok(equipo.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/equipos/liga/{idLiga}")
    public ResponseEntity<List<TheSportsDbTeamResponse>> buscarEquiposPorLiga(@PathVariable String idLiga) {
        log.info("Buscando equipos de la liga: {}", idLiga);
        
        List<TheSportsDbTeamResponse> equipos = theSportsDbService.buscarEquiposPorLiga(idLiga);
        return ResponseEntity.ok(equipos);
    }
    
    @GetMapping("/equipo/id/{idEquipo}")
    public ResponseEntity<TheSportsDbTeamResponse> buscarEquipoPorId(@PathVariable String idEquipo) {
        log.info("Buscando equipo por ID: {}", idEquipo);
        
        Optional<TheSportsDbTeamResponse> equipo = theSportsDbService.buscarEquipoPorId(idEquipo);
        
        if (equipo.isPresent()) {
            return ResponseEntity.ok(equipo.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // ===== ENDPOINTS DE LIGAS =====
    
    @GetMapping("/ligas")
    public ResponseEntity<List<TheSportsDbLeagueResponse>> obtenerTodasLasLigas() {
        log.info("Obteniendo todas las ligas");
        
        List<TheSportsDbLeagueResponse> ligas = theSportsDbService.obtenerTodasLasLigas();
        return ResponseEntity.ok(ligas);
    }
    
    @GetMapping("/ligas/deporte/{deporte}")
    public ResponseEntity<List<TheSportsDbLeagueResponse>> buscarLigasPorDeporte(@PathVariable String deporte) {
        log.info("Buscando ligas por deporte: {}", deporte);
        
        List<TheSportsDbLeagueResponse> ligas = theSportsDbService.buscarLigasPorDeporte(deporte);
        return ResponseEntity.ok(ligas);
    }
    
    @GetMapping("/liga/nombre/{nombreLiga}")
    public ResponseEntity<TheSportsDbLeagueResponse> buscarLigaPorNombre(@PathVariable String nombreLiga) {
        log.info("Buscando liga por nombre: {}", nombreLiga);
        
        Optional<TheSportsDbLeagueResponse> liga = theSportsDbService.buscarLigaPorNombre(nombreLiga);
        
        if (liga.isPresent()) {
            return ResponseEntity.ok(liga.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/ligas/pais/{pais}")
    public ResponseEntity<List<TheSportsDbLeagueResponse>> buscarLigasPorPais(@PathVariable String pais) {
        log.info("Buscando ligas por país: {}", pais);
        
        List<TheSportsDbLeagueResponse> ligas = theSportsDbService.buscarLigasPorPais(pais);
        return ResponseEntity.ok(ligas);
    }
    
    // ===== ENDPOINTS DE UTILIDAD =====
    
    @GetMapping("/conectividad")
    public ResponseEntity<Boolean> verificarConectividad() {
        log.info("Verificando conectividad con TheSportsDB");
        
        boolean conectado = theSportsDbService.verificarConectividad();
        return ResponseEntity.ok(conectado);
    }
    
    @GetMapping("/estado")
    public ResponseEntity<String> obtenerEstadoApi() {
        log.info("Obteniendo estado de la API");
        
        String estado = theSportsDbService.obtenerEstadoApi();
        return ResponseEntity.ok(estado);
    }
    
    @PostMapping("/cache/limpiar")
    public ResponseEntity<String> limpiarCache() {
        log.info("Limpiando caché de TheSportsDB");
        
        theSportsDbService.limpiarCache();
        return ResponseEntity.ok("Caché limpiado exitosamente");
    }
    
    @GetMapping("/estadisticas")
    public ResponseEntity<String> obtenerEstadisticasUso() {
        log.info("Obteniendo estadísticas de uso");
        
        String estadisticas = theSportsDbService.obtenerEstadisticasUso();
        return ResponseEntity.ok(estadisticas);
    }
}
