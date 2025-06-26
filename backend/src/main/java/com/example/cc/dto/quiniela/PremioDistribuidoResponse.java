package com.example.cc.dto.quiniela;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PremioDistribuidoResponse {
    
    private Long participacionId;
    private Long usuarioId;
    private Integer posicion;
    private BigDecimal montePremio;
    private LocalDateTime fechaDistribucion;
    private Boolean exitoso;
    private String mensaje;
}
