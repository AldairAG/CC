interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle?: string;
}

const StatsCard = ({ title, value, icon, color, subtitle }: StatsCardProps) => {
  return (
    <div className={`bg-gradient-to-r ${color} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="text-4xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  liveMatches: number;
  todayMatches: number;
  upcomingMatches: number;
  popularLeagues: number;
}

const DashboardStats = ({
  liveMatches,
  todayMatches,
  upcomingMatches,
  popularLeagues
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Partidos en Vivo"
        value={liveMatches}
        icon="🔴"
        color="from-red-500 to-red-600"
        subtitle="Ahora mismo"
      />
      <StatsCard
        title="Partidos Hoy"
        value={todayMatches}
        icon="📅"
        color="from-blue-500 to-blue-600"
        subtitle="Disponibles hoy"
      />
      <StatsCard
        title="Próximos Partidos"
        value={upcomingMatches}
        icon="⏰"
        color="from-green-500 to-green-600"
        subtitle="Esta semana"
      />
      <StatsCard
        title="Ligas Populares"
        value={popularLeagues}
        icon="🏆"
        color="from-purple-500 to-purple-600"
        subtitle="Disponibles"
      />
    </div>
  );
};

export default DashboardStats;
