package com.example.cc.service.deportes;

import com.example.cc.entities.Deporte;
import com.example.cc.repository.DeporteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DeporteService implements IDeporteService {

    private final DeporteRepository deporteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Deporte> getAllDeportes() {
        log.debug("Obteniendo todos los deportes");
        return deporteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Deporte> getDeportesActivos() {
        log.debug("Obteniendo deportes activos");
        return deporteRepository.findByActivoTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Deporte> getDeporteById(Long id) {
        log.debug("Obteniendo deporte por ID: {}", id);
        return deporteRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Deporte> getDeporteByNombre(String nombre) {
        log.debug("Obteniendo deporte por nombre: {}", nombre);
        return deporteRepository.findByNombreIgnoreCase(nombre);
    }

    @Override
    public Deporte createDeporte(Deporte deporte) {
        log.info("Creando nuevo deporte: {}", deporte.getNombre());
        
        // Verificar si ya existe
        if (deporteRepository.existsByNombre(deporte.getNombre())) {
            throw new IllegalArgumentException("Ya existe un deporte con el nombre: " + deporte.getNombre());
        }
        
        return deporteRepository.save(deporte);
    }

    @Override
    public Deporte updateDeporte(Long id, Deporte deporteActualizado) {
        log.info("Actualizando deporte con ID: {}", id);
        
        return deporteRepository.findById(id)
            .map(deporte -> {
                deporte.setNombre(deporteActualizado.getNombre());
                deporte.setDescripcion(deporteActualizado.getDescripcion());
                deporte.setActivo(deporteActualizado.getActivo());
                deporte.setIcono(deporteActualizado.getIcono());
                deporte.setColorPrimario(deporteActualizado.getColorPrimario());
                return deporteRepository.save(deporte);
            })
            .orElseThrow(() -> new RuntimeException("Deporte no encontrado con ID: " + id));
    }

    @Override
    public void deleteDeporte(Long id) {
        log.info("Desactivando deporte con ID: {}", id);
        
        deporteRepository.findById(id)
            .map(deporte -> {
                deporte.setActivo(false);
                return deporteRepository.save(deporte);
            })
            .orElseThrow(() -> new RuntimeException("Deporte no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Deporte> searchDeportesByNombre(String nombre) {
        log.debug("Buscando deportes por nombre: {}", nombre);
        return deporteRepository.findByNombreContaining(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsDeporte(String nombre) {
        return deporteRepository.existsByNombre(nombre);
    }

    @Override
    public Deporte createDeporteSafe(Deporte deporte) {
        log.info("Creando deporte de forma segura: {}", deporte.getNombre());
        
        // Verificar si ya existe
        Optional<Deporte> existente = deporteRepository.findByNombreIgnoreCase(deporte.getNombre());
        if (existente.isPresent()) {
            log.debug("El deporte {} ya existe, retornando el existente", deporte.getNombre());
            return existente.get();
        }
        
        // Si no existe, crearlo
        return deporteRepository.save(deporte);
    }
}
