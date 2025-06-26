import React, { useState, useEffect } from 'react';
import { QuinielaCard } from '../../features/quinielas/QuinielaCard';
import { CrearQuinielaForm } from '../../features/quinielas/CrearQuinielaForm';
import { QuinielaDetalle } from '../../features/quinielas/QuinielaDetalle';
import { useQuiniela } from '../../hooks/useQuiniela';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/navigation/Tabs';
import type { QuinielaResponse } from '../../types/QuinielaType';

const QuinielasPage= () => {
    const {
        quinielasPublicas,
        misQuinielas,
        misParticipaciones,
        loading,
        error,
        cargarQuinielasPublicas,
        cargarMisQuinielas,
        cargarMisParticipaciones,
        unirseQuiniela,
        obtenerQuinielasDisponibles,
        obtenerQuinielasEnCurso,
        obtenerQuinielasFinalizadas,
        calcularTotalPremiosPendientes,
        limpiarError
    } = useQuiniela();

    const [tabActiva, setTabActiva] = useState<'publicas' | 'mis-quinielas' | 'participaciones'>('publicas');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarDetalle, setMostrarDetalle] = useState<number | null>(null);
    const [filtro, setFiltro] = useState<'todas' | 'disponibles' | 'en-curso' | 'finalizadas'>('todas');

    // Función wrapper para el cambio de tab compatible con React.Dispatch
    const handleTabChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
        if (typeof value === 'function') {
            setTabActiva(prev => value(prev) as 'publicas' | 'mis-quinielas' | 'participaciones');
        } else {
            setTabActiva(value as 'publicas' | 'mis-quinielas' | 'participaciones');
        }
    };

    useEffect(() => {
        cargarQuinielasPublicas();
        cargarMisQuinielas();
        cargarMisParticipaciones();
    }, [cargarQuinielasPublicas, cargarMisQuinielas, cargarMisParticipaciones]);

    const handleCrearQuiniela = () => {
        setMostrarFormulario(false);
        alert('¡Quiniela creada exitosamente!');
        // Actualizar las listas localmente
        cargarMisQuinielas();
    };

    const handleMostrarDetalle = (quinielaId: number) => {
        setMostrarDetalle(quinielaId);
    };

    const handleVolverDeLista = () => {
        setMostrarDetalle(null);
    };

    // Si se está mostrando el detalle de una quiniela
    if (mostrarDetalle) {
        return (
            <QuinielaDetalle
                quinielaId={mostrarDetalle}
                onVolver={handleVolverDeLista}
            />
        );
    }

    // Si se está mostrando el formulario de creación
    if (mostrarFormulario) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <CrearQuinielaForm
                        onQuinielaCreada={handleCrearQuiniela}
                        onCancelar={() => setMostrarFormulario(false)}
                    />
                </div>
            </div>
        );
    }
    // Si no se está mostrando ni el formulario ni el detalle, mostrar la lista de quinielas
    const handleUnirse = async (quinielaId: number) => {
        try {
            const codigoInvitacion = '';

            // Si es privada, pedir código (esto debería manejarse según la lógica del componente)
            // if (!quiniela.esPublica) {
            //     codigoInvitacion = prompt('Esta quiniela es privada. Ingresa el código de invitación:') || '';
            //     if (!codigoInvitacion) return;
            // }

            await unirseQuiniela({
                quinielaId: quinielaId,
                codigoInvitacion: codigoInvitacion || undefined
            });

            alert('¡Te has unido exitosamente a la quiniela!');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Error al unirse a la quiniela');
        }
    };

    const obtenerQuinielasFiltradas = () => {
        switch (tabActiva) {
            case 'publicas':
                switch (filtro) {
                    case 'disponibles':
                        return obtenerQuinielasDisponibles();
                    default:
                        return quinielasPublicas;
                }
            case 'mis-quinielas':
                return misQuinielas;
            case 'participaciones':
                switch (filtro) {
                    case 'en-curso':
                        return obtenerQuinielasEnCurso();
                    case 'finalizadas':
                        return obtenerQuinielasFinalizadas();
                    default:
                        return misParticipaciones;
                }
            default:
                return [];
        }
    };

    const premiosPendientes = calcularTotalPremiosPendientes();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">🏆 Quinielas</h1>
                            <p className="text-gray-600 mt-1">
                                Crea tus propias quinielas o únete a las existentes
                            </p>
                        </div>
                        <button
                            onClick={() => setMostrarFormulario(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2"
                        >
                            <span>➕</span>
                            <span>Crear Quiniela</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-blue-600 text-2xl font-bold">
                                {quinielasPublicas.length}
                            </div>
                            <div className="text-blue-700 text-sm">Quinielas Públicas</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="text-green-600 text-2xl font-bold">
                                {misQuinielas.length}
                            </div>
                            <div className="text-green-700 text-sm">Mis Quinielas</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="text-purple-600 text-2xl font-bold">
                                {misParticipaciones.length}
                            </div>
                            <div className="text-purple-700 text-sm">Participaciones</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4">
                            <div className="text-yellow-600 text-2xl font-bold">
                                ${premiosPendientes.toFixed(2)}
                            </div>
                            <div className="text-yellow-700 text-sm">Premios Pendientes</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4">
                    <Tabs 
                        defaultValue="publicas" 
                        activeTab={tabActiva} 
                        setActiveTab={handleTabChange}
                        className="w-full"
                    >
                        <TabsList className="flex space-x-8 mb-0 border-b-0">
                            <TabsTrigger 
                                value="publicas" 
                                className="py-4 px-2 border-b-2 font-medium text-sm"
                                activeClassName="border-blue-500 text-blue-600"
                                inactiveClassName="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            >
                                🌍 Quinielas Públicas
                            </TabsTrigger>
                            <TabsTrigger 
                                value="mis-quinielas" 
                                className="py-4 px-2 border-b-2 font-medium text-sm"
                                activeClassName="border-blue-500 text-blue-600"
                                inactiveClassName="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            >
                                🎯 Mis Quinielas
                            </TabsTrigger>
                            <TabsTrigger 
                                value="participaciones" 
                                className="py-4 px-2 border-b-2 font-medium text-sm"
                                activeClassName="border-blue-500 text-blue-600"
                                inactiveClassName="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            >
                                👥 Mis Participaciones
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                        {tabActiva === 'publicas' && (
                            <>
                                <button
                                    onClick={() => setFiltro('todas')}
                                    className={`px-3 py-1 text-sm rounded-full ${filtro === 'todas'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setFiltro('disponibles')}
                                    className={`px-3 py-1 text-sm rounded-full ${filtro === 'disponibles'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Disponibles
                                </button>
                            </>
                        )}

                        {tabActiva === 'participaciones' && (
                            <>
                                <button
                                    onClick={() => setFiltro('todas')}
                                    className={`px-3 py-1 text-sm rounded-full ${filtro === 'todas'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setFiltro('en-curso')}
                                    className={`px-3 py-1 text-sm rounded-full ${filtro === 'en-curso'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    En Curso
                                </button>
                                <button
                                    onClick={() => setFiltro('finalizadas')}
                                    className={`px-3 py-1 text-sm rounded-full ${filtro === 'finalizadas'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Finalizadas
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            cargarQuinielasPublicas();
                            cargarMisQuinielas();
                            cargarMisParticipaciones();
                        }}
                        className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                    >
                        <span>🔄</span>
                        <span>Actualizar</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 pb-8">
                <Tabs 
                    defaultValue="publicas" 
                    activeTab={tabActiva} 
                    setActiveTab={handleTabChange}
                    className="w-full"
                >
                    <TabsContent value="publicas" className="mt-0">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
                                <span>{error}</span>
                                <button onClick={limpiarError} className="text-red-500 hover:text-red-700">
                                    ✕
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="h-16 bg-gray-200 rounded"></div>
                                            <div className="h-16 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {(filtro === 'todas' ? quinielasPublicas : obtenerQuinielasDisponibles()).length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">🎯</div>
                                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                                            No hay quinielas públicas disponibles
                                        </h3>
                                        <p className="text-gray-500 mb-6">
                                            No hay quinielas públicas disponibles en este momento.
                                        </p>
                                        <button
                                            onClick={() => setMostrarFormulario(true)}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                                        >
                                            ➕ Crear la Primera Quiniela
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {(filtro === 'todas' ? quinielasPublicas : obtenerQuinielasDisponibles()).map((quiniela: QuinielaResponse) => (
                                            <QuinielaCard
                                                key={quiniela.id}
                                                quiniela={quiniela}
                                                onVerDetalles={() => handleMostrarDetalle(quiniela.id)}
                                                onUnirse={handleUnirse}
                                                showJoinButton={true}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="mis-quinielas" className="mt-0">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
                                <span>{error}</span>
                                <button onClick={limpiarError} className="text-red-500 hover:text-red-700">
                                    ✕
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="h-16 bg-gray-200 rounded"></div>
                                            <div className="h-16 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {misQuinielas.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">🎯</div>
                                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                                            No has creado quinielas
                                        </h3>
                                        <p className="text-gray-500 mb-6">
                                            Aún no has creado ninguna quiniela.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {misQuinielas.map((quiniela: QuinielaResponse) => (
                                            <QuinielaCard
                                                key={quiniela.id}
                                                quiniela={quiniela}
                                                onVerDetalles={() => handleMostrarDetalle(quiniela.id)}
                                                onUnirse={handleUnirse}
                                                showJoinButton={false}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="participaciones" className="mt-0">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
                                <span>{error}</span>
                                <button onClick={limpiarError} className="text-red-500 hover:text-red-700">
                                    ✕
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="h-16 bg-gray-200 rounded"></div>
                                            <div className="h-16 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {obtenerQuinielasFiltradas().length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">🎯</div>
                                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                                            No tienes participaciones
                                        </h3>
                                        <p className="text-gray-500 mb-6">
                                            No estás participando en ninguna quiniela.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {obtenerQuinielasFiltradas().map((quiniela: QuinielaResponse) => (
                                            <QuinielaCard
                                                key={quiniela.id}
                                                quiniela={quiniela}
                                                onVerDetalles={() => handleMostrarDetalle(quiniela.id)}
                                                onUnirse={handleUnirse}
                                                showJoinButton={false}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
export default QuinielasPage;