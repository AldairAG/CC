import { useState, useCallback } from 'react';
import type { EventoDeportivoType } from '../../types/EventoDeportivoTypes';
import { TipoApuesta } from '../../types/ApuestaType';

export interface BettingSlip {
  id: string;
  evento: EventoDeportivoType;
  tipoApuesta: TipoApuesta;
  prediccion: string;
  cuota: number;
  montoApostado: number;
  gananciasPotenciales: number;
}

interface BettingCartProps {
  slips: BettingSlip[];
  onUpdateSlip: (id: string, monto: number) => void;
  onRemoveSlip: (id: string) => void;
  onClearAll: () => void;
  onPlaceBets: () => void;
  isPlacingBets?: boolean;
}

const BettingCart = ({ 
  slips, 
  onUpdateSlip, 
  onRemoveSlip, 
  onClearAll, 
  onPlaceBets,
  isPlacingBets = false 
}: BettingCartProps) => {
  const [betType, setBetType] = useState<'simple' | 'multiple'>('simple');

  const totalStake = slips.reduce((total, slip) => total + slip.montoApostado, 0);
  const totalPotentialWinnings = slips.reduce((total, slip) => total + slip.gananciasPotenciales, 0);
  
  // Para apuestas múltiples, la cuota se multiplica
  const multipleCuota = slips.reduce((cuota, slip) => cuota * slip.cuota, 1);
  const multiplePotentialWinnings = totalStake * multipleCuota;

  const handleSlipAmountChange = useCallback((id: string, amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    onUpdateSlip(id, numAmount);
  }, [onUpdateSlip]);

  const getTipoApuestaLabel = (tipo: TipoApuesta): string => {
    const labels: Record<TipoApuesta, string> = {
      'RESULTADO_GENERAL': 'Resultado',
      'RESULTADO_EXACTO': 'Marcador Exacto', 
      'TOTAL_GOLES': 'Total Goles',
      'GOLES_LOCAL': 'Goles Local',
      'GOLES_VISITANTE': 'Goles Visitante',
      'AMBOS_EQUIPOS_ANOTAN': 'Ambos Anotan',
      'PRIMER_GOLEADOR': 'Primer Goleador',
      'HANDICAP': 'Hándicap',
      'DOBLE_OPORTUNIDAD': 'Doble Oportunidad',
      'MITAD_TIEMPO': 'Mitad Tiempo',
      'GOLES_PRIMERA_MITAD': 'Goles 1ª Mitad',
      'CORNER_KICKS': 'Córners',
      'TARJETAS': 'Tarjetas',
      'AMBAS_MITADES_GOLEAN': 'Ambas Mitades Golean'
    };
    return labels[tipo] || tipo;
  };

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <span className="text-2xl mr-2">🎯</span>
          Carrito de Apuestas
        </h3>
        {slips.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm font-medium"
          >
            Limpiar Todo
          </button>
        )}
      </div>

      {/* Bet Type Selector */}
      {slips.length > 1 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setBetType('simple')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                betType === 'simple'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Simples
            </button>
            <button
              onClick={() => setBetType('multiple')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                betType === 'multiple'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Múltiple
            </button>
          </div>
        </div>
      )}

      {/* Betting Slips */}
      <div className="flex-1 overflow-y-auto">
        {slips.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-gray-400 text-4xl mb-4">🎲</div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selecciona eventos y cuotas para comenzar a apostar
            </p>
          </div>
        ) : betType === 'multiple' ? (
          // Vista múltiple
          <div className="p-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Apuesta Múltiple
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                {slips.length} selecciones - Cuota total: {multipleCuota.toFixed(2)}
              </p>
              
              <div className="space-y-2">
                {slips.map((slip) => (
                  <div key={slip.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {slip.evento.equipoLocal} vs {slip.evento.equipoVisitante}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getTipoApuestaLabel(slip.tipoApuesta)} - {slip.prediccion}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveSlip(slip.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Cuota:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {slip.cuota.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monto a apostar
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalStake || ''}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value) || 0;
                    const amountPerSlip = amount / slips.length;
                    slips.forEach(slip => onUpdateSlip(slip.id, amountPerSlip));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Ganancia potencial:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ${multiplePotentialWinnings.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Vista simple
          <div className="p-4 space-y-4">
            {slips.map((slip) => (
              <div key={slip.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {slip.evento.equipoLocal} vs {slip.evento.equipoVisitante}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {slip.evento.liga} • {slip.evento.deporte}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveSlip(slip.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getTipoApuestaLabel(slip.tipoApuesta)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {slip.prediccion}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {slip.cuota.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Monto a apostar
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={slip.montoApostado || ''}
                      onChange={(e) => handleSlipAmountChange(slip.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Ganancia potencial:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${slip.gananciasPotenciales.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer/Summary */}
      {slips.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {betType === 'simple' ? 'Total apostado:' : 'Monto total:'}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${totalStake.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Ganancia potencial:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ${(betType === 'multiple' ? multiplePotentialWinnings : totalPotentialWinnings).toFixed(2)}
              </span>
            </div>

            <button
              onClick={onPlaceBets}
              disabled={totalStake === 0 || isPlacingBets}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                totalStake === 0 || isPlacingBets
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              }`}
            >
              {isPlacingBets ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </span>
              ) : (
                `Apostar ${betType === 'simple' ? slips.length + ' Apuesta' + (slips.length > 1 ? 's' : '') : 'Múltiple'}`
              )}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default BettingCart;
