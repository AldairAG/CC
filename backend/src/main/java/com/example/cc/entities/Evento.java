package com.example.cc.entities;

import java.sql.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Data;

@Entity
@Data
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEvento;
    
    private String equipoLocal;
    private String equipoVisitante;
    private Date fechaPartido;
    
    // Campos adicionales para TheSportsDB
    private String nombreEvento;
    private String liga;
    private String deporte;
    private String estadio;
    private Integer resultadoLocal;
    private Integer resultadoVisitante;
    private String estado; // PROGRAMADO, EN_CURSO, FINALIZADO, CANCELADO

    @ManyToMany(mappedBy = "eventos")
    @JsonIgnore
    private List<Quiniela> quinielas;
}

