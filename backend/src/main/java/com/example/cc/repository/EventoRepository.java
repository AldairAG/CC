package com.example.cc.repository;

import com.example.cc.entities.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByFechaPartido(Date fecha);
    List<Evento> findByEquipoLocal(String equipo);
    List<Evento> findByEquipoVisitante(String equipo);
    List<Evento> findByQuinielasIdQuiniela(Long quinielaId);
}