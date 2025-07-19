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
            case BTC:
                apiId = "bitcoin";
                break;
            case ETH:
                apiId = "ethereum";
                break;
            case SOL:
                apiId = "solana";
                break;
            case TRC20:
                apiId = "tron";
                break;
            default:
                apiId = null;
        }
        if (apiId == null)
            return BigDecimal.ZERO;

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

            Map<String, BigDecimal> json = new ObjectMapper().readValue(content.toString(),
                    new TypeReference<Map<String, BigDecimal>>() {
                    });
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
            CryptoTransaction.CryptoType.SOL, 1,
            CryptoTransaction.CryptoType.TRC20, 19);

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
    public CryptoToFiatConversionResponseDTO convertCryptoToFiat(Long userId,
            CryptoToFiatConversionRequestDTO request) {
        try {
            // Verificar que el usuario existe
            Usuario usuario = usuarioRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Obtener wallet del usuario para la criptomoneda
            CryptoWallet wallet = cryptoWalletRepository
                    .findByUserIdAndCryptoTypeAndIsActiveTrue(userId, request.getCryptoType())
                    .orElseThrow(() -> new RuntimeException("Wallet de " + request.getCryptoType() + " no encontrado"));

            // Verificar balance suficiente
            if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
                throw new RuntimeException(
                        "Balance insuficiente. Disponible: " + wallet.getBalance() + " " + request.getCryptoType());
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
            transaccionFiat
                    .setDescripcion("Conversión de " + request.getAmount() + " " + request.getCryptoType() + " a USD");
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
                    "Conversión completada exitosamente");

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
        //BigDecimal price = getCryptoPriceFromApi(cryptoType);
        BigDecimal price = new BigDecimal("118261.90");
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
            case TRC20:
                return address.startsWith("T") && address.length() == 34;
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
            case TRC20:
                return "TLsV52sRDL79HXGKw8bHKyirsqfpZmF6hL";
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
            String toAddress, BigDecimal amount, CryptoTransaction.CryptoType cryptoType,
            CryptoTransaction.TransactionType transactionType) {
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
        transaction.setStatus(transferenciaExitosa ? CryptoTransaction.TransactionStatus.COMPLETED
                : CryptoTransaction.TransactionStatus.FAILED);
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

        log.info("Transferencia {}: {} -> {} | Monto: {} {} | Hash: {}", transferenciaExitosa ? "exitosa" : "fallida",
                fromAddress, toAddress, amount, cryptoType, txHash);

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

                log.info("Confirmed withdrawal transaction: {} for user: {}", transaction.getId(),
                        transaction.getUserId());
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
        wallet.setPendingWithdrawals(
                wallet.getPendingWithdrawals() != null ? wallet.getPendingWithdrawals() : BigDecimal.ZERO);
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
        if (wallet.getAddress() != null)
            existing.setAddress(wallet.getAddress());
        if (wallet.getBalance() != null)
            existing.setBalance(wallet.getBalance());
        if (wallet.getPendingDeposits() != null)
            existing.setPendingDeposits(wallet.getPendingDeposits());
        if (wallet.getPendingWithdrawals() != null)
            existing.setPendingWithdrawals(wallet.getPendingWithdrawals());
        if (wallet.getTotalDeposited() != null)
            existing.setTotalDeposited(wallet.getTotalDeposited());
        if (wallet.getTotalWithdrawn() != null)
            existing.setTotalWithdrawn(wallet.getTotalWithdrawn());
        if (wallet.getIsActive() != null)
            existing.setIsActive(wallet.getIsActive());
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

    // ===== OPERACIONES MANUALES =====

    @Override
    @Transactional
    public CryptoTransactionDTO createManualDepositRequest(Long userId, CryptoManualDepositRequestDTO request) {
        try {
            // Verificar que el usuario existe
            Optional<Usuario> user=usuarioRepository.findById(userId);
            if(!user.isPresent()){
                throw new RuntimeException("Usuario no encontrado");
            }


            // Crear transacción de solicitud manual
            CryptoTransaction transaction = new CryptoTransaction();
            transaction.setUserId(userId);
            transaction.setType(CryptoTransaction.TransactionType.MANUAL_DEPOSIT_REQUEST);
            transaction.setCryptoType(request.getCryptoType());
            transaction.setAmount(request.getAmount());
            transaction.setUsdAmount(calculateUsdAmount(request.getAmount(), request.getCryptoType()));
            transaction.setFromAddress(request.getFromAddress());
            transaction.setToAddress(generateMockAddress(request.getCryptoType()));
            transaction.setTxHash(request.getTxHash());
            transaction.setStatus(CryptoTransaction.TransactionStatus.PENDING_ADMIN_APPROVAL);
            transaction.setNotes(request.getNotes());
            transaction.setUsuarioNombre(user.get().getPerfil().getUsername());
            transaction.setFechaCreacion(LocalDateTime.now());

            transaction = cryptoTransactionRepository.save(transaction);

            log.info("Solicitud de depósito manual creada: {} para usuario: {}", transaction.getId(), userId);

            return convertToTransactionDTO(transaction);

        } catch (Exception e) {
            log.error("Error creando solicitud de depósito manual para usuario {}: {}", userId, e.getMessage());
            throw new RuntimeException("Error en la solicitud de depósito manual: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public CryptoTransactionDTO createManualWithdrawalRequest(Long userId, CryptoManualWithdrawalRequestDTO request) {
        try {
            // Verificar que el usuario existe
            if (!usuarioRepository.existsById(userId)) {
                throw new RuntimeException("Usuario no encontrado");
            }

            // Obtener wallet del usuario
            CryptoWallet wallet = cryptoWalletRepository
                    .findByUserIdAndCryptoTypeAndIsActiveTrue(userId, request.getCryptoType())
                    .orElseThrow(() -> new RuntimeException("Wallet de " + request.getCryptoType() + " no encontrado"));

            // Verificar balance suficiente
            if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
                throw new RuntimeException(
                        "Balance insuficiente. Disponible: " + wallet.getBalance() + " " + request.getCryptoType());
            }

            // Crear transacción de solicitud manual
            CryptoTransaction transaction = new CryptoTransaction();
            transaction.setUserId(userId);
            transaction.setType(CryptoTransaction.TransactionType.MANUAL_WITHDRAWAL_REQUEST);
            transaction.setCryptoType(request.getCryptoType());
            transaction.setAmount(request.getAmount());
            transaction.setUsdAmount(calculateUsdAmount(request.getAmount(), request.getCryptoType()));
            transaction.setFromAddress(wallet.getAddress());
            transaction.setToAddress(request.getToAddress());
            transaction.setStatus(CryptoTransaction.TransactionStatus.PENDING_ADMIN_APPROVAL);
            transaction.setNotes(request.getNotes());

            transaction = cryptoTransactionRepository.save(transaction);

            // Reservar fondos en retiros pendientes
            wallet.subtractFromBalance(request.getAmount());
            wallet.addToPendingWithdrawals(request.getAmount());
            cryptoWalletRepository.save(wallet);

            log.info("Solicitud de retiro manual creada: {} para usuario: {}", transaction.getId(), userId);

            return convertToTransactionDTO(transaction);

        } catch (Exception e) {
            log.error("Error creando solicitud de retiro manual para usuario {}: {}", userId, e.getMessage());
            throw new RuntimeException("Error en la solicitud de retiro manual: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public CryptoTransactionDTO approveManualTransaction(Long transactionId, CryptoAdminApprovalRequestDTO request) {
        try {
            CryptoTransaction transaction = cryptoTransactionRepository.findById(transactionId)
                    .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

            if (transaction.getStatus() != CryptoTransaction.TransactionStatus.PENDING_ADMIN_APPROVAL) {
                throw new RuntimeException("La transacción no está pendiente de aprobación");
            }

            if (request.getApproved()) {
                // Aprobar transacción
                transaction.setStatus(CryptoTransaction.TransactionStatus.APPROVED);
                transaction.setCompletedAt(LocalDateTime.now());
                transaction.setNotes((transaction.getNotes() != null ? transaction.getNotes() + " | " : "")
                        + "Aprobado por admin: " + request.getAdminNotes());

                if (transaction.getType() == CryptoTransaction.TransactionType.MANUAL_DEPOSIT_REQUEST) {
                    // Procesar depósito manual
                    CryptoWallet wallet = getOrCreateWallet(transaction.getUserId(), transaction.getCryptoType());
                    wallet.addToBalance(transaction.getAmount());
                    cryptoWalletRepository.save(wallet);

                } else if (transaction.getType() == CryptoTransaction.TransactionType.MANUAL_WITHDRAWAL_REQUEST) {
                    // Procesar retiro manual - los fondos ya están en pending withdrawals
                    CryptoWallet wallet = getOrCreateWallet(transaction.getUserId(), transaction.getCryptoType());
                    wallet.subtractFromPendingWithdrawals(transaction.getAmount());
                    wallet.addToTotalWithdrawn(transaction.getAmount());
                    cryptoWalletRepository.save(wallet);
                }

                log.info("Transacción manual aprobada: {} para usuario: {}", transactionId, transaction.getUserId());

            } else {
                // Rechazar transacción
                transaction.setStatus(CryptoTransaction.TransactionStatus.REJECTED);
                transaction.setNotes((transaction.getNotes() != null ? transaction.getNotes() + " | " : "")
                        + "Rechazado por admin: " + request.getAdminNotes());

                if (transaction.getType() == CryptoTransaction.TransactionType.MANUAL_WITHDRAWAL_REQUEST) {
                    // Restaurar fondos si era un retiro
                    CryptoWallet wallet = getOrCreateWallet(transaction.getUserId(), transaction.getCryptoType());
                    wallet.addToBalance(transaction.getAmount());
                    wallet.subtractFromPendingWithdrawals(transaction.getAmount());
                    cryptoWalletRepository.save(wallet);
                }

                log.info("Transacción manual rechazada: {} para usuario: {}", transactionId, transaction.getUserId());
            }

            transaction = cryptoTransactionRepository.save(transaction);
            return convertToTransactionDTO(transaction);

        } catch (Exception e) {
            log.error("Error aprobando transacción manual {}: {}", transactionId, e.getMessage());
            throw new RuntimeException("Error en la aprobación: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CryptoTransactionDTO> getPendingManualTransactions() {
        List<CryptoTransaction> transactions = cryptoTransactionRepository.findByStatusOrderByCreatedAtDesc(
                CryptoTransaction.TransactionStatus.PENDING_ADMIN_APPROVAL);

        return transactions.stream()
                .map(this::convertToTransactionDTO)
                .collect(Collectors.toList());
    }

    // ===== OPERACIONES AUTOMÁTICAS =====

    @Override
    @Transactional
    public CryptoTransactionDTO createAutomaticDeposit(Long userId, CryptoDepositRequestDTO request) {
        try {
            // Verificar transacción con API externa
            if (request.getTxHash() != null
                    && !verifyTransactionWithExternalApi(request.getTxHash(), request.getCryptoType())) {
                throw new RuntimeException("Transacción no verificada en la blockchain");
            }

            // Crear depósito automático
            CryptoTransactionDTO transaction = createDeposit(userId, request);

            // Si la verificación es exitosa, marcar como confirmada automáticamente
            if (request.getTxHash() != null) {
                processConfirmation(transaction.getTxHash(), requiredConfirmations.get(request.getCryptoType()));
            }

            return transaction;

        } catch (Exception e) {
            log.error("Error en depósito automático para usuario {}: {}", userId, e.getMessage());
            throw new RuntimeException("Error en el depósito automático: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public CryptoTransactionDTO createAutomaticWithdrawal(Long userId, String toAddress, BigDecimal amount,
            CryptoTransaction.CryptoType cryptoType) {
        try {
            // Crear retiro usando el método existente
            CryptoTransactionDTO transaction = createWithdrawal(userId, toAddress, amount, cryptoType);

            // Simular ejecución automática en la blockchain
            boolean executionSuccess = executeWithdrawalOnBlockchain(transaction.getTxHash(), cryptoType);

            if (executionSuccess) {
                // Procesar confirmación automática
                processWithdrawalConfirmation(transaction.getTxHash(), requiredConfirmations.get(cryptoType));
                log.info("Retiro automático ejecutado exitosamente: {}", transaction.getId());
            } else {
                // Marcar como fallida
                CryptoTransaction tx = cryptoTransactionRepository.findByTxHash(transaction.getTxHash())
                        .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
                tx.setStatus(CryptoTransaction.TransactionStatus.FAILED);
                cryptoTransactionRepository.save(tx);
                throw new RuntimeException("Fallo en la ejecución del retiro automático");
            }

            return transaction;

        } catch (Exception e) {
            log.error("Error en retiro automático para usuario {}: {}", userId, e.getMessage());
            throw new RuntimeException("Error en el retiro automático: " + e.getMessage());
        }
    }

    @Override
    public boolean verifyTransactionWithExternalApi(String txHash, CryptoTransaction.CryptoType cryptoType) {
        // Simulación de verificación con API externa
        // En producción, aquí iría la integración real con APIs de blockchain
        try {
            switch (cryptoType) {
                case BTC:
                    return verifyBitcoinTransaction(txHash);
                case ETH:
                    return verifyEthereumTransaction(txHash);
                case SOL:
                    return verifySolanaTransaction(txHash);
                case TRC20:
                    return verifyTronTransaction(txHash);
                default:
                    return false;
            }
        } catch (Exception e) {
            log.error("Error verificando transacción {} en {}: {}", txHash, cryptoType, e.getMessage());
            return false;
        }
    }

    // ===== MÉTODOS DE CONVERSIÓN =====

    @Override
    public CryptoWalletDTO convertToWalletDTO(CryptoWallet wallet) {
        CryptoWalletDTO dto = new CryptoWalletDTO();
        dto.setId(wallet.getId());
        dto.setUserId(wallet.getUserId());
        dto.setCryptoType(wallet.getCryptoType());
        dto.setAddress(wallet.getAddress());
        dto.setBalance(wallet.getBalance());
        dto.setPendingDeposits(wallet.getPendingDeposits());
        dto.setPendingWithdrawals(wallet.getPendingWithdrawals());
        dto.setTotalDeposited(wallet.getTotalDeposited());
        dto.setTotalWithdrawn(wallet.getTotalWithdrawn());
        dto.setIsActive(wallet.getIsActive());
        dto.setCreatedAt(wallet.getCreatedAt());
        dto.setUpdatedAt(wallet.getUpdatedAt());
        return dto;
    }

    @Override
    public CryptoWallet convertFromWalletDTO(CryptoWalletCreateRequestDTO dto, Long userId) {
        CryptoWallet wallet = new CryptoWallet();
        wallet.setUserId(userId);
        wallet.setCryptoType(dto.getCryptoType());
        wallet.setAddress(dto.getAddress());
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setPendingDeposits(BigDecimal.ZERO);
        wallet.setPendingWithdrawals(BigDecimal.ZERO);
        wallet.setTotalDeposited(BigDecimal.ZERO);
        wallet.setTotalWithdrawn(BigDecimal.ZERO);
        wallet.setIsActive(true);
        return wallet;
    }

    // ===== MÉTODOS DE UTILIDAD PRIVADOS =====

    private boolean executeWithdrawalOnBlockchain(String txHash, CryptoTransaction.CryptoType cryptoType) {
        // Simulación de ejecución en blockchain
        // En producción, aquí iría la integración real con APIs de blockchain
        try {
            Thread.sleep(1000); // Simular tiempo de procesamiento
            return Math.random() > 0.1; // 90% de éxito
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }

    private boolean verifyBitcoinTransaction(String txHash) {
        // Simulación - en producción usar API como BlockCypher, Blockchain.info, etc.
        return txHash != null && txHash.length() == 64;
    }

    private boolean verifyEthereumTransaction(String txHash) {
        // Simulación - en producción usar API como Etherscan, Infura, etc.
        return txHash != null && txHash.startsWith("0x") && txHash.length() == 66;
    }

    private boolean verifySolanaTransaction(String txHash) {
        // Simulación - en producción usar API de Solana
        return txHash != null && txHash.length() >= 80;
    }

    private boolean verifyTronTransaction(String txHash) {
        // Simulación - en producción usar API de Tron
        return txHash != null && txHash.length() == 64;
    }

}
