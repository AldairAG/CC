package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "quinielas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quiniela {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_unico", unique = true, nullable = false)
    private String codigoUnico;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_quiniela", nullable = false)
    private TipoQuiniela tipoQuiniela;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_distribucion", nullable = false)
    private TipoDistribucion tipoDistribucion;

    @Column(name = "costo_participacion", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoParticipacion;

    @Column(name = "premio_minimo", precision = 12, scale = 2)
    private BigDecimal premioMinimo;

    @Column(name = "pool_actual", precision = 12, scale = 2, nullable = false)
    private BigDecimal poolActual = BigDecimal.ZERO;

    @Column(name = "max_participantes")
    private Integer maxParticipantes;

    @Column(name = "participantes_actuales", nullable = false)
    private Integer participantesActuales = 0;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_cierre", nullable = false)
    private LocalDateTime fechaCierre;

    @Column(name = "fecha_resultados")
    private LocalDateTime fechaResultados;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoQuiniela estado = EstadoQuiniela.ACTIVA;

    @Column(name = "reglas_especiales", columnDefinition = "TEXT")
    private String reglasEspeciales;

    @Column(name = "creador_id", nullable = false)
    private Long creadorId;

    @Column(name = "es_publica", nullable = false)
    private Boolean esPublica = true;

    @Column(name = "requiere_aprobacion", nullable = false)
    private Boolean requiereAprobacion = false;

    @Column(name = "configuracion_distribucion", columnDefinition = "TEXT")
    private String configuracionDistribucion; // JSON con configuración específica

    @Column(name = "porcentaje_casa", precision = 5, scale = 2, nullable = false)
    private BigDecimal porcentajeCasa = new BigDecimal("5.00");

    @Column(name = "porcentaje_creador", precision = 5, scale = 2, nullable = false)
    private BigDecimal porcentajeCreador = new BigDecimal("2.00");

    @Column(name = "activa_bonus_pool", nullable = false)
    private Boolean activaBonusPool = false;

    @Column(name = "requiere_min_participantes")
    private Integer requiereMinParticipantes;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relaciones
    @OneToMany(mappedBy = "quiniela", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuinielaParticipacion> participaciones;

    @OneToMany(mappedBy = "quiniela", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuinielaEvento> eventos;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        if (codigoUnico == null || codigoUnico.isEmpty()) {
            codigoUnico = generarCodigoUnico();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    private String generarCodigoUnico() {
        return "Q" + System.currentTimeMillis() + (int)(Math.random() * 1000);
    }

    // Enums
    public enum TipoQuiniela {
        CLASICA,
        CLASICA_MEJORADA,
        EXPRESS,
        SUPERVIVENCIA,
        PREDICTOR_EXACTO,
        CHALLENGE_MENSUAL,
        SOCIAL_GRUPOS,
        MULTI_DEPORTE,
        COMBO_ACUMULADA
    }

    public enum TipoDistribucion {
        WINNER_TAKES_ALL,
        TOP_3_CLASICA,
        TOP_5_PIRAMIDE,
        TOP_10_ESCALONADA,
        POR_ACIERTOS_PROGRESIVO,
        GARANTIZADA_PROGRESIVA,
        SISTEMA_LIGAS,
        PERSONALIZADA
    }

    public enum EstadoQuiniela {
        BORRADOR,
        ACTIVA,
        CERRADA,
        EN_RESOLUCION,
        FINALIZADA,
        CANCELADA
    }
}
