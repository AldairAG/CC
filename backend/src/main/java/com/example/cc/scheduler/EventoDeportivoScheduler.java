package com.example.cc.scheduler;

import com.example.cc.service.deportes.EventoDeportivoService;
import com.example.cc.service.external.ITheSportsDbService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventoDeportivoScheduler {

    private final EventoDeportivoService eventoDeportivoService;
    private final ITheSportsDbService theSportsDbService;

    /**
     * Ejecutar sincronización de eventos deportivos todos los días a las 12:00 AM (medianoche)
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "America/Mexico_City")
    public void sincronizarEventosDeportivos() {
        log.info("=== INICIANDO SINCRONIZACIÓN PROGRAMADA DE EVENTOS DEPORTIVOS ===");
        
        try {
            long startTime = System.currentTimeMillis();
            
            // Ejecutar sincronización
            eventoDeportivoService.sincronizarEventosDeportivos();
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            log.info("=== SINCRONIZACIÓN COMPLETADA EN {} ms ===", duration);
            
        } catch (Exception e) {
            log.error("=== ERROR EN SINCRONIZACIÓN PROGRAMADA: {} ===", e.getMessage(), e);
        }
    }
 
    /**
     * Actualizar livescores de eventos del día actual cada 2 minutos
     */
    @Scheduled(cron = "0 */2 * * * *", zone = "America/Mexico_City")
    public void actualizarLivescoresEventosHoy() {
        log.info("🔴 === INICIANDO ACTUALIZACIÓN DE LIVESCORES (cada 2 min) ===");
        
        try {
            long startTime = System.currentTimeMillis();
            
            // Obtener y actualizar livescores actuales del día
            int eventosActualizados = theSportsDbService.obtenerYGuardarLivescoresActuales().size();
            
            // También actualizar específicamente los eventos en vivo
            //int eventosEnVivo = theSportsDbService.obtenerLivescoresEventosEnVivo().size();
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;

            log.info("✅ === LIVESCORES ACTUALIZADOS: {} eventos del día ({}ms) ===", 
                    eventosActualizados, duration);
            
        } catch (Exception e) {
            log.error("❌ === ERROR AL ACTUALIZAR LIVESCORES: {} ===", e.getMessage(), e);
        }
    }

    /**
     * Ejecutar limpieza de eventos antiguos cada domingo a las 2:00 AM
     */
    @Scheduled(cron = "0 0 2 * * SUN", zone = "America/Mexico_City")
    public void limpiarEventosAntiguos() {
        log.info("=== INICIANDO LIMPIEZA DE EVENTOS ANTIGUOS ===");
        
        try {
            eventoDeportivoService.limpiarEventosAntiguos();
            log.info("=== LIMPIEZA DE EVENTOS COMPLETADA ===");
            
        } catch (Exception e) {
            log.error("=== ERROR EN LIMPIEZA DE EVENTOS: {} ===", e.getMessage(), e);
        }
    }

    /**
     * Tarea de prueba para verificar que el scheduler funciona (cada 30 minutos)
     */
    @Scheduled(fixedRate = 1800000) // 30 minutos = 30 * 60 * 1000 ms
    public void tareaVerificacion() {
        log.debug("Scheduler funcionando correctamente - {}", java.time.LocalDateTime.now());
    }

    /**
     * Método manual para forzar sincronización
     */
    public void forzarSincronizacion() {
        log.info("=== FORZANDO SINCRONIZACIÓN MANUAL ===");
        //sincronizarEventosDeportivos();
    }

    /**
     * Método manual para forzar actualización de livescores
     */
    public void forzarActualizacionLivescores() {
        log.info("=== FORZANDO ACTUALIZACIÓN DE LIVESCORES ===");
        //actualizarLivescoresEventosHoy();
    }
}
