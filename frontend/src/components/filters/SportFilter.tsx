/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import type { EventoDeportivoType } from '../../types/EventoDeportivoTypes';
import { EstadoEvento } from '../../types/EventoDeportivoTypes';

interface SportFilterProps {
  eventos: EventoDeportivoType[];
  onFilterChange: (filteredEventos: EventoDeportivoType[]) => void;
}

interface SportGroup {
  sport: string;
  leagues: string[];
  count: number;
}

const SportFilter = ({ eventos, onFilterChange }: SportFilterProps) => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [expandedSports, setExpandedSports] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar eventos activos (excluir finalizados y cancelados)
  const eventosActivos = eventos.filter(evento => 
    evento.estado !== EstadoEvento.FINALIZADO && 
    evento.estado !== EstadoEvento.CANCELADO
  );

  // Agrupar eventos por deporte y liga (solo eventos activos)
  const sportGroups = eventosActivos.reduce((groups: Record<string, SportGroup>, evento) => {
    const sport = evento.deporte?.nombre || 'Otros';
    const league = evento.liga?.nombre || 'General';
    
    if (!groups[sport]) {
      groups[sport] = {
        sport,
        leagues: [],
        count: 0
      };
    }
    
    if (!groups[sport].leagues.includes(league)) {
      groups[sport].leagues.push(league);
    }
    
    groups[sport].count += 1;
    
    return groups;
  }, {});

  // Filtrar eventos basado en selección
  useEffect(() => {
    let filtered = eventosActivos;

    if (selectedSport && selectedSport !== 'all') {
      filtered = filtered.filter(evento => evento.deporte?.nombre === selectedSport);
    }

    if (selectedLeague && selectedLeague !== 'all') {
      filtered = filtered.filter(evento => evento.liga?.nombre === selectedLeague);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(evento => 
        evento.equipoLocal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.equipoVisitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.deporte?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.liga?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    onFilterChange(filtered);
  }, [selectedSport, selectedLeague, searchTerm]);

  const handleSportClick = (sport: string) => {
    if (selectedSport === sport) {
      setSelectedSport(null);
      setSelectedLeague(null);
    } else {
      setSelectedSport(sport);
      setSelectedLeague(null);
      
      // Expandir automáticamente el deporte seleccionado
      const newExpanded = new Set(expandedSports);
      newExpanded.add(sport);
      setExpandedSports(newExpanded);
    }
  };

  const handleLeagueClick = (league: string) => {
    if (selectedLeague === league) {
      setSelectedLeague(null);
    } else {
      setSelectedLeague(league);
    }
  };

  const toggleSportExpansion = (sport: string) => {
    const newExpanded = new Set(expandedSports);
    if (newExpanded.has(sport)) {
      newExpanded.delete(sport);
    } else {
      newExpanded.add(sport);
    }
    setExpandedSports(newExpanded);
  };

  const clearFilters = () => {
    setSelectedSport(null);
    setSelectedLeague(null);
    setSearchTerm('');
  };

  const getSportIcon = (sport: string) => {
    const icons: Record<string, string> = {
      'Fútbol': '⚽',
      'Básquetbol': '🏀',
      'Béisbol': '⚾',
      'Tenis': '🎾',
      'Fútbol Americano': '🏈',
      'Hockey': '🏒',
      'Voleibol': '🏐',
      'Box': '🥊',
      'Golf': '⛳',
      'Automovilismo': '🏎️',
      'Ciclismo': '🚴',
      'Natación': '🏊',
      'default': '🏆'
    };
    return icons[sport] || icons.default;
  };

  const sortedSports = Object.values(sportGroups).sort((a, b) => b.count - a.count);

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <span className="text-2xl mr-2">🏆</span>
          Filtros de Deportes
        </h3>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="mb-3">
          <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md inline-block">
            ✓ Solo eventos activos (excluye finalizados)
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSportClick('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedSport === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Todos ({eventosActivos.length})
          </button>
          <button
            onClick={clearFilters}
            className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Sports List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Deportes Disponibles
          </h4>
          
          <div className="space-y-1">
            {sortedSports.map((sportGroup) => (
              <div key={sportGroup.sport} className="border-b border-gray-100 dark:border-gray-700 pb-2">
                {/* Sport Header */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleSportClick(sportGroup.sport)}
                    className={`flex-1 flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedSport === sportGroup.sport
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{getSportIcon(sportGroup.sport)}</span>
                      <span className="font-medium">{sportGroup.sport}</span>
                    </div>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                      {sportGroup.count}
                    </span>
                  </button>
                  
                  {sportGroup.leagues.length > 1 && (
                    <button
                      onClick={() => toggleSportExpansion(sportGroup.sport)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <span className={`transform transition-transform ${
                        expandedSports.has(sportGroup.sport) ? 'rotate-90' : ''
                      }`}>
                        ▶
                      </span>
                    </button>
                  )}
                </div>

                {/* Leagues */}
                {expandedSports.has(sportGroup.sport) && sportGroup.leagues.length > 1 && (
                  <div className="ml-8 mt-2 space-y-1">
                    {sportGroup.leagues.map((league) => {
                      const leagueCount = eventosActivos.filter(e => 
                        e.deporte.nombre === sportGroup.sport && e.liga.nombre === league
                      ).length;
                      
                      return (
                        <button
                          key={league}
                          onClick={() => handleLeagueClick(league)}
                          className={`w-full flex items-center justify-between p-2 rounded-md text-left text-sm transition-colors ${
                            selectedLeague === league
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <span className="flex items-center">
                            <span className="text-sm mr-2">🏆</span>
                            {league}
                          </span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                            {leagueCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {selectedSport && selectedLeague && (
            <p>
              Mostrando {eventosActivos.filter(e => 
                e.deporte.nombre === selectedSport && e.liga.nombre === selectedLeague
              ).length} eventos de {selectedLeague}
            </p>
          )}
          {selectedSport && !selectedLeague && (
            <p>
              Mostrando {eventosActivos.filter(e => e.deporte.nombre === selectedSport).length} eventos de {selectedSport}
            </p>
          )}
          {!selectedSport && !selectedLeague && (
            <p>Mostrando todos los {eventosActivos.length} eventos</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SportFilter;
