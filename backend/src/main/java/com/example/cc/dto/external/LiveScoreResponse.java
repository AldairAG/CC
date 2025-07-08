package com.example.cc.dto.external;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LiveScoreResponse {

      @JsonProperty("livescore")
      private List<LiveScore> liveScore;

      @Data
      @JsonIgnoreProperties(ignoreUnknown = true)
      public static class LiveScore {

            private String idEvent;
            private String strSport;
            private String strHomeTeam;
            private String strAwayTeam;
            private String strHomeTeamBadge;
            private String strAwayTeamBadge;
            private Integer intHomeScore;
            private Integer intAwayScore;
            private Integer intEventScore;
            private Integer intEventScoreTotal;
            private String strStatus;
            private String strProgress;
            private String strEventTime;
            private String strDate;

      }
}
