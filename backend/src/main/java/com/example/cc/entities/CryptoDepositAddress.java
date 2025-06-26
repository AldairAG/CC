package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "crypto_deposit_addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoDepositAddress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "crypto_type", nullable = false)
    private CryptoTransaction.CryptoType cryptoType;
    
    @Column(name = "address", nullable = false, length = 100, unique = true)
    private String address;
    
    @Column(name = "private_key", length = 100)
    private String privateKey; // Encriptado
    
    @Column(name = "is_used", nullable = false)
    private Boolean isUsed = false;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "used_at")
    private LocalDateTime usedAt;
    
    @Column(name = "transaction_id")
    private Long transactionId;
    
    @Column(name = "notes", length = 500)
    private String notes;
    
    // Métodos de utilidad
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
    
    public void markAsUsed(Long transactionId) {
        this.isUsed = true;
        this.usedAt = LocalDateTime.now();
        this.transactionId = transactionId;
    }
}
