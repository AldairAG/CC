package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "apuestas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Apuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_deportivo_id", nullable = false)
    private EventoDeportivo eventoDeportivo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cuota_evento_id", nullable = false)
    private CuotaEvento cuotaEvento;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_apuesta", nullable = false)
    private TipoApuesta tipoApuesta = TipoApuesta.RESULTADO_GENERAL;

    @Column(name = "prediccion", nullable = false)
    private String prediccion; // Valor específico según tipoApuesta: LOCAL/VISITANTE/EMPATE, 2-1, OVER/UNDER, etc.

    @Column(name = "monto_apostado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoApostado;

    @Column(name = "valor_cuota_momento", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorCuotaMomento;

    @Column(name = "monto_potencial_ganancia", precision = 10, scale = 2)
    private BigDecimal montoPotencialGanancia;

    @Column(name = "monto_ganancia", precision = 10, scale = 2)
    private BigDecimal montoGanancia;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoApuesta estado = EstadoApuesta.PENDIENTE;

    @Column(name = "es_ganadora")
    private Boolean esGanadora;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @Column(name = "descripcion")
    private String descripcion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        // Calcular monto potencial de ganancia
        if (montoApostado != null && valorCuotaMomento != null) {
            montoPotencialGanancia = montoApostado.multiply(valorCuotaMomento);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    public enum EstadoApuesta {
        PENDIENTE, ACEPTADA, CANCELADA, RECHAZADA, RESUELTA
    }

    public enum TipoApuesta {
        RESULTADO_GENERAL,      // LOCAL, VISITANTE, EMPATE
        RESULTADO_EXACTO,       // Marcador exacto ej: 2-1
        TOTAL_GOLES,           // Over/Under de goles totales
        GOLES_LOCAL,           // Cantidad de goles del equipo local
        GOLES_VISITANTE,       // Cantidad de goles del equipo visitante
        AMBOS_EQUIPOS_ANOTAN,  // Si/No ambos equipos anotan
        PRIMER_GOLEADOR,       // Quién marca el primer gol
        HANDICAP,              // Hándicap asiático/europeo
        DOBLE_OPORTUNIDAD,     // 1X, X2, 12
        MITAD_TIEMPO,          // Resultado del primer tiempo
        GOLES_PRIMERA_MITAD,   // Goles en el primer tiempo
        CORNER_KICKS,          // Total de córners
        TARJETAS,              // Total de tarjetas amarillas/rojas
        AMBAS_MITADES_GOLEAN   // Si se anotan goles en ambas mitades
    }
}
