import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/ROUTERS';
import { useCarritoApuestas } from '../../hooks/useCarritoApuestas';

const BotonesFlotantes = () => {
  const navigate = useHistory();
  const { estadisticas, toggleVisibilidad } = useCarritoApuestas();
  const [showMenu, setShowMenu] = useState(false);

  const navButtons = [
    {
      id: 'apuestas',
      icon: '⚽',
      label: 'Apuestas',
      route: USER_ROUTES.APUESTAS_DEPORTIVAS,
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'quinielas',
      icon: '🏆',
      label: 'Quinielas',
      route: USER_ROUTES.QUINIELAS,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'mis-apuestas',
      icon: '💰',
      label: 'Mis Apuestas',
      route: USER_ROUTES.MIS_APUESTAS,
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'perfil',
      icon: '👤',
      label: 'Perfil',
      route: USER_ROUTES.USER_PROFILE,
      color: 'from-gray-600 to-gray-700'
    }
  ];

  const handleNavigation = (route: string) => {
    navigate.push(route);
    setShowMenu(false);
  };

  return (
    <>
      {/* Botón principal flotante */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Botones de navegación */}
        {showMenu && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-5 duration-200">
            {navButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleNavigation(button.route)}
                className={`
                  group flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${button.color} 
                  rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 
                  transition-all duration-200 text-white font-medium
                `}
                title={button.label}
              >
                <span className="text-xl">{button.icon}</span>
                <span className="hidden lg:block">{button.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Botón del carrito */}
        <button
          onClick={toggleVisibilidad}
          className="relative bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          title="Carrito de apuestas"
        >
          <span className="text-2xl">🎯</span>
          {estadisticas.cantidadSlips > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              {estadisticas.cantidadSlips}
            </span>
          )}
        </button>

        {/* Botón de menú principal */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`
            bg-gradient-to-r from-dark-800 to-dark-900 hover:from-dark-700 hover:to-dark-800 
            text-primary-400 p-4 rounded-full shadow-lg hover:shadow-xl 
            transform hover:scale-105 transition-all duration-200 border-2 border-primary-600/30
            ${showMenu ? 'rotate-45' : ''}
          `}
          title="Menú de navegación"
        >
          <span className="text-2xl">✨</span>
        </button>
      </div>

      {/* Overlay para cerrar el menú */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default BotonesFlotantes;
