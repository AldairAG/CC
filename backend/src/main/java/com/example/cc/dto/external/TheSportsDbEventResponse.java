package com.example.cc.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * DTO para la respuesta de TheSportsDB API - Eventos
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TheSportsDbEventResponse {

    @JsonProperty("events")
    private List<EventData> events;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EventData {
        
        @JsonProperty("idEvent")
        private String idEvent;
        
        @JsonProperty("strEvent")
        private String strEvent; // Nombre del evento
        
        @JsonProperty("strLeague")
        private String strLeague; // Liga
        
        @JsonProperty("strSport")
        private String strSport; // Deporte
        
        @JsonProperty("strHomeTeam")
        private String strHomeTeam; // Equipo local
        
        @JsonProperty("strAwayTeam")
        private String strAwayTeam; // Equipo visitante
        
        @JsonProperty("dateEvent")
        private String dateEvent; // Fecha del evento (YYYY-MM-DD)
        
        @JsonProperty("strTime")
        private String strTime; // Hora del evento (HH:MM:SS)
        
        @JsonProperty("strStatus")
        private String strStatus; // Estado del evento
        
        @JsonProperty("strSeason")
        private String strSeason; // Temporada
        
        @JsonProperty("strEventAlternate")
        private String strEventAlternate; // Nombre alternativo
        
        @JsonProperty("strDescriptionEN")
        private String strDescriptionEN; // Descripción en inglés
    }
}
