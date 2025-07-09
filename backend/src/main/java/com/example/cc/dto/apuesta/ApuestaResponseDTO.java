package com.example.cc.dto.apuesta;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApuestaResponseDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("usuarioId")
    private Long usuarioId;

    @JsonProperty("eventoId")
    private Long eventoId;

    @JsonProperty("eventoNombre")
    private String eventoNombre;

    @JsonProperty("equipoLocal")
    private String equipoLocal;

    @JsonProperty("equipoVisitante")
    private String equipoVisitante;

    @JsonProperty("cuotaId")
    private Long cuotaId;

    @JsonProperty("tipoApuesta")
    private String tipoApuesta;

    @JsonProperty("prediccion")
    private String prediccion;

    @JsonProperty("montoApostado")
    private BigDecimal montoApostado;

    @JsonProperty("valorCuotaMomento")
    private BigDecimal valorCuotaMomento;

    @JsonProperty("montoPotencialGanancia")
    private BigDecimal montoPotencialGanancia;

    @JsonProperty("montoGanancia")
    private BigDecimal montoGanancia;

    @JsonProperty("estado")
    private String estado;

    @JsonProperty("esGanadora")
    private Boolean esGanadora;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("fechaCreacion")
    private LocalDateTime fechaCreacion;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("fechaResolucion")
    private LocalDateTime fechaResolucion;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("fechaActualizacion")
    private LocalDateTime fechaActualizacion;

    @JsonProperty("descripcion")
    private String descripcion;

    /**
     * Calcula el retorno total (monto apostado + ganancia)
     */
    public BigDecimal getRetornoTotal() {
        if (montoGanancia != null && montoApostado != null) {
            return montoApostado.add(montoGanancia);
        }
        return montoApostado;
    }

    /**
     * Verifica si la apuesta está pendiente
     */
    public boolean isPendiente() {
        return "PENDIENTE".equalsIgnoreCase(estado) || "ACEPTADA".equalsIgnoreCase(estado);
    }

    /**
     * Verifica si la apuesta está resuelta
     */
    public boolean isResuelta() {
        return "RESUELTA".equalsIgnoreCase(estado);
    }

    /**
     * Verifica si la apuesta está cancelada
     */
    public boolean isCancelada() {
        return "CANCELADA".equalsIgnoreCase(estado) || "RECHAZADA".equalsIgnoreCase(estado);
    }
}
