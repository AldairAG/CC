package com.example.cc.service.usuario;

import com.example.cc.entities.Perfil;
import com.example.cc.entities.Rol;
import com.example.cc.entities.Usuario;
import com.example.cc.repository.RolRepository;
import com.example.cc.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.cc.auth.AuthService;
import com.example.cc.constants.ROLES;
import com.example.cc.dto.request.NuevoUsuarioRequest;
import com.example.cc.dto.response.LoginResponse;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UsuarioServiceImpl implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    @Transactional
    public Usuario save(NuevoUsuarioRequest request) {

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setSaldoUsuario(BigDecimal.ZERO);

        Set<Rol> roles = new HashSet<>();

        // Recuperar el rol desde la base de datos
        Rol rol = rolRepository.findByNombreRol(ROLES.CLIENTE_STRING)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        roles.add(rol);
        usuario.setRoles(roles);

        // Crear perfil
        Perfil perfil = new Perfil();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date fechaNacimiento = dateFormat.parse(request.getFechaNacimiento());
            perfil.setFechaNacimiento(fechaNacimiento);
        } catch (ParseException e) {
            throw new RuntimeException("Error al parsear la fecha de nacimiento", e);
        }

        perfil.setNombre(request.getNombres());
        perfil.setApellido(request.getApellidos());
        perfil.setTelefono(request.getTelefono());
        perfil.setFechaRegistro(new Date());
        perfil.setLada(request.getLada());
        perfil.setUsername(request.getUsername());

        usuario.setPerfil(perfil);
        perfil.setUsuario(usuario);

        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public void updateSaldo(Long id, BigDecimal nuevoSaldo) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setSaldoUsuario(nuevoSaldo);
            usuarioRepository.save(usuario);
        }
    }

    @Override
    @Transactional
    public void actualizarEstadoCuenta(Long id, boolean estado) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setEstadoCuenta(estado);
            usuarioRepository.save(usuario);
        }
    }

    @Override
    @Transactional
    public LoginResponse authenticateUsuario(String email, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (!usuarioOpt.isPresent()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        if (!usuario.getEstadoCuenta()) {
            throw new RuntimeException("La cuenta está inactiva");
        }
        String token = authService.authenticate(email, password, usuario.getPassword(), usuario.getRoles());

        LoginResponse loginResponse = LoginResponse.builder()
                .token(token)
                .usuario(usuario)
                .build();

        return loginResponse;
    }
}
