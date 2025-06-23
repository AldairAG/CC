import { useDispatch, useSelector } from 'react-redux';
import { 
    clearEvento, 
    clearEventos, 
    deportesSelector,
    setLoading,
    setError,
    clearError,
    setLiveMatches,
    setTodayMatches,
    setPopularMatches,
    setDeportes,
    setSelectedSport,
    setSportMatches
} from '../store/slices/deportesSlice';
import type { EventType } from '../types/EventType';
import { partidoService } from '../service/api/partidoService';

/**
 * Hook personalizado `useDeportes` para manejar la lógica relacionada con deportes, ligas y eventos.
 *
 * @returns {Object} Un objeto con las siguientes propiedades y funciones:
 * - `eventos`: Lista de eventos obtenidos del estado global.
 * - `findEventosLigasFamosas`: Función asíncrona para buscar eventos de ligas famosas por su ID.
 *
 * @function findEventosLigasFamosas
 * @param {string} idLiga - El identificador de la liga para buscar sus eventos.
 * @throws {Error} Si ocurre un error al intentar obtener los eventos de la liga.
 *
 * @example
 * const { eventos, findEventosLigasFamosas } = useDeportes();
 * 
 * // Buscar eventos de una liga famosa
 * await findEventosLigasFamosas('12345');
 * console.log(eventos);
 */
export const useDeportes = () => {
    const dispatch = useDispatch();    const ligas = useSelector(deportesSelector.ligas);
    const deportes = useSelector(deportesSelector.deportes);
    const eventos = useSelector(deportesSelector.eventos);
    const evento = useSelector(deportesSelector.evento);
    const liveMatches = useSelector(deportesSelector.liveMatches);
    const todayMatches = useSelector(deportesSelector.todayMatches);
    const popularMatches = useSelector(deportesSelector.popularMatches);
    const selectedSport = useSelector(deportesSelector.selectedSport);
    const sportMatches = useSelector(deportesSelector.sportMatches);
    const isLoading = useSelector(deportesSelector.isLoading);
    const error = useSelector(deportesSelector.error);
    

    const setEventos = (data: EventType[]) => {        
        dispatch({ type: 'deportes/setEventos', payload: data });
    };

    const setEvento = (data: EventType) => {
        dispatch({ type: 'deportes/setEvento', payload: data });
    };

    const findEventosLigasFamosas = async (idLiga:string) => {
        try {
            const result = await partidoService.fetchLigasFamosas(idLiga)
            setEventos(result.events || []);
        } catch (error) {
            console.log('Error fetching eventos:', error);
        }
    }

    const getEventosByIds = async (ids: string[]) => {        try {
            clearEventos();
            const result = await partidoService.getEventsByIdsService(ids);
            setEventos(result);
        } catch (error) {
            console.log('Error fetching eventos:', error);
        }
    };    const getEventosById = async (id: string) => {
        try {
            clearEvento();
            const result = await partidoService.getEventByIdService(id);
            setEvento(result);
        } catch (error) {
            console.log('Error fetching eventos:', error);
        }
    };    const getPopularLeagues = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const result = await partidoService.getPopularLeagues();
            dispatch(setPopularMatches(result));
        } catch (error) {
            console.log('Error fetching popular leagues:', error);
            dispatch(setError('Error al obtener ligas populares'));
        } finally {
            dispatch(setLoading(false));
        }
    };    const getTodayMatches = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const result = await partidoService.getTodayMatches();
            dispatch(setTodayMatches(result));
        } catch (error) {
            console.log('Error fetching today matches:', error);
            dispatch(setError('Error al obtener partidos de hoy'));
        } finally {
            dispatch(setLoading(false));
        }
    };    const getLiveMatches = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const result = await partidoService.getLiveMatches();
            dispatch(setLiveMatches(result));
        } catch (error) {
            console.log('Error fetching live matches:', error);
            dispatch(setError('Error al obtener partidos en vivo'));
        } finally {
            dispatch(setLoading(false));
        }
    };    const getAvailableSports = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const result = await partidoService.getAllSports();
            dispatch(setDeportes(result));
        } catch (error) {
            console.log('Error fetching sports:', error);
            dispatch(setError('Error al obtener deportes disponibles'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getLeaguesBySport = async (sportName: string) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const result = await partidoService.getLeaguesBySport(sportName);
            return result;
        } catch (error) {
            console.log('Error fetching leagues by sport:', error);
            dispatch(setError('Error al obtener ligas del deporte'));
            return [];
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getSportMatches = async (sportName: string) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            dispatch(setSelectedSport(sportName));
            
            // Obtenemos las ligas del deporte
            const leagues = await partidoService.getLeaguesBySport(sportName);
              // Obtenemos los eventos de las primeras ligas (limitamos para no sobrecargar)
            const leagueIds = leagues.slice(0, 5).map((league: { idLeague: string }) => league.idLeague);
            const matchPromises = leagueIds.map((id: string) => partidoService.getEventsByLeague(id));
            
            const matchResults = await Promise.all(matchPromises);
            const allMatches = matchResults.flat();
            
            // Filtramos eventos futuros y ordenamos por fecha
            const futureMatches = allMatches.filter((match: EventType) => {
                const matchDate = new Date(match.dateEvent + ' ' + match.strTime);
                return matchDate >= new Date();
            }).sort((a: EventType, b: EventType) => {
                const dateA = new Date(a.dateEvent + ' ' + a.strTime);
                const dateB = new Date(b.dateEvent + ' ' + b.strTime);
                return dateA.getTime() - dateB.getTime();
            });

            dispatch(setSportMatches(futureMatches));
        } catch (error) {
            console.log('Error fetching sport matches:', error);
            dispatch(setError('Error al obtener partidos del deporte'));
        } finally {
            dispatch(setLoading(false));
        }
    };    return {
        eventos,
        ligas,
        deportes,
        evento,
        liveMatches,
        todayMatches,
        popularMatches,
        selectedSport,
        sportMatches,
        isLoading,
        error,
        findEventosLigasFamosas,
        getEventosByIds,
        getEventosById,
        getPopularLeagues,
        getTodayMatches,
        getLiveMatches,
        getAvailableSports,
        getLeaguesBySport,
        getSportMatches,
    }
}