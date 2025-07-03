import axios from 'axios';
import type {
    SportType,
    LeagueType,
    TeamType,
    SportsResponse,
    LeaguesResponse,
    TeamsResponse,
    SimpleSportType,
    SimpleLeagueType,
    SimpleTeamType
} from '../../types/TheSportsDBTypes';

// TheSportsDB API Base URL (free version)
const THESPORTSDB_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// Cliente HTTP específico para TheSportsDB
const theSportsDBClient = axios.create({
    baseURL: THESPORTSDB_BASE_URL,
    timeout: 15000, // 15 segundos para APIs externas
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor para logging en desarrollo
theSportsDBClient.interceptors.request.use((config) => {
    if (import.meta.env.MODE === 'development') {
        console.log('🏈 TheSportsDB Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
});

theSportsDBClient.interceptors.response.use(
    (response) => {
        if (import.meta.env.MODE === 'development') {
            console.log('✅ TheSportsDB Response:', response.status, response.config.url);
        }
        return response;
    },
    (error) => {
        if (import.meta.env.MODE === 'development') {
            console.error('❌ TheSportsDB Error:', error.response?.status, error.config?.url, error.message);
        }
        return Promise.reject(error);
    }
);

// Funciones auxiliares para transformar datos
const transformSport = (sport: SportType): SimpleSportType => ({
    id: sport.idSport,
    name: sport.strSport,
    thumbnail: sport.strSportThumb,
});

const transformLeague = (league: LeagueType): SimpleLeagueType => ({
    id: league.idLeague,
    name: league.strLeague,
    sport: league.strSport,
    country: league.strCountry,
    logo: league.strLogo,
});

const transformTeam = (team: TeamType): SimpleTeamType => ({
    id: team.idTeam,
    name: team.strTeam,
    sport: team.strSport,
    league: team.strLeague,
    badge: team.strTeamBadge,
});

export const TheSportsDBService = {
    /**
     * Obtener todos los deportes disponibles
     * @returns Lista de deportes simplificados
     */
    getAllSports: async (): Promise<SimpleSportType[]> => {
        try {
            const response = await theSportsDBClient.get<SportsResponse>('/all_sports.php');
            
            if (!response.data?.sports) {
                throw new Error('No sports data received from API');
            }
            
            return response.data.sports.map(transformSport);
        } catch (error) {
            console.error('Error fetching sports from TheSportsDB:', error);
            throw new Error('Failed to fetch sports data');
        }
    },

    /**
     * Obtener todas las ligas disponibles
     * @returns Lista de ligas simplificadas
     */
    getAllLeagues: async (): Promise<SimpleLeagueType[]> => {
        try {
            const response = await theSportsDBClient.get<LeaguesResponse>('/all_leagues.php');
            
            if (!response.data?.leagues) {
                throw new Error('No leagues data received from API');
            }
            
            return response.data.leagues.map(transformLeague);
        } catch (error) {
            console.error('Error fetching leagues from TheSportsDB:', error);
            throw new Error('Failed to fetch leagues data');
        }
    },

    /**
     * Obtener ligas por deporte específico
     * @param sport Nombre del deporte
     * @returns Lista de ligas del deporte especificado
     */
    getLeaguesBySport: async (sport: string): Promise<SimpleLeagueType[]> => {
        try {
            const encodedSport = encodeURIComponent(sport);
            const response = await theSportsDBClient.get<LeaguesResponse>(`/search_all_leagues.php?s=${encodedSport}`);
            
            if (!response.data?.leagues) {
                // Si no hay ligas específicas, devolver array vacío
                return [];
            }
            
            return response.data.leagues.map(transformLeague);
        } catch (error) {
            console.error(`Error fetching leagues for sport ${sport} from TheSportsDB:`, error);
            throw new Error(`Failed to fetch leagues for sport: ${sport}`);
        }
    },

    /**
     * Obtener equipos por liga específica
     * @param leagueId ID de la liga
     * @returns Lista de equipos de la liga especificada
     */
    getTeamsByLeague: async (leagueId: string): Promise<SimpleTeamType[]> => {
        try {
            const response = await theSportsDBClient.get<TeamsResponse>(`/lookup_all_teams.php?id=${leagueId}`);
            
            if (!response.data?.teams) {
                // Si no hay equipos, devolver array vacío
                return [];
            }
            
            return response.data.teams.map(transformTeam);
        } catch (error) {
            console.error(`Error fetching teams for league ${leagueId} from TheSportsDB:`, error);
            throw new Error(`Failed to fetch teams for league: ${leagueId}`);
        }
    },

    /**
     * Buscar equipos por nombre
     * @param teamName Nombre del equipo a buscar
     * @returns Lista de equipos que coinciden con la búsqueda
     */
    searchTeams: async (teamName: string): Promise<SimpleTeamType[]> => {
        try {
            const encodedTeamName = encodeURIComponent(teamName);
            const response = await theSportsDBClient.get<TeamsResponse>(`/searchteams.php?t=${encodedTeamName}`);
            
            if (!response.data?.teams) {
                return [];
            }
            
            return response.data.teams.map(transformTeam);
        } catch (error) {
            console.error(`Error searching teams with name ${teamName} from TheSportsDB:`, error);
            throw new Error(`Failed to search teams: ${teamName}`);
        }
    },

    /**
     * Obtener detalles de un deporte específico
     * @param sportName Nombre del deporte
     * @returns Información detallada del deporte o null si no se encuentra
     */
    getSportDetails: async (sportName: string): Promise<SimpleSportType | null> => {
        try {
            const sports = await TheSportsDBService.getAllSports();
            return sports.find(sport => 
                sport.name.toLowerCase() === sportName.toLowerCase()
            ) || null;
        } catch (error) {
            console.error(`Error getting sport details for ${sportName}:`, error);
            throw new Error(`Failed to get sport details: ${sportName}`);
        }
    },

    /**
     * Obtener detalles de una liga específica
     * @param leagueId ID de la liga
     * @returns Información detallada de la liga o null si no se encuentra
     */
    getLeagueDetails: async (leagueId: string): Promise<SimpleLeagueType | null> => {
        try {
            const response = await theSportsDBClient.get<LeaguesResponse>(`/lookupleague.php?id=${leagueId}`);
            
            if (!response.data?.leagues || response.data.leagues.length === 0) {
                return null;
            }
            
            return transformLeague(response.data.leagues[0]);
        } catch (error) {
            console.error(`Error getting league details for ${leagueId}:`, error);
            throw new Error(`Failed to get league details: ${leagueId}`);
        }
    }
};

export default TheSportsDBService;
