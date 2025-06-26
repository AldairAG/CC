import { useEffect, useState } from 'react';
import { useDeportes } from '../../hooks/useDeportes';
import { useCarritoApuestas } from '../../hooks/useCarritoApuestas';
import type { EventType } from '../../types/EventType';
import CasinoBanner from '../../components/banner/CasinoBanner';
import DashboardStats from '../../components/stats/DashboardStats';
import DashboardTabs from '../../components/navigation/DashboardTabs';
import EventsSection from '../../components/sections/EventsSection';
import SportsFilter from '../../components/filters/SportsFilter';
import ModalApuesta from '../../components/modals/ModalApuesta';
import CarritoApuestas from '../../components/carrito/CarritoApuestas';
import BotonCarrito from '../../components/carrito/BotonCarrito';
import NotificacionesContainer from '../../components/notificaciones/NotificacionesContainer';
import { CryptoQuickAccess } from '../../components/crypto/CryptoQuickAccess';
import { QuinielasQuickAccess } from '../../components/quinielas/QuinielasQuickAccess';
import CacheIndicator from '../../components/cache/CacheIndicator';

const Dashboard = () => {  
  const {
    liveMatches,
    todayMatches,
    popularMatches,
    deportes,
    selectedSport,
    sportMatches,
    isLoading,
    error,
    loadDashboardData,
    getSportMatches,
  } = useDeportes();

  const { hayApuestas } = useCarritoApuestas();

  const [activeTab, setActiveTab] = useState('popular');
  const [modalApuestaOpen, setModalApuestaOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventType | null>(null);  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Configuración de tabs
  const tabs = [
    {
      id: 'popular',
      label: 'Ligas Populares',
      icon: '🏆',
      count: popularMatches?.length || 0
    },
    {
      id: 'sports',
      label: 'Por Deporte',
      icon: '🏅',
      count: sportMatches?.length || 0
    },
    {
      id: 'live',
      label: 'En Vivo',
      icon: '🔴',
      count: liveMatches?.length || 0
    },
    {
      id: 'today',
      label: 'Hoy',
      icon: '📅',
      count: todayMatches?.length || 0
    },
    {
      id: 'upcoming',
      label: 'Próximos',
      icon: '⏰',
      count: 0
    }
  ];

  // Función para manejar clicks en apostar
  const handleBetClick = (event: EventType) => {
    setEventoSeleccionado(event);
    setModalApuestaOpen(true);
  };

  // Función para cerrar el modal de apuesta
  const cerrarModalApuesta = () => {
    setModalApuestaOpen(false);
    setEventoSeleccionado(null);
  };

  // Función para obtener los eventos según la pestaña activa
  const getCurrentEvents = () => {
    switch (activeTab) {
      case 'popular':
        return popularMatches || [];
      case 'sports':
        return sportMatches || [];
      case 'live':
        return liveMatches || [];
      case 'today':
        return todayMatches || [];
      case 'upcoming':
        return []; // Por ahora vacío, puedes implementar lógica para próximos partidos
      default:
        return [];
    }
  };

  // Función para obtener el título de la sección
  const getSectionTitle = () => {
    switch (activeTab) {
      case 'popular':
        return 'Ligas Más Populares';
      case 'sports':
        return selectedSport ? `Partidos de ${selectedSport}` : 'Partidos por Deporte';
      case 'live':
        return 'Partidos en Vivo';
      case 'today':
        return 'Partidos de Hoy';
      case 'upcoming':
        return 'Próximos Partidos';
      default:
        return 'Eventos Deportivos';
    }
  };

  // Función para obtener el icono de la sección
  const getSectionIcon = () => {
    switch (activeTab) {
      case 'popular':
        return '🏆';
      case 'sports':
        return '🏅';
      case 'live':
        return '🔴';
      case 'today':
        return '📅';
      case 'upcoming':
        return '⏰';
      default:
        return '⚽';
    }
  };

  // Función para manejar la selección de deportes
  const handleSportSelect = async (sportName: string) => {
    if (sportName === '' || !sportName) {
      // Si selecciona "Todos", cambiar a la pestaña popular
      setActiveTab('popular');
    } else {
      // Cargar partidos del deporte seleccionado
      
      await getSportMatches(sportName);
      setActiveTab('sports');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      
      <div className="container mx-auto px-4 py-6">
        {/* Banner Principal */}
        <CasinoBanner />

        {/* Estadísticas */}
        <DashboardStats
          liveMatches={liveMatches?.length || 0}
          todayMatches={todayMatches?.length || 0}
          upcomingMatches={0} // Implementar lógica para próximos partidos
          popularLeagues={5} // Número fijo de ligas populares
        />

        {/* Quick Access Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CryptoQuickAccess />
          <QuinielasQuickAccess />
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Tabs de Navegación */}
        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        {/* Filtro de Deportes */}
        <SportsFilter
          sports={deportes}
          selectedSport={selectedSport}
          onSportSelect={handleSportSelect}
          isLoading={isLoading}
        />

        {/* Sección de Eventos */}
        <EventsSection
          title={getSectionTitle()}
          events={getCurrentEvents()}
          icon={getSectionIcon()}
          onBetClick={handleBetClick}
          showLive={activeTab === 'live'}
          isLoading={isLoading}
        />        
        
        {/* Footer Promocional */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🎰 ¡Obtén tu Bono de Bienvenida!</h3>
          <p className="text-lg mb-6">
            Regístrate ahora y recibe hasta $500 en bonos para tus primeras apuestas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
              🎁 Reclamar Bono
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 border border-white/30">
              📱 Descarga la App
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Apuesta */}
      <ModalApuesta
        isOpen={modalApuestaOpen}
        onClose={cerrarModalApuesta}
        evento={eventoSeleccionado}
      />      {/* Carrito de Apuestas */}
      <CarritoApuestas />      
      
      {/* Botón Flotante del Carrito */}
      {hayApuestas && <BotonCarrito />}

      {/* Contenedor de Notificaciones */}
      <NotificacionesContainer position="top-right" />

      {/* Indicador de Cache Redis - Solo en DEV */}
      {import.meta.env?.DEV && <CacheIndicator />}

    </div>
  );
};

export default Dashboard;