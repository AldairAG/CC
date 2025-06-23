package com.example.cc.service.apuesta;

import com.example.cc.dto.request.CrearApuestaRequest;
import com.example.cc.dto.response.ApuestaResponse;
import com.example.cc.dto.response.EstadisticasApuestaResponse;
import com.example.cc.entities.enums.EstadoApuesta;
import com.example.cc.entities.enums.TipoApuesta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ApuestaService {
    
    // Operaciones CRUD principales
    ApuestaResponse crearApuesta(CrearApuestaRequest request, Long idUsuario);
    Optional<ApuestaResponse> obtenerApuestaPorId(Long idApuesta, Long idUsuario);
    List<ApuestaResponse> obtenerApuestasPorUsuario(Long idUsuario);
    Page<ApuestaResponse> obtenerApuestasPorUsuarioPaginado(Long idUsuario, Pageable pageable);
    boolean cancelarApuesta(Long idApuesta, Long idUsuario, String motivo);
    
    // Operaciones de resolución (solo para administradores)
    ApuestaResponse resolverApuestaComoGanada(Long idApuesta);
    ApuestaResponse resolverApuestaComoPerdida(Long idApuesta);
    ApuestaResponse reembolsarApuesta(Long idApuesta, String motivo);
    
    // Consultas específicas
    List<ApuestaResponse> obtenerApuestasPorEvento(Long idEvento);
    List<ApuestaResponse> obtenerApuestasPorEstado(EstadoApuesta estado);
    List<ApuestaResponse> obtenerApuestasPorTipo(TipoApuesta tipo);
    
    // Estadísticas
    EstadisticasApuestaResponse obtenerEstadisticasUsuario(Long idUsuario);
    BigDecimal calcularGananciaPotencial(BigDecimal monto, BigDecimal cuota);
    
    // Validaciones
    boolean validarSaldoSuficiente(Long idUsuario, BigDecimal montoApuesta);
    boolean validarLimiteApuesta(Long idUsuario, BigDecimal montoApuesta);
    boolean validarEventoAbierto(Long idEvento);
    boolean validarApuestaDuplicada(Long idUsuario, Long idEvento, TipoApuesta tipoApuesta);
    
    // Utilidades
    void procesarApuestasPendientes();
    List<ApuestaResponse> obtenerTopGanancias(int limite);
}
