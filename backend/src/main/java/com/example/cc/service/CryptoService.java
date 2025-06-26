package com.example.cc.service;

import com.example.cc.dto.crypto.*;
import com.example.cc.entities.CryptoDepositAddress;
import com.example.cc.entities.CryptoTransaction;
import com.example.cc.entities.CryptoWallet;
import com.example.cc.repository.CryptoDepositAddressRepository;
import com.example.cc.repository.CryptoTransactionRepository;
import com.example.cc.repository.CryptoWalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CryptoService {
    
    private final CryptoTransactionRepository cryptoTransactionRepository;
    private final CryptoWalletRepository cryptoWalletRepository;
    private final CryptoDepositAddressRepository cryptoDepositAddressRepository;
    
    // Precios mock - En producción esto vendría de una API externa
    private final Map<CryptoTransaction.CryptoType, BigDecimal> cryptoPrices = Map.of(
        CryptoTransaction.CryptoType.BTC, new BigDecimal("45000.00"),
        CryptoTransaction.CryptoType.ETH, new BigDecimal("3200.00"),
        CryptoTransaction.CryptoType.SOL, new BigDecimal("180.00")
    );
    
    private final Map<CryptoTransaction.CryptoType, Integer> requiredConfirmations = Map.of(
        CryptoTransaction.CryptoType.BTC, 3,
        CryptoTransaction.CryptoType.ETH, 12,
        CryptoTransaction.CryptoType.SOL, 1
    );
    
    public List<CryptoBalanceDTO> getUserCryptoBalances(Long userId) {
        List<CryptoWallet> wallets = cryptoWalletRepository.findByUserIdAndIsActiveTrue(userId);
        
        // Crear wallets para cryptos que no existen
        for (CryptoTransaction.CryptoType cryptoType : CryptoTransaction.CryptoType.values()) {
            if (wallets.stream().noneMatch(w -> w.getCryptoType() == cryptoType)) {
                CryptoWallet newWallet = new CryptoWallet();
                newWallet.setUserId(userId);
                newWallet.setCryptoType(cryptoType);
                newWallet.setBalance(BigDecimal.ZERO);
                newWallet.setPendingDeposits(BigDecimal.ZERO);
                newWallet.setPendingWithdrawals(BigDecimal.ZERO);
                newWallet.setTotalDeposited(BigDecimal.ZERO);
                newWallet.setTotalWithdrawn(BigDecimal.ZERO);
                newWallet.setIsActive(true);
                wallets.add(cryptoWalletRepository.save(newWallet));
            }
        }
        
        return wallets.stream()
            .map(this::convertToBalanceDTO)
            .collect(Collectors.toList());
    }
    
    public CryptoDepositAddressDTO generateDepositAddress(Long userId, CryptoTransaction.CryptoType cryptoType) {
        // Verificar si ya existe una dirección activa no usada
        List<CryptoDepositAddress> activeAddresses = cryptoDepositAddressRepository
            .findActiveAddressesByUserId(userId, LocalDateTime.now());
        
        Optional<CryptoDepositAddress> existingAddress = activeAddresses.stream()
            .filter(addr -> addr.getCryptoType() == cryptoType)
            .findFirst();
        
        if (existingAddress.isPresent()) {
            return convertToDepositAddressDTO(existingAddress.get());
        }
        
        // Generar nueva dirección
        CryptoDepositAddress depositAddress = new CryptoDepositAddress();
        depositAddress.setUserId(userId);
        depositAddress.setCryptoType(cryptoType);
        depositAddress.setAddress(generateMockAddress(cryptoType));
        depositAddress.setIsUsed(false);
        depositAddress.setIsActive(true);
        depositAddress.setExpiresAt(LocalDateTime.now().plusMinutes(30)); // Expira en 30 minutos
        
        depositAddress = cryptoDepositAddressRepository.save(depositAddress);
        
        return convertToDepositAddressDTO(depositAddress);
    }
    
    @Transactional
    public CryptoTransactionDTO createDeposit(Long userId, CryptoDepositRequestDTO request) {
        // Validar dirección
        if (!isValidAddress(request.getUserWalletAddress(), request.getCryptoType())) {
            throw new IllegalArgumentException("Dirección de wallet inválida");
        }
        
        // Obtener o crear wallet
        CryptoWallet wallet = getOrCreateWallet(userId, request.getCryptoType());
        
        // Crear transacción
        CryptoTransaction transaction = new CryptoTransaction();
        transaction.setUserId(userId);
        transaction.setType(CryptoTransaction.TransactionType.DEPOSIT);
        transaction.setCryptoType(request.getCryptoType());
        transaction.setAmount(request.getAmount());
        transaction.setUsdAmount(calculateUsdAmount(request.getAmount(), request.getCryptoType()));
        transaction.setFromAddress(request.getUserWalletAddress());
        transaction.setToAddress(generateMockAddress(request.getCryptoType())); // Dirección del casino
        transaction.setTxHash(generateMockTxHash());
        transaction.setStatus(CryptoTransaction.TransactionStatus.PENDING);
        transaction.setConfirmations(0);
        transaction.setRequiredConfirmations(requiredConfirmations.get(request.getCryptoType()));
        transaction.setFee(new BigDecimal("0.001"));
        
        transaction = cryptoTransactionRepository.save(transaction);
        
        // Actualizar pending deposits
        wallet.addToPendingDeposits(request.getAmount());
        cryptoWalletRepository.save(wallet);
        
        log.info("Created crypto deposit transaction: {} for user: {}", transaction.getId(), userId);
        
        return convertToTransactionDTO(transaction);
    }
    
    public List<CryptoTransactionDTO> getUserTransactionHistory(Long userId, Pageable pageable) {
        Page<CryptoTransaction> transactions = cryptoTransactionRepository
            .findByUserIdOrderByCreatedAtDesc(userId, pageable);
        
        return transactions.getContent().stream()
            .map(this::convertToTransactionDTO)
            .collect(Collectors.toList());
    }
    
    public Optional<CryptoTransactionDTO> getTransactionDetails(Long userId, Long transactionId) {
        return cryptoTransactionRepository.findById(transactionId)
            .filter(tx -> tx.getUserId().equals(userId))
            .map(this::convertToTransactionDTO);
    }
    
    @Transactional
    public void processConfirmation(String txHash, int confirmations) {
        Optional<CryptoTransaction> transactionOpt = cryptoTransactionRepository.findByTxHash(txHash);
        
        if (transactionOpt.isPresent()) {
            CryptoTransaction transaction = transactionOpt.get();
            transaction.setConfirmations(confirmations);
            
            if (confirmations >= transaction.getRequiredConfirmations() && 
                transaction.getStatus() == CryptoTransaction.TransactionStatus.PENDING) {
                
                transaction.setStatus(CryptoTransaction.TransactionStatus.CONFIRMED);
                transaction.setCompletedAt(LocalDateTime.now());
                
                // Actualizar wallet
                CryptoWallet wallet = getOrCreateWallet(transaction.getUserId(), transaction.getCryptoType());
                
                if (transaction.getType() == CryptoTransaction.TransactionType.DEPOSIT) {
                    wallet.subtractFromPendingDeposits(transaction.getAmount());
                    wallet.addToBalance(transaction.getAmount());
                }
                
                cryptoWalletRepository.save(wallet);
                log.info("Confirmed transaction: {} for user: {}", transaction.getId(), transaction.getUserId());
            }
            
            cryptoTransactionRepository.save(transaction);
        }
    }
    
    // Métodos de utilidad
    private CryptoWallet getOrCreateWallet(Long userId, CryptoTransaction.CryptoType cryptoType) {
        return cryptoWalletRepository.findByUserIdAndCryptoType(userId, cryptoType)
            .orElseGet(() -> {
                CryptoWallet newWallet = new CryptoWallet();
                newWallet.setUserId(userId);
                newWallet.setCryptoType(cryptoType);
                newWallet.setBalance(BigDecimal.ZERO);
                newWallet.setPendingDeposits(BigDecimal.ZERO);
                newWallet.setPendingWithdrawals(BigDecimal.ZERO);
                newWallet.setTotalDeposited(BigDecimal.ZERO);
                newWallet.setTotalWithdrawn(BigDecimal.ZERO);
                newWallet.setIsActive(true);
                return cryptoWalletRepository.save(newWallet);
            });
    }
    
    private BigDecimal calculateUsdAmount(BigDecimal cryptoAmount, CryptoTransaction.CryptoType cryptoType) {
        BigDecimal price = cryptoPrices.get(cryptoType);
        return cryptoAmount.multiply(price).setScale(2, RoundingMode.HALF_UP);
    }
    
    private String generateMockAddress(CryptoTransaction.CryptoType cryptoType) {
        return switch (cryptoType) {
            case BTC -> "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
            case ETH -> "0x742d35Cc6634C0532925a3b8D46B654C24E7C4b8";
            case SOL -> "11111111111111111111111111111112";
        };
    }
    
    private String generateMockTxHash() {
        return "0x" + UUID.randomUUID().toString().replace("-", "");
    }
    
    private boolean isValidAddress(String address, CryptoTransaction.CryptoType cryptoType) {
        return switch (cryptoType) {
            case BTC -> address.matches("^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$");
            case ETH -> address.matches("^0x[a-fA-F0-9]{40}$");
            case SOL -> address.matches("^[1-9A-HJ-NP-Za-km-z]{32,44}$");
        };
    }
    
    // Métodos de conversión
    private CryptoBalanceDTO convertToBalanceDTO(CryptoWallet wallet) {
        CryptoBalanceDTO dto = new CryptoBalanceDTO();
        dto.setCryptoType(wallet.getCryptoType());
        dto.setBalance(wallet.getBalance());
        dto.setUsdValue(calculateUsdAmount(wallet.getBalance(), wallet.getCryptoType()));
        dto.setPendingDeposits(wallet.getPendingDeposits());
        dto.setPendingWithdrawals(wallet.getPendingWithdrawals());
        return dto;
    }
    
    private CryptoTransactionDTO convertToTransactionDTO(CryptoTransaction transaction) {
        CryptoTransactionDTO dto = new CryptoTransactionDTO();
        dto.setId(transaction.getId());
        dto.setUserId(transaction.getUserId());
        dto.setType(transaction.getType());
        dto.setCryptoType(transaction.getCryptoType());
        dto.setAmount(transaction.getAmount());
        dto.setUsdAmount(transaction.getUsdAmount());
        dto.setFromAddress(transaction.getFromAddress());
        dto.setToAddress(transaction.getToAddress());
        dto.setTxHash(transaction.getTxHash());
        dto.setStatus(transaction.getStatus());
        dto.setConfirmations(transaction.getConfirmations());
        dto.setRequiredConfirmations(transaction.getRequiredConfirmations());
        dto.setFee(transaction.getFee());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setUpdatedAt(transaction.getUpdatedAt());
        dto.setCompletedAt(transaction.getCompletedAt());
        return dto;
    }
    
    private CryptoDepositAddressDTO convertToDepositAddressDTO(CryptoDepositAddress address) {
        CryptoDepositAddressDTO dto = new CryptoDepositAddressDTO();
        dto.setCryptoType(address.getCryptoType());
        dto.setAddress(address.getAddress());
        dto.setQrCode("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==");
        if (address.getExpiresAt() != null) {
            dto.setExpiresAt(address.getExpiresAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }
        return dto;
    }
}
