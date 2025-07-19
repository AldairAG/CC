package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoleRequestDto {
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;
    
    @NotBlank(message = "El código es requerido")
    @Size(max = 50, message = "El código no puede exceder 50 caracteres")
    private String codigo;
    
    private String categoria; // SISTEMA, USUARIO, ADMIN, ESPECIAL
    private String nivel; // BASICO, INTERMEDIO, AVANZADO, MASTER
    private Integer prioridad;
    
    // Permisos generales
    private Set<String> permisos;
    private Set<String> modulosAcceso;
    private Set<String> funcionesEspeciales;
    
    
}
