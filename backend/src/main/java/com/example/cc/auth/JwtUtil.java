package com.example.cc.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.cc.entities.Rol;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.crypto.spec.SecretKeySpec;

@Component
public class JwtUtil {

    /* @Value("${jwt.secret}") */
    private String secretKey= "+_key_C4puccin0_+r3vol_de_7_h0j4$"; // Clave secreta para firmar el JWT

    /* @Value("${jwt.expiration}") */
    private Long expirationTime= 864_000_000L; // Tiempo de expiración en milisegundos (10 días)

    private final Key SECRET_KEY = new SecretKeySpec(
            Base64.getEncoder().encode(secretKey.getBytes(StandardCharsets.UTF_8)),
            "HmacSHA256");

    // Generar un token JWT
    public String generateToken(String email, Set<String> roles) {

        List<String> roleNames = roles.stream()
                .toList();

        return Jwts.builder()
                .setSubject(email)
                .claim("roles", roleNames)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 864_000_000)) // 10 días
                .signWith(SECRET_KEY)
                .compact();
    }

    // Validar un token JWT
    public boolean validateToken(String token, String username) {
        return (extractUsername(token).equals(username) && !isTokenExpired(token));
    }

    // Verificar si el token ha expirado
    private boolean isTokenExpired(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration()
                .after(new Date());
    }

    // Extraer el email (username) del token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}