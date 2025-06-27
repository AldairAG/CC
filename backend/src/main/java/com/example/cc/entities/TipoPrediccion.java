package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tipos_prediccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoPrediccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "puntos_por_acierto", nullable = false)
    private Integer puntosPorAcierto;

    @Enumerated(EnumType.STRING)
    @Column(name = "dificultad", nullable = false)
    private Dificultad dificultad;

    @Column(name = "aplica_a", nullable = false)
    private String aplicaA; // Deportes donde aplica, separados por coma

    @Column(name = "tipo_valor", nullable = false)
    private String tipoValor; // TEXTO, NUMERO, DECIMAL, BOOLEAN

    @Column(name = "opciones_predefinidas", columnDefinition = "TEXT")
    private String opcionesPredefinidas; // JSON con opciones si aplica

    @Column(name = "valor_minimo")
    private Integer valorMinimo;

    @Column(name = "valor_maximo")
    private Integer valorMaximo;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

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

    // Enums
    public enum Dificultad {
        FACIL,
        MEDIO,
        DIFICIL,
        EXPERTO
    }
}
