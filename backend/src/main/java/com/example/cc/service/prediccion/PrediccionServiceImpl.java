package com.example.cc.service.prediccion;

import com.example.cc.entities.Prediccion;
import com.example.cc.repository.PrediccionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PrediccionServiceImpl implements IPrediccionService {

    @Autowired
    private PrediccionRepository prediccionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Prediccion> findAll() {
        return prediccionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Prediccion> findById(Long id) {
        return prediccionRepository.findById(id);
    }

    @Override
    @Transactional
    public Prediccion save(Prediccion prediccion) {
        return prediccionRepository.save(prediccion);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        prediccionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prediccion> findByUsuarioQuinielaId(Long usuarioId, Long quinielaId) {
        return prediccionRepository.findByUsuarioQuinielaUsuarioIdUsuarioAndUsuarioQuinielaQuinielaIdQuiniela(
            usuarioId, quinielaId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prediccion> findByEventoId(Long eventoId) {
        return prediccionRepository.findByEventoIdEvento(eventoId);
    }

    @Override
    @Transactional
    public void actualizarAcierto(Long id, Boolean acertada) {
        prediccionRepository.findById(id).ifPresent(prediccion -> {
            prediccion.setAcertada(acertada);
            prediccionRepository.save(prediccion);
        });
    }

}
