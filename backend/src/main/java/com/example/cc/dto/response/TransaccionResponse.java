package com.example.cc.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransaccionResponse {
    private Long idTransaccion;
    private String tipo;
    private String tipoDescripcion;
    private BigDecimal monto;
    private String descripcion;
    private String estado;
    private String estadoDescripcion;
    private String referenciaExterna;
    private String metodoPago;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaProcesamiento;
    private String comentarios;
    private BigDecimal comision;
    private BigDecimal montoNeto;
}
