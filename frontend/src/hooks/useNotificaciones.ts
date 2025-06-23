import { useState, useCallback } from 'react';

interface Notificacion {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  titulo: string;
  mensaje: string;
  duracion?: number;
  fecha: Date;
}

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const eliminarNotificacion = useCallback((id: string) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const agregarNotificacion = useCallback((
    tipo: Notificacion['tipo'],
    titulo: string,
    mensaje: string,
    duracion: number = 5000
  ) => {
    const nuevaNotificacion: Notificacion = {
      id: Date.now().toString(),
      tipo,
      titulo,
      mensaje,
      duracion,
      fecha: new Date()
    };

    setNotificaciones(prev => [...prev, nuevaNotificacion]);

    // Auto-eliminar después de la duración especificada
    if (duracion > 0) {
      setTimeout(() => {
        eliminarNotificacion(nuevaNotificacion.id);
      }, duracion);
    }

    return nuevaNotificacion.id;
  }, [eliminarNotificacion]);

  const limpiarTodas = useCallback(() => {
    setNotificaciones([]);
  }, []);

  // Funciones de conveniencia
  const notificarExito = useCallback((titulo: string, mensaje: string, duracion?: number) => {
    return agregarNotificacion('success', titulo, mensaje, duracion);
  }, [agregarNotificacion]);

  const notificarError = useCallback((titulo: string, mensaje: string, duracion?: number) => {
    return agregarNotificacion('error', titulo, mensaje, duracion);
  }, [agregarNotificacion]);

  const notificarAdvertencia = useCallback((titulo: string, mensaje: string, duracion?: number) => {
    return agregarNotificacion('warning', titulo, mensaje, duracion);
  }, [agregarNotificacion]);

  const notificarInfo = useCallback((titulo: string, mensaje: string, duracion?: number) => {
    return agregarNotificacion('info', titulo, mensaje, duracion);
  }, [agregarNotificacion]);

  return {
    notificaciones,
    agregarNotificacion,
    eliminarNotificacion,
    limpiarTodas,
    notificarExito,
    notificarError,
    notificarAdvertencia,
    notificarInfo
  };
};
