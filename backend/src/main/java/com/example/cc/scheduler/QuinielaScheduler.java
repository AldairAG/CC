package com.example.cc.scheduler;

import com.example.cc.entities.Quiniela;
import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.PrediccionEvento;
import com.example.cc.dto.external.TheSportsDbEventResponse;
import com.example.cc.repository.QuinielaRepository;
import com.example.cc.repository.EventoDeportivoRepository;
import com.example.cc.repository.PrediccionEventoRepository;
import com.example.cc.service.quiniela.QuinielaService;
import com.example.cc.service.external.TheSportsDbService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class QuinielaScheduler {

    private final QuinielaRepository quinielaRepository;
    private final QuinielaService quinielaService;
    private final EventoDeportivoRepository eventoDeportivoRepository;
    private final PrediccionEventoRepository prediccionEventoRepository;
    private final TheSportsDbService theSportsDbService;

    /**
     * Cerrar quinielas que han llegado a su fecha de cierre
     * Se ejecuta cada 15 minutos
     */
    //@Scheduled(fixedRate = 900000) // 15 minutos
    public void cerrarQuinielasVencidas() {
        log.info("=== VERIFICANDO QUINIELAS PARA CERRAR ===");
        
        try {
            LocalDateTime ahora = LocalDateTime.now();
            
            // Buscar quinielas activas que deben cerrarse
            List<Quiniela> quinielasParaCerrar = quinielaRepository
                    .findByEstadoAndFechaCierreBefore(Quiniela.EstadoQuiniela.ACTIVA, ahora);
            
            for (Quiniela quiniela : quinielasParaCerrar) {
                quiniela.setEstado(Quiniela.EstadoQuiniela.CERRADA);
                quinielaRepository.save(quiniela);
                log.info("Quiniela {} cerrada automáticamente", quiniela.getId());
            }
            
            if (!quinielasParaCerrar.isEmpty()) {
                log.info("Cerradas {} quinielas", quinielasParaCerrar.size());
            }
            
        } catch (Exception e) {
            log.error("Error cerrando quinielas: {}", e.getMessage(), e);
        }
    }

    /**
     * Procesar resultados de quinielas cerradas
     * Se ejecuta cada hora
     */
    //@Scheduled(fixedRate = 3600000) // 1 hora
    public void procesarResultadosQuinielas() {
        log.info("=== PROCESANDO RESULTADOS DE QUINIELAS ===");
        
        try {
            // Buscar quinielas cerradas que pueden procesarse
            List<Quiniela> quinielasParaProcesar = quinielaRepository
                    .findByEstado(Quiniela.EstadoQuiniela.CERRADA);
            
            for (Quiniela quiniela : quinielasParaProcesar) {
                try {
                    // Verificar si todos los eventos tienen resultados
                    boolean todosEventosConResultados = quiniela.getEventos().stream()
                            .allMatch(qe -> qe.getEventoDeportivo().getResultado() != null);
                    
                    if (todosEventosConResultados) {
                        quinielaService.procesarResultados(quiniela.getId());
                        log.info("Resultados procesados para quiniela {}", quiniela.getId());
                    }
                    
                } catch (Exception e) {
                    log.error("Error procesando resultados de quiniela {}: {}", 
                             quiniela.getId(), e.getMessage());
                }
            }
            
        } catch (Exception e) {
            log.error("Error en procesamiento de resultados: {}", e.getMessage(), e);
        }
    }

    /**
     * Limpiar quinielas canceladas o muy antiguas
     * Se ejecuta cada domingo a las 3:00 AM
     */
    //@Scheduled(cron = "0 0 3 * * SUN", zone = "America/Mexico_City")
    public void limpiarQuinielasAntiguas() {
        log.info("=== LIMPIANDO QUINIELAS ANTIGUAS ===");
        
        try {
            LocalDateTime fechaLimite = LocalDateTime.now().minusDays(90); // 90 días atrás
            
            // Eliminar quinielas canceladas muy antiguas
            List<Quiniela> quinielasAntiguas = quinielaRepository
                    .findByEstadoAndFechaCreacionBefore(Quiniela.EstadoQuiniela.CANCELADA, fechaLimite);
            
            for (Quiniela quiniela : quinielasAntiguas) {
                quinielaRepository.delete(quiniela);
                log.info("Eliminada quiniela antigua {}", quiniela.getId());
            }
            
            if (!quinielasAntiguas.isEmpty()) {
                log.info("Eliminadas {} quinielas antiguas", quinielasAntiguas.size());
            }
            
        } catch (Exception e) {
            log.error("Error limpiando quinielas antiguas: {}", e.getMessage(), e);
        }
    }

    /**
     * Notificar recordatorios de cierre próximo
     * Se ejecuta cada 30 minutos
     */
    //@Scheduled(fixedRate = 1800000) // 30 minutos
    public void notificarCierreProximo() {
        try {
            LocalDateTime limite = LocalDateTime.now().plusHours(2); // 2 horas antes del cierre
            
            List<Quiniela> quinielasProximasACerrar = quinielaRepository
                    .findByEstadoAndFechaCierreBetween(
                            Quiniela.EstadoQuiniela.ACTIVA, 
                            LocalDateTime.now().plusMinutes(90), 
                            limite
                    );
            
            // Aquí puedes implementar notificaciones a los usuarios
            for (Quiniela quiniela : quinielasProximasACerrar) {
                log.info("Quiniela {} cerrará pronto", quiniela.getId());
                // notificationService.notificarCierreProximo(quiniela);
            }
            
        } catch (Exception e) {
            log.error("Error notificando cierres próximos: {}", e.getMessage(), e);
        }
    }

    /**
     * Actualizar resultados de eventos deportivos desde TheSportsDB y verificar predicciones
     * Se ejecuta cada 2 horas
     */
    //@Scheduled(fixedRate = 7200000) // 2 horas
    public void actualizarResultadosEventosYVerificarPredicciones() {
        log.info("=== ACTUALIZANDO RESULTADOS DE EVENTOS DEPORTIVOS ===");
        
        try {
            // 1. Obtener eventos finalizados desde TheSportsDB
            List<EventoDeportivo> eventosConResultadosNuevos = actualizarResultadosDesdeTheSportsDB();
            
            if (eventosConResultadosNuevos.isEmpty()) {
                log.info("No se encontraron eventos con resultados nuevos para actualizar");
                return;
            }
            
            log.info("Se actualizaron {} eventos con nuevos resultados", eventosConResultadosNuevos.size());
            
            // 2. Actualizar estado de predicciones relacionadas con estos eventos
            int prediccionesActualizadas = actualizarPrediccionesDeEventos(eventosConResultadosNuevos);
            
            log.info("Se verificaron {} predicciones de eventos actualizados", prediccionesActualizadas);
            
        } catch (Exception e) {
            log.error("Error actualizando resultados de eventos: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Actualiza los resultados de eventos deportivos desde TheSportsDB
     * @return Lista de eventos que fueron actualizados con nuevos resultados
     */
    private List<EventoDeportivo> actualizarResultadosDesdeTheSportsDB() {
        List<EventoDeportivo> eventosActualizados = new ArrayList<>();
        
        try {
            // Obtener eventos de los últimos 7 días desde TheSportsDB
            List<TheSportsDbEventResponse.EventData> eventosExternos = theSportsDbService.getUpcomingEvents();
            
            for (TheSportsDbEventResponse.EventData eventoExterno : eventosExternos) {
                try {
                    // Solo procesar eventos que ya hayan finalizado
                    if (!"Match Finished".equalsIgnoreCase(eventoExterno.getStrStatus()) && 
                        !"FT".equalsIgnoreCase(eventoExterno.getStrStatus()) &&
                        !"Finished".equalsIgnoreCase(eventoExterno.getStrStatus())) {
                        continue;
                    }
                    
                    // Buscar el evento en nuestra base de datos
                    Optional<EventoDeportivo> eventoBD = eventoDeportivoRepository
                            .findByEventoIdExterno(eventoExterno.getIdEvent());
                    
                    if (eventoBD.isPresent()) {
                        EventoDeportivo evento = eventoBD.get();
                        
                        // Verificar si ya tiene resultado
                        if (evento.getResultado() == null) {
                            // Actualizar resultado basado en el marcador
                            actualizarResultadoEvento(evento, eventoExterno);
                            
                            // Guardar evento actualizado
                            eventoDeportivoRepository.save(evento);
                            eventosActualizados.add(evento);
                            
                            log.info("Evento actualizado con resultado: {} (ID: {})", 
                                    evento.getNombreEvento(), evento.getId());
                        }
                    }
                    
                } catch (Exception e) {
                    log.error("Error procesando resultado de evento {}: {}", 
                            eventoExterno.getIdEvent(), e.getMessage());
                }
            }
            
        } catch (Exception e) {
            log.error("Error al obtener eventos desde TheSportsDB: {}", e.getMessage(), e);
        }
        
        return eventosActualizados;
    }
    
    /**
     * Actualiza el resultado de un evento basado en datos de TheSportsDB
     */
    private void actualizarResultadoEvento(EventoDeportivo evento, TheSportsDbEventResponse.EventData eventoExterno) {
        try {
            Integer marcadorLocal = null;
            Integer marcadorVisitante = null;
            
            // Intentar obtener marcadores
            if (eventoExterno.getIntHomeScore() != null && eventoExterno.getIntHomeScore().length() > 0) {
                marcadorLocal = Integer.parseInt(eventoExterno.getIntHomeScore());
            }
            
            if (eventoExterno.getIntAwayScore() != null && eventoExterno.getIntAwayScore().length() > 0) {
                marcadorVisitante = Integer.parseInt(eventoExterno.getIntAwayScore());
            }
            
            // Actualizar marcadores
            evento.setMarcadorLocal(marcadorLocal);
            evento.setMarcadorVisitante(marcadorVisitante);
            
            // Determinar resultado (LOCAL, VISITANTE, EMPATE)
            if (marcadorLocal != null && marcadorVisitante != null) {
                if (marcadorLocal > marcadorVisitante) {
                    evento.setResultado("LOCAL");
                } else if (marcadorLocal < marcadorVisitante) {
                    evento.setResultado("VISITANTE");
                } else {
                    evento.setResultado("EMPATE");
                }
            }
            
            // Actualizar estado
            evento.setEstado("finalizado");
            
        } catch (Exception e) {
            log.error("Error al actualizar resultado del evento {}: {}", evento.getId(), e.getMessage());
        }
    }
    
    /**
     * Actualiza las predicciones relacionadas con los eventos actualizados
     * @param eventosActualizados Lista de eventos con resultados actualizados
     * @return Número de predicciones actualizadas
     */
    private int actualizarPrediccionesDeEventos(List<EventoDeportivo> eventosActualizados) {
        int totalActualizadas = 0;
        
        for (EventoDeportivo evento : eventosActualizados) {
            try {
                // Obtener todas las predicciones para este evento
                List<PrediccionEvento> predicciones = prediccionEventoRepository
                        .findByEventoDeportivo_IdOrderByFechaPrediccionDesc(evento.getId());
                
                for (PrediccionEvento prediccion : predicciones) {
                    // Verificar si la predicción fue correcta
                    if (prediccion.getPrediccion() != null && evento.getResultado() != null) {
                        boolean esCorrecta = prediccion.getPrediccion().equals(evento.getResultado());
                        
                        // Actualizar estado de la predicción
                        prediccion.setEsCorrecto(esCorrecta);
                        prediccion.setEstado(PrediccionEvento.EstadoPrediccion.RESUELTA);
                        prediccion.setResultadoRealTexto(evento.getResultado());
                        prediccion.setFechaResolucion(LocalDateTime.now());
                        
                        // Calcular puntos si es correcta
                        if (esCorrecta) {
                            prediccion.calcularPuntos();
                        } else {
                            prediccion.setPuntosObtenidos(0);
                        }
                        
                        // Guardar predicción actualizada
                        prediccionEventoRepository.save(prediccion);
                        totalActualizadas++;
                    }
                }
                
            } catch (Exception e) {
                log.error("Error al actualizar predicciones para evento {}: {}", 
                        evento.getId(), e.getMessage());
            }
        }
        
        return totalActualizadas;
    }
}
