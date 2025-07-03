/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    QuinielaType,
    QuinielaResumenType,
    CrearQuinielaRequestType,
    RankingParticipacionType,
    PrediccionRequestType,
    QuinielaParticipacionType,
    QuinielasResponse,
    EstadisticasQuinielaType
} from "../../types/QuinielaType";
import { apiClient } from "./ApiCliente";

const BASE_URL = '/quinielas';

export const QuinielaService = {
    /**
     * Crear una nueva quiniela
     * @param quiniela Datos de la quiniela a crear
     * @returns La quiniela creada
     */
    crearQuiniela: async (quiniela: CrearQuinielaRequestType): Promise<QuinielaType> => {
        const response = await apiClient.post<QuinielaType>(BASE_URL, quiniela);
        return response.data;
    },

    /**
     * Obtener todas las quinielas activas con paginación
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de quinielas activas
     */
    obtenerQuinielasActivas: async (page = 0, size = 10): Promise<QuinielasResponse> => {
        const response = await apiClient.get<QuinielasResponse>(`${BASE_URL}/activas`, {
            params: { page, size }
        });
        console.log(response.data);

        return response.data;
    },

    /**
     * Obtener una quiniela específica por ID
     * @param id ID de la quiniela
     * @returns La quiniela encontrada
     */
    obtenerQuinielaPorId: async (id: number): Promise<QuinielaType> => {
        const response = await apiClient.get<QuinielaType>(`${BASE_URL}/${id}`);
        return response.data;
    },

    /**
     * Obtener quiniela por código único
     * @param codigo Código único de la quiniela
     * @returns La quiniela encontrada
     */
    obtenerQuinielaPorCodigo: async (codigo: string): Promise<QuinielaType> => {
        const response = await apiClient.get<QuinielaType>(`${BASE_URL}/codigo/${codigo}`);
        return response.data;
    },

    /**
     * Participar en una quiniela
     * @param quinielaId ID de la quiniela
     * @param usuarioId ID del usuario participante
     * @returns La participación creada
     */
    participarEnQuiniela: async (quinielaId: number, usuarioId: number): Promise<QuinielaParticipacionType> => {
        const response = await apiClient.post<QuinielaParticipacionType>(`${BASE_URL}/${quinielaId}/participar`, {}, {
            params: { usuarioId }
        });
        return response.data;
    },

    /**
     * Realizar predicciones para una participación
     * @param participacionId ID de la participación
     * @param predicciones Lista de predicciones
     * @returns Respuesta de la operación
     */
    realizarPredicciones: async (participacionId: number, predicciones: PrediccionRequestType[]): Promise<any> => {
        const response = await apiClient.post(`${BASE_URL}/participaciones/${participacionId}/predicciones`,
            predicciones  // ✅ Enviar array directamente, no envuelto en objeto
        );
        return response.data;
    },

    /**
     * Obtener el ranking de una quiniela
     * @param quinielaId ID de la quiniela
     * @returns Lista del ranking
     */
    obtenerRanking: async (quinielaId: number): Promise<RankingParticipacionType[]> => {
        const response = await apiClient.get<RankingParticipacionType[]>(`${BASE_URL}/${quinielaId}/ranking`);
        return response.data;
    },

    /**
     * Obtener predicciones de un usuario para una quiniela específica
     * @param usuarioId ID del usuario
     * @param quinielaId ID de la quiniela
     * @returns Predicciones del usuario para la quiniela
     */
    obtenerPrediccionesUsuario: async (usuarioId: number, quinielaId: number): Promise<any> => {
        const response = await apiClient.get(`${BASE_URL}/predicciones/usuario/${usuarioId}/quiniela/${quinielaId}`);
        return response.data;
    },

    /**
     * Obtener predicciones por participación
     * @param participacionId ID de la participación
     * @returns Predicciones asociadas a la participación
     */
    obtenerPrediccionesPorParticipacion: async (participacionId: number): Promise<any> => {
        const response = await apiClient.get(`${BASE_URL}/participaciones/${participacionId}/predicciones`);
        return response.data;
    },

    /**
     * Obtener participaciones de un usuario
     * @param usuarioId ID del usuario
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de participaciones del usuario
     */
    obtenerParticipacionesUsuario: async (usuarioId: number, page = 0, size = 10): Promise<any> => {
        const response = await apiClient.get(`${BASE_URL}/participaciones/usuario/${usuarioId}`, {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Obtener participaciones de un usuario con relaciones cargadas
     * @param usuarioId ID del usuario
     * @returns Lista completa de participaciones con quinielas cargadas
     */
    obtenerParticipacionesUsuarioConRelaciones: async (usuarioId: number): Promise<QuinielaParticipacionType[]> => {
        const response = await apiClient.get<QuinielaParticipacionType[]>(`${BASE_URL}/participaciones/usuario/${usuarioId}/with-relations`);
        return response.data;
    },

    /**
     * Obtener quinielas populares (más participantes)
     * @param limite Número máximo de quinielas a retornar
     * @returns Lista de quinielas populares
     */
    obtenerQuinielasPopulares: async (limite = 10): Promise<QuinielaResumenType[]> => {
        const response = await apiClient.get<QuinielaResumenType[]>(`${BASE_URL}/populares`, {
            params: { limite }
        });
        return response.data;
    },

    /**
     * Obtener quinielas con mayor pool de premios
     * @param limite Número máximo de quinielas a retornar
     * @returns Lista de quinielas con mayor pool
     */
    obtenerQuinielasMayorPool: async (limite = 10): Promise<QuinielaResumenType[]> => {
        const response = await apiClient.get<QuinielaResumenType[]>(`${BASE_URL}/mayor-pool`, {
            params: { limite }
        });
        return response.data;
    },

    /**
     * Obtener quinielas próximas a cerrar
     * @param limite Número máximo de quinielas a retornar
     * @returns Lista de quinielas próximas a cerrar
     */
    obtenerQuinielasProximasACerrar: async (limite = 10): Promise<QuinielaResumenType[]> => {
        const response = await apiClient.get<QuinielaResumenType[]>(`${BASE_URL}/proximas-cerrar`, {
            params: { limite }
        });
        return response.data;
    },

    /**
     * Buscar quinielas por texto
     * @param query Texto de búsqueda
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de quinielas que coinciden con la búsqueda
     */
    buscarQuinielas: async (query: string, page = 0, size = 10): Promise<QuinielasResponse> => {
        const response = await apiClient.get<QuinielasResponse>(`${BASE_URL}/buscar`, {
            params: { q: query, page, size }
        });
        return response.data;
    },

    /**
     * Obtener quinielas por tipo
     * @param tipo Tipo de quiniela
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de quinielas del tipo especificado
     */
    obtenerQuinielasPorTipo: async (tipo: string, page = 0, size = 10): Promise<QuinielasResponse> => {
        const response = await apiClient.get<QuinielasResponse>(`${BASE_URL}/tipo/${tipo}`, {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Verificar si un usuario puede participar en una quiniela
     * @param quinielaId ID de la quiniela
     * @param usuarioId ID del usuario
     * @returns True si puede participar, false en caso contrario
     */
    puedeParticipar: async (quinielaId: number, usuarioId: number): Promise<boolean> => {
        try {
            const response = await apiClient.get<{ puedeParticipar: boolean }>(
                `${BASE_URL}/${quinielaId}/puede-participar/${usuarioId}`
            );
            console.log(`Usuario ${usuarioId} puede participar en quiniela ${quinielaId}:`, response.data);

            return response.data.puedeParticipar;
        } catch {
            return false;
        }
    },

    /**
     * Obtener estadísticas del dashboard de quinielas
     * @returns Estadísticas generales
     */
    obtenerEstadisticasDashboard: async (): Promise<EstadisticasQuinielaType> => {
        const response = await apiClient.get<EstadisticasQuinielaType>('/estadisticas/dashboard');
        return response.data;
    },

    /**
     * Obtener eventos de una quiniela
     * @param quinielaId ID de la quiniela
     * @returns Lista de eventos de la quiniela
     */
    obtenerEventosQuiniela: async (quinielaId: number): Promise<any[]> => {
        const response = await apiClient.get<any[]>(`${BASE_URL}/${quinielaId}/eventos`);
        return response.data;
    },

    /**
     * Activar una quiniela (DEPRECATED - las quinielas ahora se crean directamente activas)
     * @deprecated Las quinielas se activan automáticamente al crearlas
     * @param quinielaId ID de la quiniela
     * @param usuarioId ID del usuario que activa
     * @returns La quiniela activada
     */
    activarQuiniela: async (quinielaId: number, usuarioId: number): Promise<QuinielaType> => {
        const response = await apiClient.post<QuinielaType>(`${BASE_URL}/${quinielaId}/activar`, {
            usuarioId
        });
        return response.data;
    },

    /**
     * Obtener participación específica de un usuario en una quiniela
     * @param quinielaId ID de la quiniela
     * @param usuarioId ID del usuario
     * @returns La participación del usuario
     */
    obtenerParticipacion: async (quinielaId: number, usuarioId: number): Promise<QuinielaParticipacionType> => {
        const response = await apiClient.get<QuinielaParticipacionType>(
            `${BASE_URL}/${quinielaId}/participacion/${usuarioId}`
        );
        return response.data;
    },

    /**
     * Cancelar participación en una quiniela (si está permitido)
     * @param participacionId ID de la participación
     * @returns Respuesta de la operación
     */
    cancelarParticipacion: async (participacionId: number): Promise<any> => {
        const response = await apiClient.delete(`${BASE_URL}/participaciones/${participacionId}`);
        return response.data;
    },

    /**
     * Obtener quinielas creadas por un usuario
     * @param usuarioId ID del usuario creador
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @returns Página de quinielas creadas por el usuario
     */
    obtenerQuinielasCreadasPorUsuario: async (usuarioId: number, page = 0, size = 10): Promise<QuinielasResponse> => {
        const response = await apiClient.get<QuinielasResponse>(`${BASE_URL}/creador/${usuarioId}`, {
            params: { page, size }
        });
        return response.data;
    }
};
