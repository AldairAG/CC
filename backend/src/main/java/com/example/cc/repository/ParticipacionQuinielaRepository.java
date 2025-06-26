package com.example.cc.repository;

import com.example.cc.entities.ParticipacionQuiniela;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipacionQuinielaRepository extends JpaRepository<ParticipacionQuiniela, Long> {
    
    List<ParticipacionQuiniela> findByQuinielaIdOrderByPuntosObtenidosDesc(Long quinielaId);
    
    Optional<ParticipacionQuiniela> findByQuinielaIdAndUsuarioId(Long quinielaId, Long usuarioId);
    
    List<ParticipacionQuiniela> findByUsuarioIdOrderByFechaParticipacionDesc(Long usuarioId);
    
    @Query("SELECT p FROM ParticipacionQuiniela p WHERE p.quiniela.id = :quinielaId ORDER BY p.puntosObtenidos DESC, p.fechaParticipacion ASC")
    List<ParticipacionQuiniela> findRankingByQuiniela(@Param("quinielaId") Long quinielaId);
    
    @Query("SELECT p FROM ParticipacionQuiniela p WHERE p.premioGanado > 0 AND p.premioReclamado = false AND p.usuarioId = :usuarioId")
    List<ParticipacionQuiniela> findPremiosPendientesUsuario(@Param("usuarioId") Long usuarioId);
    
    @Query("SELECT COUNT(p) FROM ParticipacionQuiniela p WHERE p.quiniela.id = :quinielaId AND p.estado = 'ACTIVA'")
    long countParticipacionesActivas(@Param("quinielaId") Long quinielaId);
    
    boolean existsByQuinielaIdAndUsuarioId(Long quinielaId, Long usuarioId);
}
