package com.example.cc.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventoQuinielaRequest {
    private Long id; // Para eventos existentes (opcional)
    private String nombreEvento;
    private String equipoLocal;
    private String equipoVisitante;
    private LocalDateTime fechaEvento;
    private Integer puntosPorAcierto = 10;
    private BigDecimal multiplicadorPuntos = new BigDecimal("1.0");
    private Boolean esObligatorio = true;
    private String tipoPrediccion = "RESULTADO"; // RESULTADO, MARCADOR_EXACTO, GOLES_OVER_UNDER
    private String liga;
    private String deporte;
    private String descripcion;
}
