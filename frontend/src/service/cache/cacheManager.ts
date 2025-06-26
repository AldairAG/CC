/**
 * Servicio de gestión de cache para la aplicación
 * 
 * Proporciona una interfaz centralizada para manejar el cache
 * de la aplicación con métodos específicos para diferentes tipos de datos.
 */

import { cacheService } from './cacheService';
import { apiCacheService } from './apiCacheService';
import { partidoService } from '../api/partidoService';

interface CacheStats {
  local: {
    total: number;
    expired: number;
    size: number;
  };
  session: {
    total: number;
    expired: number;
    size: number;
  };
}

interface CacheEntry {
  key: string;
  size: number;
  ttl: number;
  age: number;
  storage: 'local' | 'session';
}

class CacheManagerService {
  /**
   * Obtener estadísticas completas del cache
   */
  getFullStats(): CacheStats {
    return cacheService.stats();
  }

  /**
   * Obtener estadísticas específicas de la API
   */
  getApiStats() {
    return apiCacheService.getApiCacheStats();
  }

  /**
   * Listar todas las entradas del cache
   */
  listCacheEntries(): CacheEntry[] {
    const entries: CacheEntry[] = [];
    
    // Procesar localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('sportsbet_cache_')) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            const age = Math.floor((Date.now() - parsed.timestamp) / 1000);
            entries.push({
              key: key.replace('sportsbet_cache_', ''),
              size: item.length,
              ttl: parsed.ttl,
              age,
              storage: 'local'
            });
          } catch (error) {
            console.warn('Error parsing cache entry:', key, error);
          }
        }
      }
    }

    // Procesar sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('sportsbet_cache_')) {
        const item = sessionStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            const age = Math.floor((Date.now() - parsed.timestamp) / 1000);
            entries.push({
              key: key.replace('sportsbet_cache_', ''),
              size: item.length,
              ttl: parsed.ttl,
              age,
              storage: 'session'
            });
          } catch (error) {
            console.warn('Error parsing cache entry:', key, error);
          }
        }
      }
    }

    return entries.sort((a, b) => b.age - a.age);
  }

  /**
   * Invalidar cache por categoría
   */
  invalidateByCategory(category: 'sports' | 'matches' | 'leagues' | 'teams' | 'all'): number {
    let invalidatedCount = 0;

    switch (category) {
      case 'sports':
        invalidatedCount += partidoService.invalidateCache('/all_sports.php');
        invalidatedCount += partidoService.invalidateCache('/search_all_leagues.php');
        break;
      
      case 'matches':
        invalidatedCount += partidoService.invalidateCache('/eventsday.php');
        invalidatedCount += partidoService.invalidateCache('/livescore.php');
        invalidatedCount += partidoService.invalidateCache('/eventsnextleague.php');
        invalidatedCount += partidoService.invalidateCache('/eventsnext.php');
        invalidatedCount += partidoService.invalidateCache('/eventsseason.php');
        break;
      
      case 'leagues':
        invalidatedCount += partidoService.invalidateCache('/all_leagues.php');
        invalidatedCount += partidoService.invalidateCache('/eventsnextleague.php');
        break;
      
      case 'teams':
        invalidatedCount += partidoService.invalidateCache('/searchteams.php');
        invalidatedCount += partidoService.invalidateCache('/lookup_all_teams.php');
        break;
      
      case 'all':
        invalidatedCount = partidoService.clearAllCache();
        break;
    }

    return invalidatedCount;
  }

  /**
   * Limpiar cache expirado
   */
  cleanExpiredCache(): number {
    return cacheService.cleanExpired();
  }

  /**
   * Obtener tamaño del cache en MB
   */
  getCacheSizeInMB(): number {
    let totalSize = 0;
    
    // Calcular tamaño de localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('sportsbet_cache_')) {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      }
    }

    // Calcular tamaño de sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('sportsbet_cache_')) {
        const item = sessionStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      }
    }

    // Convertir a MB (aproximado, asumiendo UTF-16)
    return Math.round((totalSize * 2) / 1024 / 1024 * 100) / 100;
  }

  /**
   * Verificar si el cache está cerca del límite
   */
  isCacheNearLimit(): boolean {
    const sizeInMB = this.getCacheSizeInMB();
    // Consideramos que está cerca del límite si supera los 8MB
    // (localStorage tiene un límite típico de 10MB)
    return sizeInMB > 8;
  }

  /**
   * Obtener recomendaciones de limpieza
   */
  getCleanupRecommendations(): {
    shouldClean: boolean;
    reasons: string[];
    actions: string[];
  } {
    const sizeInMB = this.getCacheSizeInMB();
    const entries = this.listCacheEntries();
    const expiredEntries = entries.filter(entry => entry.age > entry.ttl);
    
    const reasons: string[] = [];
    const actions: string[] = [];
    let shouldClean = false;

    if (sizeInMB > 8) {
      shouldClean = true;
      reasons.push(`El cache ocupa ${sizeInMB}MB (cerca del límite)`);
      actions.push('Limpiar entradas más antiguas');
    }

    if (expiredEntries.length > 10) {
      shouldClean = true;
      reasons.push(`${expiredEntries.length} entradas expiradas`);
      actions.push('Limpiar entradas expiradas');
    }

    if (entries.length > 100) {
      shouldClean = true;
      reasons.push(`${entries.length} entradas en total`);
      actions.push('Limpiar cache por categorías');
    }

    if (!shouldClean) {
      reasons.push('El cache está en buen estado');
      actions.push('No se requiere acción por ahora');
    }

    return {
      shouldClean,
      reasons,
      actions
    };
  }

  /**
   * Realizar limpieza automática inteligente
   */
  performSmartCleanup(): {
    entriesRemoved: number;
    spaceSaved: string;
    actions: string[];
  } {
    const initialSize = this.getCacheSizeInMB();
    const actions: string[] = [];
    let entriesRemoved = 0;

    // 1. Limpiar entradas expiradas
    const expiredCleaned = this.cleanExpiredCache();
    if (expiredCleaned > 0) {
      entriesRemoved += expiredCleaned;
      actions.push(`Limpiadas ${expiredCleaned} entradas expiradas`);
    }

    // 2. Si aún está cerca del límite, limpiar cache de partidos en vivo (más volátil)
    if (this.isCacheNearLimit()) {
      const liveMatchesCleaned = this.invalidateByCategory('matches');
      if (liveMatchesCleaned > 0) {
        entriesRemoved += liveMatchesCleaned;
        actions.push(`Limpiadas ${liveMatchesCleaned} entradas de partidos`);
      }
    }

    const finalSize = this.getCacheSizeInMB();
    const spaceSaved = `${Math.round((initialSize - finalSize) * 100) / 100}MB`;

    return {
      entriesRemoved,
      spaceSaved,
      actions
    };
  }

  /**
   * Configurar cache automático
   */
  configureAutoCleanup(enable: boolean = true) {
    if (enable) {
      // Limpiar cache expirado cada 10 minutos
      setInterval(() => {
        const cleaned = this.cleanExpiredCache();
        if (cleaned > 0) {
          console.log(`🧹 Auto-cleanup: ${cleaned} expired cache entries removed`);
        }
      }, 10 * 60 * 1000);

      // Verificar límites cada 30 minutos
      setInterval(() => {
        const recommendations = this.getCleanupRecommendations();
        if (recommendations.shouldClean) {
          console.log('🚨 Cache recommendations:', recommendations);
          
          // Realizar limpieza automática si es crítico
          if (this.getCacheSizeInMB() > 9) {
            const result = this.performSmartCleanup();
            console.log('🤖 Auto-cleanup performed:', result);
          }
        }
      }, 30 * 60 * 1000);

      console.log('✅ Cache auto-cleanup configured');
    }
  }
}

// Instancia singleton
export const cacheManager = new CacheManagerService();
export default cacheManager;
