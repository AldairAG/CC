package com.example.cc.service.quinielaEventoStats;

import com.example.cc.entities.QuinielaEvento;

import java.math.BigDecimal;

/**
 * Interfaz para el servicio de estadísticas de eventos de quiniela
 */
public interface IQuinielaEventoStatsService {

    /**
     * Obtener total de predicciones para un evento específico en una quiniela
     * @param eventoDeportivoId ID del evento deportivo
     * @param quinielaId ID de la quiniela
     * @return Número total de predicciones
     */
    int getTotalPrediccionesParaEvento(Long eventoDeportivoId, Long quinielaId);

    /**
     * Obtener total de predicciones correctas para un evento específico
     * @param eventoDeportivoId ID del evento deportivo
     * @param quinielaId ID de la quiniela
     * @return Número de predicciones correctas
     */
    long getTotalPrediccionesCorrectasParaEvento(Long eventoDeportivoId, Long quinielaId);

    /**
     * Obtener porcentaje de aciertos para un evento específico
     * @param eventoDeportivoId ID del evento deportivo
     * @param quinielaId ID de la quiniela
     * @return Porcentaje de aciertos
     */
    BigDecimal getPorcentajeAciertosParaEvento(Long eventoDeportivoId, Long quinielaId);

    /**
     * Obtener estadísticas completas de un evento de quiniela
     * @param quinielaEvento Evento de quiniela
     * @return Estadísticas del evento
     */
    QuinielaEventoStatsService.QuinielaEventoStats getEstadisticas(QuinielaEvento quinielaEvento);
}
