

const LigasMexicanas = () => {
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
        <aside className="bg-dark-800 rounded-lg p-4 shadow-casino border border-primary-600/30 mb-4">
            <h3 className="text-lg font-bold text-primary-400 mb-3 flex items-center gap-2">
                🇲🇽 Ligas Mexicanas
            </h3>
            <div className="space-y-2">
                {ligasMexicanas.map((liga) => (
                    <div
                        key={liga.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-dark-700/50 hover:bg-primary-600/20 transition-all duration-200 cursor-pointer group"
                    >
                        <span className="text-xl">{liga.logo}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm group-hover:text-primary-300 transition-colors truncate">
                                {liga.nombre}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                                {liga.categoria}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default LigasMexicanas;
