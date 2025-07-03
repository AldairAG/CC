package com.example.cc.service.apuestas;

import com.example.cc.entities.*;
import com.example.cc.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CuotasDinamicasService {

    private final CuotaEventoRepository cuotaEventoRepository;
    private final CuotaHistorialRepository cuotaHistorialRepository;
    private final VolumenApuestasRepository volumenApuestasRepository;
    private final PoliticaCuotasRepository politicaCuotasRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;

    /**
     * Actualizar cuotas basándose en el volumen de apuestas
     */
    public void actualizarCuotasPorVolumen(Long eventoId) {
        log.info("Iniciando actualización de cuotas por volumen para evento: {}", eventoId);
        
        Optional<EventoDeportivo> eventoOpt = eventoDeportivoRepository.findById(eventoId);
        if (eventoOpt.isEmpty()) {
            log.warn("Evento no encontrado: {}", eventoId);
            return;
        }

        EventoDeportivo evento = eventoOpt.get();
        PoliticaCuotas politica = obtenerPoliticaActiva();
        
        if (!politica.getActualizarAutomaticamente()) {
            log.info("Actualización automática deshabilitada");
            return;
        }

        // Verificar si está muy cerca del evento
        if (estaMuyCercaDelEvento(evento, politica)) {
            log.info("Evento muy próximo, pausando actualizaciones");
            return;
        }

        List<CuotaEvento> cuotas = cuotaEventoRepository.findActiveByEventoId(eventoId);
        List<VolumenApuestas> volumenes = volumenApuestasRepository.findByEventoDeportivoId(eventoId);
        
        calcularDistribucionPorcentual(volumenes);
        
        for (CuotaEvento cuota : cuotas) {
            actualizarCuotaIndividual(cuota, volumenes, politica);
        }
        
        log.info("Actualización de cuotas completada para evento: {}", eventoId);
    }

    /**
     * Actualizar una cuota individual basándose en algoritmos
     */
    private void actualizarCuotaIndividual(CuotaEvento cuota, List<VolumenApuestas> volumenes, PoliticaCuotas politica) {
        VolumenApuestas volumen = volumenes.stream()
            .filter(v -> v.getTipoResultado().equals(cuota.getTipoResultado()))
            .findFirst()
            .orElse(null);
            
        if (volumen == null) {
            log.debug("No hay volumen para tipo resultado: {}", cuota.getTipoResultado());
            return;
        }

        BigDecimal cuotaActual = cuota.getValorCuota();
        BigDecimal cuotaNueva = calcularNuevaCuota(cuota, volumen, volumenes, politica);
        
        if (cuotaNueva.equals(cuotaActual)) {
            return; // No hay cambio
        }

        // Validar el cambio según la política
        if (!politica.validarCambio(cuotaActual, cuotaNueva)) {
            log.warn("Cambio de cuota rechazado por política. Actual: {}, Nueva: {}", cuotaActual, cuotaNueva);
            return;
        }

        // Verificar tiempo mínimo entre cambios
        if (!hasPasadoTiempoMinimo(cuota, politica)) {
            log.debug("No ha pasado tiempo mínimo para cambio de cuota");
            return;
        }

        // Aplicar el cambio
        aplicarCambioCuota(cuota, cuotaActual, cuotaNueva, CuotaHistorial.RazonCambioCuota.VOLUMEN_APUESTAS, politica);
    }

    /**
     * Calcular nueva cuota usando algoritmos combinados
     */
    private BigDecimal calcularNuevaCuota(CuotaEvento cuota, VolumenApuestas volumenObjetivo, 
                                         List<VolumenApuestas> todosVolumenes, PoliticaCuotas politica) {
        
        BigDecimal cuotaBase = cuota.getValorCuota();
        
        // Factor de volumen: Si hay mucho volumen en una opción, bajar su cuota
        BigDecimal factorVolumen = calcularFactorVolumen(volumenObjetivo, todosVolumenes, politica);
        
        // Factor de probabilidad: Basado en distribución matemática
        BigDecimal factorProbabilidad = calcularFactorProbabilidad(volumenObjetivo, todosVolumenes);
        
        // Combinar factores
        BigDecimal cuotaNueva = cuotaBase
            .multiply(BigDecimal.ONE.add(factorVolumen.multiply(politica.getFactorVolumen())))
            .multiply(BigDecimal.ONE.add(factorProbabilidad.multiply(politica.getFactorProbabilidad())));
            
        // Aplicar margen de la casa
        cuotaNueva = aplicarMargenCasa(cuotaNueva, politica);
        
        // Asegurar límites
        cuotaNueva = cuotaNueva.max(politica.getCuotaMinima()).min(politica.getCuotaMaxima());
        
        return cuotaNueva.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calcular factor de volumen (-1 a 1)
     */
    private BigDecimal calcularFactorVolumen(VolumenApuestas volumenObjetivo, List<VolumenApuestas> todosVolumenes, PoliticaCuotas politica) {
        BigDecimal porcentajeDistribucion = volumenObjetivo.getPorcentajeDistribucion();
        
        if (porcentajeDistribucion.compareTo(new BigDecimal("33.33")) > 0) {
            // Más del 33% del volumen -> bajar cuota
            BigDecimal exceso = porcentajeDistribucion.subtract(new BigDecimal("33.33"));
            return exceso.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP).negate();
        } else if (porcentajeDistribucion.compareTo(new BigDecimal("20.00")) < 0) {
            // Menos del 20% del volumen -> subir cuota
            BigDecimal deficit = new BigDecimal("20.00").subtract(porcentajeDistribucion);
            return deficit.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        }
        
        return BigDecimal.ZERO;
    }

    /**
     * Calcular factor de probabilidad basado en la distribución
     */
    private BigDecimal calcularFactorProbabilidad(VolumenApuestas volumenObjetivo, List<VolumenApuestas> todosVolumenes) {
        // Probabilidad implícita basada en la distribución actual
        BigDecimal totalVolumen = todosVolumenes.stream()
            .map(VolumenApuestas::getTotalApostado)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        if (totalVolumen.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal probabilidadImplicita = volumenObjetivo.getTotalApostado().divide(totalVolumen, 4, RoundingMode.HALF_UP);
        BigDecimal probabilidadTeorica = new BigDecimal("0.3333"); // 33.33% para 3 opciones
        
        return probabilidadTeorica.subtract(probabilidadImplicita);
    }

    /**
     * Aplicar margen de la casa
     */
    private BigDecimal aplicarMargenCasa(BigDecimal cuota, PoliticaCuotas politica) {
        BigDecimal margen = BigDecimal.ONE.subtract(politica.getMargenCasa().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP));
        return cuota.multiply(margen);
    }

    /**
     * Aplicar cambio de cuota y registrar en historial
     */
    private void aplicarCambioCuota(CuotaEvento cuota, BigDecimal cuotaAnterior, BigDecimal cuotaNueva, 
                                  CuotaHistorial.RazonCambioCuota razon, PoliticaCuotas politica) {
        
        // Actualizar cuota
        cuota.setValorCuota(cuotaNueva);
        cuotaEventoRepository.save(cuota);
        
        // Registrar en historial
        CuotaHistorial historial = new CuotaHistorial();
        historial.setCuotaEvento(cuota);
        historial.setEventoDeportivo(cuota.getEventoDeportivo());
        historial.setTipoResultado(cuota.getTipoResultado());
        historial.setValorCuotaAnterior(cuotaAnterior);
        historial.setValorCuotaNueva(cuotaNueva);
        historial.setRazonCambio(razon);
        historial.setFechaCambio(LocalDateTime.now());
        
        cuotaHistorialRepository.save(historial);
        
        // Verificar si requiere notificación
        BigDecimal porcentajeCambio = cuotaNueva.subtract(cuotaAnterior)
                                                .divide(cuotaAnterior, 4, RoundingMode.HALF_UP)
                                                .multiply(new BigDecimal("100"))
                                                .abs();
                                                
        if (politica.requiereNotificacion(porcentajeCambio)) {
            // TODO: Enviar notificación (implementar más adelante)
            log.info("Cambio significativo de cuota: {}% - Evento: {}, Tipo: {}", 
                    porcentajeCambio, cuota.getEventoDeportivo().getId(), cuota.getTipoResultado());
        }
        
        log.info("Cuota actualizada: {} -> {} ({}%)", cuotaAnterior, cuotaNueva, porcentajeCambio);
    }

    /**
     * Calcular distribución porcentual del volumen
     */
    private void calcularDistribucionPorcentual(List<VolumenApuestas> volumenes) {
        BigDecimal totalApostado = volumenes.stream()
            .map(VolumenApuestas::getTotalApostado)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        if (totalApostado.compareTo(BigDecimal.ZERO) > 0) {
            for (VolumenApuestas volumen : volumenes) {
                BigDecimal porcentaje = volumen.getTotalApostado()
                    .divide(totalApostado, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
                volumen.setPorcentajeDistribucion(porcentaje);
                volumenApuestasRepository.save(volumen);
            }
        }
    }

    /**
     * Verificar si ha pasado el tiempo mínimo entre cambios
     */
    private boolean hasPasadoTiempoMinimo(CuotaEvento cuota, PoliticaCuotas politica) {
        CuotaHistorial ultimoCambio = cuotaHistorialRepository.findLastChangeByEventoAndTipo(
            cuota.getEventoDeportivo().getId(), 
            cuota.getTipoResultado()
        );
        
        if (ultimoCambio == null) {
            return true;
        }
        
        LocalDateTime tiempoMinimo = ultimoCambio.getFechaCambio()
            .plusMinutes(politica.getVariacionMinimaTiempoMinutos());
            
        return LocalDateTime.now().isAfter(tiempoMinimo);
    }

    /**
     * Verificar si el evento está muy cerca
     */
    private boolean estaMuyCercaDelEvento(EventoDeportivo evento, PoliticaCuotas politica) {
        LocalDateTime tiempoLimite = evento.getFechaEvento()
            .minusMinutes(politica.getPausarAntesEventoMinutos());
            
        return LocalDateTime.now().isAfter(tiempoLimite);
    }

    /**
     * Obtener política activa
     */
    private PoliticaCuotas obtenerPoliticaActiva() {
        return politicaCuotasRepository.findPoliticaActiva()
            .orElseThrow(() -> new RuntimeException("No hay política de cuotas activa"));
    }

    /**
     * Actualizar volumen al agregar una apuesta
     */
    public void actualizarVolumenApuesta(Long eventoId, TipoResultado tipoResultado, BigDecimal montoApuesta) {
        Optional<VolumenApuestas> volumenOpt = volumenApuestasRepository
            .findByEventoDeportivoIdAndTipoResultado(eventoId, tipoResultado);
            
        VolumenApuestas volumen;
        if (volumenOpt.isPresent()) {
            volumen = volumenOpt.get();
        } else {
            volumen = new VolumenApuestas();
            volumen.setEventoDeportivo(eventoDeportivoRepository.findById(eventoId).orElseThrow());
            volumen.setTipoResultado(tipoResultado);
        }
        
        volumen.agregarApuesta(montoApuesta);
        volumenApuestasRepository.save(volumen);
        
        // Disparar actualización de cuotas
        actualizarCuotasPorVolumen(eventoId);
    }

    /**
     * Obtener tendencia de cuotas
     */
    public String obtenerTendenciaCuota(Long eventoId, TipoResultado tipoResultado) {
        List<CuotaHistorial> historial = cuotaHistorialRepository
            .findTendenciaReciente(eventoId, tipoResultado, 5);
            
        if (historial.size() < 3) {
            return "INSUFICIENTE_DATA";
        }
        
        // Analizar tendencia de los últimos cambios
        int subiendoCount = 0;
        int bajandoCount = 0;
        
        for (int i = 0; i < historial.size() - 1; i++) {
            BigDecimal cambio = historial.get(i).getValorCuotaNueva()
                .subtract(historial.get(i).getValorCuotaAnterior());
                
            if (cambio.compareTo(BigDecimal.ZERO) > 0) {
                subiendoCount++;
            } else if (cambio.compareTo(BigDecimal.ZERO) < 0) {
                bajandoCount++;
            }
        }
        
        if (subiendoCount > bajandoCount) {
            return "SUBIENDO";
        } else if (bajandoCount > subiendoCount) {
            return "BAJANDO";
        } else {
            return "ESTABLE";
        }
    }
}
