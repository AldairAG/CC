package com.example.cc.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * DTO para la respuesta de TheSportsDB API - Deportes
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TheSportsDbSportResponse {

    @JsonProperty("sports")
    private List<SportData> sports;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SportData {
        
        @JsonProperty("idSport")
        private String idSport;
        
        @JsonProperty("strSport")
        private String strSport;
        
        @JsonProperty("strFormat")
        private String strFormat;
        
        @JsonProperty("strSportThumb")
        private String strSportThumb;
        
        @JsonProperty("strSportIconGreen")
        private String strSportIconGreen;
        
        @JsonProperty("strSportDescription")
        private String strSportDescription;
    }
}
