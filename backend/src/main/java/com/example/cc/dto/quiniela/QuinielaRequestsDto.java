package com.example.cc.dto.quiniela;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuinielaRequestsDto {
    
    private Long participacionId;
    private List<PrediccionRequest> predicciones;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrediccionRequest {
        private Long eventoId;
        private Integer prediccionLocal;
        private Integer prediccionVisitante;
    }
}
