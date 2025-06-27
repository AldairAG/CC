package com.example.cc.service;

import com.example.cc.entities.Quiniela;
import com.example.cc.entities.QuinielaParticipacion;
import com.example.cc.repository.QuinielaRepository;
import com.example.cc.repository.QuinielaParticipacionRepository;
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

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class QuinielaAdminService {

    private final QuinielaRepository quinielaRepository;
    private final QuinielaParticipacionRepository participacionRepository;
    private final WalletService walletService;

    /**
     * Obtener todas las quinielas para administración
     */
    @Transactional(readOnly = true)
    public Page<Quiniela> obtenerTodasLasQuinielas(Pageable pageable) {
        return quinielaRepository.findAll(pageable);
    }

    /**
     * Obtener estadísticas generales de quinielas
     */
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerEstadisticasGenerales() {
        Map<String, Object> estadisticas = new HashMap<>();
        
        // Contar quinielas por estado
        estadisticas.put("totalQuinielas", quinielaRepository.count());
        estadisticas.put("quinielasActivas", quinielaRepository.findByEstado(Quiniela.EstadoQuiniela.ACTIVA).size());
        estadisticas.put("quinielasCerradas", quinielaRepository.findByEstado(Quiniela.EstadoQuiniela.CERRADA).size());
        estadisticas.put("quinielasFinalizadas", quinielaRepository.findByEstado(Quiniela.EstadoQuiniela.FINALIZADA).size());
        
        // Estadísticas de participaciones
        estadisticas.put("totalParticipaciones", participacionRepository.count());
        
        // Pool total actual
        List<Quiniela> quinielasActivas = quinielaRepository.findByEstado(Quiniela.EstadoQuiniela.ACTIVA);
        BigDecimal poolTotalActivo = quinielasActivas.stream()
                .map(Quiniela::getPoolActual)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        estadisticas.put("poolTotalActivo", poolTotalActivo);
        
        return estadisticas;
    }

    /**
     * Cancelar una quiniela (solo admin)
     */
    public void cancelarQuiniela(Long quinielaId, String motivo) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        // Solo se pueden cancelar quinielas activas o en borrador
        if (quiniela.getEstado() != Quiniela.EstadoQuiniela.ACTIVA && 
            quiniela.getEstado() != Quiniela.EstadoQuiniela.BORRADOR) {
            throw new RuntimeException("Solo se pueden cancelar quinielas activas o en borrador");
        }

        // Obtener todas las participaciones
        List<QuinielaParticipacion> participaciones = participacionRepository
                .findByQuinielaAndEstado(quiniela, QuinielaParticipacion.EstadoParticipacion.ACTIVA);

        // Procesar reembolsos
        for (QuinielaParticipacion participacion : participaciones) {
            walletService.procesarReembolso(
                    participacion.getUsuario(),
                    participacion.getMontoApostado(),
                    "Reembolso por cancelación de quiniela: " + quiniela.getNombre() + 
                    ". Motivo: " + motivo
            );
            
            participacion.setEstado(QuinielaParticipacion.EstadoParticipacion.CANCELADA);
            participacionRepository.save(participacion);
        }

        // Cambiar estado de la quiniela
        quiniela.setEstado(Quiniela.EstadoQuiniela.CANCELADA);
        quiniela.setReglasEspeciales(
                (quiniela.getReglasEspeciales() != null ? quiniela.getReglasEspeciales() + "\n" : "") +
                "CANCELADA - Motivo: " + motivo + " - Fecha: " + LocalDateTime.now()
        );
        
        quinielaRepository.save(quiniela);
        
        log.info("Quiniela {} cancelada. Motivo: {}. Reembolsos procesados: {}", 
                quinielaId, motivo, participaciones.size());
    }

    /**
     * Forzar procesamiento de resultados (admin)
     */
    public void forzarProcesamientoResultados(Long quinielaId) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        // Cambiar estado a cerrada si está activa
        if (quiniela.getEstado() == Quiniela.EstadoQuiniela.ACTIVA) {
            quiniela.setEstado(Quiniela.EstadoQuiniela.CERRADA);
            quinielaRepository.save(quiniela);
        }

        // Procesar resultados (esto llamará al método del servicio principal)
        // quinielaService.procesarResultados(quinielaId);
        
        log.info("Forzado procesamiento de resultados para quiniela {}", quinielaId);
    }

    /**
     * Modificar configuración de una quiniela (admin)
     */
    public Quiniela modificarConfiguracion(Long quinielaId, Map<String, Object> cambios) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        // Solo permitir modificaciones en ciertas circunstancias
        if (quiniela.getEstado() == Quiniela.EstadoQuiniela.FINALIZADA) {
            throw new RuntimeException("No se puede modificar una quiniela finalizada");
        }

        // Aplicar cambios según los campos permitidos
        if (cambios.containsKey("fechaCierre")) {
            LocalDateTime nuevaFecha = LocalDateTime.parse(cambios.get("fechaCierre").toString());
            if (nuevaFecha.isBefore(LocalDateTime.now())) {
                throw new RuntimeException("La nueva fecha de cierre no puede ser en el pasado");
            }
            quiniela.setFechaCierre(nuevaFecha);
        }

        if (cambios.containsKey("maxParticipantes")) {
            Integer nuevoMax = Integer.valueOf(cambios.get("maxParticipantes").toString());
            if (nuevoMax < quiniela.getParticipantesActuales()) {
                throw new RuntimeException("El nuevo máximo no puede ser menor al número actual de participantes");
            }
            quiniela.setMaxParticipantes(nuevoMax);
        }

        if (cambios.containsKey("reglasEspeciales")) {
            quiniela.setReglasEspeciales(cambios.get("reglasEspeciales").toString());
        }

        return quinielaRepository.save(quiniela);
    }

    /**
     * Obtener participaciones de una quiniela para administración
     */
    @Transactional(readOnly = true)
    public List<QuinielaParticipacion> obtenerParticipaciones(Long quinielaId) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));
        
        return participacionRepository.findByQuinielaOrderByPuntuacionDescAciertosDesc(quiniela);
    }

    /**
     * Generar reporte de una quiniela
     */
    @Transactional(readOnly = true)
    public Map<String, Object> generarReporte(Long quinielaId) {
        Quiniela quiniela = quinielaRepository.findById(quinielaId)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));

        Map<String, Object> reporte = new HashMap<>();
        
        // Información básica
        reporte.put("quiniela", quiniela);
        reporte.put("participaciones", participacionRepository.findByQuinielaOrderByPuntuacionDescAciertosDesc(quiniela));
        
        // Estadísticas
        List<QuinielaParticipacion> participaciones = participacionRepository.findByQuinielaOrderByPuntuacionDescAciertosDesc(quiniela);
        reporte.put("totalParticipantes", participaciones.size());
        
        BigDecimal totalPremiosRepartidos = participaciones.stream()
                .map(p -> p.getPremioGanado() != null ? p.getPremioGanado() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        reporte.put("totalPremiosRepartidos", totalPremiosRepartidos);
        
        // Comisiones
        BigDecimal comisionCasa = quiniela.getPoolActual()
                .multiply(quiniela.getPorcentajeCasa())
                .divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);
        reporte.put("comisionCasa", comisionCasa);
        
        BigDecimal comisionCreador = quiniela.getPoolActual()
                .multiply(quiniela.getPorcentajeCreador())
                .divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);
        reporte.put("comisionCreador", comisionCreador);
        
        return reporte;
    }
}
