package com.example.cc.controller;

import com.example.cc.dto.crypto.*;
import com.example.cc.service.CryptoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@CrossOrigin(origins = "*")
public class CryptoController {
    
    private final CryptoService cryptoService;
    
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
                e.getMessage()
            ));
        }
    }
    
    /**
     * Crear depósito de criptomoneda
     */
    @PostMapping("/deposit")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<CryptoTransactionDTO> createDeposit(
            @Valid @RequestBody CryptoDepositRequestDTO request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            CryptoTransactionDTO transaction = cryptoService.createDeposit(userId, request);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error creating crypto deposit", e);
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
