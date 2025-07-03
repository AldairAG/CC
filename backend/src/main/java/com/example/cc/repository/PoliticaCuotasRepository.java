package com.example.cc.repository;

import com.example.cc.entities.PoliticaCuotas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PoliticaCuotasRepository extends JpaRepository<PoliticaCuotas, Long> {

    /**
     * Obtener política activa
     */
    @Query("SELECT pc FROM PoliticaCuotas pc WHERE pc.activa = true")
    Optional<PoliticaCuotas> findPoliticaActiva();

    /**
     * Obtener política por nombre
     */
    Optional<PoliticaCuotas> findByNombrePolitica(String nombrePolitica);

    /**
     * Obtener todas las políticas activas
     */
    @Query("SELECT pc FROM PoliticaCuotas pc WHERE pc.activa = true ORDER BY pc.fechaCreacion DESC")
    List<PoliticaCuotas> findAllPoliticasActivas();

    /**
     * Obtener políticas con actualización automática habilitada
     */
    @Query("SELECT pc FROM PoliticaCuotas pc WHERE pc.actualizarAutomaticamente = true AND pc.activa = true")
    List<PoliticaCuotas> findPoliticasConActualizacionAutomatica();

    /**
     * Verificar si existe una política activa
     */
    @Query("SELECT COUNT(pc) > 0 FROM PoliticaCuotas pc WHERE pc.activa = true")
    boolean existePoliticaActiva();
}
