package com.example.cc.repository;

import com.example.cc.entities.Quiniela;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Repository
public interface QuinielaRepository extends JpaRepository<Quiniela, Long> {
    List<Quiniela> findByEstado(String estado);
    List<Quiniela> findByFechaInicioBetween(Date fechaInicio, Date fechaFin);
    List<Quiniela> findByPrecioParticipacionLessThanEqual(Float precio);
    List<Quiniela> findByTipoPremio(String tipoPremio);
    List<Quiniela> findByNombreQuinielaContainingIgnoreCase(String nombre);
    List<Quiniela> findByNumeroParticipantesGreaterThanEqual(Integer minParticipantes);
    List<Quiniela> findByPremioAcumuladoBetween(BigDecimal minPremio, BigDecimal maxPremio);
    List<Quiniela> findByTiposApuestasContaining(String tipoApuesta);
}
