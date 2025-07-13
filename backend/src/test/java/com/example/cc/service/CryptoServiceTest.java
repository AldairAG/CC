package com.example.cc.service;

import com.example.cc.dto.crypto.CryptoToFiatConversionRequestDTO;
import com.example.cc.dto.crypto.CryptoToFiatConversionResponseDTO;
import com.example.cc.entities.CryptoTransaction;
import com.example.cc.entities.Usuario;
import com.example.cc.repository.CryptoTransactionRepository;
import com.example.cc.repository.CryptoWalletRepository;
import com.example.cc.repository.UsuarioRepository;
import com.example.cc.service.crypto.CryptoService;
import com.example.cc.repository.TransaccionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CryptoServiceTest {
    
    @Mock
    private CryptoTransactionRepository cryptoTransactionRepository;
    
    @Mock
    private CryptoWalletRepository cryptoWalletRepository;
    
    @Mock
    private UsuarioRepository usuarioRepository;
    
    @Mock
    private TransaccionRepository transaccionRepository;
    
    @InjectMocks
    private CryptoService cryptoService;
    
    private Usuario testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new Usuario();
        testUser.setIdUsuario(1L);
        testUser.setSaldoUsuario(new BigDecimal("1000.00"));
    }
    
    @Test
    void testConvertCryptoToFiat_Success() {
        // Arrange
        CryptoToFiatConversionRequestDTO request = new CryptoToFiatConversionRequestDTO();
        request.setCryptoType(CryptoTransaction.CryptoType.BTC);
        request.setAmount(new BigDecimal("0.01"));
        request.setNotes("Test conversion");
        
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(testUser);
        when(cryptoTransactionRepository.save(any(CryptoTransaction.class)))
            .thenAnswer(invocation -> {
                CryptoTransaction saved = invocation.getArgument(0);
                saved.setId(123L);
                return saved;
            });
        
        // Act
        CryptoToFiatConversionResponseDTO response = cryptoService.convertCryptoToFiat(1L, request);
        
        // Assert
        assertNotNull(response);
        assertEquals("COMPLETED", response.getStatus());
        assertEquals(new BigDecimal("0.01"), response.getCryptoAmount());
        assertNotNull(response.getUsdAmount());
        assertNotNull(response.getFiatAmountAdded());
        
        // Verify that the user's balance was updated
        verify(usuarioRepository).save(testUser);
        verify(cryptoTransactionRepository).save(any(CryptoTransaction.class));
    }
    
    @Test
    void testConvertCryptoToFiat_UserNotFound() {
        // Arrange
        CryptoToFiatConversionRequestDTO request = new CryptoToFiatConversionRequestDTO();
        request.setCryptoType(CryptoTransaction.CryptoType.BTC);
        request.setAmount(new BigDecimal("0.01"));
        
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            cryptoService.convertCryptoToFiat(1L, request);
        });
    }
}
