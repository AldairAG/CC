package com.example.cc.repository;

import com.example.cc.entities.TicketSoporte;
import com.example.cc.entities.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketSoporteRepository extends JpaRepository<TicketSoporte, Long> {
    List<TicketSoporte> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);
    Page<TicketSoporte> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario, Pageable pageable);
    
    List<TicketSoporte> findByEstado(TicketSoporte.EstadoTicket estado);
    List<TicketSoporte> findByCategoria(TicketSoporte.CategoriaTicket categoria);
    List<TicketSoporte> findByPrioridad(TicketSoporte.PrioridadTicket prioridad);
    
    Long countByUsuarioAndEstado(Usuario usuario, TicketSoporte.EstadoTicket estado);
}
