import React, { useState } from 'react';
import { useCarritoApuestas, TIPOS_APUESTA, OPCIONES_APUESTA } from '../../hooks/useCarritoApuestas';
import type { EventType } from '../../types/EventType';

// Interface for bet options (matching the hook structure)
interface OpcionApuesta {
  descripcion: string;
  detalle: string;
  cuotaBase: number;
}

// Helper type to ensure we only use bet types that have options defined
type TipoApuestaDisponible = keyof typeof OPCIONES_APUESTA;

interface ModalApuestaProps {
  isOpen: boolean;
  onClose: () => void;
  evento: EventType | null;
}

const ModalApuesta: React.FC<ModalApuestaProps> = ({ isOpen, onClose, evento }) => {
  const {
    agregarApuestaDesdeEvento,
    puedeAgregarApuesta,
    calcularGananciaPotencial,
    formatearDinero
  } = useCarritoApuestas();
  
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoApuestaDisponible | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<OpcionApuesta | null>(null);
  const [montoApuesta, setMontoApuesta] = useState<number>(10);
  
  if (!isOpen || !evento) return null;

  // Only use bet types that have options defined
  const tiposDisponibles: TipoApuestaDisponible[] = [
    TIPOS_APUESTA.GANADOR_PARTIDO,
    TIPOS_APUESTA.TOTAL_GOLES,
    TIPOS_APUESTA.AMBOS_EQUIPOS_ANOTAN
  ];

  const handleTipoSelect = (tipo: TipoApuestaDisponible) => {
    setTipoSeleccionado(tipo);
    setOpcionSeleccionada(null);
  };
  const handleOpcionSelect = (opcion: OpcionApuesta) => {
    setOpcionSeleccionada(opcion);
  };

  const handleAgregarApuesta = () => {
    if (!tipoSeleccionado || !opcionSeleccionada) return;

    agregarApuestaDesdeEvento(evento, tipoSeleccionado, opcionSeleccionada, montoApuesta);
    
    // Reset y cerrar
    setTipoSeleccionado(null);
    setOpcionSeleccionada(null);
    setMontoApuesta(10);
    onClose();
  };

  const gananciaPotencial = opcionSeleccionada 
    ? calcularGananciaPotencial(montoApuesta, opcionSeleccionada.cuotaBase)
    : 0;

  const puedeAgregar = tipoSeleccionado && opcionSeleccionada && 
    puedeAgregarApuesta(Number(evento.idEvent), tipoSeleccionado);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Realizar Apuesta</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="mt-2">
            <p className="text-lg font-semibold">
              {evento.strHomeTeam} vs {evento.strAwayTeam}
            </p>
            <p className="text-sm opacity-90">
              {evento.dateEvent} • {evento.strTime}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Paso 1: Seleccionar tipo de apuesta */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">1. Tipo de Apuesta</h3>
            <div className="grid gap-2">
              {tiposDisponibles.map((tipo) => {
                const nombreTipo = tipo === TIPOS_APUESTA.GANADOR_PARTIDO ? 'Ganador del Partido' :
                                  tipo === TIPOS_APUESTA.TOTAL_GOLES ? 'Total de Goles' :
                                  'Ambos Equipos Anotan';
                
                const puedeSeleccionar = puedeAgregarApuesta(Number(evento.idEvent), tipo);
                
                return (
                  <button
                    key={tipo}
                    onClick={() => handleTipoSelect(tipo)}
                    disabled={!puedeSeleccionar}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      tipoSeleccionado === tipo
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : puedeSeleccionar
                        ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium">{nombreTipo}</div>
                    {!puedeSeleccionar && (
                      <div className="text-xs text-red-500 mt-1">Ya agregada al carrito</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>          {/* Paso 2: Seleccionar opción */}
          {tipoSeleccionado && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">2. Seleccionar Opción</h3>
              <div className="grid gap-2">
                {OPCIONES_APUESTA[tipoSeleccionado]?.map((opcion: OpcionApuesta, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleOpcionSelect(opcion)}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      opcionSeleccionada === opcion
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{opcion.descripcion}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold text-sm">
                        {opcion.cuotaBase.toFixed(2)}x
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 3: Monto de apuesta */}
          {opcionSeleccionada && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">3. Monto a Apostar</h3>
              <div className="space-y-3">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={montoApuesta}
                  onChange={(e) => setMontoApuesta(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg text-center text-lg font-semibold"
                  placeholder="Ingresa el monto"
                />
                
                {/* Botones de monto rápido */}
                <div className="grid grid-cols-4 gap-2">
                  {[10, 50, 100, 500].map((monto) => (
                    <button
                      key={monto}
                      onClick={() => setMontoApuesta(monto)}
                      className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      ${monto}
                    </button>
                  ))}
                </div>

                {/* Resumen */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Cuota:</span>
                    <span className="font-bold">{opcionSeleccionada.cuotaBase.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Monto:</span>
                    <span className="font-bold">{formatearDinero(montoApuesta)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Ganancia potencial:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatearDinero(gananciaPotencial)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAgregarApuesta}
              disabled={!puedeAgregar}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalApuesta;
