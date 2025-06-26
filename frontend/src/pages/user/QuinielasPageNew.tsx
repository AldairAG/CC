import React, { useState, useEffect } from 'react';
import { QuinielaCard } from '../../components/quinielas/QuinielaCardNew';
import { CrearQuinielaForm } from '../../components/quinielas/CrearQuinielaForm';
import { useQuinielasCreadas } from '../../hooks/useQuinielasCreadas2';

export const QuinielasPage: React.FC = () => {
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
        limpiarError
    } = useQuinielasCreadas();

    const [tabActiva, setTabActiva] = useState<'publicas' | 'mis-quinielas' | 'participaciones'>('publicas');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [filtro, setFiltro] = useState<'todas' | 'disponibles' | 'en-curso' | 'finalizadas'>('todas');

    useEffect(() => {
        cargarQuinielasPublicas();
        cargarMisQuinielas();
        cargarMisParticipaciones();
    }, [cargarQuinielasPublicas, cargarMisQuinielas, cargarMisParticipaciones]);    const handleCrearQuiniela = () => {
        setMostrarFormulario(false);
        alert('¡Quiniela creada exitosamente!');
        // Las listas se actualizan automáticamente en el hook
    };

    const handleUnirse = async (quinielaId: number) => {
        try {
            await unirseQuiniela({ quinielaId });
            alert('¡Te has unido exitosamente a la quiniela!');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Error al unirse a la quiniela');
        }
    };

    const handleVerDetalles = (quinielaId: number) => {
        // TODO: Implementar navegación a detalles
        console.log('Ver detalles de quiniela:', quinielaId);
    };

    const handleHacerPredicciones = (quinielaId: number) => {
        // TODO: Implementar navegación a predicciones
        console.log('Hacer predicciones en quiniela:', quinielaId);
    };

    // Si se está mostrando el formulario de creación
    if (mostrarFormulario) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-lg">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-6">
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                <span className="mr-3">🏆</span>
                                Crear Nueva Quiniela
                            </h1>
                            <p className="text-blue-100 mt-2">
                                Configura tu quiniela deportiva y invita a tus amigos
                            </p>
                        </div>
                        
                        <div className="p-6">
                            <CrearQuinielaForm 
                                onQuinielaCreada={handleCrearQuiniela}
                                onCancelar={() => setMostrarFormulario(false)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const obtenerQuinielasActivas = () => {
        const ahora = new Date();
        
        switch (tabActiva) {
            case 'publicas':
                return quinielasPublicas.filter(q => {
                    if (filtro === 'disponibles') {
                        const fechaInicio = new Date(q.fechaInicio);
                        return fechaInicio > ahora && (!q.maxParticipantes || q.participantes < q.maxParticipantes);
                    }
                    if (filtro === 'en-curso') {
                        const fechaInicio = new Date(q.fechaInicio);
                        const fechaFin = new Date(q.fechaFin);
                        return fechaInicio <= ahora && fechaFin >= ahora;
                    }
                    if (filtro === 'finalizadas') {
                        const fechaFin = new Date(q.fechaFin);
                        return fechaFin < ahora;
                    }
                    return true;
                });
            case 'mis-quinielas':
                return misQuinielas;
            case 'participaciones':
                return misParticipaciones;
            default:
                return [];
        }
    };    return (
        <div className="min-h-screen bg-casino-gradient py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="card-casino p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                <span className="mr-3 text-4xl">🏆</span>
                                <span className="bg-red-gradient bg-clip-text text-transparent">
                                    Quinielas Deportivas 24bet
                                </span>
                            </h1>
                            <p className="text-gray-300 mt-2">
                                Crea, únete y compite en quinielas deportivas con premios reales
                            </p>
                        </div>
                        <button
                            onClick={() => setMostrarFormulario(true)}
                            className="btn-primary px-6 py-3 text-lg font-bold flex items-center animate-pulse-fast"
                        >
                            <span className="mr-2">➕</span>
                            Crear Quiniela
                        </button>
                    </div>
                </div>                {/* Error Display */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={limpiarError} className="text-red-400 hover:text-red-200">✕</button>
                    </div>
                )}

                {/* Tabs */}
                <div className="card-casino mb-8">
                    <div className="border-b border-primary-600/30">
                        <nav className="flex">
                            {[
                                { key: 'publicas', label: 'Públicas', icon: '🌐' },
                                { key: 'mis-quinielas', label: 'Mis Quinielas', icon: '👤' },
                                { key: 'participaciones', label: 'Participaciones', icon: '🎯' }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setTabActiva(tab.key as 'publicas' | 'mis-quinielas' | 'participaciones')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                                        tabActiva === tab.key
                                            ? 'border-primary-500 text-primary-400 bg-primary-600/10'
                                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Filtros */}
                    <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'todas', label: 'Todas' },
                                { key: 'disponibles', label: 'Disponibles' },
                                { key: 'en-curso', label: 'En Curso' },
                                { key: 'finalizadas', label: 'Finalizadas' }
                            ].map(filtroOpt => (
                                <button
                                    key={filtroOpt.key}
                                    onClick={() => setFiltro(filtroOpt.key as 'todas' | 'disponibles' | 'en-curso' | 'finalizadas')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                        filtro === filtroOpt.key
                                            ? 'bg-primary-600 text-white shadow-neon-red'
                                            : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                                    }`}
                                >
                                    {filtroOpt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>                {/* Loading */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin-slow rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                        <span className="ml-4 text-gray-300 animate-pulse">Cargando quinielas...</span>
                    </div>
                )}

                {/* Quinielas Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {obtenerQuinielasActivas().map((quiniela) => (
                            <QuinielaCard
                                key={quiniela.id}
                                quiniela={quiniela}
                                onVerDetalles={handleVerDetalles}
                                onUnirse={tabActiva === 'publicas' ? handleUnirse : undefined}
                                onHacerPredicciones={tabActiva === 'participaciones' ? handleHacerPredicciones : undefined}
                                showJoinButton={tabActiva === 'publicas'}
                                tipo={tabActiva === 'publicas' ? 'publica' : tabActiva === 'mis-quinielas' ? 'mia' : 'participacion'}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && obtenerQuinielasActivas().length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4 animate-float">🏆</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            No hay quinielas disponibles
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {tabActiva === 'publicas' 
                                ? 'No hay quinielas públicas en este momento'
                                : tabActiva === 'mis-quinielas'
                                ? 'No has creado ninguna quiniela aún'
                                : 'No estás participando en ninguna quiniela'
                            }
                        </p>
                        {tabActiva === 'publicas' && (
                            <button
                                onClick={() => setMostrarFormulario(true)}
                                className="btn-primary px-6 py-3"
                            >
                                Crear mi primera quiniela
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
