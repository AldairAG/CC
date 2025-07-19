package com.example.cc.service.perfil;

import com.example.cc.dto.request.ActualizarPerfilRequest;
import com.example.cc.dto.request.CambiarPasswordRequest;
import com.example.cc.dto.request.CrearTicketSoporteRequest;
import com.example.cc.dto.request.GameHistory;
import com.example.cc.dto.response.*;
import com.example.cc.entities.DocumentoIdentidad;
import com.example.cc.entities.enums.GameType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IPerfilUsuarioService {
    
    // Gestión de perfil
    PerfilUsuarioResponse obtenerPerfilUsuario(Long idUsuario);
    void actualizarPerfil(Long idUsuario, ActualizarPerfilRequest request);
    void cambiarPassword(Long idUsuario, CambiarPasswordRequest request);
    
    // Gestión de documentos
    DocumentoIdentidadResponse subirDocumento(Long idUsuario, DocumentoIdentidad.TipoDocumento tipo, MultipartFile archivo);
    List<DocumentoIdentidadResponse> obtenerDocumentos(Long idUsuario);
    void eliminarDocumento(Long idUsuario, Long idDocumento);
    
    // Historial de transacciones
    List<TransaccionResponse> obtenerHistorialTransacciones(Long idUsuario);
    Page<TransaccionResponse> obtenerHistorialTransaccionesPaginado(Long idUsuario, Pageable pageable);
    List<TransaccionResponse> obtenerDepositos(Long idUsuario);
    List<TransaccionResponse> obtenerRetiros(Long idUsuario);

    
    // Soporte
    TicketSoporteResponse crearTicketSoporte(Long idUsuario, CrearTicketSoporteRequest request);
    List<TicketSoporteResponse> obtenerMisTickets(Long idUsuario);
    Optional<TicketSoporteResponse> obtenerTicketPorId(Long idUsuario, Long idTicket);
    
    // Autenticación 2FA
    Autenticacion2FAResponse obtenerConfiguracion2FA(Long idUsuario);
    Autenticacion2FAResponse habilitarAutenticacion2FA(Long idUsuario);
    void deshabilitarAutenticacion2FA(Long idUsuario);
    boolean verificarCodigo2FA(Long idUsuario, String codigo);
    String generarCodigosBackup(Long idUsuario);
    
    // Estadísticas del usuario
    EstadisticasUsuarioResponse obtenerEstadisticasCompletas(Long idUsuario);

    List<GameHistory> obtenerHistorialDeJuegoByUserId(Long idUsuario, Pageable pageable);

}
