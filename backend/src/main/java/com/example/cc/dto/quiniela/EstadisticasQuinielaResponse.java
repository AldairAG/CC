package com.example.cc.dto.quiniela;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class EstadisticasQuinielaResponse {
    private Long id;
    private String nombre;
    private String estado;
    private Date fechaInicio;
    private Date fechaFin;
    private Float precioParticipacion;
    private BigDecimal premioAcumulado;
    private String tipoPremio;
    private Integer numeroParticipantes;
    private Integer numeroEventos;
    private Integer numeroPredicciones;
    private Boolean activa;
    private Boolean finalizada;
    private String descripcion;
}
