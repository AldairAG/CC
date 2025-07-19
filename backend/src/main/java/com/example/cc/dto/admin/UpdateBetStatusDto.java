package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBetStatusDto {
    
    @NotBlank(message = "El estado es obligatorio")
    private String estado; // PENDIENTE, GANADA, PERDIDA, CANCELADA, ANULADA
    private Boolean isGanadora;
    private String motivo;
    private String procesadoPor;
}
