package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(nullable = false)
    private String password; // Hash de la contraseña
    @Column(nullable = false,columnDefinition = "VARCHAR(255) DEFAULT 'True'")
    private Boolean estadoCuenta = true; // true = activo, false = inactivo
    @Column(nullable = false)
    private BigDecimal saldoUsuario;
    @Column(nullable = false, unique = true)
    private String email;

    @ManyToMany
    @JoinTable(name = "Usuario_Rol", joinColumns = @JoinColumn(name = "id_usuario"), inverseJoinColumns = @JoinColumn(name = "id_rol"))
    @JsonIgnore
    private Set<Rol> roles;
      @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Perfil perfil;
    

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DocumentoIdentidad> documentos;
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Transaccion> transacciones;
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TicketSoporte> tickets;
    
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Autenticacion2FA autenticacion2FA;
}