import type { EventType } from '../../types/EventType';

interface MatchCardProps {
  event: EventType;
  onBetClick?: (event: EventType) => void;
  showLive?: boolean;
}

const MatchCard = ({ event, onBetClick, showLive = false }: MatchCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLive = showLive && event.strStatus?.toLowerCase() === 'not started';
  const hasScore = event.intHomeScore !== null && event.intAwayScore !== null;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
      {/* Header con liga y fecha */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {event.strLeagueBadge && (
            <img 
              src={event.strLeagueBadge} 
              alt={event.strLeague}
              className="w-5 h-5 object-contain"
            />
          )}
          <span className="text-sm font-medium truncate">{event.strLeague}</span>
        </div>
        <div className="text-xs">
          {isLive ? (
            <span className="bg-red-500 px-2 py-1 rounded-full animate-pulse">
              🔴 EN VIVO
            </span>
          ) : (
            formatDate(event.dateEvent)
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4">
        {/* Equipos */}
        <div className="flex items-center justify-between mb-4">
          {/* Equipo Local */}
          <div className="flex items-center space-x-3 flex-1">
            {event.strHomeTeamBadge && (
              <img 
                src={event.strHomeTeamBadge} 
                alt={event.strHomeTeam}
                className="w-8 h-8 object-contain"
              />
            )}
            <span className="font-medium text-gray-800 truncate">{event.strHomeTeam}</span>
          </div>

          {/* Marcador o VS */}
          <div className="mx-4 text-center">
            {hasScore ? (
              <div className="bg-gray-100 px-3 py-1 rounded-lg">
                <span className="text-lg font-bold text-gray-800">
                  {event.intHomeScore} - {event.intAwayScore}
                </span>
              </div>
            ) : (
              <span className="text-gray-500 font-medium">VS</span>
            )}
          </div>

          {/* Equipo Visitante */}
          <div className="flex items-center space-x-3 flex-1 justify-end">
            <span className="font-medium text-gray-800 truncate">{event.strAwayTeam}</span>
            {event.strAwayTeamBadge && (
              <img 
                src={event.strAwayTeamBadge} 
                alt={event.strAwayTeam}
                className="w-8 h-8 object-contain"
              />
            )}
          </div>
        </div>

        {/* Información adicional */}
        {event.strVenue && (
          <div className="text-sm text-gray-600 mb-3 text-center">
            📍 {event.strVenue}
          </div>
        )}

        {/* Cuotas de apuesta simuladas */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center hover:bg-green-100 transition-colors cursor-pointer">
            <div className="text-xs text-gray-600">Local</div>
            <div className="font-bold text-green-700">2.1</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center hover:bg-yellow-100 transition-colors cursor-pointer">
            <div className="text-xs text-gray-600">Empate</div>
            <div className="font-bold text-yellow-700">3.2</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center hover:bg-red-100 transition-colors cursor-pointer">
            <div className="text-xs text-gray-600">Visitante</div>
            <div className="font-bold text-red-700">2.8</div>
          </div>
        </div>

        {/* Botón de apostar */}
        {onBetClick && (
          <button
            onClick={() => onBetClick(event)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
          >
            🎲 Apostar Ahora
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
