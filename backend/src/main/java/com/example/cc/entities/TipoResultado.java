package com.example.cc.entities;

public enum TipoResultado {
    LOCAL("Victoria Equipo Local"),
    VISITANTE("Victoria Equipo Visitante"), 
    EMPATE("Empate"),
    OVER("Más de X goles/puntos"),
    UNDER("Menos de X goles/puntos"),
    HANDICAP_LOCAL("Hándicap Local"),
    HANDICAP_VISITANTE("Hándicap Visitante"),
    PRIMER_GOLEADOR("Primer Goleador"),
    TOTAL_GOLES("Total de Goles"),
    AMBOS_EQUIPOS_ANOTAN("Ambos Equipos Anotan");

    private final String descripcion;

    TipoResultado(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    // Método para verificar si es un resultado básico (1X2)
    public boolean esResultadoBasico() {
        return this == LOCAL || this == VISITANTE || this == EMPATE;
    }

    // Método para verificar si es un resultado especial
    public boolean esResultadoEspecial() {
        return !esResultadoBasico();
    }
}
