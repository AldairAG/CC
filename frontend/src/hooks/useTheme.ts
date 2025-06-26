import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verificar si hay un tema guardado en localStorage
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
    } catch (error) {
      console.log('Error accessing localStorage:', error);
    }
    
    // Si no hay tema guardado, usar preferencia del sistema
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });
  useEffect(() => {
    try {
      // Guardar tema en localStorage
      localStorage.setItem('theme', theme);
      
      // Aplicar tema al documento
      const root = document.documentElement;
      
      // Remover ambas clases primero
      root.classList.remove('dark', 'light');
      
      // Añadir la clase del tema actual
      root.classList.add(theme);
      
      console.log('Theme applied:', theme, 'Root classes:', root.className);
    } catch (error) {
      console.log('Error setting theme:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};
