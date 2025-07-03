package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "quiniela_participaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class QuinielaParticipacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiniela_id", nullable = false)
    @JsonIgnore
    private Quiniela quiniela;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private Usuario usuario;

    @Column(name = "fecha_participacion", nullable = false)
    private LocalDateTime fechaParticipacion;

    @Column(name = "pagado", nullable = false)
    private Boolean pagado = false;

    @Column(name = "monto_apostado", precision = 10, scale = 2, nullable = false)
    private BigDecimal montoApostado;

    @Column(name = "posicion_final")
    private Integer posicionFinal;

    @Column(name = "aciertos", nullable = false)
    private Integer aciertos = 0;

    @Column(name = "puntuacion", precision = 10, scale = 2, nullable = false)
    private BigDecimal puntuacion = BigDecimal.ZERO;

    @Column(name = "premio_ganado", precision = 10, scale = 2)
    private BigDecimal premioGanado;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoParticipacion estado = EstadoParticipacion.ACTIVA;

    @Column(name = "eliminado_en_ronda")
    private Integer eliminadoEnRonda; // Para modalidad SUPERVIVENCIA

    @Column(name = "nivel_confidence_promedio", precision = 3, scale = 1)
    private BigDecimal nivelConfidencePromedio;

    @Column(name = "racha_aciertos_actual", nullable = false)
    private Integer rachaAciertosActual = 0;

    @Column(name = "racha_aciertos_maxima", nullable = false)
    private Integer rachaAciertosMaxima = 0;

    @Column(name = "total_aciertos", nullable = false)
    private Integer totalAciertos = 0;

    @Column(name = "total_predicciones", nullable = false)
    private Integer totalPredicciones = 0;

    @Column(name = "fecha_ultima_prediccion")
    private LocalDateTime fechaUltimaPrediccion;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relaciones
    @OneToMany(mappedBy = "participacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PrediccionEvento> predicciones;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        fechaParticipacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    // Métodos de utilidad
    public BigDecimal getPorcentajeAciertos() {
        if (totalPredicciones == 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(totalAciertos)
                .divide(BigDecimal.valueOf(totalPredicciones), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    public void actualizarEstadisticas() {
        if (predicciones != null) {
            totalPredicciones = predicciones.size();
            totalAciertos = (int) predicciones.stream()
                    .filter(p -> p.getEsCorrecto() != null && p.getEsCorrecto())
                    .count();
            
            puntuacion = BigDecimal.valueOf(predicciones.stream()
                    .filter(p -> p.getPuntosObtenidos() != null)
                    .mapToInt(PrediccionEvento::getPuntosObtenidos)
                    .sum());
        }
    }

    // Método getter para exponer quinielaId en JSON sin exponer toda la entidad Quiniela
    @JsonProperty("quinielaId")
    public Long getQuinielaId() {
        return quiniela != null ? quiniela.getId() : null;
    }

    // Método getter para exponer usuarioId en JSON sin exponer toda la entidad Usuario
    @JsonProperty("usuarioId") 
    public Long getUsuarioId() {
        return usuario != null ? usuario.getIdUsuario() : null;
    }

    // Enums
    public enum EstadoParticipacion {
        ACTIVA,
        PREDICCIONES_COMPLETADAS,
        ELIMINADA,
        GANADORA,
        FINALIZADA,
        CANCELADA
    }
}
