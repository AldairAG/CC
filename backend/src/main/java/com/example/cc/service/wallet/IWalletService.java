package com.example.cc.service.wallet;

import com.example.cc.entities.Usuario;

import java.math.BigDecimal;

/**
 * Interfaz para el servicio de gestión de monedero/wallet
 */
public interface IWalletService {

    /**
     * Procesar pago de participación en quiniela
     * @param usuario Usuario que realiza el pago
     * @param monto Monto a descontar
     * @param descripcion Descripción de la transacción
     */
    void procesarPagoParticipacion(Usuario usuario, BigDecimal monto, String descripcion);

    /**
     * Procesar pago de premio
     * @param usuario Usuario ganador
     * @param monto Monto del premio
     * @param descripcion Descripción de la transacción
     */
    void procesarPagoPremio(Usuario usuario, BigDecimal monto, String descripcion);

    /**
     * Procesar depósito de dinero
     * @param usuario Usuario que deposita
     * @param monto Monto a depositar
     * @param metodoPago Método de pago utilizado
     * @param referenciaPago Referencia del pago
     */
    void procesarDeposito(Usuario usuario, BigDecimal monto, String metodoPago, String referenciaPago);

    /**
     * Procesar retiro de dinero
     * @param usuario Usuario que retira
     * @param monto Monto a retirar
     * @param metodoPago Método de pago para el retiro
     */
    void procesarRetiro(Usuario usuario, BigDecimal monto, String metodoPago);

    /**
     * Obtener saldo actual de un usuario
     * @param usuarioId ID del usuario
     * @return Saldo actual
     */
    BigDecimal obtenerSaldo(Long usuarioId);

    /**
     * Procesar reembolso
     * @param usuario Usuario a reembolsar
     * @param monto Monto a reembolsar
     * @param descripcion Descripción del reembolso
     */
    void procesarReembolso(Usuario usuario, BigDecimal monto, String descripcion);
}
