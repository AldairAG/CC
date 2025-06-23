package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
public class Transaccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTransaccion;
    
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
    
    @Enumerated(EnumType.STRING)
    private TipoTransaccion tipo;
    
    private BigDecimal monto;
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    private EstadoTransaccion estado = EstadoTransaccion.PENDIENTE;
    
    private String referenciaExterna; // ID de la transacción en el sistema de pago
    private String metodoPago; // Tarjeta, transferencia, etc.
    
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    private LocalDateTime fechaProcesamiento;
    
    private String comentarios;
    private BigDecimal comision = BigDecimal.ZERO;
    private BigDecimal montoNeto;
    
    public enum TipoTransaccion {
        DEPOSITO("Depósito"),
        RETIRO("Retiro"),
        GANANCIA_APUESTA("Ganancia de Apuesta"),
        PERDIDA_APUESTA("Pérdida de Apuesta"),
        BONIFICACION("Bonificación"),
        PENALIZACION("Penalización"),
        REEMBOLSO("Reembolso");
        
        private final String descripcion;
        
        TipoTransaccion(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
    
    public enum EstadoTransaccion {
        PENDIENTE("Pendiente"),
        PROCESANDO("Procesando"),
        COMPLETADA("Completada"),
        FALLIDA("Fallida"),
        CANCELADA("Cancelada"),
        RECHAZADA("Rechazada");
        
        private final String descripcion;
        
        EstadoTransaccion(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
}
