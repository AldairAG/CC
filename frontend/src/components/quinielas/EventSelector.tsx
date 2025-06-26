import React, { useState, useEffect } from 'react';
import type { EventoResponse } from '../../service/api/eventosAPI';
import type { EventoQuinielaRequest } from '../../types/QuinielaType';
import { useEventos } from '../../hooks/useEventos';

interface Props {
    eventosSeleccionados: EventoQuinielaRequest[];
    onEventosChange: (eventos: EventoQuinielaRequest[]) => void;
}

export const EventSelector: React.FC<Props> = ({ eventosSeleccionados, onEventosChange }) => {
    const { eventos, obtenerTodosLosEventos, loading } = useEventos();
    const [filtroDeporte, setFiltroDeporte] = useState<string>('');
    const [busqueda, setBusqueda] = useState<string>('');
    const [eventosDisponibles, setEventosDisponibles] = useState<EventoResponse[]>([]);

    useEffect(() => {
        obtenerTodosLosEventos();
    }, [obtenerTodosLosEventos]);

    useEffect(() => {
        let eventosFiltrados = eventos;

        // Filtrar por deporte
        if (filtroDeporte) {
            eventosFiltrados = eventosFiltrados.filter(evento => 
                evento.deporte?.toLowerCase() === filtroDeporte.toLowerCase()
            );
        }

        // Filtrar por búsqueda
        if (busqueda) {
            eventosFiltrados = eventosFiltrados.filter(evento =>
                evento.equipoLocal?.toLowerCase().includes(busqueda.toLowerCase()) ||
                evento.equipoVisitante?.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        // Filtrar eventos futuros
        const ahora = new Date();
        eventosFiltrados = eventosFiltrados.filter(evento => {
            if (!evento.fechaPartido) return false;
            const fechaEvento = new Date(evento.fechaPartido);
            return fechaEvento > ahora;
        });

        setEventosDisponibles(eventosFiltrados);
    }, [eventos, filtroDeporte, busqueda]);

    const deportesDisponibles = [...new Set(eventos.map(e => e.deporte).filter(Boolean))];    const handleSeleccionarEvento = (evento: EventoResponse) => {
        const eventoQuiniela: EventoQuinielaRequest = {
            eventoId: evento.idEvento,
            nombreEvento: evento.nombreEvento || `${evento.equipoLocal} vs ${evento.equipoVisitante}`,
            fechaEvento: evento.fechaPartido || '',
            equipoLocal: evento.equipoLocal || '',
            equipoVisitante: evento.equipoVisitante || '',
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

    const estaSeleccionado = (eventoId: number) => {
        return eventosSeleccionados.some(e => e.eventoId === eventoId);
    };

    if (loading) {
        return (
            <div className="space-y-4">
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

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrar por deporte
                        </label>
                        <select
                            value={filtroDeporte}
                            onChange={(e) => setFiltroDeporte(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los deportes</option>
                            {deportesDisponibles.map(deporte => (
                                <option key={deporte} value={deporte}>{deporte}</option>
                            ))}
                        </select>
                    </div>
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
                    Eventos Disponibles ({eventosDisponibles.length}):
                </h4>
                
                {eventosDisponibles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No hay eventos disponibles que coincidan con los filtros.</p>
                        <p className="text-sm mt-2">Intenta cambiar los filtros o agregar más eventos al sistema.</p>
                    </div>
                ) : (                    <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
                        {eventosDisponibles.map((evento) => {
                            const seleccionado = estaSeleccionado(evento.idEvento);
                            
                            return (
                                <div
                                    key={evento.idEvento}
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
                                                {evento.nombreEvento || `${evento.equipoLocal} vs ${evento.equipoVisitante}`}
                                            </h5>
                                            <p className="text-sm text-gray-600">
                                                {evento.equipoLocal} vs {evento.equipoVisitante}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    📅 {new Date(evento.fechaPartido || '').toLocaleDateString('es-ES')}
                                                </span>
                                                {evento.deporte && (
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {evento.deporte}
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
