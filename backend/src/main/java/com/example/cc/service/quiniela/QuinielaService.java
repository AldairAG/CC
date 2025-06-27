package com.example.cc.service.quiniela;

import com.example.cc.entities.*;
import com.example.cc.repository.*;
import com.example.cc.service.notificaion.NotificationService;
import com.example.cc.service.wallet.WalletService;
import com.example.cc.dto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class QuinielaService implements IQuinielaService {

    private final QuinielaRepository quinielaRepository;
    private final QuinielaParticipacionRepository participacionRepository;
    private final PrediccionEventoRepository prediccionRepository;
    private final EventoDeportivoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;
    private final WalletService walletService;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    /**
     * Crear una nueva quiniela
     */
    public Quiniela crearQuiniela(CrearQuinielaRequest request) {
        // Validar usuario creador
        Usuario creador = usuarioRepository.findById(request.getCreadorId())
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));

        // Validar fechas
        if (request.getFechaInicio().isAfter(request.getFechaCierre())) {
            throw new RuntimeException("La fecha de inicio debe ser anterior a la fecha de cierre");
        }

        if (request.getFechaInicio().isBefore(LocalDateTime.now().plusMinutes(30))) {
            throw new RuntimeException("La fecha de inicio debe ser al menos 30 minutos en el futuro");
        }

        // Crear quiniela
        Quiniela quiniela = new Quiniela();
        quiniela.setNombre(request.getNombre());
        quiniela.setDescripcion(request.getDescripcion());
        quiniela.setTipoQuiniela(request.getTipoQuiniela());
        quiniela.setTipoDistribucion(request.getTipoDistribucion());
        quiniela.setCostoParticipacion(request.getCostoParticipacion());
        quiniela.setPremioMinimo(request.getPremioMinimo());
        quiniela.setMaxParticipantes(request.getMaxParticipantes());
        quiniela.setFechaInicio(request.getFechaInicio());
        quiniela.setFechaCierre(request.getFechaCierre());
        quiniela.setCreadorId(request.getCreadorId());
        quiniela.setEsPublica(request.getEsPublica());
        quiniela.setRequiereAprobacion(request.getRequiereAprobacion());
        quiniela.setReglasEspeciales(request.getReglasEspeciales());
        quiniela.setRequiereMinParticipantes(request.getRequiereMinParticipantes());
        
        // Configurar porcentajes
        if (request.getPorcentajeCasa() != null) {
            quiniela.setPorcentajeCasa(request.getPorcentajeCasa());
        }
        if (request.getPorcentajeCreador() != null) {
            quiniela.setPorcentajeCreador(request.getPorcentajeCreador());
        }

        // Configurar distribución personalizada si aplica
        if (request.getTipoDistribucion() == Quiniela.TipoDistribucion.PERSONALIZADA) {
            try {
                String config = objectMapper.writeValueAsString(request.getConfiguracionDistribucion());
                quiniela.setConfiguracionDistribucion(config);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error al procesar configuración de distribución", e);
            }
        }

        // Estado inicial
        quiniela.setEstado(Quiniela.EstadoQuiniela.BORRADOR);

        return quinielaRepository.save(quiniela);
    }

    /**
     * Activar una quiniela (cambiar de BORRADOR a ACTIVA)
     */
    public Quiniela activarQuiniela(Long quinielaId, Long usuarioId) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        // Validar que el usuario sea el creador
        if (!quiniela.getCreadorId().equals(usuarioId)) {
            throw new RuntimeException("Solo el creador puede activar la quiniela");
        }

        // Validar estado actual
        if (quiniela.getEstado() != Quiniela.EstadoQuiniela.BORRADOR) {
            throw new RuntimeException("Solo se pueden activar quinielas en estado BORRADOR");
        }

        // Validar que tenga eventos asociados
        if (quiniela.getEventos() == null || quiniela.getEventos().isEmpty()) {
            throw new RuntimeException("La quiniela debe tener al menos un evento asociado");
        }

        quiniela.setEstado(Quiniela.EstadoQuiniela.ACTIVA);
        return quinielaRepository.save(quiniela);
    }

    /**
     * Participar en una quiniela
     */
    public QuinielaParticipacion participarEnQuiniela(Long quinielaId, Long usuarioId) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validaciones
        validarParticipacion(quiniela, usuario);

        // Verificar que el usuario no esté ya participando
        if (participacionRepository.existsByQuinielaAndUsuario(quiniela, usuario)) {
            throw new RuntimeException("El usuario ya está participando en esta quiniela");
        }

        // Procesar pago
        walletService.procesarPagoParticipacion(usuario, quiniela.getCostoParticipacion(), 
                "Participación en quiniela: " + quiniela.getNombre());

        // Crear participación
        QuinielaParticipacion participacion = new QuinielaParticipacion();
        participacion.setQuiniela(quiniela);
        participacion.setUsuario(usuario);
        participacion.setFechaParticipacion(LocalDateTime.now());
        participacion.setMontoApostado(quiniela.getCostoParticipacion());
        participacion.setEstado(QuinielaParticipacion.EstadoParticipacion.ACTIVA);

        // Actualizar contadores de la quiniela
        quiniela.setParticipantesActuales(quiniela.getParticipantesActuales() + 1);
        quiniela.setPoolActual(quiniela.getPoolActual().add(quiniela.getCostoParticipacion()));

        quinielaRepository.save(quiniela);
        QuinielaParticipacion savedParticipacion = participacionRepository.save(participacion);

        // Notificar participación exitosa
        notificationService.notificarParticipacionExitosa(usuario, quiniela);

        return savedParticipacion;
    }

    /**
     * Realizar predicciones para una participación
     */
    public List<PrediccionEvento> realizarPredicciones(Long participacionId, 
                                                      List<PrediccionRequest> predicciones) {
        QuinielaParticipacion participacion = participacionRepository.findById(participacionId)
                .orElseThrow(() -> new RuntimeException("Participación no encontrada"));

        // Validar que la quiniela esté activa y no cerrada
        if (participacion.getQuiniela().getEstado() != Quiniela.EstadoQuiniela.ACTIVA) {
            throw new RuntimeException("La quiniela no está disponible para predicciones");
        }

        if (LocalDateTime.now().isAfter(participacion.getQuiniela().getFechaCierre())) {
            throw new RuntimeException("El tiempo para realizar predicciones ha expirado");
        }

        List<PrediccionEvento> prediccionesGuardadas = new ArrayList<>();

        for (PrediccionRequest prediccionRequest : predicciones) {
            // Verificar que el evento pertenezca a la quiniela
            QuinielaEvento quinielaEvento = participacion.getQuiniela().getEventos().stream()
                    .filter(qe -> qe.getEventoDeportivo().getId().equals(prediccionRequest.getEventoId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Evento no pertenece a esta quiniela"));

            // Crear o actualizar predicción
            PrediccionEvento prediccion = prediccionRepository
                    .findByParticipacionAndEventoDeportivo_Id(participacion, prediccionRequest.getEventoId())
                    .orElse(new PrediccionEvento());

            prediccion.setParticipacion(participacion);
            prediccion.setEventoDeportivo(quinielaEvento.getEventoDeportivo());
            prediccion.setPrediccion(prediccionRequest.getPrediccion());
            prediccion.setConfianza(prediccionRequest.getConfianza());
            prediccion.setFechaPrediccion(LocalDateTime.now());

            prediccionesGuardadas.add(prediccionRepository.save(prediccion));
        }

        // Marcar participación como completa si tiene todas las predicciones
        long prediccionesTotales = participacion.getQuiniela().getEventos().size();
        long prediccionesRealizadas = prediccionRepository.countByParticipacion(participacion);
        
        if (prediccionesRealizadas >= prediccionesTotales) {
            participacion.setEstado(QuinielaParticipacion.EstadoParticipacion.PREDICCIONES_COMPLETADAS);
            participacionRepository.save(participacion);
        }

        return prediccionesGuardadas;
    }

    /**
     * Procesar resultados de una quiniela
     */
    public void procesarResultados(Long quinielaId) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        if (quiniela.getEstado() != Quiniela.EstadoQuiniela.CERRADA) {
            throw new RuntimeException("La quiniela debe estar cerrada para procesar resultados");
        }

        // Verificar que todos los eventos tengan resultados
        boolean todosEventosFinalizados = quiniela.getEventos().stream()
                .allMatch(qe -> qe.getEventoDeportivo().getResultado() != null);

        if (!todosEventosFinalizados) {
            throw new RuntimeException("No todos los eventos tienen resultados disponibles");
        }

        // Calcular aciertos para cada participación
        List<QuinielaParticipacion> participaciones = participacionRepository
                .findByQuinielaAndEstado(quiniela, QuinielaParticipacion.EstadoParticipacion.PREDICCIONES_COMPLETADAS);

        for (QuinielaParticipacion participacion : participaciones) {
            int aciertos = calcularAciertos(participacion);
            participacion.setAciertos(aciertos);
            participacion.setPuntuacion(calcularPuntuacion(participacion, aciertos));
            participacionRepository.save(participacion);
        }

        // Distribuir premios según el tipo de distribución
        distribuirPremios(quiniela);

        // Actualizar estado de la quiniela
        quiniela.setEstado(Quiniela.EstadoQuiniela.FINALIZADA);
        quiniela.setFechaResultados(LocalDateTime.now());
        quinielaRepository.save(quiniela);

        // Notificar resultados
        notificationService.notificarResultadosQuiniela(quiniela);
    }

    /**
     * Obtener quinielas activas paginadas
     */
    @Transactional(readOnly = true)
    public Page<Quiniela> obtenerQuinielasActivas(Pageable pageable) {
        return quinielaRepository.findByEstadoAndEsPublica(
                Quiniela.EstadoQuiniela.ACTIVA, true, pageable);
    }

    /**
     * Obtener ranking de una quiniela
     */
    @Transactional(readOnly = true)
    public List<RankingParticipacionDto> obtenerRanking(Long quinielaId) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        List<RankingParticipacionDto> ranking = participacionRepository.findRankingByQuiniela(quinielaId);
        
        // Asignar posiciones manualmente
        for (int i = 0; i < ranking.size(); i++) {
            ranking.get(i).setPosicion(i + 1);
        }
        
        return ranking;
    }

    // Métodos privados auxiliares

    private void validarParticipacion(Quiniela quiniela, Usuario usuario) {
        // Validar estado de la quiniela
        if (quiniela.getEstado() != Quiniela.EstadoQuiniela.ACTIVA) {
            throw new RuntimeException("La quiniela no está activa");
        }

        // Validar fechas
        LocalDateTime ahora = LocalDateTime.now();
        if (ahora.isBefore(quiniela.getFechaInicio())) {
            throw new RuntimeException("La quiniela aún no ha iniciado");
        }
        if (ahora.isAfter(quiniela.getFechaCierre())) {
            throw new RuntimeException("El tiempo para participar ha expirado");
        }

        // Validar límite de participantes
        if (quiniela.getMaxParticipantes() != null && 
            quiniela.getParticipantesActuales() >= quiniela.getMaxParticipantes()) {
            throw new RuntimeException("Se ha alcanzado el límite máximo de participantes");
        }

        // Validar saldo del usuario
        if (usuario.getSaldoUsuario().compareTo(quiniela.getCostoParticipacion()) < 0) {
            throw new RuntimeException("Saldo insuficiente para participar");
        }

        // Validar estado de la cuenta
        if (!usuario.getEstadoCuenta()) {
            throw new RuntimeException("La cuenta del usuario está inactiva");
        }
    }

    private int calcularAciertos(QuinielaParticipacion participacion) {
        List<PrediccionEvento> predicciones = prediccionRepository
                .findByParticipacion(participacion);

        int aciertos = 0;
        for (PrediccionEvento prediccion : predicciones) {
            String resultado = prediccion.getEventoDeportivo().getResultado();
            if (resultado != null && resultado.equals(prediccion.getPrediccion())) {
                aciertos++;
            }
        }
        return aciertos;
    }

    private BigDecimal calcularPuntuacion(QuinielaParticipacion participacion, int aciertos) {
        // Puntuación base por aciertos
        BigDecimal puntuacionBase = new BigDecimal(aciertos * 100);

        // Bonificación por confianza (si aplica)
        List<PrediccionEvento> predicciones = prediccionRepository
                .findByParticipacion(participacion);

        BigDecimal bonusConfianza = BigDecimal.ZERO;
        for (PrediccionEvento prediccion : predicciones) {
            if (prediccion.getEventoDeportivo().getResultado() != null && 
                prediccion.getEventoDeportivo().getResultado().equals(prediccion.getPrediccion())) {
                
                if (prediccion.getConfianza() != null) {
                    bonusConfianza = bonusConfianza.add(
                        new BigDecimal(prediccion.getConfianza()).multiply(new BigDecimal("0.5"))
                    );
                }
            }
        }

        return puntuacionBase.add(bonusConfianza);
    }

    private void distribuirPremios(Quiniela quiniela) {
        List<QuinielaParticipacion> participaciones = participacionRepository
                .findByQuinielaOrderByPuntuacionDescAciertosDesc(quiniela);

        if (participaciones.isEmpty()) {
            return;
        }

        BigDecimal poolTotal = quiniela.getPoolActual();
        BigDecimal comisionCasa = poolTotal.multiply(quiniela.getPorcentajeCasa())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal comisionCreador = poolTotal.multiply(quiniela.getPorcentajeCreador())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        
        BigDecimal poolParaPremios = poolTotal.subtract(comisionCasa).subtract(comisionCreador);

        // Aplicar distribución según tipo
        switch (quiniela.getTipoDistribucion()) {
            case WINNER_TAKES_ALL -> distribuirGanadorUnico(participaciones, poolParaPremios);
            case TOP_3_CLASICA -> distribuirTop3Clasica(participaciones, poolParaPremios);
            case TOP_5_PIRAMIDE -> distribuirTop5Piramide(participaciones, poolParaPremios);
            case POR_ACIERTOS_PROGRESIVO -> distribuirPorAciertos(participaciones, poolParaPremios);
            // Implementar otros tipos según necesidad
            default -> distribuirGanadorUnico(participaciones, poolParaPremios);
        }

        // Procesar comisiones
        procesarComisiones(quiniela, comisionCasa, comisionCreador);
    }

    private void distribuirGanadorUnico(List<QuinielaParticipacion> participaciones, BigDecimal pool) {
        QuinielaParticipacion ganador = participaciones.get(0);
        ganador.setPremioGanado(pool);
        participacionRepository.save(ganador);

        // Procesar pago del premio
        walletService.procesarPagoPremio(ganador.getUsuario(), pool, 
                "Premio quiniela: " + ganador.getQuiniela().getNombre());
    }

    private void distribuirTop3Clasica(List<QuinielaParticipacion> participaciones, BigDecimal pool) {
        if (participaciones.size() >= 1) {
            BigDecimal premio1 = pool.multiply(new BigDecimal("0.60"));
            participaciones.get(0).setPremioGanado(premio1);
            walletService.procesarPagoPremio(participaciones.get(0).getUsuario(), premio1, 
                    "Primer lugar - " + participaciones.get(0).getQuiniela().getNombre());
        }
        
        if (participaciones.size() >= 2) {
            BigDecimal premio2 = pool.multiply(new BigDecimal("0.25"));
            participaciones.get(1).setPremioGanado(premio2);
            walletService.procesarPagoPremio(participaciones.get(1).getUsuario(), premio2, 
                    "Segundo lugar - " + participaciones.get(1).getQuiniela().getNombre());
        }
        
        if (participaciones.size() >= 3) {
            BigDecimal premio3 = pool.multiply(new BigDecimal("0.15"));
            participaciones.get(2).setPremioGanado(premio3);
            walletService.procesarPagoPremio(participaciones.get(2).getUsuario(), premio3, 
                    "Tercer lugar - " + participaciones.get(2).getQuiniela().getNombre());
        }

        participacionRepository.saveAll(participaciones.subList(0, Math.min(3, participaciones.size())));
    }

    private void distribuirTop5Piramide(List<QuinielaParticipacion> participaciones, BigDecimal pool) {
        BigDecimal[] porcentajes = {
                new BigDecimal("0.40"), // 1er lugar: 40%
                new BigDecimal("0.25"), // 2do lugar: 25%
                new BigDecimal("0.15"), // 3er lugar: 15%
                new BigDecimal("0.12"), // 4to lugar: 12%
                new BigDecimal("0.08")  // 5to lugar: 8%
        };

        for (int i = 0; i < Math.min(5, participaciones.size()); i++) {
            BigDecimal premio = pool.multiply(porcentajes[i]);
            participaciones.get(i).setPremioGanado(premio);
            walletService.procesarPagoPremio(participaciones.get(i).getUsuario(), premio, 
                    "Premio posición " + (i + 1) + " - " + participaciones.get(i).getQuiniela().getNombre());
        }

        participacionRepository.saveAll(participaciones.subList(0, Math.min(5, participaciones.size())));
    }

    private void distribuirPorAciertos(List<QuinielaParticipacion> participaciones, BigDecimal pool) {
        // Agrupar por número de aciertos
        Map<Integer, List<QuinielaParticipacion>> gruposPorAciertos = new HashMap<>();
        for (QuinielaParticipacion p : participaciones) {
            gruposPorAciertos.computeIfAbsent(p.getAciertos(), k -> new ArrayList<>()).add(p);
        }

        // Obtener grupos ordenados por aciertos (descendente)
        List<Integer> aciertosSorted = gruposPorAciertos.keySet().stream()
                .sorted(Collections.reverseOrder())
                .toList();

        BigDecimal poolRestante = pool;
        BigDecimal[] porcentajesPorGrupo = {
                new BigDecimal("0.50"), // Máximo aciertos: 50%
                new BigDecimal("0.30"), // Segundo grupo: 30%
                new BigDecimal("0.20")  // Tercer grupo: 20%
        };

        for (int i = 0; i < Math.min(3, aciertosSorted.size()); i++) {
            Integer aciertos = aciertosSorted.get(i);
            List<QuinielaParticipacion> grupo = gruposPorAciertos.get(aciertos);
            
            BigDecimal premioGrupo = pool.multiply(porcentajesPorGrupo[i]);
            BigDecimal premioIndividual = premioGrupo.divide(
                    new BigDecimal(grupo.size()), 2, RoundingMode.HALF_UP);

            for (QuinielaParticipacion participacion : grupo) {
                participacion.setPremioGanado(premioIndividual);
                walletService.procesarPagoPremio(participacion.getUsuario(), premioIndividual, 
                        "Premio por " + aciertos + " aciertos - " + participacion.getQuiniela().getNombre());
            }

            participacionRepository.saveAll(grupo);
        }
    }

    private void procesarComisiones(Quiniela quiniela, BigDecimal comisionCasa, BigDecimal comisionCreador) {
        // Comisión de la casa (se puede procesar internamente)
        log.info("Comisión de la casa: {} para quiniela {}", comisionCasa, quiniela.getId());

        // Comisión del creador
        if (comisionCreador.compareTo(BigDecimal.ZERO) > 0) {
            Usuario creador = usuarioRepository.findById(quiniela.getCreadorId()).orElse(null);
            if (creador != null) {
                walletService.procesarPagoPremio(creador, comisionCreador, 
                        "Comisión por crear quiniela: " + quiniela.getNombre());
            }
        }
    }
}
