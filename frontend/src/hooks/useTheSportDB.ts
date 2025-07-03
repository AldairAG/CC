import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { TheSportsDBService } from '../service/api/theSportsDBService';
import { theSportsDBSelector } from '../store/slices/theSportsDBSlice';
import type { AppDispatch } from '../store/store';
import type {
    SimpleSportType,
    SimpleLeagueType,
} from '../types/TheSportsDBTypes';

// Importar las acciones del slice
import {
    setSportsLoading,
    setSports,
    setSportsError,
    clearSports,
    setLeaguesLoading,
    setLeagues,
    setLeaguesError,
    clearLeagues,
    setTeamsLoading,
    setTeams,
    setTeamsError,
    clearTeams,
    setSelectedSport,
    setSelectedLeague,
    clearFilters,
    clearAllData,
    resetTheSportsDBState,
} from '../store/slices/theSportsDBSlice';

/**
 * Hook personalizado para manejar la integración con TheSportsDB API
 */
export const useTheSportsDB = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    // ===== SELECTORES DEL ESTADO =====
    const sports = useSelector(theSportsDBSelector.sports);
    const leagues = useSelector(theSportsDBSelector.leagues);
    const teams = useSelector(theSportsDBSelector.teams);
    const sportsLoading = useSelector(theSportsDBSelector.sportsLoading);
    const leaguesLoading = useSelector(theSportsDBSelector.leaguesLoading);
    const teamsLoading = useSelector(theSportsDBSelector.teamsLoading);
    const sportsError = useSelector(theSportsDBSelector.sportsError);
    const leaguesError = useSelector(theSportsDBSelector.leaguesError);
    const teamsError = useSelector(theSportsDBSelector.teamsError);
    const selectedSport = useSelector(theSportsDBSelector.selectedSport);
    const selectedLeague = useSelector(theSportsDBSelector.selectedLeague);
    const leaguesBySport = useSelector(theSportsDBSelector.leaguesBySport);
    const teamsByLeague = useSelector(theSportsDBSelector.teamsByLeague);
    const isLoading = useSelector(theSportsDBSelector.isLoading);
    const hasAnyError = useSelector(theSportsDBSelector.hasAnyError);
    const isCacheValid = useSelector(theSportsDBSelector.isCacheValid);

    // ===== FUNCIÓN AUXILIAR PARA MANEJAR ERRORES =====
    const handleError = useCallback((error: unknown, customMessage?: string) => {
        console.error('Error en useTheSportsDB:', error);
        
        let errorMessage = customMessage || 'Error desconocido';
        
        // Manejo seguro de errores
        if (error && typeof error === 'object') {
            if ('response' in error && error.response && typeof error.response === 'object') {
                if ('data' in error.response && error.response.data && typeof error.response.data === 'object') {
                    if ('message' in error.response.data && typeof error.response.data.message === 'string') {
                        errorMessage = customMessage || error.response.data.message;
                    }
                }
            } else if ('message' in error && typeof error.message === 'string') {
                errorMessage = customMessage || error.message;
            }
        }
        
        toast.error(errorMessage);
    }, []);

    // ===== CARGAR DEPORTES =====
    const cargarDeportes = useCallback(async (forceReload: boolean = false) => {
        try {
            // Si hay cache válido y no se fuerza la recarga, no hacer nada
            if (!forceReload && isCacheValid && sports.length > 0) {
                return sports;
            }

            dispatch(setSportsLoading(true));
            
            const deportesData = await TheSportsDBService.getAllSports();
            dispatch(setSports(deportesData));
            
            return deportesData;
        } catch (error) {
            const errorMessage = 'Error al cargar deportes desde TheSportsDB';
            dispatch(setSportsError(errorMessage));
            handleError(error, errorMessage);
            return [];
        }
    }, [dispatch, handleError, isCacheValid, sports]);

    // ===== CARGAR TODAS LAS LIGAS =====
    const cargarTodasLasLigas = useCallback(async (forceReload: boolean = false) => {
        try {
            // Si hay cache válido y no se fuerza la recarga, no hacer nada
            if (!forceReload && leagues.length > 0) {
                return leagues;
            }

            dispatch(setLeaguesLoading(true));
            
            const ligasData = await TheSportsDBService.getAllLeagues();
            dispatch(setLeagues(ligasData));
            
            return ligasData;
        } catch (error) {
            const errorMessage = 'Error al cargar ligas desde TheSportsDB';
            dispatch(setLeaguesError(errorMessage));
            handleError(error, errorMessage);
            return [];
        }
    }, [dispatch, handleError, leagues]);

    // ===== CARGAR LIGAS POR DEPORTE =====
    const cargarLigasPorDeporte = useCallback(async (deporte: string) => {
        try {
            dispatch(setLeaguesLoading(true));
            
            const ligasData = await TheSportsDBService.getLeaguesBySport(deporte);
            dispatch(setLeagues(ligasData));
            dispatch(setSelectedSport(deporte));
            
            return ligasData;
        } catch (error) {
            const errorMessage = `Error al cargar ligas para el deporte: ${deporte}`;
            dispatch(setLeaguesError(errorMessage));
            handleError(error, errorMessage);
            return [];
        }
    }, [dispatch, handleError]);

    // ===== CARGAR EQUIPOS POR LIGA =====
    const cargarEquiposPorLiga = useCallback(async (ligaId: string) => {
        try {
            dispatch(setTeamsLoading(true));
            
            const equiposData = await TheSportsDBService.getTeamsByLeague(ligaId);
            dispatch(setTeams(equiposData));
            dispatch(setSelectedLeague(ligaId));
            
            return equiposData;
        } catch (error) {
            const errorMessage = `Error al cargar equipos para la liga: ${ligaId}`;
            dispatch(setTeamsError(errorMessage));
            handleError(error, errorMessage);
            return [];
        }
    }, [dispatch, handleError]);

    // ===== BUSCAR EQUIPOS =====
    const buscarEquipos = useCallback(async (nombreEquipo: string) => {
        try {
            dispatch(setTeamsLoading(true));
            
            const equiposData = await TheSportsDBService.searchTeams(nombreEquipo);
            dispatch(setTeams(equiposData));
            
            return equiposData;
        } catch (error) {
            const errorMessage = `Error al buscar equipos con el nombre: ${nombreEquipo}`;
            dispatch(setTeamsError(errorMessage));
            handleError(error, errorMessage);
            return [];
        }
    }, [dispatch, handleError]);

    // ===== OBTENER DETALLES DE DEPORTE =====
    const obtenerDetallesDeporte = useCallback(async (nombreDeporte: string) => {
        try {
            const detalles = await TheSportsDBService.getSportDetails(nombreDeporte);
            return detalles;
        } catch (error) {
            const errorMessage = `Error al obtener detalles del deporte: ${nombreDeporte}`;
            handleError(error, errorMessage);
            return null;
        }
    }, [handleError]);

    // ===== OBTENER DETALLES DE LIGA =====
    const obtenerDetallesLiga = useCallback(async (ligaId: string) => {
        try {
            const detalles = await TheSportsDBService.getLeagueDetails(ligaId);
            return detalles;
        } catch (error) {
            const errorMessage = `Error al obtener detalles de la liga: ${ligaId}`;
            handleError(error, errorMessage);
            return null;
        }
    }, [handleError]);

    // ===== FUNCIONES DE GESTIÓN DE FILTROS =====
    const seleccionarDeporte = useCallback((deporte: string | null) => {
        dispatch(setSelectedSport(deporte));
    }, [dispatch]);

    const seleccionarLiga = useCallback((liga: string | null) => {
        dispatch(setSelectedLeague(liga));
    }, [dispatch]);

    const limpiarFiltros = useCallback(() => {
        dispatch(clearFilters());
    }, [dispatch]);

    // ===== FUNCIONES DE LIMPIEZA =====
    const limpiarDeportes = useCallback(() => {
        dispatch(clearSports());
    }, [dispatch]);

    const limpiarLigas = useCallback(() => {
        dispatch(clearLeagues());
    }, [dispatch]);

    const limpiarEquipos = useCallback(() => {
        dispatch(clearTeams());
    }, [dispatch]);

    const limpiarTodo = useCallback(() => {
        dispatch(clearAllData());
    }, [dispatch]);

    const resetearEstado = useCallback(() => {
        dispatch(resetTheSportsDBState());
    }, [dispatch]);

    // ===== FUNCIONES DE UTILIDAD =====
    const obtenerDeportesPorNombre = useCallback((nombres: string[]): SimpleSportType[] => {
        return sports.filter(sport => 
            nombres.some(nombre => 
                sport.name.toLowerCase().includes(nombre.toLowerCase())
            )
        );
    }, [sports]);

    const obtenerLigasPorPais = useCallback((pais: string): SimpleLeagueType[] => {
        return leagues.filter(league => 
            league.country?.toLowerCase().includes(pais.toLowerCase())
        );
    }, [leagues]);

    // Devolver todo el estado y las funciones
    return {
        // ===== DATOS =====
        sports,
        leagues,
        teams,
        leaguesBySport,
        teamsByLeague,

        // ===== ESTADOS =====
        sportsLoading,
        leaguesLoading,
        teamsLoading,
        isLoading,
        
        // ===== ERRORES =====
        sportsError,
        leaguesError,
        teamsError,
        hasAnyError,
        
        // ===== FILTROS =====
        selectedSport,
        selectedLeague,
        
        // ===== CACHE =====
        isCacheValid,

        // ===== FUNCIONES DE CARGA =====
        cargarDeportes,
        cargarTodasLasLigas,
        cargarLigasPorDeporte,
        cargarEquiposPorLiga,
        buscarEquipos,

        // ===== FUNCIONES DE DETALLES =====
        obtenerDetallesDeporte,
        obtenerDetallesLiga,

        // ===== FUNCIONES DE FILTROS =====
        seleccionarDeporte,
        seleccionarLiga,
        limpiarFiltros,

        // ===== FUNCIONES DE LIMPIEZA =====
        limpiarDeportes,
        limpiarLigas,
        limpiarEquipos,
        limpiarTodo,
        resetearEstado,

        // ===== FUNCIONES DE UTILIDAD =====
        obtenerDeportesPorNombre,
        obtenerLigasPorPais,
    };
};

export default useTheSportsDB;
