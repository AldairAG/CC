/**
 * Hook personalizado para manejar el cache de la aplicación
 * 
 * Proporciona métodos para gestionar el cache y obtener estadísticas
 * de manera reactiva desde los componentes de React.
 */

import { useState, useEffect, useCallback } from 'react';
import { cacheManager } from '../service/cache/cacheManager';

interface CacheHookReturn {
  stats: {
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
  } | null;
  isLoading: boolean;
  error: string | null;
  sizeInMB: number;
  isNearLimit: boolean;
  entries: Array<{
    key: string;
    size: number;
    ttl: number;
    age: number;
    storage: 'local' | 'session';
  }>;
  recommendations: {
    shouldClean: boolean;
    reasons: string[];
    actions: string[];
  } | null;
  
  // Métodos
  refreshStats: () => Promise<void>;
  invalidateByCategory: (category: 'sports' | 'matches' | 'leagues' | 'teams' | 'all') => Promise<number>;
  cleanExpired: () => Promise<number>;
  performSmartCleanup: () => Promise<{
    entriesRemoved: number;
    spaceSaved: string;
    actions: string[];
  }>;
  clearAllCache: () => Promise<number>;
}

export const useCache = (): CacheHookReturn => {
  const [stats, setStats] = useState<CacheHookReturn['stats']>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sizeInMB, setSizeInMB] = useState(0);
  const [isNearLimit, setIsNearLimit] = useState(false);
  const [entries, setEntries] = useState<CacheHookReturn['entries']>([]);
  const [recommendations, setRecommendations] = useState<CacheHookReturn['recommendations']>(null);

  const refreshStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Obtener estadísticas
      const currentStats = cacheManager.getFullStats();
      setStats(currentStats);
      
      // Obtener tamaño
      const size = cacheManager.getCacheSizeInMB();
      setSizeInMB(size);
      
      // Verificar límite
      const nearLimit = cacheManager.isCacheNearLimit();
      setIsNearLimit(nearLimit);
      
      // Obtener entradas
      const cacheEntries = cacheManager.listCacheEntries();
      setEntries(cacheEntries);
      
      // Obtener recomendaciones
      const currentRecommendations = cacheManager.getCleanupRecommendations();
      setRecommendations(currentRecommendations);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener estadísticas del cache');
      console.error('Error refreshing cache stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const invalidateByCategory = useCallback(async (category: 'sports' | 'matches' | 'leagues' | 'teams' | 'all') => {
    try {
      setError(null);
      const result = cacheManager.invalidateByCategory(category);
      await refreshStats(); // Actualizar estadísticas después de invalidar
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al invalidar cache';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshStats]);

  const cleanExpired = useCallback(async () => {
    try {
      setError(null);
      const result = cacheManager.cleanExpiredCache();
      await refreshStats(); // Actualizar estadísticas después de limpiar
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al limpiar cache expirado';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshStats]);

  const performSmartCleanup = useCallback(async () => {
    try {
      setError(null);
      const result = cacheManager.performSmartCleanup();
      await refreshStats(); // Actualizar estadísticas después de la limpieza
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al realizar limpieza inteligente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshStats]);

  const clearAllCache = useCallback(async () => {
    try {
      setError(null);
      const result = cacheManager.invalidateByCategory('all');
      await refreshStats(); // Actualizar estadísticas después de limpiar todo
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al limpiar todo el cache';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshStats]);

  // Cargar estadísticas iniciales
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, [refreshStats]);

  return {
    stats,
    isLoading,
    error,
    sizeInMB,
    isNearLimit,
    entries,
    recommendations,
    refreshStats,
    invalidateByCategory,
    cleanExpired,
    performSmartCleanup,
    clearAllCache,
  };
};
