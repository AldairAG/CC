import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ArmarQuinielaForm } from '../../features/quinielas/ArmarQuinielaForm';
import type { QuinielaResponse } from '../../types/QuinielaType';

const QuinielaArmar = () => {
    const history = useHistory();
    const [mostrarExito, setMostrarExito] = useState(false);
    const [quinielaCreada, setQuinielaCreada] = useState<QuinielaResponse | null>(null);

    const handleQuinielaCreada = (quiniela: QuinielaResponse) => {
        setQuinielaCreada(quiniela);
        setMostrarExito(true);
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
            history.push('/user/quinielas');
        }, 3000);
    };

    const handleCancelar = () => {
        history.push('/user/quinielas');
    };

    if (mostrarExito && quinielaCreada) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Quiniela Creada!</h2>
                        <p className="text-gray-600 mb-4">
                            Tu quiniela <strong>"{quinielaCreada.nombre}"</strong> ha sido creada exitosamente.
                        </p>
                        <div className="text-sm text-gray-500">
                            <p>Código de invitación: <strong>{quinielaCreada.codigoInvitacion || 'N/A'}</strong></p>
                            <p>Precio de entrada: <strong>${quinielaCreada.precioEntrada}</strong></p>
                            <p>Participantes máximos: <strong>{quinielaCreada.maxParticipantes || 'Sin límite'}</strong></p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">
                        Serás redirigido a tus quinielas en unos segundos...
                    </p>
                    <button
                        onClick={() => history.push('/user/quinielas')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Ver Mis Quinielas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <ArmarQuinielaForm 
                    onQuinielaCreada={handleQuinielaCreada}
                    onCancelar={handleCancelar}
                />
            </div>
        </div>
    );
}

export default QuinielaArmar;