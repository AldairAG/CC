package com.example.cc.repository;

import com.example.cc.entities.QuinielaEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuinielaEventoRepository extends JpaRepository<QuinielaEvento, Long> {

    /**
     * Obtener todos los eventos de una quiniela
     */
    List<QuinielaEvento> findByQuiniela_IdOrderByOrdenEnQuiniela(Long quinielaId);

    /**
     * Obtener un evento específico de una quiniela
     */
    Optional<QuinielaEvento> findByQuiniela_IdAndEventoDeportivo_Id(Long quinielaId, Long eventoDeportivoId);

    /**
     * Obtener eventos de una quiniela por estado
     */
    @Query("SELECT qe FROM QuinielaEvento qe JOIN qe.eventoDeportivo ed WHERE qe.quiniela.id = :quinielaId AND ed.estado = :estado")
    List<QuinielaEvento> findByQuinielaIdAndEventoEstado(@Param("quinielaId") Long quinielaId, @Param("estado") String estado);

    /**
     * Contar eventos en una quiniela
     */
    long countByQuiniela_Id(Long quinielaId);

    /**
     * Verificar si un evento deportivo ya está en una quiniela
     */
    boolean existsByQuiniela_IdAndEventoDeportivo_Id(Long quinielaId, Long eventoDeportivoId);

    /**
     * Eliminar todos los eventos de una quiniela
     */
    void deleteByQuiniela_Id(Long quinielaId);
}
