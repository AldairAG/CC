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
    // Permitir strings vacíos y convertir a número
    let numAmount = 0;
    
    if (amount !== '') {
      const parsed = parseFloat(amount);
      
      if (!isNaN(parsed) && parsed >= 0) {
        numAmount = parsed;
      } else {
        // Si no es un número válido, no hacer nada (mantener el valor actual)
        return;
      }
    }
    
    // Actualizar el monto (ahora permitimos valores temporales menores al mínimo)
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
    <aside className="w-80 bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col h-fit max-h-[calc(100vh-120px)] overflow-hidden">
      {/* Header moderno */}
      <div className="flex items-center justify-between p-4 border-b border-amber-500/20 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
        <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-2">
          🎯 Carrito de Apuestas
        </h3>
        {slips.length > 0 && (
          <button
            onClick={limpiarCarrito}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-all duration-300 hover:bg-red-500/10 px-2 py-1 rounded-lg"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Bet Type Selector moderno */}
      {slips.length > 1 && (
        <div className="p-4 border-b border-amber-500/20">
          <div className="flex bg-slate-700/50 rounded-xl p-1 backdrop-blur-sm">
            <button
              onClick={() => cambiarTipoApuesta('simple')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                betType === 'simple'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              Simples
            </button>
            <button
              onClick={() => cambiarTipoApuesta('multiple')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                betType === 'multiple'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
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
            <div className="text-amber-500 text-4xl mb-4">🎲</div>
            <h4 className="text-lg font-medium text-white mb-2">
              Tu carrito está vacío
            </h4>
            <p className="text-sm text-slate-400">
              Selecciona eventos y cuotas para comenzar a apostar
            </p>
          </div>
        ) : betType === 'multiple' ? (
          // Vista múltiple moderna
          <div className="p-4">
            <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-amber-500/30">
              <h4 className="font-semibold text-amber-300 mb-2">
                Apuesta Múltiple
              </h4>
              <p className="text-sm text-amber-400 mb-3">
                {slips.length} selecciones - Cuota total: {estadisticas.cuotaMultiple.toFixed(2)}
              </p>
              
              <div className="space-y-2">
                {slips.map((slip) => (
                  <div key={slip.id} className="bg-slate-700/50 rounded-xl p-3 border border-slate-600/30 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">
                          {slip.evento.equipoLocal} vs {slip.evento.equipoVisitante}
                        </p>
                        <p className="text-xs text-slate-400">
                          {getTipoApuestaLabel(slip.tipoApuesta)} - {slip.prediccion}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(slip.evento.fechaEvento)}
                        </p>
                      </div>
                      <button
                        onClick={() => removerSlip(slip.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg p-1 ml-2 transition-all duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Cuota:</span>
                      <span className="font-semibold text-green-400">
                        {slip.cuota.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Monto total a apostar
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={estadisticas.totalApostado === 0 ? '' : estadisticas.totalApostado.toString()}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const amount = parseFloat(inputValue) || 0;
                    
                    if (slips.length > 0) {
                      const amountPerSlip = amount / slips.length;
                      slips.forEach(slip => actualizarMontoSlip(slip.id, amountPerSlip));
                    }
                  }}
                  className="w-full px-3 py-2 border border-amber-500/30 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 backdrop-blur-sm transition-all duration-300"
                  placeholder="0.00"
                />
              </div>

              <div className="mt-3 pt-3 border-t border-amber-500/30">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Ganancia potencial:</span>
                  <span className="font-semibold text-green-400">
                    {formatCurrency(estadisticas.gananciasPotencialesMultiples)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Vista simple moderna
          <div className="p-4 space-y-4">
            {slips.map((slip) => (
              <div key={slip.id} className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 hover:border-amber-500/40 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">
                      {slip.evento.equipoLocal} vs {slip.evento.equipoVisitante}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {slip.evento.deporte.nombre} • {slip.evento.liga.nombre}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(slip.evento.fechaEvento)}
                    </p>
                  </div>
                  <button
                    onClick={() => removerSlip(slip.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg p-1 ml-2 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-3 mb-3 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {getTipoApuestaLabel(slip.tipoApuesta)}
                      </p>
                      <p className="text-xs text-slate-400">
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
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Monto a apostar
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={slip.montoApostado === 0 ? '' : slip.montoApostado.toString()}
                      onChange={(e) => handleSlipAmountChange(slip.id, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl bg-slate-700/50 text-white placeholder-slate-400 text-sm focus:ring-1 transition-all duration-300 backdrop-blur-sm ${
                        slip.montoApostado > 0 && slip.montoApostado < validaciones.montoMinimo
                          ? 'border-yellow-500 focus:border-yellow-400 focus:ring-yellow-400'
                          : 'border-amber-500/30 focus:border-amber-400 focus:ring-amber-400'
                      }`}
                      placeholder={`Mínimo ${formatCurrency(validaciones.montoMinimo)}`}
                    />
                    {slip.montoApostado > 0 && slip.montoApostado < validaciones.montoMinimo && (
                      <div className="text-xs text-yellow-400 mt-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
                        ⚠️ Monto mínimo: {formatCurrency(validaciones.montoMinimo)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Ganancia potencial:</span>
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

      {/* Footer/Summary moderno */}
      {slips.length > 0 && (
        <div className="border-t border-amber-500/20 p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">
                {betType === 'simple' ? 'Total apostado:' : 'Monto total:'}
              </span>
              <span className="font-semibold text-white">
                {formatCurrency(estadisticas.totalApostado)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Ganancia potencial:</span>
              <span className="font-semibold text-green-400">
                {formatCurrency(betType === 'multiple' ? estadisticas.gananciasPotencialesMultiples : estadisticas.gananciasPotencialesSimples)}
              </span>
            </div>

            {/* Estadísticas adicionales */}
            <div className="text-xs text-slate-500 space-y-1">
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
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                !validaciones.puedeApostar || isCreandoApuesta
                  ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 active:scale-95'
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

            {/* Warnings modernos */}
            {validaciones.tieneSlipsSinMonto && (
              <div className="text-xs text-yellow-400 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-2">
                ⚠️ Todas las apuestas deben tener un monto mayor a 0
              </div>
            )}
            
            {validaciones.tieneSlipsConMontoInsuficiente && (
              <div className="text-xs text-yellow-400 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-2">
                ⚠️ Algunas apuestas tienen un monto menor al mínimo de {formatCurrency(validaciones.montoMinimo)}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default CarritoApuestasSidebar;
