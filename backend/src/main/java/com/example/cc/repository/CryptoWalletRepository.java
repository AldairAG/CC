package com.example.cc.repository;

import com.example.cc.entities.CryptoWallet;
import com.example.cc.entities.CryptoTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CryptoWalletRepository extends JpaRepository<CryptoWallet, Long> {
    
    List<CryptoWallet> findByUserIdAndIsActiveTrue(Long userId);
    
    Optional<CryptoWallet> findByUserIdAndCryptoType(Long userId, CryptoTransaction.CryptoType cryptoType);
    
    Optional<CryptoWallet> findByUserIdAndCryptoTypeAndIsActiveTrue(Long userId, CryptoTransaction.CryptoType cryptoType);
    
    @Query("SELECT cw FROM CryptoWallet cw WHERE cw.userId = :userId AND cw.balance > 0 AND cw.isActive = true")
    List<CryptoWallet> findByUserIdWithPositiveBalance(@Param("userId") Long userId);
    
    @Query("SELECT SUM(cw.balance) FROM CryptoWallet cw WHERE cw.userId = :userId AND cw.cryptoType = :cryptoType")
    Optional<BigDecimal> getTotalBalanceByUserIdAndCryptoType(@Param("userId") Long userId, @Param("cryptoType") CryptoTransaction.CryptoType cryptoType);
}
