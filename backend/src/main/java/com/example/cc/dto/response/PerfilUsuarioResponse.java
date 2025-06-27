package com.example.cc.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilUsuarioResponse {
    private Long idUsuario;
    private String email;
    private BigDecimal saldoUsuario;
    private Boolean estadoCuenta;
    
    // Datos del perfil
    private Long idPerfil;
    private String fotoPerfil;
    private String nombre;
    private String apellido;
    private Date fechaRegistro;
    private Date fechaNacimiento;
    private String telefono;
    private String lada;
    private String username;
    
    // Información adicional
    private boolean tiene2FAHabilitado;
    private int documentosSubidos;
    private Date ultimaActividad;
}
