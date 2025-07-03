package com.example.cc.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para mapear la respuesta de ligas desde TheSportsDB API
 * Endpoint: /all_leagues.php
 */
@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TheSportsDbLeagueResponse {

    @JsonProperty("leagues")
    private List<LeagueData> leagues;

    @Data
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LeagueData {
        
        @JsonProperty("idLeague")
        private String idLeague;
        
        @JsonProperty("strLeague")
        private String strLeague; // Nombre de la liga
        
        @JsonProperty("strSport")
        private String strSport; // Deporte
        
        @JsonProperty("strLeagueAlternate")
        private String strLeagueAlternate; // Nombre alternativo
        
        @JsonProperty("intDivision")
        private String intDivision; // División
        
        @JsonProperty("strCurrentSeason")
        private String strCurrentSeason; // Temporada actual
        
        @JsonProperty("intFormedYear")
        private String intFormedYear; // Año de formación
        
        @JsonProperty("dateFirstEvent")
        private String dateFirstEvent; // Fecha del primer evento
        
        @JsonProperty("strGender")
        private String strGender; // Género (Male/Female)
        
        @JsonProperty("strCountry")
        private String strCountry; // País
        
        @JsonProperty("strWebsite")
        private String strWebsite; // Sitio web oficial
        
        @JsonProperty("strFacebook")
        private String strFacebook; // Facebook
        
        @JsonProperty("strTwitter")
        private String strTwitter; // Twitter
        
        @JsonProperty("strYoutube")
        private String strYoutube; // YouTube
        
        @JsonProperty("strRSS")
        private String strRSS; // RSS Feed
        
        @JsonProperty("strDescriptionEN")
        private String strDescriptionEN; // Descripción en inglés
        
        @JsonProperty("strDescriptionDE")
        private String strDescriptionDE; // Descripción en alemán
        
        @JsonProperty("strDescriptionFR")
        private String strDescriptionFR; // Descripción en francés
        
        @JsonProperty("strDescriptionCN")
        private String strDescriptionCN; // Descripción en chino
        
        @JsonProperty("strDescriptionIT")
        private String strDescriptionIT; // Descripción en italiano
        
        @JsonProperty("strDescriptionJP")
        private String strDescriptionJP; // Descripción en japonés
        
        @JsonProperty("strDescriptionRU")
        private String strDescriptionRU; // Descripción en ruso
        
        @JsonProperty("strDescriptionES")
        private String strDescriptionES; // Descripción en español
        
        @JsonProperty("strDescriptionPT")
        private String strDescriptionPT; // Descripción en portugués
        
        @JsonProperty("strDescriptionSE")
        private String strDescriptionSE; // Descripción en sueco
        
        @JsonProperty("strDescriptionNL")
        private String strDescriptionNL; // Descripción en holandés
        
        @JsonProperty("strDescriptionHU")
        private String strDescriptionHU; // Descripción en húngaro
        
        @JsonProperty("strDescriptionNO")
        private String strDescriptionNO; // Descripción noruega
        
        @JsonProperty("strDescriptionIL")
        private String strDescriptionIL; // Descripción en hebreo
        
        @JsonProperty("strDescriptionPL")
        private String strDescriptionPL; // Descripción en polaco
        
        @JsonProperty("strTvRights")
        private String strTvRights; // Derechos de TV
        
        @JsonProperty("strFanart1")
        private String strFanart1; // Arte de fans 1
        
        @JsonProperty("strFanart2")
        private String strFanart2; // Arte de fans 2
        
        @JsonProperty("strFanart3")
        private String strFanart3; // Arte de fans 3
        
        @JsonProperty("strFanart4")
        private String strFanart4; // Arte de fans 4
        
        @JsonProperty("strBanner")
        private String strBanner; // Banner
        
        @JsonProperty("strBadge")
        private String strBadge; // Insignia/Logo
        
        @JsonProperty("strLogo")
        private String strLogo; // Logo
        
        @JsonProperty("strPoster")
        private String strPoster; // Poster
        
        @JsonProperty("strTrophy")
        private String strTrophy; // Trofeo
        
        @JsonProperty("strNaming")
        private String strNaming; // Nomenclatura
        
        @JsonProperty("strComplete")
        private String strComplete; // Completado
        
        @JsonProperty("strLocked")
        private String strLocked; // Bloqueado
    }
}
