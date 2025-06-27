package com.example.cc.repository;

import com.example.cc.entities.Quiniela;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuinielaRepository extends JpaRepository<Quiniela, Long> {

    /**
     * Buscar quiniela por código único
     */
    Optional<Quiniela> findByCodigoUnico(String codigoUnico);

    /**
     * Verificar si existe una quiniela con el código único
     */
    boolean existsByCodigoUnico(String codigoUnico);

    /**
     * Obtener quinielas por estado
     */
    List<Quiniela> findByEstadoOrderByFechaCreacionDesc(Quiniela.EstadoQuiniela estado);

    /**
     * Obtener quinielas públicas activas
     */
    @Query("SELECT q FROM Quiniela q WHERE q.esPublica = true AND q.estado = :estado ORDER BY q.fechaCreacion DESC")
    List<Quiniela> findQuinielasPublicasActivas(@Param("estado") Quiniela.EstadoQuiniela estado);

    /**
     * Obtener quinielas por creador
     */
    Page<Quiniela> findByCreadorIdOrderByFechaCreacionDesc(Long creadorId, Pageable pageable);

    /**
     * Obtener quinielas por tipo
     */
    List<Quiniela> findByTipoQuinielaAndEstadoOrderByFechaCreacionDesc(
            Quiniela.TipoQuiniela tipoQuiniela,
            Quiniela.EstadoQuiniela estado);

    /**
     * Obtener quinielas disponibles para participar
     */
    @Query("SELECT q FROM Quiniela q WHERE q.estado = 'ACTIVA' AND q.fechaCierre > :fechaActual " +
            "AND (q.maxParticipantes IS NULL OR q.participantesActuales < q.maxParticipantes) " +
            "AND q.esPublica = true ORDER BY q.fechaInicio ASC")
    List<Quiniela> findQuinielasDisponibles(@Param("fechaActual") LocalDateTime fechaActual);

    /**
     * Obtener quinielas por rango de fechas
     */
    @Query("SELECT q FROM Quiniela q WHERE q.fechaInicio BETWEEN :fechaInicio AND :fechaFin " +
            "ORDER BY q.fechaInicio ASC")
    List<Quiniela> findByFechaInicioBetween(@Param("fechaInicio") LocalDateTime fechaInicio,
                                            @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Obtener quinielas que necesitan resolución
     */
    @Query("SELECT q FROM Quiniela q WHERE q.estado = 'CERRADA' AND q.fechaResultados <= :fechaActual")
    List<Quiniela> findQuinielasParaResolver(@Param("fechaActual") LocalDateTime fechaActual);

    /**
     * Obtener quinielas por pool mínimo
     */
    @Query("SELECT q FROM Quiniela q WHERE q.poolActual >= :poolMinimo AND q.estado = :estado " +
            "ORDER BY q.poolActual DESC")
    List<Quiniela> findByPoolMinimoAndEstado(@Param("poolMinimo") java.math.BigDecimal poolMinimo,
                                             @Param("estado") Quiniela.EstadoQuiniela estado);

    /**
     * Buscar quinielas por texto en nombre o descripción
     */
    @Query("SELECT q FROM Quiniela q WHERE (LOWER(q.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) " +
            "OR LOWER(q.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))) " +
            "AND q.esPublica = true AND q.estado = :estado " +
            "ORDER BY q.fechaCreacion DESC")
    List<Quiniela> buscarPorTexto(@Param("texto") String texto,
                                  @Param("estado") Quiniela.EstadoQuiniela estado);

    /**
     * Obtener estadísticas de quinielas por creador
     */
    @Query("SELECT COUNT(q), SUM(q.poolActual), AVG(q.participantesActuales) FROM Quiniela q " +
            "WHERE q.creadorId = :creadorId AND q.estado = 'FINALIZADA'")
    Object[] getEstadisticasCreador(@Param("creadorId") Long creadorId);

    /**
     * Obtener quinielas que expiran pronto (para notificaciones)
     */
    @Query("SELECT q FROM Quiniela q WHERE q.fechaCierre BETWEEN :ahora AND :fechaLimite " +
            "AND q.estado = 'ACTIVA'")
    List<Quiniela> findQuinielasQueExpiranPronto(@Param("ahora") LocalDateTime ahora,
                                                 @Param("fechaLimite") LocalDateTime fechaLimite);

    /**
     * Contar participantes únicos en quinielas del creador
     */
    @Query("SELECT COUNT(DISTINCT p.usuario.idUsuario) FROM QuinielaParticipacion p " +
           "WHERE p.quiniela.creadorId = :creadorId")
    Long countParticipantesUnicosCreador(@Param("creadorId") Long creadorId);

    /**
     * Obtener quinielas por estado
     */
    List<Quiniela> findByEstado(Quiniela.EstadoQuiniela estado);

    /**
     * Obtener quinielas activas y públicas
     */
    Page<Quiniela> findByEstadoAndEsPublica(Quiniela.EstadoQuiniela estado, Boolean esPublica, Pageable pageable);

    /**
     * Obtener quinielas que deben cerrarse
     */
    List<Quiniela> findByEstadoAndFechaCierreBefore(Quiniela.EstadoQuiniela estado, LocalDateTime fecha);

    /**
     * Obtener quinielas antiguas para limpiar
     */
    List<Quiniela> findByEstadoAndFechaCreacionBefore(Quiniela.EstadoQuiniela estado, LocalDateTime fecha);

    /**
     * Obtener quinielas próximas a cerrar
     */
    List<Quiniela> findByEstadoAndFechaCierreBetween(Quiniela.EstadoQuiniela estado,
                                                     LocalDateTime fechaInicio,
                                                     LocalDateTime fechaFin);
}
