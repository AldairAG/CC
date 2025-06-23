package com.example.cc.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DocumentoIdentidadResponse {
    private Long idDocumento;
    private String tipoDocumento;
    private String tipoDocumentoDescripcion;
    private String nombreArchivo;
    private String urlArchivo;
    private String estado;
    private String estadoDescripcion;
    private LocalDateTime fechaSubida;
    private LocalDateTime fechaVerificacion;
    private String comentariosVerificacion;
}
