package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.example.cc.entities.enums.TipoApuesta;
import com.example.cc.entities.enums.EstadoApuesta;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "apuestas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Apuesta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idApuesta;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonBackReference
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoApuesta tipoApuesta;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoApuesta estadoApuesta = EstadoApuesta.PENDIENTE;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montoApuesta;
    
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal cuotaApuesta;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal gananciaPotencial;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal gananciaReal;
    
    @Column(columnDefinition = "TEXT")
    private String detalleApuesta; // JSON con detalles específicos de la apuesta
    
    @Column(columnDefinition = "TEXT")
    private String prediccionUsuario; // La predicción específica del usuario
    
    @Column(columnDefinition = "TEXT")
    private String resultadoReal; // El resultado real del evento
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
    
    @Column
    private LocalDateTime fechaResolucion;
    
    @Column(columnDefinition = "TEXT")
    private String observaciones;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        if (gananciaPotencial == null && montoApuesta != null && cuotaApuesta != null) {
            gananciaPotencial = montoApuesta.multiply(cuotaApuesta);
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        if (estadoApuesta == EstadoApuesta.GANADA || estadoApuesta == EstadoApuesta.PERDIDA) {
            fechaResolucion = LocalDateTime.now();
        }
    }
    
    // Método para calcular ganancia potencial
    public void calcularGananciaPotencial() {
        if (montoApuesta != null && cuotaApuesta != null) {
            this.gananciaPotencial = montoApuesta.multiply(cuotaApuesta);
        }
    }
    
    // Método para resolver apuesta como ganada
    public void resolverComoGanada() {
        this.estadoApuesta = EstadoApuesta.GANADA;
        this.gananciaReal = this.gananciaPotencial;
        this.fechaResolucion = LocalDateTime.now();
    }
    
    // Método para resolver apuesta como perdida
    public void resolverComoPerdida() {
        this.estadoApuesta = EstadoApuesta.PERDIDA;
        this.gananciaReal = BigDecimal.ZERO;
        this.fechaResolucion = LocalDateTime.now();
    }
    
    // Método para cancelar apuesta
    public void cancelarApuesta(String motivo) {
        this.estadoApuesta = EstadoApuesta.CANCELADA;
        this.observaciones = motivo;
        this.fechaResolucion = LocalDateTime.now();
    }
}
