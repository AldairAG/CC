import React, { useState } from 'react';
import { CrearQuinielaForm } from '../../components/quinielas/CrearQuinielaForm';
import type { QuinielaCreada } from '../../types/QuinielaType';

export const CrearQuinielaPage: React.FC = () => {
    const [mostrarCongratulaciones, setMostrarCongratulaciones] = useState(false);
    const [quinielaCreada, setQuinielaCreada] = useState<QuinielaCreada | null>(null);

    const handleQuinielaCreada = (quiniela: QuinielaCreada) => {
        setQuinielaCreada(quiniela);
        setMostrarCongratulaciones(true);
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
            window.location.href = '/dashboard/quinielas';
        }, 3000);
    };

    const handleCancelar = () => {
        window.history.back();
    };    if (mostrarCongratulaciones && quinielaCreada) {
        return (
            <div className="min-h-screen bg-casino-gradient flex items-center justify-center p-4">
                <div className="card-casino p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4 animate-bounce-slow">🏆</div>
                    <h2 className="text-3xl font-bold text-primary-400 mb-4 animate-glow">
                        ¡Quiniela Creada!
                    </h2>
                    <div className="text-gray-300 mb-6">
                        <p className="text-lg font-medium mb-2 text-white">{quinielaCreada.nombre}</p>
                        <p className="text-sm mb-2">
                            Código: <span className="font-mono font-bold text-primary-400 bg-dark-800 px-2 py-1 rounded">{quinielaCreada.codigoInvitacion}</span>
                        </p>
                        <p className="text-sm">Comparte este código para que otros se unan</p>
                    </div>
                    <div className="animate-spin-slow text-primary-500 text-2xl mb-4">⚽</div>
                    <p className="text-sm text-gray-400">Redirigiendo en 3 segundos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-casino-gradient py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="card-casino">
                    <div className="bg-red-gradient rounded-t-xl p-6">
                        <h1 className="text-3xl font-bold text-white flex items-center">
                            <span className="mr-3">🏆</span>
                            Crear Nueva Quiniela en 24bet
                        </h1>
                        <p className="text-red-100 mt-2">
                            Configura tu quiniela deportiva y invita a tus amigos a competir
                        </p>
                    </div>
                    
                    <div className="p-6">
                        <CrearQuinielaForm 
                            onQuinielaCreada={handleQuinielaCreada}
                            onCancelar={handleCancelar}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
