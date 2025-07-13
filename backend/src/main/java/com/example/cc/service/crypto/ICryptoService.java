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
}
