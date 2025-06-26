package com.example.cc.dto.quiniela;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnirseQuinielaRequest {
    
    private Long quinielaId;
    private String codigoInvitacion; // Solo si es privada
    private String metodoPago; // FIAT, CRYPTO
    private String cryptoTipo; // Si es crypto
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class HacerPrediccionesRequest {
    
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
