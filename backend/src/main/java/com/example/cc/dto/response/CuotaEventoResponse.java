package com.example.cc.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.example.cc.entities.enums.TipoApuesta;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuotaEventoResponse {
    
    private Long idEvento;
    private String equipoLocal;
    private String equipoVisitante;
    private String fechaPartido;
    private TipoApuesta tipoApuesta;
    private String descripcionApuesta;
    private BigDecimal cuota;
    private boolean activa;
    private BigDecimal limiteMaximo;
    private String detalle;
}
