package com.example.cc.dto.crypto;

import com.example.cc.entities.CryptoTransaction;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoWalletCreateRequestDTO {
    
    @NotNull(message = "El tipo de criptomoneda es obligatorio")
    private CryptoTransaction.CryptoType cryptoType;
    
    @NotNull(message = "La dirección es obligatoria")
    private String address;
    
    private String notes; // Notas adicionales
}
