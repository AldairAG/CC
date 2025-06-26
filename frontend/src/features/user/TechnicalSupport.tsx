import { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';

const TechnicalSupport = () => {
    const { supportTickets, fetchSupportTickets, createSupportTicket, loading } = useUserProfile();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        asunto: '',
        descripcion: '',
        categoria: 'TECNICO' as 'TECNICO' | 'CUENTA' | 'JUEGO' | 'OTRO'
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSupportTickets();
    }, [fetchSupportTickets]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!formData.asunto.trim() || !formData.descripcion.trim()) {
            setMessage({ type: 'error', text: 'Por favor completa todos los campos' });
            return;
        }

        const result = await createSupportTicket(formData);
        
        if (result.success) {
            setMessage({ type: 'success', text: 'Ticket creado correctamente. Te contactaremos pronto.' });
            setFormData({
                asunto: '',
                descripcion: '',
                categoria: 'TECNICO'
            });
            setShowCreateForm(false);
        } else {
            setMessage({ type: 'error', text: result.message || 'Error al crear el ticket' });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ABIERTO':
                return 'bg-blue-100 text-blue-800';
            case 'EN_PROCESO':
                return 'bg-yellow-100 text-yellow-800';
            case 'CERRADO':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ABIERTO':
                return '🆕';
            case 'EN_PROCESO':
                return '⏳';
            case 'CERRADO':
                return '✅';
            default:
                return '❓';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'TECNICO':
                return '🔧';
            case 'CUENTA':
                return '👤';
            case 'JUEGO':
                return '🎮';
            case 'OTRO':
                return '❓';
            default:
                return '📋';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'TECNICO':
                return 'Técnico';
            case 'CUENTA':
                return 'Cuenta';
            case 'JUEGO':
                return 'Juego';
            case 'OTRO':
                return 'Otro';
            default:
                return category;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const faqItems = [
        {
            question: '¿Cómo puedo depositar dinero en mi cuenta?',
            answer: 'Puedes depositar dinero utilizando transferencia bancaria, tarjetas de crédito/débito o sistemas de pago electrónicos. Ve a la sección "Depósitos" en tu cuenta.',
            category: 'CUENTA'
        },
        {
            question: '¿Por qué no puedo acceder a mi cuenta?',
            answer: 'Verifica que estés usando las credenciales correctas. Si el problema persiste, tu cuenta podría estar temporalmente bloqueada. Contacta soporte.',
            category: 'TECNICO'
        },
        {
            question: '¿Cómo funcionan las apuestas múltiples?',
            answer: 'Las apuestas múltiples combinan varias selecciones en una sola apuesta. Todas las selecciones deben ganar para que la apuesta sea exitosa.',
            category: 'JUEGO'
        },
        {
            question: '¿Cuánto tiempo toma procesar un retiro?',
            answer: 'Los retiros generalmente se procesan en 24-72 horas hábiles, dependiendo del método de pago seleccionado.',
            category: 'CUENTA'
        }
    ];

    return (
        <div className="max-w-6xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Soporte Técnico</h2>
                <p className="text-gray-600">
                    ¿Necesitas ayuda? Consulta nuestras preguntas frecuentes o crea un ticket de soporte
                </p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${
                    message.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-700' 
                        : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-blue-600">🎧</span>
                                </div>
                                <div className="text-left">
                                    <h4 className="font-medium text-gray-900">Crear Ticket</h4>
                                    <p className="text-sm text-gray-600">Reportar un problema</p>
                                </div>
                            </button>

                            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-green-600">💬</span>
                                </div>
                                <div className="text-left">
                                    <h4 className="font-medium text-gray-900">Chat en Vivo</h4>
                                    <p className="text-sm text-gray-600">Soporte inmediato</p>
                                </div>
                            </button>

                            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-purple-600">📞</span>
                                </div>
                                <div className="text-left">
                                    <h4 className="font-medium text-gray-900">Llamar</h4>
                                    <p className="text-sm text-gray-600">+52 800 123 4567</p>
                                </div>
                            </button>

                            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-orange-600">✉️</span>
                                </div>
                                <div className="text-left">
                                    <h4 className="font-medium text-gray-900">Email</h4>
                                    <p className="text-sm text-gray-600">soporte@casino.com</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Create Ticket Form */}
                    {showCreateForm && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Crear Ticket de Soporte</h3>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría
                                    </label>
                                    <select
                                        id="categoria"
                                        name="categoria"
                                        value={formData.categoria}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="TECNICO">Problema Técnico</option>
                                        <option value="CUENTA">Cuenta y Pagos</option>
                                        <option value="JUEGO">Juegos y Apuestas</option>
                                        <option value="OTRO">Otro</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
                                        Asunto
                                    </label>
                                    <input
                                        type="text"
                                        id="asunto"
                                        name="asunto"
                                        value={formData.asunto}
                                        onChange={handleInputChange}
                                        placeholder="Describe brevemente el problema"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        placeholder="Proporciona los detalles del problema, incluyendo pasos para reproducirlo si es necesario"
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {loading && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        )}
                                        Crear Ticket
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Support Tickets */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mis Tickets</h3>
                        
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <span className="ml-2 text-gray-600">Cargando tickets...</span>
                            </div>
                        ) : supportTickets.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <span className="text-4xl mb-4 block">🎧</span>
                                <p>No tienes tickets de soporte</p>
                                <p className="text-sm">Crea uno si necesitas ayuda</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {supportTickets.map((ticket) => (
                                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="text-lg">
                                                        {getCategoryIcon(ticket.categoria)}
                                                    </span>
                                                    <h4 className="font-medium text-gray-900">
                                                        {ticket.asunto}
                                                    </h4>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.estado)}`}>
                                                        {getStatusIcon(ticket.estado)} {ticket.estado.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {ticket.descripcion}
                                                </p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span>
                                                        Categoría: {getCategoryLabel(ticket.categoria)}
                                                    </span>
                                                    <span>
                                                        Creado: {formatDate(ticket.fechaCreacion)}
                                                    </span>
                                                    {ticket.fechaActualizacion && (
                                                        <span>
                                                            Actualizado: {formatDate(ticket.fechaActualizacion)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button className="ml-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                Ver Detalles
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* FAQ */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preguntas Frecuentes</h3>
                        <div className="space-y-4">
                            {faqItems.map((item, index) => (
                                <details key={index} className="group">
                                    <summary className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm">
                                                {getCategoryIcon(item.category)}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {item.question}
                                            </span>
                                        </div>
                                        <span className="text-gray-400 group-open:rotate-180 transition-transform">
                                            ▼
                                        </span>
                                    </summary>
                                    <div className="mt-2 p-2 text-sm text-gray-600">
                                        {item.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center space-x-2">
                                <span>📞</span>
                                <span>+52 800 123 4567</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>✉️</span>
                                <span>soporte@casino.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>🕒</span>
                                <span>24/7 - Siempre disponibles</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Sitio Web</span>
                                <span className="flex items-center text-sm text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Operativo
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Apuestas</span>
                                <span className="flex items-center text-sm text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Operativo
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Pagos</span>
                                <span className="flex items-center text-sm text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Operativo
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicalSupport;
