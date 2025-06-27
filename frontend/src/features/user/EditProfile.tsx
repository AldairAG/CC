import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useUserProfile } from '../../hooks/useUserProfile';
import type { ActualizarPerfilRequest, PerfilUsuarioCompleto } from '../../types/PerfilTypes';

// Validation schema with Yup
const validationSchema = Yup.object({
    nombre: Yup.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede tener más de 50 caracteres')
        .required('El nombre es requerido'),
    apellido: Yup.string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede tener más de 50 caracteres')
        .required('El apellido es requerido'),
    telefono: Yup.string()
        .matches(/^\d{10}$/, 'El teléfono debe tener exactamente 10 dígitos')
        .required('El teléfono es requerido'),
    lada: Yup.string()
        .matches(/^\+\d{1,4}$/, 'La lada debe tener el formato +52')
        .optional(),
    fechaNacimiento: Yup.date()
        .max(new Date(), 'La fecha de nacimiento no puede ser futura')
        .min(new Date('1900-01-01'), 'Fecha de nacimiento inválida')
        .test('age', 'Debes ser mayor de 18 años', function(value) {
            if (!value) return false;
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                return age - 1 >= 18;
            }
            return age >= 18;
        })
        .required('La fecha de nacimiento es requerida'),
});

const EditProfile = () => {
    const { 
        user, 
        updateProfile, 
        loading, 
        getUserProfile
    } = useUserProfile();

    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [perfilCompleto, setPerfilCompleto] = React.useState<PerfilUsuarioCompleto | null>(null);

    // Load user profile when component mounts
    useEffect(() => {
        const loadProfile = async () => {
            if (user?.idUsuario) {
                const profile = await getUserProfile(user.idUsuario);                
                if (profile) {
                    setPerfilCompleto(profile);
                }
            }
        };
        
        loadProfile();
    }, []);

    // Helper function to format date for input
    const formatDateForInput = (dateString?: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    };

    // Initial values for the form
    const initialValues: ActualizarPerfilRequest = {
        nombre: perfilCompleto?.nombre || user?.username || '',
        apellido: perfilCompleto?.apellido || '',
        telefono: perfilCompleto?.telefono || '',
        lada: perfilCompleto?.lada || '+52',
        fechaNacimiento: formatDateForInput(perfilCompleto?.fechaNacimiento) || '',
    };

    const handleSubmit = async (
        values: ActualizarPerfilRequest,
        { setSubmitting, resetForm }: FormikHelpers<ActualizarPerfilRequest>
    ) => {
        try {
            setMessage(null);
            
            if (!user?.idUsuario) {
                setMessage({ type: 'error', text: 'Usuario no encontrado' });
                return;
            }

            const result = await updateProfile(values);

            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                // Optionally reset form to new values
                resetForm({ values });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error instanceof Error ? error.message : 'Error inesperado' 
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Clear message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Editar Perfil</h2>
                <p className="text-gray-600">Actualiza tu información personal</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${
                    message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span>
                                {message.type === 'success' ? '✅' : '❌'}
                            </span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">{message.text}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => setMessage(null)}
                                className={`${
                                    message.type === 'success' 
                                        ? 'text-green-400 hover:text-green-600' 
                                        : 'text-red-400 hover:text-red-600'
                                } transition-colors`}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true} // Allow form to reinitialize when initialValues change
            >
                {({ isSubmitting, isValid, touched, errors }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre *
                                </label>
                                <Field
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        touched.nombre && errors.nombre 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Ingresa tu nombre"
                                />
                                <ErrorMessage 
                                    name="nombre" 
                                    component="div" 
                                    className="mt-1 text-sm text-red-600" 
                                />
                            </div>

                            {/* Apellido */}
                            <div>
                                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                                    Apellido *
                                </label>
                                <Field
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        touched.apellido && errors.apellido 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Ingresa tu apellido"
                                />
                                <ErrorMessage 
                                    name="apellido" 
                                    component="div" 
                                    className="mt-1 text-sm text-red-600" 
                                />
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="lada" className="block text-sm font-medium text-gray-700 mb-2">
                                    Lada
                                </label>
                                <Field
                                    type="text"
                                    id="lada"
                                    name="lada"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        touched.lada && errors.lada 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="+52"
                                />
                                <ErrorMessage 
                                    name="lada" 
                                    component="div" 
                                    className="mt-1 text-sm text-red-600" 
                                />
                            </div>
                            
                            <div className="md:col-span-3">
                                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono *
                                </label>
                                <Field
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        touched.telefono && errors.telefono 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="1234567890"
                                    maxLength={10}
                                />
                                <ErrorMessage 
                                    name="telefono" 
                                    component="div" 
                                    className="mt-1 text-sm text-red-600" 
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Ingresa 10 dígitos sin espacios ni guiones
                                </p>
                            </div>
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div>
                            <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Nacimiento *
                            </label>
                            <Field
                                type="date"
                                id="fechaNacimiento"
                                name="fechaNacimiento"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    touched.fechaNacimiento && errors.fechaNacimiento 
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-300'
                                }`}
                                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                            />
                            <ErrorMessage 
                                name="fechaNacimiento" 
                                component="div" 
                                className="mt-1 text-sm text-red-600" 
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting || !isValid || loading}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors font-medium"
                            >
                                {(isSubmitting || loading) && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                )}
                                {(isSubmitting || loading) ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>

                        {/* Form Status Indicator */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                Los campos marcados con * son obligatorios
                            </p>
                            {!isValid && Object.keys(touched).length > 0 && (
                                <p className="text-xs text-red-600 mt-1">
                                    Por favor, corrige los errores antes de enviar
                                </p>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditProfile;
