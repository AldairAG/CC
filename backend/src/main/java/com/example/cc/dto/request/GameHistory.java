package com.example.cc.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.example.cc.entities.enums.GameType;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString
public class GameHistory {
  Long id;
  GameType tipo;
  LocalDateTime fecha;
  String descripcion;
  BigDecimal monto;
  BigDecimal resultado;
  String estado;
}
