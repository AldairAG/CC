package com.example.cc.service.deportes;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.Deporte;
import com.example.cc.entities.Liga;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
     * Obtener eventos por deporte (usando entidad)
     * @param deporte Entidad deporte
     * @return Lista de eventos del deporte
     */
    List<EventoDeportivo> getEventosPorDeporte(Deporte deporte);

    /**
     * Obtener eventos por deporte (usando nombre - compatibilidad)
     * @param nombreDeporte Nombre del deporte
     * @return Lista de eventos del deporte
     */
    List<EventoDeportivo> getEventosPorDeporteNombre(String nombreDeporte);

    /**
     * Obtener eventos por liga (usando entidad)
     * @param liga Entidad liga
     * @return Lista de eventos de la liga
     */
    List<EventoDeportivo> getEventosPorLiga(Liga liga);

    /**
     * Obtener eventos por liga (usando nombre - compatibilidad)
     * @param nombreLiga Nombre de la liga
     * @return Lista de eventos de la liga
     */
    List<EventoDeportivo> getEventosPorLigaNombre(String nombreLiga);

    /**
     * Buscar evento por nombre y fecha específica
     * @param nombreEvento Nombre del evento
     * @param fechaInicio Fecha de inicio del día
     * @param fechaFin Fecha de fin del día
     * @param equipoLocal Equipo local (opcional)
     * @param equipoVisitante Equipo visitante (opcional)
     * @return Evento encontrado
     */
    Optional<EventoDeportivo> buscarPorNombreYFecha(String nombreEvento, LocalDateTime fechaInicio,
                                                   LocalDateTime fechaFin, String equipoLocal, String equipoVisitante);

    /**
     * Buscar eventos por fecha específica
     * @param fechaInicio Fecha de inicio del día
     * @param fechaFin Fecha de fin del día
     * @param deporte Deporte (opcional)
     * @param liga Liga (opcional)
     * @return Lista de eventos
     */
    List<EventoDeportivo> buscarPorFecha(LocalDateTime fechaInicio, LocalDateTime fechaFin,
                                        String deporte, String liga);

    /**
     * Obtener evento por ID
     * @param id ID del evento
     * @return Evento encontrado
     */
    Optional<EventoDeportivo> getEventoById(Long id);

    /**
     * Obtener todos los eventos
     * @return Lista de todos los eventos
     */
    List<EventoDeportivo> getAllEventos();
}
