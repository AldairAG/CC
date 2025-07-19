package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminRoleDto {
    
    private Long idRol;
    private String nombre;
    private String descripcion;
    private String codigo;
    
    // Información del rol
    private String categoria; // SISTEMA, USUARIO, ADMIN, ESPECIAL
    private String nivel; // BASICO, INTERMEDIO, AVANZADO, MASTER
    private Integer prioridad;
    private boolean activo;
    private boolean sistemico; // No se puede modificar/eliminar
    
    // Permisos generales
    private Set<String> permisos;
    private Set<String> modulosAcceso;
    private Set<String> funcionesEspeciales;
    
    // Permisos específicos por módulo
    private boolean puedeVerUsuarios;
    private boolean puedeEditarUsuarios;
    private boolean puedeEliminarUsuarios;
    private boolean puedeCrearUsuarios;
    
    private boolean puedeVerApuestas;
    private boolean puedeEditarApuestas;
    private boolean puedeAnularApuestas;
    private boolean puedeVerHistorialApuestas;
    
    private boolean puedeVerQuinielas;
    private boolean puedeCrearQuinielas;
    private boolean puedeEditarQuinielas;
    private boolean puedeEliminarQuinielas;
    private boolean puedeFinalizarQuinielas;
    
    private boolean puedeVerEventos;
    private boolean puedeCrearEventos;
    private boolean puedeEditarEventos;
    private boolean puedeEliminarEventos;
    private boolean puedeActualizarResultados;
    
    private boolean puedeVerFinanzas;
    private boolean puedeVerReportes;
    private boolean puedeExportarDatos;
    private boolean puedeVerAnalytics;
    
    private boolean puedeGestionarNotificaciones;
    private boolean puedeEnviarNotificaciones;
    private boolean puedeVerLogs;
    private boolean puedeGestionarConfiguracion;
    
    private boolean puedeVerCrypto;
    private boolean puedeGestionarCrypto;
    private boolean puedeVerTransacciones;
    
    // Limitaciones y restricciones
    private Integer limiteDiarioOperaciones;
    private Integer limiteMontoOperacion;
    private Set<String> horariosAcceso;
    private Set<String> ipPermitidas;
    private boolean requiere2FA;
    private Integer tiempoSesionMaximo;
    
    // Información de asignación
    private Integer usuariosAsignados;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private String creadoPor;
    private String modificadoPor;
    
    // Información adicional
    private String colorIdentificacion;
    private String iconoRol;
    private String notas;
    private Integer ordenVisualizacion;
    
    // Auditoría
    private boolean auditarAcciones;
    private String nivelAuditoria; // BASICO, COMPLETO, DETALLADO
    private Integer diasRetencionLogs;
}
