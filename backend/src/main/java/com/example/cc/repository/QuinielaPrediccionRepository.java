package com.example.cc.repository;

import com.example.cc.entities.QuinielaPrediccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuinielaPrediccionRepository extends JpaRepository<QuinielaPrediccion, Long> {
    
    List<QuinielaPrediccion> findByParticipacionIdOrderByEventoFechaEventoAsc(Long participacionId);
    
    Optional<QuinielaPrediccion> findByParticipacionIdAndEventoId(Long participacionId, Long eventoId);
    
    @Query("SELECT p FROM QuinielaPrediccion p WHERE p.evento.id = :eventoId")
    List<QuinielaPrediccion> findByEventoId(@Param("eventoId") Long eventoId);
    
    @Query("SELECT p FROM QuinielaPrediccion p WHERE p.participacion.quiniela.id = :quinielaId AND p.evento.finalizado = true")
    List<QuinielaPrediccion> findPrediccionesEventosFinalizados(@Param("quinielaId") Long quinielaId);
    
    @Query("SELECT COUNT(p) FROM QuinielaPrediccion p WHERE p.participacion.id = :participacionId AND p.puntosObtenidos > 0")
    long countAciertosParticipacion(@Param("participacionId") Long participacionId);
}
