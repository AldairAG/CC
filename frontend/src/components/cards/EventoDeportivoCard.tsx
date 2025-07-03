import React from 'react';
import type { EventoDeportivoType } from '../../types/EventoDeportivoTypes';
import { EstadoEvento } from '../../types/EventoDeportivoTypes';

interface EventoDeportivoCardProps {
  evento: EventoDeportivoType;
  onClick?: (evento: EventoDeportivoType) => void;
  showBettingOptions?: boolean;
}

const EventoDeportivoCard: React.FC<EventoDeportivoCardProps> = ({
  evento,
  onClick,
  showBettingOptions = false
}) => {
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return {
      fecha: fecha.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
      }),
      hora: fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getEstadoClase = (estado: string) => {
    switch (estado) {
      case EstadoEvento.PROGRAMADO:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case EstadoEvento.EN_VIVO:
        return 'bg-green-100 text-green-800 border-green-200 animate-pulse';
      case EstadoEvento.FINALIZADO:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case EstadoEvento.CANCELADO:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case EstadoEvento.PROGRAMADO:
        return 'Programado';
      case EstadoEvento.EN_VIVO:
        return 'En Vivo';
      case EstadoEvento.FINALIZADO:
        return 'Finalizado';
      case EstadoEvento.CANCELADO:
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const { fecha, hora } = formatearFecha(evento.fechaEvento);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200 ${
        onClick ? 'cursor-pointer hover:border-blue-300' : ''
      }`}
      onClick={() => onClick?.(evento)}
    >
      {/* Header con deporte y liga */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Icono del deporte */}
            {evento.deporte.icono && (
              <img 
                src={evento.deporte.icono} 
                alt={evento.deporte.nombre}
                className="w-6 h-6 object-contain"
              />
            )}
            
            {/* Nombre del deporte */}
            <span 
              className="font-semibold text-sm text-gray-700"
              style={{ color: evento.deporte.colorPrimario || undefined }}
            >
              {evento.deporte.nombre}
            </span>
            
            {/* Separator */}
            <span className="text-gray-400">•</span>
            
            {/* Logo y nombre de la liga */}
            <div className="flex items-center space-x-2">
              {evento.liga.logo && (
                <img 
                  src={evento.liga.logo} 
                  alt={evento.liga.nombre}
                  className="w-5 h-5 object-contain"
                />
              )}
              <span className="text-sm text-gray-600">{evento.liga.nombre}</span>
            </div>
          </div>
          
          {/* Estado del evento */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoClase(evento.estado)}`}>
            {getEstadoTexto(evento.estado)}
          </span>
        </div>
      </div>

      {/* Cuerpo del evento */}
      <div className="p-4">
        {/* Fecha y hora */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{fecha}</span> a las <span className="font-medium">{hora}</span>
          </div>
          {evento.temporada && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              Temporada {evento.temporada}
            </span>
          )}
        </div>

        {/* Equipos */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{evento.equipoLocal}</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Local</span>
            </div>
            {evento.marcadorLocal !== undefined && (
              <span className="font-bold text-lg text-gray-900">{evento.marcadorLocal}</span>
            )}
          </div>
          
          <div className="flex items-center justify-center">
            <span className="text-gray-400 font-medium">VS</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{evento.equipoVisitante}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Visitante</span>
            </div>
            {evento.marcadorVisitante !== undefined && (
              <span className="font-bold text-lg text-gray-900">{evento.marcadorVisitante}</span>
            )}
          </div>
        </div>

        {/* Descripción */}
        {evento.descripcion && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">{evento.descripcion}</p>
          </div>
        )}

        {/* Opciones de apuestas */}
        {showBettingOptions && evento.estado === EstadoEvento.PROGRAMADO && (
          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded transition-colors">
              Apostar
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded transition-colors">
              Más info
            </button>
          </div>
        )}
      </div>

      {/* Footer con información adicional */}
      <div className="px-4 py-2 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID: {evento.eventoIdExterno}</span>
          {evento.resultado && (
            <span className="font-medium">
              Resultado: {evento.resultado}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventoDeportivoCard;
