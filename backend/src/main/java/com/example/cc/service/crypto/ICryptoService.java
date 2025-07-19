package com.example.cc.service.crypto;

import com.example.cc.dto.crypto.*;
import com.example.cc.entities.*;
import java.math.BigDecimal;
import java.util.List;

public interface ICryptoService {
    BigDecimal getCryptoPriceFromApi(CryptoTransaction.CryptoType cryptoType);
    List<CryptoBalanceDTO> getUserCryptoBalances(Long userId);
    CryptoToFiatConversionResponseDTO convertCryptoToFiat(Long userId, CryptoToFiatConversionRequestDTO request);
    CryptoTransactionDTO createDeposit(Long userId, CryptoDepositRequestDTO request);
    void processConfirmation(String txHash, int confirmations);
    List<CryptoTransactionDTO> getUserCryptoTransactions(Long userId);
    CryptoTransactionDTO transferCrypto(Long userId, String fromAddress, String toAddress, BigDecimal amount, CryptoTransaction.CryptoType cryptoType, CryptoTransaction.TransactionType transactionType);
    CryptoTransactionDTO createWithdrawal(Long userId, String toAddress, BigDecimal amount, CryptoTransaction.CryptoType cryptoType);
    void processWithdrawalConfirmation(String txHash, int confirmations);
    
    // CRUD para CryptoWallet
    CryptoWallet createCryptoWallet(CryptoWallet wallet);
    CryptoWallet getCryptoWalletById(Long walletId);
    List<CryptoWallet> getCryptoWalletsByUserId(Long userId);
    CryptoWallet updateCryptoWallet(Long walletId, CryptoWallet wallet);
    void deleteCryptoWallet(Long walletId);
    
    // Operaciones manuales
    CryptoTransactionDTO createManualDepositRequest(Long userId, CryptoManualDepositRequestDTO request);
    CryptoTransactionDTO createManualWithdrawalRequest(Long userId, CryptoManualWithdrawalRequestDTO request);
    CryptoTransactionDTO approveManualTransaction(Long transactionId, CryptoAdminApprovalRequestDTO request);
    List<CryptoTransactionDTO> getPendingManualTransactions();
    
    // Operaciones automáticas con verificación externa
    CryptoTransactionDTO createAutomaticDeposit(Long userId, CryptoDepositRequestDTO request);
    CryptoTransactionDTO createAutomaticWithdrawal(Long userId, String toAddress, BigDecimal amount, CryptoTransaction.CryptoType cryptoType);
    boolean verifyTransactionWithExternalApi(String txHash, CryptoTransaction.CryptoType cryptoType);
    
    // Conversiones para DTOs
    CryptoWalletDTO convertToWalletDTO(CryptoWallet wallet);
    CryptoWallet convertFromWalletDTO(CryptoWalletCreateRequestDTO dto, Long userId);
}
