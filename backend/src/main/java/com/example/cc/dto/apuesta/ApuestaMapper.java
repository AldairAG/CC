package com.example.cc.dto.apuesta;

import com.example.cc.entities.Apuesta;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ApuestaMapper {

    /**
     * Convierte una entidad Apuesta a ApuestaResponseDTO
     */
    public ApuestaResponseDTO toResponseDTO(Apuesta apuesta) {
        if (apuesta == null) {
            return null;
        }

        return ApuestaResponseDTO.builder()
                .id(apuesta.getId())
                .usuarioId(apuesta.getUsuario() != null ? apuesta.getUsuario().getIdUsuario() : null)
                .eventoId(apuesta.getEventoDeportivo() != null ? apuesta.getEventoDeportivo().getId() : null)
                .eventoNombre(getEventoNombre(apuesta))
                .equipoLocal(apuesta.getEventoDeportivo() != null ? apuesta.getEventoDeportivo().getEquipoLocal() : null)
                .equipoVisitante(apuesta.getEventoDeportivo() != null ? apuesta.getEventoDeportivo().getEquipoVisitante() : null)
                .cuotaId(apuesta.getCuotaEvento() != null ? apuesta.getCuotaEvento().getId() : null)
                .tipoApuesta(apuesta.getTipoApuesta() != null ? apuesta.getTipoApuesta().name() : null)
                .prediccion(apuesta.getPrediccion())
                .montoApostado(apuesta.getMontoApostado())
                .valorCuotaMomento(apuesta.getValorCuotaMomento())
                .montoPotencialGanancia(apuesta.getMontoPotencialGanancia())
                .montoGanancia(apuesta.getMontoGanancia())
                .estado(apuesta.getEstado() != null ? apuesta.getEstado().name() : null)
                .esGanadora(apuesta.getEsGanadora())
                .fechaCreacion(apuesta.getFechaCreacion())
                .fechaResolucion(apuesta.getFechaResolucion())
                .fechaActualizacion(apuesta.getFechaActualizacion())
                .descripcion(apuesta.getDescripcion())
                .build();
    }

    /**
     * Convierte un CrearApuestaRequestDTO a los datos necesarios para crear una Apuesta
     * Nota: Este método no crea la entidad completa, solo extrae los datos del DTO
     */
    public ApuestaCreationData fromRequestDTO(CrearApuestaRequestDTO request, Long usuarioId) {
        if (request == null) {
            return null;
        }

        return ApuestaCreationData.builder()
                .usuarioId(usuarioId)
                .eventoId(request.getEventoId())
                .cuotaId(request.getCuotaId())
                .montoApostado(request.getMontoApostadoEscalado())
                .tipoApuesta(request.getTipoApuesta())
                .prediccion(request.getPrediccion())
                .descripcion(request.getDescripcion())
                .build();
    }

    /**
     * Genera el nombre del evento combinando equipos
     */
    private String getEventoNombre(Apuesta apuesta) {
        if (apuesta.getEventoDeportivo() == null) {
            return null;
        }
        
        String local = apuesta.getEventoDeportivo().getEquipoLocal();
        String visitante = apuesta.getEventoDeportivo().getEquipoVisitante();
        
        if (local != null && visitante != null) {
            return local + " vs " + visitante;
        } else if (local != null) {
            return local;
        } else if (visitante != null) {
            return visitante;
        }
        
        return "Evento sin nombre";
    }

    /**
     * Clase auxiliar para transferir datos de creación de apuesta
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ApuestaCreationData {
        private Long usuarioId;
        private Long eventoId;
        private Long cuotaId;
        private BigDecimal montoApostado;
        private String tipoApuesta;
        private String prediccion;
        private String descripcion;
    }
}
