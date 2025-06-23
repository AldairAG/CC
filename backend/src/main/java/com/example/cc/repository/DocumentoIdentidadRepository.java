package com.example.cc.repository;

import com.example.cc.entities.DocumentoIdentidad;
import com.example.cc.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentoIdentidadRepository extends JpaRepository<DocumentoIdentidad, Long> {
    List<DocumentoIdentidad> findByUsuario(Usuario usuario);
    Optional<DocumentoIdentidad> findByUsuarioAndTipoDocumento(Usuario usuario, DocumentoIdentidad.TipoDocumento tipo);
    List<DocumentoIdentidad> findByEstado(DocumentoIdentidad.EstadoVerificacion estado);
}
