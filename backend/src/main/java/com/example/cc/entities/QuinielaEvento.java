package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.Date;

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
    private QuinielaCreada quiniela;
    
    @Column(name = "evento_id", nullable = false)
    private Long eventoId;
    
    @Column(name = "nombre_evento", nullable = false)
    private String nombreEvento;
    
    @Column(name = "fecha_evento", nullable = false)
    private Date fechaEvento;
    
    @Column(name = "equipo_local", nullable = false)
    private String equipoLocal;
    
    @Column(name = "equipo_visitante", nullable = false)
    private String equipoVisitante;
    
    @Column(name = "resultado_local")
    private Integer resultadoLocal;
    
    @Column(name = "resultado_visitante")
    private Integer resultadoVisitante;
    
    @Column(name = "puntos_por_acierto", nullable = false)
    private Integer puntosPorAcierto = 3;
    
    @Column(name = "puntos_por_resultado_exacto", nullable = false)
    private Integer puntosPorResultadoExacto = 5;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoEvento estado = EstadoEvento.PROGRAMADO;
    
    @Column(name = "finalizado", nullable = false)
    private Boolean finalizado = false;
    
    public enum EstadoEvento {
        PROGRAMADO,
        EN_VIVO,
        FINALIZADO,
        CANCELADO
    }
}
