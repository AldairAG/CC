package com.example.cc.service.quinielaArmada;

import com.example.cc.entities.QuinielaArmada;
import com.example.cc.entities.objectsEmbed.QuinielaArmadaId;
import com.example.cc.repository.QuinielaArmadaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class QuinielaArmadaServiceImpl implements IQuinielaArmadaService {

    @Autowired
    private QuinielaArmadaRepository quinielaArmadaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaArmada> findAll() {
        return quinielaArmadaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<QuinielaArmada> findById(QuinielaArmadaId id) {
        return quinielaArmadaRepository.findById(id);
    }

    @Override
    @Transactional
    public QuinielaArmada save(QuinielaArmada quinielaArmada) {
        return quinielaArmadaRepository.save(quinielaArmada);
    }

    @Override
    @Transactional
    public void deleteById(QuinielaArmadaId id) {
        quinielaArmadaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaArmada> findByUsuarioId(Long usuarioId) {
        return quinielaArmadaRepository.findByUsuarioIdUsuario(usuarioId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaArmada> findByQuinielaId(Long quinielaId) {
        return quinielaArmadaRepository.findByQuinielaIdQuiniela(quinielaId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuinielaArmada> findByUsuarioIdAndQuinielaId(Long usuarioId, Long quinielaId) {
        return quinielaArmadaRepository.findByUsuarioIdUsuarioAndQuinielaIdQuiniela(usuarioId, quinielaId);
    }
}
