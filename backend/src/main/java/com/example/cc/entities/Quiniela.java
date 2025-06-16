package com.example.cc.entities;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class Quiniela {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idQuiniela;
    private String nombreQuiniela;
    private BigDecimal premioAcumulado;
    private Integer numeroParticipantes;
    private Date fechaInicio;
    private Date fechaFin;
    private Float precioParticipacion;
    private String estado;
    private String strDescripcion;
    private String urlBanner;
    private String allowDoubleBets;
    private String allowTripleBets;
    private String tipoPremio;

    @ElementCollection
    private List<String> tiposApuestas;

    @ManyToMany
    @JsonManagedReference
    @JoinTable(name = "quiniela_evento", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "id_quiniela"), // Columna que referencia a Quiniela
            inverseJoinColumns = @JoinColumn(name = "id_evento") // Columna que referencia a Evento
    )
    private List<Evento> eventos;


    @OneToMany(mappedBy = "quiniela", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<QuinielaArmada> quinielasArmadas;

}