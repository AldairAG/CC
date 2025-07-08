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
    { id: 'todas', name: 'Todas las apuestas', count: 94 },
    { id: 'principales', name: 'Apuestas Principales', count: 37 },
    { id: 'resultado', name: 'Resultado del Partido', count: 26 },
    { id: 'goles', name: 'Goles', count: 34 },
    { id: 'mitades', name: 'Apuestas por mitades', count: 21 },
    { id: 'corners', name: 'Tiros de Esquina', count: 8 },
    { id: 'anotadores', name: 'Anotadores', count: 5 },
    { id: 'especiales', name: 'Especiales', count: 3 },
    { id: 'minutos', name: 'Minutos', count: 5 }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del evento...</p>
        </div>
      </div>
    );
  }

  if (error || !eventoActual) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Evento no encontrado</h2>
          <p className="text-gray-600 mb-6">
            No se pudo cargar la información del evento solicitado.
          </p>
          <button
            onClick={() => navigate('/eventos')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todos los eventos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Evento */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            
            <div className="text-center flex-1 mx-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {eventoActual.equipoLocal} vs {eventoActual.equipoVisitante}
              </h1>
              <div className="flex items-center justify-center mt-2 space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(eventoActual.fechaEvento).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {eventoActual.liga?.nombre}
                </span>
                {eventoActual.estado === 'en_vivo' && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                    EN VIVO
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Estado</div>
              <div className={`font-semibold capitalize ${
                eventoActual.estado === 'en_vivo' ? 'text-red-600' :
                eventoActual.estado === 'programado' ? 'text-green-600' :
                'text-gray-600'
              }`}>
                {eventoActual.estado.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Mercados */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {marketTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mercados de Apuestas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {getFilteredMarkets().map((market) => (
            <div key={market.id} className="bg-white rounded-lg shadow-sm border">
              <button
                onClick={() => toggleMarket(market.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Crear Apuesta
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Cash Out
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{market.name}</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedMarkets.has(market.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedMarkets.has(market.id) && (
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {market.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleBetClick(market.name, option.name, option.odds, option.isDisabled)}
                        disabled={option.isDisabled}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          option.isDisabled
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{option.name}</div>
                          </div>
                          <div className="ml-3">
                            <div className={`text-lg font-bold ${
                              option.isDisabled ? 'text-gray-400' : 'text-blue-600'
                            }`}>
                              {option.odds.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {((option.odds - 1) * 100).toFixed(0)}%
                            </div>
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

        {/* Widget de Cuotas Dinámicas */}
        {cuotasEvento.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tendencia de Cuotas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cuotasEvento.map((cuota) => (
                <div key={cuota.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">
                    {cuota.tipoResultado === 'LOCAL' ? eventoActual.equipoLocal :
                     cuota.tipoResultado === 'VISITANTE' ? eventoActual.equipoVisitante :
                     'Empate'}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {cuota.cuotaActual.toFixed(2)}
                  </div>
                  {tendenciaCuotas.find(t => t.tipoResultado === cuota.tipoResultado) && (
                    <div className={`text-sm ${
                      tendenciaCuotas.find(t => t.tipoResultado === cuota.tipoResultado)?.tendencia === 'SUBIENDO' ? 'text-green-600' :
                      tendenciaCuotas.find(t => t.tipoResultado === cuota.tipoResultado)?.tendencia === 'BAJANDO' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {tendenciaCuotas.find(t => t.tipoResultado === cuota.tipoResultado)?.tendencia === 'SUBIENDO' ? '↗ Subiendo' :
                       tendenciaCuotas.find(t => t.tipoResultado === cuota.tipoResultado)?.tendencia === 'BAJANDO' ? '↘ Bajando' :
                       '→ Estable'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApuestaDetailsPage;