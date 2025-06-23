package com.example.cc.dto.thesportsdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class SportsDbEventResponse {
    @JsonProperty("events")
    private List<SportsDbEvent> events;
}
