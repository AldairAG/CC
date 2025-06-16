package com.example.cc.service.evento;

import com.example.cc.entities.Evento;
import com.example.cc.repository.EventoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EventoServiceImpl implements IEventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Evento> findById(Long id) {
        return eventoRepository.findById(id);
    }

    @Override
    @Transactional
    public Evento save(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        eventoRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Evento> findByFechaPartido(Date fecha) {
        return eventoRepository.findByFechaPartido(fecha);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Evento> findByEquipoLocal(String equipo) {
        return eventoRepository.findByEquipoLocal(equipo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Evento> findByEquipoVisitante(String equipo) {
        return eventoRepository.findByEquipoVisitante(equipo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Evento> findByQuinielaId(Long quinielaId) {
        return eventoRepository.findByQuinielasIdQuiniela(quinielaId);
    }
}