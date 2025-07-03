package com.example.cc.dto.crypto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoToFiatConversionResponseDTO {
    private Long transactionId;
    private String cryptoType;
    private BigDecimal cryptoAmount;
    private BigDecimal usdAmount;
    private BigDecimal fiatAmountAdded;
    private BigDecimal exchangeRate;
    private String status;
    private String message;
}
