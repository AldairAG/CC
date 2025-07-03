package com.example.cc.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.cc.entities.Quiniela.EstadoQuiniela;
import com.example.cc.entities.Quiniela.TipoDistribucion;
import com.example.cc.entities.Quiniela.TipoQuiniela;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuinielaResponseDto {
    
    private Long id;
    private String codigoUnico;
    private String nombre;
    private String descripcion;
    private TipoQuiniela tipoQuiniela;
    private TipoDistribucion tipoDistribucion;
    private BigDecimal costoParticipacion;
    private BigDecimal premioMinimo;
    private BigDecimal poolActual;
    private Integer maxParticipantes;
    private Integer participantesActuales;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaCierre;
    private LocalDateTime fechaResultados;
    private EstadoQuiniela estado;
    private String reglasEspeciales;
    private Long creadorId;
    private Boolean esPublica;
    private Boolean requiereAprobacion;
    private String configuracionDistribucion;
    private BigDecimal porcentajeCasa;
    private BigDecimal porcentajeCreador;
    private Boolean activaBonusPool;
    private Integer requiereMinParticipantes;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    
    // Información adicional sin relaciones circulares
    private Integer totalEventos;
    private String nombreCreador; // Solo el nombre, no toda la entidad
}
