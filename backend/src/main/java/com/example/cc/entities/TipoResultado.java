package com.example.cc.entities;

public enum TipoResultado {
    // Resultado Final (1X2)
    LOCAL("Victoria Equipo Local"),
    VISITANTE("Victoria Equipo Visitante"), 
    EMPATE("Empate"),
    
    // Clasificación
    LOCAL_CLASIFICA("Equipo Local se clasifica"),
    VISITANTE_CLASIFICA("Equipo Visitante se clasifica"),
    
    // Doble Oportunidad
    LOCAL_EMPATE("Local o Empate"),
    LOCAL_VISITANTE("Local o Visitante"),
    VISITANTE_EMPATE("Visitante o Empate"),
    
    // Ambos Equipos Anotan
    AMBOS_ANOTAN("Ambos Equipos Anotan"),
    NO_AMBOS_ANOTAN("No Ambos Equipos Anotan"),
    
    // Total Goles Over/Under
    OVER_0_5("Over 0.5 Goles"),
    UNDER_0_5("Under 0.5 Goles"),
    OVER_1_5("Over 1.5 Goles"),
    UNDER_1_5("Under 1.5 Goles"),
    OVER_2_5("Over 2.5 Goles"),
    UNDER_2_5("Under 2.5 Goles"),
    OVER_3_5("Over 3.5 Goles"),
    UNDER_3_5("Under 3.5 Goles"),
    
    // Hándicap Resultado
    LOCAL_MINUS_2("Local (-2)"),
    EMPATE_MINUS_2("Empate (-2)"),
    VISITANTE_PLUS_2("Visitante (+2)"),
    LOCAL_MINUS_1("Local (-1)"),
    EMPATE_MINUS_1("Empate (-1)"),
    VISITANTE_PLUS_1("Visitante (+1)"),
    
    // Hándicap Asiático
    LOCAL_MINUS_0_5_1("Local (-0.5/-1)"),
    VISITANTE_PLUS_0_5_1("Visitante (+0.5/+1)"),
    LOCAL_MINUS_0_5("Local (-0.5)"),
    VISITANTE_PLUS_0_5("Visitante (+0.5)"),
    
    // Total Goles Asiático
    OVER_1_1_5("Over 1/1.5"),
    UNDER_1_1_5("Under 1/1.5"),
    OVER_0_5_1("Over 0.5/1"),
    UNDER_0_5_1("Under 0.5/1"),
    
    // Marcador Correcto
    MARCADOR_1_0("1-0"),
    MARCADOR_2_0("2-0"),
    MARCADOR_2_1("2-1"),
    MARCADOR_3_0("3-0"),
    MARCADOR_0_0("0-0"),
    MARCADOR_0_1("0-1"),
    MARCADOR_0_2("0-2"),
    MARCADOR_1_1("1-1"),
    MARCADOR_1_2("1-2"),
    MARCADOR_OTROS("Cualquier otro marcador"),
    
    // Primer Goleador
    PRIMER_GOLEADOR_1("Primer Goleador - Jugador 1"),
    PRIMER_GOLEADOR_2("Primer Goleador - Jugador 2"),
    PRIMER_GOLEADOR_3("Primer Goleador - Jugador 3"),
    PRIMER_GOLEADOR_4("Primer Goleador - Jugador 4"),
    PRIMER_GOLEADOR_5("Primer Goleador - Jugador 5"),
    NO_GOL("No gol"),
    
    // Tarjetas
    OVER_6_5_TARJETAS("Over 6.5 Tarjetas"),
    UNDER_6_5_TARJETAS("Under 6.5 Tarjetas"),
    OVER_4_5_TARJETAS("Over 4.5 Tarjetas"),
    UNDER_4_5_TARJETAS("Under 4.5 Tarjetas"),
    
    // Corners
    OVER_8_CORNERS("Over 8 Corners"),
    EXACTO_8_CORNERS("Exacto 8 Corners"),
    UNDER_8_CORNERS("Under 8 Corners"),
    OVER_6_CORNERS("Over 6 Corners"),
    EXACTO_6_CORNERS("Exacto 6 Corners"),
    UNDER_6_CORNERS("Under 6 Corners"),
    
    // Método de Clasificación
    LOCAL_TIEMPO_REGULAR("Local en tiempo regular"),
    VISITANTE_TIEMPO_REGULAR("Visitante en tiempo regular"),
    LOCAL_PENALTIS("Local en penaltis"),
    VISITANTE_PENALTIS("Visitante en penaltis"),
    
    // Segunda Mitad
    SEGUNDA_MITAD_OVER_1_5("2da Mitad Over 1.5"),
    SEGUNDA_MITAD_UNDER_1_5("2da Mitad Under 1.5"),
    SEGUNDA_MITAD_OVER_0_5("2da Mitad Over 0.5"),
    SEGUNDA_MITAD_UNDER_0_5("2da Mitad Under 0.5"),
    SEGUNDA_MITAD_AMBOS_ANOTAN("2da Mitad - Ambos Anotan"),
    SEGUNDA_MITAD_LOCAL("2da Mitad - Gana Local"),
    SEGUNDA_MITAD_EMPATE("2da Mitad - Empate"),
    SEGUNDA_MITAD_VISITANTE("2da Mitad - Gana Visitante"),
    
    // Tipos heredados del código anterior
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
    
    // Método para obtener el mercado al que pertenece
    public String getMercado() {
        switch (this) {
            case LOCAL:
            case VISITANTE:
            case EMPATE:
                return "resultado-final";
            case LOCAL_CLASIFICA:
            case VISITANTE_CLASIFICA:
                return "clasificacion";
            case LOCAL_EMPATE:
            case LOCAL_VISITANTE:
            case VISITANTE_EMPATE:
                return "doble-oportunidad";
            case AMBOS_ANOTAN:
            case NO_AMBOS_ANOTAN:
                return "ambos-anotan";
            case OVER_0_5:
            case UNDER_0_5:
            case OVER_1_5:
            case UNDER_1_5:
            case OVER_2_5:
            case UNDER_2_5:
            case OVER_3_5:
            case UNDER_3_5:
                return "total-goles";
            case LOCAL_MINUS_2:
            case EMPATE_MINUS_2:
            case VISITANTE_PLUS_2:
            case LOCAL_MINUS_1:
            case EMPATE_MINUS_1:
            case VISITANTE_PLUS_1:
                return "handicap-resultado";
            case LOCAL_MINUS_0_5_1:
            case VISITANTE_PLUS_0_5_1:
            case LOCAL_MINUS_0_5:
            case VISITANTE_PLUS_0_5:
                return "handicap-asiatico";
            case OVER_1_1_5:
            case UNDER_1_1_5:
            case OVER_0_5_1:
            case UNDER_0_5_1:
                return "total-asiatico";
            case MARCADOR_1_0:
            case MARCADOR_2_0:
            case MARCADOR_2_1:
            case MARCADOR_3_0:
            case MARCADOR_0_0:
            case MARCADOR_0_1:
            case MARCADOR_0_2:
            case MARCADOR_1_1:
            case MARCADOR_1_2:
            case MARCADOR_OTROS:
                return "marcador-correcto";
            case PRIMER_GOLEADOR_1:
            case PRIMER_GOLEADOR_2:
            case PRIMER_GOLEADOR_3:
            case PRIMER_GOLEADOR_4:
            case PRIMER_GOLEADOR_5:
            case NO_GOL:
                return "anotadores";
            case OVER_6_5_TARJETAS:
            case UNDER_6_5_TARJETAS:
            case OVER_4_5_TARJETAS:
            case UNDER_4_5_TARJETAS:
                return "tarjetas";
            case OVER_8_CORNERS:
            case EXACTO_8_CORNERS:
            case UNDER_8_CORNERS:
            case OVER_6_CORNERS:
            case EXACTO_6_CORNERS:
            case UNDER_6_CORNERS:
                return "corners";
            case LOCAL_TIEMPO_REGULAR:
            case VISITANTE_TIEMPO_REGULAR:
            case LOCAL_PENALTIS:
            case VISITANTE_PENALTIS:
                return "metodo-clasificacion";
            case SEGUNDA_MITAD_OVER_1_5:
            case SEGUNDA_MITAD_UNDER_1_5:
            case SEGUNDA_MITAD_OVER_0_5:
            case SEGUNDA_MITAD_UNDER_0_5:
            case SEGUNDA_MITAD_AMBOS_ANOTAN:
            case SEGUNDA_MITAD_LOCAL:
            case SEGUNDA_MITAD_EMPATE:
            case SEGUNDA_MITAD_VISITANTE:
                return "mitades";
            default:
                return "otros";
        }
    }
}
