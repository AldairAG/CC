package com.example.cc.service.perfil;

import com.example.cc.dto.request.ActualizarPerfilRequest;
import com.example.cc.dto.request.CambiarPasswordRequest;
import com.example.cc.dto.request.CrearTicketSoporteRequest;
import com.example.cc.dto.request.GameHistory;
import com.example.cc.dto.response.*;
import com.example.cc.entities.*;
import com.example.cc.entities.enums.GameType;
import com.example.cc.repository.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PerfilUsuarioServiceImpl implements IPerfilUsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final DocumentoIdentidadRepository documentoRepository;
    private final TransaccionRepository transaccionRepository;
    private final TicketSoporteRepository ticketRepository;
    private final Autenticacion2FARepository autenticacion2FARepository;
    private final ApuestaRepository apuestaRepository;

    private final PasswordEncoder passwordEncoder;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void actualizarPerfil(Long idUsuario, ActualizarPerfilRequest request) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Perfil perfil = usuario.getPerfil();
        if (perfil == null) {
            perfil = new Perfil();
            perfil.setUsuario(usuario);
            usuario.setPerfil(perfil);
        }

        // Actualizar campos del perfil
        if (request.getNombre() != null)
            perfil.setNombre(request.getNombre());
        if (request.getApellido() != null)
            perfil.setApellido(request.getApellido());
        if (request.getTelefono() != null)
            perfil.setTelefono(request.getTelefono());

        if (request.getFechaNacimiento() != null) {
            try {
                perfil.setFechaNacimiento(java.sql.Date.valueOf(request.getFechaNacimiento()));
            } catch (Exception e) {
                log.warn("Error al parsear fecha de nacimiento: {}", request.getFechaNacimiento());
            }
        }

        usuarioRepository.save(usuario);
        log.info("Perfil actualizado para usuario: {}", idUsuario);
    }

    @Override
    public void cambiarPassword(Long idUsuario, CambiarPasswordRequest request) {
        if (!request.getNuevaPassword().equals(request.getConfirmarPassword())) {
            throw new RuntimeException("Las contraseñas no coinciden");
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioRepository.save(usuario);

        log.info("Contraseña cambiada para usuario: {}", idUsuario);
    }

    @Override
    public DocumentoIdentidadResponse subirDocumento(Long idUsuario, DocumentoIdentidad.TipoDocumento tipo,
            MultipartFile archivo) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar archivo
        if (archivo.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }

        // Validar tipo de archivo
        String contentType = archivo.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
            throw new RuntimeException("Solo se permiten imágenes y archivos PDF");
        }

        try {
            // Crear directorio si no existe
            Path uploadPath = Paths.get(uploadDir, "documentos", idUsuario.toString());
            Files.createDirectories(uploadPath);

            // Generar nombre único para el archivo
            String extension = getFileExtension(archivo.getOriginalFilename());
            String nombreArchivo = tipo.name() + "_" + UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(nombreArchivo);

            // Guardar archivo
            Files.copy(archivo.getInputStream(), filePath);

            // Verificar si ya existe un documento de este tipo
            Optional<DocumentoIdentidad> documentoExistente = documentoRepository.findByUsuarioAndTipoDocumento(usuario,
                    tipo);

            DocumentoIdentidad documento;
            if (documentoExistente.isPresent()) {
                documento = documentoExistente.get();
                // Eliminar archivo anterior si existe
                if (documento.getRutaArchivo() != null) {
                    try {
                        Files.deleteIfExists(Paths.get(documento.getRutaArchivo()));
                    } catch (IOException e) {
                        log.warn("No se pudo eliminar archivo anterior: {}", e.getMessage());
                    }
                }
            } else {
                documento = new DocumentoIdentidad();
                documento.setUsuario(usuario);
                documento.setTipoDocumento(tipo);
            }

            documento.setNombreArchivo(archivo.getOriginalFilename());
            documento.setRutaArchivo(filePath.toString());
            documento.setUrlArchivo("/api/documentos/" + idUsuario + "/" + nombreArchivo);
            documento.setEstado(DocumentoIdentidad.EstadoVerificacion.PENDIENTE);
            documento.setFechaSubida(LocalDateTime.now());

            documento = documentoRepository.save(documento);

            log.info("Documento {} subido para usuario: {}", tipo, idUsuario);
            return convertirADocumentoResponse(documento);

        } catch (IOException e) {
            log.error("Error al guardar archivo: {}", e.getMessage());
            throw new RuntimeException("Error al guardar el archivo");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoIdentidadResponse> obtenerDocumentos(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return documentoRepository.findByUsuario(usuario)
                .stream()
                .map(this::convertirADocumentoResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminarDocumento(Long idUsuario, Long idDocumento) {
        DocumentoIdentidad documento = documentoRepository.findById(idDocumento)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        if (!documento.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permisos para eliminar este documento");
        }

        // Eliminar archivo físico
        if (documento.getRutaArchivo() != null) {
            try {
                Files.deleteIfExists(Paths.get(documento.getRutaArchivo()));
            } catch (IOException e) {
                log.warn("No se pudo eliminar archivo: {}", e.getMessage());
            }
        }

        documentoRepository.delete(documento);
        log.info("Documento {} eliminado para usuario: {}", idDocumento, idUsuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransaccionResponse> obtenerHistorialTransacciones(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return transaccionRepository.findByUsuarioOrderByFechaCreacionDesc(usuario)
                .stream()
                .map(this::convertirATransaccionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransaccionResponse> obtenerHistorialTransaccionesPaginado(Long idUsuario, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return transaccionRepository.findByUsuarioOrderByFechaCreacionDesc(usuario, pageable)
                .map(this::convertirATransaccionResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransaccionResponse> obtenerDepositos(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return transaccionRepository.findByUsuarioAndTipo(usuario, Transaccion.TipoTransaccion.DEPOSITO)
                .stream()
                .map(this::convertirATransaccionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransaccionResponse> obtenerRetiros(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return transaccionRepository.findByUsuarioAndTipo(usuario, Transaccion.TipoTransaccion.RETIRO)
                .stream()
                .map(this::convertirATransaccionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TicketSoporteResponse crearTicketSoporte(Long idUsuario, CrearTicketSoporteRequest request) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        TicketSoporte ticket = new TicketSoporte();
        ticket.setUsuario(usuario);
        ticket.setAsunto(request.getAsunto());
        ticket.setCategoria(TicketSoporte.CategoriaTicket.valueOf(request.getCategoria()));
        ticket.setPrioridad(TicketSoporte.PrioridadTicket.valueOf(request.getPrioridad()));
        ticket.setDescripcion(request.getDescripcion());

        ticket = ticketRepository.save(ticket);

        log.info("Ticket de soporte {} creado para usuario: {}", ticket.getIdTicket(), idUsuario);
        return convertirATicketResponse(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketSoporteResponse> obtenerMisTickets(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ticketRepository.findByUsuarioOrderByFechaCreacionDesc(usuario)
                .stream()
                .map(this::convertirATicketResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TicketSoporteResponse> obtenerTicketPorId(Long idUsuario, Long idTicket) {
        return ticketRepository.findById(idTicket)
                .filter(ticket -> ticket.getUsuario().getIdUsuario().equals(idUsuario))
                .map(this::convertirATicketResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Autenticacion2FAResponse obtenerConfiguracion2FA(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Optional<Autenticacion2FA> auth2FA = autenticacion2FARepository.findByUsuario(usuario);

        if (auth2FA.isPresent()) {
            return convertirAAutenticacion2FAResponse(auth2FA.get());
        } else {
            return Autenticacion2FAResponse.builder()
                    .habilitado(false)
                    .tipo("NINGUNO")
                    .tipoDescripcion("No configurado")
                    .bloqueado(false)
                    .build();
        }
    }

    @Override
    public Autenticacion2FAResponse habilitarAutenticacion2FA(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Autenticacion2FA auth2FA = autenticacion2FARepository.findByUsuario(usuario)
                .orElse(new Autenticacion2FA());

        auth2FA.setUsuario(usuario);
        auth2FA.setHabilitado(true);
        auth2FA.setTipo(Autenticacion2FA.TipoAutenticacion.TOTP);
        auth2FA.setSecretKey(generarSecretKey());
        auth2FA.setCodigoBackup(generarCodigoBackup());
        auth2FA.setFechaActivacion(LocalDateTime.now());

        auth2FA = autenticacion2FARepository.save(auth2FA);

        log.info("Autenticación 2FA habilitada para usuario: {}", idUsuario);
        return convertirAAutenticacion2FAResponse(auth2FA);
    }

    @Override
    public void deshabilitarAutenticacion2FA(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        autenticacion2FARepository.findByUsuario(usuario)
                .ifPresent(auth2FA -> {
                    auth2FA.setHabilitado(false);
                    autenticacion2FARepository.save(auth2FA);
                    log.info("Autenticación 2FA deshabilitada para usuario: {}", idUsuario);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public boolean verificarCodigo2FA(Long idUsuario, String codigo) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return autenticacion2FARepository.findByUsuario(usuario)
                .map(auth2FA -> {
                    if (!auth2FA.isHabilitado() || auth2FA.isBloqueado()) {
                        return false;
                    }

                    // Aquí implementarías la lógica de verificación TOTP
                    // Por simplicidad, simulamos la verificación
                    boolean valido = verificarTOTP(auth2FA.getSecretKey(), codigo);

                    if (valido) {
                        auth2FA.setUltimoUso(LocalDateTime.now());
                        auth2FA.setIntentosFallidos(0);
                        autenticacion2FARepository.save(auth2FA);
                    } else {
                        auth2FA.setIntentosFallidos(auth2FA.getIntentosFallidos() + 1);
                        if (auth2FA.getIntentosFallidos() >= 5) {
                            auth2FA.setBloqueado(true);
                            auth2FA.setFechaBloqueo(LocalDateTime.now());
                        }
                        autenticacion2FARepository.save(auth2FA);
                    }

                    return valido;
                })
                .orElse(false);
    }

    @Override
    public String generarCodigosBackup(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return autenticacion2FARepository.findByUsuario(usuario)
                .map(auth2FA -> {
                    String codigoBackup = generarCodigoBackup();
                    auth2FA.setCodigoBackup(codigoBackup);
                    autenticacion2FARepository.save(auth2FA);
                    return codigoBackup;
                })
                .orElseThrow(() -> new RuntimeException("Autenticación 2FA no configurada"));
    }

    @Override
    @Transactional(readOnly = true)
    public EstadisticasUsuarioResponse obtenerEstadisticasCompletas(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Estadísticas de transacciones
        BigDecimal totalDepositado = transaccionRepository
                .sumMontoByUsuarioAndTipoAndEstado(usuario, Transaccion.TipoTransaccion.DEPOSITO,
                        Transaccion.EstadoTransaccion.COMPLETADA)
                .orElse(BigDecimal.ZERO);

        BigDecimal totalRetirado = transaccionRepository
                .sumMontoByUsuarioAndTipoAndEstado(usuario, Transaccion.TipoTransaccion.RETIRO,
                        Transaccion.EstadoTransaccion.COMPLETADA)
                .orElse(BigDecimal.ZERO);

        Long numeroDepositos = transaccionRepository.countByUsuarioAndTipo(usuario,
                Transaccion.TipoTransaccion.DEPOSITO);
        Long numeroRetiros = transaccionRepository.countByUsuarioAndTipo(usuario, Transaccion.TipoTransaccion.RETIRO);

        // Documentos
        List<DocumentoIdentidad> documentos = documentoRepository.findByUsuario(usuario);
        long documentosAprobados = documentos.stream()
                .filter(doc -> doc.getEstado() == DocumentoIdentidad.EstadoVerificacion.APROBADO)
                .count();
        long documentosPendientes = documentos.stream()
                .filter(doc -> doc.getEstado() == DocumentoIdentidad.EstadoVerificacion.PENDIENTE)
                .count();

        // Tickets
        Long ticketsAbiertos = ticketRepository.countByUsuarioAndEstado(usuario, TicketSoporte.EstadoTicket.ABIERTO);
        Long ticketsResueltos = ticketRepository.countByUsuarioAndEstado(usuario, TicketSoporte.EstadoTicket.RESUELTO);

        // Seguridad
        boolean auth2FAHabilitada = autenticacion2FARepository.existsByUsuarioAndHabilitadoTrue(usuario);

        return EstadisticasUsuarioResponse.builder()
                .email(usuario.getEmail())
                .nombre(usuario.getPerfil() != null ? usuario.getPerfil().getNombre() : null)
                .saldoActual(usuario.getSaldoUsuario())
                .cuentaActiva(usuario.getEstadoCuenta())
                .totalDepositado(totalDepositado)
                .totalRetirado(totalRetirado)
                .numeroDepositos(numeroDepositos)
                .numeroRetiros(numeroRetiros)
                .documentosVerificados(documentosAprobados == 2) // INE + Comprobante
                .documentosPendientes((int) documentosPendientes)
                .documentosAprobados((int) documentosAprobados)
                .ticketsAbiertos(ticketsAbiertos)
                .ticketsResueltos(ticketsResueltos)
                .autenticacion2FAHabilitada(auth2FAHabilitada)
                .nivelSeguridad(calcularNivelSeguridad(documentosAprobados, auth2FAHabilitada))
                .ultimasTransacciones(obtenerUltimasTransacciones(usuario, 5))
                .build();
    }

    @Override
    public PerfilUsuarioResponse obtenerPerfilUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Perfil perfil = usuario.getPerfil();

        // Verificar si tiene 2FA habilitado
        boolean tiene2FA = usuario.getAutenticacion2FA() != null &&
                usuario.getAutenticacion2FA().isHabilitado();

        // Contar documentos subidos
        int documentosSubidos = usuario.getDocumentos() != null ? usuario.getDocumentos().size() : 0;

        // Obtener última transacción para determinar última actividad
        Date ultimaActividad = usuario.getTransacciones() != null && !usuario.getTransacciones().isEmpty()
                ? usuario.getTransacciones().stream()
                        .map(t -> java.sql.Timestamp.valueOf(t.getFechaCreacion()))
                        .max(Date::compareTo)
                        .orElse(null)
                : null;

        return PerfilUsuarioResponse.builder()
                .idUsuario(usuario.getIdUsuario())
                .email(usuario.getEmail())
                .saldoUsuario(usuario.getSaldoUsuario())
                .estadoCuenta(usuario.getEstadoCuenta())
                .idPerfil(perfil != null ? perfil.getIdPerfil() : null)
                .fotoPerfil(perfil != null ? perfil.getFotoPerfil() : null)
                .nombre(perfil != null ? perfil.getNombre() : null)
                .apellido(perfil != null ? perfil.getApellido() : null)
                .fechaRegistro(perfil != null ? perfil.getFechaRegistro() : null)
                .fechaNacimiento(perfil != null ? perfil.getFechaNacimiento() : null)
                .telefono(perfil != null ? perfil.getTelefono() : null)
                .lada(perfil != null ? perfil.getLada() : null)
                .username(perfil != null ? perfil.getUsername() : null)
                .tiene2FAHabilitado(tiene2FA)
                .documentosSubidos(documentosSubidos)
                .ultimaActividad(ultimaActividad)
                .build();
    }

    // Métodos auxiliares privados

    private String getFileExtension(String filename) {
        if (filename == null)
            return "";
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot) : "";
    }

    private String generarSecretKey() {
        // Implementar generación de secret key para TOTP
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }

    private String generarCodigoBackup() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }

    private boolean verificarTOTP(String secretKey, String codigo) {
        // Implementar verificación TOTP real
        // Por simplicidad, simulamos la verificación
        return codigo.length() == 6 && codigo.matches("\\d+");
    }

    private String calcularNivelSeguridad(long documentosAprobados, boolean auth2FAHabilitada) {
        if (auth2FAHabilitada && documentosAprobados >= 2) {
            return "ALTO";
        } else if (documentosAprobados >= 1 || auth2FAHabilitada) {
            return "MEDIO";
        } else {
            return "BAJO";
        }
    }

    private List<TransaccionResponse> obtenerUltimasTransacciones(Usuario usuario, int limite) {
        return transaccionRepository.findByUsuarioOrderByFechaCreacionDesc(usuario, PageRequest.of(0, limite))
                .getContent()
                .stream()
                .map(this::convertirATransaccionResponse)
                .collect(Collectors.toList());
    }

    // Métodos de conversión

    private DocumentoIdentidadResponse convertirADocumentoResponse(DocumentoIdentidad documento) {
        return DocumentoIdentidadResponse.builder()
                .idDocumento(documento.getIdDocumento())
                .tipoDocumento(documento.getTipoDocumento().name())
                .tipoDocumentoDescripcion(documento.getTipoDocumento().getDescripcion())
                .nombreArchivo(documento.getNombreArchivo())
                .urlArchivo(documento.getUrlArchivo())
                .estado(documento.getEstado().name())
                .estadoDescripcion(documento.getEstado().getDescripcion())
                .fechaSubida(documento.getFechaSubida())
                .fechaVerificacion(documento.getFechaVerificacion())
                .comentariosVerificacion(documento.getComentariosVerificacion())
                .build();
    }

    private TransaccionResponse convertirATransaccionResponse(Transaccion transaccion) {
        return TransaccionResponse.builder()
                .idTransaccion(transaccion.getIdTransaccion())
                .tipo(transaccion.getTipo().name())
                .tipoDescripcion(transaccion.getTipo().getDescripcion())
                .monto(transaccion.getMonto())
                .descripcion(transaccion.getDescripcion())
                .estado(transaccion.getEstado().name())
                .estadoDescripcion(transaccion.getEstado().getDescripcion())
                .referenciaExterna(transaccion.getReferenciaExterna())
                .metodoPago(transaccion.getMetodoPago())
                .fechaCreacion(transaccion.getFechaCreacion())
                .fechaProcesamiento(transaccion.getFechaProcesamiento())
                .comentarios(transaccion.getComentarios())
                .comision(transaccion.getComision())
                .montoNeto(transaccion.getMontoNeto())
                .build();
    }

    private TicketSoporteResponse convertirATicketResponse(TicketSoporte ticket) {
        return TicketSoporteResponse.builder()
                .idTicket(ticket.getIdTicket())
                .asunto(ticket.getAsunto())
                .categoria(ticket.getCategoria().name())
                .categoriaDescripcion(ticket.getCategoria().getDescripcion())
                .prioridad(ticket.getPrioridad().name())
                .prioridadDescripcion(ticket.getPrioridad().getDescripcion())
                .estado(ticket.getEstado().name())
                .estadoDescripcion(ticket.getEstado().getDescripcion())
                .descripcion(ticket.getDescripcion())
                .fechaCreacion(ticket.getFechaCreacion())
                .fechaActualizacion(ticket.getFechaActualizacion())
                .fechaCierre(ticket.getFechaCierre())
                .agenteAsignado(ticket.getAgenteAsignado() != null ? ticket.getAgenteAsignado().getEmail() : null)
                .build();
    }

    private Autenticacion2FAResponse convertirAAutenticacion2FAResponse(Autenticacion2FA auth2FA) {
        return Autenticacion2FAResponse.builder()
                .habilitado(auth2FA.isHabilitado())
                .tipo(auth2FA.getTipo().name())
                .tipoDescripcion(auth2FA.getTipo().getDescripcion())
                .secretKey(auth2FA.getSecretKey())
                .qrCodeUrl("/api/auth/2fa/qr/" + auth2FA.getUsuario().getIdUsuario())
                .fechaActivacion(auth2FA.getFechaActivacion())
                .ultimoUso(auth2FA.getUltimoUso())
                .bloqueado(auth2FA.isBloqueado())
                .build();
    }

    @Override
    public List<GameHistory> obtenerHistorialDeJuegoByUserId(Long idUsuario, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Apuesta> apuestas = apuestaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario, pageable)
                .getContent();

        List<GameHistory> gameHistory = new ArrayList<GameHistory>();

        for (Apuesta apuesta : apuestas) {
            gameHistory.add(
                    GameHistory.builder()
                            .id(apuesta.getId())
                            .tipo(GameType.APUESTA)
                            .fecha(apuesta.getFechaCreacion())
                            .descripcion(apuesta.getDescripcion())
                            .monto(apuesta.getMontoApostado())
                            .resultado(apuesta.getMontoGanancia())
                            .estado(apuesta.getEstado().name())
                            .build());
        }

        return gameHistory;
    }
}
