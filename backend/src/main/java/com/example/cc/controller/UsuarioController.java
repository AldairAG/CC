package com.example.cc.controller;

import com.example.cc.dto.request.LoginRequest;
import com.example.cc.dto.request.NuevoUsuarioRequest;
import com.example.cc.dto.response.LoginResponse;
import com.example.cc.entities.Usuario;
import com.example.cc.service.usuario.IUsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/cc/usuarios")
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        return usuarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> createUsuario(@RequestBody NuevoUsuarioRequest usuario) {
        if (usuarioService.existsByEmail(usuario.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(usuarioService.save(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long id, @RequestBody NuevoUsuarioRequest usuario) {
        return usuarioService.findById(id)
                .map(existingUsuario -> {
                    return ResponseEntity.ok(usuarioService.save(usuario));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/saldo")
    public ResponseEntity<Void> updateSaldo(@PathVariable Long id, @RequestParam BigDecimal nuevoSaldo) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.updateSaldo(id, nuevoSaldo);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/estado-cuenta")
    public ResponseEntity<Void> actualizarEstadoCuenta(@PathVariable Long id, @RequestParam boolean estado) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.actualizarEstadoCuenta(id, estado);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> getUsuarioByEmail(@PathVariable String email) {
        return usuarioService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginRequest credentials) {
        try {
            LoginResponse loginResponse = usuarioService.authenticateUsuario(
                credentials.getEmail(),
                credentials.getPassword()
            );
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            LoginResponse errorResponse = LoginResponse.builder()
                .error(e.getMessage())
                .build();
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(errorResponse);
        }
    }
}
