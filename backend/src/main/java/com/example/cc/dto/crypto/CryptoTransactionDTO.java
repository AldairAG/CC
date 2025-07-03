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
public class CryptoTransactionDTO {
    private Long id;
    private Long userId;
    private CryptoTransaction.TransactionType type;
    private CryptoTransaction.CryptoType cryptoType;
    private BigDecimal amount;
    private BigDecimal usdAmount;
    private String fromAddress;
    private String toAddress;
    private String txHash;
    private CryptoTransaction.TransactionStatus status;
    private Integer confirmations;
    private Integer requiredConfirmations;
    private BigDecimal fee;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
