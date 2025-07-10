package com.example.cc.dto;

import com.example.cc.entities.CuotaEvento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CuotasMercadoDTO {
    
    private Long eventoId;
    private String nombreEvento;
    private String equipoLocal;
    private String equipoVisitante;
    private Map<String, List<CuotaEvento>> cuotasPorMercado;
    private int totalCuotas;
    private int totalMercados;
    
    // Método estático para crear desde un mapa de cuotas
    public static CuotasMercadoDTO fromCuotasMap(Long eventoId, String nombreEvento, 
                                                 String equipoLocal, String equipoVisitante,
                                                 Map<String, List<CuotaEvento>> cuotasPorMercado) {
        return CuotasMercadoDTO.builder()
                .eventoId(eventoId)
                .nombreEvento(nombreEvento)
                .equipoLocal(equipoLocal)
                .equipoVisitante(equipoVisitante)
                .cuotasPorMercado(cuotasPorMercado)
                .totalCuotas(cuotasPorMercado.values().stream()
                        .mapToInt(List::size)
                        .sum())
                .totalMercados(cuotasPorMercado.size())
                .build();
    }
}
