package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminConfigDto {
    
    private Long idConfiguracion;
    private String clave;
    private String valor;
    private String descripcion;
    
    // Categorización
    private String categoria; // GENERAL, APUESTAS, FINANZAS, NOTIFICACIONES, SEGURIDAD, CRYPTO
    private String subcategoria;
    private String modulo;
    private String componente;
    
    // Tipo de configuración
    private String tipoDato; // STRING, INTEGER, DECIMAL, BOOLEAN, JSON, ARRAY
    private String tipoConfiguracion; // SISTEMA, USUARIO, FUNCIONAL, OPERATIVA
    private String alcance; // GLOBAL, POR_USUARIO, POR_SESION, POR_MODULO
    
    // Validación y restricciones
    private String valorMinimo;
    private String valorMaximo;
    private String patronValidacion;
    private String valoresPermitidos;
    private boolean requerido;
    private String valorPorDefecto;
    
    // Configuraciones específicas de negocio
    
    // Configuraciones de apuestas
    private BigDecimal cuotaMinima;
    private BigDecimal cuotaMaxima;
    private BigDecimal montoMinimoApuesta;
    private BigDecimal montoMaximoApuesta;
    private Integer tiempoLimiteApuesta; // en minutos
    
    // Configuraciones financieras
    private BigDecimal comisionPlataforma;
    private BigDecimal limiteRetiroDiario;
    private BigDecimal limiteCargaDiaria;
    private String metodosRetiroPermitidos;
    private String monedas;
    
    // Configuraciones de crypto
    private Map<String, BigDecimal> comisionesCrypto;
    private Map<String, Boolean> criptomonedasActivas;
    private Map<String, String> direccionesWallet;
    private Integer confirmacionesRequeridas;
    
    // Configuraciones de quinielas
    private Integer participantesMinimosQuiniela;
    private Integer participantesMaximosQuiniela;
    private BigDecimal montoMinimoQuiniela;
    private Integer diasMaximosQuiniela;
    private Integer eventosMinimosQuiniela;
    
    // Configuraciones de usuarios
    private Integer edadMinimaUsuario;
    private boolean requiereVerificacionEmail;
    private boolean requiereVerificacionTelefono;
    private Integer intentosLoginMaximos;
    private Integer tiempoBloqueoLogin; // en minutos
    
    // Configuraciones de notificaciones
    private boolean notificacionesEmail;
    private boolean notificacionesPush;
    private boolean notificacionesSms;
    private String plantillaEmailPorDefecto;
    
    // Estado y control
    private boolean activa;
    private boolean modificable;
    private boolean visible;
    private String nivelAcceso; // PUBLICO, PRIVADO, ADMIN_ONLY
    private boolean sensible; // Información sensible
    
    // Auditoría y versionado
    private String version;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private String creadoPor;
    private String modificadoPor;
    private String motivoCambio;
    private String valorAnterior;
    
    // Impacto y dependencias
    private boolean requiereReinicio;
    private String impactoSistema; // NINGUNO, BAJO, MEDIO, ALTO, CRITICO
    private String dependencias;
    private String configuracionesRelacionadas;
    
    // Información adicional
    private String ayuda;
    private String ejemplos;
    private String urlDocumentacion;
    private String etiquetas;
    private Integer ordenVisualizacion;
}
