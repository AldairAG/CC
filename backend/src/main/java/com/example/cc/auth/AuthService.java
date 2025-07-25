package com.example.cc.auth;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.cc.entities.Rol;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String SECRET_KEY = "+_key_C4puccin0_+r3vol_de_7_h0j4$"; // Clave secreta para firmar el JWT

    private static final Long EXPIRATION_TIME = (long) 864_000_000; // Tiempo de expiración (10 días)

    public String authenticate(String email, String password, String encodePassword, Set<Rol> roles) {

        if (!passwordEncoder.matches(password, encodePassword)) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

        List<String> roleNames = roles.stream()
                .map(Rol::getNombreRol)
                .toList();

        // Genera el token JWT
        return Jwts.builder()
                .setSubject(email)
                .claim("roles", roleNames)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

}
