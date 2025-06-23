package com.example.cc.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheSportsDbEventResponse {
    private String idEvent;
    private String strEvent;
    private String strSport;
    private String strLeague;
    private String strSeason;
    private String strHomeTeam;
    private String strAwayTeam;
    private String intHomeScore;
    private String intAwayScore;
    private String strStatus;
    private String dateEvent;
    private String strTime;
    private String strVenue;
    private String strDescriptionEN;
    private String strThumb;
    private String strBanner;
    private String strVideo;
    private String strTimestamp;
    
    // Campos adicionales procesados
    private String nombreEvento;
    private String estadoEvento;
    private LocalDateTime fechaHoraEvento;
    private boolean eventoFinalizado;
    private String resultadoPartido;
}
