package com.example.cc.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class TicketSoporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTicket;
    
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
    
    private String asunto;
    
    @Enumerated(EnumType.STRING)
    private CategoriaTicket categoria;
    
    @Enumerated(EnumType.STRING)
    private PrioridadTicket prioridad = PrioridadTicket.MEDIA;
    
    @Enumerated(EnumType.STRING)
    private EstadoTicket estado = EstadoTicket.ABIERTO;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    private LocalDateTime fechaActualizacion;
    private LocalDateTime fechaCierre;
    
    @ManyToOne
    @JoinColumn(name = "id_agente_asignado")
    private Usuario agenteAsignado;
    
    public enum CategoriaTicket {
        CUENTA("Problemas de Cuenta"),
        PAGOS("Problemas de Pagos"),
        TECNICO("Problemas Técnicos"),
        QUEJA("Quejas"),
        SUGERENCIA("Sugerencias"),
        VERIFICACION("Verificación de Cuenta"),
        OTRO("Otro");
        
        private final String descripcion;
        
        CategoriaTicket(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
    
    public enum PrioridadTicket {
        BAJA("Baja"),
        MEDIA("Media"),
        ALTA("Alta"),
        CRITICA("Crítica");
        
        private final String descripcion;
        
        PrioridadTicket(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
    
    public enum EstadoTicket {
        ABIERTO("Abierto"),
        EN_PROGRESO("En Progreso"),
        ESPERANDO_CLIENTE("Esperando Respuesta del Cliente"),
        RESUELTO("Resuelto"),
        CERRADO("Cerrado");
        
        private final String descripcion;
        
        EstadoTicket(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
}
