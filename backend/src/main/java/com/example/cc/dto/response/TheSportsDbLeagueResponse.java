package com.example.cc.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheSportsDbLeagueResponse {
    private String idLeague;
    private String strLeague;
    private String strSport;
    private String strLeagueAlternate;
    private String strDivision;
    private String strDescriptionEN;
    private String strCountry;
    private String strWebsite;
    private String strFacebook;
    private String strTwitter;
    private String strYoutube;
    private String strRSS;
    private String strBadge;
    private String strLogo;
    private String strBanner;
    private String strComplete;
    private String intFormedYear;
    private String strCurrentSeason;
}
