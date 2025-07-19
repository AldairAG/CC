package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequestDto {
    
    @NotBlank(message = "El username es obligatorio")
    private String username;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
    
    @NotBlank(message = "El nombre completo es obligatorio")
    private String nombreCompleto;

    private String apellidos;
    private Date fechaNacimiento;
    private String telefono;
    
    @Builder.Default
    private boolean activo = true;
    
    @Builder.Default
    private BigDecimal saldo = BigDecimal.ZERO;
    
    // Información administrativa
    @Builder.Default
    private String estado = "ACTIVO"; // ACTIVO, INACTIVO, SUSPENDIDO, BLOQUEADO
    
    @Builder.Default
    private String tipoUsuario = "NORMAL"; // NORMAL, VIP, PREMIUM
    
    @Builder.Default
    private String rol = "USER"; // USER, ADMIN, MODERATOR
    
    // Información de contacto
    private String pais;
    private String ciudad;
    private String codigoPostal;
    
    // Configuraciones
    @Builder.Default
    private boolean notificacionesEmail = true;
    
    @Builder.Default
    private boolean notificacionesSms = false;
    
    @Builder.Default
    private String idioma = "es";
    
    @Builder.Default
    private String monedaPreferida = "USD";
    
    @Builder.Default
    private boolean verificado = false;
    
    @Builder.Default
    private boolean twoFactorEnabled = false;
}
