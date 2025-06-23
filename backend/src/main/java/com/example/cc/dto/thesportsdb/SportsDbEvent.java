package com.example.cc.dto.thesportsdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SportsDbEvent {
    @JsonProperty("idEvent")
    private String idEvent;
    
    @JsonProperty("strEvent")
    private String strEvent; // Nombre del evento
    
    @JsonProperty("strHomeTeam")
    private String strHomeTeam; // Equipo local
    
    @JsonProperty("strAwayTeam")
    private String strAwayTeam; // Equipo visitante
    
    @JsonProperty("dateEvent")
    private String dateEvent; // Fecha del evento (YYYY-MM-DD)
    
    @JsonProperty("strTime")
    private String strTime; // Hora del evento (HH:MM:SS)
    
    @JsonProperty("strLeague")
    private String strLeague; // Liga
    
    @JsonProperty("strSport")
    private String strSport; // Deporte
    
    @JsonProperty("strVenue")
    private String strVenue; // Estadio
    
    @JsonProperty("strCountry")
    private String strCountry; // País
    
    @JsonProperty("strSeason")
    private String strSeason; // Temporada
    
    @JsonProperty("intHomeScore")
    private String intHomeScore; // Resultado equipo local
    
    @JsonProperty("intAwayScore")
    private String intAwayScore; // Resultado equipo visitante
    
    @JsonProperty("strStatus")
    private String strStatus; // Estado del partido (Not Started, Match Finished, etc.)
}
