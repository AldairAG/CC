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
    
    @Column(name = "usd_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal usdAmount;
    
    @Column(name = "from_address", length = 255)
    private String fromAddress;
    
    @Column(name = "to_address", length = 255)
    private String toAddress;
    
    @Column(name = "tx_hash", length = 255, unique = true)
    private String txHash;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status = TransactionStatus.PENDING;
    
    @Column(name = "confirmations", nullable = false)
    private Integer confirmations = 0;
    
    @Column(name = "required_confirmations", nullable = false)
    private Integer requiredConfirmations = 3;
    
    @Column(name = "fee", precision = 20, scale = 8)
    private BigDecimal fee = BigDecimal.ZERO;
    
    @Column(name = "network_fee", precision = 20, scale = 8)
    private BigDecimal networkFee = BigDecimal.ZERO;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "notes", length = 500)
    private String notes;
    
    public enum TransactionType {
        DEPOSIT("Depósito"),
        WITHDRAWAL("Retiro"),
        CONVERSION_TO_FIAT("Conversión a Fiat"),
        CONVERSION_FROM_FIAT("Conversión desde Fiat");
        
        private final String description;
        
        TransactionType(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    public enum CryptoType {
        BTC("Bitcoin"),
        ETH("Ethereum"),
        SOL("Solana");
        
        private final String name;
        
        CryptoType(String name) {
            this.name = name;
        }
        
        public String getName() {
            return name;
        }
    }
    
    public enum TransactionStatus {
        PENDING("Pendiente"),
        CONFIRMED("Confirmada"),
        COMPLETED("Completada"),
        FAILED("Fallida"),
        CANCELLED("Cancelada");
        
        private final String description;
        
        TransactionStatus(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
}
