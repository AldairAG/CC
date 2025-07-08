package com.example.cc.dto.request;

import com.example.cc.entities.Quiniela;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
 
@Data
public class CrearQuinielaRequest {
    private String nombre;
    private String descripcion;
    private Quiniela.TipoQuiniela tipoQuiniela;
    private Quiniela.TipoDistribucion tipoDistribucion;
    private BigDecimal costoParticipacion;
    private BigDecimal premioMinimo;
    private Integer maxParticipantes;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaCierre;
    private Long creadorId;
    private Boolean esPublica = true;
    private Boolean requiereAprobacion = false;
    private String reglasEspeciales;
    private Integer requiereMinParticipantes;
    private BigDecimal porcentajeCasa;
    private BigDecimal porcentajeCreador;
    private Map<String, Object> configuracionDistribucion;
    private List<EventoQuinielaRequest> eventos; // Agregamos los eventos
    private String tipoPrediccionNombre; // Tipo de predicción para todos los eventos de la quiniela
}
