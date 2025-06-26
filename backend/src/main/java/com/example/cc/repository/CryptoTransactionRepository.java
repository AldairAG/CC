package com.example.cc.repository;

import com.example.cc.entities.CryptoTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CryptoTransactionRepository extends JpaRepository<CryptoTransaction, Long> {
    
    List<CryptoTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Page<CryptoTransaction> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    List<CryptoTransaction> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, CryptoTransaction.TransactionType type);
    
    List<CryptoTransaction> findByUserIdAndCryptoTypeOrderByCreatedAtDesc(Long userId, CryptoTransaction.CryptoType cryptoType);
    
    List<CryptoTransaction> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, CryptoTransaction.TransactionStatus status);
    
    Optional<CryptoTransaction> findByTxHash(String txHash);
    
    @Query("SELECT ct FROM CryptoTransaction ct WHERE ct.userId = :userId AND ct.status = 'PENDING'")
    List<CryptoTransaction> findPendingTransactionsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT ct FROM CryptoTransaction ct WHERE ct.status = 'PENDING' AND ct.type = 'DEPOSIT'")
    List<CryptoTransaction> findAllPendingDeposits();
    
    @Query("SELECT COUNT(ct) FROM CryptoTransaction ct WHERE ct.userId = :userId AND ct.type = :type")
    Long countByUserIdAndType(@Param("userId") Long userId, @Param("type") CryptoTransaction.TransactionType type);
}
