import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDeportes } from "../../hooks/useDeportes";
import type { EventType } from "../../types/EventType";
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import Loader from "../../components/ui/Loader";

const EventoDetails = () => {
  const { id } = useParams<{ id: string }>();
  //const { getEventoById } = useDeportes();
  const [evento, setEvento] = useState<EventType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoading(true);
        /* const eventoData = await getEventoById(id);*/
        setEvento(mockEvento);
      } catch (err) {
        console.error("Error al obtener el evento:", err);
        setError("No se pudo cargar la información del evento");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvento();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

/*   if (error || !evento) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p>{error || "No se encontró el evento solicitado"}</p>
        <Link 
          to="/eventos" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Ver todos los eventos
        </Link>
      </div>
    );
  } */

  // Formatear fecha y hora
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Fecha no disponible";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr) return "Hora no disponible";
    return timeStr;
  };

  // Determinar estado del partido con colores
  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    const statusLower = status.toLowerCase();
    if (statusLower === "scheduled" || statusLower === "programado") {
      return "bg-yellow-100 text-yellow-800";
    } else if (statusLower === "completed" || statusLower === "finalizado") {
      return "bg-green-100 text-green-800";
    } else if (statusLower === "postponed" || statusLower === "pospuesto") {
      return "bg-red-100 text-red-800";
    } else if (statusLower === "in progress" || statusLower === "en curso") {
      return "bg-blue-100 text-blue-800 animate-pulse";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado del evento */}
      <div 
        className="relative rounded-lg overflow-hidden mb-8 bg-cover bg-center h-48 md:h-64"
        style={{ 
          backgroundImage: evento?.strBanner ? `url(${evento?.strBanner})` : 
                          evento?.strThumb ? `url(${evento?.strThumb})` : 
                          "linear-gradient(to right, #4a5568, #2d3748)" 
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{evento?.strEvent}</h1>
              <p className="text-white opacity-90">{evento?.strLeague}</p>
            </div>
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(evento?.strStatus)}`}>
                {evento?.strStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna izquierda - Información principal */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Detalles del evento</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">{formatDate(evento?.dateEvent)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <p className="font-medium">{formatTime(evento?.strTime)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Estadio</p>
                    <p className="font-medium">{evento?.strVenue || "No disponible"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Espectadores</p>
                    <p className="font-medium">{evento?.intSpectators || "No disponible"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Temporada</p>
                    <p className="font-medium">{evento?.strSeason}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold text-xs">R</span>
                  <div>
                    <p className="text-sm text-gray-500">Ronda</p>
                    <p className="font-medium">{evento?.intRound || "No especificada"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equipos y resultado */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Equipos</h2>
              
              <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                {/* Equipo Local */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-2">
                    {evento?.strHomeTeamBadge ? (
                      <img 
                        src={evento?.strHomeTeamBadge} 
                        alt={evento?.strHomeTeam} 
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500 font-bold">{evento?.strHomeTeam?.substring(0, 2)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{evento?.strHomeTeam}</h3>
                  <p className="text-gray-500">{evento?.strCountry}</p>
                </div>
                
                {/* Marcador */}
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold mb-2">
                    {evento?.intHomeScore !== null && evento?.intAwayScore !== null 
                      ? `${evento?.intHomeScore} - ${evento?.intAwayScore}` 
                      : "VS"}
                  </div>
                  {evento?.strStatus.toLowerCase() === "in progress" && (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold animate-pulse">
                      EN VIVO
                    </span>
                  )}
                </div>
                
                {/* Equipo Visitante */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-2">
                    {evento?.strAwayTeamBadge ? (
                      <img 
                        src={evento?.strAwayTeamBadge} 
                        alt={evento?.strAwayTeam} 
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500 font-bold">{evento?.strAwayTeam?.substring(0, 2)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{evento?.strAwayTeam}</h3>
                  <p className="text-gray-500">{evento?.strCountry}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción si está disponible */}
          {evento?.strDescriptionEN && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Descripción</h2>
                <p className="text-gray-700 whitespace-pre-line">{evento?.strDescriptionEN}</p>
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha - Información adicional */}
        <div>
          {/* Liga */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Liga</h2>
              <div className="flex items-center gap-4">
                {evento?.strLeagueBadge && (
                  <img 
                    src={evento?.strLeagueBadge} 
                    alt={evento?.strLeague} 
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{evento?.strLeague}</h3>
                  <p className="text-gray-500">{evento?.strSeason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estadio */}
          {evento?.strVenue && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Estadio</h2>
                <div>
                  <h3 className="font-semibold text-lg">{evento?.strVenue}</h3>
                  <p className="text-gray-500">{evento?.strCity || evento?.strCountry}</p>
                  {evento?.strMap && (
                    <div className="mt-4 h-40 w-full bg-gray-200 rounded overflow-hidden">
                      <iframe 
                        title="Ubicación del estadio"
                        src={evento?.strMap}
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Enlaces */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Enlaces relacionados</h2>
              <div className="flex flex-col space-y-2">
                <Link to={`/equipos/${evento?.idHomeTeam}`} className="text-blue-600 hover:underline">
                  Ver detalles de {evento?.strHomeTeam}
                </Link>
                <Link to={`/equipos/${evento?.idAwayTeam}`} className="text-blue-600 hover:underline">
                  Ver detalles de {evento?.strAwayTeam}
                </Link>
                <Link to={`/ligas/${evento?.idLeague}`} className="text-blue-600 hover:underline">
                  Ver detalles de {evento?.strLeague}
                </Link>
                <Link to="/quinielas" className="text-blue-600 hover:underline">
                  Participar en quinielas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}   

// Mock de evento para testing
const mockEvento: EventType = {
  dateEvent: "2023-10-15",
  dateEventLocal: null,
  idAPIfootball: "12345",
  idAwayTeam: "567",
  idEvent: "89101112",
  idHomeTeam: "123",
  idLeague: "4328",
  idVenue: "789",
  intAwayScore: 1,
  intHomeScore: 2,
  intRound: "10",
  intScore: null,
  intScoreVotes: null,
  intSpectators: 58200,
  strAwayTeam: "Manchester United",
  strAwayTeamBadge: "https://www.thesportsdb.com/images/media/team/badge/xzqdr11517660252.png",
  strBanner: "https://www.thesportsdb.com/images/media/event/banner/vtr8971660747052.jpg",
  strCity: "Londres",
  strCountry: "Inglaterra",
  strDescriptionEN: "Un emocionante partido de la Premier League donde Arsenal dominó la primera mitad con goles tempraneros de Saka y Odegaard. Manchester United despertó en la segunda mitad, logrando un gol de Bruno Fernandes, pero no fue suficiente para remontar el marcador.\n\nLos Gunners mostraron un juego sólido en defensa durante los últimos 20 minutos, conteniendo los ataques desesperados del Manchester United para llevarse los tres puntos del Emirates Stadium.",
  strEvent: "Arsenal vs Manchester United",
  strEventAlternate: "Arsenal - Manchester United",
  strFanart: null,
  strFilename: "Premier_League_2023_Arsenal_vs_ManUtd",
  strGroup: null,
  strHomeTeam: "Arsenal",
  strHomeTeamBadge: "https://www.thesportsdb.com/images/media/team/badge/wrysqq1473246951.png",
  strLeague: "Premier League",
  strLeagueBadge: "https://www.thesportsdb.com/images/media/league/badge/i6o0kh1549879062.png",
  strLocked: "unlocked",
  strMap: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.8506617754456!2d-0.1086954!3d51.555954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b7a2e82e7c1%3A0x3600713c8382cf31!2sEmirates%20Stadium!5e0!3m2!1sen!2suk!4v1689091954279!5m2!1sen!2suk",
  strOfficial: "Michael Oliver",
  strPoster: "https://www.thesportsdb.com/images/media/event/poster/xrt7iq1660747051.jpg",
  strPostponed: "no",
  strResult: null,
  strSeason: "2023-2024",
  strSport: "Soccer",
  strSquare: "https://www.thesportsdb.com/images/media/event/thumb/0dhb0e1660747052.jpg",
  strStatus: "Finalizado",
  strThumb: "https://www.thesportsdb.com/images/media/event/thumb/0dhb0e1660747052.jpg",
  strTime: "15:30",
  strTimeLocal: null,
  strTimestamp: "1665844200",
  strTweet1: null,
  strTweet2: null,
  strTweet3: null,
  strVenue: "Emirates Stadium",
  strVideo: null
};

export default EventoDetails;