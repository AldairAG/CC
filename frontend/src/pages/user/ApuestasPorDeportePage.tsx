import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useEventoDeportivo } from '../../hooks/useEventoDeportivo';
import { useCarritoApuestas } from '../../hooks/useCarritoApuestas';
import { TipoApuesta } from '../../types/ApuestaType';
import type { EventoDeportivoType } from '../../types/EventoDeportivoTypes';
import { USER_ROUTES } from '../../constants/ROUTERS';

interface EventosPorLiga {
    [liga: string]: EventoDeportivoType[];
}

const ApuestasPorDeportePage = () => {
    const { deporte } = useParams<{ deporte: string }>();
    const navigate = useHistory();
    const { eventos, cargarEventosPorDeporte, loading } = useEventoDeportivo();
    const { agregarApuesta } = useCarritoApuestas();

    // Estados locales
    const [ligasAbiertas, setLigasAbiertas] = useState<Set<string>>(new Set());
    const [eventosPorLiga, setEventosPorLiga] = useState<EventosPorLiga>({});

    // Cargar eventos cuando cambie el deporte
    useEffect(() => {
        if (deporte) {
            cargarEventosPorDeporte(deporte);
        }
    }, [deporte, cargarEventosPorDeporte]);

    // Organizar eventos por liga con prioridad mexicana
    useEffect(() => {
        if (eventos.length > 0) {
            const eventosPorLigaTemp: EventosPorLiga = {};

            // Filtrar solo eventos programados y en vivo
            const eventosDisponibles = eventos.filter(evento => 
                evento.estado === 'programado' || evento.estado === 'en_vivo'
            );

            eventosDisponibles.forEach(evento => {
                const ligaNombre = evento.liga.nombre;
                if (!eventosPorLigaTemp[ligaNombre]) {
                    eventosPorLigaTemp[ligaNombre] = [];
                }
                eventosPorLigaTemp[ligaNombre].push(evento);
            });

            // Ordenar las ligas por popularidad en México
            const ligasOrdenadas = ordenarLigasPorPopularidad(eventosPorLigaTemp, deporte);
            setEventosPorLiga(ligasOrdenadas);

            // Abrir automáticamente las 2 primeras ligas
            const primerasLigas = Object.keys(ligasOrdenadas).slice(0, 2);
            setLigasAbiertas(new Set(primerasLigas));
        }
    }, [eventos, deporte]);

    // Función para ordenar ligas por popularidad mexicana
    const ordenarLigasPorPopularidad = (ligas: EventosPorLiga, deporte: string): EventosPorLiga => {
        const popularidadMexicana: { [key: string]: string[] } = {
            futbol: [
                'Liga MX', 'Liga de Expansión MX', 'Premier League', 'La Liga', 'Serie A',
                'Bundesliga', 'Ligue 1', 'Champions League', 'Europa League', 'MLS'
            ],
            basquetbol: [
                'LNBP', 'NBA', 'Liga ACB', 'EuroLeague', 'Basketball Champions League'
            ],
            beisbol: [
                'LMB', 'MLB', 'Liga del Pacífico', 'Serie del Caribe'
            ],
            tenis: [
                'ATP Masters', 'WTA Premier', 'Grand Slam', 'ATP 500', 'WTA International'
            ]
        };

        const ordenPrioridad = popularidadMexicana[deporte] || [];
        const ligasOrdenadas: EventosPorLiga = {};

        // Primero agregar las ligas en orden de prioridad
        ordenPrioridad.forEach(ligaPrioritaria => {
            Object.keys(ligas).forEach(liga => {
                if (liga.toLowerCase().includes(ligaPrioritaria.toLowerCase()) ||
                    ligaPrioritaria.toLowerCase().includes(liga.toLowerCase())) {
                    ligasOrdenadas[liga] = ligas[liga];
                }
            });
        });

        // Luego agregar las ligas restantes alfabéticamente
        const ligasRestantes = Object.keys(ligas)
            .filter(liga => !Object.keys(ligasOrdenadas).includes(liga))
            .sort();

        ligasRestantes.forEach(liga => {
            ligasOrdenadas[liga] = ligas[liga];
        });

        return ligasOrdenadas;
    };

    // Función para alternar acordeón
    const toggleLiga = (liga: string) => {
        const nuevasLigasAbiertas = new Set(ligasAbiertas);
        if (nuevasLigasAbiertas.has(liga)) {
            nuevasLigasAbiertas.delete(liga);
        } else {
            nuevasLigasAbiertas.add(liga);
        }
        setLigasAbiertas(nuevasLigasAbiertas);
    };

    // Función para agregar apuesta
    const handleQuickBet = (evento: EventoDeportivoType, prediccion: string, cuota: number) => {
        const cuotaId = Math.floor(Math.random() * 1000);
        agregarApuesta(
            evento,
            TipoApuesta.RESULTADO_GENERAL,
            prediccion,
            cuota,
            cuotaId,
            10
        );
    };

    // Función para formatear fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Función para cambiar deporte
    const cambiarDeporte = (nuevoDeporte: string) => {
        navigate.push(`?deporte=${nuevoDeporte}`);
    };

    // Obtener emoji y nombre del deporte
    const getDeporteInfo = (deporte: string) => {
        const deportesInfo: { [key: string]: { emoji: string; nombre: string } } = {
            futbol: { emoji: '⚽', nombre: 'Fútbol' },
            basquetbol: { emoji: '🏀', nombre: 'Basquetbol' },
            beisbol: { emoji: '⚾', nombre: 'Béisbol' },
            tenis: { emoji: '🎾', nombre: 'Tenis' }
        };
        return deportesInfo[deporte] || { emoji: '🏟️', nombre: deporte };
    };

    const deporteInfo = getDeporteInfo(deporte);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
            {/* Header del Evento - Estilo moderno */}
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
                            onClick={() => navigate.goBack()}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 hover:border-amber-500/50 rounded-xl transition-all duration-300 text-slate-300 hover:text-amber-400 backdrop-blur-sm group self-start text-base"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium">Volver</span>
                        </button>

                        {/* Información del Deporte - Centro */}
                        <div className="flex-1 text-center max-[767px]:order-first">
                            <div className="relative mb-4">
                                <h1 className="text-3xl min-[480px]:text-4xl min-[768px]:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 leading-tight">
                                    <div className="flex flex-col items-center justify-center gap-2 min-[768px]:flex-row min-[768px]:gap-4">
                                        <span className="text-4xl min-[768px]:text-5xl">{deporteInfo.emoji}</span>
                                        <span>Apuestas de {deporteInfo.nombre}</span>
                                    </div>
                                </h1>
                            </div>

                            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                                Encuentra los mejores eventos y cuotas organizados por liga
                            </p>
                        </div>

                        {/* Información adicional */}
                        <div className="text-center min-[768px]:text-right bg-slate-800/30 rounded-xl p-4 backdrop-blur-sm border border-slate-600/30 self-center min-[768px]:self-auto">
                            <div className="text-xs text-slate-400 mb-1 font-medium">Deporte Activo</div>
                            <div className="font-black text-lg capitalize text-amber-400">
                                {deporteInfo.nombre}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selector de deportes - Estilo moderno */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-amber-500/20 sticky top-0 z-10 backdrop-blur-sm">
                <div className="w-full max-w-7xl mx-auto px-4">
                    <div className="space-x-2 overflow-x-auto py-4 scrollbar-hide scroll-smooth" style={{ scrollSnapType: 'x mandatory' }}>
                        {['futbol', 'basquetbol', 'beisbol', 'tenis'].map((deporteOption) => {
                            const info = getDeporteInfo(deporteOption);
                            return (
                                <button
                                    key={deporteOption}
                                    onClick={() => cambiarDeporte(deporteOption)}
                                    className={`group whitespace-nowrap px-4 py-3 min-[768px]:px-6 text-sm font-semibold rounded-xl transition-all duration-300 flex-shrink-0 min-w-fit relative overflow-hidden touch-manipulation ${deporteOption === deporte
                                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25 scale-105'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-600/30 hover:border-amber-500/50 bg-slate-800/30 backdrop-blur-sm active:scale-95'
                                    }`}
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    <div className="relative z-10 flex items-center gap-2">
                                        <span className="text-lg">{info.emoji}</span>
                                        <span>{info.nombre}</span>
                                    </div>
                                    {deporteOption === deporte && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: '0',
                                            background: 'linear-gradient(to right, rgba(251, 191, 36, 0.2), rgba(249, 115, 22, 0.2))',
                                            filter: 'blur(4px)'
                                        }}></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="w-full max-w-7xl mx-auto px-4 py-6 min-[768px]:py-8">
                {loading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gradient-to-r from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6 animate-pulse">
                                <div className="h-8 bg-slate-700/50 rounded-xl mb-6 w-1/3"></div>
                                <div className="space-y-4">
                                    <div className="h-20 bg-slate-700/50 rounded-xl"></div>
                                    <div className="h-20 bg-slate-700/50 rounded-xl"></div>
                                    <div className="h-20 bg-slate-700/50 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : Object.keys(eventosPorLiga).length === 0 ? (
                    <div className="text-center py-12 min-[768px]:py-20">
                        <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 min-[768px]:p-12 max-w-2xl mx-auto">
                            <div className="text-6xl min-[768px]:text-8xl mb-6 animate-bounce">{deporteInfo.emoji}</div>
                            <h2 className="text-2xl min-[768px]:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
                                No hay eventos disponibles
                            </h2>
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                Actualmente no hay eventos de {deporteInfo.nombre} programados o en vivo para apostar
                            </p>
                            <button
                                onClick={() => cambiarDeporte('futbol')}
                                className="group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-amber-500/25"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <span className="text-2xl">⚽</span>
                                    Ver Fútbol
                                </span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Estadísticas rápidas - Estilo moderno */}
                        <div className="grid grid-cols-3 min-[768px]:grid-cols-3 gap-3 min-[768px]:gap-6 mb-6 min-[768px]:mb-8">
                            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl min-[768px]:rounded-2xl shadow-2xl border border-slate-700/50 p-3 min-[768px]:p-6 hover:border-amber-500/30 transition-all duration-300 group">
                                <div className="flex flex-col min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between">
                                    <div className="text-center min-[768px]:text-left">
                                        <p className="text-slate-400 text-xs min-[768px]:text-sm font-medium mb-1">Eventos</p>
                                        <p className="text-lg min-[768px]:text-2xl min-[1024px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                                            {Object.values(eventosPorLiga).reduce((total, eventos) => total + eventos.length, 0)}
                                        </p>
                                    </div>
                                    <div className="text-2xl min-[768px]:text-3xl min-[1024px]:text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300 text-center mt-1 min-[768px]:mt-0">🏟️</div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl min-[768px]:rounded-2xl shadow-2xl border border-slate-700/50 p-3 min-[768px]:p-6 hover:border-amber-500/30 transition-all duration-300 group">
                                <div className="flex flex-col min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between">
                                    <div className="text-center min-[768px]:text-left">
                                        <p className="text-slate-400 text-xs min-[768px]:text-sm font-medium mb-1">Ligas</p>
                                        <p className="text-lg min-[768px]:text-2xl min-[1024px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                                            {Object.keys(eventosPorLiga).length}
                                        </p>
                                    </div>
                                    <div className="text-2xl min-[768px]:text-3xl min-[1024px]:text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300 text-center mt-1 min-[768px]:mt-0">🏆</div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-xl min-[768px]:rounded-2xl shadow-2xl border border-slate-700/50 p-3 min-[768px]:p-6 hover:border-amber-500/30 transition-all duration-300 group">
                                <div className="flex flex-col min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between">
                                    <div className="text-center min-[768px]:text-left">
                                        <p className="text-slate-400 text-xs min-[768px]:text-sm font-medium mb-1">Cuotas</p>
                                        <p className="text-lg min-[768px]:text-2xl min-[1024px]:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                            2.5x
                                        </p>
                                    </div>
                                    <div className="text-2xl min-[768px]:text-3xl min-[1024px]:text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300 text-center mt-1 min-[768px]:mt-0">💰</div>
                                </div>
                            </div>
                        </div>

                        {/* Acordeones por liga - Estilo moderno */}
                        {Object.entries(eventosPorLiga).map(([liga, eventosLiga]) => (
                            <div key={liga} className="group bg-gradient-to-r from-slate-800/60 via-slate-800/80 to-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 overflow-hidden">
                                
                                {/* Header del acordeón */}
                                <button
                                    onClick={() => toggleLiga(liga)}
                                    className="w-full px-4 min-[768px]:px-6 py-4 min-[768px]:py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-amber-600/5 hover:to-orange-600/5 transition-all duration-300 touch-manipulation active:scale-[0.98]"
                                >
                                    <div className="flex items-center space-x-3 min-[768px]:space-x-4 flex-1">
                                        <div className="w-10 h-10 min-[768px]:w-12 min-[768px]:h-12 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-amber-500/30">
                                            <span className="text-xl min-[768px]:text-2xl">🏆</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-black text-lg min-[768px]:text-xl mb-1">{liga}</h3>
                                            <p className="text-slate-400 text-xs min-[768px]:text-sm font-medium">
                                                {eventosLiga.length} evento{eventosLiga.length !== 1 ? 's' : ''} disponible{eventosLiga.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 min-[768px]:gap-3 ml-2 min-[768px]:ml-4 flex-shrink-0">
                                        <span className="hidden min-[768px]:block text-amber-400 text-sm font-medium">
                                            {ligasAbiertas.has(liga) ? 'Ocultar' : 'Mostrar'}
                                        </span>
                                        <div className="w-7 h-7 min-[768px]:w-8 min-[768px]:h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                                            <svg
                                                className={`w-4 h-4 min-[768px]:w-5 min-[768px]:h-5 text-amber-400 transition-transform duration-300 ${ligasAbiertas.has(liga) ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>

                                {/* Contenido del acordeón */}
                                {ligasAbiertas.has(liga) && (
                                    <div className="border-t border-slate-700/50">
                                        <div className="p-4 min-[768px]:p-6 space-y-3 min-[768px]:space-y-4">
                                            {eventosLiga.map((evento) => (
                                                <div
                                                    key={evento.id}
                                                    className="bg-gradient-to-r from-slate-700/60 via-slate-700/80 to-slate-700/60 backdrop-blur-sm rounded-xl border border-slate-600/30 hover:border-amber-500/40 transition-all duration-300 group-hover:shadow-lg overflow-hidden"
                                                >
                                                    {/* Diseño móvil compacto - Versión alternativa */}
                                                    <div className="block min-[768px]:hidden">
                                                        <div className="p-4">
                                                            {/* Card header con equipos prominentes */}
                                                            <div className="bg-gradient-to-r from-slate-600/30 to-slate-800/30 rounded-lg p-3 mb-3">
                                                                <div className="text-center mb-3">
                                                                    <div className="flex items-center justify-center gap-3 mb-2">
                                                                        <div className="flex-1 text-center">
                                                                            <div className="text-white font-bold text-base leading-tight mb-1">
                                                                                {evento.equipoLocal}
                                                                            </div>
                                                                            <div className="text-green-400 text-xs font-medium">LOCAL</div>
                                                                        </div>
                                                                        
                                                                        <div className="flex flex-col items-center px-3">
                                                                            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center mb-1">
                                                                                <span className="text-amber-400 text-sm font-bold">VS</span>
                                                                            </div>
                                                                            {evento.estado === 'en_vivo' && (
                                                                                <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                                                                                    LIVE
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        <div className="flex-1 text-center">
                                                                            <div className="text-white font-bold text-base leading-tight mb-1">
                                                                                {evento.equipoVisitante}
                                                                            </div>
                                                                            <div className="text-blue-400 text-xs font-medium">VISITANTE</div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Fecha */}
                                                                    <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        <span>{formatDate(evento.fechaEvento)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Apuestas rápidas en diseño de tarjetas */}
                                                            <div className="space-y-2">
                                                                <div className="text-slate-400 text-xs font-medium mb-2 text-center">
                                                                    💰 Apuestas Rápidas
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-3 gap-2 mb-2">
                                                                    <button
                                                                        onClick={() => handleQuickBet(evento, 'Victoria Local', 2.1)}
                                                                        className="bg-gradient-to-b from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/40 text-green-400 py-3 rounded-lg text-xs font-bold transition-all duration-300 backdrop-blur-sm active:scale-95 flex flex-col items-center"
                                                                    >
                                                                        <div className="text-white text-sm font-bold mb-1">LOCAL</div>
                                                                        <div className="text-green-300 text-lg font-black">2.10</div>
                                                                    </button>

                                                                    <button
                                                                        onClick={() => handleQuickBet(evento, 'Empate', 3.2)}
                                                                        className="bg-gradient-to-b from-yellow-500/20 to-yellow-600/20 hover:from-yellow-500/30 hover:to-yellow-600/30 border border-yellow-500/40 text-yellow-400 py-3 rounded-lg text-xs font-bold transition-all duration-300 backdrop-blur-sm active:scale-95 flex flex-col items-center"
                                                                    >
                                                                        <div className="text-white text-sm font-bold mb-1">EMPATE</div>
                                                                        <div className="text-yellow-300 text-lg font-black">3.20</div>
                                                                    </button>

                                                                    <button
                                                                        onClick={() => handleQuickBet(evento, 'Victoria Visitante', 2.8)}
                                                                        className="bg-gradient-to-b from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-500/40 text-blue-400 py-3 rounded-lg text-xs font-bold transition-all duration-300 backdrop-blur-sm active:scale-95 flex flex-col items-center"
                                                                    >
                                                                        <div className="text-white text-sm font-bold mb-1">VISITANTE</div>
                                                                        <div className="text-blue-300 text-lg font-black">2.80</div>
                                                                    </button>
                                                                </div>

                                                                {/* Botón de más opciones destacado */}
                                                                <button
                                                                    onClick={() => {navigate.push(USER_ROUTES.APUESTAS_DETAIL
                                                                        .replace(':fecha', evento.fechaEvento)
                                                                        .replace(':nombreEvento', evento.nombreEvento))}}
                                                                    className="w-full bg-gradient-to-r from-amber-600/30 to-orange-600/30 hover:from-amber-600/40 hover:to-orange-600/40 border border-amber-500/50 text-amber-400 py-3 rounded-lg text-sm font-bold transition-all duration-300 backdrop-blur-sm active:scale-95 flex items-center justify-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                    </svg>
                                                                    <span>VER MÁS APUESTAS (+150 opciones)</span>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Diseño desktop (mantenemos el original) */}
                                                    <div className="hidden min-[768px]:block">
                                                        <div className="p-4">
                                                            <div className="flex flex-col min-[768px]:flex-row min-[768px]:items-center gap-4">
                                                                {/* Fecha y estado */}
                                                                <div className="flex items-center gap-3 min-[768px]:min-w-[200px]">
                                                                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm">
                                                                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                        </svg>
                                                                        <span className="text-xs text-amber-400 font-medium">
                                                                            {formatDate(evento.fechaEvento)}
                                                                        </span>
                                                                    </div>
                                                                    {evento.estado === 'en_vivo' && (
                                                                        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-red-500 rounded-lg shadow-lg">
                                                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                                            <span className="text-white text-xs font-bold">EN VIVO</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Equipos */}
                                                                <div className="flex-1 flex items-center justify-center gap-4 min-[768px]:gap-6">
                                                                    <div className="text-center flex-1 max-w-[140px]">
                                                                        <div className="text-white font-bold text-sm min-[768px]:text-base truncate">
                                                                            {evento.equipoLocal}
                                                                        </div>
                                                                        <div className="text-slate-400 text-xs">Local</div>
                                                                    </div>
                                                                    
                                                                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm">
                                                                        <span className="text-slate-400 text-sm font-medium">VS</span>
                                                                    </div>
                                                                    
                                                                    <div className="text-center flex-1 max-w-[140px]">
                                                                        <div className="text-white font-bold text-sm min-[768px]:text-base truncate">
                                                                            {evento.equipoVisitante}
                                                                        </div>
                                                                        <div className="text-slate-400 text-xs">Visitante</div>
                                                                    </div>
                                                                </div>

                                                                {/* Botones de apuesta modernos */}
                                                                <div className="flex items-center gap-2 min-[768px]:gap-3 justify-center min-[768px]:justify-end">
                                                                    <button
                                                                        onClick={() => handleQuickBet(evento, 'Victoria Local', 2.1)}
                                                                        className="group bg-gradient-to-r from-green-600/20 to-green-500/20 hover:from-green-600/30 hover:to-green-500/30 border border-green-500/30 hover:border-green-400/50 text-green-400 hover:text-green-300 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center backdrop-blur-sm hover:scale-105 active:scale-95"
                                                                    >
                                                                        <span className="text-slate-300 text-xs mb-1">Local</span>
                                                                        <span className="text-sm">2.10</span>
                                                                    </button>

                                                                    <button
                                                                        onClick={() => handleQuickBet(evento, 'Empate', 3.2)}
                                                                        className="group bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 hover:from-yellow-600/30 hover:to-yellow-500/30 border border-yellow-500/30 hover:border-yellow-400/50 text-yellow-400 hover:text-yellow-300 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center backdrop-blur-sm hover:scale-105 active:scale-95"
                                                                    >
                                                                        <span className="text-slate-300 text-xs mb-1">Empate</span>
                                                                        <span className="text-sm">3.20</span>
                                                                    </button>

                                                                    <button
                                                                        onClick={() => handleQuickBet(evento, 'Victoria Visitante', 2.8)}
                                                                        className="group bg-gradient-to-r from-blue-600/20 to-blue-500/20 hover:from-blue-600/30 hover:to-blue-500/30 border border-blue-500/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center backdrop-blur-sm hover:scale-105 active:scale-95"
                                                                    >
                                                                        <span className="text-slate-300 text-xs mb-1">Visitante</span>
                                                                        <span className="text-sm">2.80</span>
                                                                    </button>

                                                                    {/* Botón para más opciones */}
                                                                    <button
                                                                        onClick={() => {navigate.push(USER_ROUTES.APUESTAS_DETAIL
                                                                            .replace(':fecha', evento.fechaEvento)
                                                                            .replace(':nombreEvento', evento.nombreEvento))}}
                                                                        className="group bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 hover:border-amber-400/50 text-amber-400 hover:text-amber-300 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95 flex items-center gap-2"
                                                                    >
                                                                        <span>+150</span>
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApuestasPorDeportePage;