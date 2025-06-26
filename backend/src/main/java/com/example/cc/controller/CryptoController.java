package com.example.cc.controller;

import com.example.cc.dto.crypto.*;
import com.example.cc.entities.CryptoTransaction;
import com.example.cc.service.CryptoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/crypto")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CryptoController {
    
    private final CryptoService cryptoService;
      @GetMapping("/networks")
    public ResponseEntity<List<Map<String, Object>>> getSupportedNetworks() {
        List<Map<String, Object>> networks = List.of(
            createNetworkMap("BTC", "Bitcoin", "BTC", 8, 3, 0.001, 10, 0.0005, 
                           "https://bitcoin-mainnet.rpc.com", "https://blockstream.info/tx/"),
            createNetworkMap("ETH", "Ethereum", "ETH", 18, 12, 0.01, 100, 0.005,
                           "https://ethereum-mainnet.rpc.com", "https://etherscan.io/tx/"),
            createNetworkMap("SOL", "Solana", "SOL", 9, 1, 0.1, 1000, 0.01,
                           "https://api.mainnet-beta.solana.com", "https://solscan.io/tx/")
        );
        
        return ResponseEntity.ok(networks);
    }
    
    private Map<String, Object> createNetworkMap(String type, String name, String symbol, 
                                               int decimals, int confirmations, double minDeposit, 
                                               int maxDeposit, double withdrawalFee, 
                                               String rpcUrl, String explorerUrl) {
        return Map.of(
            "type", type,
            "name", name,
            "symbol", symbol,
            "decimals", decimals,
            "confirmationsRequired", confirmations,
            "minDeposit", minDeposit,
            "maxDeposit", maxDeposit,
            "withdrawalFee", withdrawalFee,
            "isActive", true,
            "rpcUrl", rpcUrl
        );
    }
    
    @GetMapping("/rates")
    public ResponseEntity<List<Map<String, Object>>> getExchangeRates() {
        List<Map<String, Object>> rates = List.of(
            Map.of(
                "currency", "BTC",
                "usdPrice", 45000,
                "changePercent24h", 2.5,
                "lastUpdated", java.time.LocalDateTime.now().toString()
            ),
            Map.of(
                "currency", "ETH",
                "usdPrice", 3200,
                "changePercent24h", -1.2,
                "lastUpdated", java.time.LocalDateTime.now().toString()
            ),
            Map.of(
                "currency", "SOL",
                "usdPrice", 180,
                "changePercent24h", 5.8,
                "lastUpdated", java.time.LocalDateTime.now().toString()
            )
        );
        
        return ResponseEntity.ok(rates);
    }
    
    @GetMapping("/balances")
    public ResponseEntity<List<CryptoBalanceDTO>> getCryptoBalances(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<CryptoBalanceDTO> balances = cryptoService.getUserCryptoBalances(userId);
        return ResponseEntity.ok(balances);
    }
    
    @PostMapping("/deposit-address")
    public ResponseEntity<?> generateDepositAddress(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            String cryptoTypeStr = request.get("cryptoType");
            CryptoTransaction.CryptoType cryptoType = CryptoTransaction.CryptoType.valueOf(cryptoTypeStr);
            
            CryptoDepositAddressDTO address = cryptoService.generateDepositAddress(userId, cryptoType);
            return ResponseEntity.ok(address);
        } catch (Exception e) {
            log.error("Error generating deposit address", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/deposit")
    public ResponseEntity<?> createDeposit(
            @Valid @RequestBody CryptoDepositRequestDTO request,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuthentication(authentication);
            CryptoTransactionDTO transaction = cryptoService.createDeposit(userId, request);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Error creating deposit", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/transactions")
    public ResponseEntity<List<CryptoTransactionDTO>> getTransactionHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        Pageable pageable = PageRequest.of(page, size);
        List<CryptoTransactionDTO> transactions = cryptoService.getUserTransactionHistory(userId, pageable);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/transactions/{id}")
    public ResponseEntity<?> getTransactionDetails(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        Optional<CryptoTransactionDTO> transaction = cryptoService.getTransactionDetails(userId, id);
        
        if (transaction.isPresent()) {
            return ResponseEntity.ok(transaction.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/fees/{cryptoType}")
    public ResponseEntity<Map<String, Object>> getNetworkFees(@PathVariable String cryptoType) {
        Map<String, Object> fees = switch (cryptoType.toUpperCase()) {
            case "BTC" -> Map.of(
                "network", "BTC",
                "slow", 0.0001,
                "standard", 0.0005,
                "fast", 0.001
            );
            case "ETH" -> Map.of(
                "network", "ETH",
                "slow", 0.002,
                "standard", 0.005,
                "fast", 0.01
            );
            case "SOL" -> Map.of(
                "network", "SOL",
                "slow", 0.005,
                "standard", 0.01,
                "fast", 0.02
            );
            default -> Map.of("error", "Unsupported crypto type");
        };
        
        return ResponseEntity.ok(fees);
    }
    
    @PostMapping("/validate-address")
    public ResponseEntity<Map<String, Boolean>> validateAddress(@RequestBody Map<String, String> request) {
        String address = request.get("address");
        String cryptoTypeStr = request.get("cryptoType");
        
        boolean isValid = switch (cryptoTypeStr.toUpperCase()) {
            case "BTC" -> address.matches("^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$");
            case "ETH" -> address.matches("^0x[a-fA-F0-9]{40}$");
            case "SOL" -> address.matches("^[1-9A-HJ-NP-Za-km-z]{32,44}$");
            default -> false;
        };
        
        return ResponseEntity.ok(Map.of("isValid", isValid));
    }
    
    // Método para extraer userId del token JWT
    private Long getUserIdFromAuthentication(Authentication authentication) {
        // Aquí deberías implementar la lógica para extraer el userId del token JWT
        // Por ahora retorno un valor mock
        return 1L; // Cambiar por la implementación real
    }
}
