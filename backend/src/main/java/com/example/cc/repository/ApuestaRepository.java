package com.example.cc.repository;

import com.example.cc.entities.Apuesta;
import com.example.cc.entities.Usuario;
import com.example.cc.entities.Evento;
import com.example.cc.entities.enums.EstadoApuesta;
import com.example.cc.entities.enums.TipoApuesta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApuestaRepository extends JpaRepository<Apuesta, Long> {
    
    // Buscar apuestas por usuario
    List<Apuesta> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);
    
    // Buscar apuestas por usuario con paginación
    Page<Apuesta> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario, Pageable pageable);
    
    // Buscar apuestas por evento
    List<Apuesta> findByEvento(Evento evento);
    
    // Buscar apuestas por estado
    List<Apuesta> findByEstadoApuesta(EstadoApuesta estadoApuesta);
    
    // Buscar apuestas por usuario y estado
    List<Apuesta> findByUsuarioAndEstadoApuesta(Usuario usuario, EstadoApuesta estadoApuesta);
    
    // Buscar apuestas por tipo
    List<Apuesta> findByTipoApuesta(TipoApuesta tipoApuesta);
    
    // Buscar apuestas en un rango de fechas
    List<Apuesta> findByFechaCreacionBetween(LocalDateTime inicio, LocalDateTime fin);
    
    // Buscar apuestas por usuario en un rango de fechas
    List<Apuesta> findByUsuarioAndFechaCreacionBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fin);
    
    // Consultas personalizadas con @Query
    
    @Query("SELECT COUNT(a) FROM Apuesta a WHERE a.usuario = :usuario")
    Long countByUsuario(@Param("usuario") Usuario usuario);
    
    @Query("SELECT COUNT(a) FROM Apuesta a WHERE a.usuario = :usuario AND a.estadoApuesta = :estado")
    Long countByUsuarioAndEstado(@Param("usuario") Usuario usuario, @Param("estado") EstadoApuesta estado);
    
    @Query("SELECT SUM(a.montoApuesta) FROM Apuesta a WHERE a.usuario = :usuario")
    Optional<BigDecimal> sumMontoApuestaByUsuario(@Param("usuario") Usuario usuario);
    
    @Query("SELECT SUM(a.gananciaReal) FROM Apuesta a WHERE a.usuario = :usuario AND a.estadoApuesta = 'GANADA'")
    Optional<BigDecimal> sumGananciaRealByUsuario(@Param("usuario") Usuario usuario);
    
    @Query("SELECT AVG(a.cuotaApuesta) FROM Apuesta a WHERE a.usuario = :usuario")
    Optional<BigDecimal> avgCuotaApuestaByUsuario(@Param("usuario") Usuario usuario);
    
    @Query("SELECT MAX(a.gananciaReal) FROM Apuesta a WHERE a.usuario = :usuario AND a.estadoApuesta = 'GANADA'")
    Optional<BigDecimal> maxGananciaByUsuario(@Param("usuario") Usuario usuario);
    
    @Query("SELECT MAX(a.montoApuesta) FROM Apuesta a WHERE a.usuario = :usuario AND a.estadoApuesta = 'PERDIDA'")
    Optional<BigDecimal> maxPerdidaByUsuario(@Param("usuario") Usuario usuario);
    
    // Obtener apuestas pendientes que necesitan resolución
    @Query("SELECT a FROM Apuesta a WHERE a.estadoApuesta = 'PENDIENTE' AND a.evento.fechaPartido < :fecha")
    List<Apuesta> findApuestasPendientesVencidas(@Param("fecha") java.sql.Date fecha);
    
    // Obtener top apuestas por ganancia
    @Query("SELECT a FROM Apuesta a WHERE a.estadoApuesta = 'GANADA' ORDER BY a.gananciaReal DESC")
    List<Apuesta> findTopGanancias(Pageable pageable);
    
    // Obtener apuestas por evento y tipo
    List<Apuesta> findByEventoAndTipoApuesta(Evento evento, TipoApuesta tipoApuesta);
    
    // Obtener últimas apuestas del usuario
    @Query("SELECT a FROM Apuesta a WHERE a.usuario = :usuario ORDER BY a.fechaCreacion DESC")
    List<Apuesta> findUltimasApuestasByUsuario(@Param("usuario") Usuario usuario, Pageable pageable);
    
    // Verificar si usuario ya apostó en un evento específico
    boolean existsByUsuarioAndEventoAndTipoApuesta(Usuario usuario, Evento evento, TipoApuesta tipoApuesta);
}
