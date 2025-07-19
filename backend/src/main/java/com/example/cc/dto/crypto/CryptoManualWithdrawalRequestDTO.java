package com.example.cc.dto.crypto;

import com.example.cc.entities.CryptoTransaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoManualWithdrawalRequestDTO {
    
    @NotNull(message = "El tipo de criptomoneda es obligatorio")
    private CryptoTransaction.CryptoType cryptoType;
    
    @NotNull(message = "El monto es obligatorio")
    @Positive(message = "El monto debe ser positivo")
    private BigDecimal amount;
    
    @NotNull(message = "La dirección de destino es obligatoria")
    private String toAddress;
    
    private String notes; // Notas adicionales
}
