import React, { useState, useEffect } from 'react';
import type { QuinielaType } from '../../types/QuinielaType';
import { Card } from '../cards/Card';
import banner from '../../assets/banner-default.webp';
import {
  TrophyIcon,
  UsersIcon,
  CalendarDaysIcon,
  CurrencyEuroIcon,
  CheckBadgeIcon,
  StarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { USER_ROUTES } from '../../constants/ROUTERS';
import { useHistory } from 'react-router-dom';

interface QuinielaItemProps {
  quiniela: QuinielaType;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const StatusBadge = ({ estado }: { estado: string }) => {
  const getStatusConfig = (estado: string) => {
    switch (estado?.toLowerCase() || '') {
      case 'activa':
        return { color: 'bg-green-500', textColor: 'text-white' };
      case 'finalizada':
        return { color: 'bg-gray-500', textColor: 'text-white' };
      case 'proximamente':
        return { color: 'bg-blue-500', textColor: 'text-white' };
      default:
        return { color: 'bg-gray-500', textColor: 'text-white' };
    }
  };

  const { color, textColor } = getStatusConfig(estado);

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color} ${textColor}`}>
      {estado}
    </span>
  );
};

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gray-800 text-white px-3 py-2 rounded-lg min-w-[40px] text-center">
        <span className="text-lg font-bold">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
      <ClockIcon className="h-5 w-5 text-red-500" />
      <div className="flex items-center gap-2">
        <TimeUnit value={timeRemaining.days} label="Días" />
        <span className="text-gray-400">:</span>
        <TimeUnit value={timeRemaining.hours} label="Horas" />
        <span className="text-gray-400">:</span>
        <TimeUnit value={timeRemaining.minutes} label="Min" />
        <span className="text-gray-400">:</span>
        <TimeUnit value={timeRemaining.seconds} label="Seg" />
      </div>
    </div>
  );
};

const QuinielaImage = ({ src, alt }: { src?: string; alt: string }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <img
        src={banner}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const QuinielaItem: React.FC<QuinielaItemProps> = ({ quiniela }) => {

  const navigate = useHistory();

  const handleArmarQuiniela = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate.push(USER_ROUTES.QUINIELA.replace(':id', quiniela.idQuiniela.toString()));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getTargetDate = () => {
    const estado = quiniela.estado?.toLowerCase();
    if (estado === 'activa') {
      return quiniela.fechaFin;
    } else if (estado === 'proximamente') {
      return quiniela.fechaInicio;
    }
    return quiniela.fechaFin;
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Banner Section */}
      <div className="relative h-32 w-full mb-4">
        <QuinielaImage
          src={quiniela.urlBanner}
          alt={quiniela.nombreQuiniela}
        />
        <div className="absolute top-3 right-3">
          <StatusBadge estado={quiniela.estado} />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {quiniela.nombreQuiniela}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {quiniela.strDescripcion}
        </p>

        {/* Countdown Timer */}
        {(quiniela.estado?.toLowerCase() === 'activa' || quiniela.estado?.toLowerCase() === 'proximamente') && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {quiniela.estado?.toLowerCase() === 'activa' ? 'Tiempo restante:' : 'Comienza en:'}
            </p>
            <CountdownTimer targetDate={getTargetDate()} />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-y border-gray-200">
          <div className="flex flex-col items-center">
            <TrophyIcon className="h-6 w-6 text-green-600 mb-1" />
            <span className="text-sm font-semibold text-green-600">
              {formatCurrency(quiniela.premioAcumulado)}
            </span>
            <span className="text-xs text-gray-500">Premio</span>
          </div>
          <div className="flex flex-col items-center">
            <UsersIcon className="h-6 w-6 text-blue-600 mb-1" />
            <span className="text-sm font-semibold">{quiniela.numeroParticipantes}</span>
            <span className="text-xs text-gray-500">Participantes</span>
          </div>
          <div className="flex flex-col items-center">
            <CurrencyEuroIcon className="h-6 w-6 text-purple-600 mb-1" />
            <span className="text-sm font-semibold text-purple-600">
              {formatCurrency(quiniela.precioParticipacion)}
            </span>
            <span className="text-xs text-gray-500">Precio</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">
              {formatDate(quiniela.fechaInicio)} - {formatDate(quiniela.fechaFin)}
            </span>
          </div>
          <span className="text-gray-500 font-medium">{quiniela.eventos.length} eventos</span>
        </div>

        {/* Bet Types */}
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Tipos de apuesta:</p>
          <div className="flex flex-wrap gap-2">
            {quiniela.tiposApuestas.slice(0, 4).map((tipo, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border">
                {tipo}
              </span>
            ))}
            {quiniela.tiposApuestas.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border">
                +{quiniela.tiposApuestas.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Special Bets */}
        {(quiniela.allowDoubleBets || quiniela.allowTripleBets) && (
          <div className="flex gap-2">
            {quiniela.allowDoubleBets && (
              <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                <CheckBadgeIcon className="h-4 w-4" />
                <span>Apuestas Dobles</span>
              </div>
            )}
            {quiniela.allowTripleBets && (
              <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                <StarIcon className="h-4 w-4" />
                <span>Apuestas Triples</span>
              </div>
            )}
          </div>
        )}

        {/* Button to Arm Quiniela */}
        <div className="mt-4">
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
            onClick={handleArmarQuiniela}
          >
            Armar Quiniela
          </button>
        </div>
      </div>
    </Card>
  );
};

export default QuinielaItem;