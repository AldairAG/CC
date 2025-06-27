package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Entity
@Table(name = "prediccion_eventos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrediccionEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participacion_id", nullable = false)
    private QuinielaParticipacion participacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_deportivo_id", nullable = false)
    private EventoDeportivo eventoDeportivo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_prediccion_id", nullable = false)
    private TipoPrediccion tipoPrediccion;

    @Column(name = "prediccion_texto")
    private String prediccionTexto;

    @Column(name = "prediccion_numero")
    private Integer prediccionNumero;

    @Column(name = "prediccion_decimal", precision = 10, scale = 2)
    private BigDecimal prediccionDecimal;

    @Column(name = "resultado_real_texto")
    private String resultadoRealTexto;

    @Column(name = "resultado_real_numero")
    private Integer resultadoRealNumero;

    @Column(name = "resultado_real_decimal", precision = 10, scale = 2)
    private BigDecimal resultadoRealDecimal;

    @Column(name = "confidence", nullable = false)
    private Integer confidence = 5; // Nivel de confianza 1-10

    @Column(name = "puntos_posibles", nullable = false)
    private Integer puntosPosibles;

    @Column(name = "puntos_obtenidos")
    private Integer puntosObtenidos;

    @Column(name = "es_correcto")
    private Boolean esCorrecto;

    @Column(name = "factor_dificultad", precision = 3, scale = 2, nullable = false)
    private BigDecimal factorDificultad = new BigDecimal("1.00");

    @Column(name = "multiplicador_aplicado", precision = 3, scale = 2)
    private BigDecimal multiplicadorAplicado;

    @Column(name = "fecha_prediccion", nullable = false)
    private LocalDateTime fechaPrediccion;

    @Column(name = "fecha_evento")
    private LocalDateTime fechaEvento;

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoPrediccion estado = EstadoPrediccion.PENDIENTE;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        fechaPrediccion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    // Métodos de utilidad
    public String getPrediccion() {
        return prediccionTexto;
    }
    
    public void setPrediccion(String prediccion) {
        this.prediccionTexto = prediccion;
    }
    
    public Integer getConfianza() {
        return confidence;
    }
    
    public void setConfianza(Integer confianza) {
        this.confidence = confianza;
    }

    public void calcularPuntos() {
        if (esCorrecto != null && esCorrecto) {
            // Puntos base del tipo de predicción
            int puntosBase = puntosPosibles;
            
            // Aplicar factor de confianza
            BigDecimal factorConfidence = BigDecimal.valueOf(confidence).divide(BigDecimal.valueOf(10), 2, RoundingMode.HALF_UP);
            
            // Calcular puntos finales
            BigDecimal puntosFinales = BigDecimal.valueOf(puntosBase)
                    .multiply(factorConfidence)
                    .multiply(factorDificultad);
                    
            if (multiplicadorAplicado != null) {
                puntosFinales = puntosFinales.multiply(multiplicadorAplicado);
            }
            
            puntosObtenidos = puntosFinales.intValue();
        } else {
            puntosObtenidos = 0;
        }
    }

    public boolean esPrediccionVencida() {
        return fechaEvento != null && LocalDateTime.now().isAfter(fechaEvento);
    }

    public boolean puedeModificar() {
        return estado == EstadoPrediccion.PENDIENTE && !esPrediccionVencida();
    }

    // Enums
    public enum EstadoPrediccion {
        PENDIENTE,
        CONFIRMADA,
        RESUELTA,
        CANCELADA
    }
}
