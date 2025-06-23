package com.example.cc.service.evento;

import com.example.cc.entities.Evento;
import java.util.List;
import java.util.Optional;
import java.sql.Date;

public interface IEventoService {
    List<Evento> findAll();
    Optional<Evento> findById(Long id);
    Evento save(Evento evento);
    void deleteById(Long id);
    List<Evento> findByFechaPartido(Date fecha);
    List<Evento> findByEquipoLocal(String equipo);
    List<Evento> findByEquipoVisitante(String equipo);
    List<Evento> findByQuinielaId(Long quinielaId);
}
