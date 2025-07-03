package com.example.cc.repository;

import com.example.cc.entities.CuotaEvento;
import com.example.cc.entities.EventoDeportivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CuotaEventoRepository extends JpaRepository<CuotaEvento, Long> {

    /**
     * Obtener cuotas por evento deportivo
     */
    List<CuotaEvento> findByEventoDeportivo(EventoDeportivo eventoDeportivo);

    /**
     * Obtener cuotas por evento deportivo y estado
     */
    List<CuotaEvento> findByEventoDeportivoAndEstado(EventoDeportivo eventoDeportivo, String estado);

    /**
     * Obtener cuotas activas por ID de evento deportivo
     */
    @Query("SELECT c FROM CuotaEvento c WHERE c.eventoDeportivo.id = :eventoId AND c.estado = 'ACTIVA'")
    List<CuotaEvento> findActiveByEventoId(@Param("eventoId") Long eventoId);

    /**
     * Buscar cuota específica por evento y tipo resultado
     */
    Optional<CuotaEvento> findByEventoDeportivoAndTipoResultado(EventoDeportivo eventoDeportivo, CuotaEvento.TipoResultado tipoResultado);

    /**
     * Actualizar estado de cuotas por evento deportivo
     */
    @Query("UPDATE CuotaEvento c SET c.estado = :estado WHERE c.eventoDeportivo.id = :eventoId")
    void updateEstadoByEventoId(@Param("eventoId") Long eventoId, @Param("estado") String estado);
}
