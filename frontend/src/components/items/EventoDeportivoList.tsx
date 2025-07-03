import React, { useEffect, useState } from 'react';
import { useEventoDeportivo } from '../../hooks/useEventoDeportivo';
import EventoDeportivoCard from '../cards/EventoDeportivoCard';
import SportFilter from '../filters/SportFilter';
import type { EventoDeportivoType } from '../../types/EventoDeportivoTypes';
import type { FiltrosEventoDeportivo } from '../../types/DeporteLigaTypes';

interface EventoDeportivoListProps {
  showFilters?: boolean;
  showBettingOptions?: boolean;
  onEventoClick?: (evento: EventoDeportivoType) => void;
  deporteInicial?: string;
  ligaInicial?: string;
}

const EventoDeportivoList: React.FC<EventoDeportivoListProps> = ({
  showFilters = true,
  showBettingOptions = false,
  onEventoClick,
  deporteInicial,
  ligaInicial
}) => {
  const {
    eventos,
    loading,
    error,
    cargarEventosProximos,
    cargarDeportes,
    cargarLigas,
    clearError
  } = useEventoDeportivo();

  const [eventosFiltrados, setEventosFiltrados] = useState<EventoDeportivoType[]>([]);
  const [filtrosActivos, setFiltrosActivos] = useState<FiltrosEventoDeportivo>({});

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar eventos próximos por defecto
        await cargarEventosProximos();
        
        // Cargar deportes y ligas para los filtros
        if (showFilters) {
          await cargarDeportes();
          await cargarLigas();
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };

    cargarDatos();
  }, [cargarEventosProximos, cargarDeportes, cargarLigas, showFilters]);

  // Aplicar filtros iniciales si se proporcionan
  useEffect(() => {
    if ((deporteInicial || ligaInicial) && eventos.length > 0) {
      const filtros: FiltrosEventoDeportivo = {};
      if (deporteInicial) filtros.deporteNombre = deporteInicial;
      if (ligaInicial) filtros.ligaNombre = ligaInicial;
      setFiltrosActivos(filtros);
    }
  }, [deporteInicial, ligaInicial, eventos]);

  // Actualizar eventos filtrados
  useEffect(() => {
    setEventosFiltrados(eventos);
  }, [eventos]);

  const handleFilterChange = (filtered: EventoDeportivoType[]) => {
    setEventosFiltrados(filtered);
  };

  const handleRefresh = async () => {
    clearError();
    await cargarEventosProximos();
  };

  if (loading && eventos.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando eventos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Error al cargar eventos</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Eventos Deportivos</h2>
          <p className="text-gray-600 mt-1">
            {eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? 's' : ''} 
            {filtrosActivos.deporteNombre && ` de ${filtrosActivos.deporteNombre}`}
            {filtrosActivos.ligaNombre && ` en ${filtrosActivos.ligaNombre}`}
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Actualizando...</span>
            </>
          ) : (
            <>
              <span>🔄</span>
              <span>Actualizar</span>
            </>
          )}
        </button>
      </div>

      {/* Filtros */}
      {showFilters && eventos.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <SportFilter 
            eventos={eventos} 
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      {/* Lista de eventos */}
      {eventosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No hay eventos disponibles</h3>
          <p className="text-gray-600 mb-4">
            {eventos.length === 0 
              ? 'No se encontraron eventos en este momento.'
              : 'No hay eventos que coincidan con los filtros aplicados.'
            }
          </p>
          {eventos.length === 0 && (
            <button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cargar eventos
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventosFiltrados.map((evento) => (
            <EventoDeportivoCard
              key={evento.id}
              evento={evento}
              onClick={onEventoClick}
              showBettingOptions={showBettingOptions}
            />
          ))}
        </div>
      )}

      {/* Footer con estadísticas */}
      {eventosFiltrados.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{eventosFiltrados.length}</div>
              <div className="text-sm text-gray-600">Eventos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {eventosFiltrados.filter(e => e.estado === 'programado').length}
              </div>
              <div className="text-sm text-gray-600">Programados</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {eventosFiltrados.filter(e => e.estado === 'en_vivo').length}
              </div>
              <div className="text-sm text-gray-600">En Vivo</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {new Set(eventosFiltrados.map(e => e.deporte.nombre)).size}
              </div>
              <div className="text-sm text-gray-600">Deportes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventoDeportivoList;
