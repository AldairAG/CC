package com.example.cc.service.thesportsdb;

import com.example.cc.dto.response.TheSportsDbEventResponse;
import com.example.cc.dto.response.TheSportsDbTeamResponse;
import com.example.cc.dto.response.TheSportsDbLeagueResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para interactuar con la API de TheSportsDB
 * Proporciona métodos para obtener información de eventos deportivos,
 * equipos, ligas y estadísticas
 */
public interface ITheSportsDbService {
    
    // ===== MÉTODOS DE EVENTOS =====
    
    /**
     * Busca un evento específico por su ID en TheSportsDB
     */
    Optional<TheSportsDbEventResponse> buscarEventoPorId(String idEvento);
    
    /**
     * Busca eventos por equipos (local y visitante)
     */
    List<TheSportsDbEventResponse> buscarEventosPorEquipos(String equipoLocal, String equipoVisitante);
    
    /**
     * Obtiene eventos de una fecha específica
     */
    List<TheSportsDbEventResponse> buscarEventosPorFecha(LocalDate fecha);
    
    /**
     * Obtiene eventos de una liga específica
     */
    List<TheSportsDbEventResponse> buscarEventosPorLiga(String idLiga);
    
    /**
     * Obtiene eventos de un equipo específico
     */
    List<TheSportsDbEventResponse> buscarEventosPorEquipo(String nombreEquipo);
    
    /**
     * Obtiene eventos en vivo/próximos
     */
    List<TheSportsDbEventResponse> obtenerEventosEnVivo();
    
    /**
     * Obtiene eventos de la siguiente ronda de una liga
     */
    List<TheSportsDbEventResponse> obtenerProximosEventos(String idLiga);
    
    // ===== MÉTODOS DE EQUIPOS =====
    
    /**
     * Busca un equipo por su nombre
     */
    Optional<TheSportsDbTeamResponse> buscarEquipoPorNombre(String nombreEquipo);
    
    /**
     * Busca equipos de una liga específica
     */
    List<TheSportsDbTeamResponse> buscarEquiposPorLiga(String idLiga);
    
    /**
     * Busca un equipo por su ID
     */
    Optional<TheSportsDbTeamResponse> buscarEquipoPorId(String idEquipo);
    
    // ===== MÉTODOS DE LIGAS =====
    
    /**
     * Obtiene todas las ligas disponibles
     */
    List<TheSportsDbLeagueResponse> obtenerTodasLasLigas();
    
    /**
     * Busca ligas por deporte
     */
    List<TheSportsDbLeagueResponse> buscarLigasPorDeporte(String deporte);
    
    /**
     * Busca una liga por su nombre
     */
    Optional<TheSportsDbLeagueResponse> buscarLigaPorNombre(String nombreLiga);
    
    /**
     * Busca ligas por país
     */
    List<TheSportsDbLeagueResponse> buscarLigasPorPais(String pais);
    
    // ===== MÉTODOS DE UTILIDAD =====
    
    /**
     * Verifica la conectividad con la API de TheSportsDB
     */
    boolean verificarConectividad();
    
    /**
     * Obtiene información del estado de la API
     */
    String obtenerEstadoApi();
    
    /**
     * Limpia la caché de datos (si se implementa caché)
     */
    void limpiarCache();
    
    /**
     * Obtiene las estadísticas de uso del servicio
     */
    String obtenerEstadisticasUso();
}
