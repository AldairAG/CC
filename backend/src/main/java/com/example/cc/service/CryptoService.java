package com.example.cc.service;

import com.example.cc.dto.crypto.*;
import com.example.cc.entities.*;
import com.example.cc.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CryptoService {
    
    private final CryptoTransactionRepository cryptoTransactionRepository;
    private final CryptoWalletRepository cryptoWalletRepository;
    private final UsuarioRepository usuarioRepository;
    private final TransaccionRepository transaccionRepository;
    
    // Precios mock - En producción esto vendría de una API externa como CoinGecko
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
    
    @Transactional(readOnly = true)
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
    
    /**
     * Convierte criptomonedas a saldo fiat del usuario
     */
    @Transactional
    public CryptoToFiatConversionResponseDTO convertCryptoToFiat(Long userId, CryptoToFiatConversionRequestDTO request) {
        try {
            // Verificar que el usuario existe
            Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Obtener wallet del usuario para la criptomoneda
            CryptoWallet wallet = cryptoWalletRepository.findByUserIdAndCryptoTypeAndIsActiveTrue(userId, request.getCryptoType())
                .orElseThrow(() -> new RuntimeException("Wallet de " + request.getCryptoType() + " no encontrado"));
            
            // Verificar balance suficiente
            if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
                throw new RuntimeException("Balance insuficiente. Disponible: " + wallet.getBalance() + " " + request.getCryptoType());
            }
            
            // Calcular valor en USD
            BigDecimal exchangeRate = cryptoPrices.get(request.getCryptoType());
            BigDecimal usdAmount = request.getAmount().multiply(exchangeRate).setScale(2, RoundingMode.HALF_UP);
            
            // Descontar comisión de conversión (2%)
            BigDecimal conversionFee = usdAmount.multiply(new BigDecimal("0.02")).setScale(2, RoundingMode.HALF_UP);
            BigDecimal finalFiatAmount = usdAmount.subtract(conversionFee);
            
            // Crear transacción crypto
            CryptoTransaction cryptoTransaction = new CryptoTransaction();
            cryptoTransaction.setUserId(userId);
            cryptoTransaction.setType(CryptoTransaction.TransactionType.CONVERSION_TO_FIAT);
            cryptoTransaction.setCryptoType(request.getCryptoType());
            cryptoTransaction.setAmount(request.getAmount());
            cryptoTransaction.setUsdAmount(usdAmount);
            cryptoTransaction.setFee(conversionFee);
            cryptoTransaction.setStatus(CryptoTransaction.TransactionStatus.COMPLETED);
            cryptoTransaction.setCompletedAt(LocalDateTime.now());
            cryptoTransaction.setNotes(request.getNotes());
            cryptoTransaction = cryptoTransactionRepository.save(cryptoTransaction);
            
            // Actualizar wallet crypto
            wallet.subtractFromBalance(request.getAmount());
            cryptoWalletRepository.save(wallet);
            
            // Crear transacción fiat en el sistema tradicional
            Transaccion transaccionFiat = new Transaccion();
            transaccionFiat.setUsuario(usuario);
            transaccionFiat.setTipo(Transaccion.TipoTransaccion.DEPOSITO);
            transaccionFiat.setMonto(finalFiatAmount);
            transaccionFiat.setMontoNeto(finalFiatAmount);
            transaccionFiat.setComision(conversionFee);
            transaccionFiat.setDescripcion("Conversión de " + request.getAmount() + " " + request.getCryptoType() + " a USD");
            transaccionFiat.setEstado(Transaccion.EstadoTransaccion.COMPLETADA);
            transaccionFiat.setFechaProcesamiento(LocalDateTime.now());
            transaccionFiat.setReferenciaExterna("CRYPTO_CONV_" + cryptoTransaction.getId());
            transaccionFiat.setMetodoPago("Conversión Criptomoneda");
            transaccionRepository.save(transaccionFiat);
            
            // Actualizar saldo del usuario
            BigDecimal nuevoSaldo = usuario.getSaldoUsuario().add(finalFiatAmount);
            usuario.setSaldoUsuario(nuevoSaldo);
            usuarioRepository.save(usuario);
            
            log.info("Conversión completada: {} {} -> ${} USD para usuario {}", 
                request.getAmount(), request.getCryptoType(), finalFiatAmount, userId);
            
            return new CryptoToFiatConversionResponseDTO(
                cryptoTransaction.getId(),
                request.getCryptoType().toString(),
                request.getAmount(),
                usdAmount,
                finalFiatAmount,
                exchangeRate,
                "COMPLETED",
                "Conversión completada exitosamente"
            );
            
        } catch (Exception e) {
            log.error("Error en conversión crypto a fiat para usuario {}: {}", userId, e.getMessage());
            throw new RuntimeException("Error en la conversión: " + e.getMessage());
        }
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
        transaction.setRequiredConfirmations(requiredConfirmations.get(request.getCryptoType()));
        transaction.setStatus(CryptoTransaction.TransactionStatus.PENDING);
        
        transaction = cryptoTransactionRepository.save(transaction);
        
        // Agregar a depósitos pendientes
        wallet.addToPendingDeposits(request.getAmount());
        cryptoWalletRepository.save(wallet);
        
        log.info("Created deposit transaction: {} for user: {}", transaction.getId(), userId);
        
        return convertToTransactionDTO(transaction);
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
    
    @Transactional(readOnly = true)
    public List<CryptoTransactionDTO> getUserCryptoTransactions(Long userId) {
        List<CryptoTransaction> transactions = cryptoTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private CryptoTransactionDTO convertToDTO(CryptoTransaction transaction) {
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
        dto.setCompletedAt(transaction.getCompletedAt());
        return dto;
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
    
    private boolean isValidAddress(String address, CryptoTransaction.CryptoType cryptoType) {
        // Implementación simple - en producción usar librerías específicas
        if (address == null || address.trim().isEmpty()) {
            return false;
        }
        
        switch (cryptoType) {
            case BTC:
                return address.length() >= 26 && address.length() <= 35;
            case ETH:
                return address.startsWith("0x") && address.length() == 42;
            case SOL:
                return address.length() >= 32 && address.length() <= 44;
            default:
                return false;
        }
    }
    
    private String generateMockAddress(CryptoTransaction.CryptoType cryptoType) {
        // Generar direcciones mock para depósitos
        switch (cryptoType) {
            case BTC:
                return "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
            case ETH:
                return "0x742d35cc6634c0532925a3b8d401301903f96e5b";
            case SOL:
                return "11111111111111111111111111111112";
            default:
                return "UNKNOWN_ADDRESS";
        }
    }
    
    private String generateMockTxHash() {
        return "0x" + System.currentTimeMillis() + "mock";
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
        dto.setCompletedAt(transaction.getCompletedAt());
        return dto;
    }
}
