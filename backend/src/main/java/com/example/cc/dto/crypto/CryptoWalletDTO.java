package com.example.cc.dto.crypto;

import com.example.cc.entities.CryptoTransaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoWalletDTO {
    
    private Long id;
    private Long userId;
    private CryptoTransaction.CryptoType cryptoType;
    private String address;
    private BigDecimal balance;
    private BigDecimal pendingDeposits;
    private BigDecimal pendingWithdrawals;
    private BigDecimal totalDeposited;
    private BigDecimal totalWithdrawn;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
