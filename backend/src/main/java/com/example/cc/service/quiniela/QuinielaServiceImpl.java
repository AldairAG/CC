package com.example.cc.service.quiniela;

import com.example.cc.dto.quiniela.*;
import com.example.cc.entities.*;
import com.example.cc.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuinielaServiceImpl implements IQuinielaService {

    @Autowired
    private QuinielaRepository quinielaRepository;
    
    @Autowired
    private EventoRepository eventoRepository;
    
    // Repositorios adicionales para funcionalidad avanzada
    private final QuinielaCreadaRepository quinielaCreadaRepository;
    private final ParticipacionQuinielaRepository participacionQuinielaRepository;
    private final QuinielaEventoRepository quinielaEventoRepository;
    private final QuinielaPrediccionRepository quinielaPrediccionRepository;
    private final PremioQuinielaRepository premioQuinielaRepository;

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

    // Implementaciones de métodos avanzados de QuinielaService

    @Override
    @Transactional
    public QuinielaResponse crearQuiniela(CrearQuinielaRequest request, Long usuarioId) {
        // Validar límites (ejemplo: máximo 5 quinielas por día)
        LocalDateTime hace24Horas = LocalDateTime.now().minusDays(1);
        long quinielasRecientes = quinielaCreadaRepository.countQuinielasUsuarioRecientes(usuarioId, hace24Horas);
        if (quinielasRecientes >= 5) {
            throw new RuntimeException("Límite de quinielas diarias alcanzado");
        }

        // Crear quiniela
        QuinielaCreada quiniela = new QuinielaCreada();
        quiniela.setNombre(request.getNombre());
        quiniela.setDescripcion(request.getDescripcion());
        quiniela.setCreadorId(usuarioId);
        quiniela.setFechaCreacion(LocalDateTime.now());
        quiniela.setFechaInicio(request.getFechaInicio());
        quiniela.setFechaFin(request.getFechaFin());
        quiniela.setPrecioEntrada(request.getPrecioEntrada());
        quiniela.setMaxParticipantes(request.getMaxParticipantes());
        quiniela.setTipoDistribucion(request.getTipoDistribucion());
        quiniela.setPorcentajePremiosPrimero(request.getPorcentajePremiosPrimero());
        quiniela.setPorcentajePremiosSegundo(request.getPorcentajePremiosSegundo());
        quiniela.setPorcentajePremiosTercero(request.getPorcentajePremiosTercero());
        quiniela.setEsPublica(request.getEsPublica());

        // Generar código de invitación si es privada
        if (!request.getEsPublica()) {
            quiniela.setCodigoInvitacion(generarCodigoInvitacion());
        }

        quiniela = quinielaCreadaRepository.save(quiniela);

        // Crear eventos
        if (request.getEventos() != null && !request.getEventos().isEmpty()) {
            for (CrearQuinielaRequest.EventoQuinielaRequest eventoReq : request.getEventos()) {
                QuinielaEvento evento = new QuinielaEvento();
                evento.setQuiniela(quiniela);
                evento.setEventoId(eventoReq.getEventoId());
                evento.setNombreEvento(eventoReq.getNombreEvento());
                evento.setFechaEvento(eventoReq.getFechaEvento());
                evento.setEquipoLocal(eventoReq.getEquipoLocal());
                evento.setEquipoVisitante(eventoReq.getEquipoVisitante());
                evento.setPuntosPorAcierto(eventoReq.getPuntosPorAcierto() != null ? eventoReq.getPuntosPorAcierto() : 1);
                evento.setPuntosPorResultadoExacto(eventoReq.getPuntosPorResultadoExacto() != null ? eventoReq.getPuntosPorResultadoExacto() : 3);
                evento.setEstado(QuinielaEvento.EstadoEvento.PROGRAMADO);
                quinielaEventoRepository.save(evento);
            }
        }

        // Crear estructura de premios
        crearEstructuraPremios(quiniela);

        return convertirAResponse(quiniela);
    }

    @Override
    @Transactional
    public ParticipacionQuiniela unirseQuiniela(UnirseQuinielaRequestDto request, Long usuarioId) {
        // Verificar que la quiniela existe
        QuinielaCreada quiniela = quinielaCreadaRepository.findById(request.getQuinielaId())
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        // Verificar que no esté ya participando
        if (participacionQuinielaRepository.existsByQuinielaIdAndUsuarioId(request.getQuinielaId(), usuarioId)) {
            throw new RuntimeException("Ya estás participando en esta quiniela");
        }

        // Verificar límites
        if (quiniela.getMaxParticipantes() != null &&
                quiniela.getParticipantesActuales() >= quiniela.getMaxParticipantes()) {
            throw new RuntimeException("Quiniela llena");
        }

        // Verificar fecha de inicio
        if (LocalDateTime.now().isAfter(quiniela.getFechaInicio())) {
            throw new RuntimeException("La quiniela ya ha comenzado");
        }

        // Verificar código de invitación si es privada
        if (!quiniela.getEsPublica() &&
                !Objects.equals(request.getCodigoInvitacion(), quiniela.getCodigoInvitacion())) {
            throw new RuntimeException("Código de invitación inválido");
        }

        // Procesar pago
        procesarPagoEntrada(quiniela, request, usuarioId);

        // Crear participación
        ParticipacionQuiniela participacion = new ParticipacionQuiniela();
        participacion.setQuiniela(quiniela);
        participacion.setUsuarioId(usuarioId);
        participacion.setFechaParticipacion(LocalDateTime.now());
        participacion.setMontoPagado(quiniela.getPrecioEntrada());

        participacion = participacionQuinielaRepository.save(participacion);

        // Actualizar contador
        quiniela.setParticipantesActuales(quiniela.getParticipantesActuales() + 1);
        quinielaCreadaRepository.save(quiniela);

        // Actualizar premio total
        actualizarPremioTotal(quiniela);

        return participacion;
    }

    @Override
    @Transactional
    public void hacerPredicciones(HacerPrediccionesRequestDto request, Long usuarioId) {
        // Buscar la participación del usuario en la quiniela
        ParticipacionQuiniela participacion = participacionQuinielaRepository
                .findByQuinielaIdAndUsuarioId(request.getQuinielaId(), usuarioId)
                .orElseThrow(() -> new RuntimeException("No estás participando en esta quiniela"));

        // Verificar que la quiniela no haya comenzado
        if (LocalDateTime.now().isAfter(participacion.getQuiniela().getFechaInicio())) {
            throw new RuntimeException("Ya no se pueden hacer predicciones");
        }

        // Guardar predicciones
        for (HacerPrediccionesRequestDto.PrediccionEvento predReq : request.getPredicciones()) {
            QuinielaEvento evento = quinielaEventoRepository.findById(predReq.getEventoId())
                    .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

            // Verificar que el evento pertenece a la quiniela
            if (!evento.getQuiniela().getId().equals(participacion.getQuiniela().getId())) {
                throw new RuntimeException("El evento no pertenece a esta quiniela");
            }

            // Buscar predicción existente o crear nueva
            QuinielaPrediccion prediccion = quinielaPrediccionRepository
                    .findByParticipacionIdAndEventoId(participacion.getId(), evento.getId())
                    .orElse(new QuinielaPrediccion());
            prediccion.setParticipacion(participacion);
            prediccion.setEvento(evento);
            prediccion.setPrediccionLocal(predReq.getResultadoPredichoLocal());
            prediccion.setPrediccionVisitante(predReq.getResultadoPredichoVisitante());
            prediccion.setTipoPrediccion(predReq.getTipoPrediccion());
            prediccion.setFechaPrediccion(LocalDateTime.now());

            quinielaPrediccionRepository.save(prediccion);
        }
    }

    @Override
    @Transactional
    public void distribuirPremios(Long quinielaId, Long usuarioId) {
        QuinielaCreada quiniela = quinielaCreadaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        // Verificar permisos (solo creador o admin)
        if (!quiniela.getCreadorId().equals(usuarioId)) {
            throw new RuntimeException("Solo el creador puede distribuir premios");
        }

        // Verificar que haya terminado
        if (LocalDateTime.now().isBefore(quiniela.getFechaFin())) {
            throw new RuntimeException("La quiniela aún no ha terminado");
        }

        // Verificar que no se hayan distribuido ya
        if (quiniela.getPremiosDistribuidos()) {
            throw new RuntimeException("Los premios ya fueron distribuidos");
        }

        // Calcular puntuaciones finales
        calcularPuntuacionesFinales(quinielaId);

        // Obtener ranking final
        List<ParticipacionQuiniela> ranking = participacionQuinielaRepository.findRankingByQuiniela(quinielaId);
        
        // Distribuir premios según el tipo
        switch (quiniela.getTipoDistribucion()) {
            case "WINNER_TAKES_ALL":
                distribuirPremioGanadorTodoToma(ranking, quiniela);
                break;
            case "TOP_3":
                distribuirPremiosTop3(ranking, quiniela);
                break;
            case "PERCENTAGE":
                distribuirPremiosPorcentaje(ranking, quiniela);
                break;
        }
        
        // Marcar como distribuidos
        quiniela.setPremiosDistribuidos(true);
        quiniela.setEstado(QuinielaCreada.EstadoQuiniela.FINALIZADA);
        quinielaCreadaRepository.save(quiniela);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaResponse> obtenerQuinielasPublicas() {
        List<QuinielaCreada> quinielas = quinielaCreadaRepository
                .findQuinielasPublicasDisponibles(QuinielaCreada.EstadoQuiniela.ACTIVA, LocalDateTime.now());

        return quinielas.stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaResponse> obtenerQuinielasUsuario(Long usuarioId) {
        List<QuinielaCreada> quinielas = quinielaCreadaRepository.findByCreadorIdOrderByFechaCreacionDesc(usuarioId);

        return quinielas.stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaResponse> obtenerQuinielasParticipacion(Long usuarioId) {
        List<QuinielaCreada> quinielas = quinielaCreadaRepository.findQuinielasUsuarioParticipa(usuarioId);

        return quinielas.stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuinielaResponse obtenerQuinielaPorId(Long quinielaId) {
        Optional<QuinielaCreada> quinielaOpt = quinielaCreadaRepository.findById(quinielaId);
        if (quinielaOpt.isPresent()) {
            return convertirAResponse(quinielaOpt.get());
        }
        throw new RuntimeException("Quiniela no encontrada con ID: " + quinielaId);
    }

    // Implementaciones de métodos adicionales para filtros y búsquedas

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaResponse> obtenerQuinielasPorEstado(String estado) {
        List<Quiniela> quinielas = quinielaRepository.findByEstado(estado);
        return quinielas.stream()
                .map(this::convertirQuinielaBasicaAResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaResponse> obtenerQuinielasPorPrecioMaximo(Float precioMaximo) {
        List<Quiniela> quinielas = quinielaRepository.findByPrecioParticipacionLessThanEqual(precioMaximo);
        return quinielas.stream()
                .map(this::convertirQuinielaBasicaAResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaResponse> obtenerQuinielasPorTipoPremio(String tipoPremio) {
        List<Quiniela> quinielas = quinielaRepository.findByTipoPremio(tipoPremio);
        return quinielas.stream()
                .map(this::convertirQuinielaBasicaAResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaResponse> obtenerQuinielasPorRangoFecha(Date fechaInicio, Date fechaFin) {
        List<Quiniela> quinielas = quinielaRepository.findByFechaInicioBetween(fechaInicio, fechaFin);
        return quinielas.stream()
                .map(this::convertirQuinielaBasicaAResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaResponse> busquedaAvanzadaQuinielas(String estado, Float precioMaximo, 
                                                          String tipoPremio, Date fechaInicio, Date fechaFin) {
        List<Quiniela> quinielas = quinielaRepository.findAll();
        
        // Aplicar filtros dinámicamente
        if (estado != null && !estado.isEmpty()) {
            quinielas = quinielas.stream()
                    .filter(q -> estado.equals(q.getEstado()))
                    .collect(Collectors.toList());
        }
        
        if (precioMaximo != null) {
            quinielas = quinielas.stream()
                    .filter(q -> q.getPrecioParticipacion() <= precioMaximo)
                    .collect(Collectors.toList());
        }
        
        if (tipoPremio != null && !tipoPremio.isEmpty()) {
            quinielas = quinielas.stream()
                    .filter(q -> tipoPremio.equals(q.getTipoPremio()))
                    .collect(Collectors.toList());
        }
        
        if (fechaInicio != null && fechaFin != null) {
            quinielas = quinielas.stream()
                    .filter(q -> q.getFechaInicio().compareTo(fechaInicio) >= 0 && 
                               q.getFechaInicio().compareTo(fechaFin) <= 0)
                    .collect(Collectors.toList());
        }
        
        return quinielas.stream()
                .map(this::convertirQuinielaBasicaAResponse)
                .collect(Collectors.toList());
    }    @Override
    @Transactional
    public void eliminarQuiniela(Long id, Long usuarioId) {
        // Verificar que la quiniela existe
        quinielaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));
        
        // TODO: Verificar permisos - solo el creador o admin puede eliminar
        // TODO: Verificar que no tenga participaciones activas
        
        quinielaRepository.deleteById(id);
        log.info("Quiniela eliminada: {} por usuario: {}", id, usuarioId);
    }

    @Override
    @Transactional
    public void finalizarQuiniela(Long id, Long usuarioId) {
        // Verificar que la quiniela existe
        Quiniela quiniela = quinielaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));
        
        // TODO: Verificar permisos - solo el creador o admin puede finalizar
        // TODO: Calcular ganadores y distribuir premios automáticamente
        
        quiniela.setEstado("FINALIZADA");
        quinielaRepository.save(quiniela);
        
        log.info("Quiniela finalizada: {} por usuario: {}", id, usuarioId);
    }    @Override
    @Transactional(readOnly = true)
    public EstadisticasQuinielaResponse obtenerEstadisticasQuiniela(Long id) {
        // Verificar que la quiniela existe
        Quiniela quiniela = quinielaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));
        
        // Crear objeto de estadísticas estructurado
        EstadisticasQuinielaResponse estadisticas = new EstadisticasQuinielaResponse();
        estadisticas.setId(quiniela.getIdQuiniela());
        estadisticas.setNombre(quiniela.getNombreQuiniela());
        estadisticas.setEstado(quiniela.getEstado());
        estadisticas.setFechaInicio(quiniela.getFechaInicio());
        estadisticas.setFechaFin(quiniela.getFechaFin());
        estadisticas.setPrecioParticipacion(quiniela.getPrecioParticipacion());
        estadisticas.setPremioAcumulado(quiniela.getPremioAcumulado());
        estadisticas.setTipoPremio(quiniela.getTipoPremio());
        estadisticas.setNumeroParticipantes(quiniela.getNumeroParticipantes());
        estadisticas.setDescripcion(quiniela.getStrDescripcion());
        
        // Calcular estadísticas derivadas
        estadisticas.setActiva("ACTIVA".equals(quiniela.getEstado()));
        estadisticas.setFinalizada("FINALIZADA".equals(quiniela.getEstado()));
        
        // Contar eventos asociados
        estadisticas.setNumeroEventos(quiniela.getEventos() != null ? quiniela.getEventos().size() : 0);
        
        // TODO: Agregar conteo de predicciones desde base de datos
        estadisticas.setNumeroPredicciones(0);
        
        return estadisticas;
    }    // Método auxiliar para convertir entidad Quiniela básica a Response
    private QuinielaResponse convertirQuinielaBasicaAResponse(Quiniela quiniela) {
        QuinielaResponse response = new QuinielaResponse();
        response.setId(quiniela.getIdQuiniela());
        response.setNombre(quiniela.getNombreQuiniela());
        response.setDescripcion(quiniela.getStrDescripcion());
        response.setEstado(quiniela.getEstado());
        response.setPrecioEntrada(quiniela.getPrecioParticipacion() != null ? 
                                 BigDecimal.valueOf(quiniela.getPrecioParticipacion()) : BigDecimal.ZERO);
        response.setPremioTotal(quiniela.getPremioAcumulado());
        response.setTipoDistribucion(quiniela.getTipoPremio());
        
        // Convertir fechas de Date a LocalDateTime
        if (quiniela.getFechaInicio() != null) {
            response.setFechaInicio(quiniela.getFechaInicio().toInstant()
                    .atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
        }
        if (quiniela.getFechaFin() != null) {
            response.setFechaFin(quiniela.getFechaFin().toInstant()
                    .atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
        }
        
        return response;
    }

    private String generarCodigoInvitacion() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void crearEstructuraPremios(QuinielaCreada quiniela) {
        // Crear estructura de premios basada en el tipo de distribución
        switch (quiniela.getTipoDistribucion()) {
            case "WINNER_TAKES_ALL":
                PremioQuiniela premio1 = new PremioQuiniela();
                premio1.setQuiniela(quiniela);
                premio1.setPosicion(1);
                premio1.setPorcentajePremio(100);
                premio1.setMontoPremio(BigDecimal.ZERO); // Se calculará después
                premioQuinielaRepository.save(premio1);
                break;

            case "TOP_3":
                // Primer lugar
                PremioQuiniela premio1Top3 = new PremioQuiniela();
                premio1Top3.setQuiniela(quiniela);
                premio1Top3.setPosicion(1);
                premio1Top3.setPorcentajePremio(quiniela.getPorcentajePremiosPrimero());
                premio1Top3.setMontoPremio(BigDecimal.ZERO);
                premioQuinielaRepository.save(premio1Top3);

                // Segundo lugar
                PremioQuiniela premio2Top3 = new PremioQuiniela();
                premio2Top3.setQuiniela(quiniela);
                premio2Top3.setPosicion(2);
                premio2Top3.setPorcentajePremio(quiniela.getPorcentajePremiosSegundo());
                premio2Top3.setMontoPremio(BigDecimal.ZERO);
                premioQuinielaRepository.save(premio2Top3);

                // Tercer lugar
                PremioQuiniela premio3Top3 = new PremioQuiniela();
                premio3Top3.setQuiniela(quiniela);
                premio3Top3.setPosicion(3);
                premio3Top3.setPorcentajePremio(quiniela.getPorcentajePremiosTercero());
                premio3Top3.setMontoPremio(BigDecimal.ZERO);
                premioQuinielaRepository.save(premio3Top3);
                break;
        }
    }

    private void procesarPagoEntrada(QuinielaCreada quiniela, UnirseQuinielaRequestDto request, Long usuarioId) {
        if (quiniela.getEsCrypto()) {
            // Procesar pago crypto
            // TODO: Integrar con cryptoService para debitar del wallet
            log.info("Procesando pago crypto para usuario {} en quiniela {}", usuarioId, quiniela.getId());
        } else {
            // Procesar pago fiat
            // TODO: Integrar con servicio de usuarios para debitar saldo
            log.info("Procesando pago fiat para usuario {} en quiniela {}", usuarioId, quiniela.getId());
        }
    }

    private void actualizarPremioTotal(QuinielaCreada quiniela) {
        BigDecimal premioTotal = quiniela.getPrecioEntrada()
                .multiply(BigDecimal.valueOf(quiniela.getParticipantesActuales()));

        quiniela.setPremioTotal(premioTotal);
        quinielaCreadaRepository.save(quiniela);

        // Actualizar montos de premios
        List<PremioQuiniela> premios = premioQuinielaRepository.findByQuinielaIdOrderByPosicionAsc(quiniela.getId());
        for (PremioQuiniela premio : premios) {
            BigDecimal montoPremio = premioTotal
                    .multiply(BigDecimal.valueOf(premio.getPorcentajePremio()))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            premio.setMontoPremio(montoPremio);
            premioQuinielaRepository.save(premio);
        }
    }

    private void calcularPuntuacionesFinales(Long quinielaId) {
        // Obtener todos los eventos finalizados de la quiniela
        List<QuinielaEvento> eventos = quinielaEventoRepository.findByQuinielaIdOrderByFechaEventoAsc(quinielaId)
                .stream()
                .filter(QuinielaEvento::getFinalizado)
                .collect(Collectors.toList());

        // Obtener todas las participaciones
        List<ParticipacionQuiniela> participaciones = participacionQuinielaRepository
                .findByQuinielaIdOrderByPuntosObtenidosDesc(quinielaId);

        for (ParticipacionQuiniela participacion : participaciones) {
            int puntosTotal = 0;

            for (QuinielaEvento evento : eventos) {
                Optional<QuinielaPrediccion> prediccionOpt = quinielaPrediccionRepository
                        .findByParticipacionIdAndEventoId(participacion.getId(), evento.getId());

                if (prediccionOpt.isPresent()) {
                    QuinielaPrediccion prediccion = prediccionOpt.get();
                    int puntos = calcularPuntosPrediccion(prediccion, evento);
                    puntosTotal += puntos;
                    
                    prediccion.setPuntosObtenidos(puntos);
                    quinielaPrediccionRepository.save(prediccion);
                }
            }

            participacion.setPuntosObtenidos(puntosTotal);
            participacionQuinielaRepository.save(participacion);
        }
    }

    private int calcularPuntosPrediccion(QuinielaPrediccion prediccion, QuinielaEvento evento) {
        if (evento.getResultadoLocal() == null || evento.getResultadoVisitante() == null) {
            return 0;
        }

        // Resultado exacto
        if (prediccion.getPrediccionLocal().equals(evento.getResultadoLocal()) &&
                prediccion.getPrediccionVisitante().equals(evento.getResultadoVisitante())) {
            prediccion.setEsResultadoExacto(true);
            return evento.getPuntosPorResultadoExacto();
        }

        // Acierto del ganador
        String resultadoReal = determinarGanador(evento.getResultadoLocal(), evento.getResultadoVisitante());
        String prediccionGanador = determinarGanador(prediccion.getPrediccionLocal(),
                prediccion.getPrediccionVisitante());

        if (resultadoReal.equals(prediccionGanador)) {
            prediccion.setEsAciertoGanador(true);
            return evento.getPuntosPorAcierto();
        }

        return 0;
    }

    private String determinarGanador(Integer local, Integer visitante) {
        if (local > visitante)
            return "LOCAL";
        if (visitante > local)
            return "VISITANTE";
        return "EMPATE";
    }

    private void distribuirPremioGanadorTodoToma(List<ParticipacionQuiniela> ranking, QuinielaCreada quiniela) {
        if (!ranking.isEmpty()) {
            ParticipacionQuiniela ganador = ranking.get(0);
            PremioQuiniela premio = premioQuinielaRepository.findByQuinielaIdOrderByPosicionAsc(quiniela.getId())
                    .get(0);

            premio.setUsuarioGanadorId(ganador.getUsuarioId());
            premio.setFechaAsignacion(LocalDateTime.now());
            premioQuinielaRepository.save(premio);

            ganador.setPosicionFinal(1);
            ganador.setPremioGanado(premio.getMontoPremio());
            participacionQuinielaRepository.save(ganador);
        }
    }

    private void distribuirPremiosTop3(List<ParticipacionQuiniela> ranking, QuinielaCreada quiniela) {
        List<PremioQuiniela> premios = premioQuinielaRepository.findByQuinielaIdOrderByPosicionAsc(quiniela.getId());

        for (int i = 0; i < Math.min(3, ranking.size()); i++) {
            if (i < premios.size()) {
                ParticipacionQuiniela participacion = ranking.get(i);
                PremioQuiniela premio = premios.get(i);

                premio.setUsuarioGanadorId(participacion.getUsuarioId());
                premio.setFechaAsignacion(LocalDateTime.now());
                premioQuinielaRepository.save(premio);

                participacion.setPosicionFinal(i + 1);
                participacion.setPremioGanado(premio.getMontoPremio());
                participacionQuinielaRepository.save(participacion);
            }
        }
    }

    private void distribuirPremiosPorcentaje(List<ParticipacionQuiniela> ranking, QuinielaCreada quiniela) {
        // Implementación similar a TOP_3 pero con porcentajes personalizados
        distribuirPremiosTop3(ranking, quiniela);
    }

    private QuinielaResponse convertirAResponse(QuinielaCreada quiniela) {
        QuinielaResponse response = new QuinielaResponse();
        response.setId(quiniela.getId());
        response.setNombre(quiniela.getNombre());
        response.setDescripcion(quiniela.getDescripcion());
        response.setCreadorId(quiniela.getCreadorId());
        response.setFechaCreacion(quiniela.getFechaCreacion());
        response.setFechaInicio(quiniela.getFechaInicio());
        response.setFechaFin(quiniela.getFechaFin());
        response.setPrecioEntrada(quiniela.getPrecioEntrada());
        response.setPremioTotal(quiniela.getPremioTotal());
        response.setMaxParticipantes(quiniela.getMaxParticipantes());
        response.setParticipantesActuales(quiniela.getParticipantesActuales());
        response.setEstado(quiniela.getEstado().toString());
        response.setTipoDistribucion(quiniela.getTipoDistribucion());
        response.setPorcentajePremiosPrimero(quiniela.getPorcentajePremiosPrimero());
        response.setPorcentajePremiosSegundo(quiniela.getPorcentajePremiosSegundo());
        response.setPorcentajePremiosTercero(quiniela.getPorcentajePremiosTercero());
        response.setEsPublica(quiniela.getEsPublica());
        response.setCodigoInvitacion(quiniela.getCodigoInvitacion());
        response.setEsCrypto(quiniela.getEsCrypto());
        response.setCryptoTipo(quiniela.getCryptoTipo());
        response.setPremiosDistribuidos(quiniela.getPremiosDistribuidos());

        // Convertir eventos
        if (quiniela.getEventos() != null) {
            response.setEventos(quiniela.getEventos().stream()
                    .map(this::convertirEventoAResponse)
                    .collect(Collectors.toList()));
        }

        return response;
    }

    private QuinielaResponse.EventoQuinielaResponse convertirEventoAResponse(QuinielaEvento evento) {
        QuinielaResponse.EventoQuinielaResponse response = new QuinielaResponse.EventoQuinielaResponse();
        response.setId(evento.getId());
        response.setEventoId(evento.getEventoId());
        response.setNombreEvento(evento.getNombreEvento());
        response.setFechaEvento(evento.getFechaEvento());
        response.setEquipoLocal(evento.getEquipoLocal());
        response.setEquipoVisitante(evento.getEquipoVisitante());
        response.setResultadoLocal(evento.getResultadoLocal());
        response.setResultadoVisitante(evento.getResultadoVisitante());
        response.setPuntosPorAcierto(evento.getPuntosPorAcierto());
        response.setPuntosPorResultadoExacto(evento.getPuntosPorResultadoExacto());
        response.setEstado(evento.getEstado().toString());
        response.setFinalizado(evento.getFinalizado());
        return response;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuinielaResponse> obtenerTodasQuinielas(int page, int size) {
        // Simulación de paginación - en un entorno real usarías Pageable
        List<Quiniela> todasQuinielas = quinielaRepository.findAll();
        
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, todasQuinielas.size());
        
        if (fromIndex >= todasQuinielas.size()) {
            return List.of(); // Lista vacía si la página está fuera del rango
        }
        
        List<Quiniela> quinielasPaginadas = todasQuinielas.subList(fromIndex, toIndex);
        
        return quinielasPaginadas.stream()
                .map(this::convertirQuinielaBasicaAResponse)
                .collect(Collectors.toList());
    }
}
