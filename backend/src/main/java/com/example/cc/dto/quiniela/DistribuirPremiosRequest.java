package com.example.cc.dto.quiniela;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistribuirPremiosRequest {
    
    private Long quinielaId;
    private Boolean forzarDistribucion = false; // Para administradores
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ReclamarPremioRequest {
    
    private Long participacionId;
    private String metodoCobro; // FIAT, CRYPTO
    private String cryptoTipo; // Si es crypto
    private String walletAddress; // Si es crypto
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class PremioDistribuidoResponse {
    
    private Long participacionId;
    private Long usuarioId;
    private Integer posicion;
    private BigDecimal montePremio;
    private LocalDateTime fechaDistribucion;
    private Boolean exitoso;
    private String mensaje;
}
