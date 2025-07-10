package com.example.cc.service.apuestas;

import com.example.cc.entities.TipoResultado;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class CuotaGeneratorService {
    
    private final Random random = new Random();
    
    /**
     * Obtiene todos los tipos de resultado disponibles para generar cuotas
     */
    public List<TipoResultado> getAllTiposResultado() {
        return Arrays.asList(TipoResultado.values());
    }
    
    /**
     * Genera una cuota aleatoria para un tipo de resultado específico
     */
    public BigDecimal generarCuotaParaTipo(TipoResultado tipoResultado) {
        switch (tipoResultado) {
            // Resultado Final (1X2) - cuotas más equilibradas
            case LOCAL:
                return generarCuotaAleatoria(1.5, 3.5);
            case VISITANTE:
                return generarCuotaAleatoria(1.8, 4.0);
            case EMPATE:
                return generarCuotaAleatoria(2.0, 4.5);
            
            // Clasificación - favorito vs underdog
            case LOCAL_CLASIFICA:
                return generarCuotaAleatoria(1.20, 1.80);
            case VISITANTE_CLASIFICA:
                return generarCuotaAleatoria(2.00, 3.50);
            
            // Doble Oportunidad - cuotas más bajas
            case LOCAL_EMPATE:
                return generarCuotaAleatoria(1.10, 1.30);
            case LOCAL_VISITANTE:
                return generarCuotaAleatoria(1.30, 1.60);
            case VISITANTE_EMPATE:
                return generarCuotaAleatoria(1.60, 2.00);
            
            // Ambos Equipos Anotan
            case AMBOS_ANOTAN:
                return generarCuotaAleatoria(1.80, 2.50);
            case NO_AMBOS_ANOTAN:
                return generarCuotaAleatoria(1.40, 2.20);
            
            // Total Goles Over/Under
            case OVER_0_5:
                return generarCuotaAleatoria(1.10, 1.40);
            case UNDER_0_5:
                return generarCuotaAleatoria(3.00, 4.50);
            case OVER_1_5:
                return generarCuotaAleatoria(1.80, 2.50);
            case UNDER_1_5:
                return generarCuotaAleatoria(1.40, 2.00);
            case OVER_2_5:
                return generarCuotaAleatoria(3.50, 5.50);
            case UNDER_2_5:
                return generarCuotaAleatoria(1.10, 1.30);
            case OVER_3_5:
                return generarCuotaAleatoria(7.00, 12.00);
            case UNDER_3_5:
                return generarCuotaAleatoria(1.01, 1.10);
            
            // Hándicap Resultado
            case LOCAL_MINUS_2:
                return generarCuotaAleatoria(8.00, 15.00);
            case EMPATE_MINUS_2:
                return generarCuotaAleatoria(4.00, 7.00);
            case VISITANTE_PLUS_2:
                return generarCuotaAleatoria(1.10, 1.30);
            case LOCAL_MINUS_1:
                return generarCuotaAleatoria(3.00, 5.00);
            case EMPATE_MINUS_1:
                return generarCuotaAleatoria(2.50, 3.50);
            case VISITANTE_PLUS_1:
                return generarCuotaAleatoria(1.60, 2.20);
            
            // Hándicap Asiático
            case LOCAL_MINUS_0_5_1:
                return generarCuotaAleatoria(2.00, 2.80);
            case VISITANTE_PLUS_0_5_1:
                return generarCuotaAleatoria(1.40, 1.80);
            case LOCAL_MINUS_0_5:
                return generarCuotaAleatoria(1.70, 2.20);
            case VISITANTE_PLUS_0_5:
                return generarCuotaAleatoria(1.70, 2.20);
            
            // Total Goles Asiático
            case OVER_1_1_5:
                return generarCuotaAleatoria(1.60, 2.20);
            case UNDER_1_1_5:
                return generarCuotaAleatoria(1.60, 2.20);
            case OVER_0_5_1:
                return generarCuotaAleatoria(1.20, 1.50);
            case UNDER_0_5_1:
                return generarCuotaAleatoria(2.50, 3.50);
            
            // Marcador Correcto
            case MARCADOR_1_0:
                return generarCuotaAleatoria(5.00, 8.00);
            case MARCADOR_2_0:
                return generarCuotaAleatoria(6.00, 10.00);
            case MARCADOR_2_1:
                return generarCuotaAleatoria(7.00, 12.00);
            case MARCADOR_3_0:
                return generarCuotaAleatoria(12.00, 20.00);
            case MARCADOR_0_0:
                return generarCuotaAleatoria(6.00, 12.00);
            case MARCADOR_0_1:
                return generarCuotaAleatoria(8.00, 16.00);
            case MARCADOR_0_2:
                return generarCuotaAleatoria(20.00, 35.00);
            case MARCADOR_1_1:
                return generarCuotaAleatoria(4.00, 8.00);
            case MARCADOR_1_2:
                return generarCuotaAleatoria(15.00, 25.00);
            case MARCADOR_OTROS:
                return generarCuotaAleatoria(3.00, 6.00);
            
            // Primer Goleador
            case PRIMER_GOLEADOR_1:
                return generarCuotaAleatoria(4.00, 7.00);
            case PRIMER_GOLEADOR_2:
                return generarCuotaAleatoria(6.00, 10.00);
            case PRIMER_GOLEADOR_3:
                return generarCuotaAleatoria(15.00, 25.00);
            case PRIMER_GOLEADOR_4:
                return generarCuotaAleatoria(10.00, 16.00);
            case PRIMER_GOLEADOR_5:
                return generarCuotaAleatoria(11.00, 18.00);
            case NO_GOL:
                return generarCuotaAleatoria(3.00, 4.50);
            
            // Tarjetas
            case OVER_6_5_TARJETAS:
                return generarCuotaAleatoria(1.80, 2.50);
            case UNDER_6_5_TARJETAS:
                return generarCuotaAleatoria(1.50, 2.00);
            case OVER_4_5_TARJETAS:
                return generarCuotaAleatoria(1.40, 1.80);
            case UNDER_4_5_TARJETAS:
                return generarCuotaAleatoria(1.90, 2.60);
            
            // Corners
            case OVER_8_CORNERS:
                return generarCuotaAleatoria(2.80, 3.80);
            case EXACTO_8_CORNERS:
                return generarCuotaAleatoria(5.50, 7.50);
            case UNDER_8_CORNERS:
                return generarCuotaAleatoria(1.40, 1.80);
            case OVER_6_CORNERS:
                return generarCuotaAleatoria(1.40, 1.80);
            case EXACTO_6_CORNERS:
                return generarCuotaAleatoria(4.50, 6.50);
            case UNDER_6_CORNERS:
                return generarCuotaAleatoria(2.80, 3.80);
            
            // Método de Clasificación
            case LOCAL_TIEMPO_REGULAR:
                return generarCuotaAleatoria(1.60, 2.20);
            case VISITANTE_TIEMPO_REGULAR:
                return generarCuotaAleatoria(5.00, 7.00);
            case LOCAL_PENALTIS:
                return generarCuotaAleatoria(4.00, 5.50);
            case VISITANTE_PENALTIS:
                return generarCuotaAleatoria(4.00, 5.50);
            
            // Segunda Mitad
            case SEGUNDA_MITAD_OVER_1_5:
                return generarCuotaAleatoria(2.20, 2.80);
            case SEGUNDA_MITAD_UNDER_1_5:
                return generarCuotaAleatoria(1.30, 1.70);
            case SEGUNDA_MITAD_OVER_0_5:
                return generarCuotaAleatoria(1.20, 1.50);
            case SEGUNDA_MITAD_UNDER_0_5:
                return generarCuotaAleatoria(2.80, 3.60);
            case SEGUNDA_MITAD_AMBOS_ANOTAN:
                return generarCuotaAleatoria(3.20, 4.20);
            case SEGUNDA_MITAD_LOCAL:
                return generarCuotaAleatoria(2.50, 3.20);
            case SEGUNDA_MITAD_EMPATE:
                return generarCuotaAleatoria(1.90, 2.50);
            case SEGUNDA_MITAD_VISITANTE:
                return generarCuotaAleatoria(4.00, 5.00);
            
            // Tipos heredados (valores por defecto)
            default:
                return generarCuotaAleatoria(1.50, 3.00);
        }
    }
    
    /**
     * Genera una cuota aleatoria dentro de un rango específico
     */
    private BigDecimal generarCuotaAleatoria(double min, double max) {
        double valor = min + (random.nextDouble() * (max - min));
        return BigDecimal.valueOf(valor).setScale(2, RoundingMode.HALF_UP);
    }
}
