package com.example.cc.service.deportes;

import com.example.cc.entities.Liga;
import com.example.cc.entities.Deporte;
import java.util.List;
import java.util.Optional;

/**
 * Interfaz para el servicio de ligas
 */
public interface ILigaService {

    /**
     * Obtener todas las ligas
     */
    List<Liga> getAllLigas();

    /**
     * Obtener ligas activas
     */
    List<Liga> getLigasActivas();

    /**
     * Obtener liga por ID
     */
    Optional<Liga> getLigaById(Long id);

    /**
     * Obtener liga por nombre
     */
    Optional<Liga> getLigaByNombre(String nombre);

    /**
     * Obtener liga por ID externo
     */
    Optional<Liga> getLigaByIdExterno(String ligaIdExterno);

    /**
     * Obtener ligas por deporte
     */
    List<Liga> getLigasByDeporte(Deporte deporte);

    /**
     * Obtener ligas activas por deporte
     */
    List<Liga> getLigasActivasByDeporte(Deporte deporte);

    /**
     * Obtener ligas por país
     */
    List<Liga> getLigasByPais(String pais);

    /**
     * Crear nueva liga
     */
    Liga createLiga(Liga liga);

    /**
     * Actualizar liga existente
     */
    Liga updateLiga(Long id, Liga liga);

    /**
     * Eliminar liga (cambiar estado activo)
     */
    void deleteLiga(Long id);

    /**
     * Buscar ligas por nombre parcial
     */
    List<Liga> searchLigasByNombre(String nombre);

    /**
     * Obtener ligas populares
     */
    List<Liga> getLigasPopulares();

    /**
     * Verificar si existe una liga
     */
    boolean existsLiga(String nombre);

    /**
     * Crear liga de forma segura (no lanza excepción si ya existe)
     * @param liga Liga a crear
     * @return Liga creada o existente
     */
    Liga createLigaSafe(Liga liga);

    /**
     * Verificar si existe una liga por ID externo
     */
    boolean existsLigaByIdExterno(String ligaIdExterno);
}
