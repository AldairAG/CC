import { useState, useCallback } from 'react';
import type { 
    CrearQuinielaRequest, 
    QuinielaResponse, 
    UnirseQuinielaRequest,
    HacerPrediccionesRequest
} from '../types/QuinielaType';
import { quinielasAPI } from '../service/api/quinielasAPI';

export const useQuiniela = () => {
    const [quinielasPublicas, setQuinielasPublicas] = useState<QuinielaResponse[]>([]);
    const [misQuinielas, setMisQuinielas] = useState<QuinielaResponse[]>([]);
    const [misParticipaciones, setMisParticipaciones] = useState<QuinielaResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const limpiarError = useCallback(() => {
        setError(null);
    }, []);    const cargarMisQuinielas = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await quinielasAPI.obtenerMisQuinielas();
            setMisQuinielas(response);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar mis quinielas';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const cargarQuinielasPublicas = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await quinielasAPI.obtenerPublicas();
            setQuinielasPublicas(response);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar las quinielas públicas';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const crearQuiniela = useCallback(async (request: CrearQuinielaRequest): Promise<QuinielaResponse> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await quinielasAPI.crear(request);
            await cargarMisQuinielas(); // Recargar mis quinielas
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear la quiniela';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [cargarMisQuinielas]);

    const cargarMisParticipaciones = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await quinielasAPI.obtenerMisParticipaciones();
            setMisParticipaciones(response);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar mis participaciones';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const unirseQuiniela = useCallback(async (request: UnirseQuinielaRequest) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await quinielasAPI.unirse(request);
            await cargarMisParticipaciones(); // Recargar participaciones
            await cargarQuinielasPublicas(); // Recargar públicas para actualizar contadores
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al unirse a la quiniela';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [cargarMisParticipaciones, cargarQuinielasPublicas]);

    const hacerPredicciones = useCallback(async (request: HacerPrediccionesRequest) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await quinielasAPI.hacerPredicciones(request);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al hacer las predicciones';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerQuinielaPorId = useCallback(async (id: number): Promise<QuinielaResponse> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await quinielasAPI.obtenerPorId(id);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener la quiniela';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Funciones auxiliares
    const obtenerQuinielasDisponibles = useCallback(() => {
        const ahora = new Date();
        return quinielasPublicas.filter(q => {
            const fechaInicio = new Date(q.fechaInicio);
            return fechaInicio > ahora && (!q.maxParticipantes || q.participantes < q.maxParticipantes);
        });
    }, [quinielasPublicas]);

    const obtenerQuinielasEnCurso = useCallback(() => {
        const ahora = new Date();
        return [...misQuinielas, ...misParticipaciones].filter(q => {
            const fechaInicio = new Date(q.fechaInicio);
            const fechaFin = new Date(q.fechaFin);
            return fechaInicio <= ahora && fechaFin >= ahora;
        });
    }, [misQuinielas, misParticipaciones]);

    const obtenerQuinielasFinalizadas = useCallback(() => {
        const ahora = new Date();
        return [...misQuinielas, ...misParticipaciones].filter(q => {
            const fechaFin = new Date(q.fechaFin);
            return fechaFin < ahora;
        });
    }, [misQuinielas, misParticipaciones]);

    const calcularTotalPremiosPendientes = useCallback(() => {
        return obtenerQuinielasFinalizadas()
            .filter(q => !q.premiosDistribuidos)
            .reduce((total, q) => total + (q.participantes * q.precioEntrada), 0);
    }, [obtenerQuinielasFinalizadas]);

    return {
        // Estados
        quinielasPublicas,
        misQuinielas,
        misParticipaciones,
        loading,
        error,
        
        // Acciones
        crearQuiniela,
        cargarQuinielasPublicas,
        cargarMisQuinielas,
        cargarMisParticipaciones,
        unirseQuiniela,
        hacerPredicciones,
        obtenerQuinielaPorId,
        limpiarError,
        
        // Auxiliares
        obtenerQuinielasDisponibles,
        obtenerQuinielasEnCurso,
        obtenerQuinielasFinalizadas,
        calcularTotalPremiosPendientes,
    };
};
