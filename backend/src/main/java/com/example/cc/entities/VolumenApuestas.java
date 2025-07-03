package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "volumen_apuestas", indexes = {
    @Index(name = "idx_evento_tipo_resultado", columnList = "evento_deportivo_id, tipo_resultado"),
    @Index(name = "idx_fecha_actualizacion", columnList = "fecha_actualizacion")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class VolumenApuestas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_deportivo_id", nullable = false)
    private EventoDeportivo eventoDeportivo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_resultado", nullable = false)
    private TipoResultado tipoResultado;

    @Column(name = "numero_apuestas", nullable = false)
    private Integer numeroApuestas = 0;

    @Column(name = "total_apostado", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalApostado = BigDecimal.ZERO;

    @Column(name = "apuesta_promedio", precision = 10, scale = 2)
    private BigDecimal apuestaPromedio = BigDecimal.ZERO;

    @Column(name = "apuesta_maxima", precision = 10, scale = 2)
    private BigDecimal apuestaMaxima = BigDecimal.ZERO;

    @Column(name = "apuesta_minima", precision = 10, scale = 2)
    private BigDecimal apuestaMinima = BigDecimal.ZERO;

    @Column(name = "porcentaje_distribución", precision = 5, scale = 2)
    private BigDecimal porcentajeDistribucion = BigDecimal.ZERO;

    @Column(name = "tendencia_reciente")
    private String tendenciaReciente; // "SUBIENDO", "BAJANDO", "ESTABLE"

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
        
        // Recalcular apuesta promedio
        if (numeroApuestas > 0 && totalApostado.compareTo(BigDecimal.ZERO) > 0) {
            apuestaPromedio = totalApostado.divide(
                new BigDecimal(numeroApuestas), 
                2, 
                java.math.RoundingMode.HALF_UP
            );
        }
    }

    // Métodos de utilidad
    public void agregarApuesta(BigDecimal montoApuesta) {
        numeroApuestas++;
        totalApostado = totalApostado.add(montoApuesta);
        
        if (apuestaMaxima.compareTo(montoApuesta) < 0) {
            apuestaMaxima = montoApuesta;
        }
        
        if (apuestaMinima.compareTo(BigDecimal.ZERO) == 0 || 
            apuestaMinima.compareTo(montoApuesta) > 0) {
            apuestaMinima = montoApuesta;
        }
    }
}
