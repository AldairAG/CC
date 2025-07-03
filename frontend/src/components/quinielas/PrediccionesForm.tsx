import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useQuiniela } from '../../hooks/useQuiniela';
import { useUser } from '../../hooks/useUser';
import type { PrediccionRequestType } from '../../types/QuinielaType';
import type { EventoQuinielaType } from '../../types/QuinielaServiceTypes';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PrediccionesFormProps {
    participacionId: number;
    quinielaId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

// Tipos para el formulario
interface PrediccionFormData {
    eventoId: number;
    resultadoPredicho: string;
    marcadorPredicho: string;
    confianza: number;
}

interface FormValues {
    predicciones: PrediccionFormData[];
}

// Schema de validación
const validationSchema = Yup.object({
    predicciones: Yup.array()
        .of(
            Yup.object({
                eventoId: Yup.number().required('Evento requerido'),
                resultadoPredicho: Yup.string().required('Predicción requerida'),
                marcadorPredicho: Yup.string().when('resultadoPredicho', {
                    is: 'MARCADOR_EXACTO',
                    then: () => Yup.string()
                        .matches(/^\d+-\d+$/, 'Formato inválido (ej: 2-1)')
                        .required('Marcador requerido'),
                    otherwise: () => Yup.string()
                }),
                confianza: Yup.number()
                    .min(1, 'Mínimo 1')
                    .max(10, 'Máximo 10')
                    .required('Nivel de confianza requerido')
            })
        )
        .min(1, 'Debe hacer al menos una predicción')
        .required('Las predicciones son requeridas')
});

const PrediccionesForm: React.FC<PrediccionesFormProps> = ({
    participacionId,
    quinielaId,
    onSuccess,
    onCancel
}) => {
    const {
        quinielaActual,
        loadEventosQuiniela,
        makePredicciones,
        loadQuinielaDetail
    } = useQuiniela();
    
    const { user } = useUser();
    const [eventos, setEventos] = useState<EventoQuinielaType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Cargar detalles de la quiniela si no están disponibles
                if (!quinielaActual || quinielaActual.id !== quinielaId) {
                    await loadQuinielaDetail(quinielaId);
                }
                
                // Cargar eventos de la quiniela
                const eventosData = await loadEventosQuiniela(quinielaId);
                setEventos(eventosData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [quinielaId, quinielaActual, loadQuinielaDetail, loadEventosQuiniela]);

    const initialValues: FormValues = {
        predicciones: eventos.map(evento => ({
            eventoId: evento.id,
            resultadoPredicho: '',
            marcadorPredicho: '',
            confianza: 5
        }))
    };

    const handleSubmit = async (values: FormValues) => {
        if (!user) {
            console.error('Usuario no autenticado');
            return;
        }

        setSubmitting(true);
        try {
            const predicciones: PrediccionRequestType[] = values.predicciones
                .filter((p: PrediccionFormData) => p.resultadoPredicho) // Solo predicciones completadas
                .map((p: PrediccionFormData) => ({
                    eventoId: p.eventoId,
                    prediccion: p.marcadorPredicho || p.resultadoPredicho,
                    confianza: p.confianza
                }));

            await makePredicciones(participacionId, predicciones);
            onSuccess?.();
        } catch (error) {
            console.error('Error al guardar predicciones:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getResultadoOptions = () => [
        { value: 'LOCAL_GANA', label: 'Gana Local' },
        { value: 'EMPATE', label: 'Empate' },
        { value: 'VISITANTE_GANA', label: 'Gana Visitante' },
        { value: 'MARCADOR_EXACTO', label: 'Marcador Exacto' },
        { value: 'MAS_DE_2_5_GOLES', label: 'Más de 2.5 goles' },
        { value: 'MENOS_DE_2_5_GOLES', label: 'Menos de 2.5 goles' }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
                <span className="ml-2">Cargando eventos...</span>
            </div>
        );
    }

    if (eventos.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                    No hay eventos disponibles para esta quiniela.
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

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Hacer Predicciones
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Completa tus predicciones para {quinielaActual?.nombre}
                    </p>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ values }) => (
                        <Form className="p-6">
                            <FieldArray name="predicciones">
                                {() => (
                                    <div className="space-y-6">
                                        {eventos.map((evento, index) => (
                                            <div
                                                key={evento.id}
                                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {evento.equipoLocal} vs {evento.equipoVisitante}
                                                    </h3>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(evento.fechaEvento).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* Resultado Predicho */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Resultado *
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            name={`predicciones.${index}.resultadoPredicho`}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                        >
                                                            <option value="">Seleccionar...</option>
                                                            {getResultadoOptions().map(option => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage
                                                            name={`predicciones.${index}.resultadoPredicho`}
                                                            component="div"
                                                            className="text-red-500 text-sm mt-1"
                                                        />
                                                    </div>

                                                    {/* Marcador Exacto (condicional) */}
                                                    {values.predicciones[index]?.resultadoPredicho === 'MARCADOR_EXACTO' && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Marcador (ej: 2-1) *
                                                            </label>
                                                            <Field
                                                                name={`predicciones.${index}.marcadorPredicho`}
                                                                type="text"
                                                                placeholder="2-1"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            />
                                                            <ErrorMessage
                                                                name={`predicciones.${index}.marcadorPredicho`}
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Nivel de Confianza */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Confianza (1-10) *
                                                        </label>
                                                        <Field
                                                            name={`predicciones.${index}.confianza`}
                                                            type="number"
                                                            min="1"
                                                            max="10"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                        />
                                                        <ErrorMessage
                                                            name={`predicciones.${index}.confianza`}
                                                            component="div"
                                                            className="text-red-500 text-sm mt-1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FieldArray>

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
                                        {submitting ? 'Guardando...' : 'Guardar Predicciones'}
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

export default PrediccionesForm;
