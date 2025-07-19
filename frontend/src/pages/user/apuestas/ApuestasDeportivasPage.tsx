
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../../../hooks/useUser';
import { useApuestasDeportivas } from '../../../hooks/useApuestasDeportivas';
import { useEventoDeportivo } from '../../../hooks/useEventoDeportivo';
import { useCarritoApuestas } from '../../../hooks/useCarritoApuestas';
import { USER_ROUTES } from '../../../constants/ROUTERS';
import type { EventoDeportivoType } from '../../../types/EventoDeportivoTypes';
import { TipoApuesta } from '../../../types/ApuestaType';

const ApuestasDeportivasPage = () => {
  const navigate = useHistory();
  const { user } = useUser();
  const [eventosEnVivo, setEventosEnVivo] = useState<EventoDeportivoType[]>([])

  // Hooks
  const {
    eventos,
    cargarEventosProximos,
    loading: eventosLoading
  } = useEventoDeportivo();

  const {
    loadEventosConMasApuestas,
    apuestasRecientes,
    loadEstadisticasApuestas,
    estadisticasApuestas,
    loadApuestasActivas,
    apuestasActivas
  } = useApuestasDeportivas();

  const { agregarApuesta } = useCarritoApuestas();

  // Estados locales (ya no necesitamos selectedSport)

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadDashboardData = async () => {
      // Cargar eventos deportivos próximos
      await cargarEventosProximos();

      // Cargar estadísticas y apuestas del usuario
      await loadEventosConMasApuestas(10);
      await loadEstadisticasApuestas();
      await loadApuestasActivas(0, 5);
      filtrarEventosEnVivo();
    };

    loadDashboardData();
  }, [cargarEventosProximos, loadEventosConMasApuestas, loadEstadisticasApuestas, loadApuestasActivas]);

  // Funciones de navegación
  const navigateToApuestasDeportivas = () => {
    navigate.push(USER_ROUTES.APUESTAS_DEPORTIVAS);
  };

  useEffect(() => {
    filtrarEventosEnVivo();
  }, [eventos])

  const filtrarEventosEnVivo = useCallback(() => {
    const eventosEnVivo = eventos.filter(evento => evento.estado = "en_vivo").slice(0,3);
    setEventosEnVivo(eventosEnVivo);
  }, [eventos])

  const navigateToMisApuestas = () => {
    navigate.push(USER_ROUTES.MIS_APUESTAS);
  };

  const navigateToDeporte = (deporte: string) => {
    // Navegar a apuestas deportivas con filtro de deporte
    navigate.push(`${USER_ROUTES.APUESTAS_DEPORTIVAS}?deporte=${deporte}`);
  };

  // Función para agregar apuesta rápida
  const handleQuickBet = (evento: EventoDeportivoType, prediccion: string, cuota: number) => {
    // Esta es una implementación básica, en el mundo real necesitarías el cuotaId real
    const cuotaId = Math.floor(Math.random() * 1000); // Temporal para demo

    agregarApuesta(
      evento,
      TipoApuesta.RESULTADO_GENERAL,
      prediccion,
      cuota,
      cuotaId,
      10 // Monto inicial de $10
    );
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Obtener eventos destacados (mezcla de diferentes deportes)
  const eventosDestacados = eventos.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Header principal - Estilo moderno */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-amber-500/20 relative overflow-hidden">
        {/* Patrón de fondo decorativo */}
        <div style={{
          position: 'absolute',
          inset: '0',
          backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYmY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+")',
          opacity: '0.3',
          zIndex: '0'
        }}></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-6 min-[768px]:py-8">
          <div className="text-center">
            <h1 className="text-4xl min-[480px]:text-5xl min-[768px]:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 leading-tight mb-4">
              <div className="flex flex-col items-center justify-center gap-2 min-[768px]:flex-row min-[768px]:gap-4">
                <span className="text-5xl min-[768px]:text-6xl">🎰</span>
                <span>¡Bienvenido, {user?.username || 'Jugador'}!</span>
              </div>
            </h1>
            <p className="text-slate-300 text-lg min-[768px]:text-xl max-w-3xl mx-auto leading-relaxed">
              Descubre las mejores apuestas deportivas y eventos del momento
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 min-[768px]:py-8">

        {/* Estadísticas rápidas - Estilo moderno */}
        {estadisticasApuestas && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-[768px]:gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl min-[768px]:rounded-2xl shadow-2xl border border-slate-700/50 p-4 min-[768px]:p-6 hover:border-amber-500/30 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Total Apostado</p>
                  <p className="text-2xl min-[768px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    {formatCurrency(estadisticasApuestas.montoTotalApostado || 0)}
                  </p>
                </div>
                <div className="text-3xl min-[768px]:text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">💰</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl min-[768px]:rounded-2xl shadow-2xl border border-slate-700/50 p-4 min-[768px]:p-6 hover:border-amber-500/30 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Apuestas Ganadas</p>
                  <p className="text-2xl min-[768px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                    {estadisticasApuestas.apuestasGanadas || 0}
                  </p>
                </div>
                <div className="text-3xl min-[768px]:text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">🏆</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl min-[768px]:rounded-2xl shadow-2xl border border-slate-700/50 p-4 min-[768px]:p-6 hover:border-amber-500/30 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">% Aciertos</p>
                  <p className="text-2xl min-[768px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    {((estadisticasApuestas.apuestasGanadas / estadisticasApuestas.totalApuestas) * 100).toFixed(1) || 0}%
                  </p>
                </div>
                <div className="text-3xl min-[768px]:text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">📊</div>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Promociones y Tips - Estilo moderno */}
        <div className="mb-8">
          <h2 className="text-2xl min-[768px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6">
            🎁 Promociones Especiales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promoción del día */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all duration-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-3">
                  <div className="text-2xl">🎯</div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Apuesta del Día</h3>
                  <p className="text-purple-300 text-sm">Cuota mejorada especial</p>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4 backdrop-blur-sm">
                <p className="text-white font-semibold mb-2">Real Madrid vs Barcelona</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Victoria Real Madrid</span>
                  <span className="bg-green-600/20 border border-green-500/50 text-green-400 px-3 py-1 rounded-lg font-bold">2.50</span>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                ¡Apostar Ahora!
              </button>
            </div>

            {/* Tips de apuestas */}
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-500/30 p-6 hover:border-blue-400/50 transition-all duration-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-3">
                  <div className="text-2xl">💡</div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Tip del Experto</h3>
                  <p className="text-blue-300 text-sm">Consejo profesional</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-800/50 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-white text-sm">
                    📈 Los equipos locales tienen un 65% más de probabilidades de ganar en partidos importantes.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-white text-sm">
                    ⚽ Revisa las últimas 5 actuaciones de cada equipo antes de apostar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Eventos Deportivos Populares - Estilo moderno */}
        <div className="mb-8" id="eventos-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl min-[768px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              🔥 Eventos Destacados
            </h2>
            <button
              onClick={navigateToApuestasDeportivas}
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-2"
            >
              <span>Ver todos</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Grid de eventos */}
          {eventosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-[768px]:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl min-[768px]:rounded-2xl shadow-2xl border border-slate-700/50 p-4 min-[768px]:p-6 animate-pulse">
                  <div className="h-20 bg-slate-700/50 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-700/50 rounded-xl mb-2"></div>
                  <div className="h-4 bg-slate-700/50 rounded-xl w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-[768px]:gap-6">
              {eventosDestacados.map((evento) => (
                <div
                  key={evento.id}
                  className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl min-[768px]:rounded-2xl shadow-2xl border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 group"
                >
                  <div className="p-4 min-[768px]:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-amber-400 font-medium bg-amber-500/10 px-2 py-1 rounded-lg">
                        {evento.liga.nombre}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(evento.fechaEvento)}
                      </span>
                    </div>

                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <p className="text-white font-medium text-sm">{evento.equipoLocal}</p>
                        </div>
                        <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center">
                          <span className="text-slate-400 text-xs font-medium">VS</span>
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium text-sm">{evento.equipoVisitante}</p>
                        </div>
                      </div>
                    </div>

                    {/* Botones de apuesta rápida modernos */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleQuickBet(evento, 'Local', 2.1)}
                        className="bg-gradient-to-b from-green-600/20 to-green-700/20 hover:from-green-600/30 hover:to-green-700/30 border border-green-500/30 text-green-400 text-xs py-2 px-3 rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                        <div className="text-slate-300">Local</div>
                        <div className="text-green-400 font-bold">2.1</div>
                      </button>
                      <button
                        onClick={() => handleQuickBet(evento, 'Empate', 3.2)}
                        className="bg-gradient-to-b from-yellow-600/20 to-yellow-700/20 hover:from-yellow-600/30 hover:to-yellow-700/30 border border-yellow-500/30 text-yellow-400 text-xs py-2 px-3 rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                        <div className="text-slate-300">Empate</div>
                        <div className="text-yellow-400 font-bold">3.2</div>
                      </button>
                      <button
                        onClick={() => handleQuickBet(evento, 'Visitante', 2.8)}
                        className="bg-gradient-to-b from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 border border-blue-500/30 text-blue-400 text-xs py-2 px-3 rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                        <div className="text-slate-300">Visitante</div>
                        <div className="text-blue-400 font-bold">2.8</div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {eventosDestacados.length === 0 && !eventosLoading && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4 animate-bounce">⚽</div>
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
                  No hay eventos disponibles
                </h3>
                <p className="text-slate-400">Vuelve pronto para ver los próximos eventos</p>
              </div>
            </div>
          )}
        </div>

        {/* Sección de Eventos En Vivo - Estilo moderno */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl min-[768px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
              🔴 En Vivo Ahora
            </h2>
            <div className="flex items-center bg-red-500/20 px-3 py-1 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-red-400 text-sm font-medium">LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-[768px]:gap-6">
            {/* Evento en vivo simulado */}
            {eventosEnVivo.map((evento, index) => (
              <div key={index} className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-500/30 p-6 relative overflow-hidden hover:border-red-400/50 transition-all duration-300">
                <div className="absolute top-3 right-3">
                  <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    LIVE
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <span>⚽</span>
                      <span>Primera División</span>
                    </span>
                    <span className="bg-slate-800/50 px-2 py-1 rounded">89'</span>
                  </div>
                  <h3 className="text-white font-bold text-lg">{evento.nombreEvento}</h3>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 mb-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-white font-bold">{evento.equipoLocal}</p>
                      <p className="text-3xl font-bold text-green-400">2</p>
                    </div>
                    <div className="text-slate-400">VS</div>
                    <div className="text-center">
                      <p className="text-white font-bold">{evento.equipoVisitante}</p>
                      <p className="text-3xl font-bold text-green-400">1</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button className="bg-gradient-to-b from-green-600/20 to-green-700/20 hover:from-green-600/30 hover:to-green-700/30 border border-green-500/30 text-green-400 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 backdrop-blur-sm">
                    +2.5 Goles
                    <br />
                    <span className="text-white">1.85</span>
                  </button>
                  <button className="bg-gradient-to-b from-yellow-600/20 to-yellow-700/20 hover:from-yellow-600/30 hover:to-yellow-700/30 border border-yellow-500/30 text-yellow-400 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 backdrop-blur-sm">
                    Empate
                    <br />
                    <span className="text-white">3.20</span>
                  </button>
                  <button className="bg-gradient-to-b from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 border border-blue-500/30 text-blue-400 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 backdrop-blur-sm">
                    Corner
                    <br />
                    <span className="text-white">2.10</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Más eventos en vivo pueden ir aquí */}
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6 flex items-center justify-center hover:border-amber-500/30 transition-all duration-300">
              <div className="text-center">
                <div className="text-4xl mb-3 animate-pulse">⏰</div>
                <p className="text-slate-400">Próximos eventos en vivo</p>
                <p className="text-amber-400 text-sm mt-2">¡Mantente atento!</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6 flex items-center justify-center hover:border-amber-500/30 transition-all duration-300">
              <div className="text-center">
                <div className="text-4xl mb-3">📱</div>
                <p className="text-slate-400">Notificaciones</p>
                <button className="text-amber-400 text-sm mt-2 hover:text-amber-300 transition-colors">
                  Activar alertas →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Eventos por Categorías - Estilo moderno */}
        <div className="mb-8">
          <h2 className="text-2xl min-[768px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6">
            🎯 Categorías de Apuestas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-[768px]:gap-6">
            {/* Fútbol */}
            <div className="bg-gradient-to-br from-green-900/30 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-500/30 hover:border-green-400/50 cursor-pointer transition-all duration-300 p-6 group"
              onClick={() => navigateToDeporte('futbol')}>
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">⚽</div>
                <h3 className="text-white font-bold mb-2">Fútbol</h3>
                <p className="text-green-300 text-sm">Liga MX, Champions, Premier League</p>
                <div className="mt-3 text-green-400 font-bold">
                  {eventos.filter(e => e.deporte.nombre.toLowerCase().includes('futbol')).length} eventos
                </div>
              </div>
            </div>

            {/* Basquetbol */}
            <div className="bg-gradient-to-br from-orange-900/30 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-orange-500/30 hover:border-orange-400/50 cursor-pointer transition-all duration-300 p-6 group"
              onClick={() => navigateToDeporte('basquetbol')}>
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🏀</div>
                <h3 className="text-white font-bold mb-2">Basquetbol</h3>
                <p className="text-orange-300 text-sm">NBA, LNBP, Euroliga</p>
                <div className="mt-3 text-orange-400 font-bold">
                  {eventos.filter(e => e.deporte.nombre.toLowerCase().includes('basquet')).length} eventos
                </div>
              </div>
            </div>

            {/* Béisbol */}
            <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-500/30 hover:border-blue-400/50 cursor-pointer transition-all duration-300 p-6 group"
              onClick={() => navigateToDeporte('beisbol')}>
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">⚾</div>
                <h3 className="text-white font-bold mb-2">Béisbol</h3>
                <p className="text-blue-300 text-sm">MLB, LMB, Serie Mundial</p>
                <div className="mt-3 text-blue-400 font-bold">
                  {eventos.filter(e => e.deporte.nombre.toLowerCase().includes('beisbol')).length} eventos
                </div>
              </div>
            </div>

            {/* Tenis */}
            <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/30 hover:border-purple-400/50 cursor-pointer transition-all duration-300 p-6 group"
              onClick={() => navigateToDeporte('tenis')}>
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🎾</div>
                <h3 className="text-white font-bold mb-2">Tenis</h3>
                <p className="text-purple-300 text-sm">ATP, WTA, Grand Slams</p>
                <div className="mt-3 text-purple-400 font-bold">
                  {eventos.filter(e => e.deporte.nombre.toLowerCase().includes('tenis')).length} eventos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mis Apuestas Activas - Estilo moderno */}
        {apuestasActivas && apuestasActivas.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl min-[768px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                🎯 Mis Apuestas Activas
              </h2>
              <button
                onClick={navigateToMisApuestas}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-2"
              >
                <span>Ver todas</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-[768px]:gap-6">
              {apuestasActivas.slice(0, 3).map((apuesta) => (
                <div
                  key={apuesta.id}
                  className="bg-gradient-to-br from-yellow-900/20 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-500/30 p-4 min-[768px]:p-6 hover:border-yellow-400/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-yellow-600/20 border border-yellow-500/50 text-yellow-400 px-2 py-1 rounded-lg font-medium">
                      {apuesta.estado}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(apuesta.fechaCreacion)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {apuesta.eventoDeportivo.equipoLocal} vs {apuesta.eventoDeportivo.equipoVisitante}
                    </h3>
                    <p className="text-slate-400 text-xs">
                      {apuesta.prediccion} - Cuota: {apuesta.valorCuotaMomento}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-bold">
                        {formatCurrency(apuesta.montoApostado)}
                      </p>
                      <p className="text-xs text-gray-400">Apostado</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">
                        {formatCurrency(apuesta.montoPotencialGanancia || 0)}
                      </p>
                      <p className="text-xs text-gray-400">Ganancia pot.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apuestas Recientes */}
        {apuestasRecientes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl min-[768px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6">
              📈 Mis Últimas Apuestas
            </h2>
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
              <div className="p-4 min-[768px]:p-6">
                <div className="space-y-3">
                  {apuestasRecientes.map((apuesta, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-b-0">
                      <div>
                        <p className="text-white text-sm font-medium">{apuesta.eventoNombre}</p>
                        <p className="text-slate-400 text-xs">{apuesta.prediccion}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">{formatCurrency(apuesta.montoApostado)}</p>
                        <p className="text-slate-400 text-xs">{apuesta.estado}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ApuestasDeportivasPage;