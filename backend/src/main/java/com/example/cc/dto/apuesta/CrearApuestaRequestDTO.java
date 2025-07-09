package com.example.cc.dto.apuesta;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrearApuestaRequestDTO {

    @NotNull(message = "El ID del evento es obligatorio")
    @Positive(message = "El ID del evento debe ser positivo")
    @JsonProperty("eventoId")
    private Long eventoId;

    @NotNull(message = "El ID de la cuota es obligatorio")
    @Positive(message = "El ID de la cuota debe ser positivo")
    @JsonProperty("cuotaId")
    private Long cuotaId;

    @NotNull(message = "El monto apostado es obligatorio")
    @DecimalMin(value = "10.00", message = "El monto mínimo de apuesta es $10.00")
    @DecimalMax(value = "10000.00", message = "El monto máximo de apuesta es $10,000.00")
    @Digits(integer = 10, fraction = 2, message = "El monto debe tener máximo 2 decimales")
    @JsonProperty("montoApostado")
    private BigDecimal montoApostado;

    @Size(max = 100, message = "El tipo de apuesta no puede exceder 100 caracteres")
    @JsonProperty("tipoApuesta")
    private String tipoApuesta;

    @Size(max = 255, message = "La predicción no puede exceder 255 caracteres")
    @JsonProperty("prediccion")
    private String prediccion;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    @JsonProperty("descripcion")
    private String descripcion;

    /**
     * Validación personalizada para verificar que el monto apostado sea válido
     */
    public boolean isMontoValido() {
        return montoApostado != null && 
               montoApostado.compareTo(new BigDecimal("10.00")) >= 0 &&
               montoApostado.compareTo(new BigDecimal("10000.00")) <= 0;
    }

    /**
     * Obtiene el monto apostado como BigDecimal con escala 2
     */
    public BigDecimal getMontoApostadoEscalado() {
        return montoApostado != null ? montoApostado.setScale(2, RoundingMode.HALF_UP) : null;
    }

    /**
     * Método toString personalizado para logging sin información sensible
     */
    @Override
    public String toString() {
        return "CrearApuestaRequestDTO{" +
                "eventoId=" + eventoId +
                ", cuotaId=" + cuotaId +
                ", montoApostado=" + (montoApostado != null ? "***" : null) +
                ", tipoApuesta='" + tipoApuesta + '\'' +
                ", prediccion='" + prediccion + '\'' +
                ", descripcion='" + descripcion + '\'' +
                '}';
    }
}
