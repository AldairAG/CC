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
public class AdminQuinielaDto {
    
    private Long idQuiniela;
    private String codigo;
    private String nombre;
    private String descripcion;
    
    // Información del creador
    private Long creadorId;
    private String creadorUsername;
    private String creadorEmail;
    
    // Configuración financiera
    private BigDecimal montoEntrada;
    private BigDecimal poolTotal;
    private BigDecimal poolAcumulado;
    private BigDecimal comisionPlataforma;
    private BigDecimal premioGanador;
    
    // Estado y participación
    private String estado; // CREADA, ACTIVA, EN_CURSO, FINALIZADA, CANCELADA
    private Integer participantesActuales;
    private Integer participantesMaximos;
    private Integer participantesMinimos;
    
    // Configuración de eventos
    private Integer totalEventos;
    private Integer eventosFinalizados;
    private Integer eventosPendientes;
    private Integer aciertosNecesarios;
    
    // Fechas importantes
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private LocalDateTime fechaLimiteParticipacion;
    private LocalDateTime fechaFinalizacion;
    
    // Información de ganadores
    private Integer cantidadGanadores;
    private BigDecimal premioDistribuido;
    private String criterioGanador; // MAXIMO_ACIERTOS, PUNTUACION_TOTAL
    
    // Configuración avanzada
    private boolean privada;
    private String codigoAcceso;
    private boolean permiteMenoresEdad;
    private String tipoQuiniela; // DEPORTIVA, FUTBOL, BASKET, TENIS
    
    // Auditoría administrativa
    private String estadoAdmin; // REVISADA, APROBADA, RECHAZADA, SUSPENDIDA
    private String motivoEstado;
    private String revisadoPor;
    private LocalDateTime fechaRevision;
    
    // Métricas de rendimiento
    private Double tasaParticipacion;
    private Double tasaCompletitud;
    private BigDecimal ingresoGenerado;
    private String popularidad; // BAJA, MEDIA, ALTA
}
