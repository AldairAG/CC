package com.example.cc.service.quiniela;

import com.example.cc.entities.Evento;
import com.example.cc.entities.Quiniela;
import com.example.cc.repository.EventoRepository;
import com.example.cc.repository.QuinielaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class QuinielaServiceImpl implements IQuinielaService {

    @Autowired
    private QuinielaRepository quinielaRepository;

    @Autowired
    private EventoRepository eventoRepository;

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
    public Quiniela save(Quiniela quinielaRequest) {
        // Crear una nueva instancia de Quiniela
        Quiniela quiniela = new Quiniela();
        quiniela.setNombreQuiniela(quinielaRequest.getNombreQuiniela());
        quiniela.setFechaInicio(quinielaRequest.getFechaInicio());
        quiniela.setFechaFin(quinielaRequest.getFechaFin());
        quiniela.setPrecioParticipacion(quinielaRequest.getPrecioParticipacion());
        quiniela.setStrDescripcion(quinielaRequest.getStrDescripcion());
        quiniela.setAllowDoubleBets(quinielaRequest.getAllowDoubleBets());
        quiniela.setAllowTripleBets(quinielaRequest.getAllowTripleBets());
        quiniela.setTipoPremio(quinielaRequest.getTipoPremio());
        quiniela.setTiposApuestas(quinielaRequest.getTiposApuestas());

        // Lista para almacenar los eventos asociados a la quiniela
        List<Evento> eventos = new ArrayList<>();

        // Iterar sobre los IDs de los eventos proporcionados en la solicitud
        quinielaRequest.getEventos().forEach(evento -> {
            // Verificar si el evento ya existe en la base de datos
            Evento eventoNuevo = eventoRepository.findById(evento.getIdEvento()).orElseGet(() -> {
                // Si no existe, crear un nuevo evento
                Evento nuevoEvento = new Evento();
                nuevoEvento.setIdEvento(evento.getIdEvento());
                nuevoEvento.setEquipoLocal(evento.getEquipoLocal());
                nuevoEvento.setEquipoVisitante(evento.getEquipoVisitante());
                nuevoEvento.setFechaPartido(evento.getFechaPartido());
                return eventoRepository.save(nuevoEvento); // Guardar el nuevo evento
            });

            // Agregar el evento (existente o nuevo) a la lista de eventos
            eventos.add(eventoNuevo);
        });

        // Asociar los eventos a la quiniela
        quiniela.setEventos(eventos);

        // Guardar la quiniela con los eventos asociados
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
