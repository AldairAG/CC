package com.example.cc.controller;

import com.example.cc.dto.admin.*;
import com.example.cc.entities.CryptoTransaction;
import com.example.cc.entities.Usuario;
import com.example.cc.service.admin.AdminService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cc/admin")
@RequiredArgsConstructor
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ========== DASHBOARD STATS ==========
    /**
     * Obtiene las estadísticas generales del dashboard administrativo
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        AdminStatsDto stats = adminService.getGeneralStats();
        return ResponseEntity.ok(stats);
    }

    // ========== GESTIÓN DE USUARIOS ==========
    /**
     * Obtiene todos los usuarios del sistema con información administrativa
     */
    @GetMapping("/usuarios")
    public ResponseEntity<List<AdminUserDto>> getAllUsers(@PageableDefault(size = 10, page = 0  ) Pageable pageable) {
        List<AdminUserDto> users = adminService.getAllUsers(pageable).getContent();
        return ResponseEntity.ok(users);
    }

    /**
     * Obtiene un usuario específico por ID
     */
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> getUserById(@PathVariable Long id) {
        Usuario user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Crea un nuevo usuario desde el panel administrativo
     */
    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> createUser(@RequestBody CreateUserRequestDto createRequest) {
        Usuario newUser = adminService.createUser(createRequest);
        return ResponseEntity.ok(newUser);
    }

    /**
     * Actualiza un usuario existente
     */
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequestDto updateRequest) {
        Usuario updatedUser = adminService.updateUser(id, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Activa/desactiva un usuario
     */
    @PatchMapping("/usuarios/{id}/toggle")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable Long id) {
        adminService.suspendUser(id,null);
        return ResponseEntity.ok().build();
    }

    /**
     * Elimina un usuario (eliminación física)
     */
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    // ========== GESTIÓN DE APUESTAS ==========
    /**
     * Obtiene todas las apuestas del sistema para administración
     */
    @GetMapping("/apuestas")
    public ResponseEntity<List<AdminBetDto>> getAllBets(@PageableDefault(size = 10, page = 0) Pageable pageable) {
        List<AdminBetDto> bets = adminService.getAllBets(pageable).getContent();
        return ResponseEntity.ok(bets);
    }

    /**
     * Actualiza el estado de una apuesta
     */
    @PatchMapping("/apuestas/{id}/estado")
    public ResponseEntity<AdminBetDto> updateBetStatus(@PathVariable Long id, @RequestBody UpdateBetStatusDto request) {
        AdminBetDto updatedBet = adminService.updateBetStatus(id, request);
        return ResponseEntity.ok(updatedBet);
    }

    /**
     * Cancela una apuesta
     */
    @PatchMapping("/apuestas/{id}/cancelar")
    public ResponseEntity<Void> cancelBet(@PathVariable Long id) {
        adminService.cancelBet(id,null);
        return ResponseEntity.ok().build();
    }

    // ========== GESTIÓN DE QUINIELAS ==========
    /**
     * Obtiene todas las quinielas para administración
     */
    @GetMapping("/quinielas")
    public ResponseEntity<List<AdminQuinielaDto>> getAllQuinielas(@PageableDefault(size = 10, page = 0) Pageable pageable) {
        List<AdminQuinielaDto> quinielas = adminService.getAllQuinielas(pageable).getContent();
        return ResponseEntity.ok(quinielas);
    }

    /**
     * Finaliza una quiniela
     */
    @PatchMapping("/quinielas/{id}/finalizar")
    public ResponseEntity<Void> finalizeQuiniela(@PathVariable Long id) {
        adminService.finalizeQuiniela(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Cancela una quiniela
     */
    @PatchMapping("/quinielas/{id}/cancelar")
    public ResponseEntity<Void> cancelQuiniela(@PathVariable Long id) {
        adminService.cancelQuiniela(id,null);
        return ResponseEntity.ok().build();
    }

    // ========== GESTIÓN DE EVENTOS ==========
    /**
     * Obtiene todos los eventos deportivos para administración
     */
    @GetMapping("/eventos")
    public ResponseEntity<List<AdminEventDto>> getAllEvents(@PageableDefault(size = 30, page = 0) Pageable pageable) {
        List<AdminEventDto> events = adminService.getAllEvents(pageable).getContent();
        return ResponseEntity.ok(events);
    }

    /**
     * Cancela un evento
     */
    @PatchMapping("/eventos/{id}/cancelar")
    public ResponseEntity<Void> cancelEvent(@PathVariable Long id) {
        adminService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    // ========== GESTIÓN DE NOTIFICACIONES ==========
    /**
     * Obtiene todas las notificaciones del sistema
     */
    @GetMapping("/notificaciones")
    public ResponseEntity<List<AdminNotificationDto>> getAllNotifications(@PageableDefault(size = 10, page = 0) Pageable pageable) {
        List<AdminNotificationDto> notifications = adminService.getAllNotifications(pageable).getContent();
        return ResponseEntity.ok(notifications);
    }

    /**
     * Crea una nueva notificación
     */
    @PostMapping("/notificaciones")
    public ResponseEntity<AdminNotificationDto> createNotification(@RequestBody CreateNotificationRequestDto createRequest) {
        AdminNotificationDto newNotification = adminService.createNotification(createRequest);
        return ResponseEntity.ok(newNotification);
    }

    /**
     * Elimina una notificación
     */
    @DeleteMapping("/notificaciones/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        adminService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    // ========== GESTIÓN DE CRYPTO ==========
    /**
     * Obtiene todas las transacciones de criptomonedas
     */
    @GetMapping("/crypto/transacciones")
    public ResponseEntity<List<CryptoTransaction>> getAllCryptoTransactions(@PageableDefault(size = 10, page = 0) Pageable pageable) {
        List<CryptoTransaction> transactions = adminService.getAllCryptoTransactions(pageable).getContent();
        return ResponseEntity.ok(transactions);
    }

    /**
     * Obtiene transacciones de crypto filtradas por estado
     */
    @GetMapping("/crypto/transacciones/estado/{estado}")
    public ResponseEntity<List<AdminCryptoDto>> getCryptoTransactionsByStatus(@PathVariable String estado) {
        List<AdminCryptoDto> transactions = adminService.getCryptoTransactionsByStatus(estado);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Aprueba una transacción de criptomoneda
     */
    @PatchMapping("/crypto/transacciones/{id}/aprobar")
    public ResponseEntity<CryptoTransaction> approveCryptoTransaction(@PathVariable Long id) {
        CryptoTransaction approvedTransaction = adminService.approveCryptoTransaction(id);
        return ResponseEntity.ok(approvedTransaction);
    }

    /**
     * Rechaza una transacción de criptomoneda
     */
    @PatchMapping("/crypto/transacciones/{id}/rechazar")
    public ResponseEntity<CryptoTransaction> rejectCryptoTransaction(@PathVariable Long id) {
        CryptoTransaction rejectedTransaction = adminService.rejectCryptoTransaction(id);
        return ResponseEntity.ok(rejectedTransaction);
    }

    // ========== REPORTES ==========

}
