package com.example.cc.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RankingParticipacionDto {
    private Long participacionId;
    private String nombreUsuario;
    private Integer aciertos;
    private BigDecimal puntuacion;
    private BigDecimal premioGanado;
    private Integer posicion;
    
    public RankingParticipacionDto(Long participacionId, String nombreUsuario, 
                                 Integer aciertos, BigDecimal puntuacion, 
                                 BigDecimal premioGanado, Integer posicion) {
        this.participacionId = participacionId;
        this.nombreUsuario = nombreUsuario;
        this.aciertos = aciertos;
        this.puntuacion = puntuacion;
        this.premioGanado = premioGanado;
        this.posicion = posicion;
    }
}
