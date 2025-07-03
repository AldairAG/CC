
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { useApuestasDeportivas } from '../../hooks/useApuestasDeportivas';
import { useEventoDeportivo } from '../../hooks/useEventoDeportivo';
import { useCarritoApuestas } from '../../hooks/useCarritoApuestas';
import { USER_ROUTES } from '../../constants/ROUTERS';
import type { EventoDeportivoType } from '../../types/EventoDeportivoTypes';
import { TipoApuesta } from '../../types/ApuestaType';

const ApuestasDeportivasPage = () => {
  const navigate = useHistory();
  const { user } = useUser();
  
  // Hooks
  const { 
    eventos, 
    cargarEventosProximos,
    loading: eventosLoading 
  } = useEventoDeportivo();
  
  const { 
    loadApuestasRecientes,
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
      await loadApuestasRecientes(10);
      await loadEstadisticasApuestas();
      await loadApuestasActivas(0, 5);
    };

    loadDashboardData();
  }, [cargarEventosProximos, loadApuestasRecientes, loadEstadisticasApuestas, loadApuestasActivas]);

  // Funciones de navegación
  const navigateToApuestasDeportivas = () => {
    navigate.push(USER_ROUTES.APUESTAS_DEPORTIVAS);
  };

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
    <div className="min-h-screen bg-casino-gradient p-4 w-full max-w-7xl mx-auto">
      {/* Header de bienvenida */}
      <div className="mb-8">
        <div className="bg-dark-800 rounded-xl p-6 border border-primary-600/30 shadow-casino">
          <h1 className="text-3xl font-bold text-white mb-2">
            ¡Bienvenido, {user?.username || 'Jugador'}! 🎰
          </h1>
          <p className="text-gray-300">
            Descubre las mejores apuestas deportivas y eventos del momento
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {estadisticasApuestas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-800 rounded-lg p-4 border border-primary-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Apostado</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(estadisticasApuestas.montoTotalApostado || 0)}
                </p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
          
          <div className="bg-dark-800 rounded-lg p-4 border border-primary-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Apuestas Ganadas</p>
                <p className="text-2xl font-bold text-green-400">
                  {estadisticasApuestas.apuestasGanadas || 0}
                </p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
          </div>
          
          <div className="bg-dark-800 rounded-lg p-4 border border-primary-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">% Aciertos</p>
                <p className="text-2xl font-bold text-primary-400">
                  {((estadisticasApuestas.apuestasGanadas / estadisticasApuestas.totalApuestas) * 100).toFixed(1) || 0}%
                </p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
        </div>
      )}

      {/* Sección de Promociones y Tips */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🎁 Promociones Especiales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Promoción del día */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🎯</div>
              <div>
                <h3 className="text-white font-bold text-lg">Apuesta del Día</h3>
                <p className="text-purple-300 text-sm">Cuota mejorada especial</p>
              </div>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-4 mb-4">
              <p className="text-white font-semibold mb-2">Real Madrid vs Barcelona</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Victoria Real Madrid</span>
                <span className="bg-green-600 text-white px-3 py-1 rounded font-bold">2.50</span>
              </div>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">
              ¡Apostar Ahora!
            </button>
          </div>

          {/* Tips de apuestas */}
          <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-lg p-6 border border-blue-500/30">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">💡</div>
              <div>
                <h3 className="text-white font-bold text-lg">Tip del Experto</h3>
                <p className="text-blue-300 text-sm">Consejo profesional</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-dark-800/50 rounded-lg p-3">
                <p className="text-white text-sm">
                  📈 Los equipos locales tienen un 65% más de probabilidades de ganar en partidos importantes.
                </p>
              </div>
              <div className="bg-dark-800/50 rounded-lg p-3">
                <p className="text-white text-sm">
                  ⚽ Revisa las últimas 5 actuaciones de cada equipo antes de apostar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Eventos Deportivos Populares */}
      <div className="mb-8" id="eventos-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🔥 Eventos Destacados</h2>
          <button
            onClick={navigateToApuestasDeportivas}
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Ver todos →
          </button>
        </div>

        {/* Grid de eventos */}
        {eventosLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-dark-800 rounded-lg p-4 border border-primary-600/30 animate-pulse">
                <div className="h-20 bg-dark-700 rounded mb-4"></div>
                <div className="h-4 bg-dark-700 rounded mb-2"></div>
                <div className="h-4 bg-dark-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventosDestacados.map((evento) => (
              <div
                key={evento.id}
                className="bg-dark-800 rounded-lg p-4 border border-primary-600/30 hover:border-primary-500/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-primary-400 font-medium">
                    {evento.liga.nombre}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(evento.fechaEvento)}
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-white font-medium text-sm">{evento.equipoLocal}</p>
                    </div>
                    <span className="text-gray-400 text-sm">VS</span>
                    <div className="text-center">
                      <p className="text-white font-medium text-sm">{evento.equipoVisitante}</p>
                    </div>
                  </div>
                </div>

                {/* Botones de apuesta rápida */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickBet(evento, 'Local', 2.1)}
                    className="bg-dark-700 hover:bg-primary-600/20 text-white text-xs py-2 px-3 rounded transition-colors"
                  >
                    <div>Local</div>
                    <div className="text-green-400 font-bold">2.1</div>
                  </button>
                  <button
                    onClick={() => handleQuickBet(evento, 'Empate', 3.2)}
                    className="bg-dark-700 hover:bg-primary-600/20 text-white text-xs py-2 px-3 rounded transition-colors"
                  >
                    <div>Empate</div>
                    <div className="text-green-400 font-bold">3.2</div>
                  </button>
                  <button
                    onClick={() => handleQuickBet(evento, 'Visitante', 2.8)}
                    className="bg-dark-700 hover:bg-primary-600/20 text-white text-xs py-2 px-3 rounded transition-colors"
                  >
                    <div>Visitante</div>
                    <div className="text-green-400 font-bold">2.8</div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {eventosDestacados.length === 0 && !eventosLoading && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">⚽</div>
            <p className="text-gray-400">No hay eventos disponibles</p>
          </div>
        )}
      </div>

      {/* Sección de Eventos En Vivo */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🔴 En Vivo Ahora</h2>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-red-400 text-sm font-medium">LIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Evento en vivo simulado */}
          <div className="bg-dark-800 rounded-lg p-4 border border-red-500/30 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                LIVE
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>⚽ Primera División</span>
                <span>89'</span>
              </div>
              <h3 className="text-white font-bold">América vs Chivas</h3>
            </div>

            <div className="bg-dark-700 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-white font-bold">América</p>
                  <p className="text-3xl font-bold text-green-400">2</p>
                </div>
                <div className="text-gray-400">VS</div>
                <div className="text-center">
                  <p className="text-white font-bold">Chivas</p>
                  <p className="text-3xl font-bold text-green-400">1</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button className="bg-green-600/20 border border-green-500/30 text-green-400 py-2 px-3 rounded text-xs font-bold hover:bg-green-600/30 transition-colors">
                +2.5 Goles
                <br />
                <span className="text-white">1.85</span>
              </button>
              <button className="bg-yellow-600/20 border border-yellow-500/30 text-yellow-400 py-2 px-3 rounded text-xs font-bold hover:bg-yellow-600/30 transition-colors">
                Empate
                <br />
                <span className="text-white">3.20</span>
              </button>
              <button className="bg-blue-600/20 border border-blue-500/30 text-blue-400 py-2 px-3 rounded text-xs font-bold hover:bg-blue-600/30 transition-colors">
                Corner
                <br />
                <span className="text-white">2.10</span>
              </button>
            </div>
          </div>

          {/* Más eventos en vivo pueden ir aquí */}
          <div className="bg-dark-800 rounded-lg p-4 border border-primary-600/30 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">⏰</div>
              <p className="text-gray-400">Próximos eventos en vivo</p>
              <p className="text-primary-400 text-sm mt-2">¡Mantente atento!</p>
            </div>
          </div>

          <div className="bg-dark-800 rounded-lg p-4 border border-primary-600/30 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <p className="text-gray-400">Notificaciones</p>
              <button className="text-primary-400 text-sm mt-2 hover:text-primary-300 transition-colors">
                Activar alertas →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Eventos por Categorías */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🎯 Categorías de Apuestas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fútbol */}
          <div className="bg-gradient-to-br from-green-900/30 to-dark-800 rounded-lg p-6 border border-green-500/30 hover:border-green-400/50 cursor-pointer transition-all duration-200"
               onClick={() => navigateToDeporte('futbol')}>
            <div className="text-center">
              <div className="text-4xl mb-3">⚽</div>
              <h3 className="text-white font-bold mb-2">Fútbol</h3>
              <p className="text-green-300 text-sm">Liga MX, Champions, Premier League</p>
              <div className="mt-3 text-green-400 font-bold">
                {eventos.filter(e => e.deporte.nombre.toLowerCase().includes('futbol')).length} eventos
              </div>
            </div>
          </div>

          {/* Basquetbol */}
          <div className="bg-gradient-to-br from-orange-900/30 to-dark-800 rounded-lg p-6 border border-orange-500/30 hover:border-orange-400/50 cursor-pointer transition-all duration-200"
               onClick={() => navigateToDeporte('basquetbol')}>
            <div className="text-center">
              <div className="text-4xl mb-3">🏀</div>
              <h3 className="text-white font-bold mb-2">Basquetbol</h3>
              <p className="text-orange-300 text-sm">NBA, LNBP, Euroliga</p>
              <div className="mt-3 text-orange-400 font-bold">
                {eventos.filter(e => e.deporte.nombre.toLowerCase().includes('basquet')).length} eventos
              </div>
            </div>
          </div>

          {/* Béisbol */}
          <div className="bg-gradient-to-br from-blue-900/30 to-dark-800 rounded-lg p-6 border border-blue-500/30 hover:border-blue-400/50 cursor-pointer transition-all duration-200"
               onClick={() => navigateToDeporte('beisbol')}>
            <div className="text-center">
              <div className="text-4xl mb-3">⚾</div>
              <h3 className="text-white font-bold mb-2">Béisbol</h3>
              <p className="text-blue-300 text-sm">MLB, LMB, Serie Mundial</p>
              <div className="mt-3 text-blue-400 font-bold">
                {eventos.filter(e => e.deporte.nombre.toLowerCase().includes('beisbol')).length} eventos
              </div>
            </div>
          </div>

          {/* Tenis */}
          <div className="bg-gradient-to-br from-purple-900/30 to-dark-800 rounded-lg p-6 border border-purple-500/30 hover:border-purple-400/50 cursor-pointer transition-all duration-200"
               onClick={() => navigateToDeporte('tenis')}>
            <div className="text-center">
              <div className="text-4xl mb-3">🎾</div>
              <h3 className="text-white font-bold mb-2">Tenis</h3>
              <p className="text-purple-300 text-sm">ATP, WTA, Grand Slams</p>
              <div className="mt-3 text-purple-400 font-bold">
                {eventos.filter(e => e.deporte.nombre.toLowerCase().includes('tenis')).length} eventos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mis Apuestas Activas */}
      {apuestasActivas && apuestasActivas.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">� Mis Apuestas Activas</h2>
            <button
              onClick={navigateToMisApuestas}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Ver todas →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apuestasActivas.slice(0, 3).map((apuesta) => (
              <div
                key={apuesta.id}
                className="bg-gradient-to-br from-yellow-900/20 to-dark-800 rounded-lg p-4 border border-yellow-500/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                    {apuesta.estado}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(apuesta.fechaCreacion)}
                  </span>
                </div>

                <div className="mb-3">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {apuesta.eventoDeportivo.equipoLocal} vs {apuesta.eventoDeportivo.equipoVisitante}
                  </h3>
                  <p className="text-gray-400 text-xs">
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
          <h2 className="text-2xl font-bold text-white mb-6">📈 Mis Últimas Apuestas</h2>
          <div className="bg-dark-800 rounded-lg border border-primary-600/30 overflow-hidden">
            <div className="p-4">
              <div className="space-y-3">
                {apuestasRecientes.map((apuesta, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                    <div>
                      <p className="text-white text-sm font-medium">{apuesta.eventoNombre}</p>
                      <p className="text-gray-400 text-xs">{apuesta.prediccion}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">{formatCurrency(apuesta.montoApostado)}</p>
                      <p className="text-gray-400 text-xs">{apuesta.estado}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApuestasDeportivasPage;