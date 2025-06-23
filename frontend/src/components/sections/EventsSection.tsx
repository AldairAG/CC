import type { EventType } from '../../types/EventType';
import MatchCard from '../cards/MatchCard';

interface EventsSectionProps {
  title: string;
  events: EventType[];
  icon?: string;
  onBetClick?: (event: EventType) => void;
  showLive?: boolean;
  isLoading?: boolean;
}

const EventsSection = ({ 
  title, 
  events, 
  icon = '⚽', 
  onBetClick, 
  showLive = false,
  isLoading = false 
}: EventsSectionProps) => {

    console.log('Rendering EventsSection with events:', events);
    
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-pulse">
              <div className="bg-gray-300 h-12"></div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                  <div className="w-8 h-6 bg-gray-300 rounded mx-4"></div>
                  <div className="flex items-center space-x-3 flex-1 justify-end">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
                <div className="h-8 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay eventos disponibles</h3>
          <p className="text-gray-500">Revisa más tarde para encontrar nuevos partidos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {events.length}
          </span>
        </div>
        {events.length > 4 && (
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Ver todos →
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.slice(0, 8).map((event) => (
          <MatchCard
            key={event.idEvent}
            event={event}
            onBetClick={onBetClick}
            showLive={showLive}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsSection;
