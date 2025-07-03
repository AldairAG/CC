// Tipos para la integración con TheSportsDB API
export interface SportType {
    idSport: string;
    strSport: string;
    strSportThumb?: string;
    strSportIconGreen?: string;
    strSportDescription?: string;
}

export interface LeagueType {
    idLeague: string;
    strLeague: string;
    strSport: string;
    strLeagueAlternate?: string;
    intDivision?: string;
    idSoccerXML?: string;
    strWebsite?: string;
    strFacebook?: string;
    strTwitter?: string;
    strYoutube?: string;
    strRSS?: string;
    strDescriptionEN?: string;
    strDescriptionDE?: string;
    strDescriptionFR?: string;
    strDescriptionCN?: string;
    strDescriptionIT?: string;
    strDescriptionJP?: string;
    strDescriptionRU?: string;
    strDescriptionES?: string;
    strDescriptionPT?: string;
    strDescriptionSE?: string;
    strDescriptionNL?: string;
    strDescriptionHU?: string;
    strDescriptionNO?: string;
    strDescriptionIL?: string;
    strDescriptionPL?: string;
    strGender?: string;
    strCountry?: string;
    strLogo?: string;
    strTrophy?: string;
    strBanner?: string;
    strBadge?: string;
    strPoster?: string;
    strNaming?: string;
    strComplete?: string;
    intLocked?: string;
    strCurrentSeason?: string;
    intFormedYear?: string;
    dateFirstEvent?: string;
    strLocked?: string;
}

export interface TeamType {
    idTeam: string;
    strTeam: string;
    strTeamShort?: string;
    strAlternate?: string;
    intFormedYear?: string;
    strSport: string;
    strLeague?: string;
    idLeague?: string;
    strManager?: string;
    strStadium?: string;
    strKeywords?: string;
    strRSS?: string;
    strStadiumThumb?: string;
    strStadiumDescription?: string;
    strStadiumLocation?: string;
    intStadiumCapacity?: string;
    strWebsite?: string;
    strFacebook?: string;
    strTwitter?: string;
    strInstagram?: string;
    strDescriptionEN?: string;
    strDescriptionDE?: string;
    strDescriptionFR?: string;
    strDescriptionCN?: string;
    strDescriptionIT?: string;
    strDescriptionJP?: string;
    strDescriptionRU?: string;
    strDescriptionES?: string;
    strDescriptionPT?: string;
    strDescriptionSE?: string;
    strDescriptionNL?: string;
    strDescriptionHU?: string;
    strDescriptionNO?: string;
    strDescriptionIL?: string;
    strDescriptionPL?: string;
    strGender?: string;
    strCountry?: string;
    strTeamBadge?: string;
    strTeamJersey?: string;
    strTeamLogo?: string;
    strTeamFanart1?: string;
    strTeamFanart2?: string;
    strTeamFanart3?: string;
    strTeamFanart4?: string;
    strTeamBanner?: string;
    strYoutube?: string;
    strLocked?: string;
}

// Respuestas de la API de TheSportsDB
export interface SportsResponse {
    sports: SportType[];
}

export interface LeaguesResponse {
    leagues: LeagueType[];
}

export interface TeamsResponse {
    teams: TeamType[];
}

// Tipos simplificados para uso interno
export interface SimpleSportType {
    id: string;
    name: string;
    thumbnail?: string;
}

export interface SimpleLeagueType {
    id: string;
    name: string;
    sport: string;
    country?: string;
    logo?: string;
}

export interface SimpleTeamType {
    id: string;
    name: string;
    sport: string;
    league?: string;
    badge?: string;
}

// Estado del slice
export interface TheSportsDBState {
    // Datos
    sports: SimpleSportType[];
    leagues: SimpleLeagueType[];
    teams: SimpleTeamType[];
    
    // Estados de carga
    sportsLoading: boolean;
    leaguesLoading: boolean;
    teamsLoading: boolean;
    
    // Errores
    sportsError: string | null;
    leaguesError: string | null;
    teamsError: string | null;
    
    // Cache
    lastSportsUpdate: string | null;
    lastLeaguesUpdate: string | null;
    lastTeamsUpdate: string | null;
    
    // Filtros activos
    selectedSport: string | null;
    selectedLeague: string | null;
}
