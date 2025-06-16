package com.example.cc.repository;

import com.example.cc.entities.QuinielaArmada;
import com.example.cc.entities.objectsEmbed.QuinielaArmadaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuinielaArmadaRepository extends JpaRepository<QuinielaArmada, QuinielaArmadaId> {
    List<QuinielaArmada> findByUsuarioIdUsuario(Long usuarioId);
    List<QuinielaArmada> findByQuinielaIdQuiniela(Long quinielaId);
    List<QuinielaArmada> findByUsuarioIdUsuarioAndQuinielaIdQuiniela(Long usuarioId, Long quinielaId);
}