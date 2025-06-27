package com.example.cc.service.quinielaEventoStats;

import com.example.cc.entities.QuinielaEvento;
import com.example.cc.repository.PrediccionEventoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuinielaEventoStatsService implements IQuinielaEventoStatsService {

    private final PrediccionEventoRepository prediccionRepository;

    /**
     * Obtener total de predicciones para un evento específico en una quiniela
     */
    public int getTotalPrediccionesParaEvento(Long eventoDeportivoId, Long quinielaId) {
        return prediccionRepository.countByEventoDeportivo_IdAndParticipacion_Quiniela_Id(
                eventoDeportivoId, quinielaId);
    }

    /**
     * Obtener total de predicciones correctas para un evento específico
     */
    public long getTotalPrediccionesCorrectasParaEvento(Long eventoDeportivoId, Long quinielaId) {
        return prediccionRepository.countByEventoDeportivo_IdAndParticipacion_Quiniela_IdAndEsCorrecto(
                eventoDeportivoId, quinielaId, true);
    }

    /**
     * Calcular porcentaje de aciertos para un evento
     */
    public BigDecimal getPorcentajeAciertosParaEvento(Long eventoDeportivoId, Long quinielaId) {
        int totalPredicciones = getTotalPrediccionesParaEvento(eventoDeportivoId, quinielaId);
        if (totalPredicciones == 0) {
            return BigDecimal.ZERO;
        }
        
        long prediccionesCorrectas = getTotalPrediccionesCorrectasParaEvento(eventoDeportivoId, quinielaId);
        
        return BigDecimal.valueOf(prediccionesCorrectas)
                .divide(BigDecimal.valueOf(totalPredicciones), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    /**
     * Obtener estadísticas completas para un QuinielaEvento
     */
    public QuinielaEventoStats getEstadisticas(QuinielaEvento quinielaEvento) {
        Long eventoId = quinielaEvento.getEventoDeportivo().getId();
        Long quinielaId = quinielaEvento.getQuiniela().getId();
        
        int totalPredicciones = getTotalPrediccionesParaEvento(eventoId, quinielaId);
        long prediccionesCorrectas = getTotalPrediccionesCorrectasParaEvento(eventoId, quinielaId);
        BigDecimal porcentajeAciertos = getPorcentajeAciertosParaEvento(eventoId, quinielaId);
        
        return new QuinielaEventoStats(totalPredicciones, prediccionesCorrectas, porcentajeAciertos);
    }

    /**
     * Clase para encapsular las estadísticas
     */
    public static class QuinielaEventoStats {
        private final int totalPredicciones;
        private final long prediccionesCorrectas;
        private final BigDecimal porcentajeAciertos;

        public QuinielaEventoStats(int totalPredicciones, long prediccionesCorrectas, BigDecimal porcentajeAciertos) {
            this.totalPredicciones = totalPredicciones;
            this.prediccionesCorrectas = prediccionesCorrectas;
            this.porcentajeAciertos = porcentajeAciertos;
        }

        public int getTotalPredicciones() { return totalPredicciones; }
        public long getPrediccionesCorrectas() { return prediccionesCorrectas; }
        public BigDecimal getPorcentajeAciertos() { return porcentajeAciertos; }
    }
}
