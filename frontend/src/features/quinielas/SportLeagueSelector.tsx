import React, { useState, useEffect } from 'react';
import { partidoService } from '../../service/api/partidoService';
import type { Sport } from '../../types/SportType';

interface League {
    idLeague: string;
    strLeague: string;
    strSport: string;
    strLeagueAlternate?: string;
}

interface Props {
    selectedSport: string;
    selectedLeague: string;
    onSportChange: (sport: string) => void;
    onLeagueChange: (league: string) => void;
}

export const SportLeagueSelector: React.FC<Props> = ({
    selectedSport,
    selectedLeague,
    onSportChange,
    onLeagueChange
}) => {
    const [sports, setSports] = useState<Sport[]>([]);
    const [leagues, setLeagues] = useState<League[]>([]);
    const [loadingSports, setLoadingSports] = useState(false);
    const [loadingLeagues, setLoadingLeagues] = useState(false);

    // Cargar deportes al montar el componente
    useEffect(() => {
        const loadSports = async () => {
            try {
                setLoadingSports(true);
                const sportsData = await partidoService.getAllSports();
                // Filtrar deportes más populares
                const popularSports = sportsData.filter((sport: Sport) => 
                    ['Soccer', 'Basketball', 'American Football', 'Baseball', 'Tennis', 'Hockey'].includes(sport.strSport)
                );
                setSports(popularSports.length > 0 ? popularSports : sportsData.slice(0, 10));
            } catch (error) {
                console.error('Error cargando deportes:', error);
            } finally {
                setLoadingSports(false);
            }
        };

        loadSports();
    }, []);

    // Cargar ligas cuando cambia el deporte seleccionado
    useEffect(() => {
        const loadLeagues = async () => {
            if (!selectedSport) {
                setLeagues([]);
                return;
            }

            try {
                setLoadingLeagues(true);
                const leaguesData = await partidoService.getLeaguesBySport(selectedSport);
                setLeagues(leaguesData);
                
                // Si había una liga seleccionada y ya no está disponible, limpiar selección
                if (selectedLeague && !leaguesData.some((l: League) => l.idLeague === selectedLeague)) {
                    onLeagueChange('');
                }
            } catch (error) {
                console.error('Error cargando ligas:', error);
                setLeagues([]);
            } finally {
                setLoadingLeagues(false);
            }
        };

        loadLeagues();
    }, [selectedSport, selectedLeague, onLeagueChange]);

    const handleSportChange = (sportName: string) => {
        onSportChange(sportName);
        onLeagueChange(''); // Limpiar liga seleccionada al cambiar deporte
    };

    if (loadingSports) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    🏆 Seleccionar Deporte y Liga
                </h3>
                
                {/* Selector de Deporte */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deporte *
                    </label>
                    <select
                        value={selectedSport}
                        onChange={(e) => handleSportChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Selecciona un deporte</option>
                        {sports.map((sport) => (
                            <option key={sport.idSport} value={sport.strSport}>
                                {sport.strSport}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selector de Liga */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Liga * {selectedSport && `(${selectedSport})`}
                    </label>
                    <select
                        value={selectedLeague}
                        onChange={(e) => onLeagueChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!selectedSport || loadingLeagues}
                        required
                    >
                        <option value="">
                            {!selectedSport 
                                ? 'Primero selecciona un deporte' 
                                : loadingLeagues 
                                    ? 'Cargando ligas...' 
                                    : 'Selecciona una liga'
                            }
                        </option>
                        {leagues.map((league) => (
                            <option key={league.idLeague} value={league.idLeague}>
                                {league.strLeague}
                                {league.strLeagueAlternate && ` (${league.strLeagueAlternate})`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Información adicional */}
                {selectedSport && leagues.length === 0 && !loadingLeagues && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <span className="text-yellow-600">⚠️</span>
                            <p className="text-sm text-yellow-800">
                                No se encontraron ligas para {selectedSport}. Intenta con otro deporte.
                            </p>
                        </div>
                    </div>
                )}

                {selectedSport && selectedLeague && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-600">✅</span>
                            <p className="text-sm text-green-800">
                                <strong>{selectedSport}</strong> - {leagues.find(l => l.idLeague === selectedLeague)?.strLeague}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
