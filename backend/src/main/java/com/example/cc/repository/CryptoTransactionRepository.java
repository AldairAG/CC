package com.example.cc.repository;

import com.example.cc.entities.CryptoTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CryptoTransactionRepository extends JpaRepository<CryptoTransaction, Long> {
    
    List<CryptoTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Page<CryptoTransaction> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    List<CryptoTransaction> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, CryptoTransaction.TransactionType type);
    
    List<CryptoTransaction> findByUserIdAndCryptoTypeOrderByCreatedAtDesc(Long userId, CryptoTransaction.CryptoType cryptoType);
    
    List<CryptoTransaction> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, CryptoTransaction.TransactionStatus status);
    
    List<CryptoTransaction> findByStatusOrderByCreatedAtDesc(CryptoTransaction.TransactionStatus status);
    
    Optional<CryptoTransaction> findByTxHash(String txHash);
    
    @Query("SELECT ct FROM CryptoTransaction ct WHERE ct.userId = :userId AND ct.createdAt BETWEEN :start AND :end ORDER BY ct.createdAt DESC")
    List<CryptoTransaction> findByUserIdAndDateRange(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(ct) FROM CryptoTransaction ct WHERE ct.userId = :userId AND ct.type = :type AND ct.status = :status")
    Long countByUserIdAndTypeAndStatus(@Param("userId") Long userId, @Param("type") CryptoTransaction.TransactionType type, @Param("status") CryptoTransaction.TransactionStatus status);
}
