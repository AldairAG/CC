package com.example.cc.entities.enums;

public enum TipoApuesta {
    GANADOR_PARTIDO("Ganador del Partido"),
    MARCADOR_EXACTO("Marcador Exacto"),
    TOTAL_GOLES("Total de Goles"),
    AMBOS_EQUIPOS_ANOTAN("Ambos Equipos Anotan"),
    PRIMER_GOLEADOR("Primer Goleador"),
    HANDICAP("Hándicap"),
    MITAD_TIEMPO("Resultado Primer Tiempo"),
    DOBLE_OPORTUNIDAD("Doble Oportunidad"),
    GOLES_MAS_MENOS("Más/Menos Goles"),
    CORNER_KICKS("Córners");

    private final String descripcion;

    TipoApuesta(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
