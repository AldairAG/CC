package com.example.cc.dto.quiniela;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearQuinielaRequest {
    
    private String nombre;
    private String descripcion;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaInicio;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaFin;
    private BigDecimal precioEntrada;
    private Integer maxParticipantes;
    private String tipoDistribucion; // WINNER_TAKES_ALL, TOP_3, PERCENTAGE, ELIMINATION, ACCUMULATIVE, TEAMS
    private Integer porcentajePremiosPrimero = 100;
    private Integer porcentajePremiosSegundo = 0;
    private Integer porcentajePremiosTercero = 0;
    private Boolean esPublica = true;
    private List<EventoQuinielaRequest> eventos;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventoQuinielaRequest {
        private Long eventoId;
        private String nombreEvento;
        @JsonFormat(pattern = "yyyy-MM-dd")
        private Date fechaEvento;
        private String equipoLocal;
        private String equipoVisitante;
        private Integer puntosPorAcierto = 3;
        private Integer puntosPorResultadoExacto = 5;
    }
}
