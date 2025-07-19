package com.example.cc.repository;

import com.example.cc.entities.Apuesta;
import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApuestaRepository extends JpaRepository<Apuesta, Long> {

    /**
     * Obtener apuestas por usuario
     */
    List<Apuesta> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);

    /**
     * Obtener apuestas por usuario con paginación
     */
    Page<Apuesta> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario, Pageable pageable);

    /**
     * Obtener apuestas por evento deportivo
     */
    List<Apuesta> findByEventoDeportivoOrderByFechaCreacionDesc(EventoDeportivo eventoDeportivo);

    /**
     * Obtener apuestas por estado
     */
    List<Apuesta> findByEstadoOrderByFechaCreacionDesc(Apuesta.EstadoApuesta estado);

    /**
     * Obtener apuestas por usuario y estado
     */
    List<Apuesta> findByUsuarioAndEstadoOrderByFechaCreacionDesc(Usuario usuario, Apuesta.EstadoApuesta estado);

    /**
     * Obtener apuestas por usuario y estado con paginación
     */
    Page<Apuesta> findByUsuarioAndEstadoOrderByFechaCreacionDesc(Usuario usuario, Apuesta.EstadoApuesta estado, Pageable pageable);

    /**
     * Obtener apuestas por usuario y evento con paginación
     */
    Page<Apuesta> findByUsuarioAndEventoDeportivoOrderByFechaCreacionDesc(Usuario usuario, EventoDeportivo evento, Pageable pageable);

    /**
     * Obtener apuestas activas (PENDIENTE y ACEPTADA) del usuario con paginación
     */
    @Query("SELECT a FROM Apuesta a WHERE a.usuario = :usuario AND a.estado IN ('PENDIENTE', 'ACEPTADA') ORDER BY a.fechaCreacion DESC")
    Page<Apuesta> findApuestasActivas(@Param("usuario") Usuario usuario, Pageable pageable);

    /**
     * Obtener historial de apuestas (RESUELTA, CANCELADA) del usuario con paginación
     */
    @Query("SELECT a FROM Apuesta a WHERE a.usuario = :usuario AND a.estado IN ('RESUELTA', 'CANCELADA') ORDER BY a.fechaCreacion DESC")
    Page<Apuesta> findApuestasHistorial(@Param("usuario") Usuario usuario, Pageable pageable);

    /**
     * Buscar apuestas por texto (nombre del evento, predicción, descripción)
     */
    @Query("SELECT a FROM Apuesta a WHERE a.usuario = :usuario AND " +
           "(LOWER(a.eventoDeportivo.nombreEvento) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.prediccion) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY a.fechaCreacion DESC")
    Page<Apuesta> buscarApuestasPorUsuario(@Param("usuario") Usuario usuario, @Param("query") String query, Pageable pageable);

    /**
     * Obtener apuestas filtradas con criterios dinámicos
     */
    @Query("SELECT a FROM Apuesta a WHERE a.usuario = :usuario " +
           "AND (:estado IS NULL OR a.estado = :estado) " +
           "AND (:tipoApuesta IS NULL OR a.cuotaEvento.tipoResultado = :tipoApuesta) " +
           "AND (:fechaInicio IS NULL OR a.fechaCreacion >= :fechaInicio) " +
           "AND (:fechaFin IS NULL OR a.fechaCreacion <= :fechaFin) " +
           "AND (:montoMin IS NULL OR a.montoApostado >= :montoMin) " +
           "AND (:montoMax IS NULL OR a.montoApostado <= :montoMax) " +
           "AND (:eventoId IS NULL OR a.eventoDeportivo.id = :eventoId) " +
           "AND (:busqueda IS NULL OR LOWER(a.eventoDeportivo.nombreEvento) LIKE LOWER(CONCAT('%', :busqueda, '%'))) " +
           "ORDER BY a.fechaCreacion DESC")
    Page<Apuesta> findApuestasFiltradas(
        @Param("usuario") Usuario usuario,
        @Param("estado") String estado,
        @Param("tipoApuesta") String tipoApuesta,
        @Param("fechaInicio") String fechaInicio,
        @Param("fechaFin") String fechaFin,
        @Param("montoMin") BigDecimal montoMin,
        @Param("montoMax") BigDecimal montoMax,
        @Param("eventoId") Long eventoId,
        @Param("busqueda") String busqueda,
        Pageable pageable
    );

    /**
     * Obtener apuestas pendientes de eventos que ya han finalizado
     */
    @Query("SELECT a FROM Apuesta a WHERE a.estado = 'PENDIENTE' AND a.eventoDeportivo.estado = 'finalizado'")
    List<Apuesta> findPendingBetsForFinishedEvents();

    /**
     * Obtener apuestas recientes por usuario
     */
    List<Apuesta> findByUsuarioAndFechaCreacionAfterOrderByFechaCreacionDesc(
            Usuario usuario, LocalDateTime fecha);

    /**
     * Contar número de apuestas por estado y usuario
     */
    @Query("SELECT COUNT(a) FROM Apuesta a WHERE a.usuario.idUsuario = :usuarioId AND a.estado = :estado")
    Long countByUsuarioAndEstado(@Param("usuarioId") Long usuarioId, @Param("estado") Apuesta.EstadoApuesta estado);

    /**
     * Obtener estadísticas de apuestas por usuario
     */
    @Query("SELECT COUNT(a), SUM(a.montoApostado), SUM(a.montoGanancia) FROM Apuesta a " +
           "WHERE a.usuario.idUsuario = :usuarioId AND a.estado = 'RESUELTA' GROUP BY a.esGanadora")
    List<Object[]> getApuestasEstadisticasByUsuario(@Param("usuarioId") Long usuarioId);

    /**
     * Obtener eventos con más apuestas (top N)
     */
    @Query("SELECT a.eventoDeportivo, COUNT(a) as totalApuestas FROM Apuesta a GROUP BY a.eventoDeportivo ORDER BY totalApuestas DESC")
    List<EventoDeportivo> findEventosConMasApuestas(org.springframework.data.domain.Pageable pageable);

    default List<EventoDeportivo> findEventosConMasApuestas(int limite) {
        return findEventosConMasApuestas(org.springframework.data.domain.PageRequest.of(0, limite));
    }

    List<Apuesta> findByEventoDeportivo(EventoDeportivo evento);
}
