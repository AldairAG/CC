package com.example.cc.service.crypto;

import com.example.cc.dto.crypto.*;
import com.example.cc.entities.*;
import com.example.cc.entities.CryptoTransaction.CryptoType;
import com.example.cc.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CryptoService implements ICryptoService {
    
    private final CryptoTransactionRepository cryptoTransactionRepository;
    private final CryptoWalletRepository cryptoWalletRepository;
    private final UsuarioRepository usuarioRepository;
    private final TransaccionRepository transaccionRepository;
    
    // Los precios ahora se obtienen de una API externa cada vez que se usan
    // Ejemplo de método para obtener precios desde una API externa
    public BigDecimal getCryptoPriceFromApi(CryptoTransaction.CryptoType cryptoType) {
        String apiId;
        switch (cryptoType) {
            case BTC: apiId = "bitcoin"; break;
            case ETH: apiId = "ethereum"; break;
            case SOL: apiId = "solana"; break;
            // Si tienes TRC-20, usa "tron"
            default: apiId = null;
        }
        if (apiId == null) return BigDecimal.ZERO;

        try {
            String urlStr = "https://api.coingecko.com/api/v3/simple/price?ids=" + apiId + "&vs_currencies=usd";
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder content = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            conn.disconnect();

            Map<String, BigDecimal> json = new ObjectMapper().readValue(content.toString(), new TypeReference<Map<String, BigDecimal>>() {});
            BigDecimal price = json.get(apiId);
            log.info("Precio obtenido de CoinGecko para {}: {}", cryptoType, price);
            // Aquí podrías guardar el precio en la BD si lo deseas
            return price;
        } catch (Exception e) {
            log.error("Error obteniendo precio de {} desde CoinGecko: {}", cryptoType, e.getMessage());
            return BigDecimal.ZERO;
        }
    }
    
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
            BigDecimal exchangeRate = getCryptoPriceFromApi(request.getCryptoType());
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
        BigDecimal price = getCryptoPriceFromApi(cryptoType);
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

    /**
     * Simula transferencia entre wallets de Solana, Bitcoin, Ethereum y TRC-20.
     * Si la transferencia es exitosa, suma el monto al saldo del cliente en la BD.
     */
    @Transactional
    public CryptoTransactionDTO transferCrypto(Long userId, String fromAddress, 
        String toAddress, BigDecimal amount, CryptoTransaction.CryptoType cryptoType,CryptoTransaction.TransactionType transactionType) {
        // Validar direcciones
        if (!isValidAddress(fromAddress, cryptoType) || !isValidAddress(toAddress, cryptoType)) {
            throw new IllegalArgumentException("Dirección inválida para la red " + cryptoType);
        }

        // Obtener wallet de origen
        CryptoWallet wallet = cryptoWalletRepository.findByUserIdAndCryptoTypeAndIsActiveTrue(userId, cryptoType)
            .orElseThrow(() -> new RuntimeException("Wallet de " + cryptoType + " no encontrada"));

        // Verificar saldo suficiente
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Saldo insuficiente. Disponible: " + wallet.getBalance() + " " + cryptoType);
        }

        // Simular proceso de transferencia en la red (aquí iría integración real)
        boolean transferenciaExitosa = true; // Aquí deberías integrar con la red real
        String txHash = generateMockTxHash(); // En integración real, obtén el hash de la red

        // Crear transacción
        CryptoTransaction transaction = new CryptoTransaction();
        transaction.setUserId(userId);
        transaction.setType(transactionType);
        transaction.setCryptoType(cryptoType);
        transaction.setAmount(amount);
        transaction.setUsdAmount(calculateUsdAmount(amount, cryptoType));
        transaction.setFromAddress(fromAddress);
        transaction.setToAddress(toAddress);
        transaction.setTxHash(txHash);
        transaction.setStatus(transferenciaExitosa ? CryptoTransaction.TransactionStatus.COMPLETED : CryptoTransaction.TransactionStatus.FAILED);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setCompletedAt(transferenciaExitosa ? LocalDateTime.now() : null);

        transaction = cryptoTransactionRepository.save(transaction);

        if (transferenciaExitosa) {
            // Actualizar saldo del wallet de origen
            wallet.subtractFromBalance(amount);
            cryptoWalletRepository.save(wallet);
            // Si el destino es interno, sumar al wallet destino (opcional)
            // Actualizar saldo del usuario en la BD si aplica
        }

        log.info("Transferencia {}: {} -> {} | Monto: {} {} | Hash: {}", transferenciaExitosa ? "exitosa" : "fallida", fromAddress, toAddress, amount, cryptoType, txHash);

        return convertToTransactionDTO(transaction);
    }

    @Override
    public CryptoTransactionDTO createWithdrawal(Long userId, String toAddress, BigDecimal amount,
            CryptoType cryptoType) {
        // Validar dirección destino
        if (!isValidAddress(toAddress, cryptoType)) {
            throw new IllegalArgumentException("Dirección de wallet destino inválida");
        }

        // Obtener wallet del usuario
        CryptoWallet wallet = cryptoWalletRepository.findByUserIdAndCryptoTypeAndIsActiveTrue(userId, cryptoType)
            .orElseThrow(() -> new RuntimeException("Wallet de " + cryptoType + " no encontrado"));

        // Verificar saldo suficiente
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Saldo insuficiente. Disponible: " + wallet.getBalance() + " " + cryptoType);
        }

        // Calcular comisión de retiro (ejemplo: 1%)
        BigDecimal withdrawalFee = amount.multiply(new BigDecimal("0.01")).setScale(8, RoundingMode.HALF_UP);
        BigDecimal finalAmount = amount.subtract(withdrawalFee);

        // Simular generación de hash de transacción
        String txHash = generateMockTxHash();

        // Crear transacción de retiro
        CryptoTransaction transaction = new CryptoTransaction();
        transaction.setUserId(userId);
        transaction.setType(CryptoTransaction.TransactionType.WITHDRAWAL);
        transaction.setCryptoType(cryptoType);
        transaction.setAmount(amount);
        transaction.setUsdAmount(calculateUsdAmount(amount, cryptoType));
        transaction.setFromAddress(wallet.getAddress()); // Asume que el wallet tiene un campo address
        transaction.setToAddress(toAddress);
        transaction.setTxHash(txHash);
        transaction.setFee(withdrawalFee);
        transaction.setRequiredConfirmations(requiredConfirmations.getOrDefault(cryptoType, 1));
        transaction.setStatus(CryptoTransaction.TransactionStatus.PENDING);
        transaction.setCreatedAt(LocalDateTime.now());

        transaction = cryptoTransactionRepository.save(transaction);

        // Actualizar wallet: mover fondos a retiros pendientes
        wallet.subtractFromBalance(amount);
        wallet.addToPendingWithdrawals(amount);
        cryptoWalletRepository.save(wallet);

        log.info("Created withdrawal transaction: {} for user: {}", transaction.getId(), userId);

        return convertToTransactionDTO(transaction);
    }

    @Override
    public void processWithdrawalConfirmation(String txHash, int confirmations) {
        Optional<CryptoTransaction> transactionOpt = cryptoTransactionRepository.findByTxHash(txHash);

        if (transactionOpt.isPresent()) {
            CryptoTransaction transaction = transactionOpt.get();
            transaction.setConfirmations(confirmations);

            if (transaction.getType() == CryptoTransaction.TransactionType.WITHDRAWAL &&
                confirmations >= transaction.getRequiredConfirmations() &&
                transaction.getStatus() == CryptoTransaction.TransactionStatus.PENDING) {

                transaction.setStatus(CryptoTransaction.TransactionStatus.CONFIRMED);
                transaction.setCompletedAt(LocalDateTime.now());

                // Actualizar wallet: quitar de retiros pendientes y sumar a total retirado
                CryptoWallet wallet = getOrCreateWallet(transaction.getUserId(), transaction.getCryptoType());
                wallet.subtractFromPendingWithdrawals(transaction.getAmount());
                wallet.addToTotalWithdrawn(transaction.getAmount());
                cryptoWalletRepository.save(wallet);

                log.info("Confirmed withdrawal transaction: {} for user: {}", transaction.getId(), transaction.getUserId());
            }

            cryptoTransactionRepository.save(transaction);
        }
    }

    @Override
    public CryptoWallet createCryptoWallet(CryptoWallet wallet) {
        if (wallet.getUserId() == null || wallet.getCryptoType() == null || wallet.getAddress() == null) {
            throw new IllegalArgumentException("userId, cryptoType y address son obligatorios");
        }
        wallet.setBalance(wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO);
        wallet.setPendingDeposits(wallet.getPendingDeposits() != null ? wallet.getPendingDeposits() : BigDecimal.ZERO);
        wallet.setPendingWithdrawals(wallet.getPendingWithdrawals() != null ? wallet.getPendingWithdrawals() : BigDecimal.ZERO);
        wallet.setTotalDeposited(wallet.getTotalDeposited() != null ? wallet.getTotalDeposited() : BigDecimal.ZERO);
        wallet.setTotalWithdrawn(wallet.getTotalWithdrawn() != null ? wallet.getTotalWithdrawn() : BigDecimal.ZERO);
        wallet.setIsActive(wallet.getIsActive() != null ? wallet.getIsActive() : true);
        return cryptoWalletRepository.save(wallet);
    }

    @Override
    public CryptoWallet getCryptoWalletById(Long walletId) {
        return cryptoWalletRepository.findById(walletId)
            .orElseThrow(() -> new RuntimeException("CryptoWallet no encontrado con id: " + walletId));
    }

    @Override
    public List<CryptoWallet> getCryptoWalletsByUserId(Long userId) {
        return cryptoWalletRepository.findByUserIdAndIsActiveTrue(userId);
    }

    @Override
    public CryptoWallet updateCryptoWallet(Long walletId, CryptoWallet wallet) {
        CryptoWallet existing = cryptoWalletRepository.findById(walletId)
            .orElseThrow(() -> new RuntimeException("CryptoWallet no encontrado con id: " + walletId));
        // Solo actualiza campos permitidos
        if (wallet.getAddress() != null) existing.setAddress(wallet.getAddress());
        if (wallet.getBalance() != null) existing.setBalance(wallet.getBalance());
        if (wallet.getPendingDeposits() != null) existing.setPendingDeposits(wallet.getPendingDeposits());
        if (wallet.getPendingWithdrawals() != null) existing.setPendingWithdrawals(wallet.getPendingWithdrawals());
        if (wallet.getTotalDeposited() != null) existing.setTotalDeposited(wallet.getTotalDeposited());
        if (wallet.getTotalWithdrawn() != null) existing.setTotalWithdrawn(wallet.getTotalWithdrawn());
        if (wallet.getIsActive() != null) existing.setIsActive(wallet.getIsActive());
        // No se actualiza userId ni cryptoType
        return cryptoWalletRepository.save(existing);
    }

    @Override
    public void deleteCryptoWallet(Long walletId) {
        if (!cryptoWalletRepository.existsById(walletId)) {
            throw new RuntimeException("CryptoWallet no encontrado con id: " + walletId);
        }
        cryptoWalletRepository.deleteById(walletId);
    }

    
}
