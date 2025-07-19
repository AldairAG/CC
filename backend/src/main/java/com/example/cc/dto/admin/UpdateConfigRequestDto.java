package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateConfigRequestDto {
    
    @NotNull(message = "El ID es requerido")
    private Long idConfiguracion;
    
    @NotBlank(message = "El valor es requerido")
    private String valor;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;
    
    private String motivoCambio;
    
    // Configuraciones específicas según el tipo
    private BigDecimal cuotaMinima;
    private BigDecimal cuotaMaxima;
    private BigDecimal montoMinimoApuesta;
    private BigDecimal montoMaximoApuesta;
    private Integer tiempoLimiteApuesta;
    
    private BigDecimal comisionPlataforma;
    private BigDecimal limiteRetiroDiario;
    private BigDecimal limiteCargaDiaria;
    private String metodosRetiroPermitidos;
    private String monedas;
    
    private Map<String, BigDecimal> comisionesCrypto;
    private Map<String, Boolean> criptomonedasActivas;
    private Map<String, String> direccionesWallet;
    private Integer confirmacionesRequeridas;
    
    private Integer participantesMinimosQuiniela;
    private Integer participantesMaximosQuiniela;
    private BigDecimal montoMinimoQuiniela;
    private Integer diasMaximosQuiniela;
    private Integer eventosMinimosQuiniela;
    
    private Integer edadMinimaUsuario;
    private boolean requiereVerificacionEmail;
    private boolean requiereVerificacionTelefono;
    private Integer intentosLoginMaximos;
    private Integer tiempoBloqueoLogin;
    
    private boolean notificacionesEmail;
    private boolean notificacionesPush;
    private boolean notificacionesSms;
    private String plantillaEmailPorDefecto;
    
    // Control de cambios
    private boolean requiereReinicio;
    private String impactoSistema;
}
