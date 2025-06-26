import { useState } from 'react';
import type { 
    CrearQuinielaRequest, 
    EventoQuinielaRequest,
    QuinielaResponse 
} from '../../types/QuinielaType';
import { useQuiniela } from '../../hooks/useQuiniela';

interface Props {
    onQuinielaCreada?: (quiniela: QuinielaResponse) => void;
    onCancelar?: () => void;
}

interface FormData {
    // Información básica
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    precioEntrada: number;
    maxParticipantes: number;
    esPublica: boolean;
    
    // Configuración de premios
    tipoDistribucion: 'WINNER_TAKES_ALL' | 'TOP_3' | 'PERCENTAGE' | 'ELIMINATION' | 'ACCUMULATIVE' | 'TEAMS';
    porcentajePremiosPrimero: number;
    porcentajePremiosSegundo: number;
    porcentajePremiosTercero: number;
    
    // Eventos
    eventos: EventoQuinielaRequest[];
}

export const ArmarQuinielaForm: React.FC<Props> = ({ 
    onQuinielaCreada, 
    onCancelar 
}) => {
    const { crearQuiniela, loading } = useQuiniela();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        precioEntrada: 5,
        maxParticipantes: 50,
        esPublica: true,
        tipoDistribucion: 'WINNER_TAKES_ALL',
        porcentajePremiosPrimero: 100,
        porcentajePremiosSegundo: 0,
        porcentajePremiosTercero: 0,
        eventos: []
    });

    // Evento temporal para agregar manualmente
    const [nuevoEvento, setNuevoEvento] = useState<EventoQuinielaRequest>({
        eventoId: 0,
        nombreEvento: '',
        fechaEvento: '',
        equipoLocal: '',
        equipoVisitante: '',
        puntosPorAcierto: 1,
        puntosPorResultadoExacto: 3
    });

    const steps = [
        { id: 1, title: 'Información Básica', icon: '📝' },
        { id: 2, title: 'Eventos', icon: '🎯' },
        { id: 3, title: 'Modo de Juego', icon: '🏆' },
        { id: 4, title: 'Revisión', icon: '✅' }
    ];

    const updateFormData = (field: keyof FormData, value: string | number | boolean | EventoQuinielaRequest[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error del campo
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        switch (step) {
            case 1:
                if (!formData.nombre.trim()) {
                    newErrors.nombre = 'El nombre es requerido';
                    isValid = false;
                }
                if (!formData.descripcion.trim()) {
                    newErrors.descripcion = 'La descripción es requerida';
                    isValid = false;
                }
                if (!formData.fechaInicio) {
                    newErrors.fechaInicio = 'La fecha de inicio es requerida';
                    isValid = false;
                }
                if (!formData.fechaFin) {
                    newErrors.fechaFin = 'La fecha de fin es requerida';
                    isValid = false;
                }
                if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio >= formData.fechaFin) {
                    newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
                    isValid = false;
                }
                if (formData.precioEntrada <= 0) {
                    newErrors.precioEntrada = 'El precio de entrada debe ser mayor a 0';
                    isValid = false;
                }
                if (formData.maxParticipantes <= 0) {
                    newErrors.maxParticipantes = 'El número máximo de participantes debe ser mayor a 0';
                    isValid = false;
                }
                break;

            case 2:
                if (formData.eventos.length === 0) {
                    newErrors.eventos = 'Debes agregar al menos un evento';
                    isValid = false;
                }
                break;

            case 3:
                if (formData.tipoDistribucion === 'TOP_3' || formData.tipoDistribucion === 'PERCENTAGE') {
                    const total = formData.porcentajePremiosPrimero + formData.porcentajePremiosSegundo + formData.porcentajePremiosTercero;
                    if (total !== 100) {
                        newErrors.porcentajes = 'Los porcentajes deben sumar 100%';
                        isValid = false;
                    }
                }
                break;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const agregarEvento = () => {
        if (!nuevoEvento.nombreEvento || !nuevoEvento.equipoLocal || !nuevoEvento.equipoVisitante || !nuevoEvento.fechaEvento) {
            setErrors({ eventos: 'Todos los campos del evento son requeridos' });
            return;
        }

        const evento: EventoQuinielaRequest = {
            ...nuevoEvento,
            eventoId: Date.now() // ID temporal
        };

        updateFormData('eventos', [...formData.eventos, evento]);
        
        // Limpiar formulario de evento
        setNuevoEvento({
            eventoId: 0,
            nombreEvento: '',
            fechaEvento: '',
            equipoLocal: '',
            equipoVisitante: '',
            puntosPorAcierto: 1,
            puntosPorResultadoExacto: 3
        });
    };

    const eliminarEvento = (index: number) => {
        const nuevosEventos = formData.eventos.filter((_, i) => i !== index);
        updateFormData('eventos', nuevosEventos);
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        try {
            const request: CrearQuinielaRequest = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                fechaInicio: formData.fechaInicio,
                fechaFin: formData.fechaFin,
                precioEntrada: formData.precioEntrada,
                maxParticipantes: formData.maxParticipantes,
                tipoDistribucion: formData.tipoDistribucion,
                porcentajePremiosPrimero: formData.porcentajePremiosPrimero,
                porcentajePremiosSegundo: formData.porcentajePremiosSegundo,
                porcentajePremiosTercero: formData.porcentajePremiosTercero,
                esPublica: formData.esPublica,
                eventos: formData.eventos
            };

            const resultado = await crearQuiniela(request);
            onQuinielaCreada?.(resultado);
        } catch (error) {
            console.error('Error al crear quiniela:', error);
            setErrors({ submit: 'Error al crear la quiniela. Inténtalo de nuevo.' });
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            📝 Información Básica
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la Quiniela *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => updateFormData('nombre', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Liga Premier - Jornada 15"
                                />
                                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción *
                                </label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => updateFormData('descripcion', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe tu quiniela..."
                                />
                                {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de Inicio *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.fechaInicio}
                                    onChange={(e) => updateFormData('fechaInicio', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.fechaInicio && <p className="text-red-500 text-sm mt-1">{errors.fechaInicio}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de Fin *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.fechaFin}
                                    onChange={(e) => updateFormData('fechaFin', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.fechaFin && <p className="text-red-500 text-sm mt-1">{errors.fechaFin}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio de Entrada (€) *
                                </label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={formData.precioEntrada}
                                    onChange={(e) => updateFormData('precioEntrada', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.precioEntrada && <p className="text-red-500 text-sm mt-1">{errors.precioEntrada}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Máximo de Participantes *
                                </label>
                                <input
                                    type="number"
                                    min="2"
                                    value={formData.maxParticipantes}
                                    onChange={(e) => updateFormData('maxParticipantes', parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.maxParticipantes && <p className="text-red-500 text-sm mt-1">{errors.maxParticipantes}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.esPublica}
                                        onChange={(e) => updateFormData('esPublica', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Quiniela pública (visible para todos los usuarios)
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            🎯 Agregar Eventos
                        </h3>
                        
                        {/* Formulario para agregar eventos */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-700 mb-3">Agregar Nuevo Evento</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre del Evento
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoEvento.nombreEvento}
                                        onChange={(e) => setNuevoEvento({...nuevoEvento, nombreEvento: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: Liverpool vs Arsenal"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Equipo Local
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoEvento.equipoLocal}
                                        onChange={(e) => setNuevoEvento({...nuevoEvento, equipoLocal: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Equipo Local"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Equipo Visitante
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoEvento.equipoVisitante}
                                        onChange={(e) => setNuevoEvento({...nuevoEvento, equipoVisitante: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Equipo Visitante"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha del Evento
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={nuevoEvento.fechaEvento}
                                        onChange={(e) => setNuevoEvento({...nuevoEvento, fechaEvento: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Puntos por Acierto
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={nuevoEvento.puntosPorAcierto}
                                        onChange={(e) => setNuevoEvento({...nuevoEvento, puntosPorAcierto: parseInt(e.target.value) || 1})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Puntos por Resultado Exacto
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={nuevoEvento.puntosPorResultadoExacto}
                                        onChange={(e) => setNuevoEvento({...nuevoEvento, puntosPorResultadoExacto: parseInt(e.target.value) || 3})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            
                            <button
                                onClick={agregarEvento}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                ➕ Agregar Evento
                            </button>
                        </div>

                        {/* Lista de eventos agregados */}
                        <div>
                            <h4 className="font-medium text-gray-700 mb-3">
                                Eventos Agregados ({formData.eventos.length})
                            </h4>
                            
                            {formData.eventos.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No hay eventos agregados. Agrega al menos uno para continuar.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {formData.eventos.map((evento, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                            <div>
                                                <h5 className="font-medium">{evento.nombreEvento}</h5>
                                                <p className="text-sm text-gray-600">
                                                    {evento.equipoLocal} vs {evento.equipoVisitante}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(evento.fechaEvento).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => eliminarEvento(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {errors.eventos && (
                            <p className="text-red-500 text-sm">{errors.eventos}</p>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            🏆 Configurar Modo de Juego
                        </h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Distribución de Premios
                            </label>
                            <select
                                value={formData.tipoDistribucion}
                                onChange={(e) => updateFormData('tipoDistribucion', e.target.value as FormData['tipoDistribucion'])}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="WINNER_TAKES_ALL">El ganador se lleva todo</option>
                                <option value="TOP_3">Top 3 ganan</option>
                                <option value="PERCENTAGE">Por porcentajes</option>
                                <option value="ELIMINATION">Eliminación</option>
                                <option value="ACCUMULATIVE">Acumulativo</option>
                                <option value="TEAMS">Por equipos</option>
                            </select>
                        </div>

                        {(formData.tipoDistribucion === 'TOP_3' || formData.tipoDistribucion === 'PERCENTAGE') && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-700 mb-3">Configurar Porcentajes de Premios</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Primer Lugar (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.porcentajePremiosPrimero}
                                            onChange={(e) => updateFormData('porcentajePremiosPrimero', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Segundo Lugar (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.porcentajePremiosSegundo}
                                            onChange={(e) => updateFormData('porcentajePremiosSegundo', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tercer Lugar (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.porcentajePremiosTercero}
                                            onChange={(e) => updateFormData('porcentajePremiosTercero', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">
                                        Total: {formData.porcentajePremiosPrimero + formData.porcentajePremiosSegundo + formData.porcentajePremiosTercero}%
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {errors.porcentajes && (
                            <p className="text-red-500 text-sm">{errors.porcentajes}</p>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            ✅ Revisión Final
                        </h3>
                        
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700">Información Básica</h4>
                                    <p><strong>Nombre:</strong> {formData.nombre}</p>
                                    <p><strong>Descripción:</strong> {formData.descripcion}</p>
                                    <p><strong>Precio:</strong> €{formData.precioEntrada}</p>
                                    <p><strong>Max. Participantes:</strong> {formData.maxParticipantes}</p>
                                    <p><strong>Pública:</strong> {formData.esPublica ? 'Sí' : 'No'}</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-700">Configuración</h4>
                                    <p><strong>Eventos:</strong> {formData.eventos.length}</p>
                                    <p><strong>Modo:</strong> {formData.tipoDistribucion}</p>
                                    <p><strong>Fecha Inicio:</strong> {new Date(formData.fechaInicio).toLocaleString()}</p>
                                    <p><strong>Fecha Fin:</strong> {new Date(formData.fechaFin).toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Eventos</h4>
                                <div className="space-y-2">
                                    {formData.eventos.map((evento, index) => (
                                        <div key={index} className="text-sm bg-white p-2 rounded">
                                            {index + 1}. {evento.equipoLocal} vs {evento.equipoVisitante}
                                            <span className="text-gray-500 ml-2">
                                                ({new Date(evento.fechaEvento).toLocaleDateString()})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {errors.submit && (
                            <p className="text-red-500 text-sm">{errors.submit}</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">🎲 Armar Nueva Quiniela</h1>
                {onCancelar && (
                    <button
                        onClick={onCancelar}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                currentStep >= step.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {currentStep > step.id ? '✓' : step.icon}
                            </div>
                            <div className="ml-2 hidden md:block">
                                <p className={`text-sm font-medium ${
                                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                    {step.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 ${
                                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Anterior
                </button>

                <div className="flex space-x-4">
                    {currentStep < steps.length ? (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Siguiente →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? 'Creando...' : '🎯 Crear Quiniela'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
