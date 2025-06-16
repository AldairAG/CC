package com.example.cc.service.quinielaArmada;

import com.example.cc.entities.QuinielaArmada;
import com.example.cc.entities.objectsEmbed.QuinielaArmadaId;
import java.util.List;
import java.util.Optional;

public interface IQuinielaArmadaService {
    List<QuinielaArmada> findAll();
    Optional<QuinielaArmada> findById(QuinielaArmadaId id);
    QuinielaArmada save(QuinielaArmada quinielaArmada);
    void deleteById(QuinielaArmadaId id);
    List<QuinielaArmada> findByUsuarioId(Long usuarioId);
    List<QuinielaArmada> findByQuinielaId(Long quinielaId);
    List<QuinielaArmada> findByUsuarioIdAndQuinielaId(Long usuarioId, Long quinielaId);
}
