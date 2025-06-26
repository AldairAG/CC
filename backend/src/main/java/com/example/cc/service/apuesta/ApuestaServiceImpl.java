package com.example.cc.service.apuesta;

import com.example.cc.dto.request.CrearApuestaRequest;
import com.example.cc.dto.response.ApuestaResponse;
import com.example.cc.dto.response.EstadisticasApuestaResponse;
import com.example.cc.dto.response.TheSportsDbEventResponse;
import com.example.cc.entities.Apuesta;
import com.example.cc.entities.Usuario;
import com.example.cc.entities.Evento;
import com.example.cc.entities.enums.EstadoApuesta;
import com.example.cc.entities.enums.TipoApuesta;
import com.example.cc.repository.ApuestaRepository;
import com.example.cc.repository.UsuarioRepository;
import com.example.cc.repository.EventoRepository;
import com.example.cc.service.thesportsdb.ITheSportsDbService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ApuestaServiceImpl implements ApuestaService {
    private final ApuestaRepository apuestaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;

    @Autowired
    private ITheSportsDbService apiBaseDatos;

    // Constantes para validaciones
    private static final BigDecimal APUESTA_MINIMA = new BigDecimal("1.00");
    private static final BigDecimal APUESTA_MAXIMA = new BigDecimal("10000.00");
    private static final BigDecimal LIMITE_DIARIO = new BigDecimal("50000.00");

    @Override
    public ApuestaResponse crearApuesta(CrearApuestaRequest request, Long idUsuario) {
        log.info("Creando apuesta para usuario {} en evento {}", idUsuario, request.getIdEvento());

        // Validar usuario
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Buscar o crear evento
        Evento evento = buscarOCrearEvento(request);

        // Validaciones de negocio
        validarCreacionApuesta(usuario, evento, request);

        // Crear la apuesta
        Apuesta apuesta = new Apuesta();
        apuesta.setUsuario(usuario);
        apuesta.setEvento(evento);
        apuesta.setTipoApuesta(request.getTipoApuesta());
        apuesta.setMontoApuesta(request.getMontoApuesta());
        apuesta.setCuotaApuesta(request.getCuotaApuesta());
        apuesta.setPrediccionUsuario(request.getPrediccionUsuario());
        apuesta.setDetalleApuesta(request.getDetalleApuesta());
        apuesta.calcularGananciaPotencial();

        // Descontar saldo del usuario
        BigDecimal nuevoSaldo = usuario.getSaldoUsuario().subtract(request.getMontoApuesta());
        usuario.setSaldoUsuario(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Guardar apuesta
        Apuesta apuestaGuardada = apuestaRepository.save(apuesta);

        log.info("Apuesta creada exitosamente con ID: {}", apuestaGuardada.getIdApuesta());
        return convertirAApuestaResponse(apuestaGuardada);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ApuestaResponse> obtenerApuestaPorId(Long idApuesta, Long idUsuario) {
        return apuestaRepository.findById(idApuesta)
                .filter(apuesta -> apuesta.getUsuario().getIdUsuario().equals(idUsuario))
                .map(this::convertirAApuestaResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApuestaResponse> obtenerApuestasPorUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return apuestaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario)
                .stream()
                .map(this::convertirAApuestaResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApuestaResponse> obtenerApuestasPorUsuarioPaginado(Long idUsuario, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return apuestaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario, pageable)
                .map(this::convertirAApuestaResponse);
    }

    @Override
    public boolean cancelarApuesta(Long idApuesta, Long idUsuario, String motivo) {
        Optional<Apuesta> apuestaOpt = apuestaRepository.findById(idApuesta);

        if (apuestaOpt.isEmpty()) {
            return false;
        }

        Apuesta apuesta = apuestaOpt.get();

        // Verificar que la apuesta pertenece al usuario
        if (!apuesta.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permisos para cancelar esta apuesta");
        }

        // Solo se pueden cancelar apuestas pendientes
        if (apuesta.getEstadoApuesta() != EstadoApuesta.PENDIENTE) {
            throw new RuntimeException("Solo se pueden cancelar apuestas pendientes");
        }

        // Reembolsar el dinero al usuario
        Usuario usuario = apuesta.getUsuario();
        BigDecimal nuevoSaldo = usuario.getSaldoUsuario().add(apuesta.getMontoApuesta());
        usuario.setSaldoUsuario(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Cancelar la apuesta
        apuesta.cancelarApuesta(motivo);
        apuestaRepository.save(apuesta);

        log.info("Apuesta {} cancelada para usuario {}", idApuesta, idUsuario);
        return true;
    }

    @Override
    public ApuestaResponse resolverApuestaComoGanada(Long idApuesta) {
        Apuesta apuesta = apuestaRepository.findById(idApuesta)
                .orElseThrow(() -> new RuntimeException("Apuesta no encontrada"));

        if (apuesta.getEstadoApuesta() != EstadoApuesta.PENDIENTE) {
            throw new RuntimeException("Solo se pueden resolver apuestas pendientes");
        }

        // Agregar ganancia al saldo del usuario
        Usuario usuario = apuesta.getUsuario();
        BigDecimal ganancias = apuesta.getGananciaPotencial();
        BigDecimal nuevoSaldo = usuario.getSaldoUsuario().add(ganancias);
        usuario.setSaldoUsuario(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Resolver como ganada
        apuesta.resolverComoGanada();
        Apuesta apuestaResuelta = apuestaRepository.save(apuesta);

        log.info("Apuesta {} resuelta como ganada. Ganancia: ${}", idApuesta, ganancias);
        return convertirAApuestaResponse(apuestaResuelta);
    }

    @Override
    public ApuestaResponse resolverApuestaComoPerdida(Long idApuesta) {
        Apuesta apuesta = apuestaRepository.findById(idApuesta)
                .orElseThrow(() -> new RuntimeException("Apuesta no encontrada"));

        if (apuesta.getEstadoApuesta() != EstadoApuesta.PENDIENTE) {
            throw new RuntimeException("Solo se pueden resolver apuestas pendientes");
        }

        // Resolver como perdida (no se agrega dinero al usuario)
        apuesta.resolverComoPerdida();
        Apuesta apuestaResuelta = apuestaRepository.save(apuesta);

        log.info("Apuesta {} resuelta como perdida", idApuesta);
        return convertirAApuestaResponse(apuestaResuelta);
    }

    @Override
    public ApuestaResponse reembolsarApuesta(Long idApuesta, String motivo) {
        Apuesta apuesta = apuestaRepository.findById(idApuesta)
                .orElseThrow(() -> new RuntimeException("Apuesta no encontrada"));

        if (apuesta.getEstadoApuesta() != EstadoApuesta.PENDIENTE) {
            throw new RuntimeException("Solo se pueden reembolsar apuestas pendientes");
        }

        // Reembolsar el dinero al usuario
        Usuario usuario = apuesta.getUsuario();
        BigDecimal nuevoSaldo = usuario.getSaldoUsuario().add(apuesta.getMontoApuesta());
        usuario.setSaldoUsuario(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Marcar como reembolsada
        apuesta.setEstadoApuesta(EstadoApuesta.REEMBOLSADA);
        apuesta.setObservaciones(motivo);
        apuesta.setFechaResolucion(LocalDateTime.now());
        Apuesta apuestaReembolsada = apuestaRepository.save(apuesta);

        log.info("Apuesta {} reembolsada. Motivo: {}", idApuesta, motivo);
        return convertirAApuestaResponse(apuestaReembolsada);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApuestaResponse> obtenerApuestasPorEvento(Long idEvento) {
        Evento evento = eventoRepository.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        return apuestaRepository.findByEvento(evento)
                .stream()
                .map(this::convertirAApuestaResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApuestaResponse> obtenerApuestasPorEstado(EstadoApuesta estado) {
        return apuestaRepository.findByEstadoApuesta(estado)
                .stream()
                .map(this::convertirAApuestaResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApuestaResponse> obtenerApuestasPorTipo(TipoApuesta tipo) {
        return apuestaRepository.findByTipoApuesta(tipo)
                .stream()
                .map(this::convertirAApuestaResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EstadisticasApuestaResponse obtenerEstadisticasUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Long totalApuestas = apuestaRepository.countByUsuario(usuario);
        Long apuestasGanadas = apuestaRepository.countByUsuarioAndEstado(usuario, EstadoApuesta.GANADA);
        Long apuestasPerdidas = apuestaRepository.countByUsuarioAndEstado(usuario, EstadoApuesta.PERDIDA);
        Long apuestasPendientes = apuestaRepository.countByUsuarioAndEstado(usuario, EstadoApuesta.PENDIENTE);

        BigDecimal totalApostado = apuestaRepository.sumMontoApuestaByUsuario(usuario).orElse(BigDecimal.ZERO);
        BigDecimal totalGanado = apuestaRepository.sumGananciaRealByUsuario(usuario).orElse(BigDecimal.ZERO);
        BigDecimal gananciaNeta = totalGanado.subtract(totalApostado);

        Double porcentajeExito = totalApuestas > 0 ? (apuestasGanadas.doubleValue() / totalApuestas.doubleValue()) * 100
                : 0.0;

        BigDecimal mayorGanancia = apuestaRepository.maxGananciaByUsuario(usuario).orElse(BigDecimal.ZERO);
        BigDecimal mayorPerdida = apuestaRepository.maxPerdidaByUsuario(usuario).orElse(BigDecimal.ZERO);

        // Obtener últimas 10 apuestas
        List<ApuestaResponse> ultimasApuestas = apuestaRepository
                .findUltimasApuestasByUsuario(usuario, PageRequest.of(0, 10))
                .stream()
                .map(this::convertirAApuestaResponse)
                .collect(Collectors.toList());

        return EstadisticasApuestaResponse.builder()
                .totalApuestas(totalApuestas.intValue())
                .apuestasGanadas(apuestasGanadas.intValue())
                .apuestasPerdidas(apuestasPerdidas.intValue())
                .apuestasPendientes(apuestasPendientes.intValue())
                .totalApostado(totalApostado)
                .totalGanado(totalGanado)
                .gananciaNeta(gananciaNeta)
                .porcentajeExito(porcentajeExito)
                .saldoActual(usuario.getSaldoUsuario())
                .mayorGanancia(mayorGanancia)
                .mayorPerdida(mayorPerdida)
                .ultimasApuestas(ultimasApuestas)
                .build();
    }

    @Override
    public BigDecimal calcularGananciaPotencial(BigDecimal monto, BigDecimal cuota) {
        return monto.multiply(cuota).setScale(2, RoundingMode.HALF_UP);
    }

    // Métodos de validación

    @Override
    @Transactional(readOnly = true)
    public boolean validarSaldoSuficiente(Long idUsuario, BigDecimal montoApuesta) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuario.getSaldoUsuario().compareTo(montoApuesta) >= 0;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validarLimiteApuesta(Long idUsuario, BigDecimal montoApuesta) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Obtener apuestas de hoy
        LocalDateTime inicioHoy = LocalDate.now().atStartOfDay();
        LocalDateTime finHoy = inicioHoy.plusDays(1);

        List<Apuesta> apuestasHoy = apuestaRepository
                .findByUsuarioAndFechaCreacionBetween(usuario, inicioHoy, finHoy);

        BigDecimal totalApostadoHoy = apuestasHoy.stream()
                .map(Apuesta::getMontoApuesta)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return totalApostadoHoy.add(montoApuesta).compareTo(LIMITE_DIARIO) <= 0;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validarEventoAbierto(Long idEvento) {
        Evento evento = eventoRepository.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        // El evento debe ser en el futuro
        Date fechaEvento = evento.getFechaPartido();
        Date fechaActual = Date.valueOf(LocalDate.now());

        return fechaEvento.after(fechaActual);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validarApuestaDuplicada(Long idUsuario, Long idEvento, TipoApuesta tipoApuesta) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Evento evento = eventoRepository.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        return !apuestaRepository.existsByUsuarioAndEventoAndTipoApuesta(usuario, evento, tipoApuesta);
    }

    @Override
    public void procesarApuestasPendientes() {
        Date fechaActual = Date.valueOf(LocalDate.now());
        List<Apuesta> apuestasVencidas = apuestaRepository.findApuestasPendientesVencidas(fechaActual);

        log.info("Procesando {} apuestas pendientes vencidas", apuestasVencidas.size());

        for (Apuesta apuesta : apuestasVencidas) {
            // Aquí implementarías la lógica para resolver automáticamente
            // Por ahora solo las marcamos para revisión manual
            apuesta.setObservaciones("Apuesta vencida - requiere resolución manual");
            apuestaRepository.save(apuesta);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApuestaResponse> obtenerTopGanancias(int limite) {
        return apuestaRepository.findTopGanancias(PageRequest.of(0, limite))
                .stream()
                .map(this::convertirAApuestaResponse)
                .collect(Collectors.toList());
    }

    // Métodos privados auxiliares

    /**
     * Busca o crea un evento basado en la información del request
     */
    private Evento buscarOCrearEvento(CrearApuestaRequest request) {
        // Estrategia 1: Buscar por ID si se proporciona
        if (request.getIdEvento() != null) {
            Optional<Evento> eventoExistente = eventoRepository.findById(request.getIdEvento());
            if (eventoExistente.isPresent()) {
                log.info("Evento encontrado por ID: {}", request.getIdEvento());
                return eventoExistente.get();
            }
        }
        // Estrategia 2: Buscar por ID externo (TheSportsDB)
        if (request.getIdEvento() != null && !request.getIdEvento().toString().isEmpty()) {
            log.info("Buscando evento por ID externo: {}", request.getIdEvento());
            Optional<TheSportsDbEventResponse> eventoPorIdExterno = apiBaseDatos
                    .buscarEventoPorId(request.getIdEvento().toString());
            if (eventoPorIdExterno.isPresent()) {
                log.info("Evento encontrado por ID externo: {}", request.getIdEvento());
                // Convertir TheSportsDbEventResponse a Evento y guardarlo
                Evento eventoConvertido = convertirTheSportsDbEventoAEvento(eventoPorIdExterno.get());
                return eventoRepository.save(eventoConvertido);
            }
        }
        // Estrategia 3: Buscar por equipos en la base de datos local
        if (request.getEquipoLocal() != null && request.getEquipoVisitante() != null &&
                !request.getEquipoLocal().trim().isEmpty() && !request.getEquipoVisitante().trim().isEmpty()) {

            log.info("Buscando evento por equipos en BD local: {} vs {}", request.getEquipoLocal(),
                    request.getEquipoVisitante());
            List<Evento> eventosExistentes = eventoRepository.findByEquipoLocalAndEquipoVisitante(
                    request.getEquipoLocal().trim(),
                    request.getEquipoVisitante().trim());

            if (!eventosExistentes.isEmpty()) {
                log.info("Evento encontrado en BD local: {} vs {}",
                        request.getEquipoLocal(), request.getEquipoVisitante());
                return eventosExistentes.get(0); // Retornar el primer evento encontrado
            }

            // Si no se encuentra en BD local, buscar en TheSportsDB
            log.info("Buscando evento en TheSportsDB por equipos: {} vs {}", request.getEquipoLocal(),
                    request.getEquipoVisitante());
            List<com.example.cc.dto.response.TheSportsDbEventResponse> eventosTheSportsDb = apiBaseDatos
                    .buscarEventosPorEquipos(request.getEquipoLocal().trim(), request.getEquipoVisitante().trim());

            if (!eventosTheSportsDb.isEmpty()) {
                log.info("Evento encontrado en TheSportsDB: {} vs {}",
                        request.getEquipoLocal(), request.getEquipoVisitante());
                // Convertir y guardar el primer evento
                Evento eventoConvertido = convertirTheSportsDbEventoAEvento(eventosTheSportsDb.get(0));
                return eventoRepository.save(eventoConvertido);
            }
        }

        // Estrategia 4: Crear evento básico si se proporcionan datos mínimos
        if (request.getEquipoLocal() != null && request.getEquipoVisitante() != null &&
                !request.getEquipoLocal().trim().isEmpty() && !request.getEquipoVisitante().trim().isEmpty()) {

            log.info("Creando evento básico: {} vs {}", request.getEquipoLocal(), request.getEquipoVisitante());
            return crearEventoBasico(request);
        }

        // Si no se puede crear de ninguna manera, lanzar excepción
        throw new RuntimeException("No se pudo encontrar ni crear el evento. " +
                "Proporciona un ID de evento válido, ID externo de TheSportsDB, o nombres de equipos.");
    }

    /**
     * Crea un evento básico con la información mínima proporcionada
     */
    private Evento crearEventoBasico(CrearApuestaRequest request) {
        Evento evento = new Evento();
        evento.setEquipoLocal(request.getEquipoLocal().trim());
        evento.setEquipoVisitante(request.getEquipoVisitante().trim());
        evento.setNombreEvento(request.getEquipoLocal() + " vs " + request.getEquipoVisitante());
        evento.setEstado("PROGRAMADO");
        // Establecer fecha del evento
        if (request.getFechaEvento() != null && !request.getFechaEvento().trim().isEmpty()) {
            try {
                java.time.LocalDate fechaEvento = java.time.LocalDate.parse(request.getFechaEvento());
                evento.setFechaPartido(java.sql.Date.valueOf(fechaEvento));
            } catch (Exception e) {
                log.warn("Error al parsear fecha del evento: {}. Usando fecha actual + 1 día",
                        request.getFechaEvento());
                evento.setFechaPartido(java.sql.Date.valueOf(java.time.LocalDate.now().plusDays(1)));
            }
        } else {
            // Fecha por defecto: mañana
            evento.setFechaPartido(java.sql.Date.valueOf(java.time.LocalDate.now().plusDays(1)));
        }

        // Guardar y retornar el evento
        Evento eventoGuardado = eventoRepository.save(evento);
        log.info("Evento básico creado con ID: {}", eventoGuardado.getIdEvento());

        return eventoGuardado;
    }

    /**
     * Convierte un TheSportsDbEventResponse a una entidad Evento
     */
    private Evento convertirTheSportsDbEventoAEvento(TheSportsDbEventResponse theSportsDbEvent) {
        Evento evento = new Evento();

        // Mapear campos básicos
        evento.setEquipoLocal(theSportsDbEvent.getStrHomeTeam());
        evento.setEquipoVisitante(theSportsDbEvent.getStrAwayTeam());
        evento.setNombreEvento(theSportsDbEvent.getStrEvent());

        // Convertir fecha
        if (theSportsDbEvent.getDateEvent() != null) {
            try {
                java.time.LocalDate fechaEvento = java.time.LocalDate.parse(theSportsDbEvent.getDateEvent());
                evento.setFechaPartido(java.sql.Date.valueOf(fechaEvento));
            } catch (Exception e) {
                log.warn("Error al parsear fecha del evento desde TheSportsDB: {}. Usando fecha actual + 1 día",
                        theSportsDbEvent.getDateEvent());
                evento.setFechaPartido(java.sql.Date.valueOf(java.time.LocalDate.now().plusDays(1)));
            }
        } else {
            // Fecha por defecto: mañana
            evento.setFechaPartido(java.sql.Date.valueOf(java.time.LocalDate.now().plusDays(1)));
        }

        // Mapear información adicional si está disponible
        if (theSportsDbEvent.getStrLeague() != null) {
            evento.setLiga(theSportsDbEvent.getStrLeague());
        }

        if (theSportsDbEvent.getStrSport() != null) {
            evento.setDeporte(theSportsDbEvent.getStrSport());
        }

        if (theSportsDbEvent.getStrVenue() != null) {
            evento.setEstadio(theSportsDbEvent.getStrVenue());
        }

        // Mapear resultados si están disponibles
        if (theSportsDbEvent.getIntHomeScore() != null && !theSportsDbEvent.getIntHomeScore().trim().isEmpty()) {
            try {
                evento.setResultadoLocal(Integer.parseInt(theSportsDbEvent.getIntHomeScore()));
            } catch (NumberFormatException e) {
                log.warn("Error al parsear resultado local: {}", theSportsDbEvent.getIntHomeScore());
            }
        }

        if (theSportsDbEvent.getIntAwayScore() != null && !theSportsDbEvent.getIntAwayScore().trim().isEmpty()) {
            try {
                evento.setResultadoVisitante(Integer.parseInt(theSportsDbEvent.getIntAwayScore()));
            } catch (NumberFormatException e) {
                log.warn("Error al parsear resultado visitante: {}", theSportsDbEvent.getIntAwayScore());
            }
        }

        // Mapear estado del evento
        if (theSportsDbEvent.getStrStatus() != null) {
            switch (theSportsDbEvent.getStrStatus().toLowerCase()) {
                case "not started":
                    evento.setEstado("PROGRAMADO");
                    break;
                case "match finished":
                    evento.setEstado("FINALIZADO");
                    break;
                case "in progress":
                    evento.setEstado("EN_CURSO");
                    break;
                default:
                    evento.setEstado("PROGRAMADO");
            }
        } else {
            evento.setEstado("PROGRAMADO");
        }

        evento.setIdEvento(Long.parseLong(theSportsDbEvent.getIdEvent()));

        log.info("Evento convertido desde TheSportsDB: {} vs {} - {}",
                evento.getEquipoLocal(), evento.getEquipoVisitante(), evento.getFechaPartido());

        return evento;
    }

    private void validarCreacionApuesta(Usuario usuario, Evento evento, CrearApuestaRequest request) {
        // Validar estado de cuenta del usuario
        if (!usuario.getEstadoCuenta()) {
            throw new RuntimeException("Cuenta de usuario inactiva");
        }

        // Validar saldo suficiente
        if (!validarSaldoSuficiente(usuario.getIdUsuario(), request.getMontoApuesta())) {
            throw new RuntimeException("Saldo insuficiente");
        }

        // Validar límites de apuesta
        if (!validarLimiteApuesta(usuario.getIdUsuario(), request.getMontoApuesta())) {
            throw new RuntimeException("Límite diario de apuestas excedido");
        }

        // Validar que el evento esté abierto
        if (!validarEventoAbierto(evento.getIdEvento())) {
            throw new RuntimeException("El evento ya no está disponible para apuestas");
        }

        // Validar apuesta duplicada
        if (!validarApuestaDuplicada(usuario.getIdUsuario(), evento.getIdEvento(), request.getTipoApuesta())) {
            throw new RuntimeException("Ya existe una apuesta de este tipo para este evento");
        }

        // Validar montos
        if (request.getMontoApuesta().compareTo(APUESTA_MINIMA) < 0) {
            throw new RuntimeException("El monto mínimo de apuesta es $" + APUESTA_MINIMA);
        }

        if (request.getMontoApuesta().compareTo(APUESTA_MAXIMA) > 0) {
            throw new RuntimeException("El monto máximo de apuesta es $" + APUESTA_MAXIMA);
        }
    }

    private ApuestaResponse convertirAApuestaResponse(Apuesta apuesta) {
        return ApuestaResponse.builder()
                .idApuesta(apuesta.getIdApuesta())
                .idUsuario(apuesta.getUsuario().getIdUsuario())
                .emailUsuario(apuesta.getUsuario().getEmail())
                .idEvento(apuesta.getEvento().getIdEvento())
                .equipoLocal(apuesta.getEvento().getEquipoLocal())
                .equipoVisitante(apuesta.getEvento().getEquipoVisitante())
                .tipoApuesta(apuesta.getTipoApuesta())
                .tipoApuestaDescripcion(apuesta.getTipoApuesta().getDescripcion())
                .estadoApuesta(apuesta.getEstadoApuesta())
                .estadoApuestaDescripcion(apuesta.getEstadoApuesta().getDescripcion())
                .montoApuesta(apuesta.getMontoApuesta())
                .cuotaApuesta(apuesta.getCuotaApuesta())
                .gananciaPotencial(apuesta.getGananciaPotencial())
                .gananciaReal(apuesta.getGananciaReal())
                .prediccionUsuario(apuesta.getPrediccionUsuario())
                .resultadoReal(apuesta.getResultadoReal())
                .detalleApuesta(apuesta.getDetalleApuesta())
                .fechaCreacion(apuesta.getFechaCreacion())
                .fechaResolucion(apuesta.getFechaResolucion())
                .observaciones(apuesta.getObservaciones())
                .build();
    }
}
