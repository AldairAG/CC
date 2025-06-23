package com.example.cc.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class Autenticacion2FAResponse {
    private boolean habilitado;
    private String tipo;
    private String tipoDescripcion;
    private String qrCodeUrl; // Para configurar TOTP
    private String secretKey; // Para configurar manualmente
    private LocalDateTime fechaActivacion;
    private LocalDateTime ultimoUso;
    private boolean bloqueado;
}
