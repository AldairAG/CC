import { useState, useCallback } from 'react';
import type { 
    QuinielaCreada, 
    CrearQuinielaRequest, 
    UnirseQuinielaRequest, 
    HacerPrediccionesRequest,
    ParticipacionQuiniela 
} from '../types/QuinielaType';
import type {
    EstadisticasQuinielaResponse,
    FiltrosBusquedaAvanzada
} from '../types/QuinielaServiceTypes';
import { QuinielaCreadaService } from '../service/api/quinielaCreadaService';

export const useQuinielasCreadas = () => {
    // =================== ESTADOS PRINCIPALES ===================
    const [quinielasPublicas, setQuinielasPublicas] = useState<QuinielaCreada[]>([]);
    const [misQuinielas, setMisQuinielas] = useState<QuinielaCreada[]>([]);
    const [misParticipaciones, setMisParticipaciones] = useState<QuinielaCreada[]>([]);
    const [quinielaActual, setQuinielaActual] = useState<QuinielaCreada | null>(null);
    const [quinielasFiltradas, setQuinielasFiltradas] = useState<QuinielaCreada[]>([]);
    const [estadisticasActuales, setEstadisticasActuales] = useState<EstadisticasQuinielaResponse | null>(null);
    
    // Estados de control
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // =================== OPERACIONES PRINCIPALES ===================

    /**
     * Crear una nueva quiniela
     */
    const crearQuiniela = useCallback(async (request: CrearQuinielaRequest): Promise<QuinielaCreada> => {
        try {
            setLoading(true);
            setError(null);
            const nuevaQuiniela = await QuinielaCreadaService.crearQuiniela(request);
            
            // Actualizar la lista correspondiente
            setMisQuinielas(prev => [nuevaQuiniela, ...prev]);
            
            return nuevaQuiniela;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear quiniela';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Unirse a una quiniela existente
     */
    const unirseQuiniela = useCallback(async (request: UnirseQuinielaRequest): Promise<ParticipacionQuiniela> => {
        try {
            setLoading(true);
            setError(null);
            const participacion = await QuinielaCreadaService.unirseQuiniela(request);
            
            // Recargar las listas para reflejar los cambios
            await cargarQuinielasPublicas();
            await cargarMisParticipaciones();
            
            return participacion;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al unirse a la quiniela';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Hacer predicciones en una quiniela
     */
    const hacerPredicciones = useCallback(async (request: HacerPrediccionesRequest): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await QuinielaCreadaService.hacerPredicciones(request);
            
            // Recargar participaciones para ver las predicciones actualizadas
            await cargarMisParticipaciones();
            
            // Si es la quiniela actual, actualizarla
            if (quinielaActual?.id === request.quinielaId) {
                await obtenerQuiniela(request.quinielaId);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al guardar predicciones';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [quinielaActual]);

    /**
     * Distribuir premios de una quiniela
     */
    const distribuirPremios = useCallback(async (quinielaId: number): Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            const resultado = await QuinielaCreadaService.distribuirPremios(quinielaId);
            
            // Recargar todas las listas para reflejar los cambios
            await Promise.all([
                cargarQuinielasPublicas(),
                cargarMisQuinielas(),
                cargarMisParticipaciones()
            ]);
            
            // Actualizar quiniela actual si corresponde
            if (quinielaActual?.id === quinielaId) {
                await obtenerQuiniela(quinielaId);
            }
            
            return resultado;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al distribuir premios';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [quinielaActual]);

    /**
     * Finalizar una quiniela
     */
    const finalizarQuiniela = useCallback(async (quinielaId: number): Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            const resultado = await QuinielaCreadaService.finalizarQuiniela(quinielaId);
            
            // Recargar todas las listas
            await Promise.all([
                cargarQuinielasPublicas(),
                cargarMisQuinielas(),
                cargarMisParticipaciones()
            ]);
            
            // Actualizar quiniela actual si corresponde
            if (quinielaActual?.id === quinielaId) {
                await obtenerQuiniela(quinielaId);
            }
            
            return resultado;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al finalizar quiniela';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [quinielaActual]);

    // =================== CONSULTAS Y OBTENCIÓN DE DATOS ===================

    /**
     * Cargar quinielas públicas
     */
    const cargarQuinielasPublicas = useCallback(async (): Promise<QuinielaCreada[]> => {
        try {
            setLoading(true);
            setError(null);
            const quinielas = await QuinielaCreadaService.obtenerQuinielasPublicas();
            setQuinielasPublicas(quinielas);
            setCurrentPage(0);
            setHasMorePages(true);
            return quinielas;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar quinielas';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Cargar mis quinielas
     */
    const cargarMisQuinielas = useCallback(async (): Promise<QuinielaCreada[]> => {
        try {
            setLoading(true);
            setError(null);
            const quinielas = await QuinielaCreadaService.obtenerMisQuinielas();
            setMisQuinielas(quinielas);
            return quinielas;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar tus quinielas';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Cargar mis participaciones
     */
    const cargarMisParticipaciones = useCallback(async (): Promise<QuinielaCreada[]> => {
        try {
            setLoading(true);
            setError(null);
            const quinielas = await QuinielaCreadaService.obtenerMisParticipaciones();
            setMisParticipaciones(quinielas);
            return quinielas;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar participaciones';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtener quiniela específica por ID
     */
    const obtenerQuiniela = useCallback(async (id: number): Promise<QuinielaCreada> => {
        try {
            setLoading(true);
            setError(null);
            const quiniela = await QuinielaCreadaService.obtenerQuiniela(id);
            setQuinielaActual(quiniela);
            return quiniela;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar quiniela';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtener todas las quinielas con paginación
     */
    const obtenerTodasQuinielas = useCallback(async (page: number = 0, size: number = 10): Promise<QuinielaCreada[]> => {
        try {
            if (page === 0) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);
            
            const quinielas = await QuinielaCreadaService.obtenerTodasQuinielas(page, size);
            
            if (page === 0) {
                setQuinielasPublicas(quinielas);
            } else {
                setQuinielasPublicas(prev => [...prev, ...quinielas]);
            }
            
            setCurrentPage(page);
            setPageSize(size);
            setHasMorePages(quinielas.length === size);
            
            return quinielas;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar quinielas';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // =================== FILTROS Y BÚSQUEDAS ===================

    /**
     * Obtener quinielas por estado
     */
    const obtenerQuinielasPorEstado = useCallback(async (estado: string): Promise<QuinielaCreada[]> => {
        try {
            setLoading(true);
            setError(null);
            const quinielas = await QuinielaCreadaService.obtenerQuinielasPorEstado(estado);
            setQuinielasFiltradas(quinielas);
            return quinielas;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al filtrar por estado';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtener quinielas por precio máximo
     */
    const obtenerQuinielasPorPrecioMaximo = useCallback(async (precioMaximo: number): Promise<QuinielaCreada[]> => {
        try {
            setLoading(true);
            setError(null);
            const quinielas = await QuinielaCreadaService.obtenerQuinielasPorPrecioMaximo(precioMaximo);
            setQuinielasFiltradas(quinielas);
            return quinielas;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al filtrar por precio';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtener quinielas por tipo de premio
     */
    const obtenerQuinielasPorTipoPremio = useCallback(async (tipoPremio: string): Promise<QuinielaCreada[]> => {
        try {
            setLoading(true);
            setError(null);
            const quinielas = await QuinielaCreadaService.obtenerQuinielasPorTipoPremio(tipoPremio);
            setQuinielasFiltradas(quinielas);
            return quinielas;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al filtrar por tipo de premio';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtener quinielas por rango de fechas
     */
    const obtenerQuinielasPorRangoFecha = useCallback(async (fechaInicio: string, fechaFin: string): Promise<QuinielaCreada[]> => {
        try {
            setLoading(true);
            setError(null);
            const quinielas = await QuinielaCreadaService.obtenerQuinielasPorRangoFecha(fechaInicio, fechaFin);
            setQuinielasFiltradas(quinielas);
            return quinielas;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al filtrar por fechas';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Búsqueda avanzada con múltiples filtros
     */
    const busquedaAvanzadaQuinielas = useCallback(async (filtros: FiltrosBusquedaAvanzada): Promise<QuinielaCreada[]> => {
        try {
            setLoading(true);
            setError(null);
            const quinielas = await QuinielaCreadaService.busquedaAvanzadaQuinielas(filtros);
            setQuinielasFiltradas(quinielas);
            return quinielas;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error en búsqueda avanzada';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Filtrar localmente por nombre
     */
    const filterByNombre = useCallback((nombre: string) => {
        if (!nombre.trim()) {
            setQuinielasFiltradas([]);
            return;
        }

        const filtradas = quinielasPublicas.filter(quiniela =>
            quiniela.nombre.toLowerCase().includes(nombre.toLowerCase()) ||
            quiniela.descripcion?.toLowerCase().includes(nombre.toLowerCase())
        );
        
        setQuinielasFiltradas(filtradas);
    }, [quinielasPublicas]);

    /**
     * Limpiar filtros
     */
    const limpiarQuinielas = useCallback(() => {
        setQuinielasFiltradas([]);
    }, []);

    // =================== ADMINISTRACIÓN ===================

    /**
     * Actualizar premio acumulado
     */
    const actualizarPremioAcumulado = useCallback(async (id: number, nuevoPremio: number): Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            const resultado = await QuinielaCreadaService.actualizarPremioAcumulado(id, nuevoPremio);
            
            // Actualizar quiniela actual si corresponde
            if (quinielaActual?.id === id) {
                await obtenerQuiniela(id);
            }
            
            return resultado;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar premio';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [quinielaActual]);

    /**
     * Actualizar estado de quiniela
     */
    const actualizarEstadoQuiniela = useCallback(async (id: number, nuevoEstado: string): Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            const resultado = await QuinielaCreadaService.actualizarEstadoQuiniela(id, nuevoEstado);
            
            // Recargar listas relevantes
            await Promise.all([
                cargarQuinielasPublicas(),
                cargarMisQuinielas()
            ]);
            
            // Actualizar quiniela actual si corresponde
            if (quinielaActual?.id === id) {
                await obtenerQuiniela(id);
            }
            
            return resultado;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar estado';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [quinielaActual]);

    /**
     * Eliminar quiniela
     */
    const eliminarQuiniela = useCallback(async (id: number): Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            const resultado = await QuinielaCreadaService.eliminarQuiniela(id);
            
            // Remover de todas las listas localmente
            setQuinielasPublicas(prev => prev.filter(q => q.id !== id));
            setMisQuinielas(prev => prev.filter(q => q.id !== id));
            setMisParticipaciones(prev => prev.filter(q => q.id !== id));
            
            // Limpiar quiniela actual si es la eliminada
            if (quinielaActual?.id === id) {
                setQuinielaActual(null);
            }
            
            return resultado;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar quiniela';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [quinielaActual]);

    // =================== ESTADÍSTICAS ===================

    /**
     * Obtener estadísticas de una quiniela
     */
    const obtenerEstadisticasQuiniela = useCallback(async (id: number): Promise<EstadisticasQuinielaResponse> => {
        try {
            setLoading(true);
            setError(null);
            const estadisticas = await QuinielaCreadaService.obtenerEstadisticasQuiniela(id);
            setEstadisticasActuales(estadisticas);
            return estadisticas;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener estadísticas';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // =================== FUNCIONES ESPECÍFICAS ===================

    /**
     * Buscar por código de invitación
     */
    const buscarPorCodigo = useCallback(async (codigo: string): Promise<QuinielaCreada> => {
        try {
            setLoading(true);
            setError(null);
            const quiniela = await QuinielaCreadaService.buscarPorCodigoInvitacion(codigo);
            return quiniela;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Código inválido o quiniela no encontrada';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Cargar más quinielas (paginación)
     */
    const cargarMasQuinielas = useCallback(async (): Promise<QuinielaCreada[]> => {
        if (!hasMorePages || loadingMore) return [];
        
        const nextPage = currentPage + 1;
        return await obtenerTodasQuinielas(nextPage, pageSize);
    }, [hasMorePages, loadingMore, currentPage, pageSize, obtenerTodasQuinielas]);

    // =================== UTILIDADES Y FILTROS LOCALES ===================

    /**
     * Obtener quinielas disponibles para participar
     */
    const obtenerQuinielasDisponibles = useCallback((): QuinielaCreada[] => {
        return quinielasPublicas.filter(q => q.estado === 'ACTIVA');
    }, [quinielasPublicas]);

    /**
     * Obtener quinielas en curso
     */
    const obtenerQuinielasEnCurso = useCallback((): QuinielaCreada[] => {
        return misParticipaciones.filter(q => q.estado === 'EN_CURSO');
    }, [misParticipaciones]);

    /**
     * Obtener quinielas finalizadas
     */
    const obtenerQuinielasFinalizadas = useCallback((): QuinielaCreada[] => {
        return misParticipaciones.filter(q => q.estado === 'FINALIZADA');
    }, [misParticipaciones]);

    /**
     * Calcular total de premios pendientes
     */
    const calcularTotalPremiosPendientes = useCallback((): number => {
        return misParticipaciones.reduce((total, quiniela) => {
            if (quiniela.participaciones) {
                const miParticipacion = quiniela.participaciones.find(p => 
                    !p.premioReclamado && p.premioGanado && p.premioGanado > 0
                );
                return total + (miParticipacion?.premioGanado || 0);
            }
            return total;
        }, 0);
    }, [misParticipaciones]);

    /**
     * Obtener estadísticas generales del usuario
     */
    const obtenerEstadisticasUsuario = useCallback(() => {
        const quinielasCreadas = misQuinielas.length;
        const quinielasParticipadas = misParticipaciones.length;
        const quinielasGanadas = misParticipaciones.filter(q => 
            q.participaciones?.some(p => p.premioGanado && p.premioGanado > 0)
        ).length;
        const premiosTotales = misParticipaciones.reduce((total, q) => {
            const miParticipacion = q.participaciones?.find(p => p.premioGanado);
            return total + (miParticipacion?.premioGanado || 0);
        }, 0);

        return {
            quinielasCreadas,
            quinielasParticipadas,
            quinielasGanadas,
            premiosTotales,
            tasaExito: quinielasParticipadas > 0 ? (quinielasGanadas / quinielasParticipadas) * 100 : 0
        };
    }, [misQuinielas, misParticipaciones]);

    /**
     * Verificar si puede participar en una quiniela
     */
    const puedeParticipar = useCallback((quiniela: QuinielaCreada, usuarioId?: number): boolean => {
        return QuinielaCreadaService.puedeParticipar(quiniela, usuarioId);
    }, []);

    /**
     * Verificar si es creador de una quiniela
     */
    const esCreador = useCallback((quiniela: QuinielaCreada, usuarioId?: number): boolean => {
        return QuinielaCreadaService.esCreador(quiniela, usuarioId);
    }, []);

    // =================== GESTIÓN DE ERRORES ===================

    /**
     * Limpiar errores
     */
    const limpiarError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Limpiar estado actual
     */
    const limpiarEstadoActual = useCallback(() => {
        setQuinielaActual(null);
        setEstadisticasActuales(null);
    }, []);

    return {
        // =================== ESTADOS ===================
        quinielasPublicas,
        misQuinielas,
        misParticipaciones,
        quinielaActual,
        quinielasFiltradas,
        estadisticasActuales,
        loading,
        error,
        loadingMore,
        hasMorePages,
        currentPage,
        pageSize,

        // =================== OPERACIONES PRINCIPALES ===================
        crearQuiniela,
        unirseQuiniela,
        hacerPredicciones,
        distribuirPremios,
        finalizarQuiniela,

        // =================== CONSULTAS ===================
        cargarQuinielasPublicas,
        cargarMisQuinielas,
        cargarMisParticipaciones,
        obtenerQuiniela,
        obtenerTodasQuinielas,
        cargarMasQuinielas,

        // =================== FILTROS Y BÚSQUEDAS ===================
        obtenerQuinielasPorEstado,
        obtenerQuinielasPorPrecioMaximo,
        obtenerQuinielasPorTipoPremio,
        obtenerQuinielasPorRangoFecha,
        busquedaAvanzadaQuinielas,
        filterByNombre,
        limpiarQuinielas,

        // =================== ADMINISTRACIÓN ===================
        actualizarPremioAcumulado,
        actualizarEstadoQuiniela,
        eliminarQuiniela,

        // =================== ESTADÍSTICAS ===================
        obtenerEstadisticasQuiniela,

        // =================== FUNCIONES ESPECÍFICAS ===================
        buscarPorCodigo,

        // =================== UTILITIES ===================
        obtenerQuinielasDisponibles,
        obtenerQuinielasEnCurso,
        obtenerQuinielasFinalizadas,
        calcularTotalPremiosPendientes,
        obtenerEstadisticasUsuario,
        puedeParticipar,
        esCreador,
        limpiarError,
        limpiarEstadoActual,
        
        // =================== MÉTODOS DEL SERVICIO ===================
        calcularTiempoRestante: QuinielaCreadaService.calcularTiempoRestante,
        formatearMoneda: QuinielaCreadaService.formatearMoneda,
        calcularPorcentajeOcupacion: QuinielaCreadaService.calcularPorcentajeOcupacion,
        obtenerEstadoColor: QuinielaCreadaService.obtenerEstadoColor,
        obtenerEstadoIcono: QuinielaCreadaService.obtenerEstadoIcono,
        obtenerEstadoTexto: QuinielaCreadaService.obtenerEstadoTexto,
    };
};

export default useQuinielasCreadas;
