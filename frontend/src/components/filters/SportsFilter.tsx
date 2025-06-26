import React from 'react';
import type { Sport } from '../../types/SportType';

interface SportsFilterProps {
  sports: Sport[];
  selectedSport: string | null;
  onSportSelect: (sport: string) => void;
  isLoading: boolean;
}

const SportsFilter: React.FC<SportsFilterProps> = ({
  sports,
  selectedSport,
  onSportSelect,
  isLoading
}) => {
  // Deportes populares con sus iconos y colores
  const sportIcons: { [key: string]: { icon: string; color: string; bgColor: string } } = {
    'Soccer': { icon: '⚽', color: 'text-green-600', bgColor: 'bg-green-50 hover:bg-green-100' },
    'Basketball': { icon: '🏀', color: 'text-orange-600', bgColor: 'bg-orange-50 hover:bg-orange-100' },
    'American Football': { icon: '🏈', color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100' },
    'Baseball': { icon: '⚾', color: 'text-red-600', bgColor: 'bg-red-50 hover:bg-red-100' },
    'Tennis': { icon: '🎾', color: 'text-yellow-600', bgColor: 'bg-yellow-50 hover:bg-yellow-100' },
    'Boxing': { icon: '🥊', color: 'text-purple-600', bgColor: 'bg-purple-50 hover:bg-purple-100' },
    'Ice Hockey': { icon: '🏒', color: 'text-cyan-600', bgColor: 'bg-cyan-50 hover:bg-cyan-100' },
    'Golf': { icon: '⛳', color: 'text-teal-600', bgColor: 'bg-teal-50 hover:bg-teal-100' },
    'Volleyball': { icon: '🏐', color: 'text-indigo-600', bgColor: 'bg-indigo-50 hover:bg-indigo-100' },
    'Motor Racing': { icon: '🏎️', color: 'text-gray-600', bgColor: 'bg-gray-50 hover:bg-gray-100' },
  };

  const getSportStyle = (sportName: string) => {
    return sportIcons[sportName] || { icon: '🏆', color: 'text-gray-600', bgColor: 'bg-gray-50 hover:bg-gray-100' };
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">🏆</span>
          Selecciona tu Deporte
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse rounded-xl p-4 h-24 flex flex-col items-center justify-center"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full mb-2"></div>
              <div className="w-16 h-3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="text-3xl mr-3">🏆</span>
        Selecciona tu Deporte
        {selectedSport && (
          <span className="ml-4 text-lg font-normal text-gray-600">
            - {selectedSport}
          </span>
        )}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Botón para mostrar todos */}
        <button
          onClick={() => onSportSelect('')}
          className={`
            rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 border-2
            ${selectedSport === null || selectedSport === ''
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-gray-200 bg-white hover:bg-gray-50 shadow-sm'
            }
          `}
        >
          <div className="text-3xl mb-2">🏆</div>
          <p className="text-sm font-semibold text-gray-700">Todos</p>
        </button>

        {/* Deportes disponibles */}
        {sports.map((sport) => {
          const style = getSportStyle(sport.strSport);
          const isSelected = selectedSport === sport.strSport;

          return (
            <button
              key={sport.idSport}
              onClick={() => onSportSelect(sport.strSport)}
              className={`
                rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 border-2
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : `border-gray-200 ${style.bgColor} shadow-sm`
                }
              `}
              title={sport.strSportDescription || sport.strSport}
            >
              <div className="text-3xl mb-2">{style.icon}</div>
              <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : style.color}`}>
                {sport.strSport}
              </p>
            </button>
          );
        })}
      </div>

      {/* Mensaje cuando no hay deportes */}
      {!isLoading && sports.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤔</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No hay deportes disponibles
          </h3>
          <p className="text-gray-500">
            Intenta recargar la página o verifica tu conexión
          </p>
        </div>
      )}
    </div>
  );
};

export default SportsFilter;
