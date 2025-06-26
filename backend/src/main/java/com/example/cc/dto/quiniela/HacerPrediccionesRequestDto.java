package com.example.cc.dto.quiniela;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HacerPrediccionesRequestDto {
    
    private Long quinielaId;
    private List<PrediccionEvento> predicciones;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrediccionEvento {
        private Long eventoId;
        private Integer resultadoPredichoLocal;
        private Integer resultadoPredichoVisitante;
        private String tipoPrediccion; // RESULTADO_EXACTO, SOLO_GANADOR
    }
}
