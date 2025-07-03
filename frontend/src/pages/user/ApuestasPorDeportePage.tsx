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

            eventos.forEach(evento => {
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
        <div className="min-h-screen bg-casino-gradient p-4 w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="bg-dark-800 rounded-xl p-6 border border-primary-600/30 shadow-casino">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <span className="text-4xl mr-4">{deporteInfo.emoji}</span>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Apuestas de {deporteInfo.nombre}
                                </h1>
                                <p className="text-gray-300">
                                    Encuentra los mejores eventos y cuotas organizados por liga
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate.goBack()}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            ← Volver
                        </button>
                    </div>

                    {/* Selector de deportes */}
                    <div className="flex gap-2 overflow-x-auto">
                        {['futbol', 'basquetbol', 'beisbol', 'tenis'].map((deporte) => {
                            const info = getDeporteInfo(deporte);
                            return (
                                <button
                                    key={deporte}
                                    onClick={() => cambiarDeporte(deporte)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${deporte === deporte
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-dark-700 text-gray-300 hover:bg-dark-600 border border-primary-600/30'
                                        }`}
                                >
                                    <span className="text-lg">{info.emoji}</span>
                                    {info.nombre}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-dark-800 rounded-lg p-4 border border-primary-600/30 animate-pulse">
                            <div className="h-6 bg-dark-700 rounded mb-4 w-1/3"></div>
                            <div className="space-y-3">
                                <div className="h-20 bg-dark-700 rounded"></div>
                                <div className="h-20 bg-dark-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : Object.keys(eventosPorLiga).length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">{deporteInfo.emoji}</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        No hay eventos disponibles
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Actualmente no hay eventos de {deporteInfo.nombre} para apostar
                    </p>
                    <button
                        onClick={() => cambiarDeporte('futbol')}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Ver Fútbol
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Estadísticas rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-dark-800 rounded-lg p-4 border border-primary-600/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total de Eventos</p>
                                    <p className="text-2xl font-bold text-white">{eventos.length}</p>
                                </div>
                                <div className="text-3xl">🏟️</div>
                            </div>
                        </div>
                        <div className="bg-dark-800 rounded-lg p-4 border border-primary-600/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Ligas Disponibles</p>
                                    <p className="text-2xl font-bold text-primary-400">
                                        {Object.keys(eventosPorLiga).length}
                                    </p>
                                </div>
                                <div className="text-3xl">🏆</div>
                            </div>
                        </div>
                        <div className="bg-dark-800 rounded-lg p-4 border border-primary-600/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Mejores Cuotas</p>
                                    <p className="text-2xl font-bold text-green-400">2.5x</p>
                                </div>
                                <div className="text-3xl">💰</div>
                            </div>
                        </div>
                    </div>

                    {/* Acordeones por liga */}
                    {Object.entries(eventosPorLiga).map(([liga, eventosLiga]) => (
                        <div key={liga} className="bg-dark-800 rounded-lg border border-primary-600/30 overflow-hidden">
                            {/* Header del acordeón */}
                            <button
                                onClick={() => toggleLiga(liga)}
                                className="w-full p-4 text-left hover:bg-dark-700 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">🏆</span>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">{liga}</h3>
                                            <p className="text-gray-400 text-sm">
                                                {eventosLiga.length} evento{eventosLiga.length !== 1 ? 's' : ''} disponible{eventosLiga.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-primary-400 text-sm mr-3">
                                            {ligasAbiertas.has(liga) ? 'Ocultar' : 'Mostrar'}
                                        </span>
                                        <svg
                                            className={`w-6 h-6 text-primary-400 transition-transform duration-200 ${ligasAbiertas.has(liga) ? 'rotate-180' : ''
                                                }`}
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
                                <div className="border-t border-primary-600/30">
                                    <div className="p-4 space-y-4">
                                        {eventosLiga.map((evento) => (
                                            <div
                                                key={evento.id}
                                                className="bg-dark-700 rounded-lg p-3 border border-primary-600/20 hover:border-primary-500/40 transition-all duration-200"
                                            >
                                                <div className="flex items-center justify-between">
                                                    {/* Fecha y estado */}
                                                    <div className="flex items-center">
                                                        <span className="text-xs text-primary-400 font-medium mr-2">
                                                            {formatDate(evento.fechaEvento)}
                                                        </span>
                                                        {evento.estado === 'en_vivo' && (
                                                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                                                LIVE
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Equipos */}
                                                    <div className="flex items-center gap-3 flex-1 justify-center">
                                                        <span className="text-white font-medium text-sm truncate max-w-[100px]">
                                                            {evento.equipoLocal}
                                                        </span>
                                                        <span className="text-gray-400 text-sm">vs</span>
                                                        <span className="text-white font-medium text-sm truncate max-w-[100px]">
                                                            {evento.equipoVisitante}
                                                        </span>
                                                    </div>

                                                    {/* Botones de apuesta compactos */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleQuickBet(evento, 'Victoria Local', 2.1)}
                                                            className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 hover:border-green-400/50 text-green-400 hover:text-green-300 px-3 py-1 rounded text-xs font-bold transition-all duration-200 flex flex-col items-center"
                                                        >
                                                            <span className="text-gray-300 text-xs">Local</span>
                                                            <span>2.10</span>
                                                        </button>

                                                        <button
                                                            onClick={() => handleQuickBet(evento, 'Empate', 3.2)}
                                                            className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 hover:border-yellow-400/50 text-yellow-400 hover:text-yellow-300 px-3 py-1 rounded text-xs font-bold transition-all duration-200 flex flex-col items-center"
                                                        >
                                                            <span className="text-gray-300 text-xs">Empate</span>
                                                            <span>3.20</span>
                                                        </button>

                                                        <button
                                                            onClick={() => handleQuickBet(evento, 'Victoria Visitante', 2.8)}
                                                            className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 px-3 py-1 rounded text-xs font-bold transition-all duration-200 flex flex-col items-center"
                                                        >
                                                            <span className="text-gray-300 text-xs">Visitante</span>
                                                            <span>2.80</span>
                                                        </button>

                                                        {/* Botón para más opciones */}
                                                        <button
                                                            onClick={() => {navigate.push(USER_ROUTES.APUESTAS_DETAIL
                                                                .replace(':fecha', evento.fechaEvento)
                                                                .replace(':nombreEvento', evento.nombreEvento))}}
                                                            className="bg-primary-600/20 hover:bg-primary-600/40 border border-primary-500/30 hover:border-primary-400/50 text-primary-400 hover:text-primary-300 px-3 py-1 rounded text-sm font-medium transition-all duration-200"
                                                        >
                                                            +150
                                                        </button>
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
    );
};

export default ApuestasPorDeportePage;