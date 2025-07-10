package com.example.cc.repository;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.Deporte;
import com.example.cc.entities.Liga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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
    List<EventoDeportivo> findByDeporteOrderByFechaEventoAsc(Deporte deporte);

    /**
     * Obtener eventos por liga
     */
    List<EventoDeportivo> findByLigaOrderByFechaEventoAsc(Liga liga);

    /**
     * Obtener eventos por deporte y estado
     */
    List<EventoDeportivo> findByDeporteAndEstadoOrderByFechaEventoAsc(Deporte deporte, String estado);

    /**
     * Obtener eventos por liga y estado
     */
    List<EventoDeportivo> findByLigaAndEstadoOrderByFechaEventoAsc(Liga liga, String estado);

    /**
     * Obtener eventos por nombre de deporte (para compatibilidad)
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.deporte.nombre = :nombreDeporte ORDER BY e.fechaEvento ASC")
    List<EventoDeportivo> findByDeporteNombreOrderByFechaEventoAsc(@Param("nombreDeporte") String nombreDeporte);

    /**
     * Obtener eventos por nombre de liga (para compatibilidad)
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.liga.nombre = :nombreLiga ORDER BY e.fechaEvento ASC")
    List<EventoDeportivo> findByLigaNombreOrderByFechaEventoAsc(@Param("nombreLiga") String nombreLiga);

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
    @Modifying
    @Query("DELETE FROM EventoDeportivo e WHERE e.fechaEvento < :fechaLimite")
    void deleteEventosAntiguos(@Param("fechaLimite") LocalDateTime fechaLimite);

    /**
     * Obtener eventos activos por estados múltiples
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.estado IN :estados AND e.fechaEvento > :fechaMinima ORDER BY e.fechaEvento ASC")
    List<EventoDeportivo> findByEstadoInAndFechaEventoAfter(@Param("estados") List<String> estados, @Param("fechaMinima") LocalDateTime fechaMinima);

    /**
     * Obtener eventos próximos en las siguientes 24 horas
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.fechaEvento BETWEEN :fechaInicio AND :fechaFin AND e.estado IN ('programado', 'en_vivo') ORDER BY e.fechaEvento ASC")
    List<EventoDeportivo> findEventosProximos24Horas(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Cerrar eventos vencidos (actualizar estado a 'finalizado')
     */
    @Modifying
    @Query("UPDATE EventoDeportivo e SET e.estado = 'finalizado', e.fechaActualizacion = :fechaActualizacion WHERE e.fechaEvento < :fechaActual AND e.estado IN ('programado', 'en_vivo')")
    int cerrarEventosVencidos(@Param("fechaActual") LocalDateTime fechaActual, @Param("fechaActualizacion") LocalDateTime fechaActualizacion);
}
