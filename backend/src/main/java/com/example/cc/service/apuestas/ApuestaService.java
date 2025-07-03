package com.example.cc.service.apuestas;

import com.example.cc.entities.*;
import com.example.cc.repository.ApuestaRepository;
import com.example.cc.repository.CuotaEventoRepository;
import com.example.cc.repository.EventoDeportivoRepository;
import com.example.cc.repository.UsuarioRepository;
import com.example.cc.service.transacciones.TransaccionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApuestaService {

    private final ApuestaRepository apuestaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoDeportivoRepository eventoRepository;
    private final CuotaEventoRepository cuotaRepository;
    private final TransaccionService transaccionService;

    /**
     * Crear una nueva apuesta
     */
    @Transactional
    public Apuesta crearApuesta(Long usuarioId, Long eventoId, Long cuotaId, BigDecimal montoApostado) {
        // Validar que el usuario existe
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));

        // Validar que el evento existe y está activo
        EventoDeportivo evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + eventoId));

        if (!"programado".equals(evento.getEstado()) && !"en_vivo".equals(evento.getEstado())) {
            throw new RuntimeException("No se puede apostar en un evento que no está activo");
        }

        // Validar que la cuota existe y está activa
        CuotaEvento cuota = cuotaRepository.findById(cuotaId)
                .orElseThrow(() -> new RuntimeException("Cuota no encontrada con ID: " + cuotaId));

        if (!"ACTIVA".equals(cuota.getEstado())) {
            throw new RuntimeException("No se puede apostar con una cuota que no está activa");
        }

        // Validar que el usuario tiene saldo suficiente
        if (usuario.getSaldoUsuario().compareTo(montoApostado) < 0) {
            throw new RuntimeException("Saldo insuficiente para realizar la apuesta");
        }

        // Crear la apuesta
        Apuesta apuesta = new Apuesta();
        apuesta.setUsuario(usuario);
        apuesta.setEventoDeportivo(evento);
        apuesta.setCuotaEvento(cuota);
        apuesta.setPrediccion(cuota.getTipoResultado().toString());
        apuesta.setMontoApostado(montoApostado);
        apuesta.setValorCuotaMomento(cuota.getValorCuota());
        apuesta.setMontoPotencialGanancia(montoApostado.multiply(cuota.getValorCuota()));
        apuesta.setEstado(Apuesta.EstadoApuesta.ACEPTADA);
        apuesta.setDescripcion("Apuesta en " + evento.getNombreEvento() + " - Predicción: " + cuota.getTipoResultado());

        // Descontar el monto apostado del saldo del usuario
        usuario.setSaldoUsuario(usuario.getSaldoUsuario().subtract(montoApostado));
        usuarioRepository.save(usuario);

        // Registrar la transacción
        transaccionService.registrarTransaccion(
                usuario,
                Transaccion.TipoTransaccion.RETIRO,
                montoApostado,
                "Apuesta en evento: " + evento.getNombreEvento(),
                Transaccion.EstadoTransaccion.COMPLETADA
        );

        // Guardar la apuesta
        return apuestaRepository.save(apuesta);
    }

    /**
     * Obtener apuestas de un usuario
     */
    public List<Apuesta> getApuestasByUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        return apuestaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
    }

    /**
     * Obtener apuestas de un usuario con paginación
     */
    public Page<Apuesta> getApuestasByUsuario(Long usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        return apuestaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario, pageable);
    }

    /**
     * Procesar resultado de apuestas para un evento finalizado
     */
    @Transactional
    public void procesarResultadosApuestas(Long eventoId) {
        EventoDeportivo evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + eventoId));

        // Verificar que el evento esté finalizado y tenga resultado
        if (!"finalizado".equals(evento.getEstado()) || evento.getResultado() == null) {
            log.warn("No se pueden procesar apuestas de un evento no finalizado o sin resultado: {}", eventoId);
            return;
        }

        // Obtener todas las apuestas para este evento
        List<Apuesta> apuestas = apuestaRepository.findByEventoDeportivoOrderByFechaCreacionDesc(evento);

        for (Apuesta apuesta : apuestas) {
            if (apuesta.getEstado() == Apuesta.EstadoApuesta.ACEPTADA) {
                // Verificar si la predicción fue correcta
                boolean esGanadora = apuesta.getPrediccion().equals(evento.getResultado());
                apuesta.setEsGanadora(esGanadora);
                apuesta.setEstado(Apuesta.EstadoApuesta.RESUELTA);
                apuesta.setFechaResolucion(LocalDateTime.now());

                // Si es ganadora, calcular y pagar la ganancia
                if (esGanadora) {
                    BigDecimal ganancia = apuesta.getMontoApostado().multiply(apuesta.getValorCuotaMomento());
                    apuesta.setMontoGanancia(ganancia);

                    // Actualizar el saldo del usuario
                    Usuario usuario = apuesta.getUsuario();
                    usuario.setSaldoUsuario(usuario.getSaldoUsuario().add(ganancia));
                    usuarioRepository.save(usuario);

                    // Registrar la transacción
                    transaccionService.registrarTransaccion(
                            usuario,
                            Transaccion.TipoTransaccion.DEPOSITO,
                            ganancia,
                            "Ganancia por apuesta en evento: " + evento.getNombreEvento(),
                            Transaccion.EstadoTransaccion.COMPLETADA
                    );

                    log.info("Apuesta ganadora procesada: {} - Usuario: {} - Ganancia: {}",
                            apuesta.getId(), usuario.getIdUsuario(), ganancia);
                } else {
                    apuesta.setMontoGanancia(BigDecimal.ZERO);
                    log.info("Apuesta perdedora procesada: {} - Usuario: {}",
                            apuesta.getId(), apuesta.getUsuario().getIdUsuario());
                }

                apuestaRepository.save(apuesta);
            }
        }

        log.info("Procesadas {} apuestas para el evento: {}", apuestas.size(), evento.getNombreEvento());
    }

    /**
     * Obtener detalles de una apuesta específica
     */
    public Optional<Apuesta> getApuestaById(Long apuestaId) {
        return apuestaRepository.findById(apuestaId);
    }

    /**
     * Cancelar una apuesta (si aún es posible)
     */
    @Transactional
    public boolean cancelarApuesta(Long apuestaId, Long usuarioId) {
        Apuesta apuesta = apuestaRepository.findById(apuestaId)
                .orElseThrow(() -> new RuntimeException("Apuesta no encontrada con ID: " + apuestaId));

        // Verificar que la apuesta pertenece al usuario
        if (!apuesta.getUsuario().getIdUsuario().equals(usuarioId)) {
            throw new RuntimeException("La apuesta no pertenece al usuario");
        }

        // Verificar que la apuesta puede cancelarse (solo si está pendiente o aceptada y el evento no ha comenzado)
        if (apuesta.getEstado() != Apuesta.EstadoApuesta.PENDIENTE && apuesta.getEstado() != Apuesta.EstadoApuesta.ACEPTADA) {
            throw new RuntimeException("La apuesta no puede cancelarse en su estado actual");
        }

        EventoDeportivo evento = apuesta.getEventoDeportivo();
        if (evento.getFechaEvento().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("No se puede cancelar una apuesta después de que el evento ha comenzado");
        }

        // Cancelar la apuesta y devolver el dinero al usuario
        apuesta.setEstado(Apuesta.EstadoApuesta.CANCELADA);
        apuestaRepository.save(apuesta);

        // Devolver el monto apostado al usuario
        Usuario usuario = apuesta.getUsuario();
        usuario.setSaldoUsuario(usuario.getSaldoUsuario().add(apuesta.getMontoApostado()));
        usuarioRepository.save(usuario);

        // Registrar la transacción de devolución
        transaccionService.registrarTransaccion(
                usuario,
                Transaccion.TipoTransaccion.REEMBOLSO,
                apuesta.getMontoApostado(),
                "Devolución por cancelación de apuesta en evento: " + evento.getNombreEvento(),
                Transaccion.EstadoTransaccion.COMPLETADA
        );

        log.info("Apuesta cancelada: {} - Usuario: {} - Monto devuelto: {}",
                apuestaId, usuarioId, apuesta.getMontoApostado());

        return true;
    }

    /**
     * Procesar apuestas pendientes de eventos finalizados
     * (Método programado para ejecutarse periódicamente)
     */
    @Transactional
    public void procesarApuestasPendientes() {
        List<Apuesta> apuestasPendientes = apuestaRepository.findPendingBetsForFinishedEvents();
        log.info("Procesando {} apuestas pendientes de eventos finalizados", apuestasPendientes.size());

        for (Apuesta apuesta : apuestasPendientes) {
            try {
                procesarResultadosApuestas(apuesta.getEventoDeportivo().getId());
            } catch (Exception e) {
                log.error("Error al procesar apuesta pendiente {}: {}", apuesta.getId(), e.getMessage());
            }
        }
    }
}
