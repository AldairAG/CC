package com.example.cc.dto.request;

import lombok.Data;

@Data
public class PrediccionRequest {
    private Long eventoId;
    private String prediccion;
    private Integer confianza; // 1-5 nivel de confianza
}
