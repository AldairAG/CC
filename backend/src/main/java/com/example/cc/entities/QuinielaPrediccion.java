package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiniela_predicciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuinielaPrediccion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participacion_id", nullable = false)
    private ParticipacionQuiniela participacion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private QuinielaEvento evento;
    
    @Column(name = "prediccion_local")
    private Integer prediccionLocal;
      @Column(name = "prediccion_visitante")
    private Integer prediccionVisitante;
    
    @Column(name = "tipo_prediccion", nullable = false)
    private String tipoPrediccion = "RESULTADO_EXACTO";
    
    @Column(name = "fecha_prediccion", nullable = false)
    private LocalDateTime fechaPrediccion;
    
    @Column(name = "puntos_obtenidos")
    private Integer puntosObtenidos = 0;
    
    @Column(name = "es_resultado_exacto", nullable = false)
    private Boolean esResultadoExacto = false;
    
    @Column(name = "es_acierto_ganador", nullable = false)
    private Boolean esAciertoGanador = false;
}
