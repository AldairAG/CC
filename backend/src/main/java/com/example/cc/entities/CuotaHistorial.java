package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "cuotas_historial", indexes = {
    @Index(name = "idx_cuota_evento_fecha", columnList = "cuota_evento_id, fecha_cambio"),
    @Index(name = "idx_evento_deportivo_fecha", columnList = "evento_deportivo_id, fecha_cambio")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CuotaHistorial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cuota_evento_id", nullable = false)
    private CuotaEvento cuotaEvento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_deportivo_id", nullable = false)
    private EventoDeportivo eventoDeportivo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_resultado", nullable = false)
    private TipoResultado tipoResultado;

    @Column(name = "valor_cuota_anterior", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorCuotaAnterior;

    @Column(name = "valor_cuota_nueva", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorCuotaNueva;

    @Column(name = "fecha_cambio", nullable = false)
    private LocalDateTime fechaCambio;

    @Enumerated(EnumType.STRING)
    @Column(name = "razon_cambio", nullable = false)
    private RazonCambioCuota razonCambio;

    @Column(name = "porcentaje_cambio", precision = 5, scale = 2)
    private BigDecimal porcentajeCambio;

    @Column(name = "volumen_apuestas_actual")
    private Integer volumenApuestasActual;

    @Column(name = "total_apostado_actual", precision = 15, scale = 2)
    private BigDecimal totalApostadoActual;

    @Column(name = "detalles_cambio", columnDefinition = "TEXT")
    private String detallesCambio;

    public enum RazonCambioCuota {
        VOLUMEN_APUESTAS,
        ACTUALIZACION_AUTOMATICA,
        AJUSTE_MANUAL,
        FEED_EXTERNO,
        ANALISIS_PROBABILISTICO,
        GESTION_RIESGO,
        EVENTOS_MERCADO
    }

    @PrePersist
    protected void onCreate() {
        if (fechaCambio == null) {
            fechaCambio = LocalDateTime.now();
        }
        
        // Calcular porcentaje de cambio
        if (valorCuotaAnterior != null && valorCuotaNueva != null && 
            valorCuotaAnterior.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diferencia = valorCuotaNueva.subtract(valorCuotaAnterior);
            porcentajeCambio = diferencia.divide(valorCuotaAnterior, 4, java.math.RoundingMode.HALF_UP)
                                       .multiply(new BigDecimal("100"));
        }
    }
}
