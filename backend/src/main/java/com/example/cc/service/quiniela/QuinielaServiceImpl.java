package com.example.cc.service.quiniela;

import com.example.cc.entities.Quiniela;
import com.example.cc.repository.QuinielaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class QuinielaServiceImpl implements IQuinielaService {

    @Autowired
    private QuinielaRepository quinielaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Quiniela> findAll() {
        return quinielaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Quiniela> findById(Long id) {
        return quinielaRepository.findById(id);
    }

    @Override
    @Transactional
    public Quiniela save(Quiniela quiniela) {
        return quinielaRepository.save(quiniela);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        quinielaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Quiniela> findByEstado(String estado) {
        return quinielaRepository.findByEstado(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Quiniela> findByFechaInicioBetween(Date fechaInicio, Date fechaFin) {
        return quinielaRepository.findByFechaInicioBetween(fechaInicio, fechaFin);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Quiniela> findByPrecioParticipacionLessThanEqual(Float precio) {
        return quinielaRepository.findByPrecioParticipacionLessThanEqual(precio);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Quiniela> findByTipoPremio(String tipoPremio) {
        return quinielaRepository.findByTipoPremio(tipoPremio);
    }

    @Override
    @Transactional
    public void actualizarPremioAcumulado(Long id, BigDecimal nuevoPremio) {
        quinielaRepository.findById(id).ifPresent(quiniela -> {
            quiniela.setPremioAcumulado(nuevoPremio);
            quinielaRepository.save(quiniela);
        });
    }

    @Override
    @Transactional
    public void actualizarEstado(Long id, String nuevoEstado) {
        quinielaRepository.findById(id).ifPresent(quiniela -> {
            quiniela.setEstado(nuevoEstado);
            quinielaRepository.save(quiniela);
        });
    }
}
