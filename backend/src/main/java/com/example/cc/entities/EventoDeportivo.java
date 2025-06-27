package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "eventos_deportivos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoDeportivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "evento_id_externo", unique = true, nullable = false)
    private String eventoIdExterno; // ID del evento en TheSportsDB

    @Column(name = "nombre_evento", nullable = false)
    private String nombreEvento;

    @Column(name = "liga")
    private String liga;

    @Column(name = "deporte")
    private String deporte;

    @Column(name = "equipo_local")
    private String equipoLocal;

    @Column(name = "equipo_visitante")
    private String equipoVisitante;

    @Column(name = "fecha_evento", nullable = false)
    private LocalDateTime fechaEvento;

    @Column(name = "estado")
    private String estado; // "programado", "en_vivo", "finalizado", "cancelado"

    @Column(name = "temporada")
    private String temporada;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "resultado")
    private String resultado; // "LOCAL", "VISITANTE", "EMPATE"

    @Column(name = "marcador_local")
    private Integer marcadorLocal;

    @Column(name = "marcador_visitante")
    private Integer marcadorVisitante;

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
}
