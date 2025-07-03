package com.example.cc.repository;

import com.example.cc.entities.CuotaHistorial;
import com.example.cc.entities.TipoResultado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CuotaHistorialRepository extends JpaRepository<CuotaHistorial, Long> {

    /**
     * Obtener historial de cuotas para un evento específico
     */
    @Query("SELECT ch FROM CuotaHistorial ch WHERE ch.eventoDeportivo.id = :eventoId ORDER BY ch.fechaCambio DESC")
    List<CuotaHistorial> findByEventoDeportivoIdOrderByFechaCambioDesc(@Param("eventoId") Long eventoId);

    /**
     * Obtener historial de cuotas para un tipo de resultado específico
     */
    @Query("SELECT ch FROM CuotaHistorial ch WHERE ch.eventoDeportivo.id = :eventoId AND ch.tipoResultado = :tipoResultado ORDER BY ch.fechaCambio DESC")
    List<CuotaHistorial> findByEventoAndTipoResultadoOrderByFechaCambioDesc(
        @Param("eventoId") Long eventoId, 
        @Param("tipoResultado") TipoResultado tipoResultado
    );

    /**
     * Obtener último cambio de cuota para un evento y tipo
     */
    @Query("SELECT ch FROM CuotaHistorial ch WHERE ch.eventoDeportivo.id = :eventoId AND ch.tipoResultado = :tipoResultado ORDER BY ch.fechaCambio DESC LIMIT 1")
    CuotaHistorial findLastChangeByEventoAndTipo(@Param("eventoId") Long eventoId, @Param("tipoResultado") TipoResultado tipoResultado);

    /**
     * Obtener cambios de cuotas en un rango de fechas
     */
    @Query("SELECT ch FROM CuotaHistorial ch WHERE ch.fechaCambio BETWEEN :fechaInicio AND :fechaFin ORDER BY ch.fechaCambio DESC")
    List<CuotaHistorial> findByFechaCambioBetween(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Obtener cambios de cuotas por razón específica
     */
    @Query("SELECT ch FROM CuotaHistorial ch WHERE ch.razonCambio = :razon ORDER BY ch.fechaCambio DESC")
    List<CuotaHistorial> findByRazonCambio(@Param("razon") CuotaHistorial.RazonCambioCuota razon);

    /**
     * Obtener cambios significativos (por encima de un porcentaje)
     */
    @Query("SELECT ch FROM CuotaHistorial ch WHERE ABS(ch.porcentajeCambio) >= :porcentajeMinimo ORDER BY ch.fechaCambio DESC")
    List<CuotaHistorial> findCambiosSignificativos(@Param("porcentajeMinimo") Double porcentajeMinimo);

    /**
     * Estadísticas de cambios por evento
     */
    @Query("SELECT ch.eventoDeportivo.id, COUNT(ch), AVG(ABS(ch.porcentajeCambio)), MAX(ABS(ch.porcentajeCambio)) " +
           "FROM CuotaHistorial ch " +
           "WHERE ch.eventoDeportivo.id = :eventoId " +
           "GROUP BY ch.eventoDeportivo.id")
    Object[] getEstadisticasCambiosPorEvento(@Param("eventoId") Long eventoId);

    /**
     * Obtener tendencia de cuotas (últimos N cambios)
     */
    @Query("SELECT ch FROM CuotaHistorial ch WHERE ch.eventoDeportivo.id = :eventoId AND ch.tipoResultado = :tipoResultado ORDER BY ch.fechaCambio DESC LIMIT :limite")
    List<CuotaHistorial> findTendenciaReciente(@Param("eventoId") Long eventoId, @Param("tipoResultado") TipoResultado tipoResultado, @Param("limite") int limite);
}
