package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "crypto_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TransactionType type;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "crypto_type", nullable = false)
    private CryptoType cryptoType;
    
    @Column(name = "amount", nullable = false, precision = 20, scale = 8)
    private BigDecimal amount;
    
    @Column(name = "usd_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal usdAmount;
    
    @Column(name = "from_address", nullable = false, length = 100)
    private String fromAddress;
    
    @Column(name = "to_address", nullable = false, length = 100)
    private String toAddress;
    
    @Column(name = "tx_hash", unique = true, length = 100)
    private String txHash;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status;
    
    @Column(name = "confirmations", nullable = false)
    private Integer confirmations = 0;
    
    @Column(name = "required_confirmations", nullable = false)
    private Integer requiredConfirmations;
    
    @Column(name = "fee", precision = 20, scale = 8)
    private BigDecimal fee;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "deposit_address", length = 100)
    private String depositAddress;
    
    @Column(name = "notes", length = 500)
    private String notes;
    
    // Enums
    public enum TransactionType {
        DEPOSIT, WITHDRAWAL
    }
    
    public enum CryptoType {
        BTC, ETH, SOL
    }
    
    public enum TransactionStatus {
        PENDING, CONFIRMED, FAILED, PROCESSING
    }
}
