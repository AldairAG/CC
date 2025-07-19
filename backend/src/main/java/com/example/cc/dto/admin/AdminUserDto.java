package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.cc.entities.DocumentoIdentidad;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDto {
    
    private Long idUsuario;
    private String username;
    private String email;
    private String nombreCompleto;
    private String apellidos;
    private String telefono;
    private boolean activo;
    private BigDecimal saldoUsuario;
    private String fechaNacimiento;

    // Información administrativa
    private String estado; // ACTIVO, INACTIVO, SUSPENDIDO, BLOQUEADO
    private String tipoUsuario; // NORMAL, VIP, PREMIUM
    private String rol; // USER, ADMIN, MODERATOR
    
    // Estadísticas del usuario
    private Long totalApuestas;
    private BigDecimal montoTotalApostado;
    private BigDecimal gananciasObtenidas;
    private Long quinielasParticipadas;
    private Long transaccionesCrypto;
    
    // Información de seguridad
    private boolean verificado;
    private boolean twoFactorEnabled;
    private LocalDateTime ultimoLogin;
    private String ultimaIp;
    private Integer intentosLogin;
    
    // Auditoría
    private String fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private String creadoPor;
    private String actualizadoPor;
    
    // Información de contacto
    private String pais;
    private String ciudad;
    private String codigoPostal;
    
    // Configuraciones
    private boolean notificacionesEmail;
    private boolean notificacionesSms;
    private String idioma;
    private String monedaPreferida;

    private List<DocumentoIdentidad> documentos;
}
