package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuinielaRequestDto {
    
    @NotBlank(message = "El código es requerido")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;
    
    @NotNull(message = "El monto de entrada es requerido")
    private BigDecimal montoEntrada;
    
    @NotNull(message = "Los participantes máximos son requeridos")
    private Integer participantesMaximos;
    
    @NotNull(message = "Los participantes mínimos son requeridos")
    private Integer participantesMinimos;
    
    @NotNull(message = "Los aciertos necesarios son requeridos")
    private Integer aciertosNecesarios;
    
    @NotNull(message = "La fecha de inicio es requerida")
    private LocalDateTime fechaInicio;
    
    @NotNull(message = "La fecha de fin es requerida")
    private LocalDateTime fechaFin;
    
    @NotNull(message = "La fecha límite de participación es requerida")
    private LocalDateTime fechaLimiteParticipacion;
    
    private boolean privada;
    private String codigoAcceso;
    private boolean permiteMenoresEdad;
    private String tipoQuiniela; // DEPORTIVA, FUTBOL, BASKET, TENIS
    private String criterioGanador; // MAXIMO_ACIERTOS, PUNTUACION_TOTAL
    
    @NotNull(message = "Los eventos son requeridos")
    private Set<Long> eventosIds;
    
    private BigDecimal comisionPlataforma;
    private String notas;
}
