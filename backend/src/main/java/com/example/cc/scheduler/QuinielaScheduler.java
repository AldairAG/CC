package com.example.cc.scheduler;

import com.example.cc.entities.Quiniela;
import com.example.cc.repository.QuinielaRepository;
import com.example.cc.service.QuinielaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class QuinielaScheduler {

    private final QuinielaRepository quinielaRepository;
    private final QuinielaService quinielaService;

    /**
     * Cerrar quinielas que han llegado a su fecha de cierre
     * Se ejecuta cada 15 minutos
     */
    @Scheduled(fixedRate = 900000) // 15 minutos
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
    @Scheduled(fixedRate = 3600000) // 1 hora
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
    @Scheduled(cron = "0 0 3 * * SUN", zone = "America/Mexico_City")
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
    @Scheduled(fixedRate = 1800000) // 30 minutos
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
}
