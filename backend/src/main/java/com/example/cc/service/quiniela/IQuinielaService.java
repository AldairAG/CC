package com.example.cc.service.quiniela;

import com.example.cc.entities.Quiniela;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.util.Date;

public interface IQuinielaService {
    List<Quiniela> findAll();
    Optional<Quiniela> findById(Long id);
    Quiniela save(Quiniela quiniela);
    void deleteById(Long id);
    List<Quiniela> findByEstado(String estado);
    List<Quiniela> findByFechaInicioBetween(Date fechaInicio, Date fechaFin);
    List<Quiniela> findByPrecioParticipacionLessThanEqual(Float precio);
    List<Quiniela> findByTipoPremio(String tipoPremio);
    void actualizarPremioAcumulado(Long id, BigDecimal nuevoPremio);
    void actualizarEstado(Long id, String nuevoEstado);
}
