import React, { useState, useEffect } from 'react';
import { partidoService } from '../../service/api/partidoService';
import type { EventType } from '../../types/EventType';
import type { EventoQuinielaRequest } from '../../types/QuinielaType';

interface Props {
    selectedSport: string;
    selectedLeague: string;
    eventosSeleccionados: EventoQuinielaRequest[];
    onEventosChange: (eventos: EventoQuinielaRequest[]) => void;
}

export const EnhancedEventSelector: React.FC<Props> = ({ 
    selectedSport,
    selectedLeague,
    eventosSeleccionados, 
    onEventosChange 
}) => {
    const [eventos, setEventos] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState<string>('');

    // Cargar eventos cuando cambia la liga seleccionada
    useEffect(() => {
        const loadEventos = async () => {
            if (!selectedLeague) {
                setEventos([]);
                return;
            }

            try {
                setLoading(true);
                const eventosData = await partidoService.getEventsByLeague(selectedLeague);
                
                // Filtrar eventos futuros
                const ahora = new Date();
                const eventosFuturos = eventosData.filter((evento: EventType) => {
                    if (!evento.dateEvent) return false;
                    const fechaEvento = new Date(evento.dateEvent);
                    return fechaEvento > ahora;
                });

                setEventos(eventosFuturos);
            } catch (error) {
                console.error('Error cargando eventos:', error);
                setEventos([]);
            } finally {
                setLoading(false);
            }
        };

        loadEventos();
    }, [selectedLeague]);

    // Filtrar eventos por búsqueda
    const eventosFiltrados = eventos.filter(evento =>
        !busqueda || 
        evento.strHomeTeam?.toLowerCase().includes(busqueda.toLowerCase()) ||
        evento.strAwayTeam?.toLowerCase().includes(busqueda.toLowerCase()) ||
        evento.strEvent?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleSeleccionarEvento = (evento: EventType) => {
        const eventoQuiniela: EventoQuinielaRequest = {
            eventoId: parseInt(evento.idEvent || '0'),
            nombreEvento: evento.strEvent || `${evento.strHomeTeam} vs ${evento.strAwayTeam}`,
            fechaEvento: evento.dateEvent || '',
            equipoLocal: evento.strHomeTeam || '',
            equipoVisitante: evento.strAwayTeam || '',
            puntosPorAcierto: 10,
            puntosPorResultadoExacto: 25
        };

        const nuevosEventos = [...eventosSeleccionados, eventoQuiniela];
        onEventosChange(nuevosEventos);
    };

    const handleRemoverEvento = (eventoId: number) => {
        const nuevosEventos = eventosSeleccionados.filter(e => e.eventoId !== eventoId);
        onEventosChange(nuevosEventos);
    };

    const handleActualizarPuntos = (eventoId: number, campo: 'puntosPorAcierto' | 'puntosPorResultadoExacto', valor: number) => {
        const nuevosEventos = eventosSeleccionados.map(evento =>
            evento.eventoId === eventoId ? { ...evento, [campo]: valor } : evento
        );
        onEventosChange(nuevosEventos);
    };

    const estaSeleccionado = (eventoId: string) => {
        return eventosSeleccionados.some(e => e.eventoId === parseInt(eventoId));
    };

    // Si no hay deporte o liga seleccionados
    if (!selectedSport || !selectedLeague) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    ⚽ Seleccionar Eventos
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-blue-600">ℹ️</span>
                        <p className="text-sm text-blue-800">
                            Primero selecciona un deporte y una liga para ver los eventos disponibles.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    ⚽ Seleccionar Eventos
                </h3>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    ⚽ Seleccionar Eventos ({eventosSeleccionados.length} seleccionados)
                </h3>
                
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <strong>Deporte:</strong> {selectedSport} | <strong>Liga:</strong> {eventos[0]?.strLeague || 'Cargando...'}
                    </p>
                </div>

                {/* Buscador */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar evento
                    </label>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por equipos o evento..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Eventos seleccionados */}
            {eventosSeleccionados.length > 0 && (
                <div>
                    <h4 className="font-medium text-gray-800 mb-3">Eventos Seleccionados:</h4>
                    <div className="space-y-3">
                        {eventosSeleccionados.map((evento) => (
                            <div key={evento.eventoId} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h5 className="font-semibold text-gray-800">{evento.nombreEvento}</h5>
                                        <p className="text-sm text-gray-600">
                                            {evento.equipoLocal} vs {evento.equipoVisitante}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(evento.fechaEvento).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoverEvento(evento.eventoId)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        ✕ Remover
                                    </button>
                                </div>

                                {/* Configuración de puntos */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Puntos por acierto
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={evento.puntosPorAcierto}
                                            onChange={(e) => handleActualizarPuntos(
                                                evento.eventoId, 
                                                'puntosPorAcierto', 
                                                parseInt(e.target.value) || 10
                                            )}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Puntos resultado exacto
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={evento.puntosPorResultadoExacto}
                                            onChange={(e) => handleActualizarPuntos(
                                                evento.eventoId, 
                                                'puntosPorResultadoExacto', 
                                                parseInt(e.target.value) || 25
                                            )}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lista de eventos disponibles */}
            <div>
                <h4 className="font-medium text-gray-800 mb-3">
                    Eventos Disponibles ({eventosFiltrados.length}):
                </h4>
                
                {eventosFiltrados.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No hay eventos disponibles en esta liga.</p>
                        <p className="text-sm mt-2">Intenta seleccionar otra liga o deporte.</p>
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
                        {eventosFiltrados.map((evento) => {
                            const seleccionado = estaSeleccionado(evento.idEvent || '0');
                            
                            return (
                                <div
                                    key={evento.idEvent}
                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                        seleccionado
                                            ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-blue-300'
                                    }`}
                                    onClick={() => !seleccionado && handleSeleccionarEvento(evento)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 text-sm">
                                                {evento.strEvent || `${evento.strHomeTeam} vs ${evento.strAwayTeam}`}
                                            </h5>
                                            <p className="text-sm text-gray-600">
                                                {evento.strHomeTeam} vs {evento.strAwayTeam}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    📅 {new Date(evento.dateEvent || '').toLocaleDateString('es-ES')}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    🕐 {evento.strTime || 'Hora TBD'}
                                                </span>
                                                {evento.strLeague && (
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {evento.strLeague}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="ml-4">
                                            {seleccionado ? (
                                                <span className="text-xs text-green-600 font-medium">
                                                    ✓ Seleccionado
                                                </span>
                                            ) : (
                                                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                                    + Agregar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {eventosSeleccionados.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-yellow-600">⚠️</span>
                        <p className="text-sm text-yellow-800">
                            Debes seleccionar al menos un evento para crear la quiniela.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
