package com.example.cc.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadisticasApuestaResponse {
    
    private Integer totalApuestas;
    private Integer apuestasGanadas;
    private Integer apuestasPerdidas;
    private Integer apuestasPendientes;
    private BigDecimal totalApostado;
    private BigDecimal totalGanado;
    private BigDecimal gananciaNeta;
    private Double porcentajeExito;
    private BigDecimal saldoActual;
    private BigDecimal mayorGanancia;
    private BigDecimal mayorPerdida;
    private List<ApuestaResponse> ultimasApuestas;
}
