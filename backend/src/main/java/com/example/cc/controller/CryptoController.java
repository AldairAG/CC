package com.example.cc.controller;

import com.example.cc.dto.crypto.*;
import com.example.cc.entities.CryptoWallet;
import com.example.cc.service.crypto.CryptoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/cc/crypto")
@RequiredArgsConstructor
@Slf4j
public class CryptoController {

    private final CryptoService cryptoService;

    // ===== ENDPOINTS EXISTENTES =====

    /**
     * Obtener balances de criptomonedas del usuario
     */
    @GetMapping("/balances")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<CryptoBalanceDTO>> getCryptoBalances(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            List<CryptoBalanceDTO> balances = cryptoService.getUserCryptoBalances(userId);
            return ResponseEntity.ok(balances);
        } catch (Exception e) {
            log.error("Error getting crypto balances", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Convertir criptomonedas a saldo fiat
     */
    @PostMapping("/convert-to-fiat")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<CryptoToFiatConversionResponseDTO> convertCryptoToFiat(
            @Valid @RequestBody CryptoToFiatConversionRequestDTO request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            CryptoToFiatConversionResponseDTO response = cryptoService.convertCryptoToFiat(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error converting crypto to fiat", e);
            return ResponseEntity.badRequest().body(new CryptoToFiatConversionResponseDTO(
                    null,
                    request.getCryptoType().toString(),
                    request.getAmount(),
                    null,
                    null,
                    null,
                    "FAILED",
                    e.getMessage()));
        }
    }

    /**
     * Crear depósito de criptomoneda (automático)
     */
    @PostMapping("/deposit/{userId}")
    public ResponseEntity<CryptoTransactionDTO> createDeposit(
            @RequestBody CryptoDepositRequestDTO request,
            @PathVariable Long userId) {
        try {
            CryptoTransactionDTO transaction = cryptoService.createDeposit(userId, request);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error creating crypto deposit", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Crear depósito automático con verificación externa
     */
    @PostMapping("/deposit/automatic")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<CryptoTransactionDTO> createAutomaticDeposit(
            @Valid @RequestBody CryptoDepositRequestDTO request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            CryptoTransactionDTO transaction = cryptoService.createAutomaticDeposit(userId, request);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error creating automatic crypto deposit", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Crear retiro automático
     */
    @PostMapping("/withdraw/automatic")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<CryptoTransactionDTO> createAutomaticWithdrawal(
            @Valid @RequestBody CryptoManualWithdrawalRequestDTO request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            CryptoTransactionDTO transaction = cryptoService.createAutomaticWithdrawal(
                    userId, request.getToAddress(), request.getAmount(), request.getCryptoType());
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error creating automatic crypto withdrawal", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Procesar confirmación de transacción (webhook interno)
     */
    @PostMapping("/process-confirmation")
    public ResponseEntity<Void> processConfirmation(
            @RequestParam String txHash,
            @RequestParam int confirmations) {
        try {
            cryptoService.processConfirmation(txHash, confirmations);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error processing confirmation", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener transacciones de criptomonedas del usuario
     */
    @GetMapping("/transactions")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<CryptoTransactionDTO>> getCryptoTransactions(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            List<CryptoTransactionDTO> transactions = cryptoService.getUserCryptoTransactions(userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            log.error("Error getting crypto transactions", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== ENDPOINTS PARA GESTIÓN DE WALLETS (CRUD) =====

    /**
     * Crear nueva wallet de criptomoneda
     */
    @PostMapping("/wallets/{userId}")
    public ResponseEntity<CryptoWalletDTO> createCryptoWallet(
            @Valid @RequestBody CryptoWalletCreateRequestDTO request,
            @PathVariable Long userId) {
        try {
            CryptoWallet wallet = cryptoService.convertFromWalletDTO(request, userId);
            CryptoWallet createdWallet = cryptoService.createCryptoWallet(wallet);
            return ResponseEntity.ok(cryptoService.convertToWalletDTO(createdWallet));
        } catch (Exception e) {
            log.error("Error creating crypto wallet", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener wallets del usuario
     */
    @GetMapping("/wallets")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<CryptoWalletDTO>> getUserWallets(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            List<CryptoWallet> wallets = cryptoService.getCryptoWalletsByUserId(userId);
            List<CryptoWalletDTO> walletDTOs = wallets.stream()
                    .map(cryptoService::convertToWalletDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(walletDTOs);
        } catch (Exception e) {
            log.error("Error getting user crypto wallets", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener wallet por ID
     */
    @GetMapping("/wallets/{walletId}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<CryptoWalletDTO> getCryptoWallet(@PathVariable Long walletId, Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            CryptoWallet wallet = cryptoService.getCryptoWalletById(walletId);

            // Verificar que la wallet pertenece al usuario
            if (!wallet.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(cryptoService.convertToWalletDTO(wallet));
        } catch (Exception e) {
            log.error("Error getting crypto wallet", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar wallet
     */
    @PutMapping("/wallets/{walletId}/{userId}")
    public ResponseEntity<CryptoWalletDTO> updateCryptoWallet(
            @PathVariable Long walletId,
            @PathVariable Long userId,
            @Valid @RequestBody CryptoWalletCreateRequestDTO request,
            Authentication authentication) {
        try {
            CryptoWallet updateWallet = cryptoService.convertFromWalletDTO(request, userId);
            CryptoWallet updatedWallet = cryptoService.updateCryptoWallet(walletId, updateWallet);
            return ResponseEntity.ok(cryptoService.convertToWalletDTO(updatedWallet));
        } catch (Exception e) {
            log.error("Error updating crypto wallet", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Eliminar wallet
     */
    @DeleteMapping("/wallets/{walletId}")
    public ResponseEntity<Void> deleteCryptoWallet(@PathVariable Long walletId, Authentication authentication) {
        try {
            cryptoService.deleteCryptoWallet(walletId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting crypto wallet", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== ENDPOINTS PARA OPERACIONES MANUALES =====

    /**
     * Crear solicitud de depósito manual
     */
    @PostMapping("/deposit/manual/{userId}")
    public ResponseEntity<CryptoTransactionDTO> createManualDepositRequest(
            @Valid @RequestBody CryptoManualDepositRequestDTO request,
            @PathVariable Long userId) {
        try {
            CryptoTransactionDTO transaction = cryptoService.createManualDepositRequest(userId, request);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error creating manual deposit request", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Crear solicitud de retiro manual
     */
    @PostMapping("/withdraw/manual")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<CryptoTransactionDTO> createManualWithdrawalRequest(
            @Valid @RequestBody CryptoManualWithdrawalRequestDTO request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            CryptoTransactionDTO transaction = cryptoService.createManualWithdrawalRequest(userId, request);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error creating manual withdrawal request", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== ENDPOINTS PARA ADMINISTRADORES =====

    /**
     * Obtener transacciones pendientes de aprobación manual
     */
    @GetMapping("/admin/pending-transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CryptoTransactionDTO>> getPendingManualTransactions() {
        try {
            List<CryptoTransactionDTO> transactions = cryptoService.getPendingManualTransactions();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            log.error("Error getting pending manual transactions", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Aprobar o rechazar transacción manual
     */
    @PostMapping("/admin/approve-transaction")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CryptoTransactionDTO> approveManualTransaction(
            @Valid @RequestBody CryptoAdminApprovalRequestDTO request) {
        try {
            CryptoTransactionDTO transaction = cryptoService.approveManualTransaction(request.getTransactionId(),
                    request);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error approving manual transaction", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener todas las wallets (solo admin)
     */
    @GetMapping("/admin/wallets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CryptoWalletDTO>> getAllWallets() {
        try {
            // Implementar método para obtener todas las wallets
            return ResponseEntity.ok(java.util.Collections.emptyList());
        } catch (Exception e) {
            log.error("Error getting all crypto wallets", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Extrae el ID del usuario desde el authentication token
     */
    private Long getUserIdFromAuthentication(Authentication authentication) {
        try {
            return Long.parseLong(authentication.getName());
        } catch (NumberFormatException e) {
            log.error("Error parsing user ID from authentication", e);
            throw new RuntimeException("Invalid user authentication");
        }
    }
}
