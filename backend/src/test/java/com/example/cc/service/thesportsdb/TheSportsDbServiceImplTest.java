package com.example.cc.service.thesportsdb;

import com.example.cc.dto.response.TheSportsDbEventResponse;
import com.example.cc.dto.response.TheSportsDbTeamResponse;
import com.example.cc.dto.response.TheSportsDbLeagueResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class TheSportsDbServiceImplTest {
    
    @Autowired
    private ITheSportsDbService theSportsDbService;
    
    @Test
    void testVerificarConectividad() {
        // Verificar que el servicio puede conectarse a la API
        boolean conectado = theSportsDbService.verificarConectividad();
        
        // Debería poder conectarse (asumiendo conexión a internet)
        assertTrue(conectado, "Debería poder conectarse a TheSportsDB API");
    }
    
    @Test
    void testObtenerEstadoApi() {
        // Obtener el estado de la API
        String estado = theSportsDbService.obtenerEstadoApi();
        
        assertNotNull(estado, "El estado no debería ser null");
        assertTrue(estado.contains("TheSportsDB"), "El estado debería mencionar TheSportsDB");
    }
    
    @Test
    void testBuscarEquipoPorNombre() {
        // Buscar un equipo conocido (Arsenal)
        Optional<TheSportsDbTeamResponse> equipo = theSportsDbService.buscarEquipoPorNombre("Arsenal");
        
        if (equipo.isPresent()) {
            assertNotNull(equipo.get().getStrTeam(), "El nombre del equipo no debería ser null");
            assertTrue(equipo.get().getStrTeam().toLowerCase().contains("arsenal"), 
                      "El equipo debería contener 'arsenal' en su nombre");
        }
        // No forzamos que el equipo exista ya que depende de la API externa
    }
    
    @Test
    void testBuscarEventosPorFecha() {
        // Buscar eventos de una fecha reciente
        LocalDate fechaPrueba = LocalDate.now().minusDays(1);
        List<TheSportsDbEventResponse> eventos = theSportsDbService.buscarEventosPorFecha(fechaPrueba);
        
        assertNotNull(eventos, "La lista de eventos no debería ser null");
        // No verificamos el tamaño ya que puede variar según la fecha
    }
    
    @Test
    void testObtenerTodasLasLigas() {
        // Obtener todas las ligas
        List<TheSportsDbLeagueResponse> ligas = theSportsDbService.obtenerTodasLasLigas();
        
        assertNotNull(ligas, "La lista de ligas no debería ser null");
        // Debería haber al menos algunas ligas disponibles
        if (!ligas.isEmpty()) {
            TheSportsDbLeagueResponse primeraLiga = ligas.get(0);
            assertNotNull(primeraLiga.getStrLeague(), "El nombre de la liga no debería ser null");
        }
    }
    
    @Test
    void testBuscarLigasPorDeporte() {
        // Buscar ligas de fútbol
        List<TheSportsDbLeagueResponse> ligasFutbol = theSportsDbService.buscarLigasPorDeporte("Soccer");
        
        assertNotNull(ligasFutbol, "La lista de ligas de fútbol no debería ser null");
        
        // Si hay ligas, verificar que sean de fútbol
        ligasFutbol.forEach(liga -> {
            if (liga.getStrSport() != null) {
                assertTrue(liga.getStrSport().toLowerCase().contains("soccer") || 
                          liga.getStrSport().toLowerCase().contains("football"),
                          "La liga debería ser de fútbol/soccer");
            }
        });
    }
    
    @Test
    void testObtenerEstadisticasUso() {
        // Realizar algunas operaciones para generar estadísticas
        theSportsDbService.verificarConectividad();
        theSportsDbService.obtenerEstadoApi();
        
        // Obtener estadísticas
        String estadisticas = theSportsDbService.obtenerEstadisticasUso();
        
        assertNotNull(estadisticas, "Las estadísticas no deberían ser null");
        assertTrue(estadisticas.contains("Total"), "Las estadísticas deberían contener información de totales");
        assertTrue(estadisticas.contains("TheSportsDB"), "Las estadísticas deberían mencionar TheSportsDB");
    }
    
    @Test
    void testLimpiarCache() {
        // Este test simplemente verifica que el método no lance excepciones
        assertDoesNotThrow(() -> {
            theSportsDbService.limpiarCache();
        }, "Limpiar caché no debería lanzar excepciones");
    }
}
