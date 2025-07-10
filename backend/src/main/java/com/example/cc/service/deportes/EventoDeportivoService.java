package com.example.cc.service.deportes;

import com.example.cc.entities.EventoDeportivo;
import com.example.cc.entities.Deporte;
import com.example.cc.entities.Liga;
import com.example.cc.dto.external.TheSportsDbEventResponse;
import com.example.cc.repository.EventoDeportivoRepository;
import com.example.cc.service.apuestas.CuotaEventoService;
import com.example.cc.service.external.TheSportsDbService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventoDeportivoService implements IEventoDeportivoService {

    private final EventoDeportivoRepository eventoRepository;
    private final TheSportsDbService theSportsDbService;
    private final IDeporteService deporteService;
    private final ILigaService ligaService;
    private final CuotaEventoService cuotaEventoService;

    /**
     * Sincronizar eventos deportivos desde TheSportsDB
     */
    @Transactional
    public void sincronizarEventosDeportivos() {
        log.info("Iniciando sincronización de eventos deportivos...");
        
        try {
            // Obtener eventos de TheSportsDB
            List<TheSportsDbEventResponse.EventData> eventosExternos = null;

            eventosExternos = theSportsDbService.getUpcomingEvents();
               
            if (eventosExternos.isEmpty()) {
                log.warn("No se obtuvieron eventos de TheSportsDB");
                return;
            }

            int eventosNuevos = 0;
            int eventosActualizados = 0;

            for (TheSportsDbEventResponse.EventData eventoExterno : eventosExternos) {
                try {
                    // Verificar si el evento ya existe
                    Optional<EventoDeportivo> eventoExistente = eventoRepository.findByEventoIdExterno(eventoExterno.getIdEvent());
                    
                    if (eventoExistente.isPresent()) {
                        // Actualizar evento existente
                        EventoDeportivo evento = eventoExistente.get();
                        actualizarEvento(evento, eventoExterno);
                        eventoRepository.save(evento);
                        eventosActualizados++;
                        
                    } else {
                        // Crear nuevo evento
                        EventoDeportivo nuevoEvento = crearEventoDesdeExterno(eventoExterno);
                        if (nuevoEvento != null) {
                            EventoDeportivo eventoGuardado = eventoRepository.save(nuevoEvento);
                            eventosNuevos++;
                            
                            // Generar cuotas automáticamente para el nuevo evento
                            try {
                                cuotaEventoService.generarCuotasParaEvento(eventoGuardado.getId());
                                log.info("Cuotas generadas automáticamente para evento: {}", eventoGuardado.getNombreEvento());
                            } catch (Exception e) {
                                log.error("Error al generar cuotas automáticas para evento {}: {}", 
                                         eventoGuardado.getId(), e.getMessage());
                            }
                        }
                    }
                    
                } catch (Exception e) {
                    log.error("Error al procesar evento {}: {}", eventoExterno.getIdEvent(), e.getMessage());
                }
            }
            
            log.info("Sincronización completada. Eventos nuevos: {}, Eventos actualizados: {}", 
                     eventosNuevos, eventosActualizados);
            
            // Limpiar eventos antiguos
            limpiarEventosAntiguos();
            
        } catch (Exception e) {
            log.error("Error durante la sincronización de eventos: {}", e.getMessage(), e);
        }
    }

    /**
     * Crear evento desde datos externos con validación completa
     */
    private EventoDeportivo crearEventoDesdeExterno(TheSportsDbEventResponse.EventData eventoExterno) {
        try {
            log.debug("Creando evento desde datos externos: {}", eventoExterno.getStrEvent());
            
            EventoDeportivo evento = new EventoDeportivo();
            
            // Asignar datos básicos del evento
            evento.setEventoIdExterno(eventoExterno.getIdEvent());
            evento.setNombreEvento(eventoExterno.getStrEvent());
            evento.setEquipoLocal(eventoExterno.getStrHomeTeam());
            evento.setEquipoVisitante(eventoExterno.getStrAwayTeam());
            evento.setTemporada(eventoExterno.getStrSeason());
            evento.setDescripcion(eventoExterno.getStrDescriptionEN());
            
            // Validar y obtener deporte (obligatorio)
            if (eventoExterno.getStrSport() == null || eventoExterno.getStrSport().trim().isEmpty()) {
                log.warn("Evento {} no tiene deporte definido, omitiendo", eventoExterno.getStrEvent());
                return null;
            }
            
            Deporte deporte = obtenerOCrearDeporte(eventoExterno.getStrSport());
            evento.setDeporte(deporte);
            
            // Validar y obtener liga (obligatorio)
            if (eventoExterno.getStrLeague() == null || eventoExterno.getStrLeague().trim().isEmpty()) {
                log.warn("Evento {} no tiene liga definida, omitiendo", eventoExterno.getStrEvent());
                return null;
            }
            
            Liga liga = obtenerOCrearLiga(eventoExterno.getStrLeague(), null, deporte);
            evento.setLiga(liga);
            
            // Procesar fecha y hora
            LocalDateTime fechaEvento = parsearFechaEvento(
                eventoExterno.getDateEvent(), 
                eventoExterno.getStrTime()
            );
            evento.setFechaEvento(fechaEvento);
            
            // Mapear estado
            evento.setEstado(mapearEstado(eventoExterno.getStrStatus()));
            
            log.debug("Evento {} creado exitosamente para deporte {} y liga {}", 
                eventoExterno.getStrEvent(), deporte.getNombre(), liga.getNombre());
            
            return evento;
            
        } catch (Exception e) {
            log.error("Error al crear evento {} desde datos externos: {}", 
                eventoExterno.getStrEvent(), e.getMessage(), e);
            return null;
        }
    }

    /**
     * Actualizar evento existente con validación completa
     */
    private void actualizarEvento(EventoDeportivo evento, TheSportsDbEventResponse.EventData eventoExterno) {
        log.debug("Actualizando evento existente: {}", eventoExterno.getStrEvent());
        
        // Actualizar datos básicos
        evento.setNombreEvento(eventoExterno.getStrEvent());
        evento.setEquipoLocal(eventoExterno.getStrHomeTeam());
        evento.setEquipoVisitante(eventoExterno.getStrAwayTeam());
        evento.setTemporada(eventoExterno.getStrSeason());
        evento.setDescripcion(eventoExterno.getStrDescriptionEN());
        
        // Actualizar deporte si es diferente
        if (eventoExterno.getStrSport() != null && !eventoExterno.getStrSport().trim().isEmpty()) {
            Deporte deporte = obtenerOCrearDeporte(eventoExterno.getStrSport());
            if (!deporte.equals(evento.getDeporte())) {
                log.debug("Actualizando deporte del evento {} de {} a {}", 
                    evento.getNombreEvento(), 
                    evento.getDeporte() != null ? evento.getDeporte().getNombre() : "null", 
                    deporte.getNombre());
                evento.setDeporte(deporte);
            }
        }
        
        // Actualizar liga si es diferente
        if (eventoExterno.getStrLeague() != null && !eventoExterno.getStrLeague().trim().isEmpty()) {
            Liga liga = obtenerOCrearLiga(eventoExterno.getStrLeague(), null, evento.getDeporte());
            if (!liga.equals(evento.getLiga())) {
                log.debug("Actualizando liga del evento {} de {} a {}", 
                    evento.getNombreEvento(), 
                    evento.getLiga() != null ? evento.getLiga().getNombre() : "null", 
                    liga.getNombre());
                evento.setLiga(liga);
            }
        }
        
        // Actualizar fecha y hora
        LocalDateTime fechaEvento = parsearFechaEvento(
            eventoExterno.getDateEvent(), 
            eventoExterno.getStrTime()
        );
        evento.setFechaEvento(fechaEvento);
        
        // Actualizar estado
        String nuevoEstado = mapearEstado(eventoExterno.getStrStatus());
        if (!nuevoEstado.equals(evento.getEstado())) {
            log.debug("Actualizando estado del evento {} de {} a {}", 
                evento.getNombreEvento(), evento.getEstado(), nuevoEstado);
            evento.setEstado(nuevoEstado);
        }
    }

    /**
     * Parsear fecha y hora del evento
     */
    private LocalDateTime parsearFechaEvento(String fechaStr, String horaStr) {
        try {
            // Parsear fecha (formato: YYYY-MM-DD)
            LocalDate fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            
            // Parsear hora si está disponible
            LocalTime hora = LocalTime.MIDNIGHT; // Por defecto medianoche
            if (horaStr != null && !horaStr.trim().isEmpty() && !horaStr.equals("null")) {
                try {
                    hora = LocalTime.parse(horaStr, DateTimeFormatter.ofPattern("HH:mm:ss"));
                } catch (DateTimeParseException e) {
                    log.debug("No se pudo parsear la hora '{}', usando medianoche", horaStr);
                }
            }
            
            return LocalDateTime.of(fecha, hora);
            
        } catch (DateTimeParseException e) {
            log.error("Error al parsear fecha '{}': {}", fechaStr, e.getMessage());
            // Retornar fecha actual como fallback
            return LocalDateTime.now();
        }
    }

    /**
     * Mapear estado del evento
     */
    private String mapearEstado(String estadoExterno) {
        if (estadoExterno == null || estadoExterno.trim().isEmpty()) {
            return "programado";
        }
        
        switch (estadoExterno.toLowerCase()) {
            case "not started":
            case "ns":
                return "programado";
            case "match finished":
            case "ft":
            case "finished":
                return "finalizado";
            case "postponed":
            case "cancelled":
                return "cancelado";
            case "live":
            case "in play":
                return "en_vivo";
            default:
                return "programado";
        }
    }

    /**
     * Limpiar eventos antiguos (más de 30 días)
     */
    @Transactional
    public void limpiarEventosAntiguos() {
        try {
            LocalDateTime fechaLimite = LocalDateTime.now().minusDays(30);
            eventoRepository.deleteEventosAntiguos(fechaLimite);
            log.info("Eventos antiguos eliminados correctamente");
        } catch (Exception e) {
            log.error("Error al limpiar eventos antiguos: {}", e.getMessage());
        }
    }

    /**
     * Obtener eventos por rango de fechas
     */
    public List<EventoDeportivo> getEventosPorFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return eventoRepository.findByFechaEventoBetween(fechaInicio, fechaFin);
    }

    /**
     * Obtener eventos por deporte (usando entidad)
     */
    public List<EventoDeportivo> getEventosPorDeporte(Deporte deporte) {
        return eventoRepository.findByDeporteOrderByFechaEventoAsc(deporte);
    }

    /**
     * Obtener eventos por deporte (usando nombre - compatibilidad)
     */
    public List<EventoDeportivo> getEventosPorDeporteNombre(String nombreDeporte) {
        return eventoRepository.findByDeporteNombreOrderByFechaEventoAsc(nombreDeporte);
    }

    /**
     * Obtener eventos por liga (usando entidad)
     */
    public List<EventoDeportivo> getEventosPorLiga(Liga liga) {
        return eventoRepository.findByLigaOrderByFechaEventoAsc(liga);
    }

    /**
     * Obtener eventos por liga (usando nombre - compatibilidad)
     */
    public List<EventoDeportivo> getEventosPorLigaNombre(String nombreLiga) {
        return eventoRepository.findByLigaNombreOrderByFechaEventoAsc(nombreLiga);
    }
    
    /**
     * Obtener o crear deporte por nombre usando método seguro
     */
    private Deporte obtenerOCrearDeporte(String nombreDeporte) {
        if (nombreDeporte == null || nombreDeporte.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del deporte no puede estar vacío");
        }
        
        // Buscar deporte existente primero
        Optional<Deporte> deporteExistente = deporteService.getDeporteByNombre(nombreDeporte);
        if (deporteExistente.isPresent()) {
            log.debug("Deporte {} encontrado en BD", nombreDeporte);
            return deporteExistente.get();
        }
        
        // Crear nuevo deporte usando método seguro
        Deporte nuevoDeporte = new Deporte();
        nuevoDeporte.setNombre(nombreDeporte);
        nuevoDeporte.setDescripcion("Deporte sincronizado desde eventos: " + nombreDeporte);
        nuevoDeporte.setActivo(true);
        nuevoDeporte.setIcono(getIconoDeporte(nombreDeporte));
        nuevoDeporte.setColorPrimario(getColorDeporte(nombreDeporte));
        
        // Usar createDeporteSafe para evitar duplicados
        Deporte deporteGuardado = deporteService.createDeporteSafe(nuevoDeporte);
        log.info("Deporte {} creado/obtenido durante sincronización de eventos", nombreDeporte);
        
        return deporteGuardado;
    }
    
    /**
     * Obtener o crear liga por nombre y deporte usando método seguro
     */
    private Liga obtenerOCrearLiga(String nombreLiga, String ligaIdExterno, Deporte deporte) {
        if (nombreLiga == null || nombreLiga.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la liga no puede estar vacío");
        }
        
        // Buscar por ID externo primero si está disponible
        if (ligaIdExterno != null && !ligaIdExterno.trim().isEmpty()) {
            Optional<Liga> ligaExistente = ligaService.getLigaByIdExterno(ligaIdExterno);
            if (ligaExistente.isPresent()) {
                log.debug("Liga {} encontrada por ID externo: {}", nombreLiga, ligaIdExterno);
                return ligaExistente.get();
            }
        }
        
        // Buscar por nombre
        Optional<Liga> ligaExistente = ligaService.getLigaByNombre(nombreLiga);
        if (ligaExistente.isPresent()) {
            log.debug("Liga {} encontrada por nombre", nombreLiga);
            return ligaExistente.get();
        }
        
        // Crear nueva liga usando método seguro
        Liga nuevaLiga = new Liga();
        nuevaLiga.setNombre(nombreLiga);
        nuevaLiga.setLigaIdExterno(ligaIdExterno);
        nuevaLiga.setDescripcion("Liga sincronizada desde eventos: " + nombreLiga);
        nuevaLiga.setActiva(true);
        nuevaLiga.setDeporte(deporte);
        nuevaLiga.setPais(getPaisLiga(nombreLiga));
        nuevaLiga.setTemporada(obtenerTemporadaActual());
        
        // Usar createLigaSafe para evitar duplicados
        Liga ligaGuardada = ligaService.createLigaSafe(nuevaLiga);
        log.info("Liga {} creada/obtenida durante sincronización de eventos para deporte {}", 
            nombreLiga, deporte.getNombre());
        
        return ligaGuardada;
    }
    
    /**
     * Obtener icono por deporte
     */
    private String getIconoDeporte(String nombreDeporte) {
        return switch (nombreDeporte.toLowerCase()) {
            case "soccer", "football" -> "⚽";
            case "basketball" -> "🏀";
            case "american football" -> "🏈";
            case "baseball" -> "⚾";
            case "tennis" -> "🎾";
            case "hockey" -> "🏒";
            case "volleyball" -> "🏐";
            case "golf" -> "⛳";
            default -> "🏆";
        };
    }
    
    /**
     * Obtener color por deporte
     */
    private String getColorDeporte(String nombreDeporte) {
        return switch (nombreDeporte.toLowerCase()) {
            case "soccer", "football" -> "#00A650";
            case "basketball" -> "#FF6B35";
            case "american football" -> "#8B4513";
            case "baseball" -> "#FF0000";
            case "tennis" -> "#FFFF00";
            case "hockey" -> "#0066CC";
            case "volleyball" -> "#FF69B4";
            case "golf" -> "#228B22";
            default -> "#6B7280";
        };
    }
    
    /**
     * Obtener país de la liga basado en el nombre
     */
    private String getPaisLiga(String nombreLiga) {
        String nombre = nombreLiga.toLowerCase();
        if (nombre.contains("premier league") || nombre.contains("england")) return "England";
        if (nombre.contains("la liga") || nombre.contains("spain")) return "Spain";
        if (nombre.contains("serie a") || nombre.contains("italy")) return "Italy";
        if (nombre.contains("bundesliga") || nombre.contains("germany")) return "Germany";
        if (nombre.contains("ligue 1") || nombre.contains("france")) return "France";
        if (nombre.contains("liga mx") || nombre.contains("mexico")) return "Mexico";
        if (nombre.contains("champions league") || nombre.contains("europa")) return "Europe";
        return "Unknown";
    }

    /**
     * Obtener temporada actual basada en el año
     */
    private String obtenerTemporadaActual() {
        int anioActual = LocalDate.now().getYear();
        return anioActual + "-" + (anioActual + 1);
    }

    /**
     * Buscar evento por nombre y fecha específica
     */
    @Override
    public Optional<EventoDeportivo> buscarPorNombreYFecha(String nombreEvento, LocalDateTime fechaInicio, 
                                                          LocalDateTime fechaFin, String equipoLocal, String equipoVisitante) {
        try {
            List<EventoDeportivo> eventos = eventoRepository.findByFechaEventoBetween(fechaInicio, fechaFin);
            
            return eventos.stream()
                .filter(evento -> {
                    String nombreCompleto = evento.getNombreEvento().toLowerCase();
                    String equipoLocalEvento = evento.getEquipoLocal().toLowerCase();
                    String equipoVisitanteEvento = evento.getEquipoVisitante().toLowerCase();
                    String nombreBusqueda = nombreEvento.toLowerCase();
                    
                    // Buscar por nombre del evento o nombres de equipos
                    boolean coincideNombre = nombreCompleto.contains(nombreBusqueda) ||
                                           equipoLocalEvento.contains(nombreBusqueda) ||
                                           equipoVisitanteEvento.contains(nombreBusqueda);
                    
                    // Filtros opcionales por equipos específicos
                    boolean coincideEquipoLocal = equipoLocal == null || 
                                                equipoLocalEvento.contains(equipoLocal.toLowerCase());
                    boolean coincideEquipoVisitante = equipoVisitante == null || 
                                                     equipoVisitanteEvento.contains(equipoVisitante.toLowerCase());
                    
                    return coincideNombre && coincideEquipoLocal && coincideEquipoVisitante;
                })
                .findFirst();
                
        } catch (Exception e) {
            log.error("Error al buscar evento por nombre y fecha: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    /**
     * Buscar eventos por fecha específica
     */
    @Override
    public List<EventoDeportivo> buscarPorFecha(LocalDateTime fechaInicio, LocalDateTime fechaFin, 
                                               String deporte, String liga) {
        try {
            List<EventoDeportivo> eventos = eventoRepository.findByFechaEventoBetween(fechaInicio, fechaFin);
            
            return eventos.stream()
                .filter(evento -> {
                    // Filtro opcional por deporte
                    boolean coincideDeporte = deporte == null || 
                                            (evento.getDeporte() != null && 
                                             evento.getDeporte().getNombre().toLowerCase().contains(deporte.toLowerCase()));
                    
                    // Filtro opcional por liga
                    boolean coincideLiga = liga == null || 
                                         (evento.getLiga() != null && 
                                          evento.getLiga().getNombre().toLowerCase().contains(liga.toLowerCase()));
                    
                    return coincideDeporte && coincideLiga;
                })
                .sorted((e1, e2) -> e1.getFechaEvento().compareTo(e2.getFechaEvento()))
                .toList();
                
        } catch (Exception e) {
            log.error("Error al buscar eventos por fecha: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Obtener evento por ID
     */
    @Override
    public Optional<EventoDeportivo> getEventoById(Long id) {
        return eventoRepository.findById(id);
    }

    /**
     * Obtener todos los eventos
     */
    @Override
    public List<EventoDeportivo> getAllEventos() {
        return eventoRepository.findAll();
    }
}
