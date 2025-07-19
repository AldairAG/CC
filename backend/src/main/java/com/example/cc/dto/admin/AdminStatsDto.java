package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDto {

    // Información general financiera
    
    // Estadísticas de usuarios
    private Long totalUsuarios;
    private Long usuariosActivos;
    private Long usuariosNuevosHoy;
    private Long usuariosNuevosMes;
    
    // Estadísticas de apuestas
    private Long totalApuestas;
    private Long apuestasActivas;
    private Long apuestasPendientes;
    private BigDecimal montoTotalApuestas;
    private BigDecimal gananciasHoy;
    private BigDecimal gananciasMes;
    
    // Estadísticas de quinielas
    private Long totalQuinielas;
    private Long quinielasActivas;
    private Long quinielasFinalizadas;
    private BigDecimal poolTotalQuinielas;
    
    // Estadísticas de eventos
    private Long totalEventos;
    private Long eventosEnVivo;
    private Long eventosHoy;
    private Long eventosPendientes;
    
    // Estadísticas de crypto
    private Long totalTransaccionesCrypto;
    private Long transaccionesPendientes;
    private BigDecimal volumenCryptoHoy;
    private BigDecimal volumenCryptoMes;
    
    // Estadísticas de notificaciones
    private Long totalNotificaciones;
    private Long notificacionesNoLeidas;
    private Long notificacionesEnviadas;
    
    // Estadísticas financieras
    private BigDecimal ingresosTotales;
    private BigDecimal ingresosHoy;
    private BigDecimal ingresosMes;
    private BigDecimal saldoTotal;
    
    // Metadatos
    private LocalDateTime fechaActualizacion;
    private String version;
}
