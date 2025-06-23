// sportsService.js
import apiClient from './apiClient';
import type { EventType } from '../../types/EventType';

// Método existente
const getNext7DaysMatches = async () => {
    try {
        const response = await apiClient.get('/all_leagues.php');
        return response.data;
    } catch (error) {
        console.error('Error fetching next 7 days matches:', error);
        throw error;
    }
};

// Método existente
const fetchLigasFamosas = async (idLiga: string) => {
    try {
        const response = await apiClient.get(`/eventsnextleague.php?id=${idLiga}`);

        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const matchesInNext7Days = (response?.data?.events || []).filter((event: EventType) => {
            const eventDate = new Date(event.dateEvent);
            return eventDate >= today && eventDate <= nextWeek;
        });

        return matchesInNext7Days;
    } catch (error) {
        console.error('Error fetching next 7 days matches:', error);
        throw error;
    }
};

// Método existente
const getEventsByIdsService = async (ids: string[]) => {
    try {
        const requests = ids.map(id =>
            apiClient.get(`/lookupevent.php?id=${id}`)
        );

        const responses = await Promise.all(requests);
        const events = responses.map(res => res.data.events?.[0] || null);
        return events;
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        return [];
    }
};

// Método existente
const getEventByIdService = async (id: string) => {
    try {
        const response = await apiClient.get(`/lookupevent.php?id=${id}`);
        return response?.data || null;
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        return null;
    }
};

// Método existente
const getPopularLeagues = async () => {
    try {
        const popularLeagueIds = ['4328', '4335', '4480', '4346', '4331'];
        
        const leagueRequests = popularLeagueIds.map(id =>
            apiClient.get(`/eventsnextleague.php?id=${id}`)
        );

        const responses = await Promise.all(leagueRequests);
        
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const allEvents = responses.flatMap(res => res.data?.events || []);
        const upcomingEvents = allEvents.filter((event: EventType) => {
            const eventDate = new Date(event.dateEvent);
            return eventDate >= today && eventDate <= nextWeek;
        });

        return upcomingEvents;
    } catch (error) {
        console.error('Error fetching popular leagues:', error);
        return [];
    }
};

// Método existente
const getTodayMatches = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await apiClient.get(`/eventsday.php?d=${today}`);
        return response.data?.events || [];
    } catch (error) {
        console.error('Error fetching today matches:', error);
        return [];
    }
};

// Método existente
const getLiveMatches = async () => {
    try {
        const todayMatches = await getTodayMatches();
        const now = new Date();
        
        return todayMatches.filter((match: EventType) => {
            if (!match.strTime) return false;
            const matchTime = new Date(`${match.dateEvent}T${match.strTime}`);
            return matchTime <= now;
        });
    } catch (error) {
        console.error('Error fetching live matches:', error);
        return [];
    }
};

// NUEVOS MÉTODOS SOLICITADOS

// 1. Lista todos los deportes
const getAllSports = async () => {
    try {
        const response = await apiClient.get('/all_sports.php');
        return response.data?.sports || [];
    } catch (error) {
        console.error('Error fetching all sports:', error);
        return [];
    }
};

// 2. Busca equipos por deporte
const getTeamsBySport = async (sportName: string) => {
    try {
        // Primero obtenemos las ligas del deporte
        const leaguesResponse = await apiClient.get(`/search_all_leagues.php?s=${encodeURIComponent(sportName)}`);
        const leagues = leaguesResponse.data?.countrys || [];
        
        if (leagues.length === 0) {
            return [];
        }

        // Obtenemos equipos de las primeras 5 ligas para no sobrecargar
        const topLeagues = leagues.slice(0, 5);
        const teamRequests = topLeagues.map((league: any) =>
            apiClient.get(`/lookup_all_teams.php?id=${league.idLeague}`)
        );

        const teamResponses = await Promise.all(teamRequests);
        const allTeams = teamResponses.flatMap(res => res.data?.teams || []);
        
        return allTeams;
    } catch (error) {
        console.error('Error fetching teams by sport:', error);
        return [];
    }
};

// 3. Buscar equipos por nombre
const searchTeamsByName = async (teamName: string) => {
    try {
        const response = await apiClient.get(`/searchteams.php?t=${encodeURIComponent(teamName)}`);
        return response.data?.teams || [];
    } catch (error) {
        console.error('Error searching teams by name:', error);
        return [];
    }
};

// 4. Obtener ligas por deporte
const getLeaguesBySport = async (sportName: string) => {
    try {
        const response = await apiClient.get(`/search_all_leagues.php?s=${encodeURIComponent(sportName)}`);
        return response.data?.countrys || [];
    } catch (error) {
        console.error('Error fetching leagues by sport:', error);
        return [];
    }
};

// 5. Últimos resultados (partidos pasados)
const getLatestResults = async (limit: number = 50) => {
    try {
        // Obtenemos partidos de los últimos 7 días
        const pastDays = [];
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            pastDays.push(date.toISOString().split('T')[0]);
        }

        const requests = pastDays.map(date =>
            apiClient.get(`/eventsday.php?d=${date}`)
        );

        const responses = await Promise.all(requests);
        const allEvents = responses.flatMap(res => res.data?.events || []);
        
        // Filtramos solo eventos finalizados y ordenamos por fecha descendente
        const finishedEvents = allEvents
            .filter((event: EventType) => event.strStatus === 'Match Finished')
            .sort((a: EventType, b: EventType) => {
                const dateA = new Date(`${a.dateEvent}T${a.strTime || '00:00'}`);
                const dateB = new Date(`${b.dateEvent}T${b.strTime || '00:00'}`);
                return dateB.getTime() - dateA.getTime();
            })
            .slice(0, limit);

        return finishedEvents;
    } catch (error) {
        console.error('Error fetching latest results:', error);
        return [];
    }
};

// 6. Partidos por fecha específica
const getMatchesByDate = async (date: string) => {
    try {
        const response = await apiClient.get(`/eventsday.php?d=${date}`);
        return response.data?.events || [];
    } catch (error) {
        console.error('Error fetching matches by date:', error);
        return [];
    }
};

// 7. Partidos de la próxima semana
const getNextWeekMatches = async () => {
    try {
        const nextDays = [];
        for (let i = 0; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            nextDays.push(date.toISOString().split('T')[0]);
        }

        const requests = nextDays.map(date =>
            apiClient.get(`/eventsday.php?d=${date}`)
        );

        const responses = await Promise.all(requests);
        const allEvents = responses.flatMap(res => res.data?.events || []);
        
        // Ordenamos por fecha
        return allEvents.sort((a: EventType, b: EventType) => {
            const dateA = new Date(`${a.dateEvent}T${a.strTime || '00:00'}`);
            const dateB = new Date(`${b.dateEvent}T${b.strTime || '00:00'}`);
            return dateA.getTime() - dateB.getTime();
        });
    } catch (error) {
        console.error('Error fetching next week matches:', error);
        return [];
    }
};

// 8. Obtener eventos por liga
const getEventsByLeague = async (leagueId: string, season?: string) => {
    try {
        let url = `/eventsnextleague.php?id=${leagueId}`;
        if (season) {
            url = `/eventsseason.php?id=${leagueId}&s=${season}`;
        }
        
        const response = await apiClient.get(url);
        return response.data?.events || [];
    } catch (error) {
        console.error('Error fetching events by league:', error);
        return [];
    }
};

// 9. Buscar eventos por equipo
const getEventsByTeam = async (teamId: string, season?: string) => {
    try {
        let url = `/eventsnext.php?id=${teamId}`;
        if (season) {
            url = `/eventsseason.php?id=${teamId}&s=${season}`;
        }
        
        const response = await apiClient.get(url);
        return response.data?.events || [];
    } catch (error) {
        console.error('Error fetching events by team:', error);
        return [];
    }
};

export const partidoService = {
    // Métodos existentes
    getNext7DaysMatches,
    fetchLigasFamosas,
    getEventsByIdsService,
    getEventByIdService,
    getPopularLeagues,
    getTodayMatches,
    getLiveMatches,
    
    // Nuevos métodos solicitados
    getAllSports,
    getTeamsBySport,
    searchTeamsByName,
    getLeaguesBySport,
    getLatestResults,
    getMatchesByDate,
    getNextWeekMatches,
    getEventsByLeague,
    getEventsByTeam,
};