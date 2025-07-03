package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "politicas_cuotas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PoliticaCuotas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_politica", unique = true, nullable = false)
    private String nombrePolitica;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    // Límites de variación de cuotas
    @Column(name = "variacion_maxima_porcentaje", precision = 5, scale = 2)
    private BigDecimal variacionMaximaPorcentaje = new BigDecimal("15.00"); // Máximo 15%

    @Column(name = "variacion_minima_tiempo_minutos")
    private Integer variacionMinimaTiempoMinutos = 5; // Mínimo 5 minutos entre cambios

    @Column(name = "cuota_minima", precision = 5, scale = 2)
    private BigDecimal cuotaMinima = new BigDecimal("1.01");

    @Column(name = "cuota_maxima", precision = 5, scale = 2)
    private BigDecimal cuotaMaxima = new BigDecimal("50.00");

    // Configuración de algoritmos
    @Column(name = "factor_volumen", precision = 5, scale = 4)
    private BigDecimal factorVolumen = new BigDecimal("0.1000"); // Impacto del volumen

    @Column(name = "factor_probabilidad", precision = 5, scale = 4)
    private BigDecimal factorProbabilidad = new BigDecimal("0.7000"); // Impacto de probabilidad

    @Column(name = "factor_mercado", precision = 5, scale = 4)
    private BigDecimal factorMercado = new BigDecimal("0.2000"); // Impacto de mercado externo

    @Column(name = "margen_casa", precision = 5, scale = 2)
    private BigDecimal margenCasa = new BigDecimal("5.00"); // Margen de la casa 5%

    // Configuración de notificaciones
    @Column(name = "notificar_cambio_mayor_porcentaje", precision = 5, scale = 2)
    private BigDecimal notificarCambioMayorPorcentaje = new BigDecimal("10.00");

    @Column(name = "notificar_usuarios_activos")
    private Boolean notificarUsuariosActivos = true;

    // Configuración de updates automáticos
    @Column(name = "actualizar_automaticamente")
    private Boolean actualizarAutomaticamente = true;

    @Column(name = "intervalo_actualizacion_minutos")
    private Integer intervaloActualizacionMinutos = 15;

    @Column(name = "pausar_antes_evento_minutos")
    private Integer pausarAntesEventoMinutos = 30; // Pausar cambios 30min antes del evento

    @Column(name = "activa")
    private Boolean activa = true;

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

    // Métodos de validación
    public boolean validarCambio(BigDecimal cuotaActual, BigDecimal cuotaNueva) {
        if (cuotaNueva.compareTo(cuotaMinima) < 0 || cuotaNueva.compareTo(cuotaMaxima) > 0) {
            return false;
        }

        // Validar porcentaje de cambio
        BigDecimal porcentajeCambio = cuotaNueva.subtract(cuotaActual)
                                                .divide(cuotaActual, 4, java.math.RoundingMode.HALF_UP)
                                                .multiply(new BigDecimal("100"))
                                                .abs();

        return porcentajeCambio.compareTo(variacionMaximaPorcentaje) <= 0;
    }

    public boolean requiereNotificacion(BigDecimal porcentajeCambio) {
        return porcentajeCambio.abs().compareTo(notificarCambioMayorPorcentaje) >= 0;
    }
}
