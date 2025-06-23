export type EventType = {
    dateEvent: string
    dateEventLocal: string | null
    idAPIfootball: string
    idAwayTeam: string
    idEvent: string
    idHomeTeam: string
    idLeague: string
    idVenue: string
    intAwayScore: number | null
    intHomeScore: number | null
    intRound: string
    intScore: number | null
    intScoreVotes: number | null
    intSpectators: number | null
    strAwayTeam: string
    strAwayTeamBadge: string
    strBanner: string
    strCity: string | null
    strCountry: string
    strDescriptionEN: string | null
    strEvent: string
    strEventAlternate: string
    strFanart: string | null
    strFilename: string
    strGroup: string | null
    strHomeTeam: string
    strHomeTeamBadge: string
    strLeague: string
    strLeagueBadge: string
    strLocked: string
    strMap: string | null
    strOfficial: string
    strPoster: string
    strPostponed: string
    strResult: string | null
    strSeason: string
    strSport: string
    strSquare: string
    strStatus: string
    strThumb: string
    strTime: string
    strTimeLocal: string | null
    strTimestamp: string
    strTweet1: string | null
    strTweet2: string | null
    strTweet3: string | null
    strVenue: string
    strVideo: string | null
}

export type Evento = {
    id?: number;
    equipoLocal: string;
    equipoVisitante: string;
    fechaPartido: string;
    estadoEvento: string;
    eventoExternoId?: string;
    deporte: string;
    liga?: string;
    estadio?: string;
    pais?: string;
    cuotaLocal?: number;
    cuotaEmpate?: number;
    cuotaVisitante?: number;
    fechaCreacion?: string;
    fechaActualizacion?: string;
};

export type EventResponseApi = {
    idEvento: number;
    equipoLocal: string | null;
    equipoVisitante: string | null;
    fechaPartido: string | null;
}
