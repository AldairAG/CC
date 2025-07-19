package com.example.cc.service.admin;

import com.example.cc.dto.admin.*;
import com.example.cc.entities.*;
import com.example.cc.entities.Apuesta.EstadoApuesta;
import com.example.cc.entities.CryptoTransaction.TransactionStatus;
import com.example.cc.entities.CryptoTransaction.TransactionType;
import com.example.cc.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ApuestaRepository apuestaRepository;

    @Autowired
    private QuinielaRepository quinielaRepository;

    @Autowired
    private EventoDeportivoRepository eventoDeportivoRepository;

    @Autowired
    private CryptoTransactionRepository cryptoTransactionRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AdminStatsDto getGeneralStats() {
        // Obtener estadísticas básicas que sí existen
        long totalUsuarios = usuarioRepository.count();
        long totalApuestas = apuestaRepository.count();
        long totalQuinielas = quinielaRepository.count();
        long totalEventos = eventoDeportivoRepository.count();

        return AdminStatsDto.builder()
                .totalUsuarios(totalUsuarios)
                .usuariosActivos(totalUsuarios) // Simplificado por ahora
                .usuariosNuevosHoy(5L) // Valor por defecto
                .totalApuestas(totalApuestas)
                .apuestasActivas(100L) // Valor por defecto
                .montoTotalApuestas(new BigDecimal("125000.50"))
                .ingresosTotales(new BigDecimal("12500.05"))
                .totalQuinielas(totalQuinielas)
                .quinielasActivas(12L)
                .totalEventos(totalEventos)
                .eventosHoy(25L)
                .totalTransaccionesCrypto(cryptoTransactionRepository.count())
                .volumenCryptoHoy(new BigDecimal("45000.00"))
                .build();
    }

    @Override
    public CryptoTransaction approveCryptoTransaction(Long id) {
        Optional<CryptoTransaction> transaccion = cryptoTransactionRepository.findById(id);

        if (!transaccion.isPresent()) {
            throw new RuntimeException("No existe esta transaccion");
        }

        Optional<Usuario> usuario = usuarioRepository.findById(transaccion.get().getUserId());

        if (!usuario.isPresent()) {
            throw new RuntimeException("No existe un usuario relacionado a esta transaccion");
        }

        CryptoTransaction newTransaction = new CryptoTransaction();

        if (TransactionType.MANUAL_DEPOSIT_REQUEST.equals(transaccion.get().getType())) {
            // Lógica para aprobar depósito
            transaccion.get().setStatus(TransactionStatus.APPROVED);
            usuario.get().setSaldoUsuario(transaccion.get().getUsdAmount().add(usuario.get().getSaldoUsuario()));
            usuarioRepository.save(usuario.get());
            newTransaction=cryptoTransactionRepository.save(transaccion.get());
            return newTransaction;
        } else if (TransactionType.MANUAL_WITHDRAWAL_REQUEST.equals(transaccion.get().getType())) {
            // Lógica para aprobar retiro
            transaccion.get().setStatus(TransactionStatus.APPROVED);
            newTransaction=cryptoTransactionRepository.save(transaccion.get());
            return newTransaction;
        } else {
            throw new RuntimeException("tipo de transaccion invalido");
        }
    }

    @Override
    public CryptoTransaction rejectCryptoTransaction(Long id) {
        Optional<CryptoTransaction> transaccion = cryptoTransactionRepository.findById(id);

        if (!transaccion.isPresent()) {
            throw new RuntimeException("No existe esta transaccion");
        }

        Optional<Usuario> usuario = usuarioRepository.findById(transaccion.get().getUserId());

        if (!usuario.isPresent()) {
            throw new RuntimeException("No existe un usuario relacionado a esta transaccion");
        }

        CryptoTransaction newTransaction = new CryptoTransaction();

        if (TransactionType.MANUAL_DEPOSIT_REQUEST.equals(transaccion.get().getType())) {
            // Lógica para aprobar depósito
            transaccion.get().setStatus(TransactionStatus.REJECTED);
            newTransaction=cryptoTransactionRepository.save(transaccion.get());
            
            return newTransaction;
        } else if (TransactionType.MANUAL_WITHDRAWAL_REQUEST.equals(transaccion.get().getType())) {
            // Lógica para aprobar retiro
            transaccion.get().setStatus(TransactionStatus.REJECTED);
            usuario.get().setSaldoUsuario(transaccion.get().getUsdAmount().add(usuario.get().getSaldoUsuario()));
            usuarioRepository.save(usuario.get());
            newTransaction=cryptoTransactionRepository.save(transaccion.get());
            return newTransaction;
        } else {
            throw new RuntimeException("tipo de transaccion invalido");
        }
    }

    @Override
    public Map<String, Object> getDashboardData() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("stats", getGeneralStats());
        dashboard.put("recentUsers", Collections.emptyList()); // TODO: Implementar
        dashboard.put("recentBets", Collections.emptyList()); // TODO: Implementar
        dashboard.put("alerts", Collections.emptyList()); // TODO: Implementar
        return dashboard;
    }

    @Override
    public Page<AdminUserDto> getAllUsers(Pageable pageable) {
        Page<Usuario> usuariosPage = usuarioRepository.findAll(pageable);

        List<AdminUserDto> userDtos = usuariosPage.getContent().stream()
                .map(this::convertirToAdminUserDto)
                .collect(Collectors.toList());

        return new PageImpl<>(userDtos, pageable, usuariosPage.getTotalElements());
    }

    private AdminUserDto convertirToAdminUserDto(Usuario usuario) {
        // Calcular estadísticas básicas del usuario
        List<Apuesta> apuestasUsuario = apuestaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
        BigDecimal montoTotalApostado = apuestasUsuario.stream()
                .map(Apuesta::getMontoApostado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminUserDto.builder()
                .activo(usuario.getEstadoCuenta())
                .apellidos(usuario.getPerfil().getApellido())
                .email(usuario.getEmail())
                .estado(usuario.getEstado())
                .fechaCreacion(usuario.getPerfil().getFechaRegistro().toString())
                .fechaNacimiento(usuario.getPerfil().getFechaNacimiento().toString())
                .idUsuario(usuario.getIdUsuario())
                .montoTotalApostado(montoTotalApostado)
                .nombreCompleto(usuario.getPerfil().getNombre())
                .rol(usuario.getRoles().stream().findFirst().get().getNombreRol())
                .saldoUsuario(usuario.getSaldoUsuario())
                .telefono(usuario.getPerfil().getTelefono())
                .username(usuario.getPerfil().getUsername())
                .documentos(usuario.getDocumentos().isEmpty()? new ArrayList<DocumentoIdentidad>():usuario.getDocumentos())
                .build();

    }

    @Override
    public Usuario getUserById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        return usuario;
    }

    @Override
    public Usuario createUser(CreateUserRequestDto request) {
        // Verificar que el email no exista
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con este email: " + request.getEmail());
        }

        // Crear nuevo usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(request.getPassword()));
        nuevoUsuario.setSaldoUsuario(BigDecimal.ZERO);
        nuevoUsuario.setEstadoCuenta(true);

        // Crear perfil
        Perfil perfil = new Perfil();
        perfil.setUsername(request.getUsername());
        perfil.setNombre(request.getNombreCompleto() != null ? request.getNombreCompleto() : "");
        perfil.setApellido(request.getApellidos() != null ? request.getApellidos() : "");
        perfil.setTelefono(request.getTelefono());
        perfil.setFechaNacimiento(request.getFechaNacimiento());
        perfil.setFechaRegistro(new Date());
        perfil.setUsuario(nuevoUsuario);

        nuevoUsuario.setPerfil(perfil);

        // Asignar rol por defecto (usuario común)
        Set<Rol> roles = new HashSet<>();
        // Por ahora usar rol existente o crear uno básico
        roles.add(Rol.builder().nombreRol("USER").build());
        nuevoUsuario.setRoles(roles);

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        return usuarioGuardado;
    }

    @Override
    public Usuario updateUser(Long id, UpdateUserRequestDto request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // Actualizar datos del perfil
        if (usuario.getPerfil() != null) {
            Perfil perfil = usuario.getPerfil();
            if (request.getUsername() != null)
                perfil.setUsername(request.getUsername());
            if (request.getNombreCompleto() != null)
                perfil.setNombre(request.getNombreCompleto());
            if (request.getApellidos() != null)
                perfil.setApellido(request.getApellidos());
            if (request.getTelefono() != null)
                perfil.setTelefono(request.getTelefono());
            if (request.getFechaNacimiento() != null)
                perfil.setFechaNacimiento(request.getFechaNacimiento());
        }

        // Actualizar email si es diferente
        if (request.getEmail() != null && !request.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Ya existe un usuario con este email: " + request.getEmail());
            }
            usuario.setEmail(request.getEmail());
        }

        // Actualizar estado
        if (request.getEstado() != null) {
            usuario.setEstadoCuenta("ACTIVO".equals(request.getEstado()));
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return usuarioActualizado;
    }

    @Override
    public void deleteUser(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // Verificar que el usuario no tenga apuestas activas
        List<Apuesta> apuestasActivas = apuestaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario)
                .stream()
                .filter(a -> a.getEstado() == EstadoApuesta.PENDIENTE)
                .collect(Collectors.toList());

        if (!apuestasActivas.isEmpty()) {
            throw new RuntimeException("No se puede eliminar el usuario porque tiene apuestas activas");
        }

        usuarioRepository.delete(usuario);
    }

    @Override
    public void suspendUser(Long id, String motivo) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        usuario.setEstadoCuenta(false);
        usuarioRepository.save(usuario);

        // TODO: Registrar motivo de suspensión en tabla de auditoría
        System.out.println("Usuario suspendido: " + id + " - Motivo: " + motivo);
    }

    @Override
    public void reactivateUser(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        usuario.setEstadoCuenta(true);
        usuarioRepository.save(usuario);

        System.out.println("Usuario reactivado: " + id);
    }

    @Override
    public List<Usuario> getUsersByRole(String role) {
        // Implementación simplificada - obtener todos los usuarios por ahora
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios;
    }

    @Override
    public List<Usuario> getUsersByStatus(String status) {
        boolean estadoCuenta = "ACTIVO".equals(status);
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios;
    }

    @Override
    public Page<AdminBetDto> getAllBets(Pageable pageable) {
        Page<Apuesta> apuestasPage = apuestaRepository.findAll(pageable);

        List<AdminBetDto> betDtos = apuestasPage.getContent().stream()
                .map(this::convertToAdminBetDto)
                .collect(Collectors.toList());

        return new PageImpl<>(betDtos, pageable, apuestasPage.getTotalElements());
    }

    private AdminBetDto convertToAdminBetDto(Apuesta apuesta) {

        return AdminBetDto.builder()
                .idApuesta(apuesta.getId())
                .usuarioUsername(apuesta.getUsuario().getPerfil().getUsername())
                .tipoApuesta(apuesta.getTipoApuesta().toString())
                .montoApostado(apuesta.getMontoApostado())
                .cuotaApostada(apuesta.getCuotaEvento().getValorCuota())
                .gananciasPotenciales(apuesta.getMontoGanancia())
                .estado(apuesta.getEstado().toString())
                .fechaCreacion(apuesta.getFechaCreacion())
                .fechaEvento(apuesta.getEventoDeportivo().getFechaEvento())
                .eventoNombre(apuesta.getEventoDeportivo().getNombreEvento())
                .build();
    }

    @Override
    public AdminBetDto getBetById(Long id) {
        Apuesta apuesta = apuestaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apuesta no encontrada con ID: " + id));

        return convertToAdminBetDto(apuesta);
    }

    @Override
    public AdminBetDto updateBetStatus(Long id, UpdateBetStatusDto request) {
        Apuesta apuesta = apuestaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apuesta no encontrada con ID: " + id));

        EstadoApuesta nuevoEstado = EstadoApuesta.valueOf(request.getEstado());
        EstadoApuesta estadoAnterior = apuesta.getEstado();

        apuesta.setEstado(nuevoEstado);

        // Si se marca como resuelta, actualizar si es ganadora
        if (nuevoEstado == EstadoApuesta.RESUELTA) {
            apuesta.setEsGanadora(request.getIsGanadora());

            // Si es ganadora, agregar ganancias al saldo del usuario
            if (request.getIsGanadora() && (estadoAnterior != EstadoApuesta.RESUELTA || apuesta.getEsGanadora() == null
                    || !apuesta.getEsGanadora())) {
                Usuario usuario = apuesta.getUsuario();
                BigDecimal ganancias = apuesta.getMontoPotencialGanancia();
                usuario.setSaldoUsuario(usuario.getSaldoUsuario().add(ganancias));
                usuarioRepository.save(usuario);
            }
        }

        Apuesta apuestaActualizada = apuestaRepository.save(apuesta);
        return convertToAdminBetDto(apuestaActualizada);
    }

    @Override
    public void cancelBet(Long id, String motivo) {
        Apuesta apuesta = apuestaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apuesta no encontrada con ID: " + id));

        if (apuesta.getEstado() != EstadoApuesta.PENDIENTE) {
            throw new RuntimeException("Solo se pueden cancelar apuestas pendientes");
        }

        apuesta.setEstado(EstadoApuesta.CANCELADA);

        // Devolver el dinero al usuario
        Usuario usuario = apuesta.getUsuario();
        usuario.setSaldoUsuario(usuario.getSaldoUsuario().add(apuesta.getMontoApostado()));
        usuarioRepository.save(usuario);

        apuestaRepository.save(apuesta);
        System.out.println("Apuesta cancelada: " + id + " - Motivo: " + motivo);
    }

    @Override
    public List<AdminBetDto> getBetsByUser(Long userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Apuesta> apuestas = apuestaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
        return apuestas.stream()
                .map(this::convertToAdminBetDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AdminBetDto> getBetsByEvent(Long eventId) {
        EventoDeportivo evento = eventoDeportivoRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        List<Apuesta> apuestas = apuestaRepository.findByEventoDeportivo(evento);
        return apuestas.stream()
                .map(this::convertToAdminBetDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AdminBetDto> getBetsByDateRange(LocalDateTime start, LocalDateTime end) {
        List<Apuesta> apuestas = new ArrayList<>();
        return apuestas.stream()
                .map(this::convertToAdminBetDto)
                .collect(Collectors.toList());
    }

    @Override
    public BigDecimal getTotalBetsAmount() {
        List<Apuesta> apuestas = apuestaRepository.findAll();
        return apuestas.stream()
                .map(Apuesta::getMontoApostado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public Map<String, Object> getBetsStatistics() {
        List<Apuesta> todasApuestas = apuestaRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", todasApuestas.size());
        stats.put("activas", todasApuestas.stream()
                .filter(a -> a.getEstado() == EstadoApuesta.PENDIENTE).count());
        stats.put("ganadas", todasApuestas.stream()
                .filter(a -> a.getEstado() == EstadoApuesta.RESUELTA && a.getEsGanadora() != null && a.getEsGanadora())
                .count());
        stats.put("perdidas", todasApuestas.stream()
                .filter(a -> a.getEstado() == EstadoApuesta.RESUELTA
                        && (a.getEsGanadora() == null || !a.getEsGanadora()))
                .count());
        stats.put("canceladas", todasApuestas.stream()
                .filter(a -> a.getEstado() == EstadoApuesta.CANCELADA).count());
        stats.put("montoTotal", getTotalBetsAmount());

        return stats;
    }

    // Métodos de quinielas
    @Override
    public Page<AdminQuinielaDto> getAllQuinielas(Pageable pageable) {
        Page<Quiniela> quinielasPage = quinielaRepository.findAll(pageable);
        List<AdminQuinielaDto> quinielaDtos = quinielasPage.getContent().stream()
                .map(this::convertToAdminQuinielaDto)
                .collect(Collectors.toList());
        return new PageImpl<>(quinielaDtos, pageable, quinielasPage.getTotalElements());
    }

    private AdminQuinielaDto convertToAdminQuinielaDto(Quiniela quiniela) {
        return AdminQuinielaDto.builder()
                .idQuiniela(quiniela.getId())
                .codigo(quiniela.getCodigoUnico())
                .nombre(quiniela.getNombre())
                .descripcion(quiniela.getDescripcion())
                .montoEntrada(quiniela.getCostoParticipacion())
                .estado("ACTIVA") // Simplificado
                .fechaCreacion(quiniela.getFechaCreacion())
                .build();
    }

    @Override
    public AdminQuinielaDto getQuinielaById(Long id) {
        Quiniela quiniela = quinielaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiniela no encontrada"));
        return convertToAdminQuinielaDto(quiniela);
    }

    @Override
    public AdminQuinielaDto createQuiniela(CreateQuinielaRequestDto request) {
        // TODO: Implementar creación real
        return AdminQuinielaDto.builder()
                .idQuiniela(System.currentTimeMillis())
                .codigo(request.getCodigo())
                .nombre(request.getNombre())
                .build();
    }

    @Override
    public AdminQuinielaDto updateQuiniela(Long id, CreateQuinielaRequestDto request) {
        return getQuinielaById(id);
    }

    @Override
    public void deleteQuiniela(Long id) {
        quinielaRepository.deleteById(id);
    }

    @Override
    public void finalizeQuiniela(Long id) {
        System.out.println("Finalizando quiniela: " + id);
    }

    @Override
    public void cancelQuiniela(Long id, String motivo) {
        System.out.println("Cancelando quiniela " + id + " por: " + motivo);
    }

    @Override
    public List<AdminQuinielaDto> getQuinielasByStatus(String status) {
        return Collections.emptyList();
    }

    @Override
    public List<AdminQuinielaDto> getQuinielasByCreator(Long creatorId) {
        return Collections.emptyList();
    }

    @Override
    public Map<String, Object> getQuinielasStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", quinielaRepository.count());
        stats.put("activas", 12L);
        stats.put("finalizadas", 65L);
        stats.put("canceladas", 8L);
        return stats;
    }

    // Métodos de eventos
    @Override
    public Page<AdminEventDto> getAllEvents(Pageable pageable) {
        Page<EventoDeportivo> eventosPage = eventoDeportivoRepository.findAll(pageable);
        List<AdminEventDto> eventDtos = eventosPage.getContent().stream()
                .map(this::convertToAdminEventDto)
                .collect(Collectors.toList());
        return new PageImpl<>(eventDtos, pageable, eventosPage.getTotalElements());
    }

    private AdminEventDto convertToAdminEventDto(EventoDeportivo evento) {
        return AdminEventDto.builder()
                .idEvento(evento.getId())
                .nombre(evento.getDescripcion() != null ? evento.getDescripcion() : "Evento " + evento.getId())
                .equipoLocal(evento.getEquipoLocal())
                .equipoVisitante(evento.getEquipoVisitante())
                .fechaEvento(evento.getFechaEvento())
                .estado("PROGRAMADO")
                .build();
    }

    @Override
    public AdminEventDto getEventById(Long id) {
        EventoDeportivo evento = eventoDeportivoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
        return convertToAdminEventDto(evento);
    }

    @Override
    public AdminEventDto createEvent(CreateEventRequestDto request) {
        // TODO: Implementar creación real
        return AdminEventDto.builder()
                .idEvento(System.currentTimeMillis())
                .nombre(request.getNombre())
                .equipoLocal(request.getEquipoLocal())
                .equipoVisitante(request.getEquipoVisitante())
                .build();
    }

    @Override
    public AdminEventDto updateEvent(Long id, CreateEventRequestDto request) {
        return getEventById(id);
    }

    @Override
    public void deleteEvent(Long id) {
        eventoDeportivoRepository.deleteById(id);
    }

    @Override
    public AdminEventDto updateEventResult(Long id, String result, Integer golesLocal, Integer golesVisitante) {
        EventoDeportivo evento = eventoDeportivoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        evento.setResultado(result);
        evento.setMarcadorLocal(golesLocal);
        evento.setMarcadorVisitante(golesVisitante);
        eventoDeportivoRepository.save(evento);

        return convertToAdminEventDto(evento);
    }

    @Override
    public List<AdminEventDto> getEventsByLeague(String league) {
        return Collections.emptyList();
    }

    @Override
    public List<AdminEventDto> getEventsByStatus(String status) {
        return Collections.emptyList();
    }

    @Override
    public List<AdminEventDto> getEventsByDateRange(LocalDateTime start, LocalDateTime end) {
        return Collections.emptyList();
    }

    @Override
    public Map<String, Object> getEventsStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", eventoDeportivoRepository.count());
        return stats;
    }

    // Implementaciones stub para todos los métodos restantes
    @Override
    public Page<AdminNotificationDto> getAllNotifications(Pageable pageable) {
        return new PageImpl<>(Collections.emptyList(), pageable, 0);
    }

    @Override
    public AdminNotificationDto getNotificationById(Long id) {
        return AdminNotificationDto.builder().idNotificacion(id).build();
    }

    @Override
    public AdminNotificationDto createNotification(CreateNotificationRequestDto request) {
        return AdminNotificationDto.builder().idNotificacion(System.currentTimeMillis()).build();
    }

    @Override
    public AdminNotificationDto updateNotification(Long id, CreateNotificationRequestDto request) {
        return getNotificationById(id);
    }

    @Override
    public void deleteNotification(Long id) {
        System.out.println("Eliminando notificación: " + id);
    }

    @Override
    public void sendNotification(Long id) {
        System.out.println("Enviando notificación: " + id);
    }

    @Override
    public List<AdminNotificationDto> getNotificationsByType(String type) {
        return Collections.emptyList();
    }

    @Override
    public List<AdminNotificationDto> getNotificationsByStatus(String status) {
        return Collections.emptyList();
    }

    @Override
    public Map<String, Object> getNotificationsStatistics() {
        return Collections.emptyMap();
    }

    @Override
    public Page<AdminRoleDto> getAllRoles(Pageable pageable) {
        Page<Rol> rolesPage = rolRepository.findAll(pageable);
        List<AdminRoleDto> roleDtos = rolesPage.getContent().stream()
                .map(this::convertToAdminRoleDto)
                .collect(Collectors.toList());
        return new PageImpl<>(roleDtos, pageable, rolesPage.getTotalElements());
    }

    private AdminRoleDto convertToAdminRoleDto(Rol rol) {
        return AdminRoleDto.builder()
                .idRol(rol.getIdRol())
                .nombre(rol.getNombreRol())
                .codigo(rol.getNombreRol())
                .activo(true)
                .build();
    }

    @Override
    public AdminRoleDto getRoleById(Long id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        return convertToAdminRoleDto(rol);
    }

    @Override
    public AdminRoleDto createRole(CreateRoleRequestDto request) {
        return AdminRoleDto.builder()
                .idRol(System.currentTimeMillis())
                .nombre(request.getNombre())
                .build();
    }

    @Override
    public AdminRoleDto updateRole(Long id, CreateRoleRequestDto request) {
        return getRoleById(id);
    }

    @Override
    public void deleteRole(Long id) {
        rolRepository.deleteById(id);
    }

    @Override
    public List<AdminRoleDto> getRolesByCategory(String category) {
        return Collections.emptyList();
    }

    @Override
    public void assignRoleToUser(Long userId, Long roleId) {
        System.out.println("Asignando rol " + roleId + " a usuario " + userId);
    }

    @Override
    public void removeRoleFromUser(Long userId, Long roleId) {
        System.out.println("Removiendo rol " + roleId + " de usuario " + userId);
    }

    @Override
    public Page<AdminConfigDto> getAllConfigs(Pageable pageable) {
        return new PageImpl<>(Collections.emptyList(), pageable, 0);
    }

    @Override
    public AdminConfigDto getConfigById(Long id) {
        return AdminConfigDto.builder().idConfiguracion(id).build();
    }

    @Override
    public AdminConfigDto getConfigByKey(String key) {
        return AdminConfigDto.builder().clave(key).build();
    }

    @Override
    public AdminConfigDto updateConfig(UpdateConfigRequestDto request) {
        return getConfigById(request.getIdConfiguracion());
    }

    @Override
    public List<AdminConfigDto> getConfigsByCategory(String category) {
        return Collections.emptyList();
    }

    @Override
    public Map<String, AdminConfigDto> getConfigsByModule(String module) {
        return Collections.emptyMap();
    }

    @Override
    public void resetConfigToDefault(Long id) {
        System.out.println("Reseteando configuración: " + id);
    }

    @Override
    public Page<CryptoTransaction> getAllCryptoTransactions(Pageable pageable) {
        return cryptoTransactionRepository.findAll(pageable);
    }

    @Override
    public AdminCryptoDto getCryptoTransactionById(Long id) {
        return AdminCryptoDto.builder().idTransaccion(id).build();
    }

    @Override
    public AdminCryptoDto updateCryptoTransactionStatus(Long id, String status, String motivo) {
        return getCryptoTransactionById(id);
    }

    @Override
    public List<AdminCryptoDto> getCryptoTransactionsByUser(Long userId) {
        return Collections.emptyList();
    }

    @Override
    public List<AdminCryptoDto> getCryptoTransactionsByType(String type) {
        return Collections.emptyList();
    }

    @Override
    public List<AdminCryptoDto> getCryptoTransactionsByStatus(String status) {
        return Collections.emptyList();
    }

    @Override
    public List<AdminCryptoDto> getCryptoTransactionsByCurrency(String currency) {
        return Collections.emptyList();
    }

    @Override
    public Map<String, Object> getCryptoStatistics() {
        return Collections.emptyMap();
    }

    @Override
    public Map<String, Object> getUsersReport(LocalDateTime start, LocalDateTime end) {
        return Collections.emptyMap();
    }

    @Override
    public Map<String, Object> getBetsReport(LocalDateTime start, LocalDateTime end) {
        return Collections.emptyMap();
    }

    @Override
    public Map<String, Object> getFinancialReport(LocalDateTime start, LocalDateTime end) {
        return Collections.emptyMap();
    }

    @Override
    public Map<String, Object> getQuinielasReport(LocalDateTime start, LocalDateTime end) {
        return Collections.emptyMap();
    }

    @Override
    public Map<String, Object> getCryptoReport(LocalDateTime start, LocalDateTime end) {
        return Collections.emptyMap();
    }

    @Override
    public byte[] exportUsers(String format) {
        return new byte[0];
    }

    @Override
    public byte[] exportBets(String format, LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }

    @Override
    public byte[] exportQuinielas(String format, LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }

    @Override
    public byte[] exportCryptoTransactions(String format, LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }

    @Override
    public Page<Map<String, Object>> getAuditLogs(Pageable pageable) {
        return new PageImpl<>(Collections.emptyList(), pageable, 0);
    }

    @Override
    public List<Map<String, Object>> getAuditLogsByUser(Long userId) {
        return Collections.emptyList();
    }

    @Override
    public List<Map<String, Object>> getAuditLogsByAction(String action) {
        return Collections.emptyList();
    }

    @Override
    public List<Map<String, Object>> getAuditLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        return Collections.emptyList();
    }

    @Override
    public void bulkUpdateUserStatus(List<Long> userIds, String status, String motivo) {
        System.out.println("Actualizando estado masivo de usuarios: " + userIds);
    }

    @Override
    public void bulkCancelBets(List<Long> betIds, String motivo) {
        System.out.println("Cancelando apuestas masivas: " + betIds);
    }

    @Override
    public void bulkSendNotifications(Long notificationId, List<Long> userIds) {
        System.out.println("Enviando notificación " + notificationId + " a usuarios: " + userIds);
    }

    @Override
    public void bulkUpdateEventStatus(List<Long> eventIds, String status) {
        System.out.println("Actualizando estado masivo de eventos: " + eventIds);
    }

}
