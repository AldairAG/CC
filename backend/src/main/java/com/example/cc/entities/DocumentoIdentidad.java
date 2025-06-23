package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class DocumentoIdentidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDocumento;
    
    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
    
    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;
    
    private String nombreArchivo;
    private String rutaArchivo;
    private String urlArchivo;
    
    @Enumerated(EnumType.STRING)
    private EstadoVerificacion estado = EstadoVerificacion.PENDIENTE;
    
    private LocalDateTime fechaSubida;
    private LocalDateTime fechaVerificacion;
    private String comentariosVerificacion;
    
    public enum TipoDocumento {
        INE("Credencial de Elector"),
        COMPROBANTE_DOMICILIO("Comprobante de Domicilio"),
        PASAPORTE("Pasaporte"),
        CEDULA("Cédula de Identidad");
        
        private final String descripcion;
        
        TipoDocumento(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
    
    public enum EstadoVerificacion {
        PENDIENTE("Pendiente de Revisión"),
        APROBADO("Aprobado"),
        RECHAZADO("Rechazado"),
        EN_REVISION("En Revisión");
        
        private final String descripcion;
        
        EstadoVerificacion(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
}
