package com.example.cc.config;

import com.example.cc.service.apuesta.ApuestaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApuestaScheduler {

    private final ApuestaService apuestaService;

    /**
     * Procesa apuestas pendientes cada hora
     */
    @Scheduled(fixedRate = 3600000) // 1 hora = 3600000 ms
    public void procesarApuestasPendientes() {
        try {
            log.info("Iniciando procesamiento automático de apuestas pendientes");
            apuestaService.procesarApuestasPendientes();
            log.info("Procesamiento automático de apuestas completado");
        } catch (Exception e) {
            log.error("Error en el procesamiento automático de apuestas", e);
        }
    }
}
