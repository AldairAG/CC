package com.example.cc.service.estadisticas;

import com.example.cc.dto.QuinielaResumenDto;
import com.example.cc.entities.Quiniela;
import com.example.cc.entities.QuinielaParticipacion;
import com.example.cc.repository.QuinielaRepository;
import com.example.cc.repository.QuinielaParticipacionRepository;
import com.example.cc.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EstadisticasService implements IEstadisticasService {

    private final QuinielaRepository quinielaRepository;
    private final QuinielaParticipacionRepository participacionRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Obtener estadísticas del dashboard principal
     */
    public Map<String, Object> obtenerEstadisticasDashboard() {
        Map<String, Object> stats = new HashMap<>();
        
        // Estadísticas generales
        stats.put("totalQuinielas", quinielaRepository.count());
        stats.put("quinielasActivas", quinielaRepository.findByEstado(Quiniela.EstadoQuiniela.ACTIVA).size());
        stats.put("totalUsuarios", usuarioRepository.count());
        stats.put("totalParticipaciones", participacionRepository.count());
        
        // Pool total en juego
        List<Quiniela> quinielasActivas = quinielaRepository.findByEstado(Quiniela.EstadoQuiniela.ACTIVA);
        BigDecimal poolTotalActivo = quinielasActivas.stream()
                .map(Quiniela::getPoolActual)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("poolTotalActivo", poolTotalActivo);
        
        // Quinielas que cierran pronto (próximas 24 horas)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime mañana = now.plusDays(1);
        List<Quiniela> quinielasProximasACerrar = quinielaRepository
                .findByEstadoAndFechaCierreBetween(Quiniela.EstadoQuiniela.ACTIVA, now, mañana);
        stats.put("quinielasProximasACerrar", quinielasProximasACerrar.size());
        
        return stats;
    }

    /**
     * Obtener quinielas populares (más participantes)
     */
    public List<QuinielaResumenDto> obtenerQuinielasPopulares(int limite) {
        List<Quiniela> quinielasActivas = quinielaRepository.findByEstado(Quiniela.EstadoQuiniela.ACTIVA);
        
        return quinielasActivas.stream()
                .sorted((q1, q2) -> q2.getParticipantesActuales().compareTo(q1.getParticipantesActuales()))
                .limit(limite)
                .map(QuinielaResumenDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtener quinielas con mayor pool
     */
    public List<QuinielaResumenDto> obtenerQuinielasMayorPool(int limite) {
        List<Quiniela> quinielasActivas = quinielaRepository.findByEstado(Quiniela.EstadoQuiniela.ACTIVA);
        
        return quinielasActivas.stream()
                .sorted((q1, q2) -> q2.getPoolActual().compareTo(q1.getPoolActual()))
                .limit(limite)
                .map(QuinielaResumenDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtener quinielas que cierran pronto
     */
    public List<QuinielaResumenDto> obtenerQuinielasProximasACerrar(int limite) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime limite24h = now.plusDays(1);
        
        List<Quiniela> quinielas = quinielaRepository
                .findByEstadoAndFechaCierreBetween(Quiniela.EstadoQuiniela.ACTIVA, now, limite24h);
        
        return quinielas.stream()
                .sorted((q1, q2) -> q1.getFechaCierre().compareTo(q2.getFechaCierre()))
                .limit(limite)
                .map(QuinielaResumenDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtener estadísticas de participación de un usuario
     */
    public Map<String, Object> obtenerEstadisticasUsuario(Long usuarioId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Participaciones del usuario
        List<QuinielaParticipacion> participaciones = participacionRepository
                .findByUsuario_IdUsuarioOrderByFechaParticipacionDesc(usuarioId, Pageable.unpaged())
                .getContent();
        
        stats.put("totalParticipaciones", participaciones.size());
        
        // Participaciones activas
        long participacionesActivas = participaciones.stream()
                .filter(p -> p.getEstado() == QuinielaParticipacion.EstadoParticipacion.ACTIVA ||
                           p.getEstado() == QuinielaParticipacion.EstadoParticipacion.PREDICCIONES_COMPLETADAS)
                .count();
        stats.put("participacionesActivas", participacionesActivas);
        
        // Total apostado
        BigDecimal totalApostado = participaciones.stream()
                .map(QuinielaParticipacion::getMontoApostado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalApostado", totalApostado);
        
        // Total ganado
        BigDecimal totalGanado = participaciones.stream()
                .map(p -> p.getPremioGanado() != null ? p.getPremioGanado() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalGanado", totalGanado);
        
        // Quinielas ganadas
        long quinielasGanadas = participaciones.stream()
                .filter(p -> p.getPremioGanado() != null && p.getPremioGanado().compareTo(BigDecimal.ZERO) > 0)
                .count();
        stats.put("quinielasGanadas", quinielasGanadas);
        
        // Porcentaje de éxito
        if (participaciones.size() > 0) {
            double porcentajeExito = (double) quinielasGanadas / participaciones.size() * 100;
            stats.put("porcentajeExito", porcentajeExito);
        } else {
            stats.put("porcentajeExito", 0.0);
        }
        
        return stats;
    }

    /**
     * Obtener histórico de participaciones de un usuario
     */
    public Page<QuinielaParticipacion> obtenerHistoricoUsuario(Long usuarioId, Pageable pageable) {
        return participacionRepository.findByUsuario_IdUsuarioOrderByFechaParticipacionDesc(usuarioId, pageable);
    }

    /**
     * Obtener estadísticas por tipo de quiniela
     */
    public Map<String, Object> obtenerEstadisticasPorTipo() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Quiniela> todasLasQuinielas = quinielaRepository.findAll();
        
        // Agrupar por tipo
        Map<Quiniela.TipoQuiniela, Long> porTipo = todasLasQuinielas.stream()
                .collect(Collectors.groupingBy(Quiniela::getTipoQuiniela, Collectors.counting()));
        
        stats.put("porTipo", porTipo);
        
        // Agrupar por tipo de distribución
        Map<Quiniela.TipoDistribucion, Long> porDistribucion = todasLasQuinielas.stream()
                .collect(Collectors.groupingBy(Quiniela::getTipoDistribucion, Collectors.counting()));
        
        stats.put("porDistribucion", porDistribucion);
        
        return stats;
    }

    /**
     * Obtener top usuarios por ganancias
     */
    public List<Map<String, Object>> obtenerTopGanadores(int limite) {
        // Esta consulta sería mejor hacerla directamente en la base de datos
        // Por simplicidad, aquí se hace en memoria
        
        List<QuinielaParticipacion> todasLasParticipaciones = participacionRepository.findAll();
        
        Map<Long, BigDecimal> gananciasPorUsuario = new HashMap<>();
        
        for (QuinielaParticipacion participacion : todasLasParticipaciones) {
            if (participacion.getPremioGanado() != null) {
                Long usuarioId = participacion.getUsuario().getIdUsuario();
                gananciasPorUsuario.merge(usuarioId, participacion.getPremioGanado(), BigDecimal::add);
            }
        }
        
        return gananciasPorUsuario.entrySet().stream()
                .sorted(Map.Entry.<Long, BigDecimal>comparingByValue().reversed())
                .limit(limite)
                .map(entry -> {
                    Map<String, Object> usuario = new HashMap<>();
                    usuario.put("usuarioId", entry.getKey());
                    usuario.put("totalGanado", entry.getValue());
                    // Aquí podrías agregar más datos del usuario
                    return usuario;
                })
                .collect(Collectors.toList());
    }
}
