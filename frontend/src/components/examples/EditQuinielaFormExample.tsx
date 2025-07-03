import React, { useState } from 'react';
import EditQuinielaForm from '../../features/quinielas/EditQuinielaForm';
import type { QuinielaType } from '../../types/QuinielaType';

/**
 * Componente de ejemplo que demuestra el uso del EditQuinielaForm
 * con gestión de eventos deportivos
 */
const EditQuinielaFormExample: React.FC = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [quinielaEditada, setQuiniellaEditada] = useState<QuinielaType | null>(null);

    // ID de ejemplo de una quiniela existente
    const quinielaIdEjemplo = 1;

    const handleSuccess = (quiniela: QuinielaType) => {
        console.log('Quiniela actualizada exitosamente:', quiniela);
        setQuiniellaEditada(quiniela);
        setMostrarFormulario(false);
    };

    const handleCancel = () => {
        console.log('Edición cancelada');
        setMostrarFormulario(false);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Ejemplo: Editar Quiniela con Eventos
                </h2>

                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Este ejemplo demuestra cómo usar el EditQuinielaForm con la nueva funcionalidad 
                        de gestión de eventos deportivos. El formulario permite:
                    </p>
                    
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                        <li>Editar los campos básicos de la quiniela (nombre, descripción, fechas, etc.)</li>
                        <li>Ver y gestionar eventos deportivos disponibles</li>
                        <li>Seleccionar/deseleccionar eventos para incluir en la quiniela</li>
                        <li>Ver un resumen de los eventos seleccionados</li>
                        <li>Agregar los eventos seleccionados a la quiniela al guardar</li>
                    </ul>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Características principales:
                        </h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• <strong>Carga dinámica:</strong> Los eventos se cargan automáticamente usando useEvento</li>
                            <li>• <strong>Validación:</strong> Solo se pueden editar quinielas en estado BORRADOR o ACTIVA</li>
                            <li>• <strong>Interfaz intuitiva:</strong> Toggle para mostrar/ocultar la lista de eventos</li>
                            <li>• <strong>Feedback visual:</strong> Estados de carga, error y selección claramente indicados</li>
                            <li>• <strong>Información contextual:</strong> Muestra si los eventos ya están en otras quinielas</li>
                        </ul>
                    </div>
                </div>

                {!mostrarFormulario ? (
                    <div className="text-center">
                        <button
                            onClick={() => setMostrarFormulario(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Abrir Editor de Quiniela
                        </button>
                        
                        {quinielaEditada && (
                            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <p className="text-green-800 dark:text-green-200">
                                    ✅ Última quiniela editada: <strong>{quinielaEditada.nombre}</strong>
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                                    Actualizada el {new Date(quinielaEditada.fechaActualizacion).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <EditQuinielaForm
                        quinielaId={quinielaIdEjemplo}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                )}
            </div>

            {/* Información adicional sobre el uso */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Uso del Componente
                </h3>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
                    <div>
                        <strong className="text-gray-900 dark:text-white">Props requeridas:</strong>
                        <ul className="list-disc list-inside ml-4 mt-2">
                            <li><code>quinielaId</code>: ID de la quiniela a editar</li>
                        </ul>
                    </div>
                    
                    <div>
                        <strong className="text-gray-900 dark:text-white">Props opcionales:</strong>
                        <ul className="list-disc list-inside ml-4 mt-2">
                            <li><code>onSuccess</code>: Callback cuando la edición es exitosa</li>
                            <li><code>onCancel</code>: Callback cuando se cancela la edición</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-gray-900 dark:text-white">Hooks utilizados:</strong>
                        <ul className="list-disc list-inside ml-4 mt-2">
                            <li><code>useQuiniela</code>: Para cargar y gestionar la quiniela</li>
                            <li><code>useEvento</code>: Para cargar eventos y agregarlos a la quiniela</li>
                            <li><code>useUser</code>: Para verificar permisos de edición</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditQuinielaFormExample;
