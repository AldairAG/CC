const CasinoBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-xl shadow-2xl overflow-hidden mb-8">
      {/* Fondo con patrón */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"></div>
      
      {/* Contenido */}
      <div className="relative px-8 py-12 md:px-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Texto principal */}
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                🎰 <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  CASINO
                </span><br />
                <span className="text-white">DEPORTIVO</span>
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-white/90">
                Las mejores cuotas en deportes internacionales
              </p>
              <p className="text-lg mb-8 text-white/80">
                Apuesta en vivo, obtén bonos exclusivos y disfruta de la emoción del deporte
              </p>
              
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  🎯 Apostar Ahora
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 border border-white/30">
                  🔴 Ver En Vivo
                </button>
              </div>
            </div>

            {/* Elementos gráficos */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Cartas de juego decorativas */}
                <div className="absolute top-0 right-0 transform rotate-12 bg-white rounded-lg p-4 shadow-xl">
                  <div className="text-3xl">🃏</div>
                </div>
                <div className="absolute top-8 right-12 transform -rotate-6 bg-white rounded-lg p-4 shadow-xl">
                  <div className="text-3xl">⚽</div>
                </div>
                <div className="absolute top-16 right-24 transform rotate-45 bg-white rounded-lg p-4 shadow-xl">
                  <div className="text-3xl">🏆</div>
                </div>
                
                {/* Fichas de casino */}
                <div className="absolute bottom-0 left-0 transform -rotate-12">
                  <div className="w-16 h-16 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold">
                    100
                  </div>
                </div>
                <div className="absolute bottom-4 left-8 transform rotate-12">
                  <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm">
                    50
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Efectos de brillo */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default CasinoBanner;
