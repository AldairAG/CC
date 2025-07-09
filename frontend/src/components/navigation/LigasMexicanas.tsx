

interface LigasMexicanasProps {
    onItemClick?: () => void;
}

const LigasMexicanas = ({ onItemClick }: LigasMexicanasProps) => {
    const ligasMexicanas = [
        {
            id: 1,
            nombre: "Liga MX",
            logo: "🏆",
            categoria: "Primera División"
        },
        {
            id: 2,
            nombre: "Liga de Expansión MX",
            logo: "⚽",
            categoria: "Segunda División"
        },
        {
            id: 3,
            nombre: "Liga MX Femenil",
            logo: "👩‍⚽",
            categoria: "Fútbol Femenino"
        },
        {
            id: 4,
            nombre: "LBM",
            logo: "🏀",
            categoria: "Basquetbol"
        },
        {
            id: 5,
            nombre: "LMP",
            logo: "⚾",
            categoria: "Béisbol"
        },
        {
            id: 6,
            nombre: "LFA",
            logo: "🏈",
            categoria: "Fútbol Americano"
        }
    ];

    return (
        <aside className="bg-dark-800 rounded-lg p-3 sm:p-4 shadow-casino border border-primary-600/30 mb-4">
            <h3 className="text-base sm:text-lg font-bold text-primary-400 mb-3 flex items-center gap-2">
                🇲🇽 <span className="hidden sm:inline">Ligas Mexicanas</span>
                <span className="sm:hidden">Ligas MX</span>
            </h3>
            <div className="space-y-2">
                {ligasMexicanas.map((liga) => (
                    <div
                        key={liga.id}
                        onClick={() => onItemClick?.()}
                        className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg bg-dark-700/50 hover:bg-primary-600/20 transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95"
                    >
                        <span className="text-lg sm:text-xl flex-shrink-0">{liga.logo}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-xs sm:text-sm group-hover:text-primary-300 transition-colors truncate">
                                {liga.nombre}
                            </p>
                            <p className="text-gray-400 text-xs truncate hidden sm:block">
                                {liga.categoria}
                            </p>
                        </div>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg 
                                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-primary-400 transition-colors" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default LigasMexicanas;
