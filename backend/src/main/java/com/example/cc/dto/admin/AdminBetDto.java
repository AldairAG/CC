package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminBetDto {
    
    private Long idApuesta;
    private String tipoApuesta; // SIMPLE, MULTIPLE, SISTEMA
    
    // Información del usuario
    private Long usuarioId;
    private String usuarioUsername;
    private String usuarioEmail;
    
    // Información del evento
    private Long eventoId;
    private String eventoNombre;
    private String equipoLocal;
    private String equipoVisitante;
    private String deporte;
    private String liga;
    
    // Información de la apuesta
    private String prediccion;
    private String descripcion;
    private BigDecimal cuotaApostada;
    private BigDecimal montoApostado;
    private BigDecimal gananciasPotenciales;
    private BigDecimal gananciasObtenidas;
    
    // Estado y resultado
    private String estado; // PENDIENTE, GANADA, PERDIDA, CANCELADA, ANULADA
    private String resultado; // GANADOR, PERDEDOR, EMPATE
    private boolean finalizada;
    
    // Información de riesgo
    private String nivelRiesgo; // BAJO, MEDIO, ALTO
    private BigDecimal probabilidad;
    private boolean sospechosa;
    private String motivoSospecha;
    
    // Auditoría
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaFinalizacion;
    private LocalDateTime fechaActualizacion;
    private String procesadoPor;
    
    // Información del evento en tiempo real
    private String estadoEvento; // PROGRAMADO, EN_VIVO, FINALIZADO, CANCELADO
    private LocalDateTime fechaEvento;
    private Integer marcadorLocal;
    private Integer marcadorVisitante;
    
}
