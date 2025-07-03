import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useQuiniela } from '../../hooks/useQuiniela';
import { useUser } from '../../hooks/useUser';
import type { CrearQuinielaRequestType } from '../../types/QuinielaType';
import { TipoQuiniela, TipoDistribucion } from '../../types/QuinielaType';
import LoadingSpinner from '../ui/LoadingSpinner';

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
        .max(1000, 'Las reglas no pueden exceder 1000 caracteres')
});

const CreateQuinielaForm: React.FC = () => {
    const { createQuiniela, isCreandoQuiniela, errorCrearQuiniela, clearAllErrors } = useQuiniela();
    const { user } = useUser();

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
        reglasEspeciales: ''
    };

    const handleSubmit = async (values: any, helpers: { setSubmitting: (submitting: boolean) => void; resetForm: () => void }) => {
        const { setSubmitting, resetForm } = helpers;
        try {
            clearAllErrors();
            
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
                reglasEspeciales: values.reglasEspeciales || undefined
            };

            const result = await createQuiniela(quinielaData);
            
            if (result) {
                resetForm();
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
                    {({ isSubmitting, values }) => (
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
                                    disabled={isSubmitting || isCreandoQuiniela}
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
