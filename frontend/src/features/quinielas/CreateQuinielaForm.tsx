import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useQuiniela } from '../../hooks/useQuiniela';
import { useUser } from '../../hooks/useUser';
import { useEvento } from '../../hooks/useEvento';
import { useTheSportsDB } from '../../hooks/useTheSportDB';
import type { CrearQuinielaRequestType, EventoQuinielaCrearType } from '../../types/QuinielaType';
import type { EventoDisponibleQuinielaType } from '../../types/EventoDeportivoTypes';
import { TipoQuiniela, TipoDistribucion } from '../../types/QuinielaType';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Schema de validación con Yup
const validationSchema = Yup.object({
    nombre: Yup.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .required('El nombre es requerido'),
    descripcion: Yup.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .required('La descripción es requerida'),
    tipoQuiniela: Yup.string()
        .oneOf(Object.values(TipoQuiniela), 'Tipo de quiniela inválido')
        .required('El tipo de quiniela es requerido'),
    tipoDistribucion: Yup.string()
        .oneOf(Object.values(TipoDistribucion), 'Tipo de distribución inválido')
        .required('El tipo de distribución es requerido'),
    costoParticipacion: Yup.number()
        .min(1, 'El costo mínimo es $1')
        .max(1000000, 'El costo máximo es $1,000,000')
        .required('El costo de participación es requerido'),
    premioMinimo: Yup.number()
        .min(0, 'El premio mínimo no puede ser negativo')
        .required('El premio mínimo es requerido'),
    maxParticipantes: Yup.number()
        .min(2, 'Mínimo 2 participantes')
        .max(10000, 'Máximo 10,000 participantes')
        .required('El número máximo de participantes es requerido'),
    fechaInicio: Yup.date()
        .min(new Date(), 'La fecha de inicio debe ser futura')
        .required('La fecha de inicio es requerida'),
    fechaCierre: Yup.date()
        .min(Yup.ref('fechaInicio'), 'La fecha de cierre debe ser posterior al inicio')
        .required('La fecha de cierre es requerida'),
    esPublica: Yup.boolean(),
    requiereAprobacion: Yup.boolean(),
    requiereMinParticipantes: Yup.number()
        .min(0, 'No puede ser negativo')
        .max(Yup.ref('maxParticipantes'), 'No puede ser mayor al máximo de participantes'),
    porcentajeCasa: Yup.number()
        .min(0, 'No puede ser negativo')
        .max(50, 'Máximo 50%'),
    porcentajeCreador: Yup.number()
        .min(0, 'No puede ser negativo')
        .max(20, 'Máximo 20%'),
    reglasEspeciales: Yup.string()
        .max(1000, 'Las reglas no pueden exceder 1000 caracteres'),
});

const CreateQuinielaForm: React.FC = () => {
    const { createQuiniela, isCreandoQuiniela, errorCrearQuiniela, clearAllErrors } = useQuiniela();
    const { user } = useUser();
    const { 
        eventosDisponibles,
        eventosLoading,
        error: eventosError,
        cargarEventosDisponibles
    } = useEvento();

    // Hook para obtener deportes y ligas desde TheSportsDB
    const {
        sports: deportesDisponibles,
        leagues: ligasDisponibles,
        cargarDeportes,
        cargarLigasPorDeporte
    } = useTheSportsDB();

    // Estado local para gestión de eventos
    const [eventosSeleccionados, setEventosSeleccionados] = useState<EventoDisponibleQuinielaType[]>([]);
    const [mostrarEventos, setMostrarEventos] = useState(false);
    
    // Estado para filtros
    const [filtroDeporte, setFiltroDeporte] = useState<string>('');
    const [filtroLiga, setFiltroLiga] = useState<string>('');
    const [eventosFiltrados, setEventosFiltrados] = useState<EventoDisponibleQuinielaType[]>([]);

    // Cargar eventos disponibles y listas auxiliares al montar el componente
    useEffect(() => {
        cargarEventosDisponibles();
        cargarDeportes();
    }, [cargarEventosDisponibles, cargarDeportes]);

    // Cargar ligas cuando cambie el deporte seleccionado
    useEffect(() => {
        if (filtroDeporte) {
            cargarLigasPorDeporte(filtroDeporte);
        }
        // Limpiar filtro de liga cuando cambie el deporte
        setFiltroLiga('');
    }, [filtroDeporte, cargarLigasPorDeporte]);

    // Filtrar eventos cuando cambien los filtros o la lista de eventos disponibles
    useEffect(() => {
        let filtrados = eventosDisponibles as EventoDisponibleQuinielaType[];
        
        if (filtroDeporte) {
            filtrados = filtrados.filter(evento => evento.deporte === filtroDeporte);
        }
        
        if (filtroLiga) {
            filtrados = filtrados.filter(evento => evento.liga === filtroLiga);
        }
        
        setEventosFiltrados(filtrados);
    }, [eventosDisponibles, filtroDeporte, filtroLiga]);

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setFiltroDeporte('');
        setFiltroLiga('');
    };

    // Funciones para manejar eventos
    const toggleEvento = (evento: EventoDisponibleQuinielaType) => {
        setEventosSeleccionados(prev => {
            const yaSeleccionado = prev.some(e => e.id === evento.id);
            if (yaSeleccionado) {
                return prev.filter(e => e.id !== evento.id);
            } else {
                return [...prev, evento];
            }
        });
    };

    const esEventoSeleccionado = (eventoId: number): boolean => {
        return eventosSeleccionados.some(e => e.id === eventoId);
    };

    const convertirEventosAFormulario = (eventos: EventoDisponibleQuinielaType[]): EventoQuinielaCrearType[] => {
        return eventos.map(evento => ({
            nombreEvento: evento.nombreEvento,
            equipoLocal: evento.equipoLocal,
            equipoVisitante: evento.equipoVisitante,
            fechaEvento: evento.fechaEvento,
            puntosPorAcierto: 10,
            multiplicadorPuntos: 1,
            esObligatorio: true,
            tipoPrediccion: 'RESULTADO' as const
        }));
    };

    const initialValues = {
        nombre: '',
        descripcion: '',
        tipoQuiniela: '',
        tipoDistribucion: '',
        costoParticipacion: '',
        premioMinimo: '',
        maxParticipantes: '',
        fechaInicio: '',
        fechaCierre: '',
        esPublica: true,
        requiereAprobacion: false,
        requiereMinParticipantes: '',
        porcentajeCasa: '',
        porcentajeCreador: '',
        reglasEspeciales: '',
        tipoPrediccionNombre: 'RESULTADO'
    };

    const handleSubmit = async (values: typeof initialValues, helpers: { setSubmitting: (submitting: boolean) => void; resetForm: () => void }) => {
        const { setSubmitting, resetForm } = helpers;
        
        try {
            clearAllErrors();
            
            // Preparar eventos de los eventos seleccionados
            let eventosFormateados: EventoQuinielaCrearType[];
            
            if (eventosSeleccionados.length > 0) {
                // Usar eventos seleccionados de la lista disponible
                eventosFormateados = convertirEventosAFormulario(eventosSeleccionados);
                console.log('✅ Eventos formateados:', eventosFormateados);
            } else {
                console.error('❌ No hay eventos seleccionados');
                throw new Error('Debe seleccionar al menos un evento');
            }
            
            const quinielaData: CrearQuinielaRequestType = {
                nombre: values.nombre,
                descripcion: values.descripcion,
                tipoQuiniela: values.tipoQuiniela as TipoQuiniela,
                tipoDistribucion: values.tipoDistribucion as TipoDistribucion,
                costoParticipacion: parseFloat(values.costoParticipacion),
                premioMinimo: parseFloat(values.premioMinimo),
                maxParticipantes: parseInt(values.maxParticipantes),
                fechaInicio: new Date(values.fechaInicio).toISOString(),
                fechaCierre: new Date(values.fechaCierre).toISOString(),
                creadorId: user?.idUsuario || 0,
                esPublica: values.esPublica,
                requiereAprobacion: values.requiereAprobacion,
                requiereMinParticipantes: values.requiereMinParticipantes ? parseInt(values.requiereMinParticipantes) : undefined,
                porcentajeCasa: values.porcentajeCasa ? parseFloat(values.porcentajeCasa) : undefined,
                porcentajeCreador: values.porcentajeCreador ? parseFloat(values.porcentajeCreador) : undefined,
                reglasEspeciales: values.reglasEspeciales || undefined,
                tipoPrediccionNombre: values.tipoPrediccionNombre,
                eventos: eventosFormateados
            };

            console.log('📋 QuinielaData to submit:', quinielaData);
            const result = await createQuiniela(quinielaData);
            console.log('✅ CreateQuiniela result:', result);
            
            if (result) {
                resetForm();
                setEventosSeleccionados([]);
                setMostrarEventos(false);
                // La navegación se maneja automáticamente en el hook
            }
        } catch (error) {
            console.error('❌ Error al crear quiniela:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Header con estilo casino */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        🎰 CREAR NUEVA QUINIELA 🎰
                    </h1>
                    <div className="flex justify-center items-center space-x-4 mb-6">
                        <div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-red-500 rounded"></div>
                        <span className="text-2xl">💰</span>
                        <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-pink-500 rounded"></div>
                    </div>
                    <p className="text-gray-300 text-lg">
                        Configura tu quiniela y genera grandes premios
                    </p>
                </div>

                {/* Contenedor principal con efecto de neón */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden">
                    {/* Efecto de neón en el borde superior */}
                    <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
                    
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, isValid, errors }) => (
                            <Form className="p-8 space-y-8">
                                {/* Debug Info */}
                                <div className="bg-gray-800/50 border border-blue-500/30 rounded-xl p-4 mb-6">
                                    <h4 className="text-blue-300 font-bold mb-2">🔍 Debug Info</h4>
                                    <div className="text-sm text-gray-300 grid grid-cols-2 gap-2">
                                        <div>Form Valid: {isValid ? '✅' : '❌'}</div>
                                        <div>Events Selected: {eventosSeleccionados.length}</div>
                                        <div>Is Submitting: {isSubmitting ? '✅' : '❌'}</div>
                                        <div>Is Creating: {isCreandoQuiniela ? '✅' : '❌'}</div>
                                    </div>
                                    {Object.keys(errors).length > 0 && (
                                        <div className="mt-2">
                                            <span className="text-red-400">Errors: </span>
                                            <pre className="text-xs text-red-300">{JSON.stringify(errors, null, 2)}</pre>
                                        </div>
                                    )}
                                </div>
                                {/* Mostrar errores generales */}
                                {errorCrearQuiniela && (
                                    <div className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-4 rounded-xl backdrop-blur-sm">
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-3">⚠️</span>
                                            <span>Error: {errorCrearQuiniela}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Sección 1: Información Básica */}
                                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
                                    <div className="flex items-center mb-6">
                                        <span className="text-3xl mr-3">🎯</span>
                                        <h3 className="text-2xl font-bold text-white">Información Básica</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Nombre */}
                                        <div>
                                            <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wide">
                                                🏆 Nombre de la Quiniela
                                            </label>
                                            <Field
                                                name="nombre"
                                                type="text"
                                                placeholder="Ej: Champions League 2025"
                                                className="w-full bg-gray-800/70 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            <ErrorMessage name="nombre" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>

                                        {/* Tipo de Quiniela */}
                                        <div>
                                            <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wide">
                                                🎲 Tipo de Quiniela
                                            </label>
                                            <Field
                                                as="select"
                                                name="tipoQuiniela"
                                                className="w-full bg-gray-800/70 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                            >
                                                <option value="" className="bg-gray-800">🎯 Seleccionar tipo</option>
                                                <option value={TipoQuiniela.CLASICA} className="bg-gray-800">🏛️ Clásica</option>
                                                <option value={TipoQuiniela.EXPRESS} className="bg-gray-800">⚡ Express</option>
                                                <option value={TipoQuiniela.SUPERVIVENCIA} className="bg-gray-800">💀 Supervivencia</option>
                                                <option value={TipoQuiniela.PREDICTOR_EXACTO} className="bg-gray-800">🎯 Predictor Exacto</option>
                                                <option value={TipoQuiniela.CHALLENGE_MENSUAL} className="bg-gray-800">🗓️ Challenge Mensual</option>
                                            </Field>
                                            <ErrorMessage name="tipoQuiniela" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>

                                        {/* Tipo de Predicción */}
                                        <div>
                                            <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wide">
                                                🔮 Tipo de Predicción
                                            </label>
                                            <Field
                                                as="select"
                                                name="tipoPrediccionNombre"
                                                className="w-full bg-gray-800/70 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                            >
                                                <option value="RESULTADO" className="bg-gray-800">🏆 Resultado (1X2)</option>
                                                <option value="MARCADOR_EXACTO" className="bg-gray-800">🎯 Marcador Exacto</option>
                                                <option value="HANDICAP" className="bg-gray-800">⚖️ Handicap</option>
                                                <option value="OVER_UNDER" className="bg-gray-800">📊 Over/Under</option>
                                                <option value="AMBOS_EQUIPOS_ANOTAN" className="bg-gray-800">⚽ Ambos Equipos Anotan</option>
                                            </Field>
                                            <ErrorMessage name="tipoPrediccionNombre" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>

                                        {/* Descripción */}
                                        <div className="lg:col-span-2">
                                            <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wide">
                                                📝 Descripción
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="descripcion"
                                                rows={4}
                                                placeholder="Describe tu quiniela, las reglas especiales, premios, etc..."
                                                className="w-full bg-gray-800/70 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm resize-none"
                                            />
                                            <ErrorMessage name="descripcion" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección 2: Configuración Económica */}
                                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/20">
                                    <div className="flex items-center mb-6">
                                        <span className="text-3xl mr-3">💰</span>
                                        <h3 className="text-2xl font-bold text-white">Configuración de Premios</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Costo de Participación */}
                                        <div>
                                            <label className="block text-sm font-bold text-green-300 mb-3 uppercase tracking-wide">
                                                💸 Costo de Entrada
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 text-xl font-bold">$</span>
                                                <Field
                                                    name="costoParticipacion"
                                                    type="number"
                                                    min="1"
                                                    step="0.01"
                                                    placeholder="100"
                                                    className="w-full bg-gray-800/70 border-2 border-green-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                                />
                                            </div>
                                            <ErrorMessage name="costoParticipacion" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>

                                        {/* Premio Mínimo */}
                                        <div>
                                            <label className="block text-sm font-bold text-green-300 mb-3 uppercase tracking-wide">
                                                🏆 Premio Garantizado
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 text-xl font-bold">$</span>
                                                <Field
                                                    name="premioMinimo"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="1000"
                                                    className="w-full bg-gray-800/70 border-2 border-green-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                                />
                                            </div>
                                            <ErrorMessage name="premioMinimo" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>

                                        {/* Tipo de Distribución */}
                                        <div>
                                            <label className="block text-sm font-bold text-green-300 mb-3 uppercase tracking-wide">
                                                📊 Distribución
                                            </label>
                                            <Field
                                                as="select"
                                                name="tipoDistribucion"
                                                className="w-full bg-gray-800/70 border-2 border-green-500/30 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                            >
                                                <option value="" className="bg-gray-800">📊 Seleccionar distribución</option>
                                                <option value={TipoDistribucion.WINNER_TAKES_ALL} className="bg-gray-800">👑 Ganador se lleva todo</option>
                                                <option value={TipoDistribucion.TOP_3_CLASICA} className="bg-gray-800">🥇 Top 3 Clásica</option>
                                                <option value={TipoDistribucion.TOP_5_PIRAMIDE} className="bg-gray-800">🏔️ Top 5 Pirámide</option>
                                                <option value={TipoDistribucion.POR_ACIERTOS_PROGRESIVO} className="bg-gray-800">📈 Por Aciertos Progresivo</option>
                                            </Field>
                                            <ErrorMessage name="tipoDistribucion" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección 3: Configuración de Jugadores */}
                                <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border border-blue-500/20">
                                    <div className="flex items-center mb-6">
                                        <span className="text-3xl mr-3">👥</span>
                                        <h3 className="text-2xl font-bold text-white">Configuración de Jugadores</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Máximo de Participantes */}
                                        <div>
                                            <label className="block text-sm font-bold text-blue-300 mb-3 uppercase tracking-wide">
                                                🎭 Máximo Jugadores
                                            </label>
                                            <Field
                                                name="maxParticipantes"
                                                type="number"
                                                min="2"
                                                max="10000"
                                                placeholder="100"
                                                className="w-full bg-gray-800/70 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            <ErrorMessage name="maxParticipantes" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>

                                        {/* Mínimo de Participantes */}
                                        <div>
                                            <label className="block text-sm font-bold text-blue-300 mb-3 uppercase tracking-wide">
                                                🎯 Mínimo Jugadores
                                            </label>
                                            <Field
                                                name="requiereMinParticipantes"
                                                type="number"
                                                min="0"
                                                placeholder="10"
                                                className="w-full bg-gray-800/70 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            <ErrorMessage name="requiereMinParticipantes" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>

                                        {/* Configuraciones */}
                                        <div className="space-y-4">
                                            <div className="flex items-center p-4 bg-gray-800/50 rounded-xl border border-blue-500/20">
                                                <Field
                                                    name="esPublica"
                                                    type="checkbox"
                                                    className="h-5 w-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                                />
                                                <label className="ml-3 text-blue-300 font-medium">
                                                    🌐 Quiniela Pública
                                                </label>
                                            </div>
                                            <div className="flex items-center p-4 bg-gray-800/50 rounded-xl border border-blue-500/20">
                                                <Field
                                                    name="requiereAprobacion"
                                                    type="checkbox"
                                                    className="h-5 w-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                                />
                                                <label className="ml-3 text-blue-300 font-medium">
                                                    ✅ Requiere Aprobación
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección 4: Fechas */}
                                <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-2xl p-6 border border-orange-500/20">
                                    <div className="flex items-center mb-6">
                                        <span className="text-3xl mr-3">⏰</span>
                                        <h3 className="text-2xl font-bold text-white">Programación</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Fecha de Inicio */}
                                        <div>
                                            <label className="block text-sm font-bold text-orange-300 mb-3 uppercase tracking-wide">
                                                🚀 Fecha de Inicio
                                            </label>
                                            <Field
                                                name="fechaInicio"
                                                type="datetime-local"
                                                min={new Date().toISOString().slice(0, 16)}
                                                className="w-full bg-gray-800/70 border-2 border-orange-500/30 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            <ErrorMessage name="fechaInicio" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>

                                        {/* Fecha de Cierre */}
                                        <div>
                                            <label className="block text-sm font-bold text-orange-300 mb-3 uppercase tracking-wide">
                                                🏁 Fecha de Cierre
                                            </label>
                                            <Field
                                                name="fechaCierre"
                                                type="datetime-local"
                                                min={values.fechaInicio || new Date().toISOString().slice(0, 16)}
                                                className="w-full bg-gray-800/70 border-2 border-orange-500/30 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            <ErrorMessage name="fechaCierre" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección 5: Configuración Avanzada */}
                                <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 border border-purple-500/20">
                                    <div className="flex items-center mb-6">
                                        <span className="text-3xl mr-3">⚙️</span>
                                        <h3 className="text-2xl font-bold text-white">Configuración Avanzada</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Porcentaje Casa */}
                                        <div>
                                            <label className="block text-sm font-bold text-purple-300 mb-3 uppercase tracking-wide">
                                                🏠 Comisión Casa (%)
                                            </label>
                                            <Field
                                                name="porcentajeCasa"
                                                type="number"
                                                min="0"
                                                max="50"
                                                step="0.1"
                                                placeholder="5.0"
                                                className="w-full bg-gray-800/70 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            <ErrorMessage name="porcentajeCasa" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>

                                        {/* Porcentaje Creador */}
                                        <div>
                                            <label className="block text-sm font-bold text-purple-300 mb-3 uppercase tracking-wide">
                                                👤 Comisión Creador (%)
                                            </label>
                                            <Field
                                                name="porcentajeCreador"
                                                type="number"
                                                min="0"
                                                max="20"
                                                step="0.1"
                                                placeholder="2.0"
                                                className="w-full bg-gray-800/70 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            <ErrorMessage name="porcentajeCreador" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>

                                        {/* Reglas Especiales */}
                                        <div className="lg:col-span-2">
                                            <label className="block text-sm font-bold text-purple-300 mb-3 uppercase tracking-wide">
                                                📋 Reglas Especiales
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="reglasEspeciales"
                                                rows={3}
                                                placeholder="Describe cualquier regla especial para esta quiniela..."
                                                className="w-full bg-gray-800/70 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm resize-none"
                                            />
                                            <ErrorMessage name="reglasEspeciales" component="div" className="text-red-400 text-sm mt-2 flex items-center">
                                                {(errorMessage: string) => (
                                                    <>
                                                        <span className="mr-1">⚡</span>
                                                        {errorMessage}
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección 6: Selección de Eventos */}
                                <div className="bg-gradient-to-r from-pink-900/30 to-rose-900/30 rounded-2xl p-6 border border-pink-500/20">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center">
                                            <span className="text-3xl mr-3">🏆</span>
                                            <h3 className="text-2xl font-bold text-white">Eventos Deportivos</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setMostrarEventos(!mostrarEventos)}
                                            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        >
                                            {mostrarEventos ? '👁️ Ocultar Eventos' : '⚡ Seleccionar Eventos'}
                                        </button>
                                    </div>

                                    {/* Eventos seleccionados */}
                                    <div className="mb-6 p-6 bg-gradient-to-r from-pink-800/20 to-rose-800/20 rounded-xl border border-pink-500/30">
                                        <h4 className="text-lg font-bold text-pink-300 mb-4 flex items-center">
                                            <span className="mr-2">📊</span>
                                            Eventos Seleccionados ({eventosSeleccionados.length})
                                        </h4>
                                        {eventosSeleccionados.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="text-6xl mb-4">🎯</div>
                                                <p className="text-gray-400">
                                                    No hay eventos seleccionados. ¡Elige los eventos para tu quiniela!
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {eventosSeleccionados.slice(0, 6).map((evento) => (
                                                    <div key={evento.id} className="bg-gray-800/50 rounded-xl p-4 border border-pink-500/20 backdrop-blur-sm">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-bold text-pink-300">{evento.deporte}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleEvento(evento)}
                                                                className="text-red-400 hover:text-red-300 text-sm"
                                                            >
                                                                ❌
                                                            </button>
                                                        </div>
                                                        <div className="text-white font-medium text-sm mb-1">
                                                            {evento.equipoLocal} 🆚 {evento.equipoVisitante}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            📅 {new Date(evento.fechaEvento).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ))}
                                                {eventosSeleccionados.length > 6 && (
                                                    <div className="bg-gray-800/30 rounded-xl p-4 border border-pink-500/20 backdrop-blur-sm flex items-center justify-center">
                                                        <span className="text-pink-300 font-bold">
                                                            +{eventosSeleccionados.length - 6} más...
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Lista de eventos disponibles */}
                                    {mostrarEventos && (
                                        <div className="bg-gray-800/30 rounded-xl p-6 border border-pink-500/20 backdrop-blur-sm">
                                            <h4 className="text-lg font-bold text-pink-300 mb-4 flex items-center">
                                                <span className="mr-2">⚡</span>
                                                Eventos Disponibles
                                            </h4>
                                            
                                            {/* Filtros */}
                                            <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-pink-300 mb-2">🏈 Deporte</label>
                                                    <select
                                                        value={filtroDeporte}
                                                        onChange={(e) => setFiltroDeporte(e.target.value)}
                                                        className="w-full bg-gray-800/70 border-2 border-pink-500/30 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                                                    >
                                                        <option value="">Todos los deportes</option>
                                                        {deportesDisponibles.map((deporte) => (
                                                            <option key={deporte.id} value={deporte.name}>
                                                                {deporte.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-bold text-pink-300 mb-2">🏆 Liga</label>
                                                    <select
                                                        value={filtroLiga}
                                                        onChange={(e) => setFiltroLiga(e.target.value)}
                                                        className="w-full bg-gray-800/70 border-2 border-pink-500/30 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                                                        disabled={!filtroDeporte}
                                                    >
                                                        <option value="">Todas las ligas</option>
                                                        {ligasDisponibles.map((liga) => (
                                                            <option key={liga.id} value={liga.name}>
                                                                {liga.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={limpiarFiltros}
                                                        className="w-full px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-bold transition-all duration-300"
                                                    >
                                                        🔄 Limpiar
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Lista de eventos */}
                                            {eventosLoading ? (
                                                <div className="flex justify-center items-center py-12">
                                                    <LoadingSpinner />
                                                    <span className="ml-3 text-pink-300 font-medium">
                                                        Cargando eventos...
                                                    </span>
                                                </div>
                                            ) : eventosError ? (
                                                <div className="text-center py-12">
                                                    <div className="text-6xl mb-4">⚠️</div>
                                                    <p className="text-red-400 mb-4">Error al cargar eventos: {eventosError}</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => cargarEventosDisponibles()}
                                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                                    >
                                                        🔄 Reintentar
                                                    </button>
                                                </div>
                                            ) : eventosFiltrados.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <div className="text-6xl mb-4">🔍</div>
                                                    <p className="text-gray-400">
                                                        {filtroDeporte || filtroLiga ? 
                                                            'No hay eventos que coincidan con los filtros' :
                                                            'No hay eventos disponibles'
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="max-h-80 overflow-y-auto space-y-3">
                                                    {eventosFiltrados.map((evento) => {
                                                        const seleccionado = esEventoSeleccionado(evento.id);
                                                        
                                                        return (
                                                            <div
                                                                key={evento.id}
                                                                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                                                    seleccionado
                                                                        ? 'bg-gradient-to-r from-green-800/50 to-emerald-800/50 border-2 border-green-400 shadow-lg shadow-green-400/20'
                                                                        : 'bg-gray-800/50 border border-gray-600 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-400/20'
                                                                }`}
                                                                onClick={() => toggleEvento(evento)}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center space-x-3 mb-2">
                                                                            <span className="font-bold text-white">
                                                                                {evento.equipoLocal} 🆚 {evento.equipoVisitante}
                                                                            </span>
                                                                            {seleccionado && (
                                                                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                                                    ✓ SELECCIONADO
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm text-gray-400 flex items-center space-x-4">
                                                                            <span>🏈 {evento.deporte}</span>
                                                                            {evento.liga && <span>🏆 {evento.liga}</span>}
                                                                            <span>📅 {new Date(evento.fechaEvento).toLocaleDateString()}</span>
                                                                            {evento.yaEnQuiniela && (
                                                                                <span className="text-orange-400">⚠️ Ya en quiniela</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Validación de eventos */}
                                    {eventosSeleccionados.length === 0 && (
                                        <div className="text-center py-4 text-red-600 dark:text-red-400 text-sm">
                                            Debes seleccionar al menos un evento para continuar.
                                        </div>
                                    )}
                                    
                                    <ErrorMessage name="eventos" component="div" className="text-red-500 text-sm" />
                                </div>

                                {/* Botones */}
                                <div className="flex justify-center space-x-6 pt-8">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-600"
                                    >
                                        ❌ Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isCreandoQuiniela || eventosSeleccionados.length === 0}
                                        className="px-12 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3"
                                    >
                                        {(isSubmitting || isCreandoQuiniela) && <LoadingSpinner />}
                                        <span className="text-2xl">🎰</span>
                                        <span>{(isSubmitting || isCreandoQuiniela) ? 'Creando Quiniela...' : 'CREAR QUINIELA'}</span>
                                        <span className="text-2xl">💰</span>
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default CreateQuinielaForm;
