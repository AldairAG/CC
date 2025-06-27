package com.example.cc.service.notificaion;

import com.example.cc.entities.Quiniela;
import com.example.cc.entities.Usuario;

import java.math.BigDecimal;

/**
 * Interfaz para el servicio de notificaciones
 */
public interface INotificationService {

    /**
     * Notificar participación exitosa en quiniela
     * @param usuario Usuario que participó
     * @param quiniela Quiniela en la que participó
     */
    void notificarParticipacionExitosa(Usuario usuario, Quiniela quiniela);

    /**
     * Notificar resultados de quiniela a todos los participantes
     * @param quiniela Quiniela finalizada
     */
    void notificarResultadosQuiniela(Quiniela quiniela);

    /**
     * Notificar premio ganado
     * @param usuario Usuario ganador
     * @param quiniela Quiniela ganada
     * @param premio Monto del premio
     */
    void notificarPremioGanado(Usuario usuario, Quiniela quiniela, BigDecimal premio);

    /**
     * Notificar inicio de quiniela
     * @param quiniela Quiniela que inicia
     */
    void notificarInicioQuiniela(Quiniela quiniela);

    /**
     * Notificar cierre próximo de quiniela
     * @param quiniela Quiniela que cierra pronto
     */
    void notificarCierreProximo(Quiniela quiniela);
}
