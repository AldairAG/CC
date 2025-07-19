package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequestDto {
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String nombre;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;
    
    @NotBlank(message = "El deporte es requerido")
    private String deporte;
    
    @NotBlank(message = "La liga es requerida")
    private String liga;
    
    @NotBlank(message = "El equipo local es requerido")
    private String equipoLocal;
    
    @NotBlank(message = "El equipo visitante es requerido")
    private String equipoVisitante;
    
    @NotNull(message = "La fecha del evento es requerida")
    private LocalDateTime fechaEvento;
    
    private String logoEquipoLocal;
    private String logoEquipoVisitante;
    private String temporada;
    private String categoria;
    private String estadio;
    private String ciudad;
    private String pais;
    
    // Cuotas iniciales
    private BigDecimal cuotaLocal;
    private BigDecimal cuotaEmpate;
    private BigDecimal cuotaVisitante;
    
    // Información adicional
    private String arbitro;
    private String clima;
    private String notas;
    private boolean destacado;
    private Integer prioridad;
    private String urlStreamig;
    
    // Configuración
    private String fuenteDatos; // MANUAL, THE_SPORTS_DB, API_EXTERNA
    private String idEventoExterno;
    private boolean verificado;
}
