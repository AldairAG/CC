package com.example.cc.service.prediccion;

import com.example.cc.entities.Prediccion;
import java.util.List;
import java.util.Optional;

public interface IPrediccionService {
    List<Prediccion> findAll();
    Optional<Prediccion> findById(Long id);
    Prediccion save(Prediccion prediccion);
    void deleteById(Long id);
    List<Prediccion> findByUsuarioQuinielaId(Long usuarioId, Long quinielaId);
    List<Prediccion> findByEventoId(Long eventoId);
    void actualizarAcierto(Long id, Boolean acertada);
}
