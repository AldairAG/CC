import { useState, useEffect } from 'react';
import type { 
    QuinielaCreada, 
    HacerPrediccionesRequest, 
    PrediccionEvento,
    EventoQuiniela 
} from '../../types/QuinielaType';
import { useQuiniela } from '../../hooks/useQuiniela';

interface Props {
    quiniela: QuinielaCreada;
    onPrediccionesGuardadas?: () => void;
    onCancelar?: () => void;
}

export const HacerPrediccionesForm: React.FC<Props> = ({ 
    quiniela, 
    onPrediccionesGuardadas, 
    onCancelar 
}) => {
    const { hacerPredicciones, loading } = useQuiniela();
    
    const [predicciones, setPredicciones] = useState<PrediccionEvento[]>([]);
    const [errors, setErrors] = useState<Record<number, string>>({});    useEffect(() => {
        // Inicializar predicciones vacías para cada evento
        if (quiniela.eventos && quiniela.eventos.length > 0) {
            const prediccionesIniciales: PrediccionEvento[] = quiniela.eventos.map(evento => ({
                eventoId: evento.id,
                resultadoPredichoLocal: 0,
                resultadoPredichoVisitante: 0,
                tipoPrediccion: 'RESULTADO_EXACTO'
            }));
            setPredicciones(prediccionesIniciales);
        }
    }, [quiniela.eventos]);

    const handlePrediccionChange = (
        eventoId: number, 
        campo: 'resultadoPredichoLocal' | 'resultadoPredichoVisitante' | 'tipoPrediccion',
        valor: number | string
    ) => {
        setPredicciones(prev => prev.map(pred => 
            pred.eventoId === eventoId 
                ? { ...pred, [campo]: valor }
                : pred
        ));

        // Limpiar error del evento
        if (errors[eventoId]) {
            setErrors(prev => ({
                ...prev,
                [eventoId]: ''
            }));
        }
    };

    const validarPredicciones = (): boolean => {
        const nuevosErrores: Record<number, string> = {};
        let esValido = true;        predicciones.forEach(pred => {
            const evento = quiniela.eventos?.find(e => e.id === pred.eventoId);
            if (!evento) return;

            if (pred.tipoPrediccion === 'RESULTADO_EXACTO') {
                if (pred.resultadoPredichoLocal < 0) {
                    nuevosErrores[pred.eventoId] = 'Resultado local debe ser mayor o igual a 0';
                    esValido = false;
                }
                if (pred.resultadoPredichoVisitante < 0) {
                    nuevosErrores[pred.eventoId] = 'Resultado visitante debe ser mayor o igual a 0';
                    esValido = false;
                }
            }
        });

        setErrors(nuevosErrores);
        return esValido;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validarPredicciones()) {
            return;
        }

        try {
            const request: HacerPrediccionesRequest = {
                quinielaId: quiniela.id,
                predicciones: predicciones
            };

            await hacerPredicciones(request);
            onPrediccionesGuardadas?.();
        } catch (error) {
            console.error('Error al guardar predicciones:', error);
        }
    };

    const obtenerResultadoPrediccion = (pred: PrediccionEvento): string => {
        if (pred.tipoPrediccion === 'SOLO_GANADOR') {
            if (pred.resultadoPredichoLocal > pred.resultadoPredichoVisitante) {
                return 'Local gana';
            } else if (pred.resultadoPredichoLocal < pred.resultadoPredichoVisitante) {
                return 'Visitante gana';
            } else {
                return 'Empate';
            }
        }
        return `${pred.resultadoPredichoLocal} - ${pred.resultadoPredichoVisitante}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Hacer Predicciones - {quiniela.nombre}
                </h2>
                {onCancelar && (
                    <button
                        onClick={onCancelar}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                )}
            </div>            <form onSubmit={handleSubmit} className="space-y-6">
                {!quiniela.eventos || quiniela.eventos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay eventos disponibles para hacer predicciones.
                    </div>
                ) : (
                    quiniela.eventos.map((evento: EventoQuiniela) => {
                        const prediccion = predicciones.find(p => p.eventoId === evento.id);
                        if (!prediccion) return null;

                        return (
                            <div key={evento.id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        {evento.nombreEvento}
                                    </h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-600">
                                            {evento.equipoLocal} vs {evento.equipoVisitante}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(evento.fechaEvento).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {evento.puntosPorAcierto && (
                                        <div className="text-sm text-blue-600 mt-1">
                                            Puntos: {evento.puntosPorAcierto} (Exacto: {evento.puntosPorResultadoExacto})
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo de Predicción
                                        </label>
                                        <select
                                            value={prediccion.tipoPrediccion}
                                            onChange={(e) => handlePrediccionChange(
                                                evento.id, 
                                                'tipoPrediccion', 
                                                e.target.value
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="RESULTADO_EXACTO">Resultado Exacto</option>
                                            <option value="SOLO_GANADOR">Solo Ganador</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Goles {evento.equipoLocal}
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={prediccion.resultadoPredichoLocal}
                                            onChange={(e) => handlePrediccionChange(
                                                evento.id,
                                                'resultadoPredichoLocal',
                                                parseInt(e.target.value) || 0
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Goles {evento.equipoVisitante}
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={prediccion.resultadoPredichoVisitante}
                                            onChange={(e) => handlePrediccionChange(
                                                evento.id,
                                                'resultadoPredichoVisitante',
                                                parseInt(e.target.value) || 0
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {errors[evento.id] && (
                                    <p className="text-red-500 text-sm mt-2">{errors[evento.id]}</p>
                                )}

                                <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                                    <strong>Tu predicción:</strong> {obtenerResultadoPrediccion(prediccion)}
                                </div>
                            </div>
                        );
                    })
                )}

                <div className="flex justify-end space-x-4">
                    {onCancelar && (
                        <button
                            type="button"
                            onClick={onCancelar}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Guardar Predicciones'}
                    </button>
                </div>
            </form>
        </div>
    );
};
