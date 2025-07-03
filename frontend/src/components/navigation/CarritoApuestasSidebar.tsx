import { useCarritoApuestas } from '../../hooks/useCarritoApuestas';

const CarritoApuestasSidebar = () => {
  const {
    slips,
    betType,
    estadisticas,
    validaciones,
    isCreandoApuesta,
    actualizarMontoSlip,
    removerSlip,
    limpiarCarrito,
    procesarApuestas,
    cambiarTipoApuesta,
    getTipoApuestaLabel
  } = useCarritoApuestas();

  const handleSlipAmountChange = (id: string, amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    actualizarMontoSlip(id, numAmount);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <aside className="w-80 bg-dark-800 rounded-lg shadow-casino border border-primary-600/30 flex flex-col h-fit max-h-[calc(100vh-120px)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-600/30">
        <h3 className="text-lg font-bold text-primary-400 flex items-center gap-2">
          🎯 Carrito de Apuestas
        </h3>
        {slips.length > 0 && (
          <button
            onClick={limpiarCarrito}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Bet Type Selector */}
      {slips.length > 1 && (
        <div className="p-4 border-b border-primary-600/30">
          <div className="flex bg-dark-700 rounded-lg p-1">
            <button
              onClick={() => cambiarTipoApuesta('simple')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                betType === 'simple'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-dark-600'
              }`}
            >
              Simples
            </button>
            <button
              onClick={() => cambiarTipoApuesta('multiple')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                betType === 'multiple'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-dark-600'
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
            <div className="text-primary-500 text-4xl mb-4">🎲</div>
            <h4 className="text-lg font-medium text-white mb-2">
              Tu carrito está vacío
            </h4>
            <p className="text-sm text-gray-400">
              Selecciona eventos y cuotas para comenzar a apostar
            </p>
          </div>
        ) : betType === 'multiple' ? (
          // Vista múltiple
          <div className="p-4">
            <div className="bg-primary-900/30 rounded-lg p-4 mb-4 border border-primary-600/50">
              <h4 className="font-semibold text-primary-300 mb-2">
                Apuesta Múltiple
              </h4>
              <p className="text-sm text-primary-400 mb-3">
                {slips.length} selecciones - Cuota total: {estadisticas.cuotaMultiple.toFixed(2)}
              </p>
              
              <div className="space-y-2">
                {slips.map((slip) => (
                  <div key={slip.id} className="bg-dark-700 rounded-lg p-3 border border-primary-600/30">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">
                          {slip.evento.equipoLocal} vs {slip.evento.equipoVisitante}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getTipoApuestaLabel(slip.tipoApuesta)} - {slip.prediccion}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(slip.evento.fechaEvento)}
                        </p>
                      </div>
                      <button
                        onClick={() => removerSlip(slip.id)}
                        className="text-red-400 hover:text-red-300 ml-2 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Cuota:</span>
                      <span className="font-semibold text-green-400">
                        {slip.cuota.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monto total a apostar
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={estadisticas.totalApostado || ''}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value) || 0;
                    const amountPerSlip = amount / slips.length;
                    slips.forEach(slip => actualizarMontoSlip(slip.id, amountPerSlip));
                  }}
                  className="w-full px-3 py-2 border border-primary-600/30 rounded-lg bg-dark-700 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="0.00"
                />
              </div>

              <div className="mt-3 pt-3 border-t border-primary-600/30">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ganancia potencial:</span>
                  <span className="font-semibold text-green-400">
                    {formatCurrency(estadisticas.gananciasPotencialesMultiples)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Vista simple
          <div className="p-4 space-y-4">
            {slips.map((slip) => (
              <div key={slip.id} className="bg-dark-700/50 rounded-lg p-4 border border-primary-600/20 hover:border-primary-600/40 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">
                      {slip.evento.equipoLocal} vs {slip.evento.equipoVisitante}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {slip.evento.deporte.nombre} • {slip.evento.liga.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(slip.evento.fechaEvento)}
                    </p>
                  </div>
                  <button
                    onClick={() => removerSlip(slip.id)}
                    className="text-red-400 hover:text-red-300 ml-2 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-dark-800 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {getTipoApuestaLabel(slip.tipoApuesta)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {slip.prediccion}
                      </p>
                    </div>
                    <span className="font-semibold text-green-400">
                      {slip.cuota.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Monto a apostar
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={slip.montoApostado || ''}
                      onChange={(e) => handleSlipAmountChange(slip.id, e.target.value)}
                      className="w-full px-3 py-2 border border-primary-600/30 rounded-lg bg-dark-700 text-white placeholder-gray-400 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Ganancia potencial:</span>
                    <span className="font-semibold text-green-400">
                      {formatCurrency(slip.gananciasPotenciales)}
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
        <div className="border-t border-primary-600/30 p-4 bg-dark-800/50">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                {betType === 'simple' ? 'Total apostado:' : 'Monto total:'}
              </span>
              <span className="font-semibold text-white">
                {formatCurrency(estadisticas.totalApostado)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Ganancia potencial:</span>
              <span className="font-semibold text-green-400">
                {formatCurrency(betType === 'multiple' ? estadisticas.gananciasPotencialesMultiples : estadisticas.gananciasPotencialesSimples)}
              </span>
            </div>

            {/* Estadísticas adicionales */}
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Apuestas:</span>
                <span>{estadisticas.cantidadSlips}</span>
              </div>
              <div className="flex justify-between">
                <span>Cuota promedio:</span>
                <span>{estadisticas.promedioCuota.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={procesarApuestas}
              disabled={!validaciones.puedeApostar || isCreandoApuesta}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                !validaciones.puedeApostar || isCreandoApuesta
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-casino hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isCreandoApuesta ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </span>
              ) : (
                `🎯 Apostar ${betType === 'simple' ? slips.length + ' Apuesta' + (slips.length > 1 ? 's' : '') : 'Múltiple'}`
              )}
            </button>

            {/* Warnings */}
            {validaciones.tieneSlipsSinMonto && (
              <div className="text-xs text-yellow-400 bg-yellow-900/20 rounded p-2">
                ⚠️ Todas las apuestas deben tener un monto mayor a 0
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default CarritoApuestasSidebar;
