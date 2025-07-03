import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDeporte } from '../../hooks/useDeporte';
import { USER_ROUTES } from '../../constants/ROUTERS';

const DeportesDisponibles = () => {
    const navigate = useHistory();
    const { loading, error, cargarDeportesActivos, getDeportesActivos } = useDeporte();

    useEffect(() => {
        cargarDeportesActivos();
    }, [cargarDeportesActivos]);

    const deportesActivos = getDeportesActivos();

    // Función para navegar a la página de apuestas por deporte
    const navigateToDeporte = (nombreDeporte: string) => {
        
        navigate.push(`${USER_ROUTES.APUESTAS_POR_DEPORTE.replace(':deporte',nombreDeporte)}`);
    };

    if (loading) {
        return (
            <aside className="bg-dark-800 rounded-lg p-4 shadow-casino border border-primary-600/30">
                <h3 className="text-lg font-bold text-primary-400 mb-3 flex items-center gap-2">
                    🏆 Deportes Disponibles
                </h3>
                <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                </div>
            </aside>
        );
    }

    if (error) {
        return (
            <aside className="bg-dark-800 rounded-lg p-4 shadow-casino border border-primary-600/30">
                <h3 className="text-lg font-bold text-primary-400 mb-3 flex items-center gap-2">
                    🏆 Deportes Disponibles
                </h3>
                <div className="text-red-400 text-sm p-2 bg-red-900/20 rounded">
                    Error al cargar deportes
                </div>
            </aside>
        );
    }

    const getDeporteIcon = (nombreDeporte: string) => {
        const nombre = nombreDeporte.toLowerCase();
        if (nombre.includes('fútbol') || nombre.includes('futbol') || nombre.includes('soccer')) return '⚽';
        if (nombre.includes('básquet') || nombre.includes('basket') || nombre.includes('basketball')) return '🏀';
        if (nombre.includes('béisbol') || nombre.includes('beisbol') || nombre.includes('baseball')) return '⚾';
        if (nombre.includes('tenis') || nombre.includes('tennis')) return '🎾';
        if (nombre.includes('voleibol') || nombre.includes('volleyball') || nombre.includes('vóley')) return '🏐';
        if (nombre.includes('americano') || nombre.includes('american football')) return '🏈';
        if (nombre.includes('hockey')) return '🏒';
        if (nombre.includes('golf')) return '⛳';
        if (nombre.includes('box') || nombre.includes('boxing')) return '🥊';
        if (nombre.includes('natación') || nombre.includes('swimming')) return '🏊';
        if (nombre.includes('atletismo') || nombre.includes('athletics')) return '🏃';
        if (nombre.includes('ciclismo') || nombre.includes('cycling')) return '🚴';
        return '🏆';
    };

    return (
        <aside className="bg-dark-800 rounded-lg p-4 shadow-casino border border-primary-600/30">
            <h3 className="text-lg font-bold text-primary-400 mb-3 flex items-center gap-2">
                🏆 Deportes Disponibles
            </h3>
            <div className="space-y-2">
                {deportesActivos.length === 0 ? (
                    <div className="text-gray-400 text-sm p-2 text-center">
                        No hay deportes disponibles
                    </div>
                ) : (
                    deportesActivos.map((deporte) => (
                        <div
                            key={deporte.id}
                            onClick={() => navigateToDeporte(deporte.nombre)}
                            className="flex items-center gap-3 p-2 rounded-lg bg-dark-700/50 hover:bg-primary-600/20 transition-all duration-200 cursor-pointer group hover:scale-105 border border-transparent hover:border-primary-500/30"
                            style={{ borderLeft: `3px solid ${deporte.colorPrimario || '#10b981'}` }}
                            title={`Ver apuestas de ${deporte.nombre}`}
                        >
                            <span className="text-xl">
                                {deporte.icono || getDeporteIcon(deporte.nombre)}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm group-hover:text-primary-300 transition-colors truncate">
                                    {deporte.nombre}
                                </p>
                                {deporte.descripcion && (
                                    <p className="text-gray-400 text-xs truncate">
                                        {deporte.descripcion}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full opacity-80"></div>
                                <svg 
                                    className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {deportesActivos.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-400 text-center mb-1">
                        {deportesActivos.length} deporte{deportesActivos.length !== 1 ? 's' : ''} activo{deportesActivos.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                        💡 Haz clic en cualquier deporte para ver apuestas
                    </p>
                </div>
            )}
        </aside>
    );
};

export default DeportesDisponibles;
