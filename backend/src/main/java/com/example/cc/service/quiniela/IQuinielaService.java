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
     * @param quinielaId ID de la quiniela
     * @param usuarioId ID del usuario que activa
     * @return Quiniela activada
     */
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
}
