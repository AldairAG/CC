package com.example.cc.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TicketSoporteResponse {
    private Long idTicket;
    private String asunto;
    private String categoria;
    private String categoriaDescripcion;
    private String prioridad;
    private String prioridadDescripcion;
    private String estado;
    private String estadoDescripcion;
    private String descripcion;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private LocalDateTime fechaCierre;
    private String agenteAsignado;
}
