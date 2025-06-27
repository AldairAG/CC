package com.example.cc.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoDeportivoResponse {

    private Long id;
    private String eventoIdExterno;
    private String nombreEvento;
    private String liga;
    private String deporte;
    private String equipoLocal;
    private String equipoVisitante;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaEvento;
    
    private String estado;
    private String temporada;
    private String descripcion;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaCreacion;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaActualizacion;

    /**
     * Constructor para crear response desde entidad
     */
    public EventoDeportivoResponse(com.example.cc.entities.EventoDeportivo evento) {
        this.id = evento.getId();
        this.eventoIdExterno = evento.getEventoIdExterno();
        this.nombreEvento = evento.getNombreEvento();
        this.liga = evento.getLiga();
        this.deporte = evento.getDeporte();
        this.equipoLocal = evento.getEquipoLocal();
        this.equipoVisitante = evento.getEquipoVisitante();
        this.fechaEvento = evento.getFechaEvento();
        this.estado = evento.getEstado();
        this.temporada = evento.getTemporada();
        this.descripcion = evento.getDescripcion();
        this.fechaCreacion = evento.getFechaCreacion();
        this.fechaActualizacion = evento.getFechaActualizacion();
    }
}
