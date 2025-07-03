import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useQuiniela } from '../../hooks/useQuiniela';
import { useUser } from '../../hooks/useUser';
import { useEvento } from '../../hooks/useEvento';
import type { CrearQuinielaRequestType, EventoQuinielaCrearType } from '../../types/QuinielaType';
import type { EventoDeportivoType } from '../../types/EventoDeportivoTypes';
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
    eventos: Yup.array()
        .of(
            Yup.object({
                nombreEvento: Yup.string()
                    .min(3, 'Nombre muy corto')
                    .max(100, 'Nombre muy largo')
                    .required('Nombre del evento requerido'),
                equipoLocal: Yup.string()
                    .min(2, 'Nombre muy corto')
                    .max(50, 'Nombre muy largo')
                    .required('Equipo local requerido'),
                equipoVisitante: Yup.string()
                    .min(2, 'Nombre muy corto')
                    .max(50, 'Nombre muy largo')
                    .required('Equipo visitante requerido'),
                fechaEvento: Yup.date()
                    .min(new Date(), 'La fecha del evento debe ser futura')
                    .required('Fecha del evento requerida'),
                puntosPorAcierto: Yup.number()
                    .min(1, 'Mínimo 1 punto')
                    .max(100, 'Máximo 100 puntos')
                    .required('Puntos por acierto requeridos'),
                multiplicadorPuntos: Yup.number()
                    .min(1, 'Mínimo 1x')
                    .max(10, 'Máximo 10x'),
                esObligatorio: Yup.boolean(),
                tipoPrediccion: Yup.string()
                    .oneOf(['RESULTADO', 'MARCADOR_EXACTO', 'GOLES_OVER_UNDER'], 'Tipo de predicción inválido')
                    .required('Tipo de predicción requerido')
            })
        )
        .min(1, 'Debe agregar al menos un evento')
        .required('Los eventos son requeridos')
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

    // Estado local para gestión de eventos
    const [eventosSeleccionados, setEventosSeleccionados] = useState<EventoDeportivoType[]>([]);
    const [mostrarEventos, setMostrarEventos] = useState(false);
    const [modoCreacionEventos, setModoCreacionEventos] = useState<'manual' | 'seleccionar'>('manual');

    // Cargar eventos disponibles al montar el componente
    useEffect(() => {
        cargarEventosDisponibles();
    }, [cargarEventosDisponibles]);

    // Funciones para manejar eventos
    const toggleEvento = (evento: EventoDeportivoType) => {
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

    const convertirEventosAFormulario = (eventos: EventoDeportivoType[]): EventoQuinielaCrearType[] => {
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
        modoEventos: 'manual' as 'manual' | 'seleccionar',
        eventos: [{
            nombreEvento: '',
            equipoLocal: '',
            equipoVisitante: '',
            fechaEvento: '',
            puntosPorAcierto: 10,
            multiplicadorPuntos: 1,
            esObligatorio: true,
            tipoPrediccion: 'RESULTADO'
        }]
    };

    const handleSubmit = async (values: typeof initialValues, helpers: { setSubmitting: (submitting: boolean) => void; resetForm: () => void }) => {
        const { setSubmitting, resetForm } = helpers;
        try {
            clearAllErrors();
            
            // Preparar eventos según el modo seleccionado
            let eventosFormateados: EventoQuinielaCrearType[];
            
            if (values.modoEventos === 'seleccionar' && eventosSeleccionados.length > 0) {
                // Usar eventos seleccionados de la lista disponible
                eventosFormateados = convertirEventosAFormulario(eventosSeleccionados);
            } else {
                // Usar eventos creados manualmente
                eventosFormateados = values.eventos.map(evento => ({
                    nombreEvento: evento.nombreEvento,
                    equipoLocal: evento.equipoLocal,
                    equipoVisitante: evento.equipoVisitante,
                    fechaEvento: new Date(evento.fechaEvento).toISOString(),
                    puntosPorAcierto: evento.puntosPorAcierto,
                    multiplicadorPuntos: evento.multiplicadorPuntos || 1,
                    esObligatorio: evento.esObligatorio,
                    tipoPrediccion: evento.tipoPrediccion
                }));
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
                eventos: eventosFormateados
            };

            const result = await createQuiniela(quinielaData);
            
            if (result) {
                resetForm();
                setEventosSeleccionados([]);
                setMostrarEventos(false);
                setModoCreacionEventos('manual');
                // La navegación se maneja automáticamente en el hook
            }
        } catch (error) {
            console.error('Error al crear quiniela:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Crear Nueva Quiniela
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Completa todos los campos para crear tu quiniela
                    </p>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form className="p-6 space-y-6">
                            {/* Mostrar errores generales */}
                            {errorCrearQuiniela && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    Error: {errorCrearQuiniela}
                                </div>
                            )}

                            {/* Información Básica */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="lg:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Información Básica
                                    </h3>
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre de la Quiniela *
                                    </label>
                                    <Field
                                        name="nombre"
                                        type="text"
                                        placeholder="Ej: Champions League 2025"
                                        className="input w-full"
                                    />
                                    <ErrorMessage name="nombre" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Tipo de Quiniela */}
                                <div>
                                    <label htmlFor="tipoQuiniela" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tipo de Quiniela *
                                    </label>
                                    <Field
                                        as="select"
                                        name="tipoQuiniela"
                                        className="input w-full"
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value={TipoQuiniela.CLASICA}>Clásica</option>
                                        <option value={TipoQuiniela.EXPRESS}>Express</option>
                                        <option value={TipoQuiniela.SUPERVIVENCIA}>Supervivencia</option>
                                        <option value={TipoQuiniela.PREDICTOR_EXACTO}>Predictor Exacto</option>
                                        <option value={TipoQuiniela.CHALLENGE_MENSUAL}>Challenge Mensual</option>
                                    </Field>
                                    <ErrorMessage name="tipoQuiniela" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Descripción */}
                                <div className="lg:col-span-2">
                                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Descripción *
                                    </label>
                                    <Field
                                        as="textarea"
                                        name="descripcion"
                                        rows={4}
                                        placeholder="Describe tu quiniela, las reglas especiales, premios, etc..."
                                        className="input w-full resize-none"
                                    />
                                    <ErrorMessage name="descripcion" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>

                            {/* Configuración Económica */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-3">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Configuración Económica
                                    </h3>
                                </div>

                                {/* Costo de Participación */}
                                <div>
                                    <label htmlFor="costoParticipacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Costo de Participación *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <Field
                                            name="costoParticipacion"
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            placeholder="100"
                                            className="input w-full pl-8"
                                        />
                                    </div>
                                    <ErrorMessage name="costoParticipacion" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Premio Mínimo */}
                                <div>
                                    <label htmlFor="premioMinimo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Premio Mínimo Garantizado *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <Field
                                            name="premioMinimo"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="1000"
                                            className="input w-full pl-8"
                                        />
                                    </div>
                                    <ErrorMessage name="premioMinimo" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Tipo de Distribución */}
                                <div>
                                    <label htmlFor="tipoDistribucion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Distribución de Premios *
                                    </label>
                                    <Field
                                        as="select"
                                        name="tipoDistribucion"
                                        className="input w-full"
                                    >
                                        <option value="">Seleccionar distribución</option>
                                        <option value={TipoDistribucion.WINNER_TAKES_ALL}>El ganador se lleva todo</option>
                                        <option value={TipoDistribucion.TOP_3_CLASICA}>Top 3 Clásica</option>
                                        <option value={TipoDistribucion.TOP_5_PIRAMIDE}>Top 5 Pirámide</option>
                                        <option value={TipoDistribucion.POR_ACIERTOS_PROGRESIVO}>Por Aciertos Progresivo</option>
                                    </Field>
                                    <ErrorMessage name="tipoDistribucion" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>

                            {/* Configuración de Participantes */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-3">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Configuración de Participantes
                                    </h3>
                                </div>

                                {/* Máximo de Participantes */}
                                <div>
                                    <label htmlFor="maxParticipantes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Máximo de Participantes *
                                    </label>
                                    <Field
                                        name="maxParticipantes"
                                        type="number"
                                        min="2"
                                        max="10000"
                                        placeholder="100"
                                        className="input w-full"
                                    />
                                    <ErrorMessage name="maxParticipantes" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Mínimo de Participantes */}
                                <div>
                                    <label htmlFor="requiereMinParticipantes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Mínimo de Participantes
                                    </label>
                                    <Field
                                        name="requiereMinParticipantes"
                                        type="number"
                                        min="0"
                                        max={values.maxParticipantes || 10000}
                                        placeholder="10"
                                        className="input w-full"
                                    />
                                    <ErrorMessage name="requiereMinParticipantes" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Checkboxes */}
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Field
                                            name="esPublica"
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="esPublica" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            Quiniela pública
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <Field
                                            name="requiereAprobacion"
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="requiereAprobacion" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            Requiere aprobación para participar
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Fechas */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="lg:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Configuración de Fechas
                                    </h3>
                                </div>

                                {/* Fecha de Inicio */}
                                <div>
                                    <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Fecha y Hora de Inicio *
                                    </label>
                                    <Field
                                        name="fechaInicio"
                                        type="datetime-local"
                                        min={new Date().toISOString().slice(0, 16)}
                                        className="input w-full"
                                    />
                                    <ErrorMessage name="fechaInicio" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Fecha de Cierre */}
                                <div>
                                    <label htmlFor="fechaCierre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Fecha y Hora de Cierre *
                                    </label>
                                    <Field
                                        name="fechaCierre"
                                        type="datetime-local"
                                        min={values.fechaInicio || new Date().toISOString().slice(0, 16)}
                                        className="input w-full"
                                    />
                                    <ErrorMessage name="fechaCierre" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>

                            {/* Configuración Avanzada */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="lg:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Configuración Avanzada (Opcional)
                                    </h3>
                                </div>

                                {/* Porcentaje Casa */}
                                <div>
                                    <label htmlFor="porcentajeCasa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Porcentaje para la Casa (%)
                                    </label>
                                    <Field
                                        name="porcentajeCasa"
                                        type="number"
                                        min="0"
                                        max="50"
                                        step="0.1"
                                        placeholder="5.0"
                                        className="input w-full"
                                    />
                                    <ErrorMessage name="porcentajeCasa" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Porcentaje Creador */}
                                <div>
                                    <label htmlFor="porcentajeCreador" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Porcentaje para el Creador (%)
                                    </label>
                                    <Field
                                        name="porcentajeCreador"
                                        type="number"
                                        min="0"
                                        max="20"
                                        step="0.1"
                                        placeholder="2.0"
                                        className="input w-full"
                                    />
                                    <ErrorMessage name="porcentajeCreador" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Reglas Especiales */}
                                <div className="lg:col-span-2">
                                    <label htmlFor="reglasEspeciales" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Reglas Especiales
                                    </label>
                                    <Field
                                        as="textarea"
                                        name="reglasEspeciales"
                                        rows={3}
                                        placeholder="Describe cualquier regla especial para esta quiniela..."
                                        className="input w-full resize-none"
                                    />
                                    <ErrorMessage name="reglasEspeciales" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>

                            {/* Gestión de Eventos */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Eventos de la Quiniela *
                                    </h3>
                                    
                                    {/* Selector de modo de creación de eventos */}
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Modo:
                                            </label>
                                            <Field
                                                as="select"
                                                name="modoEventos"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                    const nuevoModo = e.target.value as 'manual' | 'seleccionar';
                                                    setModoCreacionEventos(nuevoModo);
                                                    setFieldValue('modoEventos', nuevoModo);
                                                }}
                                                className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="manual">Crear Manualmente</option>
                                                <option value="seleccionar">Seleccionar Existentes</option>
                                            </Field>
                                        </div>
                                        
                                        {modoCreacionEventos === 'manual' && (
                                            <FieldArray name="eventos">
                                                {({ push }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => push({
                                                            nombreEvento: '',
                                                            equipoLocal: '',
                                                            equipoVisitante: '',
                                                            fechaEvento: '',
                                                            puntosPorAcierto: 10,
                                                            multiplicadorPuntos: 1,
                                                            esObligatorio: true,
                                                            tipoPrediccion: 'RESULTADO'
                                                        })}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors flex items-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        Agregar Evento
                                                    </button>
                                                )}
                                            </FieldArray>
                                        )}
                                        
                                        {modoCreacionEventos === 'seleccionar' && (
                                            <button
                                                type="button"
                                                onClick={() => setMostrarEventos(!mostrarEventos)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                                            >
                                                {mostrarEventos ? 'Ocultar Eventos' : 'Seleccionar Eventos'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Mostrar eventos seleccionados cuando está en modo seleccionar */}
                                {modoCreacionEventos === 'seleccionar' && (
                                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                            Eventos Seleccionados ({eventosSeleccionados.length})
                                        </h4>
                                        {eventosSeleccionados.length === 0 ? (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                No hay eventos seleccionados. Haz clic en "Seleccionar Eventos" para elegir eventos disponibles.
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {eventosSeleccionados.slice(0, 5).map((evento) => (
                                                    <div key={evento.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                                                        <div>
                                                            <span className="text-sm font-medium">{evento.equipoLocal} vs {evento.equipoVisitante}</span>
                                                            <span className="text-xs text-gray-500 ml-2">{evento.deporte}</span>
                                                            <span className="text-xs text-gray-500 ml-2">
                                                                {new Date(evento.fechaEvento).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleEvento(evento)}
                                                            className="text-red-600 hover:text-red-800 text-xs"
                                                        >
                                                            Quitar
                                                        </button>
                                                    </div>
                                                ))}
                                                {eventosSeleccionados.length > 5 && (
                                                    <p className="text-xs text-gray-500">
                                                        Y {eventosSeleccionados.length - 5} eventos más...
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Lista de eventos disponibles para seleccionar */}
                                {modoCreacionEventos === 'seleccionar' && mostrarEventos && (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                                            Eventos Disponibles
                                        </h4>
                                        
                                        {eventosLoading ? (
                                            <div className="flex justify-center items-center py-8">
                                                <LoadingSpinner />
                                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                    Cargando eventos...
                                                </span>
                                            </div>
                                        ) : eventosError ? (
                                            <div className="text-center py-8">
                                                <p className="text-red-600 dark:text-red-400 text-sm">
                                                    Error al cargar eventos: {eventosError}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => cargarEventosDisponibles()}
                                                    className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Reintentar
                                                </button>
                                            </div>
                                        ) : eventosDisponibles.length === 0 ? (
                                            <p className="text-center py-8 text-gray-600 dark:text-gray-400 text-sm">
                                                No hay eventos disponibles en este momento
                                            </p>
                                        ) : (
                                            <div className="max-h-64 overflow-y-auto space-y-2">
                                                {eventosDisponibles.map((evento) => {
                                                    const seleccionado = esEventoSeleccionado(evento.id);
                                                    
                                                    return (
                                                        <div
                                                            key={evento.id}
                                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                                seleccionado
                                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                            }`}
                                                            onClick={() => toggleEvento(evento as EventoDeportivoType)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="font-medium text-sm">
                                                                            {evento.equipoLocal} vs {evento.equipoVisitante}
                                                                        </span>
                                                                        {seleccionado && (
                                                                            <span className="text-green-600 text-xs">✓ Seleccionado</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        <span>{evento.deporte}</span>
                                                                        {evento.liga && <span className="ml-2">• {evento.liga}</span>}
                                                                        <span className="ml-2">• {new Date(evento.fechaEvento).toLocaleDateString()}</span>
                                                                        {evento.yaEnQuiniela && (
                                                                            <span className="ml-2 text-orange-600">• Ya en quiniela</span>
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

                                {/* Formulario manual de eventos (solo cuando está en modo manual) */}
                                {modoCreacionEventos === 'manual' && (
                                    <FieldArray name="eventos">
                                        {({ remove }) => (
                                            <div className="space-y-4">
                                                {values.eventos.map((_, index) => (
                                                    <div key={index} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-md font-medium text-gray-900 dark:text-white">
                                                                Evento #{index + 1}
                                                            </h4>
                                                            {values.eventos.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => remove(index)}
                                                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors flex items-center"
                                                                >
                                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Eliminar
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {/* Nombre del Evento */}
                                                            <div className="lg:col-span-3">
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    Nombre del Evento *
                                                                </label>
                                                                <Field
                                                                    name={`eventos.${index}.nombreEvento`}
                                                                    type="text"
                                                                    placeholder="Ej: Real Madrid vs Barcelona"
                                                                    className="input w-full"
                                                                />
                                                                <ErrorMessage name={`eventos.${index}.nombreEvento`} component="div" className="text-red-500 text-xs mt-1" />
                                                            </div>

                                                            {/* Equipo Local */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    Equipo Local *
                                                                </label>
                                                                <Field
                                                                    name={`eventos.${index}.equipoLocal`}
                                                                    type="text"
                                                                    placeholder="Real Madrid"
                                                                    className="input w-full"
                                                                />
                                                                <ErrorMessage name={`eventos.${index}.equipoLocal`} component="div" className="text-red-500 text-xs mt-1" />
                                                            </div>

                                                            {/* Equipo Visitante */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    Equipo Visitante *
                                                                </label>
                                                                <Field
                                                                    name={`eventos.${index}.equipoVisitante`}
                                                                    type="text"
                                                                    placeholder="Barcelona"
                                                                    className="input w-full"
                                                                />
                                                                <ErrorMessage name={`eventos.${index}.equipoVisitante`} component="div" className="text-red-500 text-xs mt-1" />
                                                            </div>

                                                            {/* Fecha del Evento */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    Fecha y Hora *
                                                                </label>
                                                                <Field
                                                                    name={`eventos.${index}.fechaEvento`}
                                                                    type="datetime-local"
                                                                    className="input w-full"
                                                                />
                                                                <ErrorMessage name={`eventos.${index}.fechaEvento`} component="div" className="text-red-500 text-xs mt-1" />
                                                            </div>

                                                            {/* Puntos por Acierto */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    Puntos por Acierto *
                                                                </label>
                                                                <Field
                                                                    name={`eventos.${index}.puntosPorAcierto`}
                                                                    type="number"
                                                                    min="1"
                                                                    max="100"
                                                                    className="input w-full"
                                                                />
                                                                <ErrorMessage name={`eventos.${index}.puntosPorAcierto`} component="div" className="text-red-500 text-xs mt-1" />
                                                            </div>

                                                            {/* Multiplicador */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    Multiplicador
                                                                </label>
                                                                <Field
                                                                    name={`eventos.${index}.multiplicadorPuntos`}
                                                                    type="number"
                                                                    min="1"
                                                                    max="10"
                                                                    step="0.1"
                                                                    className="input w-full"
                                                                />
                                                                <ErrorMessage name={`eventos.${index}.multiplicadorPuntos`} component="div" className="text-red-500 text-xs mt-1" />
                                                            </div>

                                                            {/* Tipo de Predicción */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    Tipo de Predicción *
                                                                </label>
                                                                <Field
                                                                    as="select"
                                                                    name={`eventos.${index}.tipoPrediccion`}
                                                                    className="input w-full"
                                                                >
                                                                    <option value="RESULTADO">Resultado (1-X-2)</option>
                                                                    <option value="MARCADOR_EXACTO">Marcador Exacto</option>
                                                                    <option value="GOLES_OVER_UNDER">Goles Over/Under</option>
                                                                </Field>
                                                                <ErrorMessage name={`eventos.${index}.tipoPrediccion`} component="div" className="text-red-500 text-xs mt-1" />
                                                            </div>

                                                            {/* Checkbox Es Obligatorio */}
                                                            <div className="flex items-center">
                                                                <Field
                                                                    name={`eventos.${index}.esObligatorio`}
                                                                    type="checkbox"
                                                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                />
                                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                    Predicción Obligatoria
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                {values.eventos.length === 0 && (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8l2-2m0 0l2-2m-2 2v6m0-6H8" />
                                                        </svg>
                                                        <p className="text-sm">No hay eventos agregados.</p>
                                                        <p className="text-xs text-gray-400 mt-1">Agrega al menos un evento para continuar.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </FieldArray>
                                )}
                                
                                {/* Validación de eventos (aplica a ambos modos) */}
                                {modoCreacionEventos === 'seleccionar' && eventosSeleccionados.length === 0 && (
                                    <div className="text-center py-4 text-red-600 dark:text-red-400 text-sm">
                                        Debes seleccionar al menos un evento para continuar.
                                    </div>
                                )}
                                
                                <ErrorMessage name="eventos" component="div" className="text-red-500 text-sm" />
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isCreandoQuiniela || (modoCreacionEventos === 'seleccionar' && eventosSeleccionados.length === 0)}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {(isSubmitting || isCreandoQuiniela) && <LoadingSpinner />}
                                    {(isSubmitting || isCreandoQuiniela) ? 'Creando...' : 'Crear Quiniela'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CreateQuinielaForm;
