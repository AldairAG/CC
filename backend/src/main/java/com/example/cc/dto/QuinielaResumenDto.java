package com.example.cc.dto;

import com.example.cc.entities.Quiniela;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class QuinielaResumenDto {
    private Long id;
    private String codigoUnico;
    private String nombre;
    private String descripcion;
    private Quiniela.TipoQuiniela tipoQuiniela;
    private Quiniela.TipoDistribucion tipoDistribucion;
    private BigDecimal costoParticipacion;
    private BigDecimal poolActual;
    private Integer participantesActuales;
    private Integer maxParticipantes;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaCierre;
    private Quiniela.EstadoQuiniela estado;
    private Boolean esPublica;
    private String nombreCreador;
    private Integer totalEventos;
    
    public QuinielaResumenDto(Quiniela quiniela) {
        this.id = quiniela.getId();
        this.codigoUnico = quiniela.getCodigoUnico();
        this.nombre = quiniela.getNombre();
        this.descripcion = quiniela.getDescripcion();
        this.tipoQuiniela = quiniela.getTipoQuiniela();
        this.tipoDistribucion = quiniela.getTipoDistribucion();
        this.costoParticipacion = quiniela.getCostoParticipacion();
        this.poolActual = quiniela.getPoolActual();
        this.participantesActuales = quiniela.getParticipantesActuales();
        this.maxParticipantes = quiniela.getMaxParticipantes();
        this.fechaInicio = quiniela.getFechaInicio();
        this.fechaCierre = quiniela.getFechaCierre();
        this.estado = quiniela.getEstado();
        this.esPublica = quiniela.getEsPublica();
        this.totalEventos = quiniela.getEventos() != null ? quiniela.getEventos().size() : 0;
    }
}
