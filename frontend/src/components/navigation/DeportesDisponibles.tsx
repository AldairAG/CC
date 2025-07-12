import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDeporte } from '../../hooks/useDeporte';
import { USER_ROUTES } from '../../constants/ROUTERS';

interface DeportesDisponiblesProps {
    onItemClick?: () => void;
}

const DeportesDisponibles = ({ onItemClick }: DeportesDisponiblesProps) => {
    const navigate = useHistory();
    const { loading, error, cargarDeportesActivos, getDeportesActivos } = useDeporte();

    useEffect(() => {
        cargarDeportesActivos();
    }, [cargarDeportesActivos]);

    const deportesActivos = getDeportesActivos();

    // Función para navegar a la página de apuestas por deporte
    const navigateToDeporte = (nombreDeporte: string) => {
        navigate.push(`${USER_ROUTES.APUESTAS_POR_DEPORTE.replace(':deporte',nombreDeporte)}`);
        onItemClick?.(); // Cerrar sidebar en móviles
    };

    if (loading) {
        return (
            <aside className="bg-gradient-to-br from-gray-900/40 via-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-4 sm:p-5 shadow-2xl border border-gray-700/30">
                <h3 className="text-base sm:text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
                    🏆 <span className="hidden sm:inline">Deportes Disponibles</span>
                    <span className="sm:hidden">Deportes</span>
                </h3>
                <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                </div>
            </aside>
        );
    }

    if (error) {
        return (
            <aside className="bg-gradient-to-br from-gray-900/40 via-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-4 sm:p-5 shadow-2xl border border-gray-700/30">
                <h3 className="text-base sm:text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
                    🏆 <span className="hidden sm:inline">Deportes Disponibles</span>
                    <span className="sm:hidden">Deportes</span>
                </h3>
                <div className="text-red-300 text-xs sm:text-sm p-3 bg-red-900/20 rounded-xl backdrop-blur-sm border border-red-500/30">
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
        <aside className="bg-gradient-to-br from-gray-900/40 via-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-4 sm:p-5 shadow-2xl border border-gray-700/30">
            <h3 className="text-base sm:text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                🏆 <span className="hidden sm:inline">Deportes Disponibles</span>
                <span className="sm:hidden">Deportes</span>
            </h3>
            <div className="space-y-2">
                {deportesActivos.length === 0 ? (
                    <div className="text-gray-400 text-xs sm:text-sm p-3 text-center bg-gray-800/20 rounded-xl backdrop-blur-sm border border-gray-600/20">
                        No hay deportes disponibles
                    </div>
                ) : (
                    deportesActivos.map((deporte) => (
                        <div
                            key={deporte.id}
                            onClick={() => navigateToDeporte(deporte.nombre)}
                            className="flex items-center gap-2 sm:gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-700/30 hover:from-gray-700/40 hover:to-gray-600/40 transition-all duration-300 cursor-pointer group hover:scale-105 active:scale-95 border border-gray-600/20 hover:border-gray-500/40 backdrop-blur-sm hover:shadow-lg"
                            style={{ borderLeft: `3px solid ${deporte.colorPrimario || '#6b7280'}` }}
                            title={`Ver apuestas de ${deporte.nombre}`}
                        >
                            <span className="text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                {deporte.icono || getDeporteIcon(deporte.nombre)}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-xs sm:text-sm group-hover:text-gray-200 transition-colors truncate">
                                    {deporte.nombre}
                                </p>
                                {deporte.descripcion && (
                                    <p className="text-gray-400 text-xs truncate hidden sm:block group-hover:text-gray-300 transition-colors">
                                        {deporte.descripcion}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                                <svg 
                                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 group-hover:text-gray-400 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1" 
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
                <div className="mt-4 pt-3 border-t border-gray-700/30">
                    <p className="text-xs text-gray-400 text-center mb-1 font-medium">
                        {deportesActivos.length} deporte{deportesActivos.length !== 1 ? 's' : ''} activo{deportesActivos.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500 text-center hidden sm:block">
                        💡 Haz clic en cualquier deporte para ver apuestas
                    </p>
                </div>
            )}
        </aside>
    );
};

export default DeportesDisponibles;
