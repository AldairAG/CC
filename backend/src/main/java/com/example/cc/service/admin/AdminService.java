package com.example.cc.service.admin;

import com.example.cc.dto.admin.*;
import com.example.cc.entities.CryptoTransaction;
import com.example.cc.entities.Usuario;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AdminService {
    
    // Estadísticas generales
    AdminStatsDto getGeneralStats();
    Map<String, Object> getDashboardData();
    
    // Gestión de usuarios
    Page<AdminUserDto> getAllUsers(Pageable pageable);
    Usuario getUserById(Long id);
    Usuario createUser(CreateUserRequestDto request);
    Usuario updateUser(Long id, UpdateUserRequestDto request);
    void deleteUser(Long id);
    void suspendUser(Long id, String motivo);
    void reactivateUser(Long id);
    List<Usuario> getUsersByRole(String role);
    List<Usuario> getUsersByStatus(String status);
    
    // Gestión de apuestas
    Page<AdminBetDto> getAllBets(Pageable pageable);
    AdminBetDto getBetById(Long id);
    AdminBetDto updateBetStatus(Long id, UpdateBetStatusDto request);
    void cancelBet(Long id, String motivo);
    List<AdminBetDto> getBetsByUser(Long userId);
    List<AdminBetDto> getBetsByEvent(Long eventId);
    List<AdminBetDto> getBetsByDateRange(LocalDateTime start, LocalDateTime end);
    BigDecimal getTotalBetsAmount();
    Map<String, Object> getBetsStatistics();

    // Gestión de quinielas
    Page<AdminQuinielaDto> getAllQuinielas(Pageable pageable);
    AdminQuinielaDto getQuinielaById(Long id);
    AdminQuinielaDto createQuiniela(CreateQuinielaRequestDto request);
    AdminQuinielaDto updateQuiniela(Long id, CreateQuinielaRequestDto request);
    void deleteQuiniela(Long id);
    void finalizeQuiniela(Long id);
    void cancelQuiniela(Long id, String motivo);
    List<AdminQuinielaDto> getQuinielasByStatus(String status);
    List<AdminQuinielaDto> getQuinielasByCreator(Long creatorId);
    Map<String, Object> getQuinielasStatistics();
    
    // Gestión de eventos
    Page<AdminEventDto> getAllEvents(Pageable pageable);
    AdminEventDto getEventById(Long id);
    AdminEventDto createEvent(CreateEventRequestDto request);
    AdminEventDto updateEvent(Long id, CreateEventRequestDto request);
    void deleteEvent(Long id);
    AdminEventDto updateEventResult(Long id, String result, Integer golesLocal, Integer golesVisitante);
    List<AdminEventDto> getEventsByLeague(String league);
    List<AdminEventDto> getEventsByStatus(String status);
    List<AdminEventDto> getEventsByDateRange(LocalDateTime start, LocalDateTime end);
    Map<String, Object> getEventsStatistics();
    
    // Gestión de notificaciones
    Page<AdminNotificationDto> getAllNotifications(Pageable pageable);
    AdminNotificationDto getNotificationById(Long id);
    AdminNotificationDto createNotification(CreateNotificationRequestDto request);
    AdminNotificationDto updateNotification(Long id, CreateNotificationRequestDto request);
    void deleteNotification(Long id);
    void sendNotification(Long id);
    List<AdminNotificationDto> getNotificationsByType(String type);
    List<AdminNotificationDto> getNotificationsByStatus(String status);
    Map<String, Object> getNotificationsStatistics();
    
    // Gestión de roles
    Page<AdminRoleDto> getAllRoles(Pageable pageable);
    AdminRoleDto getRoleById(Long id);
    AdminRoleDto createRole(CreateRoleRequestDto request);
    AdminRoleDto updateRole(Long id, CreateRoleRequestDto request);
    void deleteRole(Long id);
    List<AdminRoleDto> getRolesByCategory(String category);
    void assignRoleToUser(Long userId, Long roleId);
    void removeRoleFromUser(Long userId, Long roleId);
    
    // Gestión de configuración
    Page<AdminConfigDto> getAllConfigs(Pageable pageable);
    AdminConfigDto getConfigById(Long id);
    AdminConfigDto getConfigByKey(String key);
    AdminConfigDto updateConfig(UpdateConfigRequestDto request);
    List<AdminConfigDto> getConfigsByCategory(String category);
    Map<String, AdminConfigDto> getConfigsByModule(String module);
    void resetConfigToDefault(Long id);
    
    // Gestión de criptomondas
    Page<CryptoTransaction> getAllCryptoTransactions(Pageable pageable);
    AdminCryptoDto getCryptoTransactionById(Long id);
    AdminCryptoDto updateCryptoTransactionStatus(Long id, String status, String motivo);
    List<AdminCryptoDto> getCryptoTransactionsByUser(Long userId);
    List<AdminCryptoDto> getCryptoTransactionsByType(String type);
    List<AdminCryptoDto> getCryptoTransactionsByStatus(String status);
    List<AdminCryptoDto> getCryptoTransactionsByCurrency(String currency);
    Map<String, Object> getCryptoStatistics();
    CryptoTransaction approveCryptoTransaction(Long id);
    CryptoTransaction rejectCryptoTransaction(Long id);
    
    // Reportes y analytics
    Map<String, Object> getUsersReport(LocalDateTime start, LocalDateTime end);
    Map<String, Object> getBetsReport(LocalDateTime start, LocalDateTime end);
    Map<String, Object> getFinancialReport(LocalDateTime start, LocalDateTime end);
    Map<String, Object> getQuinielasReport(LocalDateTime start, LocalDateTime end);
    Map<String, Object> getCryptoReport(LocalDateTime start, LocalDateTime end);
    
    // Exportación de datos
    byte[] exportUsers(String format); // CSV, EXCEL, PDF
    byte[] exportBets(String format, LocalDateTime start, LocalDateTime end);
    byte[] exportQuinielas(String format, LocalDateTime start, LocalDateTime end);
    byte[] exportCryptoTransactions(String format, LocalDateTime start, LocalDateTime end);
    
    // Auditoría y logs
    Page<Map<String, Object>> getAuditLogs(Pageable pageable);
    List<Map<String, Object>> getAuditLogsByUser(Long userId);
    List<Map<String, Object>> getAuditLogsByAction(String action);
    List<Map<String, Object>> getAuditLogsByDateRange(LocalDateTime start, LocalDateTime end);
    
    // Operaciones masivas
    void bulkUpdateUserStatus(List<Long> userIds, String status, String motivo);
    void bulkCancelBets(List<Long> betIds, String motivo);
    void bulkSendNotifications(Long notificationId, List<Long> userIds);
    void bulkUpdateEventStatus(List<Long> eventIds, String status);
}
