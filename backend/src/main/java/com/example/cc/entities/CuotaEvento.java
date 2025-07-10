package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "cuotas_evento")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CuotaEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Integer version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_deportivo_id", nullable = false)
    @JsonIgnore
    private EventoDeportivo eventoDeportivo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_resultado", nullable = false)
    private TipoResultado tipoResultado; // LOCAL, VISITANTE, EMPATE

    @Column(name = "valor_cuota", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorCuota;

    @Column(name = "estado", nullable = false)
    private String estado = "ACTIVA"; // ACTIVA, SUSPENDIDA, CERRADA

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
    }
}
