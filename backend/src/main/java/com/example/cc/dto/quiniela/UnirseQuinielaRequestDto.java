package com.example.cc.dto.quiniela;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnirseQuinielaRequestDto {
    
    private Long quinielaId;
    private String codigoInvitacion; // Solo si es privada
    private String metodoPago; // FIAT, CRYPTO
    private String cryptoTipo; // Si es crypto
}
