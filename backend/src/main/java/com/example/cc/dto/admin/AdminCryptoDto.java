package com.example.cc.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCryptoDto {
    
    private Long idTransaccion;
    private String hash;
    private String tipo; // DEPOSITO, RETIRO, TRANSFERENCIA, COMISION
    private String criptomoneda; // BTC, ETH, USDT, etc.
    
    // Información del usuario
    private Long usuarioId;
    private String usuarioUsername;
    private String usuarioEmail;
    private String tipoUsuario; // REGULAR, PREMIUM, VIP
    
    // Detalles de la transacción
    private BigDecimal monto;
    private BigDecimal montoCrypto;
    private BigDecimal tasaCambio;
    private String monedaFiat; // USD, EUR, etc.
    private BigDecimal comision;
    private BigDecimal comisionRed;
    private BigDecimal montoFinal;
    
    // Direcciones blockchain
    private String direccionOrigen;
    private String direccionDestino;
    private String walletPlataforma;
    private String walletUsuario;
    
    // Estado y confirmaciones
    private String estado; // PENDIENTE, CONFIRMANDO, CONFIRMADA, FALLIDA, CANCELADA
    private Integer confirmacionesRequeridas;
    private Integer confirmacionesActuales;
    private String hashConfirmacion;
    private String bloque;
    private Integer numeroBloque;
    
    // Fechas importantes
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaConfirmacion;
    private LocalDateTime fechaCompletado;
    private LocalDateTime fechaExpiracion;
    
    // Información de red
    private String red; // MAINNET, TESTNET
    private String protocolo; // ERC20, TRC20, BEP20
    private BigDecimal gasUtilizado;
    private BigDecimal precioGas;
    private String explorer; // URL del explorador
    
    // Validación y seguridad
    private boolean validada;
    private String motivoRechazo;
    private String nivelRiesgo; // BAJO, MEDIO, ALTO, CRITICO
    private boolean requiereAprobacion;
    private String aprobadoPor;
    private LocalDateTime fechaAprobacion;
    
    // Información adicional
    private String notas;
    private String etiquetas;
    private String referenciaExterna;
    private String metodoPago; // Para depósitos fiat
    
    // Métricas y análisis
    private BigDecimal volumenDiario;
    private Integer transaccionesDiarias;
    private String patronTransaccion; // NORMAL, SOSPECHOSO, FRECUENTE
    private String geolocalizacion;
    private String ip;
    private String dispositivo;
    
    // Auditoría administrativa
    private String estadoAdmin; // REVISION_PENDIENTE, APROBADA, RECHAZADA, INVESTIGACION
    private String motivoAdmin;
    private String revisadoPor;
    private LocalDateTime fechaRevision;
    private String accionTomada;
    
    // Configuración de la criptomoneda
    private boolean criptoActiva;
    private BigDecimal limiteMinimoTransaccion;
    private BigDecimal limiteMaximoTransaccion;
    private BigDecimal limiteDiarioUsuario;
    private Integer tiempoConfirmacion; // en minutos
    
    // Información del mercado
    private BigDecimal precioMercado;
    private BigDecimal volatilidad;
    private String fuente; // Fuente del precio
    private LocalDateTime fechaPrecio;
}
