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
    //@Scheduled(cron = "0 * * * * *", zone = "America/Mexico_City")
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
     * Verificar y crear cuotas faltantes para eventos programados cada 2 minutos
     * Es crítico que todos los eventos programados tengan cuotas completas
     */
    @Scheduled(cron = "0 */2 * * * *", zone = "America/Mexico_City")
    public void verificarCuotasEventosProgramados() {
        log.info("🎯 === INICIANDO VERIFICACIÓN DE CUOTAS (cada 2 min) ===");
        
        try {
            long startTime = System.currentTimeMillis();
            
            // Verificar cuotas para eventos programados y en vivo (ambos necesitan cuotas)
            var resumen = theSportsDbService.verificarCuotasEventosPorEstados(
                    java.util.List.of("programado", "en_vivo"));
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;

            log.info("✅ === VERIFICACIÓN DE CUOTAS COMPLETADA ({}ms) ===", duration);
            log.info("📊 Total eventos procesados: {}", resumen.getTotalEventos());
            log.info("💰 Eventos con cuotas completas: {}", resumen.getEventosCompletos());
            log.info("🔧 Eventos con cuotas creadas: {}", resumen.getEventosConCuotasCreadas());
            log.info("❌ Eventos con errores: {}", resumen.getEventosConErrores());
            
            // Log adicional si se crearon cuotas
            if (resumen.getEventosConCuotasCreadas() > 0) {
                log.info("🎉 IMPORTANTE: Se crearon cuotas para {} eventos (programados/en_vivo)", 
                        resumen.getEventosConCuotasCreadas());
            }
            
            // Log si todos los eventos ya tienen cuotas
            if (resumen.getTotalEventos() > 0 && resumen.getEventosConCuotasCreadas() == 0) {
                log.info("✨ Todos los eventos activos ya tienen cuotas completas");
            }
            
        } catch (Exception e) {
            log.error("❌ === ERROR AL VERIFICAR CUOTAS: {} ===", e.getMessage(), e);
        }
    }

    /**
     * Verificar cuotas para eventos próximos cada 30 minutos
     * Esto asegura que eventos que vienen en los próximos días tengan cuotas preparadas
     */
    @Scheduled(cron = "0 */30 * * * *", zone = "America/Mexico_City")
    public void verificarCuotasEventosProximos() {
        log.info("📅 === INICIANDO VERIFICACIÓN DE CUOTAS EVENTOS PRÓXIMOS (cada 30 min) ===");
        
        try {
            long startTime = System.currentTimeMillis();
            
            // Verificar cuotas para eventos de los próximos 3 días
            var resumen = theSportsDbService.verificarCuotasEventosProximos(3);
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;

            log.info("✅ === VERIFICACIÓN EVENTOS PRÓXIMOS COMPLETADA ({}ms) ===", duration);
            log.info("📊 Total eventos próximos (3 días): {}", resumen.getTotalEventos());
            log.info("💰 Eventos con cuotas completas: {}", resumen.getEventosCompletos());
            log.info("🔧 Eventos con cuotas creadas: {}", resumen.getEventosConCuotasCreadas());
            log.info("❌ Eventos con errores: {}", resumen.getEventosConErrores());
            
            // Log especial para eventos próximos
            if (resumen.getEventosConCuotasCreadas() > 0) {
                log.info("🚀 Se prepararon cuotas para {} eventos próximos", 
                        resumen.getEventosConCuotasCreadas());
            }
            
        } catch (Exception e) {
            log.error("❌ === ERROR AL VERIFICAR CUOTAS EVENTOS PRÓXIMOS: {} ===", e.getMessage(), e);
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
     * Cerrar eventos cuya fecha ya pasó - se ejecuta cada hora
     */
    @Scheduled(cron = "0 0 * * * *", zone = "America/Mexico_City")
    public void cerrarEventosVencidos() {
        log.info("🔒 === INICIANDO CIERRE DE EVENTOS VENCIDOS ===");
        
        try {
            long startTime = System.currentTimeMillis();
            
            // Cerrar eventos cuya fecha sea menor a la actual
            int eventosCerrados = eventoDeportivoService.cerrarEventosVencidos();
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;

            log.info("✅ === EVENTOS CERRADOS: {} eventos vencidos ({}ms) ===", 
                    eventosCerrados, duration);
            
        } catch (Exception e) {
            log.error("❌ === ERROR AL CERRAR EVENTOS VENCIDOS: {} ===", e.getMessage(), e);
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
        sincronizarEventosDeportivos();
    }

    /**
     * Método manual para forzar actualización de livescores
     */
    public void forzarActualizacionLivescores() {
        log.info("=== FORZANDO ACTUALIZACIÓN DE LIVESCORES ===");
        actualizarLivescoresEventosHoy();
    }

    /**
     * Método manual para forzar verificación de cuotas
     */
    public void forzarVerificacionCuotas() {
        log.info("=== FORZANDO VERIFICACIÓN DE CUOTAS ===");
        verificarCuotasEventosProgramados();
    }

    /**
     * Método manual para forzar verificación de cuotas de eventos próximos
     */
    public void forzarVerificacionCuotasProximos() {
        log.info("=== FORZANDO VERIFICACIÓN DE CUOTAS EVENTOS PRÓXIMOS ===");
        verificarCuotasEventosProximos();
    }

    /**
     * Método manual para forzar cierre de eventos vencidos
     */
    public void forzarCierreEventosVencidos() {
        log.info("=== FORZANDO CIERRE DE EVENTOS VENCIDOS ===");
        cerrarEventosVencidos();
    }
}
