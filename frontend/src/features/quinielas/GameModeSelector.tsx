import React from 'react';
import { Field, ErrorMessage, type FieldProps } from 'formik';

interface Props {
    tipoDistribucion: string;
    porcentajes: {
        primero: number;
        segundo: number;
        tercero: number;
    };
}

export const GameModeSelector: React.FC<Props> = ({ tipoDistribucion, porcentajes }) => {
    const modosDejuego = [
        {
            id: 'WINNER_TAKES_ALL',
            nombre: 'Ganador se lleva todo',
            descripcion: 'El participante con mayor puntaje gana el 100% del premio',
            emoji: '🏆'
        },
        {
            id: 'TOP_3',
            nombre: 'Top 3 Ganadores',
            descripcion: 'Los 3 primeros lugares comparten el premio según porcentajes',
            emoji: '🥇🥈🥉'
        },
        {
            id: 'PERCENTAGE',
            nombre: 'Distribución Porcentual',
            descripcion: 'Distribución personalizada de premios por posición',
            emoji: '💰'
        },
        {
            id: 'ELIMINATION',
            nombre: 'Por Eliminación',
            descripcion: 'Los participantes con menor puntaje son eliminados cada ronda',
            emoji: '❌'
        },
        {
            id: 'ACCUMULATIVE',
            nombre: 'Acumulativo',
            descripcion: 'Los puntos se acumulan a lo largo de múltiples rondas',
            emoji: '📈'
        },
        {
            id: 'TEAMS',
            nombre: 'Por Equipos',
            descripcion: 'Los participantes forman equipos y compiten en conjunto',
            emoji: '👥'
        }
    ];

    const mostrarPorcentajes = ['TOP_3', 'PERCENTAGE'].includes(tipoDistribucion);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    🎮 Modo de Juego
                </h3>
                
                <div className="space-y-3">
                    {modosDejuego.map((modo) => (
                        <div key={modo.id} className="relative">
                            <Field name="tipoDistribucion">
                                {({ field }: FieldProps) => (
                                    <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        field.value === modo.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <div className="flex items-start space-x-3">
                                            <input
                                                {...field}
                                                type="radio"
                                                value={modo.id}
                                                className="mt-1 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">{modo.emoji}</span>
                                                    <h4 className="font-medium text-gray-800">
                                                        {modo.nombre}
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {modo.descripcion}
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                )}
                            </Field>
                        </div>
                    ))}
                </div>
                
                <ErrorMessage name="tipoDistribucion" component="div" className="text-red-600 text-sm mt-2" />
            </div>

            {/* Configuración de porcentajes */}
            {mostrarPorcentajes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-4">
                        💰 Distribución de Premios
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🥇 Primer lugar (%)
                            </label>
                            <Field
                                name="porcentajePremiosPrimero"
                                type="number"
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name="porcentajePremiosPrimero" component="div" className="text-red-600 text-xs mt-1" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🥈 Segundo lugar (%)
                            </label>
                            <Field
                                name="porcentajePremiosSegundo"
                                type="number"
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name="porcentajePremiosSegundo" component="div" className="text-red-600 text-xs mt-1" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🥉 Tercer lugar (%)
                            </label>
                            <Field
                                name="porcentajePremiosTercero"
                                type="number"
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name="porcentajePremiosTercero" component="div" className="text-red-600 text-xs mt-1" />
                        </div>
                    </div>

                    {/* Indicador de suma de porcentajes */}
                    <div className="mt-4 p-3 bg-white rounded border">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                                Total de porcentajes:
                            </span>
                            <span className={`text-sm font-bold ${
                                (porcentajes.primero + porcentajes.segundo + porcentajes.tercero) === 100
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}>
                                {porcentajes.primero + porcentajes.segundo + porcentajes.tercero}%
                            </span>
                        </div>
                        
                        {(porcentajes.primero + porcentajes.segundo + porcentajes.tercero) !== 100 && (
                            <p className="text-xs text-red-600 mt-1">
                                Los porcentajes deben sumar exactamente 100%
                            </p>
                        )}
                    </div>

                    {/* Presets de distribución */}
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Presets comunes:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    // Estos se manejarían desde el formulario padre
                                }}
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                                70-20-10
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    // Estos se manejarían desde el formulario padre
                                }}
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                                60-25-15
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    // Estos se manejarían desde el formulario padre
                                }}
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                                50-30-20
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Información específica por modo */}
            {tipoDistribucion === 'ELIMINATION' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                        <span className="text-yellow-600 text-lg">⚠️</span>
                        <div>
                            <h5 className="font-medium text-yellow-800">Modo Por Eliminación</h5>
                            <p className="text-sm text-yellow-700 mt-1">
                                En cada ronda, los participantes con menor puntaje serán eliminados. 
                                El número de eliminados dependerá del total de participantes.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {tipoDistribucion === 'TEAMS' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                        <span className="text-blue-600 text-lg">👥</span>
                        <div>
                            <h5 className="font-medium text-blue-800">Modo Por Equipos</h5>
                            <p className="text-sm text-blue-700 mt-1">
                                Los participantes formarán equipos. Los puntos se suman entre los miembros
                                del equipo y compiten como una unidad.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {tipoDistribucion === 'ACCUMULATIVE' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                        <span className="text-green-600 text-lg">📈</span>
                        <div>
                            <h5 className="font-medium text-green-800">Modo Acumulativo</h5>
                            <p className="text-sm text-green-700 mt-1">
                                Los puntos se acumulan a través de múltiples rondas de eventos.
                                Perfecto para torneos de larga duración.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
