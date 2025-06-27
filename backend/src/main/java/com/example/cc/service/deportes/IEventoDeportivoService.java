package com.example.cc.service.deportes;

import com.example.cc.entities.EventoDeportivo;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Interfaz para el servicio de eventos deportivos
 */
public interface IEventoDeportivoService {

    /**
     * Sincronizar eventos deportivos desde fuentes externas
     */
    void sincronizarEventosDeportivos();

    /**
     * Limpiar eventos deportivos antiguos
     */
    void limpiarEventosAntiguos();

    /**
     * Obtener eventos por rango de fechas
     * @param fechaInicio Fecha de inicio del rango
     * @param fechaFin Fecha de fin del rango
     * @return Lista de eventos en el rango
     */
    List<EventoDeportivo> getEventosPorFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin);

    /**
     * Obtener eventos por deporte
     * @param deporte Nombre del deporte
     * @return Lista de eventos del deporte
     */
    List<EventoDeportivo> getEventosPorDeporte(String deporte);

    /**
     * Obtener eventos por liga
     * @param liga Nombre de la liga
     * @return Lista de eventos de la liga
     */
    List<EventoDeportivo> getEventosPorLiga(String liga);
}
