package com.example.cc.repository;

import com.example.cc.entities.Liga;
import com.example.cc.entities.Deporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LigaRepository extends JpaRepository<Liga, Long> {

    /**
     * Buscar liga por nombre
     */
    Optional<Liga> findByNombre(String nombre);

    /**
     * Buscar liga por ID externo
     */
    Optional<Liga> findByLigaIdExterno(String ligaIdExterno);

    /**
     * Buscar ligas activas
     */
    List<Liga> findByActivaTrue();

    /**
     * Buscar ligas por deporte
     */
    List<Liga> findByDeporte(Deporte deporte);

    /**
     * Buscar ligas activas por deporte
     */
    List<Liga> findByDeporteAndActivaTrue(Deporte deporte);

    /**
     * Buscar ligas por país
     */
    List<Liga> findByPais(String pais);

    /**
     * Buscar ligas por país y deporte
     */
    List<Liga> findByPaisAndDeporte(String pais, Deporte deporte);

    /**
     * Buscar ligas por nombre ignorando mayúsculas/minúsculas
     */
    Optional<Liga> findByNombreIgnoreCase(String nombre);

    /**
     * Verificar si existe una liga con el nombre dado
     */
    boolean existsByNombre(String nombre);

    /**
     * Buscar ligas que contengan el texto en el nombre
     */
    @Query("SELECT l FROM Liga l WHERE LOWER(l.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) AND l.activa = true")
    List<Liga> findByNombreContaining(@Param("nombre") String nombre);

    /**
     * Buscar ligas populares (las que tienen más eventos)
     */
    @Query("SELECT l FROM Liga l JOIN l.eventos e WHERE l.activa = true GROUP BY l ORDER BY COUNT(e) DESC")
    List<Liga> findLigasPopulares();

    /**
     * Verificar si existe una liga con el ID externo dado
     */
    boolean existsByLigaIdExterno(String ligaIdExterno);
}
