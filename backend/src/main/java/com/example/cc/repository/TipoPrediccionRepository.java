package com.example.cc.repository;

import com.example.cc.entities.TipoPrediccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoPrediccionRepository extends JpaRepository<TipoPrediccion, Long> {

    /**
     * Buscar tipo de predicción por nombre
     */
    Optional<TipoPrediccion> findByNombre(String nombre);

    /**
     * Verificar si existe un tipo de predicción por nombre
     */
    boolean existsByNombre(String nombre);
}
