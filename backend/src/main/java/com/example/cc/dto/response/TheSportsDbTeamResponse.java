package com.example.cc.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheSportsDbTeamResponse {
    private String idTeam;
    private String strTeam;
    private String strSport;
    private String strLeague;
    private String strDescriptionEN;
    private String strCountry;
    private String strBadge;
    private String strLogo;
    private String strWebsite;
    private String strFacebook;
    private String strTwitter;
    private String strInstagram;
    private String strYoutube;
    private String intFormedYear;
    private String strStadium;
    private String strStadiumThumb;
    private String strStadiumDescription;
    private String strStadiumLocation;
}
