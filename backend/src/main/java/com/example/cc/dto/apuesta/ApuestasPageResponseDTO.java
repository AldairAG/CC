package com.example.cc.dto.apuesta;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApuestasPageResponseDTO {
    private List<ApuestaResponseDTO> content;
    private int number;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
    private boolean empty;
}
