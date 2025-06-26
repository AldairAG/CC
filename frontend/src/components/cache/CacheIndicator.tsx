/**
 * Widget de indicador de cache para el dashboard
 * 
 * Muestra el estado del cache de manera compacta con acceso rápido
 * a las funciones de gestión.
 */

import React, { useState } from 'react';
import { useCache } from '../../hooks/useCache';
import CacheAdmin from '../admin/CacheAdmin';

const CacheIndicator: React.FC = () => {
  const { sizeInMB, isNearLimit, stats, recommendations } = useCache();
  const [showAdmin, setShowAdmin] = useState(false);

  const getStatusColor = () => {
    if (isNearLimit) return 'text-red-500';
    if (recommendations?.shouldClean) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (isNearLimit) return '🚨';
    if (recommendations?.shouldClean) return '⚠️';
    return '✅';
  };

  const getTotalEntries = () => {
    return (stats?.local?.total ?? 0) + (stats?.session?.total ?? 0);
  };

  const getExpiredEntries = () => {
    return (stats?.local?.expired ?? 0) + (stats?.session?.expired ?? 0);
  };

  return (
    <>
      {/* Widget compacto */}
      <div 
        className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:shadow-xl transition-all duration-300 z-40"
        onClick={() => setShowAdmin(true)}
      >
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getStatusIcon()}</div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Cache Redis
            </div>
            <div className={`text-xs ${getStatusColor()}`}>
              {sizeInMB.toFixed(1)}MB • {getTotalEntries()} entradas
            </div>
            {getExpiredEntries() > 0 && (
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                {getExpiredEntries()} expiradas
              </div>
            )}
          </div>
          <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            ⚙️
          </div>
        </div>
        
        {/* Barra de progreso del tamaño */}
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ${
              isNearLimit ? 'bg-red-500' : recommendations?.shouldClean ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min((sizeInMB / 10) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Modal de administración */}
      <CacheAdmin 
        isOpen={showAdmin} 
        onClose={() => setShowAdmin(false)} 
      />
    </>
  );
};

export default CacheIndicator;
