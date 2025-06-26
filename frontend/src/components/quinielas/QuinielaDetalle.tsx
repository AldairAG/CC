import React, { useState, useEffect, useCallback } from 'react';
import type { QuinielaCreada, ParticipacionQuiniela, PremioQuiniela } from '../../types/QuinielaType';
import { quinielaCreadaService } from '../../service/api/quinielaCreadaService';
import { HacerPrediccionesForm } from './HacerPrediccionesForm';

interface Props {
    quinielaId: number;
    onVolver?: () => void;
}

type TabType = 'detalles' | 'participantes' | 'eventos' | 'premios';

export const QuinielaDetalle: React.FC<Props> = ({ quinielaId, onVolver }) => {
    const [quiniela, setQuiniela] = useState<QuinielaCreada | null>(null);
    const [mostrarPredicciones, setMostrarPredicciones] = useState(false);
    const [tabActiva, setTabActiva] = useState<TabType>('detalles');
    const [loading, setLoading] = useState(false);

    const cargarQuiniela = useCallback(async () => {
        try {
            setLoading(true);
            const quinielaDetalle = await quinielaCreadaService.obtenerQuiniela(quinielaId);
            setQuiniela(quinielaDetalle);
        } catch (error) {
            console.error('Error cargando quiniela:', error);
        } finally {
            setLoading(false);
        }
    }, [quinielaId]);

    useEffect(() => {
        cargarQuiniela();
    }, [cargarQuiniela]);

    const handleDistribuirPremios = async () => {
        if (!quiniela) return;
        
        if (confirm('¿Estás seguro de que quieres distribuir los premios? Esta acción no se puede deshacer.')) {
            try {
                setLoading(true);
                await quinielaCreadaService.distribuirPremios(quiniela.id);
                await cargarQuiniela(); // Recargar para ver los cambios
            } catch (error) {
                console.error('Error distribuyendo premios:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const obtenerEstadoColor = (estado: string): string => {
        switch (estado) {
            case 'ACTIVA': return 'bg-green-100 text-green-800';
            case 'EN_CURSO': return 'bg-blue-100 text-blue-800';
            case 'FINALIZADA': return 'bg-gray-100 text-gray-800';
            case 'CANCELADA': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const obtenerProgreso = (): number => {
        if (!quiniela || !quiniela.maxParticipantes) return 0;
        return (quiniela.participantesActuales / quiniela.maxParticipantes) * 100;
    };

    if (loading && !quiniela) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!quiniela) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiniela no encontrada</h2>
                {onVolver && (
                    <button
                        onClick={onVolver}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Volver
                    </button>
                )}
            </div>
        );
    }

    if (mostrarPredicciones) {
        return (
            <HacerPrediccionesForm
                quiniela={quiniela}
                onPrediccionesGuardadas={() => {
                    setMostrarPredicciones(false);
                    cargarQuiniela();
                }}
                onCancelar={() => setMostrarPredicciones(false)}
            />
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center space-x-4 mb-2">
                        <h1 className="text-3xl font-bold text-gray-800">{quiniela.nombre}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerEstadoColor(quiniela.estado)}`}>
                            {quiniela.estado}
                        </span>
                    </div>
                    <p className="text-gray-600">{quiniela.descripcion}</p>
                </div>
                
                <div className="flex space-x-3">
                    {onVolver && (
                        <button
                            onClick={onVolver}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            ← Volver
                        </button>
                    )}
                    
                    {quiniela.estado === 'ACTIVA' && (
                        <button
                            onClick={() => setMostrarPredicciones(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Hacer Predicciones
                        </button>
                    )}
                    
                    {quiniela.estado === 'FINALIZADA' && !quiniela.premiosDistribuidos && (
                        <button
                            onClick={handleDistribuirPremios}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? 'Distribuyendo...' : 'Distribuir Premios'}
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-blue-600">{quiniela.participantesActuales}</div>
                    <div className="text-gray-600">Participantes</div>
                    {quiniela.maxParticipantes && (
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${obtenerProgreso()}%` }}
                                ></div>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                de {quiniela.maxParticipantes} máximo
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-green-600">
                        ${quiniela.premioTotal?.toLocaleString() || '0'}
                    </div>
                    <div className="text-gray-600">Premio Total</div>
                    {quiniela.esCrypto && (
                        <div className="text-sm text-purple-600 mt-1">
                            {quiniela.cryptoTipo}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-purple-600">
                        ${quiniela.precioEntrada}
                    </div>
                    <div className="text-gray-600">Precio Entrada</div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-2xl font-bold text-orange-600">
                        {quiniela.eventos?.length || 0}
                    </div>
                    <div className="text-gray-600">Eventos</div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'detalles', label: 'Detalles' },
                        { id: 'participantes', label: 'Participantes' },
                        { id: 'eventos', label: 'Eventos' },
                        { id: 'premios', label: 'Premios' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setTabActiva(tab.id as TabType)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                tabActiva === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow">
                {tabActiva === 'detalles' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Información General</h3>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Creador</dt>
                                        <dd className="text-sm text-gray-900">Usuario #{quiniela.creadorId}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
                                        <dd className="text-sm text-gray-900">
                                            {new Date(quiniela.fechaCreacion).toLocaleDateString()}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Período</dt>
                                        <dd className="text-sm text-gray-900">
                                            Del {new Date(quiniela.fechaInicio).toLocaleDateString()} al{' '}
                                            {new Date(quiniela.fechaFin).toLocaleDateString()}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Visibilidad</dt>
                                        <dd className="text-sm text-gray-900">
                                            {quiniela.esPublica ? 'Pública' : 'Privada'}
                                            {!quiniela.esPublica && quiniela.codigoInvitacion && (
                                                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                                                    Código: {quiniela.codigoInvitacion}
                                                </span>
                                            )}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Distribución de Premios</h3>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                                        <dd className="text-sm text-gray-900">{quiniela.tipoDistribucion}</dd>
                                    </div>
                                    {quiniela.tipoDistribucion !== 'WINNER_TAKES_ALL' && (
                                        <>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Primer Lugar</dt>
                                                <dd className="text-sm text-gray-900">{quiniela.porcentajePremiosPrimero}%</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Segundo Lugar</dt>
                                                <dd className="text-sm text-gray-900">{quiniela.porcentajePremiosSegundo}%</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Tercer Lugar</dt>
                                                <dd className="text-sm text-gray-900">{quiniela.porcentajePremiosTercero}%</dd>
                                            </div>
                                        </>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>
                )}

                {tabActiva === 'participantes' && (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Lista de Participantes</h3>
                        {quiniela.participaciones && quiniela.participaciones.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Participante
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha Unión
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Puntos
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Posición
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Premio
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {quiniela.participaciones
                                            .sort((a, b) => (b.puntosObtenidos || 0) - (a.puntosObtenidos || 0))
                                            .map((participacion: ParticipacionQuiniela, index) => (
                                            <tr key={participacion.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    Usuario #{participacion.usuarioId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(participacion.fechaParticipacion).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {participacion.puntosObtenidos || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {participacion.posicionFinal || (index + 1)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {participacion.premioGanado ? 
                                                        `$${participacion.premioGanado.toLocaleString()}` : 
                                                        '-'
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No hay participantes aún.</p>
                        )}
                    </div>
                )}

                {tabActiva === 'eventos' && (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Eventos de la Quiniela</h3>
                        {quiniela.eventos && quiniela.eventos.length > 0 ? (
                            <div className="space-y-4">
                                {quiniela.eventos.map((evento) => (
                                    <div key={evento.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-lg">{evento.nombreEvento}</h4>
                                                <p className="text-gray-600">
                                                    {evento.equipoLocal} vs {evento.equipoVisitante}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(evento.fechaEvento).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 rounded text-sm ${obtenerEstadoColor(evento.estado)}`}>
                                                    {evento.estado}
                                                </span>
                                                {evento.finalizado && (
                                                    <div className="mt-2 text-lg font-bold">
                                                        {evento.resultadoLocal} - {evento.resultadoVisitante}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-between text-sm text-blue-600">
                                            <span>Puntos por acierto: {evento.puntosPorAcierto}</span>
                                            <span>Puntos resultado exacto: {evento.puntosPorResultadoExacto}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No hay eventos configurados.</p>
                        )}
                    </div>
                )}

                {tabActiva === 'premios' && (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Distribución de Premios</h3>
                        {quiniela.premios && quiniela.premios.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Posición
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Premio
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Porcentaje
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ganador
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {quiniela.premios.map((premio: PremioQuiniela) => (
                                            <tr key={premio.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {premio.posicion}°
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${premio.montoPremio.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {premio.porcentajePremio}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {premio.usuarioGanadorId ? 
                                                        `Usuario #${premio.usuarioGanadorId}` : 
                                                        'Por asignar'
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        premio.premioReclamado ? 
                                                            'bg-green-100 text-green-800' : 
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {premio.premioReclamado ? 'Reclamado' : 'Pendiente'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Los premios aún no han sido configurados.</p>
                        )}
                    </div>
                )}
            </div>
        </div>    );
};

export default QuinielaDetalle;
