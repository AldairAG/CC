package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationRequestDto {
    
    @NotBlank(message = "El título es requerido")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    private String titulo;
    
    @NotBlank(message = "El mensaje es requerido")
    @Size(max = 1000, message = "El mensaje no puede exceder 1000 caracteres")
    private String mensaje;
    
    @Size(max = 5000, message = "El contenido no puede exceder 5000 caracteres")
    private String contenido;
    
    @NotBlank(message = "El tipo es requerido")
    private String tipo; // SISTEMA, USUARIO, PROMOCION, ALERTA, MANTENIMIENTO
    
    @NotBlank(message = "La categoría es requerida")
    private String categoria; // INFO, WARNING, ERROR, SUCCESS
    
    @NotBlank(message = "La prioridad es requerida")
    private String prioridad; // BAJA, NORMAL, ALTA, CRITICA
    
    @NotBlank(message = "El tipo de destinatario es requerido")
    private String tipoDestinatario; // TODOS, GRUPO, INDIVIDUAL, ADMIN
    
    private String grupoDestino; // USUARIOS_PREMIUM, USUARIOS_ACTIVOS, ADMINISTRADORES
    private Long usuarioDestinatarioId;
    
    // Configuración de entrega
    private boolean notificacionWeb = true;
    private boolean notificacionEmail = false;
    private boolean notificacionPush = false;
    private boolean notificacionSms = false;
    
    // Programación
    private LocalDateTime fechaProgramada;
    private LocalDateTime fechaExpiracion;
    private boolean recurente = false;
    private String patronRecurrencia;
    
    // Configuración adicional
    private boolean requiereAccion = false;
    private String accionRequerida;
    private String urlAccion;
    private String imagenUrl;
    private String iconoUrl;
    private String colorTema;
    private String plantilla;
    
    // Targeting
    private String deviceTarget; // WEB, MOBILE, ALL
    private String versionMinima;
    private String geolocalizacion;
    private String idioma;
}
