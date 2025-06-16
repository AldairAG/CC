package com.example.cc.dto.request;

import lombok.Data;

@Data
public class NuevoUsuarioRequest {
    private String password;
    private String email;
    private String telefono;
    private String nombres;
    private String apellidos;
    private String fechaNacimiento;
    private String lada;
    private String username;
}
