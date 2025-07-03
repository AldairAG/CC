package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ligas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Liga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "liga_id_externo")
    private String ligaIdExterno; // ID de la liga en TheSportsDB

    @Column(name = "pais")
    private String pais;

    @Column(name = "temporada")
    private String temporada;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "activa", nullable = false)
    private Boolean activa = true;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "sitio_web")
    private String sitioWeb;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relación con deporte
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deporte_id", nullable = false)
    @JsonIgnoreProperties({"ligas", "eventos"})
    private Deporte deporte;

    // Relación con eventos deportivos
    @OneToMany(mappedBy = "liga", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("liga")
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
