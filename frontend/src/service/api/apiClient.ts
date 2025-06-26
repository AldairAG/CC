// apiClient.ts
import axios from 'axios';
import { apiCacheService } from '../cache/apiCacheService';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/722804';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar el cache automático para las peticiones API
apiCacheService.setupInterceptors(apiClient, {
  enabled: true,
  ttl: 300, // 5 minutos por defecto
  storage: 'local',
  patterns: [
    /\/all_leagues\.php/,
    /\/eventsnextleague\.php/,
    /\/lookupevent\.php/,
    /\/eventsday\.php/,
    /\/livescore\.php/,
    /\/all_sports\.php/,
    /\/search_all_leagues\.php/,
    /\/searchteams\.php/,
    /\/lookup_all_teams\.php/,
    /\/eventsnext\.php/,
    /\/eventsseason\.php/
  ],
  endpoints: {
    // Configuraciones específicas por endpoint
    '/all_leagues.php': { ttl: 3600 }, // 1 hora para ligas
    '/all_sports.php': { ttl: 86400 }, // 24 horas para deportes
    '/livescore.php': { ttl: 30 }, // 30 segundos para partidos en vivo
    '/eventsday.php': { ttl: 600 }, // 10 minutos para eventos del día
    '/eventsnextleague.php': { ttl: 1800 }, // 30 minutos para eventos de liga
    '/lookupevent.php': { ttl: 900 }, // 15 minutos para evento específico
    '/searchteams.php': { ttl: 1800 }, // 30 minutos para búsqueda de equipos
    '/lookup_all_teams.php': { ttl: 3600 }, // 1 hora para equipos de liga
    '/search_all_leagues.php': { ttl: 3600 }, // 1 hora para búsqueda de ligas
    '/eventsnext.php': { ttl: 900 }, // 15 minutos para próximos eventos
    '/eventsseason.php': { ttl: 1800 }, // 30 minutos para eventos de temporada
  }
});

export default apiClient;