package com.example.cc.repository;

import com.example.cc.entities.Autenticacion2FA;
import com.example.cc.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface Autenticacion2FARepository extends JpaRepository<Autenticacion2FA, Long> {
    Optional<Autenticacion2FA> findByUsuario(Usuario usuario);
    boolean existsByUsuarioAndHabilitadoTrue(Usuario usuario);
}
