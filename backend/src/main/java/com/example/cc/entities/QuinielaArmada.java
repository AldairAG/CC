package com.example.cc.entities;

import java.util.List;

import com.example.cc.entities.objectsEmbed.QuinielaArmadaId;

import jakarta.persistence.CascadeType;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "Quiniela_Armada")
public class QuinielaArmada {
    @EmbeddedId
    private QuinielaArmadaId id;

    @ManyToOne
    @MapsId("idUsuario")
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @MapsId("idQuiniela")
    @JoinColumn(name = "id_quiniela", nullable = false)
    private Quiniela quiniela;

    @OneToMany(mappedBy = "usuarioQuiniela", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Prediccion> predicciones;

}
