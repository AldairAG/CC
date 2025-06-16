package com.example.cc.repository;

import com.example.cc.entities.Prediccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrediccionRepository extends JpaRepository<Prediccion, Long> {
    List<Prediccion> findByUsuarioQuinielaUsuarioIdUsuarioAndUsuarioQuinielaQuinielaIdQuiniela(
        Long usuarioId, Long quinielaId);
    List<Prediccion> findByEventoIdEvento(Long eventoId);
    List<Prediccion> findByAcertada(Boolean acertada);
}