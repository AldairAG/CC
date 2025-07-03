package com.example.cc.repository;

import com.example.cc.entities.PrediccionEvento;
import com.example.cc.entities.QuinielaParticipacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrediccionEventoRepository extends JpaRepository<PrediccionEvento, Long> {

    /**
     * Obtener predicciones de una participación
     */
    List<PrediccionEvento> findByParticipacion(QuinielaParticipacion participacion);

    /**
     * Contar predicciones de una participación
     */
    long countByParticipacion(QuinielaParticipacion participacion);

    /**
     * Obtener predicción específica por participación y evento
     */
    Optional<PrediccionEvento> findByParticipacionAndEventoDeportivo_Id(QuinielaParticipacion participacion, Long eventoId);

    /**
     * Obtener predicciones de una participación por ID
     */
    List<PrediccionEvento> findByParticipacion_IdOrderByFechaPrediccionDesc(Long participacionId);

    /**
     * Obtener predicción específica por IDs
     */
    Optional<PrediccionEvento> findByParticipacion_IdAndEventoDeportivo_Id(Long participacionId, Long eventoDeportivoId);

    /**
     * Verificar si existe predicción por IDs
     */
    boolean existsByParticipacion_IdAndEventoDeportivo_Id(Long participacionId, Long eventoDeportivoId);

    /**
     * Obtener predicciones pendientes de resolución
     */
    @Query("SELECT p FROM PrediccionEvento p WHERE p.estado = 'CONFIRMADA' " +
           "AND p.esCorrecto IS NULL AND p.fechaEvento <= :fechaActual")
    List<PrediccionEvento> findPrediccionesPendientesResolucion(@Param("fechaActual") LocalDateTime fechaActual);

    /**
     * Obtener predicciones por evento deportivo
     */
    List<PrediccionEvento> findByEventoDeportivo_IdOrderByFechaPrediccionDesc(Long eventoDeportivoId);

    /**
     * Obtener predicciones correctas de una participación
     */
    @Query("SELECT p FROM PrediccionEvento p WHERE p.participacion.id = :participacionId " +
           "AND p.esCorrecto = true ORDER BY p.puntosObtenidos DESC")
    List<PrediccionEvento> findPrediccionesCorrectasByParticipacion(@Param("participacionId") Long participacionId);

    /**
     * Contar predicciones por tipo
     */
    @Query("SELECT COUNT(p) FROM PrediccionEvento p WHERE p.tipoPrediccion.id = :tipoPrediccionId " +
           "AND p.participacion.quiniela.id = :quinielaId")
    Long countByTipoPrediccionAndQuiniela(@Param("tipoPrediccionId") Long tipoPrediccionId, 
                                        @Param("quinielaId") Long quinielaId);

    /**
     * Obtener predicciones por confidence level
     */
    @Query("SELECT p FROM PrediccionEvento p WHERE p.confidence >= :minConfidence " +
           "AND p.participacion.quiniela.id = :quinielaId ORDER BY p.confidence DESC")
    List<PrediccionEvento> findByConfidenceLevel(@Param("minConfidence") Integer minConfidence,
                                               @Param("quinielaId") Long quinielaId);

    /**
     * Obtener estadísticas de aciertos por usuario
     */
    @Query("SELECT COUNT(p), SUM(CASE WHEN p.esCorrecto = true THEN 1 ELSE 0 END), " +
           "AVG(p.confidence), SUM(p.puntosObtenidos) " +
           "FROM PrediccionEvento p WHERE p.participacion.usuario.idUsuario = :usuarioId")
    Object[] getEstadisticasPrediccionesUsuario(@Param("usuarioId") Long usuarioId);

    /**
     * Obtener predicciones más populares de un evento
     */
    @Query("SELECT p.prediccionTexto, COUNT(p) as total FROM PrediccionEvento p " +
           "WHERE p.eventoDeportivo.id = :eventoDeportivoId " +
           "GROUP BY p.prediccionTexto ORDER BY total DESC")
    List<Object[]> getPrediccionesMasPopulares(@Param("eventoDeportivoId") Long eventoDeportivoId);

    /**
     * Obtener predicciones que vencen pronto
     */
    @Query("SELECT p FROM PrediccionEvento p WHERE p.estado = 'PENDIENTE' " +
           "AND p.fechaEvento BETWEEN :ahora AND :fechaLimite")
    List<PrediccionEvento> findPrediccionesQueVencenPronto(@Param("ahora") LocalDateTime ahora,
                                                          @Param("fechaLimite") LocalDateTime fechaLimite);

    /**
     * Obtener mejores predicciones por puntos
     */
    @Query("SELECT p FROM PrediccionEvento p WHERE p.puntosObtenidos IS NOT NULL " +
           "ORDER BY p.puntosObtenidos DESC")
    List<PrediccionEvento> findMejoresPredicciones();

    /**
     * Contar predicciones por evento y quiniela
     */
    int countByEventoDeportivo_IdAndParticipacion_Quiniela_Id(Long eventoId, Long quinielaId);

    /**
     * Contar predicciones correctas por evento y quiniela
     */
    long countByEventoDeportivo_IdAndParticipacion_Quiniela_IdAndEsCorrecto(Long eventoId, Long quinielaId, Boolean esCorrecto);
}
