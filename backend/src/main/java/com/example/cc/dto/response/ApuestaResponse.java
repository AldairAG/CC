package com.example.cc.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.example.cc.entities.enums.TipoApuesta;
import com.example.cc.entities.enums.EstadoApuesta;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApuestaResponse {
    
    private Long idApuesta;
    private Long idUsuario;
    private String emailUsuario;
    private Long idEvento;
    private String equipoLocal;
    private String equipoVisitante;
    private TipoApuesta tipoApuesta;
    private String tipoApuestaDescripcion;
    private EstadoApuesta estadoApuesta;
    private String estadoApuestaDescripcion;
    private BigDecimal montoApuesta;
    private BigDecimal cuotaApuesta;
    private BigDecimal gananciaPotencial;
    private BigDecimal gananciaReal;
    private String prediccionUsuario;
    private String resultadoReal;
    private String detalleApuesta;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaResolucion;
    private String observaciones;
}
