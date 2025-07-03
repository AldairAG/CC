package com.example.cc.service.apuestas;

import com.example.cc.entities.CuotaEvento;
import com.example.cc.entities.EventoDeportivo;
import com.example.cc.repository.CuotaEventoRepository;
import com.example.cc.repository.EventoDeportivoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class CuotaEventoService {

    private final CuotaEventoRepository cuotaEventoRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;
    private final Random random = new Random();

    /**
     * Obtener cuotas para un evento deportivo
     */
    public List<CuotaEvento> getCuotasByEventoId(Long eventoId) {
        return cuotaEventoRepository.findActiveByEventoId(eventoId);
    }

    /**
     * Generar cuotas para un evento deportivo
     */
    @Transactional
    public List<CuotaEvento> generarCuotasParaEvento(Long eventoId) {
        EventoDeportivo evento = eventoDeportivoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + eventoId));

        // Verificar si ya existen cuotas para este evento
        List<CuotaEvento> cuotasExistentes = cuotaEventoRepository.findByEventoDeportivo(evento);
        if (!cuotasExistentes.isEmpty()) {
            return cuotasExistentes;
        }

        // Generar cuotas para los tres posibles resultados (LOCAL, VISITANTE, EMPATE)
        CuotaEvento cuotaLocal = new CuotaEvento();
        cuotaLocal.setEventoDeportivo(evento);
        cuotaLocal.setTipoResultado(CuotaEvento.TipoResultado.LOCAL);
        cuotaLocal.setValorCuota(generarCuotaAleatoria(1.5, 3.5));
        cuotaLocal.setEstado("ACTIVA");

        CuotaEvento cuotaVisitante = new CuotaEvento();
        cuotaVisitante.setEventoDeportivo(evento);
        cuotaVisitante.setTipoResultado(CuotaEvento.TipoResultado.VISITANTE);
        cuotaVisitante.setValorCuota(generarCuotaAleatoria(1.8, 4.0));
        cuotaVisitante.setEstado("ACTIVA");

        CuotaEvento cuotaEmpate = new CuotaEvento();
        cuotaEmpate.setEventoDeportivo(evento);
        cuotaEmpate.setTipoResultado(CuotaEvento.TipoResultado.EMPATE);
        cuotaEmpate.setValorCuota(generarCuotaAleatoria(2.0, 4.5));
        cuotaEmpate.setEstado("ACTIVA");

        // Guardar las cuotas
        cuotaEventoRepository.saveAll(List.of(cuotaLocal, cuotaVisitante, cuotaEmpate));
        log.info("Cuotas generadas para evento: {}", evento.getNombreEvento());

        return List.of(cuotaLocal, cuotaVisitante, cuotaEmpate);
    }

    /**
     * Actualizar cuotas de un evento
     */
    @Transactional
    public void actualizarCuotas(Long eventoId, BigDecimal cuotaLocal, BigDecimal cuotaVisitante, BigDecimal cuotaEmpate) {
        EventoDeportivo evento = eventoDeportivoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + eventoId));

        Optional<CuotaEvento> cuotaLocalOpt = cuotaEventoRepository.findByEventoDeportivoAndTipoResultado(evento, CuotaEvento.TipoResultado.LOCAL);
        Optional<CuotaEvento> cuotaVisitanteOpt = cuotaEventoRepository.findByEventoDeportivoAndTipoResultado(evento, CuotaEvento.TipoResultado.VISITANTE);
        Optional<CuotaEvento> cuotaEmpateOpt = cuotaEventoRepository.findByEventoDeportivoAndTipoResultado(evento, CuotaEvento.TipoResultado.EMPATE);

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
     * Genera una cuota aleatoria dentro de un rango, redondeada a dos decimales
     */
    private BigDecimal generarCuotaAleatoria(double min, double max) {
        double valor = min + (random.nextDouble() * (max - min));
        return BigDecimal.valueOf(valor).setScale(2, RoundingMode.HALF_UP);
    }
}
