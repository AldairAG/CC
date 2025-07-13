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
}
