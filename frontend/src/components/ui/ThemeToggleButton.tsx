import { useTheme } from '../../hooks/useTheme';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-dark-800/80 hover:bg-dark-700/90 border border-primary-600/40 hover:border-primary-500/60 transition-all duration-300 group backdrop-blur-sm"
      title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      <div className="relative w-6 h-6">
        {/* Icono de sol (modo claro) */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          theme === 'light' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-180'
        }`}>
          <svg 
            className="w-6 h-6 text-yellow-400 drop-shadow-md" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        
        {/* Icono de luna (modo oscuro) */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-180'
        }`}>
          <svg 
            className="w-6 h-6 text-blue-300 drop-shadow-md" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" 
            />
          </svg>
        </div>
      </div>
      
      {/* Efecto de brillo - actualizado */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary-500/20"></div>
      
      {/* Indicador de estado */}
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
          : 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
      }`}></div>
    </button>
  );
};

export default ThemeToggleButton;
