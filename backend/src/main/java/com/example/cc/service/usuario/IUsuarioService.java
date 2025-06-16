package com.example.cc.service.usuario;

import com.example.cc.dto.request.NuevoUsuarioRequest;
import com.example.cc.dto.response.LoginResponse;
import com.example.cc.entities.Usuario;
import java.util.List;
import java.util.Optional;

public interface IUsuarioService {
    List<Usuario> findAll();
    Optional<Usuario> findById(Long id);
    Usuario save(NuevoUsuarioRequest usuario);
    void deleteById(Long id);
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    void updateSaldo(Long id, java.math.BigDecimal nuevoSaldo);
    void actualizarEstadoCuenta(Long id, boolean estado);
    LoginResponse authenticateUsuario(String email, String password);
}
