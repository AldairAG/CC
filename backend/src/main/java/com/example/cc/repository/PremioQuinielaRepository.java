package com.example.cc.repository;

import com.example.cc.entities.PremioQuiniela;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PremioQuinielaRepository extends JpaRepository<PremioQuiniela, Long> {
    
    List<PremioQuiniela> findByQuinielaIdOrderByPosicionAsc(Long quinielaId);
    
    List<PremioQuiniela> findByUsuarioGanadorIdAndPremioReclamadoFalse(Long usuarioId);
    
    @Query("SELECT p FROM PremioQuiniela p WHERE p.quiniela.id = :quinielaId AND p.usuarioGanadorId IS NOT NULL")
    List<PremioQuiniela> findPremiosAsignadosByQuiniela(@Param("quinielaId") Long quinielaId);
    
    @Query("SELECT SUM(p.montoPremio) FROM PremioQuiniela p WHERE p.quiniela.id = :quinielaId")
    java.math.BigDecimal getTotalPremiosQuiniela(@Param("quinielaId") Long quinielaId);
}
