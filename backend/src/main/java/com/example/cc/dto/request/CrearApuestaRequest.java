package com.example.cc.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.example.cc.entities.enums.TipoApuesta;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearApuestaRequest {

    @NotNull(message = "El ID del usuario es requerido")
    private Long idUsuario;
    
    @NotNull(message = "El ID del evento es requerido")
    private Long idEvento;
    
    @NotNull(message = "El tipo de apuesta es requerido")
    private TipoApuesta tipoApuesta;
    
    @NotNull(message = "El monto de la apuesta es requerido")
    @DecimalMin(value = "1.0", message = "El monto mínimo de apuesta es $1")
    @DecimalMax(value = "10000.0", message = "El monto máximo de apuesta es $10,000")
    @Digits(integer = 8, fraction = 2, message = "El monto debe tener máximo 2 decimales")
    private BigDecimal montoApuesta;
    
    @NotNull(message = "La cuota de la apuesta es requerida")
    @DecimalMin(value = "1.01", message = "La cuota mínima es 1.01")
    @DecimalMax(value = "1000.0", message = "La cuota máxima es 1000.0")
    @Digits(integer = 4, fraction = 2, message = "La cuota debe tener máximo 2 decimales")
    private BigDecimal cuotaApuesta;
    
    @NotBlank(message = "La predicción del usuario es requerida")
    @Size(max = 500, message = "La predicción no puede exceder 500 caracteres")
    private String prediccionUsuario;
    
    @Size(max = 1000, message = "Los detalles no pueden exceder 1000 caracteres")
    private String detalleApuesta;
    
    // Campos opcionales para crear evento automáticamente si no existe
    private String equipoLocal;
    private String equipoVisitante;
    private String fechaEvento; // formato YYYY-MM-DD
}
