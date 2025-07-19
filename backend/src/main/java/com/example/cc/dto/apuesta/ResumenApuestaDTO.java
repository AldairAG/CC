package com.example.cc.dto.apuesta;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumenApuestaDTO {
    private Long id;
    private String eventoNombre;
    private String prediccion;
    private BigDecimal montoApostado;
    private String estado;
    private LocalDateTime fechaCreacion;
    private BigDecimal valorCuotaMomento;
    private Boolean esGanadora;
    private BigDecimal montoGanancia;
}
