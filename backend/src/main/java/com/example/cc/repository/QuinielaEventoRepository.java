package com.example.cc.repository;

import com.example.cc.entities.QuinielaEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuinielaEventoRepository extends JpaRepository<QuinielaEvento, Long> {
    
    List<QuinielaEvento> findByQuinielaIdOrderByFechaEventoAsc(Long quinielaId);
    
    @Query("SELECT e FROM QuinielaEvento e WHERE e.fechaEvento < :ahora AND e.finalizado = false")
    List<QuinielaEvento> findEventosParaFinalizar(@Param("ahora") LocalDateTime ahora);
    
    @Query("SELECT COUNT(e) FROM QuinielaEvento e WHERE e.quiniela.id = :quinielaId AND e.finalizado = true")
    long countEventosFinalizados(@Param("quinielaId") Long quinielaId);
    
    @Query("SELECT COUNT(e) FROM QuinielaEvento e WHERE e.quiniela.id = :quinielaId")
    long countTotalEventos(@Param("quinielaId") Long quinielaId);
}
