package com.example.cc.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ParticipacionDetalleDto {
    private Long participacionId;
    private String nombreUsuario;
    private String emailUsuario;
    private LocalDateTime fechaParticipacion;
    private BigDecimal montoApostado;
    private Integer aciertos;
    private BigDecimal puntuacion;
    private BigDecimal premioGanado;
    private String estado;
    private List<PrediccionDetalleDto> predicciones;
    
    @Data
    public static class PrediccionDetalleDto {
        private Long eventoId;
        private String nombreEvento;
        private String equipoLocal;
        private String equipoVisitante;
        private String prediccion;
        private String resultadoReal;
        private Boolean esCorrecto;
        private Integer confianza;
        private LocalDateTime fechaPrediccion;
    }
}
