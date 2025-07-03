import React, { useState } from 'react';
import CreateQuinielaForm from '../../features/quinielas/CreateQuinielaForm';

/**
 * Componente de ejemplo que demuestra el uso del CreateQuinielaForm
 * con gestión de eventos deportivos
 */
const CreateQuinielaFormExample: React.FC = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Ejemplo: Crear Quiniela con Eventos
                </h2>

                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Este ejemplo demuestra cómo usar el CreateQuinielaForm con la nueva funcionalidad 
                        de gestión de eventos deportivos. El formulario permite:
                    </p>
                    
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                        <li>Crear una nueva quiniela con todos los campos necesarios</li>
                        <li>Seleccionar eventos deportivos existentes de la base de datos</li>
                        <li>Ver y gestionar eventos deportivos disponibles en tiempo real</li>
                        <li>Configurar quinielas con eventos ya validados y programados</li>
                        <li>Validación completa de todos los campos</li>
                    </ul>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Funcionalidad Principal:
                        </h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• <strong>Selección de eventos:</strong> Elige eventos deportivos existentes y validados</li>
                            <li>• <strong>Vista previa:</strong> Resumen de eventos seleccionados antes de guardar</li>
                            <li>• <strong>Validación automática:</strong> Solo eventos válidos y programados</li>
                            <li>• <strong>Estado sincronizado:</strong> Integración completa con el sistema de eventos</li>
                            <li>• <strong>Interfaz simplificada:</strong> Proceso más directo y eficiente</li>
                        </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                            Flujo de trabajo simplificado:
                        </h3>
                        <ol className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 list-decimal list-inside">
                            <li>Completar información básica de la quiniela</li>
                            <li>Configurar aspectos económicos y de participantes</li>
                            <li>Seleccionar eventos deportivos de la lista disponible</li>
                            <li>Revisar eventos seleccionados en la vista previa</li>
                            <li>Confirmar configuración y crear la quiniela</li>
                        </ol>
                    </div>
                </div>

                {!mostrarFormulario ? (
                    <div className="text-center">
                        <button
                            onClick={() => setMostrarFormulario(true)}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Probar Formulario de Creación
                        </button>
                        
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Nota:</strong> Este formulario está completamente funcional y creará una quiniela real en el sistema.
                                Asegúrate de completar todos los campos requeridos.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Formulario de Creación de Quiniela
                            </h3>
                            <button
                                onClick={() => setMostrarFormulario(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            >
                                Ocultar Formulario
                            </button>
                        </div>
                        <CreateQuinielaForm />
                    </div>
                )}
            </div>

            {/* Información adicional sobre las mejoras */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Mejoras Implementadas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                        <strong className="text-gray-900 dark:text-white">Gestión de Eventos:</strong>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>Integración con useEvento hook</li>
                            <li>Carga automática de eventos disponibles</li>
                            <li>Selección múltiple con interfaz intuitiva</li>
                            <li>Conversión automática de eventos a formato de quiniela</li>
                            <li>Solo eventos validados y programados</li>
                        </ul>
                    </div>
                    
                    <div>
                        <strong className="text-gray-900 dark:text-white">Experiencia de Usuario:</strong>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>Interfaz simplificada y directa</li>
                            <li>Estados de carga y error bien manejados</li>
                            <li>Feedback visual inmediato</li>
                            <li>Validación automática de eventos</li>
                            <li>Vista previa clara de selecciones</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-gray-900 dark:text-white">Funcionalidades Técnicas:</strong>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>Estado sincronizado entre componentes</li>
                            <li>Limpieza automática al resetear</li>
                            <li>Validación de eventos seleccionados</li>
                            <li>Manejo de errores robusto</li>
                            <li>Prevención de eventos duplicados</li>
                        </ul>
                    </div>
                    
                    <div>
                        <strong className="text-gray-900 dark:text-white">Integración:</strong>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>Compatible con sistema existente</li>
                            <li>Usa Redux para estado global</li>
                            <li>Formik para gestión de formularios</li>
                            <li>Validación con Yup simplificada</li>
                            <li>Flujo de trabajo optimizado</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateQuinielaFormExample;
