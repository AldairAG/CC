package com.example.cc.service.quinielaAdmin;

import com.example.cc.entities.Quiniela;
import com.example.cc.entities.QuinielaParticipacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * Interfaz para el servicio de administración de quinielas
 */
public interface IQuinielaAdminService {

    /**
     * Obtener todas las quinielas con paginación
     * @param pageable Configuración de paginación
     * @return Página de quinielas
     */
    Page<Quiniela> obtenerTodasLasQuinielas(Pageable pageable);

    /**
     * Obtener estadísticas generales del sistema
     * @return Mapa con estadísticas
     */
    Map<String, Object> obtenerEstadisticasGenerales();

    /**
     * Cancelar una quiniela
     * @param quinielaId ID de la quiniela
     * @param motivo Motivo de la cancelación
     */
    void cancelarQuiniela(Long quinielaId, String motivo);

    /**
     * Forzar procesamiento de resultados
     * @param quinielaId ID de la quiniela
     */
    void forzarProcesamientoResultados(Long quinielaId);

    /**
     * Modificar configuración de una quiniela
     * @param quinielaId ID de la quiniela
     * @param cambios Mapa con los cambios a aplicar
     * @return Quiniela modificada
     */
    Quiniela modificarConfiguracion(Long quinielaId, Map<String, Object> cambios);

    /**
     * Obtener participaciones de una quiniela
     * @param quinielaId ID de la quiniela
     * @return Lista de participaciones
     */
    List<QuinielaParticipacion> obtenerParticipaciones(Long quinielaId);

    /**
     * Generar reporte de una quiniela
     * @param quinielaId ID de la quiniela
     * @return Mapa con datos del reporte
     */
    Map<String, Object> generarReporte(Long quinielaId);
}
