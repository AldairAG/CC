import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useQuiniela } from '../../hooks/useQuiniela';
import { useUser } from '../../hooks/useUser';
import type { EventoQuinielaType } from '../../types/QuinielaServiceTypes';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface QuinielaEventsManagerProps {
    quinielaId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
    readOnly?: boolean;
}

// Tipo para el formulario de evento
interface EventoFormData {
    id?: number;
    equipoLocal: string;
    equipoVisitante: string;
    fechaEvento: string;
    liga: string;
    multiplicador: number;
    estado: 'PROGRAMADO' | 'EN_VIVO' | 'FINALIZADO' | 'SUSPENDIDO';
    resultadoReal?: string;
    marcadorFinal?: string;
}

interface FormValues {
    eventos: EventoFormData[];
}

// Schema de validación para eventos
const validationSchema = Yup.object({
    eventos: Yup.array()
        .of(
            Yup.object({
                equipoLocal: Yup.string()
                    .min(2, 'Mínimo 2 caracteres')
                    .required('Equipo local requerido'),
                equipoVisitante: Yup.string()
                    .min(2, 'Mínimo 2 caracteres')
                    .required('Equipo visitante requerido'),
                fechaEvento: Yup.date()
                    .min(new Date(), 'La fecha debe ser futura')
                    .required('Fecha del evento requerida'),
                liga: Yup.string()
                    .min(2, 'Liga requerida')
                    .required('Liga requerida'),
                multiplicador: Yup.number()
                    .min(0.1, 'Mínimo 0.1')
                    .max(10, 'Máximo 10')
                    .required('Multiplicador requerido'),
                estado: Yup.string()
                    .oneOf(['PROGRAMADO', 'EN_VIVO', 'FINALIZADO', 'SUSPENDIDO'])
                    .required('Estado requerido'),
                marcadorFinal: Yup.string().when('estado', {
                    is: 'FINALIZADO',
                    then: () => Yup.string()
                        .matches(/^\d+-\d+$/, 'Formato inválido (ej: 2-1)')
                        .required('Marcador final requerido'),
                    otherwise: () => Yup.string()
                })
            })
        )
        .min(1, 'Debe agregar al menos un evento')
        .required('Los eventos son requeridos')
});

const QuinielaEventsManager: React.FC<QuinielaEventsManagerProps> = ({
    quinielaId,
    onSuccess,
    onCancel,
    readOnly = false
}) => {
    const {
        quinielaActual,
        loadQuinielaDetail,
        loadEventosQuiniela
    } = useQuiniela();

    const { user } = useUser();
    const [eventos, setEventos] = useState<EventoQuinielaType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Cargar detalles de la quiniela
                await loadQuinielaDetail(quinielaId);
                
                // Cargar eventos
                const eventosData = await loadEventosQuiniela(quinielaId);
                setEventos(eventosData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [quinielaId, loadQuinielaDetail, loadEventosQuiniela]);

    useEffect(() => {
        // Verificar si el usuario puede editar eventos
        if (quinielaActual && user && !readOnly) {
            const isCreator = quinielaActual.creadorId === user.idUsuario;
            const isEditable = quinielaActual.estado === 'BORRADOR' || quinielaActual.estado === 'ACTIVA';
            setCanEdit(isCreator && isEditable);
        }
    }, [quinielaActual, user, readOnly]);

    const getInitialValues = (): FormValues => {
        if (eventos.length === 0) {
            return {
                eventos: [{
                    equipoLocal: '',
                    equipoVisitante: '',
                    fechaEvento: '',
                    liga: '',
                    multiplicador: 1,
                    estado: 'PROGRAMADO',
                    resultadoReal: '',
                    marcadorFinal: ''
                }]
            };
        }

        return {
            eventos: eventos.map(evento => ({
                id: evento.id,
                equipoLocal: evento.equipoLocal,
                equipoVisitante: evento.equipoVisitante,
                fechaEvento: new Date(evento.fechaEvento).toISOString().slice(0, 16),
                liga: evento.nombreEvento || '',
                multiplicador: evento.multiplicadorPuntos || 1,
                estado: evento.estado as EventoFormData['estado'],
                resultadoReal: evento.resultado ? `${evento.resultado.marcadorLocal}-${evento.resultado.marcadorVisitante}` : '',
                marcadorFinal: evento.resultado ? `${evento.resultado.marcadorLocal}-${evento.resultado.marcadorVisitante}` : ''
            }))
        };
    };

    const handleSubmit = async (values: FormValues) => {
        setSubmitting(true);
        try {
            // Aquí irían las llamadas al servicio para guardar/actualizar eventos
            console.log('Guardando eventos:', values.eventos);
            
            // Simular guardado exitoso
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSuccess?.();
        } catch (error) {
            console.error('Error al guardar eventos:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'PROGRAMADO':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'EN_VIVO':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'FINALIZADO':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            case 'SUSPENDIDO':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
                <span className="ml-2">Cargando eventos...</span>
            </div>
        );
    }

    if (readOnly && eventos.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                    No hay eventos configurados para esta quiniela.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {readOnly ? 'Eventos de la Quiniela' : 'Gestionar Eventos'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {readOnly 
                            ? `Eventos configurados para "${quinielaActual?.nombre}"`
                            : `Configura los eventos para "${quinielaActual?.nombre}"`
                        }
                    </p>
                    {quinielaActual && (
                        <div className="flex items-center space-x-4 mt-3 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                Estado: {quinielaActual.estado}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                Participantes: {quinielaActual.participantesActuales}/{quinielaActual.maxParticipantes}
                            </span>
                        </div>
                    )}
                </div>

                {readOnly ? (
                    // Vista de solo lectura
                    <div className="p-6">
                        <div className="space-y-4">
                            {eventos.map((evento) => (
                                <div
                                    key={evento.id}
                                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {evento.equipoLocal} vs {evento.equipoVisitante}
                                        </h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(evento.estado)}`}>
                                            {evento.estado}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                                            <p className="font-medium">
                                                {new Date(evento.fechaEvento).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Liga:</span>
                                            <p className="font-medium">{evento.nombreEvento}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Multiplicador:</span>
                                            <p className="font-medium">x{evento.multiplicadorPuntos || 1}</p>
                                        </div>
                                        {evento.resultado && (
                                            <div>
                                                <span className="text-gray-600 dark:text-gray-400">Resultado:</span>
                                                <p className="font-medium text-green-600 dark:text-green-400">
                                                    {evento.resultado.marcadorLocal}-{evento.resultado.marcadorVisitante}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Formulario de edición
                    <Formik
                        initialValues={getInitialValues()}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values }) => (
                            <Form className="p-6">
                                <FieldArray name="eventos">
                                    {({ push, remove }) => (
                                        <div className="space-y-6">
                                            {values.eventos.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            Evento {index + 1}
                                                        </h3>
                                                        {values.eventos.length > 1 && canEdit && (
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="text-red-600 hover:text-red-700 text-sm"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {/* Equipo Local */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Equipo Local *
                                                            </label>
                                                            <Field
                                                                name={`eventos.${index}.equipoLocal`}
                                                                type="text"
                                                                disabled={!canEdit}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                                                            />
                                                            <ErrorMessage
                                                                name={`eventos.${index}.equipoLocal`}
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1"
                                                            />
                                                        </div>

                                                        {/* Equipo Visitante */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Equipo Visitante *
                                                            </label>
                                                            <Field
                                                                name={`eventos.${index}.equipoVisitante`}
                                                                type="text"
                                                                disabled={!canEdit}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                                                            />
                                                            <ErrorMessage
                                                                name={`eventos.${index}.equipoVisitante`}
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1"
                                                            />
                                                        </div>

                                                        {/* Liga */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Liga *
                                                            </label>
                                                            <Field
                                                                name={`eventos.${index}.liga`}
                                                                type="text"
                                                                disabled={!canEdit}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                                                            />
                                                            <ErrorMessage
                                                                name={`eventos.${index}.liga`}
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1"
                                                            />
                                                        </div>

                                                        {/* Fecha del Evento */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Fecha y Hora *
                                                            </label>
                                                            <Field
                                                                name={`eventos.${index}.fechaEvento`}
                                                                type="datetime-local"
                                                                disabled={!canEdit}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                                                            />
                                                            <ErrorMessage
                                                                name={`eventos.${index}.fechaEvento`}
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1"
                                                            />
                                                        </div>

                                                        {/* Estado */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Estado *
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name={`eventos.${index}.estado`}
                                                                disabled={!canEdit}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                                                            >
                                                                <option value="PROGRAMADO">Programado</option>
                                                                <option value="EN_VIVO">En Vivo</option>
                                                                <option value="FINALIZADO">Finalizado</option>
                                                                <option value="SUSPENDIDO">Suspendido</option>
                                                            </Field>
                                                            <ErrorMessage
                                                                name={`eventos.${index}.estado`}
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1"
                                                            />
                                                        </div>

                                                        {/* Multiplicador */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Multiplicador *
                                                            </label>
                                                            <Field
                                                                name={`eventos.${index}.multiplicador`}
                                                                type="number"
                                                                min="0.1"
                                                                max="10"
                                                                step="0.1"
                                                                disabled={!canEdit}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                                                            />
                                                            <ErrorMessage
                                                                name={`eventos.${index}.multiplicador`}
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Marcador Final (solo si está finalizado) */}
                                                    {values.eventos[index].estado === 'FINALIZADO' && (
                                                        <div className="mt-4">
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Marcador Final *
                                                            </label>
                                                            <Field
                                                                name={`eventos.${index}.marcadorFinal`}
                                                                type="text"
                                                                placeholder="2-1"
                                                                disabled={!canEdit}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                                                            />
                                                            <ErrorMessage
                                                                name={`eventos.${index}.marcadorFinal`}
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Botón para agregar evento */}
                                            {canEdit && (
                                                <div className="text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => push({
                                                            equipoLocal: '',
                                                            equipoVisitante: '',
                                                            fechaEvento: '',
                                                            liga: '',
                                                            multiplicador: 1,
                                                            estado: 'PROGRAMADO',
                                                            resultadoReal: '',
                                                            marcadorFinal: ''
                                                        })}
                                                        className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
                                                    >
                                                        + Agregar Evento
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </FieldArray>

                                {/* Botones de acción */}
                                {canEdit && (
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
                                                {submitting ? 'Guardando...' : 'Guardar Eventos'}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </div>
    );
};

export default QuinielaEventsManager;
