/**
 * Wrapper de servicios API con cache automático
 * 
 * Intercepta las llamadas a la API y maneja el cache automáticamente
 * basado en las rutas y parámetros de las peticiones.
 */

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { cacheService } from './cacheService';

interface CacheConfig {
  ttl?: number; // tiempo de vida en segundos
  enabled?: boolean; // habilitar/deshabilitar cache para esta petición
  key?: string; // clave personalizada para el cache
  storage?: 'local' | 'session';
  methods?: string[]; // métodos HTTP que se deben cachear (default: ['GET'])
}

interface ApiCacheConfig extends CacheConfig {
  // Patrones de URL que se deben cachear
  patterns?: RegExp[];
  // Configuraciones específicas por endpoint
  endpoints?: Record<string, CacheConfig>;
}

class ApiCacheService {
  private defaultConfig: Required<ApiCacheConfig> = {
    ttl: 300, // 5 minutos por defecto
    enabled: true,
    key: '',
    storage: 'local',
    methods: ['GET'],
    patterns: [
      /\/all_leagues\.php/,
      /\/eventsnextleague\.php/,
      /\/lookupevent\.php/,
      /\/eventsday\.php/,
      /\/livescore\.php/,
      /\/all_sports\.php/,
      /\/search_all_leagues\.php/
    ],
    endpoints: {
      // Configuraciones específicas para diferentes endpoints
      '/all_leagues.php': { ttl: 3600 }, // 1 hora para ligas
      '/all_sports.php': { ttl: 86400 }, // 24 horas para deportes
      '/livescore.php': { ttl: 30 }, // 30 segundos para partidos en vivo
      '/eventsday.php': { ttl: 1800 }, // 30 minutos para eventos del día
    }
  };

  /**
   * Configurar el interceptor de cache para una instancia de Axios
   */
  setupInterceptors(axiosInstance: AxiosInstance, config: Partial<ApiCacheConfig> = {}) {
    const mergedConfig = { ...this.defaultConfig, ...config };

    // Interceptor de request - verificar cache antes de hacer la petición
    axiosInstance.interceptors.request.use(
      (requestConfig) => {
        const cacheConfig = this.getCacheConfig(requestConfig, mergedConfig);
        
        if (this.shouldCache(requestConfig, cacheConfig)) {
          const cacheKey = this.generateCacheKey(requestConfig, cacheConfig);
          const cached = cacheService.get(cacheKey, cacheConfig.storage);
          
          if (cached) {
            // Retornar datos desde cache usando un adaptador especial
            return Promise.reject({
              isCache: true,
              data: cached,
              status: 200,
              statusText: 'OK (from cache)',
              headers: {},
              config: requestConfig
            });
          }
        }

        return requestConfig;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de response - guardar en cache después de la petición
    axiosInstance.interceptors.response.use(
      (response) => {
        const cacheConfig = this.getCacheConfig(response.config, mergedConfig);
        
        if (this.shouldCache(response.config, cacheConfig)) {
          const cacheKey = this.generateCacheKey(response.config, cacheConfig);
          cacheService.set(cacheKey, response.data, {
            ttl: cacheConfig.ttl,
            storage: cacheConfig.storage
          });
        }

        return response;
      },
      (error) => {
        // Manejar respuestas desde cache
        if (error.isCache) {
          return Promise.resolve({
            data: error.data,
            status: error.status,
            statusText: error.statusText,
            headers: error.headers,
            config: error.config
          } as AxiosResponse);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Determinar si una petición debe ser cacheada
   */
  private shouldCache(config: AxiosRequestConfig, cacheConfig: CacheConfig): boolean {
    if (!cacheConfig.enabled) return false;
    
    const method = (config.method || 'GET').toUpperCase();
    if (!cacheConfig.methods?.includes(method)) return false;

    // Verificar patrones de URL si están definidos
    if (this.defaultConfig.patterns.length > 0) {
      const url = config.url || '';
      return this.defaultConfig.patterns.some(pattern => pattern.test(url));
    }

    return true;
  }

  /**
   * Obtener configuración de cache para una petición específica
   */
  private getCacheConfig(config: AxiosRequestConfig, globalConfig: ApiCacheConfig): CacheConfig {
    const url = config.url || '';
    
    // Buscar configuración específica para el endpoint
    const endpointConfig = Object.entries(globalConfig.endpoints || {})
      .find(([endpoint]) => url.includes(endpoint))?.[1];

    return {
      ttl: endpointConfig?.ttl || globalConfig.ttl,
      enabled: endpointConfig?.enabled ?? globalConfig.enabled,
      storage: endpointConfig?.storage || globalConfig.storage,
      methods: endpointConfig?.methods || globalConfig.methods,
      key: endpointConfig?.key || globalConfig.key
    };
  }

  /**
   * Generar clave única para el cache basada en la petición
   */
  private generateCacheKey(config: AxiosRequestConfig, cacheConfig: CacheConfig): string {
    if (cacheConfig.key) {
      return cacheConfig.key;
    }

    const url = config.url || '';
    const method = config.method || 'GET';
    const params = config.params ? JSON.stringify(config.params) : '';
    
    // Crear hash simple de la URL y parámetros
    const hash = this.simpleHash(`${method}_${url}_${params}`);
    return `api_${hash}`;
  }

  /**
   * Crear hash simple de un string
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a entero de 32 bits
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Limpiar cache específico de API
   */
  clearApiCache(): number {
    let clearedCount = 0;
    const prefix = 'sportsbet_cache_api_';
    
    const clearStorage = (storage: Storage) => {
      const keys = Object.keys(storage);
      keys.forEach(key => {
        if (key.includes(prefix)) {
          storage.removeItem(key);
          clearedCount++;
        }
      });
    };

    clearStorage(localStorage);
    clearStorage(sessionStorage);

    console.log(`🗑️ API Cache cleared: ${clearedCount} entries removed`);
    return clearedCount;
  }

  /**
   * Invalidar cache para un endpoint específico
   */
  invalidateEndpoint(endpoint: string): number {
    let invalidatedCount = 0;
    
    const invalidateStorage = (storage: Storage) => {
      const keys = Object.keys(storage);
      keys.forEach(key => {
        if (key.includes('sportsbet_cache_') && key.includes(endpoint)) {
          storage.removeItem(key);
          invalidatedCount++;
        }
      });
    };

    invalidateStorage(localStorage);
    invalidateStorage(sessionStorage);

    console.log(`🔄 Cache invalidated for ${endpoint}: ${invalidatedCount} entries removed`);
    return invalidatedCount;
  }

  /**
   * Obtener estadísticas específicas del cache de API
   */
  getApiCacheStats() {
    const stats = cacheService.stats();
    console.table({
      'Local Storage': stats.local,
      'Session Storage': stats.session
    });
    return stats;
  }
}

// Instancia singleton
export const apiCacheService = new ApiCacheService();
export default apiCacheService;
