package com.example.cc.service.notificaion;

import com.example.cc.entities.Quiniela;
import com.example.cc.entities.Usuario;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService implements INotificationService {

    /**
     * Notificar participación exitosa en quiniela
     */
    public void notificarParticipacionExitosa(Usuario usuario, Quiniela quiniela) {
        log.info("Notificación: Usuario {} participó exitosamente en quiniela {}", 
                usuario.getIdUsuario(), quiniela.getNombre());
        
        // Aquí se puede implementar el envío de emails, notificaciones push, etc.
        // Por ahora solo registramos en logs
    }

    /**
     * Notificar resultados de quiniela
     */
    public void notificarResultadosQuiniela(Quiniela quiniela) {
        log.info("Notificación: Resultados disponibles para quiniela {}", quiniela.getNombre());
        
        // Aquí se puede implementar notificaciones masivas a todos los participantes
        // Por ahora solo registramos en logs
    }

    /**
     * Notificar premio ganado
     */
    public void notificarPremioGanado(Usuario usuario, Quiniela quiniela, java.math.BigDecimal premio) {
        log.info("Notificación: Usuario {} ganó premio de {} en quiniela {}", 
                usuario.getIdUsuario(), premio, quiniela.getNombre());
        
        // Implementar notificación de premio
    }

    /**
     * Notificar inicio de quiniela
     */
    public void notificarInicioQuiniela(Quiniela quiniela) {
        log.info("Notificación: Quiniela {} ha iniciado", quiniela.getNombre());
        
        // Implementar notificación de inicio
    }

    /**
     * Notificar cierre próximo de quiniela
     */
    public void notificarCierreProximo(Quiniela quiniela) {
        log.info("Notificación: Quiniela {} cerrará pronto", quiniela.getNombre());
        
        // Implementar notificación de cierre próximo
    }
}
