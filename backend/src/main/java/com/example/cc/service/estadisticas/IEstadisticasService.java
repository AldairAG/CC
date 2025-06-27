package com.example.cc.service.estadisticas;

import com.example.cc.dto.QuinielaResumenDto;
import com.example.cc.entities.QuinielaParticipacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * Interfaz para el servicio de estadísticas
 */
public interface IEstadisticasService {

    /**
     * Obtener estadísticas del dashboard principal
     * @return Mapa con estadísticas generales
     */
    Map<String, Object> obtenerEstadisticasDashboard();

    /**
     * Obtener quinielas más populares
     * @param limite Número máximo de quinielas a retornar
     * @return Lista de quinielas populares
     */
    List<QuinielaResumenDto> obtenerQuinielasPopulares(int limite);

    /**
     * Obtener quinielas con mayor pool de premios
     * @param limite Número máximo de quinielas a retornar
     * @return Lista de quinielas con mayor pool
     */
    List<QuinielaResumenDto> obtenerQuinielasMayorPool(int limite);

    /**
     * Obtener quinielas próximas a cerrar
     * @param limite Número máximo de quinielas a retornar
     * @return Lista de quinielas próximas a cerrar
     */
    List<QuinielaResumenDto> obtenerQuinielasProximasACerrar(int limite);

    /**
     * Obtener estadísticas de participación de un usuario
     * @param usuarioId ID del usuario
     * @return Mapa con estadísticas del usuario
     */
    Map<String, Object> obtenerEstadisticasUsuario(Long usuarioId);

    /**
     * Obtener histórico de participaciones de un usuario
     * @param usuarioId ID del usuario
     * @param pageable Configuración de paginación
     * @return Página con participaciones del usuario
     */
    Page<QuinielaParticipacion> obtenerHistoricoUsuario(Long usuarioId, Pageable pageable);

    /**
     * Obtener estadísticas por tipo de quiniela
     * @return Mapa con estadísticas por tipo
     */
    Map<String, Object> obtenerEstadisticasPorTipo();

    /**
     * Obtener top de usuarios ganadores
     * @param limite Número máximo de usuarios a retornar
     * @return Lista con información de top ganadores
     */
    List<Map<String, Object>> obtenerTopGanadores(int limite);
}
