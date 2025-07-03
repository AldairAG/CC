package com.example.cc.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.cc.service.wallet.WalletService;

import java.math.BigDecimal;

@RestController
@RequestMapping("/cc/wallet")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WalletController {

    private final WalletService walletService;

    /**
     * Obtener saldo del usuario
     */
    @GetMapping("/saldo/{usuarioId}")
    public ResponseEntity<BigDecimal> obtenerSaldo(@PathVariable Long usuarioId) {
        try {
            BigDecimal saldo = walletService.obtenerSaldo(usuarioId);
            return ResponseEntity.ok(saldo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Realizar depósito
     */
    @PostMapping("/deposito")
    public ResponseEntity<Void> realizarDeposito(@RequestParam Long usuarioId,
                                               @RequestParam BigDecimal monto,
                                               @RequestParam String metodoPago,
                                               @RequestParam String referenciaExterna) {
        try {
            // Aquí deberías validar el usuario actual
            walletService.procesarDeposito(
                    // Necesitas obtener el usuario por ID
                    null, // Usuario usuario = usuarioService.obtenerPorId(usuarioId);
                    monto,
                    metodoPago,
                    referenciaExterna
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Realizar retiro
     */
    @PostMapping("/retiro")
    public ResponseEntity<Void> realizarRetiro(@RequestParam Long usuarioId,
                                             @RequestParam BigDecimal monto,
                                             @RequestParam String metodoPago) {
        try {
            // Aquí deberías validar el usuario actual
            walletService.procesarRetiro(
                    // Usuario usuario = usuarioService.obtenerPorId(usuarioId);
                    null,
                    monto,
                    metodoPago
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
