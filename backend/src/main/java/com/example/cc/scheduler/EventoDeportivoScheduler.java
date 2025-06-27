package com.example.cc.scheduler;

import com.example.cc.service.deportes.EventoDeportivoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventoDeportivoScheduler {

    private final EventoDeportivoService eventoDeportivoService;

    /**
     * Ejecutar sincronización de eventos deportivos todos los días a las 12:00 AM (medianoche)
     * Cron expression: "0 0 0 * * *" = segundo minuto hora día mes día_semana
     * - 0 segundos
     * - 0 minutos  
     * - 0 horas (medianoche)
     * - * cualquier día del mes
     * - * cualquier mes  
     * - * cualquier día de la semana
     */
    //@Scheduled(cron = "0 * * * * *", zone = "America/Mexico_City")
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
     * Ejecutar limpieza de eventos antiguos cada domingo a las 2:00 AM
     * Cron expression: "0 0 2 * * SUN"
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
     * Puedes comentar o eliminar esta tarea una vez que confirmes que funciona
     */
    @Scheduled(fixedRate = 1800000) // 30 minutos = 30 * 60 * 1000 ms
    public void tareaVerificacion() {
        log.debug("Scheduler funcionando correctamente - {}", java.time.LocalDateTime.now());
    }

    /**
     * Método manual para forzar sincronización (útil para pruebas)
     * Puedes llamar este método desde un controlador si necesitas sincronización manual
     */
    public void forzarSincronizacion() {
        log.info("=== FORZANDO SINCRONIZACIÓN MANUAL ===");
        sincronizarEventosDeportivos();
    }
}
