package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "premios_quiniela")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PremioQuiniela {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiniela_id", nullable = false)
    private QuinielaCreada quiniela;
    
    @Column(name = "posicion", nullable = false)
    private Integer posicion;
    
    @Column(name = "monto_premio", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoPremio;
    
    @Column(name = "porcentaje_premio", nullable = false)
    private Integer porcentajePremio;
    
    @Column(name = "usuario_ganador_id")
    private Long usuarioGanadorId;
    
    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;
    
    @Column(name = "premio_reclamado", nullable = false)
    private Boolean premioReclamado = false;
    
    @Column(name = "fecha_reclamo")
    private LocalDateTime fechaReclamo;
    
    @Column(name = "descripcion")
    private String descripcion;
}
