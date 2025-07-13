package com.example.cc.dto.apuestas;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class EstadisticasApuestaDTO {
    private int totalApuestas;
    private BigDecimal montoTotalApostado;
    private int apuestasGanadas;
    private int apuestasPerdidas;
    private int apuestasPendientes;
    private BigDecimal gananciaTotal;
    private double rentabilidad;
}
