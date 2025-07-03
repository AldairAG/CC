package com.example.cc.repository;

import com.example.cc.entities.Deporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeporteRepository extends JpaRepository<Deporte, Long> {

    /**
     * Buscar deporte por nombre
     */
    Optional<Deporte> findByNombre(String nombre);

    /**
     * Buscar deportes activos
     */
    List<Deporte> findByActivoTrue();

    /**
     * Buscar deportes por nombre ignorando mayúsculas/minúsculas
     */
    Optional<Deporte> findByNombreIgnoreCase(String nombre);

    /**
     * Verificar si existe un deporte con el nombre dado
     */
    boolean existsByNombre(String nombre);

    /**
     * Buscar deportes que contengan el texto en el nombre
     */
    @Query("SELECT d FROM Deporte d WHERE LOWER(d.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) AND d.activo = true")
    List<Deporte> findByNombreContaining(@Param("nombre") String nombre);
}
