package com.example.cc.repository;

import com.example.cc.entities.Transaccion;
import com.example.cc.entities.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
    List<Transaccion> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);
    Page<Transaccion> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario, Pageable pageable);
    
    List<Transaccion> findByUsuarioAndTipo(Usuario usuario, Transaccion.TipoTransaccion tipo);
    List<Transaccion> findByUsuarioAndEstado(Usuario usuario, Transaccion.EstadoTransaccion estado);
    
    List<Transaccion> findByUsuarioAndFechaCreacionBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fin);
    
    @Query("SELECT SUM(t.monto) FROM Transaccion t WHERE t.usuario = ?1 AND t.tipo = ?2 AND t.estado = ?3")
    Optional<BigDecimal> sumMontoByUsuarioAndTipoAndEstado(Usuario usuario, Transaccion.TipoTransaccion tipo, Transaccion.EstadoTransaccion estado);
    
    @Query("SELECT COUNT(t) FROM Transaccion t WHERE t.usuario = ?1 AND t.tipo = ?2")
    Long countByUsuarioAndTipo(Usuario usuario, Transaccion.TipoTransaccion tipo);
}
