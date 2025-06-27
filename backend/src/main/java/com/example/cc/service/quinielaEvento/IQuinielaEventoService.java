package com.example.cc.service.quinielaEvento;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.TipoPrediccion;

import java.util.List;

/**
 * Interfaz para el servicio de gestión de eventos de quiniela
 */
public interface IQuinielaEventoService {

    /**
     * Agregar eventos deportivos a una quiniela
     * @param quinielaId ID de la quiniela
     * @param eventosIds Lista de IDs de eventos deportivos
     */
    void agregarEventosAQuiniela(Long quinielaId, List<Long> eventosIds);

    /**
     * Obtener eventos deportivos disponibles
     * @return Lista de eventos disponibles
     */
    List<EventoDeportivo> obtenerEventosDisponibles();

    /**
     * Configurar tipo de predicción para un evento
     * @param quinielaId ID de la quiniela
     * @param eventoId ID del evento
     * @param tipoPrediccion Tipo de predicción a configurar
     */
    void configurarTipoPrediccion(Long quinielaId, Long eventoId, TipoPrediccion tipoPrediccion);
}
