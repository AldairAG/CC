package com.example.cc.service.deportes;

import com.example.cc.entities.Liga;
import com.example.cc.entities.Deporte;
import com.example.cc.repository.LigaRepository;
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
public class LigaService implements ILigaService {

    private final LigaRepository ligaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Liga> getAllLigas() {
        log.debug("Obteniendo todas las ligas");
        return ligaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Liga> getLigasActivas() {
        log.debug("Obteniendo ligas activas");
        return ligaRepository.findByActivaTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Liga> getLigaById(Long id) {
        log.debug("Obteniendo liga por ID: {}", id);
        return ligaRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Liga> getLigaByNombre(String nombre) {
        log.debug("Obteniendo liga por nombre: {}", nombre);
        return ligaRepository.findByNombreIgnoreCase(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Liga> getLigaByIdExterno(String ligaIdExterno) {
        log.debug("Obteniendo liga por ID externo: {}", ligaIdExterno);
        return ligaRepository.findByLigaIdExterno(ligaIdExterno);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Liga> getLigasByDeporte(Deporte deporte) {
        log.debug("Obteniendo ligas por deporte: {}", deporte.getNombre());
        return ligaRepository.findByDeporte(deporte);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Liga> getLigasActivasByDeporte(Deporte deporte) {
        log.debug("Obteniendo ligas activas por deporte: {}", deporte.getNombre());
        return ligaRepository.findByDeporteAndActivaTrue(deporte);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Liga> getLigasByPais(String pais) {
        log.debug("Obteniendo ligas por país: {}", pais);
        return ligaRepository.findByPais(pais);
    }

    @Override
    public Liga createLiga(Liga liga) {
        log.info("Creando nueva liga: {}", liga.getNombre());
        
        // Verificar si ya existe una liga con el mismo nombre
        if (ligaRepository.existsByNombre(liga.getNombre())) {
            throw new IllegalArgumentException("Ya existe una liga con el nombre: " + liga.getNombre());
        }
        
        return ligaRepository.save(liga);
    }

    @Override
    public Liga updateLiga(Long id, Liga ligaActualizada) {
        log.info("Actualizando liga con ID: {}", id);
        
        return ligaRepository.findById(id)
            .map(liga -> {
                liga.setNombre(ligaActualizada.getNombre());
                liga.setLigaIdExterno(ligaActualizada.getLigaIdExterno());
                liga.setPais(ligaActualizada.getPais());
                liga.setTemporada(ligaActualizada.getTemporada());
                liga.setDescripcion(ligaActualizada.getDescripcion());
                liga.setActiva(ligaActualizada.getActiva());
                liga.setLogoUrl(ligaActualizada.getLogoUrl());
                liga.setSitioWeb(ligaActualizada.getSitioWeb());
                liga.setFechaInicio(ligaActualizada.getFechaInicio());
                liga.setFechaFin(ligaActualizada.getFechaFin());
                liga.setDeporte(ligaActualizada.getDeporte());
                return ligaRepository.save(liga);
            })
            .orElseThrow(() -> new RuntimeException("Liga no encontrada con ID: " + id));
    }

    @Override
    public void deleteLiga(Long id) {
        log.info("Desactivando liga con ID: {}", id);
        
        ligaRepository.findById(id)
            .map(liga -> {
                liga.setActiva(false);
                return ligaRepository.save(liga);
            })
            .orElseThrow(() -> new RuntimeException("Liga no encontrada con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Liga> searchLigasByNombre(String nombre) {
        log.debug("Buscando ligas por nombre: {}", nombre);
        return ligaRepository.findByNombreContaining(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Liga> getLigasPopulares() {
        log.debug("Obteniendo ligas populares");
        return ligaRepository.findLigasPopulares();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsLiga(String nombre) {
        return ligaRepository.existsByNombre(nombre);
    }

    @Override
    public Liga createLigaSafe(Liga liga) {
        log.info("Creando liga de forma segura: {}", liga.getNombre());
        
        // Verificar si ya existe por ID externo
        if (liga.getLigaIdExterno() != null) {
            Optional<Liga> existentePorId = ligaRepository.findByLigaIdExterno(liga.getLigaIdExterno());
            if (existentePorId.isPresent()) {
                log.debug("La liga {} ya existe con ID externo {}, retornando la existente", 
                    liga.getNombre(), liga.getLigaIdExterno());
                return existentePorId.get();
            }
        }
        
        // Verificar si ya existe por nombre
        Optional<Liga> existentePorNombre = ligaRepository.findByNombreIgnoreCase(liga.getNombre());
        if (existentePorNombre.isPresent()) {
            log.debug("La liga {} ya existe, retornando la existente", liga.getNombre());
            return existentePorNombre.get();
        }
        
        // Si no existe, crearla
        return ligaRepository.save(liga);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsLigaByIdExterno(String ligaIdExterno) {
        return ligaRepository.existsByLigaIdExterno(ligaIdExterno);
    }
}
