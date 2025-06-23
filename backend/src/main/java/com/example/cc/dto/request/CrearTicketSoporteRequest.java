package com.example.cc.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CrearTicketSoporteRequest {
    @NotBlank(message = "El asunto es requerido")
    private String asunto;
    
    @NotNull(message = "La categoría es requerida")
    private String categoria;
    
    private String prioridad = "MEDIA";
    
    @NotBlank(message = "La descripción es requerida")
    private String descripcion;
}
