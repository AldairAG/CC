package com.example.cc.dto.request;

import lombok.Data;

@Data
public class ActualizarPerfilRequest {
    private String nombre;
    private String apellido;
    private String telefono;
    private String fechaNacimiento;
    private String direccion;
    private String ciudad;
    private String codigoPostal;
    private String pais;
}
