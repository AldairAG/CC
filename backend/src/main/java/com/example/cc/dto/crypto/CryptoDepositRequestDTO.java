package com.example.cc.dto.crypto;

import com.example.cc.entities.CryptoTransaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoDepositRequestDTO {
    private CryptoTransaction.CryptoType cryptoType;
    private BigDecimal amount;
    private String userWalletAddress;
}
