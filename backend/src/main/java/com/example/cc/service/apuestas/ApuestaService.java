package com.example.cc.service.apuestas;

import com.example.cc.dto.apuestas.EstadisticasApuestaDTO;
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
import java.util.Map;
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
     * Obtener eventos con más apuestas (limitados por parámetro)
     */
    public List<EventoDeportivo> obtenerEventosConMasApuestas(int limite) {
        List<EventoDeportivo> resultados = apuestaRepository.findEventosConMasApuestas(limite);
        return resultados;
    }

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
                Transaccion.EstadoTransaccion.COMPLETADA);

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
                            Transaccion.EstadoTransaccion.COMPLETADA);

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

        // Verificar que la apuesta puede cancelarse (solo si está pendiente o aceptada
        // y el evento no ha comenzado)
        if (apuesta.getEstado() != Apuesta.EstadoApuesta.PENDIENTE
                && apuesta.getEstado() != Apuesta.EstadoApuesta.ACEPTADA) {
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
                Transaccion.EstadoTransaccion.COMPLETADA);

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

    public EstadisticasApuestaDTO obtenerEstadisticasApuestasUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));

        List<Apuesta> apuestas = apuestaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);

        int totalApuestas = apuestas.size();
        int apuestasGanadas = 0;
        int apuestasPerdidas = 0;
        int apuestasPendientes = 0;
        BigDecimal montoTotalApostado = BigDecimal.ZERO;
        BigDecimal gananciaTotal = BigDecimal.ZERO;

        for (Apuesta apuesta : apuestas) {
            montoTotalApostado = montoTotalApostado.add(apuesta.getMontoApostado());
            if (Boolean.TRUE.equals(apuesta.getEsGanadora())) {
                apuestasGanadas++;
                gananciaTotal = gananciaTotal.add(apuesta.getMontoGanancia() != null ? apuesta.getMontoGanancia() : BigDecimal.ZERO);
            } else if (apuesta.getEstado() == Apuesta.EstadoApuesta.RESUELTA) {
                apuestasPerdidas++;
            } else if (apuesta.getEstado() == Apuesta.EstadoApuesta.PENDIENTE) {
                apuestasPendientes++;
            }
        }

        double rentabilidad = montoTotalApostado.compareTo(BigDecimal.ZERO) > 0
            ? gananciaTotal.divide(montoTotalApostado, 4, BigDecimal.ROUND_HALF_UP).doubleValue()
            : 0.0;

        EstadisticasApuestaDTO estadisticas = new EstadisticasApuestaDTO();
        estadisticas.setTotalApuestas(totalApuestas);
        estadisticas.setMontoTotalApostado(montoTotalApostado);
        estadisticas.setApuestasGanadas(apuestasGanadas);
        estadisticas.setApuestasPerdidas(apuestasPerdidas);
        estadisticas.setApuestasPendientes(apuestasPendientes);
        estadisticas.setGananciaTotal(gananciaTotal);
        estadisticas.setRentabilidad(rentabilidad);

        return estadisticas;
    }

    /**
     * Obtener apuestas activas del usuario
     */
    public Page<Apuesta> getApuestasActivas(Long usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        return apuestaRepository.findApuestasActivas(usuario, pageable);
    }

    /**
     * Obtener historial de apuestas del usuario
     */
    public Page<Apuesta> getHistorialApuestas(Long usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        return apuestaRepository.findApuestasHistorial(usuario, pageable);
    }

    /**
     * Obtener apuestas recientes del usuario
     */
    public List<Apuesta> getApuestasRecientes(Long usuarioId, int limite) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        
        LocalDateTime desde = LocalDateTime.now().minusDays(30); // Últimos 30 días
        List<Apuesta> apuestas = apuestaRepository.findByUsuarioAndFechaCreacionAfterOrderByFechaCreacionDesc(usuario, desde);
        
        return apuestas.stream().limit(limite).toList();
    }

    /**
     * Obtener apuestas recientes del usuario como DTO
     */
    public List<com.example.cc.dto.apuesta.ResumenApuestaDTO> getApuestasRecientesDTO(Long usuarioId, int limite) {
        List<Apuesta> apuestas = getApuestasRecientes(usuarioId, limite);
        
        return apuestas.stream().map(this::convertirAResumenDTO).toList();
    }

    /**
     * Convertir Apuesta a ResumenApuestaDTO
     */
    private com.example.cc.dto.apuesta.ResumenApuestaDTO convertirAResumenDTO(Apuesta apuesta) {
        return new com.example.cc.dto.apuesta.ResumenApuestaDTO(
            apuesta.getId(),
            apuesta.getEventoDeportivo().getNombreEvento(),
            apuesta.getPrediccion(),
            apuesta.getMontoApostado(),
            apuesta.getEstado().toString(),
            apuesta.getFechaCreacion(),
            apuesta.getValorCuotaMomento(),
            apuesta.getEsGanadora(),
            apuesta.getMontoGanancia()
        );
    }

    /**
     * Convertir Page<Apuesta> a ApuestasPageResponseDTO
     */
    public com.example.cc.dto.apuesta.ApuestasPageResponseDTO convertirAPageResponseDTO(Page<Apuesta> page) {
        List<com.example.cc.dto.apuesta.ApuestaResponseDTO> content = page.getContent().stream()
            .map(apuesta -> {
                return com.example.cc.dto.apuesta.ApuestaResponseDTO.builder()
                    .id(apuesta.getId())
                    .usuarioId(apuesta.getUsuario().getIdUsuario())
                    .eventoId(apuesta.getEventoDeportivo().getId())
                    .eventoNombre(apuesta.getEventoDeportivo().getNombreEvento())
                    .equipoLocal(apuesta.getEventoDeportivo().getEquipoLocal())
                    .equipoVisitante(apuesta.getEventoDeportivo().getEquipoVisitante())
                    .cuotaId(apuesta.getCuotaEvento().getId())
                    .tipoApuesta(apuesta.getCuotaEvento().getTipoResultado().toString())
                    .prediccion(apuesta.getPrediccion())
                    .montoApostado(apuesta.getMontoApostado())
                    .valorCuotaMomento(apuesta.getValorCuotaMomento())
                    .montoPotencialGanancia(apuesta.getMontoPotencialGanancia())
                    .montoGanancia(apuesta.getMontoGanancia())
                    .estado(apuesta.getEstado().toString())
                    .esGanadora(apuesta.getEsGanadora())
                    .fechaCreacion(apuesta.getFechaCreacion())
                    .fechaResolucion(apuesta.getFechaResolucion())
                    .fechaActualizacion(apuesta.getFechaActualizacion())
                    .descripcion(apuesta.getDescripcion())
                    .build();
            })
            .toList();

        return new com.example.cc.dto.apuesta.ApuestasPageResponseDTO(
            content,
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isFirst(),
            page.isLast(),
            page.isEmpty()
        );
    }

    /**
     * Obtener apuestas por estado
     */
    public Page<Apuesta> getApuestasPorEstado(Long usuarioId, String estado, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        
        Apuesta.EstadoApuesta estadoApuesta;
        try {
            estadoApuesta = Apuesta.EstadoApuesta.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado de apuesta inválido: " + estado);
        }
        
        return apuestaRepository.findByUsuarioAndEstadoOrderByFechaCreacionDesc(usuario, estadoApuesta, pageable);
    }

    /**
     * Obtener apuestas por evento
     */
    public Page<Apuesta> getApuestasPorEvento(Long usuarioId, Long eventoId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        
        EventoDeportivo evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + eventoId));
        
        return apuestaRepository.findByUsuarioAndEventoDeportivoOrderByFechaCreacionDesc(usuario, evento, pageable);
    }

    /**
     * Verificar si una apuesta es válida
     */
    public boolean verificarApuestaValida(Long usuarioId, Long eventoId, Long cuotaId, BigDecimal monto) {
        try {
            // Validar usuario
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElse(null);
            if (usuario == null) return false;

            // Validar evento
            EventoDeportivo evento = eventoRepository.findById(eventoId)
                    .orElse(null);
            if (evento == null || (!"programado".equals(evento.getEstado()) && !"en_vivo".equals(evento.getEstado()))) {
                return false;
            }

            // Validar cuota
            CuotaEvento cuota = cuotaRepository.findById(cuotaId)
                    .orElse(null);
            if (cuota == null || !"ACTIVA".equals(cuota.getEstado())) {
                return false;
            }

            // Validar monto
            if (monto.compareTo(BigDecimal.valueOf(10)) < 0 || monto.compareTo(BigDecimal.valueOf(10000)) > 0) {
                return false;
            }

            // Validar saldo
            if (usuario.getSaldoUsuario().compareTo(monto) < 0) {
                return false;
            }

            return true;
        } catch (Exception e) {
            log.error("Error al verificar apuesta válida: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Obtener límites de apuesta del usuario
     */
    public Map<String, Object> getLimitesApuesta(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));

        return Map.of(
            "minimo", 10.00,
            "maximo", 10000.00,
            "disponible", usuario.getSaldoUsuario()
        );
    }

    /**
     * Buscar apuestas del usuario
     */
    public Page<Apuesta> buscarApuestas(Long usuarioId, String query, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        
        return apuestaRepository.buscarApuestasPorUsuario(usuario, query, pageable);
    }

    /**
     * Obtener apuestas filtradas del usuario
     */
    public Page<Apuesta> getApuestasFiltradas(
            Long usuarioId, String estado, String tipoApuesta, String fechaInicio, String fechaFin,
            BigDecimal montoMin, BigDecimal montoMax, Long eventoId, String busqueda, Pageable pageable) {
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        
        return apuestaRepository.findApuestasFiltradas(
            usuario, estado, tipoApuesta, fechaInicio, fechaFin,
            montoMin, montoMax, eventoId, busqueda, pageable);
    }
}
