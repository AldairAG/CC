package com.example.cc.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CambiarPasswordRequest {
    @NotBlank(message = "La contraseña actual es requerida")
    private String passwordActual;
    
    @NotBlank(message = "La nueva contraseña es requerida")
    private String nuevaPassword;
    
    @NotBlank(message = "La confirmación de contraseña es requerida")
    private String confirmarPassword;
}
