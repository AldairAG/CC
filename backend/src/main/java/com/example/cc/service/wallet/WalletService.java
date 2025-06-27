package com.example.cc.service.wallet;

import com.example.cc.entities.Transaccion;
import com.example.cc.entities.Usuario;
import com.example.cc.repository.TransaccionRepository;
import com.example.cc.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WalletService implements IWalletService {

    private final UsuarioRepository usuarioRepository;
    private final TransaccionRepository transaccionRepository;

    /**
     * Procesar pago de participación en quiniela
     */
    public void procesarPagoParticipacion(Usuario usuario, BigDecimal monto, String descripcion) {
        // Verificar saldo suficiente
        if (usuario.getSaldoUsuario().compareTo(monto) < 0) {
            throw new RuntimeException("Saldo insuficiente para la participación");
        }

        // Debitar del saldo del usuario
        BigDecimal nuevoSaldo = usuario.getSaldoUsuario().subtract(monto);
        usuario.setSaldoUsuario(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Registrar transacción
        Transaccion transaccion = new Transaccion();
        transaccion.setUsuario(usuario);
        transaccion.setTipo(Transaccion.TipoTransaccion.PENALIZACION); // Usar como débito
        transaccion.setMonto(monto.negate()); // Negativo para débito
        transaccion.setDescripcion(descripcion);
        transaccion.setEstado(Transaccion.EstadoTransaccion.COMPLETADA);
        transaccion.setFechaProcesamiento(LocalDateTime.now());
        
        transaccionRepository.save(transaccion);
        
        log.info("Procesado pago de participación: Usuario {}, Monto: {}", 
                usuario.getIdUsuario(), monto);
    }

    /**
     * Procesar pago de premio
     */
    public void procesarPagoPremio(Usuario usuario, BigDecimal monto, String descripcion) {
        // Acreditar al saldo del usuario
        BigDecimal nuevoSaldo = usuario.getSaldoUsuario().add(monto);
        usuario.setSaldoUsuario(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Registrar transacción
        Transaccion transaccion = new Transaccion();
        transaccion.setUsuario(usuario);
        transaccion.setTipo(Transaccion.TipoTransaccion.BONIFICACION);
        transaccion.setMonto(monto);
        transaccion.setDescripcion(descripcion);
        transaccion.setEstado(Transaccion.EstadoTransaccion.COMPLETADA);
        transaccion.setFechaProcesamiento(LocalDateTime.now());
        
        transaccionRepository.save(transaccion);
        
        log.info("Procesado pago de premio: Usuario {}, Monto: {}", 
                usuario.getIdUsuario(), monto);
    }

    /**
     * Procesar depósito
     */
    public void procesarDeposito(Usuario usuario, BigDecimal monto, String metodoPago, 
                               String referenciaExterna) {
        // Acreditar al saldo del usuario
        BigDecimal nuevoSaldo = usuario.getSaldoUsuario().add(monto);
        usuario.setSaldoUsuario(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Registrar transacción
        Transaccion transaccion = new Transaccion();
        transaccion.setUsuario(usuario);
        transaccion.setTipo(Transaccion.TipoTransaccion.DEPOSITO);
        transaccion.setMonto(monto);
        transaccion.setDescripcion("Depósito de fondos");
        transaccion.setMetodoPago(metodoPago);
        transaccion.setReferenciaExterna(referenciaExterna);
        transaccion.setEstado(Transaccion.EstadoTransaccion.COMPLETADA);
        transaccion.setFechaProcesamiento(LocalDateTime.now());
        
        transaccionRepository.save(transaccion);
        
        log.info("Procesado depósito: Usuario {}, Monto: {}", usuario.getIdUsuario(), monto);
    }

    /**
     * Procesar retiro
     */
    public void procesarRetiro(Usuario usuario, BigDecimal monto, String metodoPago) {
        // Verificar saldo suficiente
        if (usuario.getSaldoUsuario().compareTo(monto) < 0) {
            throw new RuntimeException("Saldo insuficiente para el retiro");
        }

        // Debitar del saldo del usuario
        BigDecimal nuevoSaldo = usuario.getSaldoUsuario().subtract(monto);
        usuario.setSaldoUsuario(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Registrar transacción (inicialmente pendiente)
        Transaccion transaccion = new Transaccion();
        transaccion.setUsuario(usuario);
        transaccion.setTipo(Transaccion.TipoTransaccion.RETIRO);
        transaccion.setMonto(monto.negate()); // Negativo para débito
        transaccion.setDescripcion("Retiro de fondos");
        transaccion.setMetodoPago(metodoPago);
        transaccion.setEstado(Transaccion.EstadoTransaccion.PENDIENTE);
        
        transaccionRepository.save(transaccion);
        
        log.info("Procesado retiro: Usuario {}, Monto: {}", usuario.getIdUsuario(), monto);
    }

    /**
     * Obtener saldo actual del usuario
     */
    @Transactional(readOnly = true)
    public BigDecimal obtenerSaldo(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuario.getSaldoUsuario();
    }

    /**
     * Procesar reembolso
     */
    public void procesarReembolso(Usuario usuario, BigDecimal monto, String descripcion) {
        // Acreditar al saldo del usuario
        BigDecimal nuevoSaldo = usuario.getSaldoUsuario().add(monto);
        usuario.setSaldoUsuario(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Registrar transacción
        Transaccion transaccion = new Transaccion();
        transaccion.setUsuario(usuario);
        transaccion.setTipo(Transaccion.TipoTransaccion.REEMBOLSO);
        transaccion.setMonto(monto);
        transaccion.setDescripcion(descripcion);
        transaccion.setEstado(Transaccion.EstadoTransaccion.COMPLETADA);
        transaccion.setFechaProcesamiento(LocalDateTime.now());
        
        transaccionRepository.save(transaccion);
        
        log.info("Procesado reembolso: Usuario {}, Monto: {}", usuario.getIdUsuario(), monto);
    }
}
