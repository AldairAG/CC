/**
 * Servicio de Cache para el Frontend
 * 
 * Simula el comportamiento de Redis usando localStorage/sessionStorage
 * con funcionalidades de TTL (Time To Live) y compresión opcional.
 */

interface CacheItem<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number; // en segundos
  compressed?: boolean;
}

interface CacheOptions {
  ttl?: number; // tiempo de vida en segundos (default: 300 = 5 minutos)
  storage?: 'local' | 'session'; // tipo de storage (default: 'local')
  compress?: boolean; // comprimir datos grandes (default: false)
}

class CacheService {
  private defaultTTL = 300; // 5 minutos por defecto
  private prefix = 'sportsbet_cache_';
  
  constructor() {
    // Limpiar cache expirado al inicializar
    this.cleanExpired();
  }

  /**
   * Obtener el storage apropiado
   */
  private getStorage(storageType: 'local' | 'session' = 'local'): Storage {
    return storageType === 'session' ? sessionStorage : localStorage;
  }

  /**
   * Generar clave única para el cache
   */
  private getCacheKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Comprimir string (simulación simple)
   */
  private compress(data: string): string {
    // En un caso real, podrías usar una librería como pako para compresión gzip
    return btoa(data);
  }

  /**
   * Descomprimir string
   */
  private decompress(data: string): string {
    return atob(data);
  }

  /**
   * Verificar si un item del cache ha expirado
   */
  private isExpired(item: CacheItem): boolean {
    const now = Date.now();
    const expiry = item.timestamp + (item.ttl * 1000);
    return now > expiry;
  }

  /**
   * Guardar datos en cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): boolean {
    try {
      const {
        ttl = this.defaultTTL,
        storage = 'local',
        compress = false
      } = options;

      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        compressed: compress
      };

      let serializedData = JSON.stringify(cacheItem);
        if (compress && serializedData.length > 1024) { // Solo comprimir si es > 1KB
        serializedData = this.compress(serializedData);
        cacheItem.compressed = true;
        serializedData = JSON.stringify(cacheItem);
      }

      const storageInstance = this.getStorage(storage);
      const cacheKey = this.getCacheKey(key);
      
      storageInstance.setItem(cacheKey, serializedData);
      
      //console.log(`📦 Cache SET: ${key} (TTL: ${ttl}s, Size: ${serializedData.length} bytes)`);
      return true;
    } catch (error) {
      console.error('❌ Error setting cache:', error);
      return false;
    }
  }

  /**
   * Obtener datos del cache
   */
  get<T>(key: string, storageType: 'local' | 'session' = 'local'): T | null {
    try {
      const storageInstance = this.getStorage(storageType);
      const cacheKey = this.getCacheKey(key);
      const cached = storageInstance.getItem(cacheKey);

      if (!cached) {
        console.log(`🔍 Cache MISS: ${key}`);
        return null;
      }

      let cacheItem: CacheItem<T>;
      
      try {
        cacheItem = JSON.parse(cached);
      } catch {
        // Si no se puede parsear, eliminar y retornar null
        this.delete(key, storageType);
        return null;
      }

      // Verificar si ha expirado
      if (this.isExpired(cacheItem)) {
        console.log(`⏰ Cache EXPIRED: ${key}`);
        this.delete(key, storageType);
        return null;
      }

      //console.log(`✅ Cache HIT: ${key}`);
      return cacheItem.data;
    } catch (error) {
      console.error('❌ Error getting cache:', error);
      return null;
    }
  }

  /**
   * Eliminar entrada del cache
   */
  delete(key: string, storageType: 'local' | 'session' = 'local'): boolean {
    try {
      const storageInstance = this.getStorage(storageType);
      const cacheKey = this.getCacheKey(key);
      storageInstance.removeItem(cacheKey);
      console.log(`🗑️ Cache DELETE: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting cache:', error);
      return false;
    }
  }

  /**
   * Verificar si existe una clave en cache (sin obtener el valor)
   */
  exists(key: string, storageType: 'local' | 'session' = 'local'): boolean {
    const storageInstance = this.getStorage(storageType);
    const cacheKey = this.getCacheKey(key);
    const cached = storageInstance.getItem(cacheKey);
    
    if (!cached) return false;

    try {
      const cacheItem: CacheItem = JSON.parse(cached);
      return !this.isExpired(cacheItem);
    } catch {
      return false;
    }
  }

  /**
   * Obtener TTL restante de una clave (en segundos)
   */
  ttl(key: string, storageType: 'local' | 'session' = 'local'): number {
    const storageInstance = this.getStorage(storageType);
    const cacheKey = this.getCacheKey(key);
    const cached = storageInstance.getItem(cacheKey);
    
    if (!cached) return -2; // Clave no existe

    try {
      const cacheItem: CacheItem = JSON.parse(cached);
      
      if (this.isExpired(cacheItem)) {
        return -2; // Clave expirada
      }

      const now = Date.now();
      const expiry = cacheItem.timestamp + (cacheItem.ttl * 1000);
      return Math.floor((expiry - now) / 1000);
    } catch {
      return -2;
    }
  }

  /**
   * Limpiar todas las entradas expiradas
   */
  cleanExpired(): number {
    let cleanedCount = 0;
    
    const cleanStorage = (storage: Storage) => {
      const keys = Object.keys(storage);
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      
      cacheKeys.forEach(cacheKey => {
        try {
          const cached = storage.getItem(cacheKey);
          if (cached) {
            const cacheItem: CacheItem = JSON.parse(cached);
            if (this.isExpired(cacheItem)) {
              storage.removeItem(cacheKey);
              cleanedCount++;
            }
          }
        } catch {
          // Si hay error al parsear, eliminar la entrada corrupta
          storage.removeItem(cacheKey);
          cleanedCount++;
        }
      });
    };

    cleanStorage(localStorage);
    cleanStorage(sessionStorage);

    if (cleanedCount > 0) {
      console.log(`🧹 Cache cleanup: ${cleanedCount} expired entries removed`);
    }

    return cleanedCount;
  }

  /**
   * Limpiar todo el cache
   */
  clear(storageType?: 'local' | 'session'): number {
    let clearedCount = 0;
    
    const clearStorage = (storage: Storage) => {
      const keys = Object.keys(storage);
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      
      cacheKeys.forEach(cacheKey => {
        storage.removeItem(cacheKey);
        clearedCount++;
      });
    };

    if (storageType) {
      clearStorage(this.getStorage(storageType));
    } else {
      clearStorage(localStorage);
      clearStorage(sessionStorage);
    }

    console.log(`🗑️ Cache cleared: ${clearedCount} entries removed`);
    return clearedCount;
  }

  /**
   * Obtener estadísticas del cache
   */
  stats(): {
    local: { total: number; expired: number; size: number };
    session: { total: number; expired: number; size: number };
  } {
    const getStorageStats = (storage: Storage) => {
      const keys = Object.keys(storage);
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      
      let total = 0;
      let expired = 0;
      let size = 0;
      
      cacheKeys.forEach(cacheKey => {
        try {
          const cached = storage.getItem(cacheKey);
          if (cached) {
            total++;
            size += cached.length;
            
            const cacheItem: CacheItem = JSON.parse(cached);
            if (this.isExpired(cacheItem)) {
              expired++;
            }
          }
        } catch {
          total++;
        }
      });
      
      return { total, expired, size };
    };

    return {
      local: getStorageStats(localStorage),
      session: getStorageStats(sessionStorage)
    };
  }

  /**
   * Memoización con cache automático
   */
  async memoize<T>(
    key: string, 
    fn: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    // Intentar obtener del cache primero
    const cached = this.get<T>(key, options.storage);
    if (cached !== null) {
      return cached;
    }

    // Si no existe en cache, ejecutar función y guardar resultado
    try {
      const result = await fn();
      this.set(key, result, options);
      return result;
    } catch (error) {
      console.error(`❌ Error in memoized function for key ${key}:`, error);
      throw error;
    }
  }
}

// Instancia singleton del servicio de cache
export const cacheService = new CacheService();

// Limpiar cache expirado cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheService.cleanExpired();
  }, 5 * 60 * 1000); // 5 minutos
}

export default cacheService;
