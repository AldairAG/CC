package com.example.cc.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.cc.constants.ROLES;
import com.example.cc.entities.Rol;
import com.example.cc.entities.TipoPrediccion;
import com.example.cc.entities.Deporte;
import com.example.cc.entities.Liga;
import com.example.cc.repository.RolRepository;
import com.example.cc.repository.TipoPrediccionRepository;
import com.example.cc.service.deportes.IDeporteService;
import com.example.cc.service.deportes.ILigaService;
import com.example.cc.service.external.ITheSportsDbService;
import com.example.cc.dto.response.TheSportsDbSportResponse;
import com.example.cc.dto.response.TheSportsDbLeagueResponse;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

@Component
@Slf4j
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private TipoPrediccionRepository tipoPrediccionRepository;

    @Autowired
    private IDeporteService deporteService;

    @Autowired
    private ILigaService ligaService;

    @Autowired
    private ITheSportsDbService theSportsDbService;

    @Override
    public void run(String... args) throws Exception {
        crearRoles();
        crearTiposPrediccion();
        sincronizarDeportes();
        sincronizarLigas();
    }

    private void crearRoles() {
        // Crear roles si no existen
        if (rolRepository.findByNombreRol(ROLES.ADMIN_STRING).isEmpty()) {
            rolRepository.save(Rol.builder().nombreRol(ROLES.ADMIN_STRING).build());
        }
        if (rolRepository.findByNombreRol(ROLES.CLIENTE_STRING).isEmpty()) {
            rolRepository.save(Rol.builder().nombreRol(ROLES.CLIENTE_STRING).build());
        }
        if (rolRepository.findByNombreRol(ROLES.PROPIETARIO_STRING).isEmpty()) {
            rolRepository.save(Rol.builder().nombreRol(ROLES.PROPIETARIO_STRING).build());
        }
    }

    private void crearTiposPrediccion() {
        // Crear tipos de predicción si no existen
        
        // 1. RESULTADO (1X2)
        if (!tipoPrediccionRepository.existsByNombre("RESULTADO")) {
            TipoPrediccion resultado = new TipoPrediccion();
            resultado.setNombre("RESULTADO");
            resultado.setDescripcion("Predicción del resultado final del partido (Local/Empate/Visitante)");
            resultado.setPuntosPorAcierto(10);
            resultado.setDificultad(TipoPrediccion.Dificultad.FACIL);
            resultado.setAplicaA("FUTBOL,BASKETBALL,TENNIS,HOCKEY");
            resultado.setTipoValor("TEXTO");
            resultado.setOpcionesPredefinidas("[\"LOCAL\",\"EMPATE\",\"VISITANTE\"]");
            resultado.setActivo(true);
            tipoPrediccionRepository.save(resultado);
        }

        // 2. MARCADOR_EXACTO
        if (!tipoPrediccionRepository.existsByNombre("MARCADOR_EXACTO")) {
            TipoPrediccion marcadorExacto = new TipoPrediccion();
            marcadorExacto.setNombre("MARCADOR_EXACTO");
            marcadorExacto.setDescripcion("Predicción del marcador exacto del partido");
            marcadorExacto.setPuntosPorAcierto(50);
            marcadorExacto.setDificultad(TipoPrediccion.Dificultad.EXPERTO);
            marcadorExacto.setAplicaA("FUTBOL,BASKETBALL,TENNIS,HOCKEY,BASEBALL");
            marcadorExacto.setTipoValor("TEXTO");
            marcadorExacto.setValorMinimo(0);
            marcadorExacto.setValorMaximo(20);
            marcadorExacto.setActivo(true);
            tipoPrediccionRepository.save(marcadorExacto);
        }

        // 3. HANDICAP
        if (!tipoPrediccionRepository.existsByNombre("HANDICAP")) {
            TipoPrediccion handicap = new TipoPrediccion();
            handicap.setNombre("HANDICAP");
            handicap.setDescripcion("Predicción con ventaja/desventaja aplicada a un equipo");
            handicap.setPuntosPorAcierto(20);
            handicap.setDificultad(TipoPrediccion.Dificultad.MEDIO);
            handicap.setAplicaA("FUTBOL,BASKETBALL,AMERICAN_FOOTBALL");
            handicap.setTipoValor("TEXTO");
            handicap.setOpcionesPredefinidas("[\"LOCAL_HANDICAP\",\"VISITANTE_HANDICAP\"]");
            handicap.setActivo(true);
            tipoPrediccionRepository.save(handicap);
        }

        // 4. OVER_UNDER
        if (!tipoPrediccionRepository.existsByNombre("OVER_UNDER")) {
            TipoPrediccion overUnder = new TipoPrediccion();
            overUnder.setNombre("OVER_UNDER");
            overUnder.setDescripcion("Predicción si el total de goles/puntos será mayor o menor a una cantidad");
            overUnder.setPuntosPorAcierto(15);
            overUnder.setDificultad(TipoPrediccion.Dificultad.MEDIO);
            overUnder.setAplicaA("FUTBOL,BASKETBALL,TENNIS,HOCKEY,BASEBALL");
            overUnder.setTipoValor("TEXTO");
            overUnder.setOpcionesPredefinidas("[\"OVER\",\"UNDER\"]");
            overUnder.setActivo(true);
            tipoPrediccionRepository.save(overUnder);
        }

        // 5. AMBOS_EQUIPOS_ANOTAN
        if (!tipoPrediccionRepository.existsByNombre("AMBOS_EQUIPOS_ANOTAN")) {
            TipoPrediccion ambosAnotan = new TipoPrediccion();
            ambosAnotan.setNombre("AMBOS_EQUIPOS_ANOTAN");
            ambosAnotan.setDescripcion("Predicción si ambos equipos anotarán al menos un gol/punto");
            ambosAnotan.setPuntosPorAcierto(12);
            ambosAnotan.setDificultad(TipoPrediccion.Dificultad.FACIL);
            ambosAnotan.setAplicaA("FUTBOL,HOCKEY,BASKETBALL");
            ambosAnotan.setTipoValor("BOOLEAN");
            ambosAnotan.setOpcionesPredefinidas("[\"SI\",\"NO\"]");
            ambosAnotan.setActivo(true);
            tipoPrediccionRepository.save(ambosAnotan);
        }

        // 6. PRIMER_GOLEADOR
        if (!tipoPrediccionRepository.existsByNombre("PRIMER_GOLEADOR")) {
            TipoPrediccion primerGoleador = new TipoPrediccion();
            primerGoleador.setNombre("PRIMER_GOLEADOR");
            primerGoleador.setDescripcion("Predicción de quién anotará el primer gol del partido");
            primerGoleador.setPuntosPorAcierto(30);
            primerGoleador.setDificultad(TipoPrediccion.Dificultad.DIFICIL);
            primerGoleador.setAplicaA("FUTBOL,HOCKEY");
            primerGoleador.setTipoValor("TEXTO");
            primerGoleador.setActivo(true);
            tipoPrediccionRepository.save(primerGoleador);
        }

        // 7. TARJETAS_AMARILLAS
        if (!tipoPrediccionRepository.existsByNombre("TARJETAS_AMARILLAS")) {
            TipoPrediccion tarjetasAmarillas = new TipoPrediccion();
            tarjetasAmarillas.setNombre("TARJETAS_AMARILLAS");
            tarjetasAmarillas.setDescripcion("Predicción del número total de tarjetas amarillas en el partido");
            tarjetasAmarillas.setPuntosPorAcierto(18);
            tarjetasAmarillas.setDificultad(TipoPrediccion.Dificultad.MEDIO);
            tarjetasAmarillas.setAplicaA("FUTBOL");
            tarjetasAmarillas.setTipoValor("NUMERO");
            tarjetasAmarillas.setValorMinimo(0);
            tarjetasAmarillas.setValorMaximo(15);
            tarjetasAmarillas.setActivo(true);
            tipoPrediccionRepository.save(tarjetasAmarillas);
        }

        // 8. CORNERS
        if (!tipoPrediccionRepository.existsByNombre("CORNERS")) {
            TipoPrediccion corners = new TipoPrediccion();
            corners.setNombre("CORNERS");
            corners.setDescripcion("Predicción del número total de tiros de esquina en el partido");
            corners.setPuntosPorAcierto(16);
            corners.setDificultad(TipoPrediccion.Dificultad.MEDIO);
            corners.setAplicaA("FUTBOL");
            corners.setTipoValor("NUMERO");
            corners.setValorMinimo(0);
            corners.setValorMaximo(25);
            corners.setActivo(true);
            tipoPrediccionRepository.save(corners);
        }
    }

    /**
     * Sincroniza los deportes de TheSportsDB con la base de datos local
     */
    private void sincronizarDeportes() {
        Boolean isEnabled = true; // Cambiar a false para desactivar la sincronización
        if (!isEnabled) {
            log.info("Sincronización de deportes desactivada");
            return;
        }
        log.info("Iniciando sincronización de deportes desde TheSportsDB...");
        
        try {
            // Obtener deportes de TheSportsDB
            List<TheSportsDbSportResponse.SportData> deportesExternos = theSportsDbService.obtenerTodosLosDeportes();
            
            if (deportesExternos == null || deportesExternos.isEmpty()) {
                log.warn("No se obtuvieron deportes de TheSportsDB");
                return;
            }

            int deportesCreados = 0;
            int deportesExistentes = 0;
            
            for (TheSportsDbSportResponse.SportData deporteExterno : deportesExternos) {
                try {
                    // Crear entidad Deporte
                    Deporte deporte = new Deporte();
                    deporte.setNombre(deporteExterno.getStrSport());
                    deporte.setDescripcion("Deporte sincronizado desde TheSportsDB");
                    deporte.setActivo(true);
                    // Asignar iconos y colores por defecto según el deporte
                    asignarIconoYColor(deporte, deporteExterno.getStrSport());
                    
                    // Intentar crear el deporte de forma segura
                    Deporte deporteGuardado = deporteService.createDeporteSafe(deporte);
                    
                    if (deporteGuardado.getId() != null) {
                        // Verificar si se creó o ya existía
                        if (deporteService.existsDeporte(deporteExterno.getStrSport())) {
                            deportesExistentes++;
                        } else {
                            deportesCreados++;
                        }
                    }
                    
                } catch (Exception e) {
                    log.error("Error al procesar deporte {}: {}", deporteExterno.getStrSport(), e.getMessage());
                }
            }
            
            log.info("Sincronización de deportes completada. Creados: {}, Existentes: {}, Total procesados: {}", 
                deportesCreados, deportesExistentes, deportesExternos.size());
            
        } catch (Exception e) {
            log.error("Error durante la sincronización de deportes: {}", e.getMessage(), e);
        }
    }

    /**
     * Asigna iconos y colores por defecto según el tipo de deporte
     */
    private void asignarIconoYColor(Deporte deporte, String nombreDeporte) {
        String nombre = nombreDeporte.toLowerCase();
        
        switch (nombre) {
            case "soccer":
            case "football":
                deporte.setIcono("⚽");
                deporte.setColorPrimario("#28a745");
                break;
            case "basketball":
                deporte.setIcono("🏀");
                deporte.setColorPrimario("#fd7e14");
                break;
            case "tennis":
                deporte.setIcono("🎾");
                deporte.setColorPrimario("#20c997");
                break;
            case "baseball":
                deporte.setIcono("⚾");
                deporte.setColorPrimario("#6f42c1");
                break;
            case "american football":
                deporte.setIcono("🏈");
                deporte.setColorPrimario("#dc3545");
                break;
            case "hockey":
            case "ice hockey":
                deporte.setIcono("🏒");
                deporte.setColorPrimario("#17a2b8");
                break;
            case "golf":
                deporte.setIcono("⛳");
                deporte.setColorPrimario("#ffc107");
                break;
            case "cricket":
                deporte.setIcono("🏏");
                deporte.setColorPrimario("#e83e8c");
                break;
            case "rugby":
                deporte.setIcono("🏉");
                deporte.setColorPrimario("#6c757d");
                break;
            case "boxing":
                deporte.setIcono("🥊");
                deporte.setColorPrimario("#343a40");
                break;
            case "cycling":
                deporte.setIcono("🚴");
                deporte.setColorPrimario("#007bff");
                break;
            case "swimming":
                deporte.setIcono("🏊");
                deporte.setColorPrimario("#20c997");
                break;
            default:
                deporte.setIcono("🏃");
                deporte.setColorPrimario("#6c757d");
                break;
        }
    }

    /**
     * Sincroniza las ligas de TheSportsDB con la base de datos local
     */
    private void sincronizarLigas() {
        Boolean isEnabled = true; // Cambiar a false para desactivar la sincronización
        if (!isEnabled) {
            log.info("Sincronización de ligas desactivada");
            return;
        }
        log.info("Iniciando sincronización de ligas desde TheSportsDB...");
        
        try {
            // Obtener ligas de TheSportsDB
            List<TheSportsDbLeagueResponse.LeagueData> ligasExternas = theSportsDbService.obtenerTodasLasLigas();
            
            if (ligasExternas == null || ligasExternas.isEmpty()) {
                log.warn("No se obtuvieron ligas de TheSportsDB");
                return;
            }

            int ligasCreadas = 0;
            int ligasExistentes = 0;
            int ligasOmitidas = 0;
            
            for (TheSportsDbLeagueResponse.LeagueData ligaExterna : ligasExternas) {
                try {
                    // Verificar que la liga tenga datos esenciales
                    if (ligaExterna.getStrLeague() == null || ligaExterna.getStrLeague().trim().isEmpty()) {
                        ligasOmitidas++;
                        continue;
                    }
                    
                    // Buscar el deporte correspondiente
                    Optional<Deporte> deporteOpt = deporteService.getDeporteByNombre(ligaExterna.getStrSport());
                    if (deporteOpt.isEmpty()) {
                        log.debug("Deporte {} no encontrado para la liga {}, omitiendo", 
                            ligaExterna.getStrSport(), ligaExterna.getStrLeague());
                        ligasOmitidas++;
                        continue;
                    }
                    
                    // Crear entidad Liga
                    Liga liga = new Liga();
                    liga.setNombre(ligaExterna.getStrLeague());
                    liga.setLigaIdExterno(ligaExterna.getIdLeague());
                    liga.setPais(ligaExterna.getStrCountry());
                    liga.setTemporada(ligaExterna.getStrCurrentSeason());
                    liga.setActiva(true);
                    liga.setDeporte(deporteOpt.get());
                    
                    // Asignar descripción (priorizando español)
                    String descripcion = obtenerDescripcionLiga(ligaExterna);
                    liga.setDescripcion(descripcion);
                    
                    // Asignar URLs
                    liga.setSitioWeb(ligaExterna.getStrWebsite());
                    liga.setLogoUrl(obtenerLogoLiga(ligaExterna));
                    
                    // Intentar crear la liga de forma segura
                    Liga ligaGuardada = ligaService.createLigaSafe(liga);
                    
                    if (ligaGuardada.getId() != null) {
                        // Verificar si se creó o ya existía
                        if (ligaExterna.getIdLeague() != null && 
                            ligaService.existsLigaByIdExterno(ligaExterna.getIdLeague())) {
                            ligasExistentes++;
                        } else {
                            ligasCreadas++;
                        }
                    }
                    
                } catch (Exception e) {
                    log.error("Error al procesar liga {}: {}", ligaExterna.getStrLeague(), e.getMessage());
                    ligasOmitidas++;
                }
            }
            
            log.info("Sincronización de ligas completada. Creadas: {}, Existentes: {}, Omitidas: {}, Total procesadas: {}", 
                ligasCreadas, ligasExistentes, ligasOmitidas, ligasExternas.size());
            
        } catch (Exception e) {
            log.error("Error durante la sincronización de ligas: {}", e.getMessage(), e);
        }
    }

    /**
     * Obtiene la descripción de la liga priorizando el español
     */
    private String obtenerDescripcionLiga(TheSportsDbLeagueResponse.LeagueData ligaExterna) {
        if (ligaExterna.getStrDescriptionES() != null && !ligaExterna.getStrDescriptionES().trim().isEmpty()) {
            return ligaExterna.getStrDescriptionES();
        }
        if (ligaExterna.getStrDescriptionEN() != null && !ligaExterna.getStrDescriptionEN().trim().isEmpty()) {
            return ligaExterna.getStrDescriptionEN();
        }
        return "Liga sincronizada desde TheSportsDB";
    }

    /**
     * Obtiene la URL del logo de la liga
     */
    private String obtenerLogoLiga(TheSportsDbLeagueResponse.LeagueData ligaExterna) {
        if (ligaExterna.getStrBadge() != null && !ligaExterna.getStrBadge().trim().isEmpty()) {
            return ligaExterna.getStrBadge();
        }
        if (ligaExterna.getStrLogo() != null && !ligaExterna.getStrLogo().trim().isEmpty()) {
            return ligaExterna.getStrLogo();
        }
        return null;
    }
}