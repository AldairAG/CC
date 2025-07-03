import type {
    EventoDeportivoType,
    EventoDeportivoResumenType,
    FiltrosEventoType,
    EstadisticasEventosType,
    RespuestaOperacionType,
    EventoDisponibleQuinielaType,
    ConfigurarTipoPrediccionRequestType,
    EventoQuinielaConfigType
} from "../../types/EventoDeportivoTypes";
import { apiClient } from "./ApiCliente";

const BASE_URL = '/eventos-deportivos';
const QUINIELA_EVENTOS_URL = '/quiniela-eventos';

export const EventoService = {
    /**
     * Obtener eventos por rango de fechas con filtros opcionales
     * @param filtros Filtros para la búsqueda de eventos
     * @returns Lista de eventos que coinciden con los filtros
     */
    obtenerEventos: async (filtros: FiltrosEventoType = {}): Promise<EventoDeportivoType[]> => {
        const params = new URLSearchParams();
        
        if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
        if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
        if (filtros.deporte) params.append('deporteNombre', filtros.deporte);
        if (filtros.liga) params.append('ligaNombre', filtros.liga);
        if (filtros.estado) params.append('estado', filtros.estado);

        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}?${params.toString()}`);
        return response.data;
    },

    /**
     * Obtener eventos de los próximos 7 días
     * @returns Lista de eventos próximos
     */
    obtenerEventosProximos: async (): Promise<EventoDeportivoType[]> => {
        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/proximos`);
        return response.data;
    },

    /**
     * Obtener eventos por deporte específico
     * @param deporte Nombre del deporte
     * @returns Lista de eventos del deporte especificado
     */
    obtenerEventosPorDeporte: async (deporte: string): Promise<EventoDeportivoType[]> => {
        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/deporte/${encodeURIComponent(deporte)}`);
        return response.data;
    },

    /**
     * Obtener eventos por liga específica
     * @param liga Nombre de la liga
     * @returns Lista de eventos de la liga especificada
     */
    obtenerEventosPorLiga: async (liga: string): Promise<EventoDeportivoType[]> => {
        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/liga/${encodeURIComponent(liga)}`);
        return response.data;
    },

    /**
     * Obtener un evento específico por ID
     * @param id ID del evento
     * @returns El evento encontrado
     */
    obtenerEventoPorId: async (id: number): Promise<EventoDeportivoType> => {
        const response = await apiClient.get<EventoDeportivoType>(`${BASE_URL}/${id}`);
        return response.data;
    },

    /**
     * Forzar sincronización manual de eventos desde fuentes externas
     * @returns Respuesta de la operación
     */
    forzarSincronizacion: async (): Promise<RespuestaOperacionType> => {
        const response = await apiClient.post<RespuestaOperacionType>(`${BASE_URL}/sincronizar`);
        return response.data;
    },

    /**
     * Limpiar eventos antiguos del sistema
     * @returns Respuesta de la operación
     */
    limpiarEventosAntiguos: async (): Promise<RespuestaOperacionType> => {
        const response = await apiClient.delete<RespuestaOperacionType>(`${BASE_URL}/limpiar-antiguos`);
        return response.data;
    },

    /**
     * Obtener estadísticas de eventos
     * @returns Estadísticas de eventos deportivos
     */
    obtenerEstadisticas: async (): Promise<EstadisticasEventosType> => {
        const response = await apiClient.get<EstadisticasEventosType>(`${BASE_URL}/estadisticas`);
        return response.data;
    },

    /**
     * Buscar eventos por texto libre
     * ⚠️ NOTA: Este endpoint no existe en el controlador actual
     * @param query Texto de búsqueda
     * @param filtros Filtros adicionales opcionales
     * @returns Lista de eventos que coinciden con la búsqueda
     */
    buscarEventos: async (query: string, filtros: FiltrosEventoType = {}): Promise<EventoDeportivoType[]> => {
        const params = new URLSearchParams();
        params.append('q', query);
        
        if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
        if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
        if (filtros.deporte) params.append('deporteNombre', filtros.deporte);
        if (filtros.liga) params.append('ligaNombre', filtros.liga);
        if (filtros.estado) params.append('estado', filtros.estado);

        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/buscar?${params.toString()}`);
        return response.data;
    },

    /**
     * Obtener eventos por múltiples deportes
     * @param deportes Lista de nombres de deportes
     * @returns Lista de eventos de los deportes especificados
     */
    obtenerEventosPorDeportes: async (deportes: string[]): Promise<EventoDeportivoType[]> => {
        const params = new URLSearchParams();
        deportes.forEach(deporte => params.append('deportes', deporte));

        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/multiples-deportes?${params.toString()}`);
        return response.data;
    },

    /**
     * Obtener eventos por múltiples ligas
     * @param ligas Lista de nombres de ligas
     * @returns Lista de eventos de las ligas especificadas
     */
    obtenerEventosPorLigas: async (ligas: string[]): Promise<EventoDeportivoType[]> => {
        const params = new URLSearchParams();
        ligas.forEach(liga => params.append('ligas', liga));

        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/multiples-ligas?${params.toString()}`);
        return response.data;
    },

    /**
     * Obtener eventos de un equipo específico
     * @param equipo Nombre del equipo
     * @returns Lista de eventos del equipo
     */
    obtenerEventosEquipo: async (equipo: string): Promise<EventoDeportivoType[]> => {
        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/equipo/${encodeURIComponent(equipo)}`);
        return response.data;
    },

    /**
     * Obtener eventos entre dos equipos específicos
     * @param equipoLocal Nombre del equipo local
     * @param equipoVisitante Nombre del equipo visitante
     * @returns Lista de enfrentamientos entre los equipos
     */
    obtenerEnfrentamientos: async (equipoLocal: string, equipoVisitante: string): Promise<EventoDeportivoType[]> => {
        const params = new URLSearchParams({
            equipoLocal,
            equipoVisitante
        });

        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/enfrentamientos?${params.toString()}`);
        return response.data;
    },

    // ========== MÉTODOS PARA INTEGRACIÓN CON QUINIELAS ==========

    /**
     * Obtener eventos disponibles para crear quinielas
     * @returns Lista de eventos disponibles para quinielas
     */
    obtenerEventosDisponibles: async (): Promise<EventoDisponibleQuinielaType[]> => {
        const response = await apiClient.get<EventoDisponibleQuinielaType[]>(`${QUINIELA_EVENTOS_URL}/disponibles`);
        return response.data;
    },

    /**
     * Agregar eventos a una quiniela
     * @param quinielaId ID de la quiniela
     * @param eventosIds Lista de IDs de eventos a agregar
     * @returns Respuesta de la operación
     */
    agregarEventosAQuiniela: async (quinielaId: number, eventosIds: number[]): Promise<void> => {
        await apiClient.post(`${QUINIELA_EVENTOS_URL}/quiniela/${quinielaId}/eventos`, eventosIds);
    },

    /**
     * Configurar tipo de predicción para un evento en una quiniela
     * @param quinielaId ID de la quiniela
     * @param eventoId ID del evento
     * @param configuracion Configuración del tipo de predicción
     * @returns Respuesta de la operación
     */
    configurarTipoPrediccion: async (
        quinielaId: number, 
        eventoId: number, 
        configuracion: ConfigurarTipoPrediccionRequestType
    ): Promise<void> => {
        await apiClient.post(
            `${QUINIELA_EVENTOS_URL}/quiniela/${quinielaId}/evento/${eventoId}/tipo-prediccion`, 
            configuracion
        );
    },

    /**
     * Obtener configuración de eventos de una quiniela
     * @param quinielaId ID de la quiniela
     * @returns Lista de configuraciones de eventos
     */
    obtenerConfiguracionEventosQuiniela: async (quinielaId: number): Promise<EventoQuinielaConfigType[]> => {
        const response = await apiClient.get<EventoQuinielaConfigType[]>(
            `${QUINIELA_EVENTOS_URL}/quiniela/${quinielaId}/configuracion`
        );
        return response.data;
    },

    /**
     * Remover evento de una quiniela
     * @param quinielaId ID de la quiniela
     * @param eventoId ID del evento a remover
     * @returns Respuesta de la operación
     */
    removerEventoDeQuiniela: async (quinielaId: number, eventoId: number): Promise<void> => {
        await apiClient.delete(`${QUINIELA_EVENTOS_URL}/quiniela/${quinielaId}/evento/${eventoId}`);
    },

    // ========== MÉTODOS AUXILIARES ==========

    /**
     * Obtener lista de deportes disponibles
     * @returns Lista de deportes únicos en el sistema
     */
    obtenerDeportesDisponibles: async (): Promise<string[]> => {
        const response = await apiClient.get<string[]>(`${BASE_URL}/deportes-disponibles`);
        return response.data;
    },

    /**
     * Obtener lista de ligas disponibles
     * @param deporte Filtrar por deporte específico (opcional)
     * @returns Lista de ligas disponibles
     */
    obtenerLigasDisponibles: async (deporte?: string): Promise<string[]> => {
        const params = deporte ? `?deporte=${encodeURIComponent(deporte)}` : '';
        const response = await apiClient.get<string[]>(`${BASE_URL}/ligas-disponibles${params}`);
        return response.data;
    },

    /**
     * Obtener lista de equipos disponibles
     * @param deporte Filtrar por deporte específico (opcional)
     * @param liga Filtrar por liga específica (opcional)
     * @returns Lista de equipos disponibles
     */
    obtenerEquiposDisponibles: async (deporte?: string, liga?: string): Promise<string[]> => {
        const params = new URLSearchParams();
        if (deporte) params.append('deporte', deporte);
        if (liga) params.append('liga', liga);

        const queryString = params.toString();
        const response = await apiClient.get<string[]>(`${BASE_URL}/equipos-disponibles${queryString ? '?' + queryString : ''}`);
        return response.data;
    },

    /**
     * Verificar si un evento está activo y disponible para predicciones
     * @param eventoId ID del evento
     * @returns True si está disponible, false en caso contrario
     */
    verificarDisponibilidadEvento: async (eventoId: number): Promise<boolean> => {
        try {
            const response = await apiClient.get<{disponible: boolean}>(`${BASE_URL}/${eventoId}/disponible`);
            return response.data.disponible;
        } catch {
            return false;
        }
    },

    /**
     * Obtener eventos similares basados en equipos o liga
     * @param eventoId ID del evento de referencia
     * @param limite Número máximo de eventos similares a retornar
     * @returns Lista de eventos similares
     */
    obtenerEventosSimilares: async (eventoId: number, limite = 10): Promise<EventoDeportivoResumenType[]> => {
        const response = await apiClient.get<EventoDeportivoResumenType[]>(
            `${BASE_URL}/${eventoId}/similares?limite=${limite}`
        );
        return response.data;
    },

    /**
     * Obtener historial de enfrentamientos entre dos equipos
     * @param equipoLocal Nombre del equipo local
     * @param equipoVisitante Nombre del equipo visitante
     * @param limite Número máximo de enfrentamientos históricos
     * @returns Lista de enfrentamientos históricos
     */
    obtenerHistorialEnfrentamientos: async (
        equipoLocal: string, 
        equipoVisitante: string, 
        limite = 10
    ): Promise<EventoDeportivoType[]> => {
        const params = new URLSearchParams({
            equipoLocal,
            equipoVisitante,
            limite: limite.toString()
        });

        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/historial-enfrentamientos?${params.toString()}`);
        return response.data;
    },

    /**
     * Obtener evento por nombre y fecha específica
     * @param nombreEvento Nombre del evento o enfrentamiento
     * @param fecha Fecha del evento en formato ISO (YYYY-MM-DD)
     * @param equipoLocal Nombre del equipo local (opcional para mayor precisión)
     * @param equipoVisitante Nombre del equipo visitante (opcional para mayor precisión)
     * @returns El evento encontrado que coincida con los criterios
     */
    obtenerEventoPorNombreYFecha: async (
        nombreEvento: string, 
        fecha: string,
    ): Promise<EventoDeportivoType | null> => {
        try {
            const response = await apiClient.get<EventoDeportivoType>(`${BASE_URL}/buscar-por-nombre-fecha/${encodeURIComponent(nombreEvento)}/${fecha}`);
            return response.data;
        } catch {
            return null;
        }
    },

    /**
     * Obtener eventos por fecha específica
     * @param fecha Fecha en formato ISO (YYYY-MM-DD)
     * @param deporte Filtrar por deporte específico (opcional)
     * @param liga Filtrar por liga específica (opcional)
     * @returns Lista de eventos en la fecha especificada
     */
    obtenerEventosPorFecha: async (
        fecha: string,
        deporte?: string,
        liga?: string
    ): Promise<EventoDeportivoType[]> => {
        const params = new URLSearchParams({
            fecha
        });

        if (deporte) params.append('deporte', deporte);
        if (liga) params.append('liga', liga);

        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/por-fecha?${params.toString()}`);
        return response.data;
    },
};