/**
 * Componente de administrador de cache
 * 
 * Permite visualizar estadísticas del cache y realizar operaciones
 * de limpieza y mantenimiento.
 */

import React, { useState } from 'react';
import { useCache } from '../../hooks/useCache';

interface CacheAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

const CacheAdmin: React.FC<CacheAdminProps> = ({ isOpen, onClose }) => {
  const {
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
    clearAllCache
  } = useCache();

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = async (action: () => Promise<unknown>, actionName: string) => {
    try {
      setActionLoading(actionName);
      setActionResult(null);
        const result = await action();
      
      if (typeof result === 'number') {
        setActionResult(`✅ ${actionName}: ${result} entradas procesadas`);
      } else if (result && typeof result === 'object' && 'entriesRemoved' in result && 'spaceSaved' in result) {
        const cleanupResult = result as { entriesRemoved: number; spaceSaved: string };
        setActionResult(`✅ ${actionName}: ${cleanupResult.entriesRemoved} entradas eliminadas, ${cleanupResult.spaceSaved} liberados`);
      } else {
        setActionResult(`✅ ${actionName} completado`);
      }
    } catch (err) {
      setActionResult(`❌ Error en ${actionName}: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageIcon = (storage: 'local' | 'session') => {
    return storage === 'local' ? '💾' : '🔄';
  };

  const getAgeColor = (age: number, ttl: number) => {
    const ratio = age / ttl;
    if (ratio >= 1) return 'text-red-600'; // Expirado
    if (ratio >= 0.8) return 'text-yellow-600'; // Cerca de expirar
    return 'text-green-600'; // Fresco
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              🚀 Administrador de Cache Redis
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestiona el cache de la aplicación de manera eficiente
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Estadísticas Generales */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Tamaño Total</h3>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{sizeInMB.toFixed(2)} MB</p>
                </div>
                <div className="text-3xl">💾</div>
              </div>
              {isNearLimit && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  ⚠️ Cerca del límite
                </div>
              )}
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Local Storage</h3>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {stats?.local.total || 0}
                  </p>
                </div>
                <div className="text-3xl">💾</div>
              </div>              {(stats?.local?.expired ?? 0) > 0 && (
                <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                  {stats?.local?.expired} expiradas
                </div>
              )}
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">Session Storage</h3>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {stats?.session.total || 0}
                  </p>
                </div>
                <div className="text-3xl">🔄</div>
              </div>              {(stats?.session?.expired ?? 0) > 0 && (
                <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                  {stats?.session?.expired} expiradas
                </div>
              )}
            </div>
          </div>

          {/* Recomendaciones */}
          {recommendations && (
            <div className={`p-4 rounded-lg mb-6 ${
              recommendations.shouldClean 
                ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
                : 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                recommendations.shouldClean 
                  ? 'text-yellow-800 dark:text-yellow-200'
                  : 'text-green-800 dark:text-green-200'
              }`}>
                {recommendations.shouldClean ? '⚠️ Recomendaciones de Limpieza' : '✅ Estado del Cache'}
              </h3>
              <ul className={`space-y-1 ${
                recommendations.shouldClean 
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {recommendations.reasons.map((reason, index) => (
                  <li key={index}>• {reason}</li>
                ))}
              </ul>
              {recommendations.actions.length > 0 && (
                <div className="mt-2">
                  <strong>Acciones sugeridas:</strong>
                  <ul className="mt-1 space-y-1">
                    {recommendations.actions.map((action, index) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Botones de Acción */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => handleAction(() => refreshStats(), 'Actualizar Stats')}
              disabled={actionLoading !== null}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {actionLoading === 'Actualizar Stats' ? '⏳' : '🔄'} Actualizar
            </button>

            <button
              onClick={() => handleAction(() => cleanExpired(), 'Limpiar Expirados')}
              disabled={actionLoading !== null}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 text-sm"
            >
              {actionLoading === 'Limpiar Expirados' ? '⏳' : '🧹'} Limpiar Expirados
            </button>

            <button
              onClick={() => handleAction(() => performSmartCleanup(), 'Limpieza Inteligente')}
              disabled={actionLoading !== null}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {actionLoading === 'Limpieza Inteligente' ? '⏳' : '🤖'} Inteligente
            </button>

            <button
              onClick={() => handleAction(() => clearAllCache(), 'Limpiar Todo')}
              disabled={actionLoading !== null}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
            >
              {actionLoading === 'Limpiar Todo' ? '⏳' : '🗑️'} Limpiar Todo
            </button>
          </div>

          {/* Botones por Categoría */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {(['sports', 'matches', 'leagues', 'teams'] as const).map((category) => (
              <button
                key={category}
                onClick={() => handleAction(() => invalidateByCategory(category), `Limpiar ${category}`)}
                disabled={actionLoading !== null}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm"
              >
                {actionLoading === `Limpiar ${category}` ? '⏳' : '🗂️'} {category}
              </button>
            ))}
          </div>

          {/* Resultado de Acción */}
          {actionResult && (
            <div className={`p-3 rounded-lg mb-4 ${
              actionResult.startsWith('✅') 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
            }`}>
              {actionResult}
            </div>
          )}

          {/* Lista de Entradas del Cache */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
              📋 Entradas del Cache ({entries.length})
            </h3>
            
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin text-2xl">⏳</div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                No hay entradas en el cache
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {entries.slice(0, 20).map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border text-sm"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <span className="text-lg">{getStorageIcon(entry.storage)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {entry.key}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">
                            {formatBytes(entry.size)} • TTL: {entry.ttl}s
                          </p>
                        </div>
                      </div>
                      <div className={`text-right ${getAgeColor(entry.age, entry.ttl)}`}>
                        <div className="font-medium">
                          {entry.age >= entry.ttl ? '⚠️ Expirado' : `${entry.age}s`}
                        </div>
                        <div className="text-xs">
                          {entry.age >= entry.ttl 
                            ? `+${entry.age - entry.ttl}s`
                            : `${entry.ttl - entry.age}s restantes`
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                  {entries.length > 20 && (
                    <div className="text-center py-2 text-gray-600 dark:text-gray-400">
                      ... y {entries.length - 20} más
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
              ❌ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CacheAdmin;
