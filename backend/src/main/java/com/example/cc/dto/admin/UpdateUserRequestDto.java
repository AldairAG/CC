package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequestDto {
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long idUsuario;
    
    private String username;
    
    @Email(message = "El email debe tener un formato válido")
    private String email;
    
    private String nombreCompleto;
    private String apellidos;
    private String telefono;
    private Boolean activo;
    private BigDecimal saldo;
    private Date fechaNacimiento;
    
    // Información administrativa
    private String estado; // ACTIVO, INACTIVO, SUSPENDIDO, BLOQUEADO
    private String tipoUsuario; // NORMAL, VIP, PREMIUM
    private String rol; // USER, ADMIN, MODERATOR
    
    // Información de contacto
    private String pais;
    private String ciudad;
    private String codigoPostal;
    
    // Configuraciones
    private Boolean notificacionesEmail;
    private Boolean notificacionesSms;
    private String idioma;
    private String monedaPreferida;
    private Boolean verificado;
    private Boolean twoFactorEnabled;
    
    // Campos de auditoría
    private String actualizadoPor;
}
