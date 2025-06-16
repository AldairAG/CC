package com.example.cc.entities;

import java.sql.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Data;

@Entity
@Data
public class Evento {
    @Id
    private Long idEvento;
    
    private String equipoLocal;
    private String equipoVisitante;
    private Date fechaPartido;

    @JsonBackReference
    @ManyToMany(mappedBy = "eventos")
    private List<Quiniela> quinielas;
}

