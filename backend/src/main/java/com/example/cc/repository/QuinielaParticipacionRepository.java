package com.example.cc.repository;

import com.example.cc.dto.RankingParticipacionDto;
import com.example.cc.entities.Quiniela;
import com.example.cc.entities.QuinielaParticipacion;
import com.example.cc.entities.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuinielaParticipacionRepository extends JpaRepository<QuinielaParticipacion, Long> {

    /**
     * Verificar si un usuario ya participa en una quiniela
     */
    boolean existsByQuiniela_IdAndUsuario_IdUsuario(Long quinielaId, Long usuarioId);

    /**
     * Verificar si un usuario ya participa en una quiniela
     */
    boolean existsByQuinielaAndUsuario(Quiniela quiniela, Usuario usuario);

    /**
     * Obtener participación específica
     */
    Optional<QuinielaParticipacion> findByQuiniela_IdAndUsuario_IdUsuario(Long quinielaId, Long usuarioId);

    /**
     * Obtener todas las participaciones de un usuario
     */
    Page<QuinielaParticipacion> findByUsuario_IdUsuarioOrderByFechaParticipacionDesc(Long usuarioId, Pageable pageable);

    /**
     * Obtener todas las participaciones de un usuario con quiniela cargada
     */
    @Query("SELECT p FROM QuinielaParticipacion p " +
           "JOIN FETCH p.quiniela q " +
           "JOIN FETCH p.usuario u " +
           "WHERE u.idUsuario = :usuarioId " +
           "ORDER BY p.fechaParticipacion DESC")
    List<QuinielaParticipacion> findByUsuarioIdWithQuiniela(@Param("usuarioId") Long usuarioId);

    /**
     * Obtener participación por ID con relaciones cargadas
     */
    @Query("SELECT p FROM QuinielaParticipacion p " +
           "JOIN FETCH p.quiniela q " +
           "LEFT JOIN FETCH q.eventos qe " +
           "LEFT JOIN FETCH qe.eventoDeportivo " +
           "JOIN FETCH p.usuario u " +
           "WHERE p.id = :participacionId")
    Optional<QuinielaParticipacion> findByIdWithRelations(@Param("participacionId") Long participacionId);

    /**
     * Obtener participaciones de una quiniela ordenadas por puntaje
     */
    @Query("SELECT p FROM QuinielaParticipacion p WHERE p.quiniela.id = :quinielaId " +
           "AND p.estado = 'ACTIVA' ORDER BY p.puntuacion DESC, p.fechaParticipacion ASC")
    List<QuinielaParticipacion> findByQuinielaIdOrderByPuntaje(@Param("quinielaId") Long quinielaId);

    /**
     * Obtener participaciones por quiniela y estado
     */
    List<QuinielaParticipacion> findByQuinielaAndEstado(Quiniela quiniela, QuinielaParticipacion.EstadoParticipacion estado);

    /**
     * Obtener participaciones ordenadas por puntuación
     */
    List<QuinielaParticipacion> findByQuinielaOrderByPuntuacionDescAciertosDesc(Quiniela quiniela);

    /**
     * Obtener ranking de participantes en una quiniela
     */
    @Query("SELECT p FROM QuinielaParticipacion p WHERE p.quiniela.id = :quinielaId " +
           "AND p.estado IN ('ACTIVA', 'FINALIZADA') " +
           "ORDER BY p.puntuacion DESC, p.aciertos DESC, p.fechaParticipacion ASC")
    List<QuinielaParticipacion> getRankingQuiniela(@Param("quinielaId") Long quinielaId);

    /**
     * Obtener ranking de una quiniela con información del usuario
     */
    @Query("SELECT new com.example.cc.dto.RankingParticipacionDto(" +
           "p.id, u.perfil.nombre, p.aciertos, p.puntuacion, p.premioGanado, 0) " +
           "FROM QuinielaParticipacion p " +
           "JOIN p.usuario u " +
           "WHERE p.quiniela.id = :quinielaId " +
           "ORDER BY p.puntuacion DESC, p.aciertos DESC")
    List<RankingParticipacionDto> findRankingByQuiniela(@Param("quinielaId") Long quinielaId);

    /**
     * Obtener top N participantes de una quiniela
     */
    @Query("SELECT p FROM QuinielaParticipacion p WHERE p.quiniela.id = :quinielaId " +
           "AND p.estado IN ('ACTIVA', 'FINALIZADA') " +
           "ORDER BY p.puntuacion DESC, p.aciertos DESC, p.fechaParticipacion ASC")
    Page<QuinielaParticipacion> getTopParticipantes(@Param("quinielaId") Long quinielaId, Pageable pageable);

    /**
     * Contar participantes activos en una quiniela
     */
    @Query("SELECT COUNT(p) FROM QuinielaParticipacion p WHERE p.quiniela.id = :quinielaId " +
           "AND p.estado = 'ACTIVA'")
    Long countParticipantesActivos(@Param("quinielaId") Long quinielaId);

    /**
     * Obtener participaciones ganadoras de un usuario
     */
    @Query("SELECT p FROM QuinielaParticipacion p WHERE p.usuario.idUsuario = :usuarioId " +
           "AND p.estado = 'GANADORA' ORDER BY p.fechaParticipacion DESC")
    List<QuinielaParticipacion> findParticipacionesGanadoras(@Param("usuarioId") Long usuarioId);

    /**
     * Calcular total ganado por usuario
     */
    @Query("SELECT COALESCE(SUM(p.premioGanado), 0) FROM QuinielaParticipacion p " +
           "WHERE p.usuario.idUsuario = :usuarioId AND p.premioGanado IS NOT NULL")
    BigDecimal getTotalGanadoPorUsuario(@Param("usuarioId") Long usuarioId);

    /**
     * Obtener participaciones pendientes de pago
     */
    @Query("SELECT p FROM QuinielaParticipacion p WHERE p.pagado = false " +
           "AND p.estado = 'ACTIVA'")
    List<QuinielaParticipacion> findParticipacionesPendientesPago();

    /**
     * Obtener estadísticas de usuario
     */
    @Query("SELECT COUNT(p), AVG(p.puntuacion), MAX(p.puntuacion), " +
           "AVG(CAST(p.aciertos AS double) / NULLIF(p.totalPredicciones, 0) * 100) " +
           "FROM QuinielaParticipacion p WHERE p.usuario.idUsuario = :usuarioId " +
           "AND p.estado IN ('FINALIZADA', 'GANADORA')")
    Object[] getEstadisticasUsuario(@Param("usuarioId") Long usuarioId);

    /**
     * Obtener participaciones por estado
     */
    List<QuinielaParticipacion> findByEstadoOrderByFechaParticipacionDesc(
            QuinielaParticipacion.EstadoParticipacion estado);

    /**
     * Buscar participaciones en quinielas de supervivencia
     */
    @Query("SELECT p FROM QuinielaParticipacion p WHERE p.quiniela.tipoQuiniela = 'SUPERVIVENCIA' " +
           "AND p.estado = 'ACTIVA' AND p.eliminadoEnRonda IS NULL")
    List<QuinielaParticipacion> findParticipantesSupervivenciaActivos();

    /**
     * Obtener mejor posición histórica de un usuario
     */
    @Query("SELECT MIN(p.posicionFinal) FROM QuinielaParticipacion p " +
           "WHERE p.usuario.idUsuario = :usuarioId AND p.posicionFinal IS NOT NULL")
    Optional<Integer> getMejorPosicionUsuario(@Param("usuarioId") Long usuarioId);

    /**
     * Obtener participaciones recientes de un usuario
     */
    @Query("SELECT p FROM QuinielaParticipacion p WHERE p.usuario.idUsuario = :usuarioId " +
           "ORDER BY p.fechaParticipacion DESC")
    Page<QuinielaParticipacion> findParticipacionesRecientes(@Param("usuarioId") Long usuarioId, 
                                                           Pageable pageable);

    /**
     * Contar quinielas ganadas por usuario
     */
    @Query("SELECT COUNT(p) FROM QuinielaParticipacion p WHERE p.usuario.idUsuario = :usuarioId " +
           "AND p.posicionFinal = 1")
    Long countQuinielasGanadas(@Param("usuarioId") Long usuarioId);

    /**
     * Buscar participación por usuario y quiniela
     */
    Optional<QuinielaParticipacion> findByUsuario_IdUsuarioAndQuiniela_Id(Long usuarioId, Long quinielaId);
}
