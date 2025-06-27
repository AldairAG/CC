package com.example.cc.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasUsuarioResponse {
    private String email;
    private String nombre;
    private BigDecimal saldoActual;
    private boolean cuentaActiva;
    
    // Estadísticas de transacciones
    private BigDecimal totalDepositado;
    private BigDecimal totalRetirado;
    private Long numeroDepositos;
    private Long numeroRetiros;
    
    // Documentos
    private boolean documentosVerificados;
    private int documentosPendientes;
    private int documentosAprobados;
    
    // Tickets de soporte
    private Long ticketsAbiertos;
    private Long ticketsResueltos;
    
    // Seguridad
    private boolean autenticacion2FAHabilitada;
    private String nivelSeguridad;
    
    // Últimas transacciones
    private List<TransaccionResponse> ultimasTransacciones;
}
