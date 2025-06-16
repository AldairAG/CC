package com.example.cc.entities.objectsEmbed;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class QuinielaArmadaId implements Serializable {
    @Column(name = "id_usuario")
    private Long idUsuario;
    @Column(name = "id_quiniela")
    private Long idQuiniela;

    public QuinielaArmadaId() {
    }

    public QuinielaArmadaId(Long idUsuario, Long idQuiniela) {
        this.idUsuario = idUsuario;
        this.idQuiniela = idQuiniela;
    }

    // equals() y hashCode() son obligatorios
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof QuinielaArmadaId))
            return false;
        QuinielaArmadaId that = (QuinielaArmadaId) o;
        return Objects.equals(idUsuario, that.idUsuario) &&
                Objects.equals(idQuiniela, that.idQuiniela);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idUsuario, idQuiniela);
    }
}