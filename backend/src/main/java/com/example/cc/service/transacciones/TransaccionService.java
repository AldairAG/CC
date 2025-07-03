package com.example.cc.service.transacciones;

import com.example.cc.entities.Transaccion;
import com.example.cc.entities.Usuario;
import com.example.cc.repository.TransaccionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransaccionService {

    private final TransaccionRepository transaccionRepository;

    /**
     * Registrar una nueva transacción
     */
    @Transactional
    public Transaccion registrarTransaccion(
            Usuario usuario,
            Transaccion.TipoTransaccion tipo,
            BigDecimal monto,
            String descripcion,
            Transaccion.EstadoTransaccion estado) {

        Transaccion transaccion = new Transaccion();
        transaccion.setUsuario(usuario);
        transaccion.setTipo(tipo);
        transaccion.setMonto(monto);
        transaccion.setDescripcion(descripcion);
        transaccion.setEstado(estado);
        transaccion.setFechaCreacion(LocalDateTime.now());

        // Si la transacción está completada, establecer fecha de procesamiento
        if (estado == Transaccion.EstadoTransaccion.COMPLETADA) {
            transaccion.setFechaProcesamiento(LocalDateTime.now());
        }

        // Calcular monto neto (monto - comisión)
        transaccion.setMontoNeto(monto.subtract(transaccion.getComision()));

        transaccionRepository.save(transaccion);
        log.info("Transacción registrada: {} - Usuario: {} - Monto: {} - Tipo: {}",
                transaccion.getIdTransaccion(), usuario.getIdUsuario(), monto, tipo);

        return transaccion;
    }

    /**
     * Obtener transacciones de un usuario
     */
    public List<Transaccion> getTransaccionesByUsuario(Usuario usuario) {
        return transaccionRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
    }

    /**
     * Actualizar estado de una transacción
     */
    @Transactional
    public Transaccion actualizarEstadoTransaccion(
            Long transaccionId,
            Transaccion.EstadoTransaccion nuevoEstado,
            String comentarios) {

        Transaccion transaccion = transaccionRepository.findById(transaccionId)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada con ID: " + transaccionId));

        transaccion.setEstado(nuevoEstado);
        
        if (comentarios != null) {
            transaccion.setComentarios(comentarios);
        }

        // Si la transacción está completada, establecer fecha de procesamiento
        if (nuevoEstado == Transaccion.EstadoTransaccion.COMPLETADA) {
            transaccion.setFechaProcesamiento(LocalDateTime.now());
        }

        transaccionRepository.save(transaccion);
        log.info("Transacción actualizada: {} - Nuevo estado: {}", transaccionId, nuevoEstado);

        return transaccion;
    }
}
