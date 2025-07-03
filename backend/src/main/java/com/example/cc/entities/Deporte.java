package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "deportes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Deporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "icono")
    private String icono; // Para mostrar en el frontend

    @Column(name = "color_primario")
    private String colorPrimario; // Color para temas del frontend

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relación con ligas
    @OneToMany(mappedBy = "deporte", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("deporte")
    private List<Liga> ligas;

    // Relación con eventos deportivos
    @OneToMany(mappedBy = "deporte", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("deporte")
    private List<EventoDeportivo> eventos;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
