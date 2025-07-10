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
@Transactional
public class CuotaEventoService {

    private final CuotaEventoRepository cuotaEventoRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;
    private final CuotaGeneratorService cuotaGeneratorService;

    /**
     * Obtener cuotas para un evento deportivo
     */
    @Transactional(readOnly = true)
    public List<CuotaEvento> getCuotasByEventoId(Long eventoId) {
        return cuotaEventoRepository.findActiveByEventoId(eventoId);
    }

    /**
     * Obtener cuotas para un evento deportivo filtradas por mercado
     */
    @Transactional(readOnly = true)
    public List<CuotaEvento> getCuotasByEventoIdAndMercado(Long eventoId, String mercado) {
        List<CuotaEvento> todasLasCuotas = cuotaEventoRepository.findActiveByEventoId(eventoId);
        return todasLasCuotas.stream()
                .filter(cuota -> cuota.getTipoResultado().getMercado().equals(mercado))
                .collect(Collectors.toList());
    }

    /**
     * Obtener cuotas agrupadas por mercado para un evento
     */
    @Transactional(readOnly = true)
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
        List<TipoResultado> todosLosTipos = cuotaGeneratorService.getAllTiposResultado();
        
        // Verificar si existen cuotas para TODOS los tipos de resultado
        if (!cuotasExistentes.isEmpty()) {
            List<TipoResultado> tiposExistentes = cuotasExistentes.stream()
                    .map(CuotaEvento::getTipoResultado)
                    .collect(Collectors.toList());
            
            // Si ya existen cuotas para todos los tipos, retornar las existentes
            if (tiposExistentes.containsAll(todosLosTipos)) {
                log.info("Ya existen cuotas completas para evento: {} ({} tipos)", 
                        evento.getNombreEvento(), cuotasExistentes.size());
                return cuotasExistentes;
            } else {
                // Faltan algunos tipos de cuotas, generar solo las faltantes
                List<TipoResultado> tiposFaltantes = todosLosTipos.stream()
                        .filter(tipo -> !tiposExistentes.contains(tipo))
                        .collect(Collectors.toList());
                
                log.info("Faltan {} tipos de cuotas para evento: {}. Generando faltantes...", 
                        tiposFaltantes.size(), evento.getNombreEvento());
                
                // Generar solo las cuotas faltantes
                List<CuotaEvento> cuotasFaltantes = new ArrayList<>();
                for (TipoResultado tipoFaltante : tiposFaltantes) {
                    CuotaEvento cuota = new CuotaEvento();
                    cuota.setEventoDeportivo(evento);
                    cuota.setTipoResultado(tipoFaltante);
                    cuota.setValorCuota(cuotaGeneratorService.generarCuotaParaTipo(tipoFaltante));
                    cuota.setEstado("ACTIVA");
                    cuotasFaltantes.add(cuota);
                }
                
                // Guardar las cuotas faltantes usando método optimizado
                guardarCuotasEnLotesOptimizado(cuotasFaltantes, "Cuotas faltantes para evento: " + evento.getNombreEvento());
                cuotasExistentes.addAll(cuotasFaltantes);
                
                log.info("Generadas {} cuotas faltantes. Total cuotas: {}", 
                        cuotasFaltantes.size(), cuotasExistentes.size());
                return cuotasExistentes;
            }
        }

        // Generar cuotas para TODOS los tipos de resultado disponibles
        List<CuotaEvento> cuotasNuevas = new ArrayList<>();
        
        for (TipoResultado tipoResultado : todosLosTipos) {
            CuotaEvento cuota = new CuotaEvento();
            cuota.setEventoDeportivo(evento);
            cuota.setTipoResultado(tipoResultado);
            cuota.setValorCuota(cuotaGeneratorService.generarCuotaParaTipo(tipoResultado));
            cuota.setEstado("ACTIVA");
            cuotasNuevas.add(cuota);
        }

        // Guardar todas las cuotas usando método optimizado
        guardarCuotasEnLotesOptimizado(cuotasNuevas, "Cuotas nuevas para evento: " + evento.getNombreEvento());
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

        // Guardar cuotas básicas (siempre son pocas, no necesita lotes)
        cuotaEventoRepository.saveAll(cuotasBasicas);
        cuotaEventoRepository.flush(); // Asegurar escritura inmediata
        log.info("Cuotas básicas generadas para evento: {}", evento.getNombreEvento());

        return cuotasBasicas;
    }

    /**
     * Método optimizado para guardar cuotas en lotes con mejor rendimiento
     */
    @Transactional
    private void guardarCuotasEnLotesOptimizado(List<CuotaEvento> cuotas, String contexto) {
        if (cuotas.isEmpty()) {
            return;
        }
        
        try {
            log.info("Guardando {} cuotas en lotes optimizados - {}", cuotas.size(), contexto);
            
            // Configurar tamaño de lote basado en el número de cuotas
            int batchSize = cuotas.size() > 50 ? 15 : 25;
            int totalBatches = (int) Math.ceil((double) cuotas.size() / batchSize);
            
            for (int i = 0; i < totalBatches; i++) {
                int fromIndex = i * batchSize;
                int toIndex = Math.min((i + 1) * batchSize, cuotas.size());
                
                List<CuotaEvento> lote = cuotas.subList(fromIndex, toIndex);
                
                // Guardar el lote
                cuotaEventoRepository.saveAll(lote);
                
                // Forzar escritura y limpiar caché cada cierto número de lotes
                if (i % 3 == 0 || i == totalBatches - 1) {
                    cuotaEventoRepository.flush();
                }
                
                // Pausa adaptativa basada en el tamaño del lote
                if (i < totalBatches - 1) {
                    Thread.sleep(cuotas.size() > 50 ? 20 : 10);
                }
                
                log.debug("Lote {}/{} completado - {} cuotas", i + 1, totalBatches, lote.size());
            }
            
            // Flush final para asegurar persistencia
            cuotaEventoRepository.flush();
            log.info("Guardado optimizado completado - {} cuotas en {} lotes", cuotas.size(), totalBatches);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Proceso interrumpido durante guardado de cuotas: {}", e.getMessage());
            throw new RuntimeException("Proceso interrumpido durante guardado de cuotas", e);
        } catch (Exception e) {
            log.error("Error durante guardado optimizado de cuotas - {}: {}", contexto, e.getMessage(), e);
            throw new RuntimeException("Error al guardar cuotas: " + contexto, e);
        }
    }
}
