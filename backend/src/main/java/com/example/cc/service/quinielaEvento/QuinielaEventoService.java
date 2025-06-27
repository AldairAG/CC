package com.example.cc.service.quinielaEvento;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.Quiniela;
import com.example.cc.entities.QuinielaEvento;
import com.example.cc.entities.TipoPrediccion;
import com.example.cc.repository.EventoDeportivoRepository;
import com.example.cc.repository.QuinielaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class QuinielaEventoService implements IQuinielaEventoService {

    private final QuinielaRepository quinielaRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;

    /**
     * Agregar eventos a una quiniela
     */
    public void agregarEventosAQuiniela(Long quinielaId, List<Long> eventosIds) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        // Validar que la quiniela esté en estado BORRADOR
        if (quiniela.getEstado() != Quiniela.EstadoQuiniela.BORRADOR) {
            throw new RuntimeException("Solo se pueden agregar eventos a quinielas en estado BORRADOR");
        }

        // Validar que el usuario sea el creador
        // Aquí necesitarías obtener el usuario actual del contexto de seguridad

        for (Long eventoId : eventosIds) {
            EventoDeportivo evento = eventoDeportivoRepository.findById(eventoId)
                    .orElseThrow(() -> new RuntimeException("Evento deportivo no encontrado: " + eventoId));

            // Validar que el evento no haya iniciado
            if (evento.getFechaEvento().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("No se pueden agregar eventos que ya iniciaron");
            }

            // Crear QuinielaEvento
            QuinielaEvento quinielaEvento = new QuinielaEvento();
            quinielaEvento.setQuiniela(quiniela);
            quinielaEvento.setEventoDeportivo(evento);
            quinielaEvento.setPuntosPorAcierto(100); // Puntos por defecto
            quinielaEvento.setMultiplicador(1.0); // Multiplicador por defecto
            quinielaEvento.setEsObligatorio(true);

            // Agregar a la lista de eventos de la quiniela
            if (quiniela.getEventos() == null) {
                quiniela.setEventos(new java.util.ArrayList<>());
            }
            quiniela.getEventos().add(quinielaEvento);
        }

        quinielaRepository.save(quiniela);
        log.info("Agregados {} eventos a la quiniela {}", eventosIds.size(), quinielaId);
    }

    /**
     * Obtener eventos disponibles para quinielas
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> obtenerEventosDisponibles() {
        LocalDateTime fechaMinima = LocalDateTime.now().plusHours(2); // Al menos 2 horas en el futuro
        LocalDateTime fechaMaxima = LocalDateTime.now().plusDays(30); // Máximo 30 días en el futuro

        return eventoDeportivoRepository.findByFechaEventoBetweenAndEstadoOrderByFechaEventoAsc(
                fechaMinima, fechaMaxima, "programado");
    }

    /**
     * Configurar tipo de predicción para un evento de quiniela
     */
    public void configurarTipoPrediccion(Long quinielaId, Long eventoId, TipoPrediccion tipoPrediccion) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        // Buscar el evento en la quiniela
        QuinielaEvento quinielaEvento = quiniela.getEventos().stream()
                .filter(qe -> qe.getEventoDeportivo().getId().equals(eventoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Evento no encontrado en la quiniela"));

        quinielaEvento.setTipoPrediccion(tipoPrediccion);
        quinielaRepository.save(quiniela);
    }
}
