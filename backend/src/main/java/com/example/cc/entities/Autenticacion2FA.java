package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Autenticacion2FA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAutenticacion;
    
    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
    
    private boolean habilitado = false;
    private String secretKey; // Para TOTP (Google Authenticator)
    private String codigoBackup; // Código de respaldo
    
    @Enumerated(EnumType.STRING)
    private TipoAutenticacion tipo = TipoAutenticacion.TOTP;
    
    private LocalDateTime fechaActivacion;
    private LocalDateTime ultimoUso;
    private int intentosFallidos = 0;
    private boolean bloqueado = false;
    private LocalDateTime fechaBloqueo;
    
    public enum TipoAutenticacion {
        TOTP("Aplicación Autenticadora (TOTP)"),
        SMS("Mensaje de Texto (SMS)"),
        EMAIL("Correo Electrónico");
        
        private final String descripcion;
        
        TipoAutenticacion(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
}
