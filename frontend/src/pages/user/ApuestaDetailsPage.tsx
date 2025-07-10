import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useEvento } from '../../hooks/useEvento';
import { useCuotasDinamicas } from '../../hooks/useCuotasDinamicas';
import { useCarritoApuestas } from '../../hooks/useCarritoApuestas';
import { TipoApuesta } from '../../types/ApuestaType';
import type { EventoDeportivoType, EstadoEvento, ResultadoEvento } from '../../types/EventoDeportivoTypes';
import { toast } from 'react-toastify';

interface BettingMarket {
  id: string;
  name: string;
  options: Array<{
    id: string;
    name: string;
    odds: number;
    isDisabled?: boolean;
  }>;
  isExpanded?: boolean;
}

const ApuestaDetailsPage = () => {
  const { nombreEvento, fecha } = useParams<{ nombreEvento: string; fecha: string }>();
  const navigate = useHistory();

  const {
    eventoActual,
    loading,
    error,
    cargarEventoPorNombreYFecha,
    limpiarEventoActual
  } = useEvento();

  const {
    cuotasEvento,
    tendenciaCuotas,
    cargarCuotasEvento
  } = useCuotasDinamicas();

  const { agregarApuesta } = useCarritoApuestas();

  const [activeTab, setActiveTab] = useState('todas');
  const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set(['resultado-final']));

  // Simular datos de mercados de apuestas basados en el ejemplo
  const [bettingMarkets] = useState<BettingMarket[]>([
    {
      id: 'resultado-final',
      name: 'Resultado Final (Tiempo Regular)',
      options: [
        { id: 'local', name: eventoActual?.equipoLocal || 'Equipo Local', odds: 1.90 },
        { id: 'empate', name: 'Empate', odds: 2.65 },
        { id: 'visitante', name: eventoActual?.equipoVisitante || 'Equipo Visitante', odds: 6.00 }
      ]
    },
    {
      id: 'clasificacion',
      name: 'Se clasificará',
      options: [
        { id: 'local-clasifica', name: eventoActual?.equipoLocal || 'Equipo Local', odds: 1.42, isDisabled: true },
        { id: 'visitante-clasifica', name: eventoActual?.equipoVisitante || 'Equipo Visitante', odds: 2.75, isDisabled: true }
      ]
    },
    {
      id: 'doble-oportunidad',
      name: 'Doble Oportunidad',
      options: [
        { id: 'local-empate', name: `${eventoActual?.equipoLocal || 'Local'}/Empate`, odds: 1.125 },
        { id: 'local-visitante', name: `${eventoActual?.equipoLocal || 'Local'}/${eventoActual?.equipoVisitante || 'Visitante'}`, odds: 1.40 },
        { id: 'visitante-empate', name: `${eventoActual?.equipoVisitante || 'Visitante'}/Empate`, odds: 1.85 }
      ]
    },
    {
      id: 'ambos-anotan',
      name: 'Ambos Equipos Anotan',
      options: [
        { id: 'si-anotan', name: 'Sí', odds: 4.00 },
        { id: 'no-anotan', name: 'No', odds: 1.222 }
      ]
    },
    {
      id: 'total-goles',
      name: 'Total Goles Over/Under',
      options: [
        { id: 'over-0.5', name: 'Over 0.5', odds: 1.25 },
        { id: 'under-0.5', name: 'Under 0.5', odds: 3.60 },
        { id: 'over-1.5', name: 'Over 1.5', odds: 2.20 },
        { id: 'under-1.5', name: 'Under 1.5', odds: 1.60 },
        { id: 'over-2.5', name: 'Over 2.5', odds: 4.75 },
        { id: 'under-2.5', name: 'Under 2.5', odds: 1.153 },
        { id: 'over-3.5', name: 'Over 3.5', odds: 9.00 },
        { id: 'under-3.5', name: 'Under 3.5', odds: 1.03 }
      ]
    },
    {
      id: 'handicap-resultado',
      name: 'Hándicap Resultado de Partido',
      options: [
        { id: 'local-minus-2', name: `${eventoActual?.equipoLocal || 'Local'} (-2)`, odds: 11.00 },
        { id: 'empate-minus-2', name: 'Empate (-2)', odds: 5.75 },
        { id: 'visitante-plus-2', name: `${eventoActual?.equipoVisitante || 'Visitante'} (+2)`, odds: 1.181 },
        { id: 'local-minus-1', name: `${eventoActual?.equipoLocal || 'Local'} (-1)`, odds: 4.333 },
        { id: 'empate-minus-1', name: 'Empate (-1)', odds: 2.95 },
        { id: 'visitante-plus-1', name: `${eventoActual?.equipoVisitante || 'Visitante'} (+1)`, odds: 1.85 }
      ]
    },
    {
      id: 'handicap-asiatico',
      name: 'Hándicap Asiático',
      options: [
        { id: 'local-minus-0.5-1', name: `${eventoActual?.equipoLocal || 'Local'} (-0.5/-1)`, odds: 2.30 },
        { id: 'visitante-plus-0.5-1', name: `${eventoActual?.equipoVisitante || 'Visitante'} (+0.5/+1)`, odds: 1.615 },
        { id: 'local-minus-0.5', name: `${eventoActual?.equipoLocal || 'Local'} (-0.5)`, odds: 1.90 },
        { id: 'visitante-plus-0.5', name: `${eventoActual?.equipoVisitante || 'Visitante'} (+0.5)`, odds: 1.909 }
      ]
    },
    {
      id: 'total-asiatico',
      name: 'Total Goles Asiático',
      options: [
        { id: 'over-1-1.5', name: 'Over 1/1.5', odds: 1.85 },
        { id: 'under-1-1.5', name: 'Under 1/1.5', odds: 1.85 },
        { id: 'over-0.5-1', name: 'Over 0.5/1', odds: 1.333 },
        { id: 'under-0.5-1', name: 'Under 0.5/1', odds: 3.00 }
      ]
    },
    {
      id: 'marcador-correcto',
      name: 'Marcador Correcto',
      options: [
        { id: '1-0', name: '1-0', odds: 6.50 },
        { id: '2-0', name: '2-0', odds: 8.00 },
        { id: '2-1', name: '2-1', odds: 9.50 },
        { id: '3-0', name: '3-0', odds: 15.00 },
        { id: '0-0', name: '0-0', odds: 8.50 },
        { id: '0-1', name: '0-1', odds: 12.00 },
        { id: '0-2', name: '0-2', odds: 25.00 },
        { id: '1-1', name: '1-1', odds: 6.00 },
        { id: '1-2', name: '1-2', odds: 18.00 },
        { id: 'otros', name: 'Cualquier otro', odds: 4.50 }
      ]
    },
    {
      id: 'anotadores',
      name: 'Primer Goleador',
      options: [
        { id: 'jugador-1', name: 'Jugador Principal Local', odds: 5.25 },
        { id: 'jugador-2', name: 'Jugador Estrella Local', odds: 7.50 },
        { id: 'jugador-3', name: 'Defensor Local', odds: 19.00 },
        { id: 'jugador-4', name: 'Jugador Principal Visitante', odds: 12.00 },
        { id: 'jugador-5', name: 'Delantero Visitante', odds: 13.00 },
        { id: 'no-gol', name: 'No gol', odds: 3.60 }
      ]
    },
    {
      id: 'tarjetas',
      name: 'Total de Tarjetas',
      options: [
        { id: 'over-6.5-tarjetas', name: 'Over 6.5', odds: 2.10 },
        { id: 'under-6.5-tarjetas', name: 'Under 6.5', odds: 1.70 },
        { id: 'over-4.5-tarjetas', name: 'Over 4.5', odds: 1.65 },
        { id: 'under-4.5-tarjetas', name: 'Under 4.5', odds: 2.20 }
      ]
    },
    {
      id: 'corners',
      name: 'Tiros de Esquina',
      options: [
        { id: 'over-8-corners', name: 'Over 8', odds: 3.25 },
        { id: 'exacto-8-corners', name: 'Exacto 8', odds: 6.50 },
        { id: 'under-8-corners', name: 'Under 8', odds: 1.60 },
        { id: 'over-6-corners', name: 'Over 6', odds: 1.615 },
        { id: 'exacto-6-corners', name: 'Exacto 6', odds: 5.50 },
        { id: 'under-6-corners', name: 'Under 6', odds: 3.35 }
      ]
    },
    {
      id: 'metodo-clasificacion',
      name: 'Método de Clasificación',
      options: [
        { id: 'local-tiempo-regular', name: `${eventoActual?.equipoLocal || 'Local'} en tiempo regular`, odds: 1.90 },
        { id: 'visitante-tiempo-regular', name: `${eventoActual?.equipoVisitante || 'Visitante'} en tiempo regular`, odds: 6.00 },
        { id: 'local-penaltis', name: `${eventoActual?.equipoLocal || 'Local'} en penaltis`, odds: 4.75 },
        { id: 'visitante-penaltis', name: `${eventoActual?.equipoVisitante || 'Visitante'} en penaltis`, odds: 4.75 }
      ]
    },
    {
      id: 'mitades',
      name: 'Apuestas por Mitades',
      options: [
        { id: '2h-over-1.5', name: '2da Mitad Over 1.5', odds: 2.50 },
        { id: '2h-under-1.5', name: '2da Mitad Under 1.5', odds: 1.48 },
        { id: '2h-over-0.5', name: '2da Mitad Over 0.5', odds: 1.30 },
        { id: '2h-under-0.5', name: '2da Mitad Under 0.5', odds: 3.20 },
        { id: '2h-ambos-anotan', name: '2da Mitad - Ambos Anotan', odds: 3.75 },
        { id: '2h-resultado-local', name: '2da Mitad - Gana Local', odds: 2.80 },
        { id: '2h-resultado-empate', name: '2da Mitad - Empate', odds: 2.20 },
        { id: '2h-resultado-visitante', name: '2da Mitad - Gana Visitante', odds: 4.50 }
      ]
    },
    {
      id: 'especiales',
      name: 'Apuestas Especiales',
      options: [
        { id: 'gana-sin-recibir', name: 'Gana sin recibir gol', odds: 3.20 },
        { id: 'empate-sin-goles', name: 'Empate 0-0', odds: 8.50 },
        { id: 'mas-3-goles', name: 'Más de 3 goles', odds: 9.00 },
        { id: 'hat-trick', name: 'Alguien anota Hat-trick', odds: 25.00 },
        { id: 'gol-ultimo-minuto', name: 'Gol en minuto 90+', odds: 4.50 },
        { id: 'penalti-cobrado', name: 'Se cobra penalti', odds: 3.80 }
      ]
    },
    {
      id: 'minutos',
      name: 'Apuestas por Minutos',
      options: [
        { id: 'gol-15min', name: 'Gol en primeros 15 min', odds: 3.50 },
        { id: 'gol-45min', name: 'Gol en primer tiempo', odds: 1.85 },
        { id: 'gol-60-75', name: 'Gol entre min 60-75', odds: 2.40 },
        { id: 'gol-ultimo-15', name: 'Gol en últimos 15 min', odds: 2.80 }
      ]
    }
  ]);

  const marketTabs = [
    { id: 'todas', name: 'Todas las apuestas', shortName: 'Todas', count: 94 },
    { id: 'principales', name: 'Apuestas Principales', shortName: 'Top', count: 37 },
    { id: 'resultado', name: 'Resultado del Partido', shortName: '1X2', count: 26 },
    { id: 'goles', name: 'Goles', shortName: 'Goles', count: 34 },
    { id: 'mitades', name: 'Apuestas por mitades', shortName: 'Mitades', count: 21 },
    { id: 'corners', name: 'Tiros de Esquina', shortName: 'Córners', count: 8 },
    { id: 'anotadores', name: 'Anotadores', shortName: 'Goleador', count: 5 },
    { id: 'especiales', name: 'Especiales', shortName: 'Extras', count: 3 },
    { id: 'minutos', name: 'Minutos', shortName: 'Tiempo', count: 5 }
  ];

  useEffect(() => {
    if (nombreEvento && fecha) {
      const decodedNombre = decodeURIComponent(nombreEvento);
      cargarEventoPorNombreYFecha(decodedNombre, fecha);
    }

    return () => {
      limpiarEventoActual();
    };
  }, [nombreEvento, fecha, cargarEventoPorNombreYFecha, limpiarEventoActual]);

  useEffect(() => {
    if (eventoActual?.id) {
      cargarCuotasEvento(eventoActual.id);
    }
  }, [eventoActual?.id, cargarCuotasEvento]);

  const toggleMarket = (marketId: string) => {
    setExpandedMarkets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(marketId)) {
        newSet.delete(marketId);
      } else {
        newSet.add(marketId);
      }
      return newSet;
    });
  };

  const handleBetClick = (marketName: string, optionName: string, odds: number, isDisabled?: boolean) => {
    if (isDisabled) {
      toast.warning('Esta opción no está disponible actualmente');
      return;
    }

    if (!eventoActual) {
      toast.error('No se pudo cargar la información del evento');
      return;
    }

    // Crear un objeto evento compatible con EventoDeportivoType
    const evento: EventoDeportivoType = {
      id: eventoActual.id,
      eventoIdExterno: eventoActual.eventoIdExterno || eventoActual.id.toString(),
      nombreEvento: eventoActual.nombreEvento || `${eventoActual.equipoLocal} vs ${eventoActual.equipoVisitante}`,
      liga: eventoActual.liga || { id: 1, nombre: 'Liga Desconocida', pais: 'Desconocido', activa: true, fechaCreacion: new Date().toISOString(), fechaActualizacion: new Date().toISOString() },
      deporte: eventoActual.deporte || { id: 1, nombre: 'Fútbol', codigo: 'FUTBOL', activo: true, fechaCreacion: new Date().toISOString(), fechaActualizacion: new Date().toISOString() },
      equipoLocal: eventoActual.equipoLocal,
      equipoVisitante: eventoActual.equipoVisitante,
      fechaEvento: eventoActual.fechaEvento,
      estado: eventoActual.estado as EstadoEvento,
      temporada: eventoActual.temporada,
      descripcion: eventoActual.descripcion,
      resultado: eventoActual.resultado as ResultadoEvento,
      marcadorLocal: eventoActual.marcadorLocal,
      marcadorVisitante: eventoActual.marcadorVisitante,
      fechaCreacion: eventoActual.fechaCreacion || new Date().toISOString(),
      fechaActualizacion: eventoActual.fechaActualizacion || new Date().toISOString()
    };

    // Mapear el mercado a un tipo de apuesta válido
    let tipoApuesta: TipoApuesta = TipoApuesta.RESULTADO_GENERAL;

    switch (marketName) {
      case 'Resultado Final (Tiempo Regular)':
        tipoApuesta = TipoApuesta.RESULTADO_GENERAL;
        break;
      case 'Doble Oportunidad':
        tipoApuesta = TipoApuesta.DOBLE_OPORTUNIDAD;
        break;
      case 'Ambos Equipos Anotan':
        tipoApuesta = TipoApuesta.AMBOS_EQUIPOS_ANOTAN;
        break;
      case 'Total Goles Over/Under':
        tipoApuesta = TipoApuesta.TOTAL_GOLES;
        break;
      case 'Hándicap Resultado de Partido':
        tipoApuesta = TipoApuesta.HANDICAP;
        break;
      case 'Marcador Correcto':
        tipoApuesta = TipoApuesta.RESULTADO_EXACTO;
        break;
      default:
        tipoApuesta = TipoApuesta.RESULTADO_GENERAL;
    }

    // Agregar apuesta al carrito
    const success = agregarApuesta(
      evento,
      tipoApuesta,
      optionName, // predicción
      odds, // cuota
      1, // cuotaId temporal
      0 // monto inicial
    );

    if (success) {
      toast.success(`Apuesta agregada: ${optionName} (${odds.toFixed(2)})`);
    }
  };

  const getFilteredMarkets = () => {
    switch (activeTab) {
      case 'principales':
        return bettingMarkets.filter(market =>
          ['resultado-final', 'doble-oportunidad', 'ambos-anotan', 'total-goles'].includes(market.id)
        );
      case 'resultado':
        return bettingMarkets.filter(market =>
          ['resultado-final', 'doble-oportunidad', 'handicap-resultado', 'marcador-correcto'].includes(market.id)
        );
      case 'goles':
        return bettingMarkets.filter(market =>
          ['total-goles', 'ambos-anotan', 'total-asiatico', 'anotadores'].includes(market.id)
        );
      case 'mitades':
        return bettingMarkets.filter(market => market.id === 'mitades');
      case 'corners':
        return bettingMarkets.filter(market => market.id === 'corners');
      case 'anotadores':
        return bettingMarkets.filter(market => market.id === 'anotadores');
      case 'especiales':
        return bettingMarkets.filter(market => market.id === 'especiales');
      case 'minutos':
        return bettingMarkets.filter(market => market.id === 'minutos');
      default:
        return bettingMarkets;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center bg-slate-800/60 backdrop-blur-lg p-8 min-[480px]:p-12 rounded-2xl shadow-2xl border border-amber-500/30 max-w-md w-full">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/20 border-t-amber-500 mx-auto"></div>
            <div className="rounded-full h-16 w-16 border-4 border-transparent border-t-orange-500 animate-spin mx-auto" style={{
              position: 'absolute',
              inset: '0',
              animationDelay: '0.5s',
              animationDuration: '1.5s'
            }}></div>
          </div>
          <h3 className="mt-6 text-xl font-bold text-amber-400">Cargando evento</h3>
          <p className="mt-2 text-slate-300">Obteniendo detalles del partido...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !eventoActual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center bg-slate-800/60 backdrop-blur-lg p-8 min-[480px]:p-12 rounded-2xl shadow-2xl border border-red-500/40 max-w-lg w-full">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="rounded-full bg-red-500/10 animate-ping" style={{
              position: 'absolute',
              inset: '0'
            }}></div>
          </div>
          <h2 className="text-2xl min-[480px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-4">
            Evento no encontrado
          </h2>
          <p className="text-slate-300 mb-8 text-base leading-relaxed">
            No pudimos cargar la información del evento solicitado. Por favor, verifica que la URL sea correcta.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-amber-500/25"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver atrás
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden ">
      {/* Header del Evento - Responsive con clases base */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-amber-500/20 relative overflow-hidden">
        {/* Patrón de fondo decorativo */}
        <div style={{
          position: 'absolute',
          inset: '0',
          backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYmY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+")',
          opacity: '0.3',
          zIndex: '0'
        }}></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4 min-[768px]:py-6">
          <div className="flex flex-col gap-4 min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between">

            {/* Botón Volver */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 hover:border-amber-500/50 rounded-xl transition-all duration-300 text-slate-300 hover:text-amber-400 backdrop-blur-sm group self-start text-base"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Volver</span>
            </button>

            {/* Información del Evento - Centro */}
            <div className="flex-1 text-center max-[767px]:order-first">
              {/* Título principal */}
              <div className="relative mb-4">
                <h1 className="text-2xl min-[480px]:text-3xl min-[768px]:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 leading-tight">
                  <div className="flex flex-col items-center justify-center gap-2 min-[768px]:flex-row min-[768px]:gap-4">
                    <span className="px-2 py-1 text-center">
                      <span className="block text-sm text-slate-400 mb-1 min-[768px]:hidden">Local</span>
                      <span className="block truncate max-w-[200px] min-[480px]:max-w-[250px] min-[768px]:max-w-none">{eventoActual.equipoLocal}</span>
                    </span>

                    <div className="flex items-center justify-center my-1 min-[768px]:my-0">
                      <div className="w-8 h-8 min-[768px]:w-10 min-[768px]:h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-black text-sm min-[768px]:text-base">VS</span>
                      </div>
                    </div>

                    <span className="px-2 py-1 text-center">
                      <span className="block text-sm text-slate-400 mb-1 min-[768px]:hidden">Visitante</span>
                      <span className="block truncate max-w-[200px] min-[480px]:max-w-[250px] min-[768px]:max-w-none">{eventoActual.equipoVisitante}</span>
                    </span>
                  </div>
                </h1>
              </div>

              {/* Información adicional */}
              <div className="flex flex-col space-y-2 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-center min-[480px]:space-y-0 min-[480px]:gap-4 text-slate-300">
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg backdrop-blur-sm mx-auto min-[480px]:mx-0">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {new Date(eventoActual.fechaEvento).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg backdrop-blur-sm mx-auto min-[480px]:mx-0">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium truncate max-w-[120px] min-[480px]:max-w-none">{eventoActual.liga?.nombre}</span>
                </div>

                {eventoActual.estado === 'en_vivo' && (
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 rounded-lg shadow-lg mx-auto min-[480px]:mx-0">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span className="text-white font-bold text-sm">EN VIVO</span>
                  </div>
                )}
              </div>
            </div>

            {/* Estado del partido */}
            <div className="text-center min-[768px]:text-right bg-slate-800/30 rounded-xl p-4 backdrop-blur-sm border border-slate-600/30 self-center min-[768px]:self-auto">
              <div className="text-xs text-slate-400 mb-1 font-medium">Estado</div>
              <div className={`font-black text-lg capitalize ${eventoActual.estado === 'en_vivo' ? 'text-red-400' :
                eventoActual.estado === 'programado' ? 'text-emerald-400' :
                  'text-slate-300'
                }`}>
                {eventoActual.estado.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Mercados - Responsive con clases base */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-amber-500/20 sticky top-0 z-10 backdrop-blur-sm">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="space-x-2 overflow-x-auto py-4 scrollbar-hide scroll-smooth" style={{ scrollSnapType: 'x mandatory' }}>
            {marketTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group whitespace-nowrap px-4 py-3 min-[768px]:px-6 text-sm font-semibold rounded-xl transition-all duration-300 flex-shrink-0 min-w-fit relative overflow-hidden touch-manipulation ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25 scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-600/30 hover:border-amber-500/50 bg-slate-800/30 backdrop-blur-sm active:scale-95'
                  }`}
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative z-10 flex items-center gap-2">
                  <span className="font-bold min-[768px]:hidden">
                    {tab.shortName}
                  </span>
                  <span className="hidden min-[768px]:inline">{tab.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30'
                    }`}>
                    {tab.count}
                  </span>
                </div>
                {activeTab === tab.id && (
                  <div style={{
                    position: 'absolute',
                    inset: '0',
                    background: 'linear-gradient(to right, rgba(251, 191, 36, 0.2), rgba(249, 115, 22, 0.2))',
                    filter: 'blur(4px)'
                  }}></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mercados de Apuestas - Responsive con clases base */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 min-[768px]:py-8">
        <div className="space-y-6">
          {getFilteredMarkets().map((market) => (
            <div key={market.id} className="group bg-gradient-to-r from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 overflow-hidden">

              {/* Header del Mercado */}
              <button
                onClick={() => toggleMarket(market.id)}
                className="w-full px-4 py-4 min-[768px]:px-6 min-[768px]:py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-amber-600/5 hover:to-orange-600/5 transition-all duration-300 touch-manipulation active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* Badges */}
                  <div className="flex flex-col min-[480px]:flex-row gap-1 min-[480px]:gap-2 flex-shrink-0">
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                      <span className="min-[480px]:hidden">Crear</span>
                      <span className="hidden min-[480px]:inline">Crear Apuesta</span>
                    </span>
                    <span className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                      <span className="min-[480px]:hidden">Cash</span>
                      <span className="hidden min-[480px]:inline">Cash Out</span>
                    </span>
                  </div>

                  {/* Título responsive */}
                  <h3 className="text-sm min-[768px]:text-lg font-bold text-white min-w-0 flex-1 leading-tight">
                    <span className="hidden min-[768px]:inline">{market.name}</span>
                    <span className="min-[768px]:hidden">
                      {market.name.length > 20 ? market.name.substring(0, 20) + '...' : market.name}
                    </span>
                  </h3>
                </div>

                {/* Indicador */}
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className="text-xs text-slate-400 hidden min-[480px]:inline">
                    {market.options.length} opciones
                  </span>
                  <span className="text-xs text-slate-400 min-[480px]:hidden">
                    {market.options.length}
                  </span>
                  <svg
                    className={`w-5 h-5 text-amber-400 transition-all duration-300 ${expandedMarkets.has(market.id) ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Opciones del Mercado - Grid responsive */}
              {expandedMarkets.has(market.id) && (
                <div className="px-4 pb-4 min-[768px]:px-6 min-[768px]:pb-6">
                  <div className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4 gap-3 min-[768px]:gap-4">
                    {market.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleBetClick(market.name, option.name, option.odds, option.isDisabled)}
                        disabled={option.isDisabled}
                        className={`group/option relative p-4 min-[768px]:p-5 rounded-xl text-left transition-all duration-300 min-w-0 overflow-hidden touch-manipulation ${option.isDisabled
                          ? 'bg-slate-700/30 border border-slate-600/50 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 hover:border-amber-500/50 hover:from-amber-600/10 hover:to-orange-600/10 cursor-pointer active:scale-95 shadow-lg hover:shadow-amber-500/20'
                          }`}
                      >
                        {/* Efecto de resplandor en hover - solo pantallas grandes */}
                        {!option.isDisabled && (
                          <div
                            className="transition-opacity duration-300 rounded-xl hidden min-[768px]:block"
                            style={{
                              position: 'absolute',
                              inset: '0',
                              background: 'linear-gradient(to right, rgba(245, 158, 11, 0), rgba(245, 158, 11, 0.05), rgba(249, 115, 22, 0))',
                              opacity: '0'
                            }}
                          ></div>
                        )}

                        <div className="relative z-10">
                          <div className="flex items-start justify-between min-w-0 mb-2">
                            <div className="flex-1 min-w-0 pr-2">
                              <div className={`font-semibold text-sm min-[768px]:text-base leading-tight ${option.isDisabled ? 'text-slate-500' : 'text-white group-hover/option:text-amber-100'
                                }`} title={option.name}>
                                <span className="min-[480px]:hidden">
                                  {option.name.length > 12 ? option.name.substring(0, 12) + '...' : option.name}
                                </span>
                                <span className="hidden min-[480px]:inline">
                                  {option.name}
                                </span>
                              </div>
                            </div>

                            {/* Indicador de estado */}
                            <div className="flex-shrink-0">
                              {option.isDisabled ? (
                                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                              ) : (
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                              <div className={`text-xl min-[768px]:text-2xl font-black ${option.isDisabled ? 'text-slate-500' : 'text-amber-400 group-hover/option:text-amber-300'
                                }`}>
                                {option.odds.toFixed(2)}
                              </div>
                              <div className="text-xs text-slate-400">
                                +{((option.odds - 1) * 100).toFixed(0)}%
                              </div>
                            </div>

                            {/* Icono de apuesta */}
                            {!option.isDisabled && (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 group-hover/option:bg-amber-500/30 transition-colors">
                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Widget de Cuotas Dinámicas - Responsive con clases base */}
        {cuotasEvento.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-500/30 p-6 min-[768px]:p-8 overflow-hidden relative">
            {/* Efecto de fondo */}
            <div style={{
              position: 'absolute',
              inset: '0',
              background: 'linear-gradient(to right, rgba(245, 158, 11, 0.05), transparent, rgba(249, 115, 22, 0.05))',
              borderRadius: '1rem'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '4px',
              background: 'linear-gradient(to right, #f59e0b, #f97316, #ef4444)',
              borderRadius: '1rem 1rem 0 0'
            }}></div>

            <div className="relative z-10">
              <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between mb-6 gap-2">
                <h3 className="text-lg min-[768px]:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="min-[480px]:hidden">Tendencias</span>
                  <span className="hidden min-[480px]:inline">Tendencias de Mercado</span>
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>En tiempo real</span>
                </div>
              </div>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[768px]:grid-cols-3 gap-4 min-[768px]:gap-6">
                {cuotasEvento.map((cuota) => {
                  const tendencia = tendenciaCuotas.find(t => t.tipoResultado === cuota.tipoResultado);
                  const equipoNombre = cuota.tipoResultado === 'LOCAL' ? eventoActual.equipoLocal :
                    cuota.tipoResultado === 'VISITANTE' ? eventoActual.equipoVisitante :
                      'Empate';

                  return (
                    <div key={cuota.id} className="group relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 min-[768px]:p-5 border border-slate-600/30 hover:border-amber-500/50 transition-all duration-300 active:scale-95 hover:scale-105 overflow-hidden touch-manipulation">
                      {/* Efecto de resplandor - solo pantallas grandes */}
                      <div
                        className="transition-opacity duration-300 rounded-xl hidden min-[768px]:block"
                        style={{
                          position: 'absolute',
                          inset: '0',
                          background: 'linear-gradient(to right, rgba(245, 158, 11, 0), rgba(245, 158, 11, 0.05), rgba(249, 115, 22, 0))',
                          opacity: '0'
                        }}
                      ></div>

                      <div className="relative z-10">
                        {/* Header con equipo */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className={`w-3 h-3 rounded-full ${cuota.tipoResultado === 'LOCAL' ? 'bg-blue-500' :
                              cuota.tipoResultado === 'VISITANTE' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}></div>
                            <span className="text-sm font-semibold text-slate-300 truncate" title={equipoNombre}>
                              <span className="min-[480px]:hidden">
                                {equipoNombre.length > 8 ? equipoNombre.substring(0, 8) + '...' : equipoNombre}
                              </span>
                              <span className="hidden min-[480px]:inline">
                                {equipoNombre.length > 12 ? equipoNombre.substring(0, 12) + '...' : equipoNombre}
                              </span>
                            </span>
                          </div>

                          {/* Indicador de tendencia */}
                          {tendencia && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${tendencia.tendencia === 'SUBIENDO' ? 'bg-emerald-500/20 text-emerald-400' :
                              tendencia.tendencia === 'BAJANDO' ? 'bg-red-500/20 text-red-400' :
                                'bg-slate-500/20 text-slate-400'
                              }`}>
                              <span className="text-base">
                                {tendencia.tendencia === 'SUBIENDO' ? '↗' :
                                  tendencia.tendencia === 'BAJANDO' ? '↘' :
                                    '→'}
                              </span>
                              <span className="hidden min-[480px]:inline">
                                {tendencia.tendencia === 'SUBIENDO' ? 'Sube' :
                                  tendencia.tendencia === 'BAJANDO' ? 'Baja' :
                                    'Estable'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Cuota principal */}
                        <div className="mb-3">
                          <div className="text-3xl min-[768px]:text-4xl font-black text-amber-400 group-hover:text-amber-300 transition-colors">
                            {(cuota.cuotaActual || 0).toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-400">
                            Retorno: +{((cuota.cuotaActual - 1) * 100).toFixed(0)}%
                          </div>
                        </div>

                        {/* Estadísticas adicionales */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-600/30">
                          <div className="text-xs text-slate-400 flex-1">
                            <span className="block mb-1">Popularidad</span>
                            <div className="flex items-center gap-1">
                              <div className="w-8 bg-slate-600 h-1 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                                  style={{ width: `${Math.random() * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{Math.floor(Math.random() * 100)}%</span>
                            </div>
                          </div>

                          <button className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors touch-manipulation active:scale-95 px-2 py-1 rounded-lg hover:bg-amber-500/10">
                            <span>Apostar</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApuestaDetailsPage;