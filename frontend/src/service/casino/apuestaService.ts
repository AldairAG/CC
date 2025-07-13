import type {
    ApuestaType,
    CrearApuestaRequestType,
    ApuestasResponse,
    EstadisticasApuestaType,
    ResumenApuestaType,
    FiltrosApuesta,
    ApuestaDetalle,
    EstadoApuesta,
    TipoApuesta
} from "../../types/ApuestaType";
import type { EventoDeportivoType } from "../../types/EventoDeportivoTypes";
import { apiClient } from "./ApiCliente";

const BASE_URL = '/apuestas';

export const ApuestaService = {
    /**
     * Crear una nueva apuesta
     * @param apuesta Datos de la apuesta a crear
     * @returns La apuesta creada
     */
    crearApuesta: async (apuesta: CrearApuestaRequestType, usuarioId: number): Promise<ApuestaType> => {
        const response = await apiClient.post<ApuestaType>(`${BASE_URL}/${usuarioId}`, apuesta);
        return response.data;
    },

    /**
     * Obtener apuestas del usuario actual con paginación
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de apuestas del usuario
     */
    obtenerMisApuestas: async (page = 0, size = 10): Promise<ApuestasResponse> => {
        const response = await apiClient.get<ApuestasResponse>(`${BASE_URL}/mis-apuestas`, {
            params: { page, size }
        });
        console.log('Mis apuestas:', response.data);
        return response.data;
    },

    /**
     * Obtener detalles de una apuesta específica
     * @param apuestaId ID de la apuesta
     * @returns La apuesta encontrada
     */
    obtenerApuestaPorId: async (apuestaId: number): Promise<ApuestaDetalle> => {
        const response = await apiClient.get<ApuestaDetalle>(`${BASE_URL}/${apuestaId}`);
        return response.data;
    },

    /**
     * Cancelar una apuesta
     * @param apuestaId ID de la apuesta a cancelar
     * @returns Mensaje de confirmación
     */
    cancelarApuesta: async (apuestaId: number): Promise<string> => {
        const response = await apiClient.put<string>(`${BASE_URL}/${apuestaId}/cancelar`);
        return response.data;
    },

    /**
     * Procesar resultados de apuestas para un evento (solo administradores)
     * @param eventoId ID del evento
     * @returns Mensaje de confirmación
     */
    procesarResultadosEvento: async (eventoId: number): Promise<string> => {
        const response = await apiClient.post<string>(`${BASE_URL}/procesar-evento/${eventoId}`);
        return response.data;
    },

    /**
     * Obtener apuestas filtradas del usuario actual
     * @param filtros Filtros a aplicar
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de apuestas filtradas
     */
    obtenerApuestasFiltradas: async (filtros: FiltrosApuesta, page = 0, size = 10): Promise<ApuestasResponse> => {
        const params = {
            page,
            size,
            ...filtros
        };

        const response = await apiClient.get<ApuestasResponse>(`${BASE_URL}/mis-apuestas/filtradas`, {
            params
        });
        return response.data;
    },

    /**
     * Obtener estadísticas de apuestas del usuario actual
     * @returns Estadísticas de apuestas
     */
    obtenerEstadisticasApuestas: async (idUsuario: number): Promise<EstadisticasApuestaType> => {
        const response = await apiClient.get<EstadisticasApuestaType>(`${BASE_URL}/estadisticas/${idUsuario}`);
        return response.data;
    },

    /**
     * Obtener resumen de apuestas recientes
     * @param limite Número máximo de apuestas a retornar
     * @returns Lista de resumen de apuestas recientes
     */
    obtenerApuestasRecientes: async (limite = 5): Promise<ResumenApuestaType[]> => {
        const response = await apiClient.get<ResumenApuestaType[]>(`${BASE_URL}/recientes`, {
            params: { limite }
        });
        return response.data;
    },

    /**
     * Obtener eventos con más apuestas
     * @param limite Número máximo de eventos a retornar
     * @returns Lista de eventos con más apuestas
     */
    obtenerEventosConMasApuestas: async (limite = 5): Promise<EventoDeportivoType[]> => {
        const response = await apiClient.get<EventoDeportivoType[]>(`${BASE_URL}/eventos-mas-apuestas`, {
            params: { limite }
        });
        return response.data;
    },

    /**
     * Obtener apuestas por estado
     * @param estado Estado de las apuestas
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de apuestas con el estado especificado
     */
    obtenerApuestasPorEstado: async (estado: EstadoApuesta, page = 0, size = 10): Promise<ApuestasResponse> => {
        const response = await apiClient.get<ApuestasResponse>(`${BASE_URL}/estado/${estado}`, {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Obtener apuestas por tipo
     * @param tipo Tipo de apuesta
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de apuestas del tipo especificado
     */
    obtenerApuestasPorTipo: async (tipo: TipoApuesta, page = 0, size = 10): Promise<ApuestasResponse> => {
        const response = await apiClient.get<ApuestasResponse>(`${BASE_URL}/tipo/${tipo}`, {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Obtener apuestas activas (pendientes y aceptadas)
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de apuestas activas
     */
    obtenerApuestasActivas: async (page = 0, size = 10): Promise<ApuestasResponse> => {
        const response = await apiClient.get<ApuestasResponse>(`${BASE_URL}/activas`, {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Obtener historial completo de apuestas
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de historial de apuestas
     */
    obtenerHistorialApuestas: async (page = 0, size = 10): Promise<ApuestasResponse> => {
        const response = await apiClient.get<ApuestasResponse>(`${BASE_URL}/historial`, {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Verificar si se puede realizar una apuesta para un evento
     * @param eventoId ID del evento
     * @param cuotaId ID de la cuota
     * @param monto Monto a apostar
     * @returns True si se puede realizar la apuesta
     */
    verificarApuestaValida: async (eventoId: number, cuotaId: number, monto: number): Promise<boolean> => {
        try {
            const response = await apiClient.get<{ valida: boolean }>(`${BASE_URL}/verificar`, {
                params: { eventoId, cuotaId, monto }
            });
            return response.data.valida;
        } catch {
            return false;
        }
    },

    /**
     * Obtener apuestas por evento
     * @param eventoId ID del evento
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de apuestas para el evento
     */
    obtenerApuestasPorEvento: async (eventoId: number, page = 0, size = 10): Promise<ApuestasResponse> => {
        const response = await apiClient.get<ApuestasResponse>(`${BASE_URL}/evento/${eventoId}`, {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Calcular ganancia potencial de una apuesta
     * @param montoApostado Monto a apostar
     * @param valorCuota Valor de la cuota
     * @returns Ganancia potencial calculada
     */
    calcularGananciaPotencial: (montoApostado: number, valorCuota: number): number => {
        return montoApostado * valorCuota;
    },

    /**
     * Validar monto de apuesta
     * @param monto Monto a validar
     * @returns True si el monto es válido
     */
    validarMontoApuesta: (monto: number): boolean => {
        const MONTO_MINIMO = 10.00;
        const MONTO_MAXIMO = 10000.00;
        return monto >= MONTO_MINIMO && monto <= MONTO_MAXIMO;
    },

    /**
     * Obtener límites de apuesta del usuario
     * @returns Límites de apuesta
     */
    obtenerLimitesApuesta: async (): Promise<{ minimo: number; maximo: number; disponible: number }> => {
        const response = await apiClient.get<{ minimo: number; maximo: number; disponible: number }>(`${BASE_URL}/limites`);
        return response.data;
    },

    /**
     * Buscar apuestas por criterio de búsqueda
     * @param query Texto de búsqueda
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de apuestas que coinciden con la búsqueda
     */
    buscarApuestas: async (query: string, page = 0, size = 10): Promise<ApuestasResponse> => {
        const response = await apiClient.get<ApuestasResponse>(`${BASE_URL}/buscar`, {
            params: { q: query, page, size }
        });
        return response.data;
    }
};