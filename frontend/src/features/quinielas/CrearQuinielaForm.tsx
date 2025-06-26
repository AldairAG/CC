import React, { type JSX } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { CrearQuinielaRequest, QuinielaResponse, EventoQuinielaRequest } from '../../types/QuinielaType';
import { useQuiniela } from '../../hooks/useQuiniela';
import { SportLeagueSelector } from './SportLeagueSelector';
import { EnhancedEventSelector } from './EnhancedEventSelector';
import { GameModeSelector } from './GameModeSelector';

interface Props {
    onQuinielaCreada?: (quiniela: QuinielaResponse) => void;
    onCancelar?: () => void;
}

// Esquema de validación con Yup
const validationSchema = Yup.object({
    nombre: Yup.string()
        .required('El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    
    descripcion: Yup.string()
        .max(500, 'La descripción no puede exceder 500 caracteres'),
    
    fechaInicio: Yup.date()
        .required('La fecha de inicio es requerida')
        .min(new Date(), 'La fecha de inicio debe ser futura'),
    
    horaInicio: Yup.string()
        .required('La hora de inicio es requerida')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
    
    fechaFin: Yup.date()
        .required('La fecha de fin es requerida')
        .min(Yup.ref('fechaInicio'), 'La fecha de fin debe ser posterior al inicio'),
    
    horaFin: Yup.string()
        .required('La hora de fin es requerida')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
    
    precioEntrada: Yup.number()
        .required('El precio de entrada es requerido')
        .min(0.01, 'El precio debe ser mayor a 0')
        .max(10000, 'El precio no puede exceder $10,000'),
    
    maxParticipantes: Yup.number()
        .nullable()
        .min(2, 'Mínimo 2 participantes')
        .max(1000, 'Máximo 1000 participantes'),
    
    tipoDistribucion: Yup.string()
        .oneOf(['WINNER_TAKES_ALL', 'TOP_3', 'PERCENTAGE', 'ELIMINATION', 'ACCUMULATIVE', 'TEAMS'], 'Tipo de distribución inválido')
        .required('Selecciona un tipo de distribución'),
    
    porcentajePremiosPrimero: Yup.number()
        .min(0, 'No puede ser negativo')
        .max(100, 'No puede ser mayor a 100%'),
    
    porcentajePremiosSegundo: Yup.number()
        .min(0, 'No puede ser negativo')
        .max(100, 'No puede ser mayor a 100%'),
    
    porcentajePremiosTercero: Yup.number()
        .min(0, 'No puede ser negativo')
        .max(100, 'No puede ser mayor a 100%'),
    
    esPublica: Yup.boolean(),
    
    // Nuevos campos para deporte y liga
    selectedSport: Yup.string()
        .required('Debes seleccionar un deporte'),
    
    selectedLeague: Yup.string()
        .required('Debes seleccionar una liga'),
    
    eventos: Yup.array()
        .min(1, 'Debes seleccionar al menos un evento')
        .required('Los eventos son requeridos'),
}).test('fecha-hora-validacion', 'Validación de fecha y hora', function (values) {
    const { fechaInicio, horaInicio, fechaFin, horaFin } = values;
    
    if (fechaInicio && horaInicio && fechaFin && horaFin) {
        const fechaHoraInicio = new Date(`${fechaInicio}T${horaInicio}:00`);
        const fechaHoraFin = new Date(`${fechaFin}T${horaFin}:00`);
        const ahora = new Date();
        
        // Verificar que la fecha y hora de inicio sea futura
        if (fechaHoraInicio <= ahora) {
            return this.createError({
                path: 'horaInicio',
                message: 'La fecha y hora de inicio debe ser futura'
            });
        }
        
        // Verificar que la fecha y hora de fin sea posterior al inicio
        if (fechaHoraFin <= fechaHoraInicio) {
            return this.createError({
                path: 'horaFin',
                message: 'La fecha y hora de fin debe ser posterior al inicio'
            });
        }
    }
    
    return true;
}).test('porcentajes-sum', 'Los porcentajes deben sumar 100%', function (values) {
    const { tipoDistribucion, porcentajePremiosPrimero, porcentajePremiosSegundo, porcentajePremiosTercero } = values;
    
    if (tipoDistribucion === 'TOP_3' || tipoDistribucion === 'PERCENTAGE') {
        const total = (porcentajePremiosPrimero || 0) + (porcentajePremiosSegundo || 0) + (porcentajePremiosTercero || 0);
        if (total !== 100) {
            return this.createError({
                path: 'porcentajes',
                message: `Los porcentajes suman ${total}% - deben sumar 100%`
            });
        }
    }
    return true;
});

// Valores iniciales del formulario
const initialValues: CrearQuinielaRequest & { 
    horaInicio: string; 
    horaFin: string; 
    selectedSport: string; 
    selectedLeague: string; 
} = {
    nombre: '',
    descripcion: '',
    fechaInicio: "",
    horaInicio: "09:00",
    fechaFin: "",
    horaFin: "18:00",
    precioEntrada: 0,
    maxParticipantes: undefined,
    tipoDistribucion: 'WINNER_TAKES_ALL',
    porcentajePremiosPrimero: 100,
    porcentajePremiosSegundo: 0,
    porcentajePremiosTercero: 0,
    esPublica: true,
    selectedSport: '',
    selectedLeague: '',
    eventos: []
};

export const CrearQuinielaForm: React.FC<Props> = ({ onQuinielaCreada, onCancelar }) => {
    const { crearQuiniela, loading } = useQuiniela();

    // Función para formatear fecha y hora a ISO string
    const formatDateTimeForAPI = (date: string | Date, time: string): string => {
        if (!date || !time) return '';
        const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
        return `${dateStr}T${time}:00`;
    };

    // Función para obtener la hora actual + 1 hora
    const getCurrentTimePlusOne = (): string => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now.toTimeString().slice(0, 5); // "HH:MM"
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (values: CrearQuinielaRequest & { 
        horaInicio: string; 
        horaFin: string;
        selectedSport: string;
        selectedLeague: string;
    }) => {
        try {
            // Formatear fechas con horas antes de enviar
            const formattedValues: CrearQuinielaRequest = {
                ...values,
                fechaInicio: formatDateTimeForAPI(values.fechaInicio, values.horaInicio),
                fechaFin: formatDateTimeForAPI(values.fechaFin, values.horaFin),
                // Limpiar campos condicionales
                maxParticipantes: values.maxParticipantes || undefined,
            };
            // Remover campos que no van al backend
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { selectedSport, selectedLeague, ...finalValues } = formattedValues as CrearQuinielaRequest & { 
                selectedSport: string; 
                selectedLeague: string;
            };
            
            const quinielaCreada = await crearQuiniela(finalValues);
            onQuinielaCreada?.(quinielaCreada);
        } catch (error) {
            console.error('Error al crear quiniela:', error);
        }
    };

    // Función para generar opciones de hora
    const generateTimeOptions = (): JSX.Element[] => {
        const options: JSX.Element[] = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push(
                    <option key={timeString} value={timeString}>
                        {timeString}
                    </option>
                );
            }
        }
        return options;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🏆 Crear Nueva Quiniela</h2>
                {onCancelar && (
                    <button
                        onClick={onCancelar}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ✕
                    </button>
                )}
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                    <Form className="space-y-6">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la Quiniela *
                                </label>
                                <Field
                                    type="text"
                                    name="nombre"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.nombre && touched.nombre ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: Mundial 2026 - Grupo A"
                                />
                                <ErrorMessage name="nombre" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio de Entrada *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                                    <Field
                                        type="number"
                                        name="precioEntrada"
                                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.precioEntrada && touched.precioEntrada ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <ErrorMessage name="precioEntrada" component="p" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <Field
                                as="textarea"
                                name="descripcion"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe tu quiniela..."
                            />
                            <ErrorMessage name="descripcion" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Fechas y Horas */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800">📅 Programación</h3>
                            
                            {/* Fecha y Hora de Inicio */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de Inicio *
                                    </label>
                                    <Field
                                        type="date"
                                        name="fechaInicio"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.fechaInicio && touched.fechaInicio ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <ErrorMessage name="fechaInicio" component="p" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora de Inicio *
                                    </label>
                                    <div className="flex gap-2">
                                        <Field
                                            as="select"
                                            name="horaInicio"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.horaInicio && touched.horaInicio ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            {generateTimeOptions()}
                                        </Field>
                                        <button
                                            type="button"
                                            onClick={() => setFieldValue('horaInicio', getCurrentTimePlusOne())}
                                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                                            title="Establecer hora actual + 1 hora"
                                        >
                                            Ahora+1h
                                        </button>
                                    </div>
                                    <ErrorMessage name="horaInicio" component="p" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>

                            {/* Fecha y Hora de Fin */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de Fin *
                                    </label>
                                    <Field
                                        type="date"
                                        name="fechaFin"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.fechaFin && touched.fechaFin ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        min={values.fechaInicio || new Date().toISOString().split('T')[0]}
                                    />
                                    <ErrorMessage name="fechaFin" component="p" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora de Fin *
                                    </label>
                                    <Field
                                        as="select"
                                        name="horaFin"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.horaFin && touched.horaFin ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        {generateTimeOptions()}
                                    </Field>
                                    <ErrorMessage name="horaFin" component="p" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>

                            {/* Vista previa de fechas */}
                            {values.fechaInicio && values.horaInicio && values.fechaFin && values.horaFin && (
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Resumen de Programación</h4>
                                    <div className="text-sm text-blue-700 space-y-1">
                                        <div>
                                            <strong>Inicio:</strong> {new Date(`${values.fechaInicio}T${values.horaInicio}:00`).toLocaleString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <div>
                                            <strong>Fin:</strong> {new Date(`${values.fechaFin}T${values.horaFin}:00`).toLocaleString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <div>
                                            <strong>Duración:</strong> {(() => {
                                                const inicio = new Date(`${values.fechaInicio}T${values.horaInicio}:00`);
                                                const fin = new Date(`${values.fechaFin}T${values.horaFin}:00`);
                                                const diff = fin.getTime() - inicio.getTime();
                                                const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
                                                const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                                const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                                
                                                if (dias > 0) {
                                                    return `${dias} día${dias > 1 ? 's' : ''} ${horas} hora${horas !== 1 ? 's' : ''}`;
                                                } else if (horas > 0) {
                                                    return `${horas} hora${horas !== 1 ? 's' : ''} ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
                                                } else {
                                                    return `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Configuración */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Máximo de Participantes
                                </label>
                                <Field
                                    type="number"
                                    name="maxParticipantes"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="2"
                                    placeholder="Sin límite"
                                />
                                <ErrorMessage name="maxParticipantes" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="flex items-center space-y-3">
                                <div className="flex items-center">
                                    <Field
                                        type="checkbox"
                                        name="esPublica"
                                        className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm text-gray-700">Quiniela pública</label>
                                </div>
                            </div>
                        </div>

                        {/* Selección de Deporte y Liga */}
                        <div className="border-t pt-6">
                            <SportLeagueSelector
                                selectedSport={values.selectedSport}
                                selectedLeague={values.selectedLeague}
                                onSportChange={(sport: string) => {
                                    setFieldValue('selectedSport', sport);
                                    setFieldValue('eventos', []); // Limpiar eventos al cambiar deporte
                                }}
                                onLeagueChange={(league: string) => {
                                    setFieldValue('selectedLeague', league);
                                    setFieldValue('eventos', []); // Limpiar eventos al cambiar liga
                                }}
                            />
                            <ErrorMessage name="selectedSport" component="p" className="text-red-500 text-sm mt-1" />
                            <ErrorMessage name="selectedLeague" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Selección de Modo de Juego */}
                        <div className="border-t pt-6">
                            <GameModeSelector
                                tipoDistribucion={values.tipoDistribucion}
                                porcentajes={{
                                    primero: values.porcentajePremiosPrimero || 0,
                                    segundo: values.porcentajePremiosSegundo || 0,
                                    tercero: values.porcentajePremiosTercero || 0
                                }}
                            />
                        </div>

                        {/* Selector de eventos */}
                        <div className="border-t pt-6">
                            <EnhancedEventSelector
                                selectedSport={values.selectedSport}
                                selectedLeague={values.selectedLeague}
                                eventosSeleccionados={values.eventos}
                                onEventosChange={(eventos: EventoQuinielaRequest[]) => setFieldValue('eventos', eventos)}
                            />
                            <ErrorMessage name="eventos" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            {onCancelar && (
                                <button
                                    type="button"
                                    onClick={onCancelar}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting || loading}
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting || loading ? (
                                    <span className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creando...
                                    </span>
                                ) : (
                                    '🏆 Crear Quiniela'
                                )}
                            </button>
                        </div>

                        {/* Debug info en desarrollo */}
                        {import.meta.env.DEV && (
                            <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                                <details>
                                    <summary className="cursor-pointer font-medium">Debug Info</summary>
                                    <pre className="mt-2 text-xs">
                                        Fechas formateadas: {JSON.stringify({
                                            fechaInicio: formatDateTimeForAPI(values.fechaInicio, values.horaInicio),
                                            fechaFin: formatDateTimeForAPI(values.fechaFin, values.horaFin)
                                        }, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
};
