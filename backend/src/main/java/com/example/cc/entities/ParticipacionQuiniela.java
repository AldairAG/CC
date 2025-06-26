package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "participaciones_quiniela")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipacionQuiniela {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiniela_id", nullable = false)
    private QuinielaCreada quiniela;
    
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    
    @Column(name = "fecha_participacion", nullable = false)
    private LocalDateTime fechaParticipacion;
    
    @Column(name = "monto_pagado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoPagado;
    
    @Column(name = "puntos_obtenidos")
    private Integer puntosObtenidos = 0;
    
    @Column(name = "posicion_final")
    private Integer posicionFinal;
    
    @Column(name = "premio_ganado", precision = 10, scale = 2)
    private BigDecimal premioGanado;
    
    @Column(name = "premio_reclamado", nullable = false)
    private Boolean premioReclamado = false;
    
    @Column(name = "fecha_reclamo_premio")
    private LocalDateTime fechaReclamoPremio;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoParticipacion estado = EstadoParticipacion.ACTIVA;
    
    public enum EstadoParticipacion {
        ACTIVA,
        ELIMINADA,
        FINALIZADA
    }
}
