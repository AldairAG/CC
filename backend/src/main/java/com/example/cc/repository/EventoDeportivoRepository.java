package com.example.cc.repository;

import com.example.cc.entities.EventoDeportivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventoDeportivoRepository extends JpaRepository<EventoDeportivo, Long> {

    /**
     * Buscar evento por ID externo de TheSportsDB
     */
    Optional<EventoDeportivo> findByEventoIdExterno(String eventoIdExterno);

    /**
     * Verificar si existe un evento por ID externo
     */
    boolean existsByEventoIdExterno(String eventoIdExterno);

    /**
     * Obtener eventos por rango de fechas
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.fechaEvento BETWEEN :fechaInicio AND :fechaFin ORDER BY e.fechaEvento ASC")
    List<EventoDeportivo> findByFechaEventoBetween(@Param("fechaInicio") LocalDateTime fechaInicio,
                                                   @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Obtener eventos por deporte
     */
    List<EventoDeportivo> findByDeporteOrderByFechaEventoAsc(String deporte);

    /**
     * Obtener eventos por liga
     */
    List<EventoDeportivo> findByLigaOrderByFechaEventoAsc(String liga);

    /**
     * Obtener eventos por estado
     */
    List<EventoDeportivo> findByEstadoOrderByFechaEventoAsc(String estado);

    /**
     * Obtener eventos por rango de fechas y estado
     */
    List<EventoDeportivo> findByFechaEventoBetweenAndEstadoOrderByFechaEventoAsc(
            LocalDateTime fechaInicio, LocalDateTime fechaFin, String estado);

    /**
     * Eliminar eventos antiguos (más de 30 días)
     */
    @Query("DELETE FROM EventoDeportivo e WHERE e.fechaEvento < :fechaLimite")
    void deleteEventosAntiguos(@Param("fechaLimite") LocalDateTime fechaLimite);
}
