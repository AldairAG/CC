package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "quinielas_creadas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuinielaCreada {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "creador_id", nullable = false)
    private Long creadorId;
    
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;
    
    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;
    
    @Column(name = "precio_entrada", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioEntrada;
    
    @Column(name = "premio_total", precision = 10, scale = 2)
    private BigDecimal premioTotal;
    
    @Column(name = "max_participantes")
    private Integer maxParticipantes;
    
    @Column(name = "participantes_actuales", nullable = false)
    private Integer participantesActuales = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoQuiniela estado = EstadoQuiniela.ACTIVA;
    
    @Column(name = "tipo_distribucion", nullable = false)
    private String tipoDistribucion = "WINNER_TAKES_ALL"; // WINNER_TAKES_ALL, TOP_3, PERCENTAGE
    
    @Column(name = "porcentaje_premio_primero")
    private Integer porcentajePremiosPrimero = 100;
    
    @Column(name = "porcentaje_premio_segundo")
    private Integer porcentajePremiosSegundo = 0;
    
    @Column(name = "porcentaje_premio_tercero")
    private Integer porcentajePremiosTercero = 0;
    
    @Column(name = "es_publica", nullable = false)
    private Boolean esPublica = true;
    
    @Column(name = "codigo_invitacion")
    private String codigoInvitacion;
    
    @Column(name = "es_crypto", nullable = false)
    private Boolean esCrypto = false;
    
    @Column(name = "crypto_tipo")
    private String cryptoTipo;
    
    @Column(name = "premios_distribuidos", nullable = false)
    private Boolean premiosDistribuidos = false;
    
    @OneToMany(mappedBy = "quiniela", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ParticipacionQuiniela> participaciones;
    
    @OneToMany(mappedBy = "quiniela", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuinielaEvento> eventos;
    
    @OneToMany(mappedBy = "quiniela", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PremioQuiniela> premios;
    
    public enum EstadoQuiniela {
        ACTIVA,
        EN_CURSO,
        FINALIZADA,
        CANCELADA
    }
}
