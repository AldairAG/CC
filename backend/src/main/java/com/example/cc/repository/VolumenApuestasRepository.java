package com.example.cc.repository;

import com.example.cc.entities.VolumenApuestas;
import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.TipoResultado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolumenApuestasRepository extends JpaRepository<VolumenApuestas, Long> {

    /**
     * Obtener volumen de apuestas para un evento específico
     */
    @Query("SELECT va FROM VolumenApuestas va WHERE va.eventoDeportivo.id = :eventoId")
    List<VolumenApuestas> findByEventoDeportivoId(@Param("eventoId") Long eventoId);

    /**
     * Obtener volumen para un evento y tipo de resultado específico
     */
    @Query("SELECT va FROM VolumenApuestas va WHERE va.eventoDeportivo.id = :eventoId AND va.tipoResultado = :tipoResultado")
    Optional<VolumenApuestas> findByEventoDeportivoIdAndTipoResultado(@Param("eventoId") Long eventoId, @Param("tipoResultado") TipoResultado tipoResultado);

    /**
     * Obtener distribución de apuestas para un evento (todos los tipos)
     */
    @Query("SELECT va.tipoResultado, va.numeroApuestas, va.totalApostado, va.porcentajeDistribucion " +
           "FROM VolumenApuestas va WHERE va.eventoDeportivo.id = :eventoId " +
           "ORDER BY va.totalApostado DESC")
    List<Object[]> getDistribucionApuestasPorEvento(@Param("eventoId") Long eventoId);

    /**
     * Obtener eventos con mayor volumen de apuestas
     */
    @Query("SELECT va.eventoDeportivo.id, SUM(va.numeroApuestas), SUM(va.totalApostado) " +
           "FROM VolumenApuestas va " +
           "GROUP BY va.eventoDeportivo.id " +
           "ORDER BY SUM(va.totalApostado) DESC")
    List<Object[]> getEventosConMayorVolumen();

    /**
     * Obtener tendencias de apuestas (eventos con tendencia específica)
     */
    @Query("SELECT va FROM VolumenApuestas va WHERE va.tendenciaReciente = :tendencia ORDER BY va.totalApostado DESC")
    List<VolumenApuestas> findByTendenciaReciente(@Param("tendencia") String tendencia);

    /**
     * Calcular estadísticas globales de volumen
     */
    @Query("SELECT COUNT(va), SUM(va.numeroApuestas), SUM(va.totalApostado), AVG(va.apuestaPromedio) FROM VolumenApuestas va")
    Object[] getEstadisticasGlobales();

    /**
     * Obtener volúmenes que requieren ajuste de cuotas (alta concentración)
     */
    @Query("SELECT va FROM VolumenApuestas va WHERE va.porcentajeDistribucion >= :porcentajeMinimo ORDER BY va.porcentajeDistribucion DESC")
    List<VolumenApuestas> findVolumenesParaAjuste(@Param("porcentajeMinimo") Double porcentajeMinimo);

    /**
     * Limpiar volúmenes de eventos finalizados (para mantenimiento)
     */
    @Query("DELETE FROM VolumenApuestas va WHERE va.eventoDeportivo.estado = 'finalizado'")
    void limpiarVolumenesEventosFinalizados();
}
