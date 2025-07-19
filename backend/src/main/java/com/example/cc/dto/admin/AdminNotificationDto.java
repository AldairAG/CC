package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminNotificationDto {
    
    private Long idNotificacion;
    private String titulo;
    private String mensaje;
    private String contenido;
    
    // Tipo y categoría
    private String tipo; // SISTEMA, USUARIO, PROMOCION, ALERTA, MANTENIMIENTO
    private String categoria; // INFO, WARNING, ERROR, SUCCESS
    private String prioridad; // BAJA, NORMAL, ALTA, CRITICA
    
    // Destinatarios
    private String tipoDestinatario; // TODOS, GRUPO, INDIVIDUAL, ADMIN
    private String grupoDestino; // USUARIOS_PREMIUM, USUARIOS_ACTIVOS, ADMINISTRADORES
    private Long usuarioDestinatarioId;
    private String usuarioDestinatarioEmail;
    private Integer totalDestinatarios;
    private Integer entregadas;
    private Integer leidas;
    
    // Estado y configuración
    private String estado; // BORRADOR, PROGRAMADA, ENVIADA, ENTREGADA, FALLIDA
    private boolean activa;
    private boolean requiereAccion;
    private String accionRequerida;
    private String urlAccion;
    
    // Programación
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaProgramada;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaExpiracion;
    private boolean recurente;
    private String patronRecurrencia;
    
    // Canales de entrega
    private boolean notificacionWeb;
    private boolean notificacionEmail;
    private boolean notificacionPush;
    private boolean notificacionSms;
    
    // Información del remitente
    private String creadoPor;
    private String tipoCreador; // SISTEMA, ADMIN, AUTOMATICO
    private String departamento;
    
    // Métricas de engagement
    private Double tasaApertura;
    private Double tasaClick;
    private Integer totalClicks;
    private Integer totalRespuestas;
    
    // Contenido multimedia
    private String imagenUrl;
    private String iconoUrl;
    private String colorTema;
    private String plantilla;
    
    // Información técnica
    private String deviceTarget; // WEB, MOBILE, ALL
    private String versionMinima;
    private String geolocalizacion;
    private String idioma;
    
    // Auditoría y seguimiento
    private String estadoEntrega;
    private String motivoFallo;
    private Integer intentosEntrega;
    private LocalDateTime ultimoIntento;
    private String logEntrega;
}
