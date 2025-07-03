package com.example.cc.dto.crypto;

import com.example.cc.entities.CryptoTransaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoToFiatConversionRequestDTO {
    @NotNull
    private CryptoTransaction.CryptoType cryptoType;
    
    @NotNull
    @Positive
    private BigDecimal amount;
    
    private String notes; // Notas adicionales de la conversión
}
