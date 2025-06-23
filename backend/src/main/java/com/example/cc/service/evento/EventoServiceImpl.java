package com.example.cc.service.evento;

import com.example.cc.entities.Evento;
import com.example.cc.repository.EventoRepository;
import com.example.cc.service.thesportsdb.TheSportsDbService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventoServiceImpl implements IEventoService {

    @Autowired
    private EventoRepository eventoRepository;
    
    @Autowired
    private TheSportsDbService theSportsDbService;

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

    @Override
    @Transactional
    public Optional<Evento> buscarOCrearEvento(String equipoLocal, String equipoVisitante) {
        // Primero buscar en la base de datos local
        List<Evento> eventosExistentes = eventoRepository.findByEquipoLocalAndEquipoVisitante(
            equipoLocal, equipoVisitante);
        
        if (!eventosExistentes.isEmpty()) {
            return Optional.of(eventosExistentes.get(0));
        }
        
        // Si no existe localmente, buscar en TheSportsDB
        Optional<Evento> eventoExterno = theSportsDbService.buscarEventoPorEquipos(equipoLocal, equipoVisitante);
        
        if (eventoExterno.isPresent()) {
            // Guardar el evento encontrado en la base de datos
            Evento eventoGuardado = eventoRepository.save(eventoExterno.get());
            return Optional.of(eventoGuardado);
        }
        
        return Optional.empty();
    }

    @Override
    @Transactional
    public List<Evento> sincronizarEventosPorFecha(LocalDate fecha) {
        // Obtener eventos de TheSportsDB para la fecha
        List<Evento> eventosExternos = theSportsDbService.buscarEventosPorFecha(fecha);
        
        // Filtrar eventos que ya existen en la base de datos
        List<Evento> eventosNuevos = eventosExternos.stream()
            .filter(evento -> !existeEventoPorIdExterno(evento.getIdExterno()))
            .toList();
        
        // Guardar eventos nuevos
        if (!eventosNuevos.isEmpty()) {
            return eventoRepository.saveAll(eventosNuevos);
        }
        
        return List.of();
    }

    private boolean existeEventoPorIdExterno(String idExterno) {
        if (idExterno == null) return false;
        return eventoRepository.findByIdExterno(idExterno).isPresent();
    }

    @Override
    @Transactional
    public Optional<Evento> buscarOCrearEventoPorIdExterno(String idEventoExterno) {
        // Primero buscar en la base de datos local por ID externo
        Optional<Evento> eventoExistente = eventoRepository.findByIdExterno(idEventoExterno);
        
        if (eventoExistente.isPresent()) {
            return eventoExistente;
        }
        
        // Si no existe localmente, buscar en TheSportsDB
        Optional<Evento> eventoExterno = theSportsDbService.buscarEventoPorIdExterno(idEventoExterno);
        
        if (eventoExterno.isPresent()) {
            // Guardar el evento encontrado en la base de datos
            Evento eventoGuardado = eventoRepository.save(eventoExterno.get());
            return Optional.of(eventoGuardado);
        }
        
        return Optional.empty();
    }
}