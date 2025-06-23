package com.example.cc.entities.enums;

public enum EstadoApuesta {
    PENDIENTE("Pendiente"),
    GANADA("Ganada"),
    PERDIDA("Perdida"),
    CANCELADA("Cancelada"),
    REEMBOLSADA("Reembolsada"),
    EN_VIVO("En Vivo");

    private final String descripcion;

    EstadoApuesta(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
