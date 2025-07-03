package com.example.cc.service.deportes;

import com.example.cc.entities.Deporte;
import java.util.List;
import java.util.Optional;

/**
 * Interfaz para el servicio de deportes
 */
public interface IDeporteService {

    /**
     * Obtener todos los deportes
     */
    List<Deporte> getAllDeportes();

    /**
     * Obtener deportes activos
     */
    List<Deporte> getDeportesActivos();

    /**
     * Obtener deporte por ID
     */
    Optional<Deporte> getDeporteById(Long id);

    /**
     * Obtener deporte por nombre
     */
    Optional<Deporte> getDeporteByNombre(String nombre);

    /**
     * Crear nuevo deporte
     */
    Deporte createDeporte(Deporte deporte);

    /**
     * Actualizar deporte existente
     */
    Deporte updateDeporte(Long id, Deporte deporte);

    /**
     * Eliminar deporte (cambiar estado activo)
     */
    void deleteDeporte(Long id);

    /**
     * Buscar deportes por nombre parcial
     */
    List<Deporte> searchDeportesByNombre(String nombre);

    /**
     * Verificar si existe un deporte
     */
    boolean existsDeporte(String nombre);

    /**
     * Crear deporte de forma segura (no lanza excepción si ya existe)
     * @param deporte Deporte a crear
     * @return Deporte creado o existente
     */
    Deporte createDeporteSafe(Deporte deporte);
}
