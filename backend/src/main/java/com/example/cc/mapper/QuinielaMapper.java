package com.example.cc.mapper;

import com.example.cc.dto.response.QuinielaResponseDto;
import com.example.cc.entities.Quiniela;
import org.springframework.stereotype.Component;

@Component
public class QuinielaMapper {

    public QuinielaResponseDto toResponseDto(Quiniela quiniela) {
        if (quiniela == null) {
            return null;
        }

        return QuinielaResponseDto.builder()
                .id(quiniela.getId())
                .codigoUnico(quiniela.getCodigoUnico())
                .nombre(quiniela.getNombre())
                .descripcion(quiniela.getDescripcion())
                .tipoQuiniela(quiniela.getTipoQuiniela())
                .tipoDistribucion(quiniela.getTipoDistribucion())
                .costoParticipacion(quiniela.getCostoParticipacion())
                .premioMinimo(quiniela.getPremioMinimo())
                .poolActual(quiniela.getPoolActual())
                .maxParticipantes(quiniela.getMaxParticipantes())
                .participantesActuales(quiniela.getParticipantesActuales())
                .fechaInicio(quiniela.getFechaInicio())
                .fechaCierre(quiniela.getFechaCierre())
                .fechaResultados(quiniela.getFechaResultados())
                .estado(quiniela.getEstado())
                .reglasEspeciales(quiniela.getReglasEspeciales())
                .creadorId(quiniela.getCreadorId())
                .esPublica(quiniela.getEsPublica())
                .requiereAprobacion(quiniela.getRequiereAprobacion())
                .configuracionDistribucion(quiniela.getConfiguracionDistribucion())
                .porcentajeCasa(quiniela.getPorcentajeCasa())
                .porcentajeCreador(quiniela.getPorcentajeCreador())
                .activaBonusPool(quiniela.getActivaBonusPool())
                .requiereMinParticipantes(quiniela.getRequiereMinParticipantes())
                .fechaCreacion(quiniela.getFechaCreacion())
                .fechaActualizacion(quiniela.getFechaActualizacion())
                .totalEventos(quiniela.getEventos() != null ? quiniela.getEventos().size() : 0)
                .build();
    }
}
