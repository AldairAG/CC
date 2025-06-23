import React from 'react';
import { useNotificaciones } from '../../hooks/useNotificaciones';

interface NotificacionItemProps {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  titulo: string;
  mensaje: string;
  onClose: (id: string) => void;
}

const NotificacionItem: React.FC<NotificacionItemProps> = ({
  id,
  tipo,
  titulo,
  mensaje,
  onClose
}) => {
  const getEstilos = () => {
    switch (tipo) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: '✅',
          iconBg: 'bg-green-100',
          textColor: 'text-green-800',
          titleColor: 'text-green-900'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: '❌',
          iconBg: 'bg-red-100',
          textColor: 'text-red-800',
          titleColor: 'text-red-900'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: '⚠️',
          iconBg: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          titleColor: 'text-yellow-900'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'ℹ️',
          iconBg: 'bg-blue-100',
          textColor: 'text-blue-800',
          titleColor: 'text-blue-900'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: 'ℹ️',
          iconBg: 'bg-gray-100',
          textColor: 'text-gray-800',
          titleColor: 'text-gray-900'
        };
    }
  };

  const estilos = getEstilos();

  return (
    <div className={`${estilos.bg} border rounded-lg p-4 shadow-lg transition-all duration-300 animate-slide-in-right`}>
      <div className="flex items-start">
        <div className={`${estilos.iconBg} rounded-full p-1 mr-3`}>
          <span className="text-lg">{estilos.icon}</span>
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${estilos.titleColor} mb-1`}>
            {titulo}
          </h4>
          <p className={`text-sm ${estilos.textColor}`}>
            {mensaje}
          </p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  );
};

interface NotificacionesContainerProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const NotificacionesContainer: React.FC<NotificacionesContainerProps> = ({
  className = '',
  position = 'top-right'
}) => {
  const { notificaciones, eliminarNotificacion } = useNotificaciones();

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (notificaciones.length === 0) return null;

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-3 max-w-sm w-full ${className}`}>
      {notificaciones.map((notificacion) => (
        <NotificacionItem
          key={notificacion.id}
          id={notificacion.id}
          tipo={notificacion.tipo}
          titulo={notificacion.titulo}
          mensaje={notificacion.mensaje}
          onClose={eliminarNotificacion}
        />
      ))}
    </div>
  );
};

export default NotificacionesContainer;
