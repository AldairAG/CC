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
public class AdminEventDto {
    
    private Long idEvento;
    private String codigoEvento;
    private String nombre;
    private String descripcion;
    
    // Información del deporte/liga
    private String deporte; // FUTBOL, BASKETBALL, TENNIS
    private String liga;
    private String temporada;
    private String categoria;
    
    // Equipos/Participantes
    private String equipoLocal;
    private String equipoVisitante;
    private String logoEquipoLocal;
    private String logoEquipoVisitante;
    
    // Estado del evento
    private String estado; // PROGRAMADO, EN_VIVO, FINALIZADO, SUSPENDIDO, CANCELADO
    private String resultado;
    private String marcador;
    private Integer golesLocal;
    private Integer golesVisitante;
    
    // Fechas y horarios
    private LocalDateTime fechaEvento;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    
    // Información de apuestas
    private BigDecimal cuotaLocal;
    private BigDecimal cuotaEmpate;
    private BigDecimal cuotaVisitante;
    private Integer totalApuestas;
    private BigDecimal montoTotalApostado;
    private BigDecimal exposicionRiesgo;
    
    // Fuente de datos
    private String fuenteDatos; // MANUAL, THE_SPORTS_DB, API_EXTERNA
    private String idEventoExterno;
    private String urlStreamig;
    private boolean verificado;
    
    // Información del lugar
    private String estadio;
    private String ciudad;
    private String pais;
    private Integer capacidad;
    private Integer asistencia;
    
    // Métricas administrativas
    private Double popularidad;
    private Integer participacionQuinielas;
    private BigDecimal ingresoGenerado;
    private String nivelRiesgo; // BAJO, MEDIO, ALTO
    
    // Información adicional
    private String arbitro;
    private String clima;
    private String notas;
    private boolean destacado;
    private Integer prioridad;
    
    // Auditoría
    private String creadoPor;
    private String modificadoPor;
    private String estadoAdmin; // PENDIENTE, APROBADO, RECHAZADO
    private String motivoRechazo;
}
