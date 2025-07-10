package com.example.cc.service.apuestas;

import com.example.cc.entities.CuotaEvento;
import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.TipoResultado;
import com.example.cc.repository.CuotaEventoRepository;
import com.example.cc.repository.EventoDeportivoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CuotaEventoService {

    private final CuotaEventoRepository cuotaEventoRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;
    private final CuotaGeneratorService cuotaGeneratorService;

    /**
     * Obtener cuotas para un evento deportivo
     */
    public List<CuotaEvento> getCuotasByEventoId(Long eventoId) {
        return cuotaEventoRepository.findActiveByEventoId(eventoId);
    }

    /**
     * Obtener cuotas para un evento deportivo filtradas por mercado
     */
    public List<CuotaEvento> getCuotasByEventoIdAndMercado(Long eventoId, String mercado) {
        List<CuotaEvento> todasLasCuotas = cuotaEventoRepository.findActiveByEventoId(eventoId);
        return todasLasCuotas.stream()
                .filter(cuota -> cuota.getTipoResultado().getMercado().equals(mercado))
                .collect(Collectors.toList());
    }

    /**
     * Obtener cuotas agrupadas por mercado para un evento
     */
    public Map<String, List<CuotaEvento>> getCuotasAgrupadasPorMercado(Long eventoId) {
        List<CuotaEvento> todasLasCuotas = cuotaEventoRepository.findActiveByEventoId(eventoId);
        return todasLasCuotas.stream()
                .collect(Collectors.groupingBy(
                    cuota -> cuota.getTipoResultado().getMercado()
                ));
    }

    /**
     * Generar cuotas para un evento deportivo - TODOS LOS MERCADOS
     */
    @Transactional
    public List<CuotaEvento> generarCuotasParaEvento(Long eventoId) {
        EventoDeportivo evento = eventoDeportivoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + eventoId));

        // Verificar si ya existen cuotas para este evento
        List<CuotaEvento> cuotasExistentes = cuotaEventoRepository.findByEventoDeportivo(evento);
        if (!cuotasExistentes.isEmpty()) {
            log.info("Ya existen {} cuotas para evento: {}", cuotasExistentes.size(), evento.getNombreEvento());
            return cuotasExistentes;
        }

        // Generar cuotas para TODOS los tipos de resultado disponibles
        List<CuotaEvento> cuotasNuevas = new ArrayList<>();
        List<TipoResultado> todosLosTipos = cuotaGeneratorService.getAllTiposResultado();
        
        for (TipoResultado tipoResultado : todosLosTipos) {
            CuotaEvento cuota = new CuotaEvento();
            cuota.setEventoDeportivo(evento);
            cuota.setTipoResultado(tipoResultado);
            cuota.setValorCuota(cuotaGeneratorService.generarCuotaParaTipo(tipoResultado));
            cuota.setEstado("ACTIVA");
            cuotasNuevas.add(cuota);
        }

        // Guardar todas las cuotas
        cuotaEventoRepository.saveAll(cuotasNuevas);
        log.info("Generadas {} cuotas para evento: {} - Mercados: {}", 
                cuotasNuevas.size(), evento.getNombreEvento(), 
                cuotasNuevas.stream().map(c -> c.getTipoResultado().getMercado()).distinct().count());

        return cuotasNuevas;
    }

    /**
     * Actualizar cuotas de un evento
     */
    @Transactional
    public void actualizarCuotas(Long eventoId, BigDecimal cuotaLocal, BigDecimal cuotaVisitante, BigDecimal cuotaEmpate) {
        EventoDeportivo evento = eventoDeportivoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + eventoId));

        Optional<CuotaEvento> cuotaLocalOpt = cuotaEventoRepository.findByEventoDeportivoAndTipoResultado(evento, TipoResultado.LOCAL);
        Optional<CuotaEvento> cuotaVisitanteOpt = cuotaEventoRepository.findByEventoDeportivoAndTipoResultado(evento, TipoResultado.VISITANTE);
        Optional<CuotaEvento> cuotaEmpateOpt = cuotaEventoRepository.findByEventoDeportivoAndTipoResultado(evento, TipoResultado.EMPATE);

        if (cuotaLocalOpt.isPresent()) {
            CuotaEvento cuota = cuotaLocalOpt.get();
            cuota.setValorCuota(cuotaLocal);
            cuotaEventoRepository.save(cuota);
        }

        if (cuotaVisitanteOpt.isPresent()) {
            CuotaEvento cuota = cuotaVisitanteOpt.get();
            cuota.setValorCuota(cuotaVisitante);
            cuotaEventoRepository.save(cuota);
        }

        if (cuotaEmpateOpt.isPresent()) {
            CuotaEvento cuota = cuotaEmpateOpt.get();
            cuota.setValorCuota(cuotaEmpate);
            cuotaEventoRepository.save(cuota);
        }

        log.info("Cuotas actualizadas para evento: {}", evento.getNombreEvento());
    }

    /**
     * Cerrar cuotas de un evento
     */
    @Transactional
    public void cerrarCuotasEvento(Long eventoId) {
        cuotaEventoRepository.updateEstadoByEventoId(eventoId, "CERRADA");
        log.info("Cuotas cerradas para evento ID: {}", eventoId);
    }

    /**
     * Generar cuotas básicas para un evento deportivo (solo 1X2)
     * Método legacy para compatibilidad
     */
    @Transactional
    public List<CuotaEvento> generarCuotasBasicasParaEvento(Long eventoId) {
        EventoDeportivo evento = eventoDeportivoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + eventoId));

        // Generar solo cuotas básicas (1X2)
        List<CuotaEvento> cuotasBasicas = new ArrayList<>();
        
        // Crear cuotas para LOCAL, VISITANTE, EMPATE
        TipoResultado[] tiposBasicos = {TipoResultado.LOCAL, TipoResultado.VISITANTE, TipoResultado.EMPATE};
        
        for (TipoResultado tipo : tiposBasicos) {
            CuotaEvento cuota = new CuotaEvento();
            cuota.setEventoDeportivo(evento);
            cuota.setTipoResultado(tipo);
            cuota.setValorCuota(cuotaGeneratorService.generarCuotaParaTipo(tipo));
            cuota.setEstado("ACTIVA");
            cuotasBasicas.add(cuota);
        }

        cuotaEventoRepository.saveAll(cuotasBasicas);
        log.info("Cuotas básicas generadas para evento: {}", evento.getNombreEvento());

        return cuotasBasicas;
    }
}
