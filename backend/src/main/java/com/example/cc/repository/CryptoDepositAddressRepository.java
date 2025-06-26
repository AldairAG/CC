package com.example.cc.repository;

import com.example.cc.entities.CryptoDepositAddress;
import com.example.cc.entities.CryptoTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CryptoDepositAddressRepository extends JpaRepository<CryptoDepositAddress, Long> {
    
    List<CryptoDepositAddress> findByUserIdAndIsActiveTrue(Long userId);
    
    List<CryptoDepositAddress> findByUserIdAndCryptoTypeAndIsActiveTrue(Long userId, CryptoTransaction.CryptoType cryptoType);
    
    Optional<CryptoDepositAddress> findByAddress(String address);
    
    @Query("SELECT cda FROM CryptoDepositAddress cda WHERE cda.isUsed = false AND cda.isActive = true AND cda.cryptoType = :cryptoType")
    List<CryptoDepositAddress> findAvailableAddressesByCryptoType(@Param("cryptoType") CryptoTransaction.CryptoType cryptoType);
    
    @Query("SELECT cda FROM CryptoDepositAddress cda WHERE cda.expiresAt < :now AND cda.isUsed = false")
    List<CryptoDepositAddress> findExpiredAddresses(@Param("now") LocalDateTime now);
    
    @Query("SELECT cda FROM CryptoDepositAddress cda WHERE cda.userId = :userId AND cda.isUsed = false AND cda.isActive = true AND (cda.expiresAt IS NULL OR cda.expiresAt > :now)")
    List<CryptoDepositAddress> findActiveAddressesByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);
}
