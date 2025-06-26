package com.example.cc.repository;

import com.example.cc.entities.QuinielaCreada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuinielaCreadaRepository extends JpaRepository<QuinielaCreada, Long> {
    
    List<QuinielaCreada> findByCreadorIdOrderByFechaCreacionDesc(Long creadorId);
    
    List<QuinielaCreada> findByEsPublicaTrueAndEstadoOrderByFechaCreacionDesc(QuinielaCreada.EstadoQuiniela estado);
    
    Optional<QuinielaCreada> findByCodigoInvitacion(String codigoInvitacion);
    
    @Query("SELECT q FROM QuinielaCreada q WHERE q.esPublica = true AND q.estado = :estado AND q.fechaInicio > :ahora")
    List<QuinielaCreada> findQuinielasPublicasDisponibles(@Param("estado") QuinielaCreada.EstadoQuiniela estado, @Param("ahora") LocalDateTime ahora);
    
    @Query("SELECT q FROM QuinielaCreada q WHERE q.fechaFin < :ahora AND q.estado = :estado AND q.premiosDistribuidos = false")
    List<QuinielaCreada> findQuinielasParaDistribuirPremios(@Param("ahora") LocalDateTime ahora, @Param("estado") QuinielaCreada.EstadoQuiniela estado);
    
    @Query("SELECT q FROM QuinielaCreada q JOIN q.participaciones p WHERE p.usuarioId = :usuarioId ORDER BY q.fechaCreacion DESC")
    List<QuinielaCreada> findQuinielasUsuarioParticipa(@Param("usuarioId") Long usuarioId);
    
    @Query("SELECT COUNT(q) FROM QuinielaCreada q WHERE q.creadorId = :usuarioId AND q.fechaCreacion > :fecha")
    long countQuinielasUsuarioRecientes(@Param("usuarioId") Long usuarioId, @Param("fecha") LocalDateTime fecha);
}
