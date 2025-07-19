package com.example.cc.dto.crypto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoAdminApprovalRequestDTO {
    
    @NotNull(message = "El ID de la transacción es obligatorio")
    private Long transactionId;
    
    @NotNull(message = "La decisión es obligatoria")
    private Boolean approved; // true para aprobar, false para rechazar
    
    private String adminNotes; // Notas del administrador
}
