import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useQuiniela } from '../../hooks/useQuiniela';
import { useUser } from '../../hooks/useUser';
import { useEvento } from '../../hooks/useEvento';
import type { QuinielaType } from '../../types/QuinielaType';
import { EstadoQuiniela } from '../../types/QuinielaType';
import type { EventoDeportivoType } from '../../types/EventoDeportivoTypes';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface EditQuinielaFormProps {
    quinielaId: number;
    onSuccess?: (quiniela: QuinielaType) => void;
    onCancel?: () => void;
}

// Formulario de edición de quiniela (solo campos editables)
interface EditQuinielaFormValues {
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaCierre: string;
    maxParticipantes: number;
    premioMinimo: number;
    esPublica: boolean;
    requiereAprobacion: boolean;
    reglasEspeciales?: string;
    requiereMinParticipantes?: number;
}

// Schema de validación
const validationSchema = Yup.object({
    nombre: Yup.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .required('El nombre es requerido'),
    descripcion: Yup.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .required('La descripción es requerida'),
    fechaInicio: Yup.date()
        .min(new Date(), 'La fecha de inicio debe ser futura')
        .required('La fecha de inicio es requerida'),
    fechaCierre: Yup.date()
        .min(Yup.ref('fechaInicio'), 'La fecha de cierre debe ser posterior al inicio')
        .required('La fecha de cierre es requerida'),
    maxParticipantes: Yup.number()
        .min(2, 'Mínimo 2 participantes')
        .max(10000, 'Máximo 10,000 participantes')
        .required('El número máximo de participantes es requerido'),
    premioMinimo: Yup.number()
        .min(0, 'El premio mínimo no puede ser negativo')
        .required('El premio mínimo es requerido'),
    esPublica: Yup.boolean(),
    requiereAprobacion: Yup.boolean(),
    requiereMinParticipantes: Yup.number()
        .min(0, 'No puede ser negativo')
        .max(Yup.ref('maxParticipantes'), 'No puede ser mayor al máximo de participantes'),
    reglasEspeciales: Yup.string()
        .max(1000, 'Las reglas no pueden exceder 1000 caracteres')
});

const EditQuinielaForm: React.FC<EditQuinielaFormProps> = ({
    quinielaId,
    onSuccess,
    onCancel
}) => {
    const {
        quinielaActual,
        loadQuinielaDetail,
        clearCurrentQuiniela,
        clearAllErrors
    } = useQuiniela();

    const { 
        eventosDisponibles,
        eventosLoading,
        error: eventosError,
        cargarEventosDisponibles,
        agregarEventosAQuiniela
    } = useEvento();

    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [eventosSeleccionados, setEventosSeleccionados] = useState<EventoDeportivoType[]>([]);
    const [mostrarEventos, setMostrarEventos] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await loadQuinielaDetail(quinielaId);
            } catch (error) {
                console.error('Error al cargar quiniela:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        return () => {
            clearCurrentQuiniela();
        };
    }, [quinielaId, loadQuinielaDetail, clearCurrentQuiniela]);

    useEffect(() => {
        // Verificar si el usuario puede editar la quiniela
        if (quinielaActual && user) {
            const isCreator = quinielaActual.creadorId === user.idUsuario;
            const isEditable = quinielaActual.estado === EstadoQuiniela.BORRADOR || 
                              quinielaActual.estado === EstadoQuiniela.ACTIVA;
            setCanEdit(isCreator && isEditable);
        }
    }, [quinielaActual, user]);

    // Cargar eventos disponibles cuando se puede editar la quiniela
    useEffect(() => {
        if (canEdit) {
            cargarEventosDisponibles();
        }
    }, [canEdit, cargarEventosDisponibles]);

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

    const getInitialValues = (): EditQuinielaFormValues => {
        if (!quinielaActual) {
            return {
                nombre: '',
                descripcion: '',
                fechaInicio: '',
                fechaCierre: '',
                maxParticipantes: 2,
                premioMinimo: 0,
                esPublica: true,
                requiereAprobacion: false,
                reglasEspeciales: '',
                requiereMinParticipantes: undefined
            };
        }

        return {
            nombre: quinielaActual.nombre,
            descripcion: quinielaActual.descripcion,
            fechaInicio: new Date(quinielaActual.fechaInicio).toISOString().slice(0, 16),
            fechaCierre: new Date(quinielaActual.fechaCierre).toISOString().slice(0, 16),
            maxParticipantes: quinielaActual.maxParticipantes,
            premioMinimo: quinielaActual.premioMinimo,
            esPublica: quinielaActual.esPublica,
            requiereAprobacion: quinielaActual.requiereAprobacion,
            reglasEspeciales: quinielaActual.reglasEspeciales || '',
            requiereMinParticipantes: quinielaActual.requiereMinParticipantes
        };
    };

    const handleSubmit = async (values: EditQuinielaFormValues) => {
        if (!quinielaActual) return;

        setSubmitting(true);
        try {
            clearAllErrors();
            
            // Log de la información que se enviará
            console.log('Actualizando quiniela:', {
                ...values,
                eventosSeleccionados: eventosSeleccionados.map(e => ({
                    id: e.id,
                    nombre: `${e.equipoLocal} vs ${e.equipoVisitante}`,
                    deporte: e.deporte
                }))
            });
            
            // Agregar eventos seleccionados a la quiniela
            if (eventosSeleccionados.length > 0) {
                const eventosIds = eventosSeleccionados.map(e => e.id);
                const resultadoEventos = await agregarEventosAQuiniela(quinielaActual.id, eventosIds);
                
                if (!resultadoEventos) {
                    console.error('Error al agregar eventos a la quiniela');
                    // Continuar con la actualización de la quiniela pero mostrar advertencia
                }
            }
            
            // Por ahora, simular éxito de actualización de quiniela
            const updatedQuiniela: QuinielaType = {
                ...quinielaActual,
                ...values,
                fechaInicio: new Date(values.fechaInicio).toISOString(),
                fechaCierre: new Date(values.fechaCierre).toISOString(),
                fechaActualizacion: new Date().toISOString()
            };

            // Mostrar mensaje de éxito
            console.log(`Quiniela actualizada con ${eventosSeleccionados.length} eventos seleccionados`);
            
            onSuccess?.(updatedQuiniela);
        } catch (error) {
            console.error('Error al actualizar quiniela:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
                <span className="ml-2">Cargando quiniela...</span>
            </div>
        );
    }

    if (!quinielaActual) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400">
                    Error: No se pudo cargar la quiniela.
                </p>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        Regresar
                    </button>
                )}
            </div>
        );
    }

    if (!canEdit) {
        return (
            <div className="text-center py-8">
                <p className="text-yellow-600 dark:text-yellow-400 mb-4">
                    {quinielaActual.creadorId !== user?.idUsuario 
                        ? 'No tienes permisos para editar esta quiniela.'
                        : 'Esta quiniela no se puede editar en su estado actual.'}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <p><strong>Estado:</strong> {quinielaActual.estado}</p>
                    <p><strong>Participantes:</strong> {quinielaActual.participantesActuales}</p>
                </div>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        Regresar
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Editar Quiniela
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Modifica los datos de tu quiniela "{quinielaActual.nombre}"
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                            quinielaActual.estado === EstadoQuiniela.ACTIVA 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                            {quinielaActual.estado}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            Código: {quinielaActual.codigoUnico}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            Pool: ${quinielaActual.poolActual.toLocaleString()}
                        </span>
                    </div>
                </div>

                <Formik
                    initialValues={getInitialValues()}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {() => (
                        <Form className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Información Básica */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                                        Información Básica
                                    </h3>
                                    
                                    {/* Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nombre *
                                        </label>
                                        <Field
                                            name="nombre"
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <ErrorMessage name="nombre" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Descripción *
                                        </label>
                                        <Field
                                            as="textarea"
                                            name="descripcion"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <ErrorMessage name="descripcion" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* Reglas Especiales */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Reglas Especiales
                                        </label>
                                        <Field
                                            as="textarea"
                                            name="reglasEspeciales"
                                            rows={3}
                                            placeholder="Reglas adicionales de la quiniela..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <ErrorMessage name="reglasEspeciales" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Configuración y Fechas */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                                        Configuración
                                    </h3>

                                    {/* Fechas */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Fecha y Hora de Inicio *
                                            </label>
                                            <Field
                                                name="fechaInicio"
                                                type="datetime-local"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            <ErrorMessage name="fechaInicio" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Fecha y Hora de Cierre *
                                            </label>
                                            <Field
                                                name="fechaCierre"
                                                type="datetime-local"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            <ErrorMessage name="fechaCierre" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </div>

                                    {/* Participantes y Premio */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Máx. Participantes *
                                            </label>
                                            <Field
                                                name="maxParticipantes"
                                                type="number"
                                                min="2"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            <ErrorMessage name="maxParticipantes" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Premio Mínimo *
                                            </label>
                                            <Field
                                                name="premioMinimo"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            <ErrorMessage name="premioMinimo" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </div>

                                    {/* Mín. Participantes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Mínimo de Participantes
                                        </label>
                                        <Field
                                            name="requiereMinParticipantes"
                                            type="number"
                                            min="0"
                                            placeholder="Opcional"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <ErrorMessage name="requiereMinParticipantes" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* Configuraciones Booleanas */}
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <Field
                                                name="esPublica"
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                                Quiniela pública (visible para todos)
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <Field
                                                name="requiereAprobacion"
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                                Requiere aprobación para participar
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información no editable */}
                            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                    Información no editable
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                                        <p className="font-medium">{quinielaActual.tipoQuiniela}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Distribución:</span>
                                        <p className="font-medium">{quinielaActual.tipoDistribucion}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Costo:</span>
                                        <p className="font-medium">${quinielaActual.costoParticipacion}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Participantes:</span>
                                        <p className="font-medium">{quinielaActual.participantesActuales}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Gestión de Eventos */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Eventos Deportivos
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setMostrarEventos(!mostrarEventos)}
                                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        {mostrarEventos ? 'Ocultar Eventos' : 'Gestionar Eventos'}
                                    </button>
                                </div>

                                {/* Resumen de eventos seleccionados */}
                                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Eventos Seleccionados ({eventosSeleccionados.length})
                                    </h4>
                                    {eventosSeleccionados.length === 0 ? (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            No hay eventos seleccionados
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {eventosSeleccionados.slice(0, 3).map((evento) => (
                                                <div key={evento.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                                                    <div>
                                                        <span className="text-sm font-medium">{evento.equipoLocal} vs {evento.equipoVisitante}</span>
                                                        <span className="text-xs text-gray-500 ml-2">{evento.deporte}</span>
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
                                            {eventosSeleccionados.length > 3 && (
                                                <p className="text-xs text-gray-500">
                                                    Y {eventosSeleccionados.length - 3} eventos más...
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Lista de eventos disponibles */}
                                {mostrarEventos && (
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
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                {onCancel && (
                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        disabled={submitting}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                                >
                                    {submitting && <LoadingSpinner />}
                                    <span className={submitting ? 'ml-2' : ''}>
                                        {submitting ? 'Guardando...' : 'Actualizar Quiniela'}
                                    </span>
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EditQuinielaForm;
