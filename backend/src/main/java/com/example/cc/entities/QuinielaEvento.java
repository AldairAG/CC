package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiniela_eventos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuinielaEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiniela_id", nullable = false)
    private Quiniela quiniela;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_deportivo_id", nullable = false)
    private EventoDeportivo eventoDeportivo;

    @Column(name = "orden_en_quiniela", nullable = false)
    private Integer ordenEnQuiniela;

    @Column(name = "es_obligatorio", nullable = false)
    private Boolean esObligatorio = true;

    @Column(name = "multiplicador_puntos", precision = 3, scale = 2, nullable = false)
    private BigDecimal multiplicadorPuntos = new BigDecimal("1.00");

    @Column(name = "puntos_por_acierto", nullable = false)
    private Integer puntosPorAcierto = 100;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_prediccion_id")
    private TipoPrediccion tipoPrediccion;

    @Column(name = "max_predicciones_por_usuario")
    private Integer maxPrediccionesPorUsuario;

    @Column(name = "tipos_prediccion_permitidos", columnDefinition = "TEXT")
    private String tiposPrediccionPermitidos; // JSON array con IDs de tipos permitidos

    @Column(name = "resultado_oficial_procesado", nullable = false)
    private Boolean resultadoOficialProcesado = false;

    @Column(name = "fecha_procesamiento_resultado")
    private LocalDateTime fechaProcesamientoResultado;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relaciones - NO USAR ESTA RELACIÓN DIRECTA
    // Las predicciones se relacionan con QuinielaEvento a través de la participación
    // @OneToMany(mappedBy = "eventoDeportivo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private List<PrediccionEvento> predicciones;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    // Métodos de utilidad
    public void setMultiplicador(double multiplicador) {
        this.multiplicadorPuntos = BigDecimal.valueOf(multiplicador);
    }

    public boolean estaDisponibleParaPredicciones() {
        return eventoDeportivo != null && 
               LocalDateTime.now().isBefore(eventoDeportivo.getFechaEvento()) &&
               !resultadoOficialProcesado;
    }

    // NOTA: Los métodos de estadísticas de predicciones se deben obtener
    // a través de consultas al repositorio PrediccionEventoRepository
    // porque la relación es indirecta (QuinielaEvento -> EventoDeportivo <- PrediccionEvento)
    
    public int getTotalPredicciones() {
        // Este método requiere una consulta al repositorio
        return 0; // Placeholder - implementar en el servicio
    }

    public long getTotalPrediccionesCorrectas() {
        // Este método requiere una consulta al repositorio
        return 0; // Placeholder - implementar en el servicio
    }

    public BigDecimal getPorcentajeAciertos() {
        // Este método requiere una consulta al repositorio
        return BigDecimal.ZERO; // Placeholder - implementar en el servicio
    }
}
