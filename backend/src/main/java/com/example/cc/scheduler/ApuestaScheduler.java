package com.example.cc.scheduler;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.repository.EventoDeportivoRepository;
import com.example.cc.service.apuestas.ApuestaService;
import com.example.cc.service.apuestas.CuotaEventoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApuestaScheduler {

    private final ApuestaService apuestaService;
    private final CuotaEventoService cuotaEventoService;
    private final EventoDeportivoRepository eventoRepository;

    /**
     * Procesar apuestas pendientes de eventos finalizados
     * Se ejecuta cada 30 minutos
     */
    @Scheduled(fixedRate = 1800000) // 30 minutos
    public void procesarApuestasPendientes() {
        log.info("=== PROCESANDO APUESTAS PENDIENTES ===");
        
        try {
            // Procesar apuestas de eventos finalizados
            apuestaService.procesarApuestasPendientes();
            
        } catch (Exception e) {
            log.error("Error procesando apuestas pendientes: {}", e.getMessage(), e);
        }
    }

    /**
     * Cerrar cuotas para eventos que están por comenzar
     * Se ejecuta cada 5 minutos
     */
    @Scheduled(fixedRate = 300000) // 5 minutos
    public void cerrarCuotasEventosProximos() {
        log.info("=== CERRANDO CUOTAS DE EVENTOS PRÓXIMOS ===");
        
        try {
            // Obtener eventos que comienzan en los próximos 10 minutos
            LocalDateTime ahora = LocalDateTime.now();
            LocalDateTime limite = ahora.plusMinutes(10);
            
            List<EventoDeportivo> eventosProximos = eventoRepository
                    .findByFechaEventoBetweenAndEstadoOrderByFechaEventoAsc(ahora, limite, "programado");
            
            for (EventoDeportivo evento : eventosProximos) {
                try {
                    // Cerrar cuotas para este evento
                    cuotaEventoService.cerrarCuotasEvento(evento.getId());
                    log.info("Cuotas cerradas para evento próximo: {} (ID: {})", 
                            evento.getNombreEvento(), evento.getId());
                    
                } catch (Exception e) {
                    log.error("Error cerrando cuotas para evento {}: {}", 
                            evento.getId(), e.getMessage());
                }
            }
            
        } catch (Exception e) {
            log.error("Error al cerrar cuotas de eventos próximos: {}", e.getMessage(), e);
        }
    }

    /**
     * Generar cuotas para eventos futuros
     * Se ejecuta cada 12 horas
     */
    @Scheduled(fixedRate = 43200000) // 12 horas
    public void generarCuotasEventosFuturos() {
        log.info("=== GENERANDO CUOTAS PARA EVENTOS FUTUROS ===");
        
        try {
            // Obtener eventos programados de los próximos días sin cuotas
            LocalDateTime ahora = LocalDateTime.now();
            LocalDateTime limite = ahora.plusDays(7);
            
            List<EventoDeportivo> eventosFuturos = eventoRepository
                    .findByFechaEventoBetweenAndEstadoOrderByFechaEventoAsc(ahora, limite, "programado");
            
            int eventosConCuotas = 0;
            
            for (EventoDeportivo evento : eventosFuturos) {
                try {
                    // Generar cuotas para este evento si no tiene
                    cuotaEventoService.generarCuotasParaEvento(evento.getId());
                    eventosConCuotas++;
                    
                } catch (Exception e) {
                    log.error("Error generando cuotas para evento {}: {}", 
                            evento.getId(), e.getMessage());
                }
            }
            
            log.info("Se generaron cuotas para {} eventos futuros", eventosConCuotas);
            
        } catch (Exception e) {
            log.error("Error al generar cuotas para eventos futuros: {}", e.getMessage(), e);
        }
    }
}
