package com.example.cc.service.quiniela;

import com.example.cc.dto.quiniela.*;
import com.example.cc.entities.*;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.util.Date;

public interface IQuinielaService {
    // Métodos CRUD básicos
    List<Quiniela> findAll();
    Optional<Quiniela> findById(Long id);
    Quiniela save(Quiniela quiniela);
    void deleteById(Long id);
    
    // Métodos de búsqueda
    List<Quiniela> findByEstado(String estado);
    List<Quiniela> findByFechaInicioBetween(Date fechaInicio, Date fechaFin);
    List<Quiniela> findByPrecioParticipacionLessThanEqual(Float precio);
    List<Quiniela> findByTipoPremio(String tipoPremio);
    
    // Métodos de actualización
    void actualizarPremioAcumulado(Long id, BigDecimal nuevoPremio);
    void actualizarEstado(Long id, String nuevoEstado);
    
    // Métodos avanzados de QuinielaService
    QuinielaResponse crearQuiniela(CrearQuinielaRequest request, Long usuarioId);
    ParticipacionQuiniela unirseQuiniela(UnirseQuinielaRequestDto request, Long usuarioId);
    void hacerPredicciones(HacerPrediccionesRequestDto request, Long usuarioId);
    void distribuirPremios(Long quinielaId, Long usuarioId);
    
    // Métodos de consulta avanzados
    List<QuinielaResponse> obtenerQuinielasPublicas();
    List<QuinielaResponse> obtenerQuinielasUsuario(Long usuarioId);
    List<QuinielaResponse> obtenerQuinielasParticipacion(Long usuarioId);
    QuinielaResponse obtenerQuinielaPorId(Long quinielaId);
    
    // Métodos adicionales para filtros y búsquedas
    List<QuinielaResponse> obtenerQuinielasPorEstado(String estado);
    List<QuinielaResponse> obtenerQuinielasPorPrecioMaximo(Float precioMaximo);
    List<QuinielaResponse> obtenerQuinielasPorTipoPremio(String tipoPremio);
    List<QuinielaResponse> obtenerQuinielasPorRangoFecha(Date fechaInicio, Date fechaFin);
    List<QuinielaResponse> busquedaAvanzadaQuinielas(String estado, Float precioMaximo, String tipoPremio, Date fechaInicio, Date fechaFin);
    
    // Métodos de administración
    void eliminarQuiniela(Long id, Long usuarioId);
    void finalizarQuiniela(Long id, Long usuarioId);
      // Métodos de estadísticas
    EstadisticasQuinielaResponse obtenerEstadisticasQuiniela(Long id);
    
    // Método adicional para paginación
    List<QuinielaResponse> obtenerTodasQuinielas(int page, int size);
}
