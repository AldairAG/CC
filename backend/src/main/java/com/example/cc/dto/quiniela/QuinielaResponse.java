package com.example.cc.dto.quiniela;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuinielaResponse {
    
    private Long id;
    private String nombre;
    private String descripcion;
    private Long creadorId;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private BigDecimal precioEntrada;
    private BigDecimal premioTotal;
    private Integer maxParticipantes;
    private Integer participantesActuales;
    private String estado;
    private String tipoDistribucion;
    private Integer porcentajePremiosPrimero;
    private Integer porcentajePremiosSegundo;
    private Integer porcentajePremiosTercero;
    private Boolean esPublica;
    private String codigoInvitacion;
    private Boolean esCrypto;
    private String cryptoTipo;
    private Boolean premiosDistribuidos;
    private List<EventoQuinielaResponse> eventos;
    private List<ParticipacionResponse> participaciones;
    private List<PremioResponse> premios;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventoQuinielaResponse {
        private Long id;
        private Long eventoId;
        private String nombreEvento;
        private Date fechaEvento;
        private String equipoLocal;
        private String equipoVisitante;
        private Integer resultadoLocal;
        private Integer resultadoVisitante;
        private Integer puntosPorAcierto;
        private Integer puntosPorResultadoExacto;
        private String estado;
        private Boolean finalizado;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipacionResponse {
        private Long id;
        private Long usuarioId;
        private LocalDateTime fechaParticipacion;
        private BigDecimal montoPagado;
        private Integer puntosObtenidos;
        private Integer posicionFinal;
        private BigDecimal premioGanado;
        private Boolean premioReclamado;
        private String estado;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PremioResponse {
        private Long id;
        private Integer posicion;
        private BigDecimal montoPremio;
        private Integer porcentajePremio;
        private Long usuarioGanadorId;
        private LocalDateTime fechaAsignacion;
        private Boolean premioReclamado;
        private String descripcion;
    }
}
