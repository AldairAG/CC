package com.example.cc.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheSportsDbApiResponse<T> {
    private List<T> events;
    private List<T> teams;
    private List<T> leagues;
    private List<T> players;
    
    // Metadatos de la respuesta
    private String status;
    private String message;
    private int totalResults;
    private long timestamp;
}
