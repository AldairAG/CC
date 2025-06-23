package com.example.cc.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class EstadisticasUsuarioResponse {
    // Información básica
    private String email;
    private String nombre;
    private BigDecimal saldoActual;
    private boolean cuentaActiva;
    
    // Estadísticas de apuestas
    private EstadisticasApuestaResponse estadisticasApuestas;
    
    // Estadísticas de transacciones
    private BigDecimal totalDepositado;
    private BigDecimal totalRetirado;
    private Long numeroDepositos;
    private Long numeroRetiros;
    private TransaccionResponse ultimoDeposito;
    private TransaccionResponse ultimoRetiro;
    
    // Verificación
    private boolean documentosVerificados;
    private int documentosPendientes;
    private int documentosAprobados;
    
    // Soporte
    private Long ticketsAbiertos;
    private Long ticketsResueltos;
    private TicketSoporteResponse ultimoTicket;
    
    // Seguridad
    private boolean autenticacion2FAHabilitada;
    private String nivelSeguridad; // BAJO, MEDIO, ALTO
    
    // Actividad reciente
    private List<ApuestaResponse> ultimasApuestas;
    private List<TransaccionResponse> ultimasTransacciones;
}
