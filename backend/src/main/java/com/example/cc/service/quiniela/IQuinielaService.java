package com.example.cc.service.quiniela;

import com.example.cc.dto.CrearQuinielaRequest;
import com.example.cc.dto.PrediccionRequest;
import com.example.cc.dto.RankingParticipacionDto;
import com.example.cc.entities.PrediccionEvento;
import com.example.cc.entities.Quiniela;
import com.example.cc.entities.QuinielaParticipacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Interfaz para el servicio de gestión de quinielas
 */
public interface IQuinielaService {

    /**
     * Crear una nueva quiniela
     * @param request Datos de la quiniela a crear
     * @return Quiniela creada
     */
    Quiniela crearQuiniela(CrearQuinielaRequest request);

    /**
     * Activar una quiniela para participación
     * @deprecated Las quinielas ahora se crean directamente activas. Este método se mantiene por compatibilidad.
     * @param quinielaId ID de la quiniela
     * @param usuarioId ID del usuario que activa
     * @return Quiniela activada
     */
    @Deprecated
    Quiniela activarQuiniela(Long quinielaId, Long usuarioId);

    /**
     * Participar en una quiniela
     * @param quinielaId ID de la quiniela
     * @param usuarioId ID del usuario participante
     * @return Participación creada
     */
    QuinielaParticipacion participarEnQuiniela(Long quinielaId, Long usuarioId);

    /**
     * Realizar predicciones para una participación
     * @param participacionId ID de la participación
     * @param predicciones Lista de predicciones
     * @return Lista de predicciones guardadas
     */
    List<PrediccionEvento> realizarPredicciones(Long participacionId, List<PrediccionRequest> predicciones);

    /**
     * Procesar resultados de una quiniela
     * @param quinielaId ID de la quiniela
     */
    void procesarResultados(Long quinielaId);

    /**
     * Obtener quinielas activas con paginación
     * @param pageable Configuración de paginación
     * @return Página de quinielas activas
     */
    Page<Quiniela> obtenerQuinielasActivas(Pageable pageable);

    /**
     * Obtener ranking de una quiniela
     * @param quinielaId ID de la quiniela
     * @return Lista del ranking
     */
    List<RankingParticipacionDto> obtenerRanking(Long quinielaId);

    /**
     * Obtener una quiniela por su ID
     * @param quinielaId ID de la quiniela
     * @return Quiniela encontrada
     */
    Quiniela obtenerQuinielaPorId(Long quinielaId);

    /**
     * Verificar si un usuario puede participar en una quiniela
     * @param quinielaId ID de la quiniela
     * @param usuarioId ID del usuario
     * @return true si puede participar, false en caso contrario
     */
    boolean puedeParticipar(Long quinielaId, Long usuarioId);

    /**
     * Obtener participaciones de un usuario
     * @param usuarioId ID del usuario
     * @param pageable Configuración de paginación
     * @return Página de participaciones del usuario
     */
    Page<QuinielaParticipacion> obtenerParticipacionesUsuario(Long usuarioId, Pageable pageable);

    /**
     * Obtener participaciones de un usuario con relaciones cargadas
     * @param usuarioId ID del usuario
     * @return Lista de participaciones con quiniela y usuario cargados
     */
    List<QuinielaParticipacion> obtenerParticipacionesUsuarioConRelaciones(Long usuarioId);

    /**
     * Obtener eventos de una quiniela
     * @param quinielaId ID de la quiniela
     * @return Lista de eventos de la quiniela
     */
    List<com.example.cc.entities.QuinielaEvento> obtenerEventosQuiniela(Long quinielaId);

    /**
     * Obtener predicciones por ID de participación
     * @param participacionId ID de la participación
     * @return Lista de predicciones
     */
    List<PrediccionEvento> obtenerPrediccionesPorParticipacion(Long participacionId);

    /**
     * Obtener predicciones de un usuario para una quiniela específica
     * @param usuarioId ID del usuario
     * @param quinielaId ID de la quiniela
     * @return Lista de predicciones del usuario para la quiniela
     */
    List<PrediccionEvento> obtenerPrediccionesUsuarioPorQuiniela(Long usuarioId, Long quinielaId);
}
