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
@Table(name = "crypto_wallets", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "crypto_type"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoWallet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "crypto_type", nullable = false)
    private CryptoTransaction.CryptoType cryptoType;
    
    @Column(name = "balance", nullable = false, precision = 20, scale = 8)
    private BigDecimal balance = BigDecimal.ZERO;
    
    @Column(name = "pending_deposits", precision = 20, scale = 8)
    private BigDecimal pendingDeposits = BigDecimal.ZERO;
    
    @Column(name = "pending_withdrawals", precision = 20, scale = 8)
    private BigDecimal pendingWithdrawals = BigDecimal.ZERO;
    
    @Column(name = "total_deposited", precision = 20, scale = 8)
    private BigDecimal totalDeposited = BigDecimal.ZERO;
    
    @Column(name = "total_withdrawn", precision = 20, scale = 8)
    private BigDecimal totalWithdrawn = BigDecimal.ZERO;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Métodos de utilidad
    public void addToBalance(BigDecimal amount) {
        this.balance = this.balance.add(amount);
        this.totalDeposited = this.totalDeposited.add(amount);
    }
    
    public void subtractFromBalance(BigDecimal amount) {
        this.balance = this.balance.subtract(amount);
        this.totalWithdrawn = this.totalWithdrawn.add(amount);
    }
    
    public void addToPendingDeposits(BigDecimal amount) {
        this.pendingDeposits = this.pendingDeposits.add(amount);
    }
    
    public void subtractFromPendingDeposits(BigDecimal amount) {
        this.pendingDeposits = this.pendingDeposits.subtract(amount);
    }
    
    public void addToPendingWithdrawals(BigDecimal amount) {
        this.pendingWithdrawals = this.pendingWithdrawals.add(amount);
    }
    
    public void subtractFromPendingWithdrawals(BigDecimal amount) {
        this.pendingWithdrawals = this.pendingWithdrawals.subtract(amount);
    }
}
