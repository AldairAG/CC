import type {
    CuotaEvento,
    CuotaHistorial,
    TendenciaCuota,
    VolumenApuestas,
    EstadisticasCuotas,
    AlertaCuota,
    ResumenCuotas,
    ConfiguracionCuotas,
    FiltroCuotas,
    PaginacionCuotas,
    CuotasMercadoDetalladas,
    RespuestaGeneracionCuotas,
    RespuestaGeneracionCuotasFaltantes
} from '../../types/CuotasDinamicasTypes';
import { apiClient } from './ApiCliente';

const BASE_URL = '/cuotas-dinamicas';

export class CuotasDinamicasService {
    // Obtener cuotas de un evento específico
    static async obtenerCuotasEvento(eventoId: number): Promise<CuotaEvento[]> {
        try {
            const response = await apiClient.get(`${BASE_URL}/evento/${eventoId}/cuotas`);
            return response.data;
        } catch (error) {
            console.error('Error en obtenerCuotasEvento:', error);
            throw error;
        }
    }

    // Obtener historial de cuotas
    static async obtenerHistorialCuotas(
        eventoId: number,
        tipoResultado?: string,
        paginacion?: Partial<PaginacionCuotas>
    ): Promise<{ data: CuotaHistorial[]; paginacion: PaginacionCuotas }> {
        try {
            const params: Record<string, string> = {};
            if (tipoResultado) params.tipoResultado = tipoResultado;
            if (paginacion?.page !== undefined) params.page = paginacion.page.toString();
            if (paginacion?.size !== undefined) params.size = paginacion.size.toString();

            const response = await apiClient.get(`${BASE_URL}/historial/${eventoId}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error en obtenerHistorialCuotas:', error);
            throw error;
        }
    }

    // Obtener tendencias de cuotas
    static async obtenerTendenciaCuotas(
        eventoId?: number,
        filtros?: FiltroCuotas
    ): Promise<TendenciaCuota[]> {
        try {
            const params: Record<string, string> = {};
            if (eventoId) params.eventoId = eventoId.toString();
            if (filtros?.tendencia) params.tendencia = filtros.tendencia;
            if (filtros?.cuotaMinima) params.cuotaMinima = filtros.cuotaMinima.toString();
            if (filtros?.cuotaMaxima) params.cuotaMaxima = filtros.cuotaMaxima.toString();

            const response = await apiClient.get(`${BASE_URL}/tendencias`, { params });
            return response.data;
        } catch (error) {
            console.error('Error en obtenerTendenciaCuotas:', error);
            throw error;
        }
    }

    // Obtener volumen de apuestas
    static async obtenerVolumenApuestas(eventoId: number): Promise<VolumenApuestas[]> {
        try {
            const response = await apiClient.get(`${BASE_URL}/volumen/${eventoId}`);
            return response.data;
        } catch (error) {
            console.error('Error en obtenerVolumenApuestas:', error);
            throw error;
        }
    }

    // Obtener estadísticas de cuotas
    static async obtenerEstadisticasCuotas(eventoId: number): Promise<EstadisticasCuotas> {
        try {
            const response = await apiClient.get(`${BASE_URL}/estadisticas/${eventoId}`);
            return response.data;
        } catch (error) {
            console.error('Error en obtenerEstadisticasCuotas:', error);
            throw error;
        }
    }

    // Obtener resumen general de cuotas
    static async obtenerResumenCuotas(): Promise<ResumenCuotas> {
        try {
            const response = await apiClient.get(`${BASE_URL}/resumen`);
            return response.data;
        } catch (error) {
            console.error('Error en obtenerResumenCuotas:', error);
            throw error;
        }
    }

    // Obtener alertas de cuotas
    static async obtenerAlertasCuotas(): Promise<AlertaCuota[]> {
        try {
            const response = await apiClient.get(`${BASE_URL}/alertas`);
            return response.data;
        } catch (error) {
            console.error('Error en obtenerAlertasCuotas:', error);
            throw error;
        }
    }

    // Crear alerta de cuota
    static async crearAlertaCuota(
        alerta: Omit<AlertaCuota, 'id' | 'fechaCreacion'>
    ): Promise<AlertaCuota> {
        try {
            const response = await apiClient.post(`${BASE_URL}/alertas`, alerta);
            return response.data;
        } catch (error) {
            console.error('Error en crearAlertaCuota:', error);
            throw error;
        }
    }

    // Actualizar alerta de cuota
    static async actualizarAlertaCuota(
        alertaId: number,
        alertaActualizada: Partial<AlertaCuota>
    ): Promise<AlertaCuota> {
        try {
            const response = await apiClient.put(`${BASE_URL}/alertas/${alertaId}`, alertaActualizada);
            return response.data;
        } catch (error) {
            console.error('Error en actualizarAlertaCuota:', error);
            throw error;
        }
    }

    // Eliminar alerta de cuota
    static async eliminarAlertaCuota(alertaId: number): Promise<void> {
        try {
            await apiClient.delete(`${BASE_URL}/alertas/${alertaId}`);
        } catch (error) {
            console.error('Error en eliminarAlertaCuota:', error);
            throw error;
        }
    }

    // Obtener configuración de cuotas
    static async obtenerConfiguracion(): Promise<ConfiguracionCuotas> {
        try {
            const response = await apiClient.get(`${BASE_URL}/configuracion`);
            return response.data;
        } catch (error) {
            console.error('Error en obtenerConfiguracion:', error);
            throw error;
        }
    }

    // Actualizar configuración de cuotas
    static async actualizarConfiguracion(
        configuracion: Partial<ConfiguracionCuotas>
    ): Promise<ConfiguracionCuotas> {
        try {
            const response = await apiClient.put(`${BASE_URL}/configuracion`, configuracion);
            return response.data;
        } catch (error) {
            console.error('Error en actualizarConfiguracion:', error);
            throw error;
        }
    }

    // Registrar apuesta (para actualizar cuotas dinámicamente)
    static async registrarApuesta(
        eventoId: number,
        tipoResultado: string,
        monto: number,
        cuotaUtilizada: number
    ): Promise<CuotaEvento[]> {
        try {
            const response = await apiClient.post(`${BASE_URL}/registrar-apuesta`, {
                eventoId,
                tipoResultado,
                monto,
                cuotaUtilizada,
            });
            return response.data;
        } catch (error) {
            console.error('Error en registrarApuesta:', error);
            throw error;
        }
    }

    // Suscribirse a actualizaciones en tiempo real
    static async suscribirseActualizaciones(
        eventoId: number,
        callback: (cuotaActualizada: CuotaEvento) => void
    ): Promise<EventSource> {
        try {
            // Para SSE, necesitamos construir la URL completa
            const baseURL = apiClient.defaults.baseURL || '';
            const eventSource = new EventSource(`${baseURL}${BASE_URL}/stream/${eventoId}`);

            eventSource.onmessage = (event) => {
                try {
                    const cuotaActualizada: CuotaEvento = JSON.parse(event.data);
                    callback(cuotaActualizada);
                } catch (error) {
                    console.error('Error al procesar actualización en tiempo real:', error);
                }
            };

            eventSource.onerror = (error) => {
                console.error('Error en la conexión SSE:', error);
            };

            return eventSource;
        } catch (error) {
            console.error('Error en suscribirseActualizaciones:', error);
            throw error;
        }
    }

    // Buscar cuotas con filtros
    static async buscarCuotas(
        filtros: FiltroCuotas,
        busqueda?: string,
        paginacion?: Partial<PaginacionCuotas>
    ): Promise<{ data: CuotaEvento[]; paginacion: PaginacionCuotas }> {
        try {
            const params: Record<string, string> = {};

            if (filtros.eventoId) params.eventoId = filtros.eventoId.toString();
            if (filtros.tipoResultado) params.tipoResultado = filtros.tipoResultado;
            if (filtros.tendencia) params.tendencia = filtros.tendencia;
            if (filtros.cuotaMinima) params.cuotaMinima = filtros.cuotaMinima.toString();
            if (filtros.cuotaMaxima) params.cuotaMaxima = filtros.cuotaMaxima.toString();
            if (filtros.fechaDesde) params.fechaDesde = filtros.fechaDesde;
            if (filtros.fechaHasta) params.fechaHasta = filtros.fechaHasta;
            if (filtros.activa !== undefined) params.activa = filtros.activa.toString();
            if (busqueda) params.busqueda = busqueda;
            if (paginacion?.page !== undefined) params.page = paginacion.page.toString();
            if (paginacion?.size !== undefined) params.size = paginacion.size.toString();

            const response = await apiClient.get(`${BASE_URL}/buscar`, { params });
            return response.data;
        } catch (error) {
            console.error('Error en buscarCuotas:', error);
            throw error;
        }
    }

    // Obtener cuotas agrupadas por mercado
    static async obtenerCuotasPorMercado(eventoId: number): Promise<Record<string, CuotaEvento[]>> {
        try {
            const response = await apiClient.get(`${BASE_URL}/evento/${eventoId}/cuotas-por-mercado`);
            return response.data;
        } catch (error) {
            console.error('Error en obtenerCuotasPorMercado:', error);
            throw error;
        }
    }

    // Obtener cuotas para un mercado específico
    static async obtenerCuotasMercadoEspecifico(eventoId: number, mercado: string): Promise<CuotaEvento[]> {
        try {
            const response = await apiClient.get(`${BASE_URL}/evento/${eventoId}/mercado/${mercado}`);
            return response.data;
        } catch (error) {
            console.error('Error en obtenerCuotasMercadoEspecifico:', error);
            throw error;
        }
    }

    // Generar cuotas completas para un evento
    static async generarCuotasCompletas(eventoId: number): Promise<CuotaEvento[]> {
        try {
            const response = await apiClient.post(`${BASE_URL}/evento/${eventoId}/generar-cuotas-completas`);
            return response.data;
        } catch (error) {
            console.error('Error en generarCuotasCompletas:', error);
            throw error;
        }
    }

    // Generar cuotas básicas para un evento (1X2)
    static async generarCuotasBasicas(eventoId: number): Promise<CuotaEvento[]> {
        try {
            const response = await apiClient.post(`${BASE_URL}/evento/${eventoId}/generar-cuotas-basicas`);
            return response.data;
        } catch (error) {
            console.error('Error en generarCuotasBasicas:', error);
            throw error;
        }
    }

    // Obtener cuotas detalladas con información del evento
    static async obtenerCuotasDetalladas(eventoId: number): Promise<CuotasMercadoDetalladas> {
        try {
            const response = await apiClient.get(`${BASE_URL}/evento/${eventoId}/cuotas-detalladas`);
            return response.data;
        } catch (error) {
            console.error('Error en obtenerCuotasDetalladas:', error);
            throw error;
        }
    }

    // Generar cuotas para un evento específico
    static async generarCuotasParaEvento(eventoId: number): Promise<RespuestaGeneracionCuotas> {
        try {
            const response = await apiClient.post(`/cc/eventos-deportivos/${eventoId}/generar-cuotas`);
            return response.data;
        } catch (error) {
            console.error('Error en generarCuotasParaEvento:', error);
            throw error;
        }
    }

    // Generar cuotas para todos los eventos que no tienen cuotas
    static async generarCuotasFaltantes(): Promise<RespuestaGeneracionCuotasFaltantes> {
        try {
            const response = await apiClient.post('/cc/eventos-deportivos/generar-cuotas-faltantes');
            return response.data;
        } catch (error) {
            console.error('Error en generarCuotasFaltantes:', error);
            throw error;
        }
    }
}

export default CuotasDinamicasService;