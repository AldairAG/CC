import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Base selector
const selectCrypto = (state: RootState) => state.crypto;

// ===== DATA SELECTORS =====
export const selectCryptoBalances = createSelector(
  [selectCrypto],
  (crypto) => crypto.balances
);

export const selectCryptoExchangeRates = createSelector(
  [selectCrypto],
  (crypto) => crypto.exchangeRates
);

export const selectCryptoTransactions = createSelector(
  [selectCrypto],
  (crypto) => crypto.transactions
);

export const selectPendingTransactions = createSelector(
  [selectCrypto],
  (crypto) => crypto.pendingTransactions
);

export const selectWalletList = createSelector(
  [selectCrypto],
  (crypto) => crypto.walletList
);

// ===== LOADING SELECTORS =====
export const selectCryptoLoading = createSelector(
  [selectCrypto],
  (crypto) => crypto.loading
);

export const selectFetchingBalances = createSelector(
  [selectCrypto],
  (crypto) => crypto.fetchingBalances
);

export const selectFetchingRates = createSelector(
  [selectCrypto],
  (crypto) => crypto.fetchingRates
);

export const selectFetchingTransactions = createSelector(
  [selectCrypto],
  (crypto) => crypto.fetchingTransactions
);

export const selectFetchingWallets = createSelector(
  [selectCrypto],
  (crypto) => crypto.fetchingWallets
);

export const selectFetchingPendingTransactions = createSelector(
  [selectCrypto],
  (crypto) => crypto.fetchingPendingTransactions
);

// ===== OPERATION SELECTORS =====
export const selectCreatingWallet = createSelector(
  [selectCrypto],
  (crypto) => crypto.creatingWallet
);

export const selectUpdatingWallet = createSelector(
  [selectCrypto],
  (crypto) => crypto.updatingWallet
);

export const selectDeletingWallet = createSelector(
  [selectCrypto],
  (crypto) => crypto.deletingWallet
);

export const selectCreatingDeposit = createSelector(
  [selectCrypto],
  (crypto) => crypto.creatingDeposit
);

export const selectCreatingWithdrawal = createSelector(
  [selectCrypto],
  (crypto) => crypto.creatingWithdrawal
);

export const selectApprovingTransaction = createSelector(
  [selectCrypto],
  (crypto) => crypto.approvingTransaction
);

// ===== ERROR SELECTORS =====
export const selectCryptoError = createSelector(
  [selectCrypto],
  (crypto) => crypto.error
);

// ===== COMPUTED SELECTORS =====
export const selectCryptoBalanceByType = createSelector(
  [selectCryptoBalances, (_state: RootState, cryptoType: string) => cryptoType],
  (balances, cryptoType) => balances.find(balance => balance.cryptoType === cryptoType)
);

export const selectExchangeRateByType = createSelector(
  [selectCryptoExchangeRates, (_state: RootState, cryptoType: string) => cryptoType],
  (exchangeRates, cryptoType) => exchangeRates.find(rate => rate.currency === cryptoType)
);

export const selectTotalPortfolioValue = createSelector(
  [selectCryptoBalances, selectCryptoExchangeRates],
  (balances, exchangeRates) => {
    return balances.reduce((total, balance) => {
      const rate = exchangeRates.find(r => r.currency === balance.cryptoType);
      return total + (balance.balance * (rate?.usdPrice || 0));
    }, 0);
  }
);

export const selectRecentTransactions = createSelector(
  [selectCryptoTransactions],
  (transactions) => transactions.slice(0, 5)
);

export const selectPortfolioStats = createSelector(
  [selectCryptoBalances, selectCryptoExchangeRates],
  (balances, exchangeRates) => {
    const totalValue = balances.reduce((total, balance) => {
      const rate = exchangeRates.find(r => r.currency === balance.cryptoType);
      return total + (balance.balance * (rate?.usdPrice || 0));
    }, 0);
    
    const totalPendingDeposits = balances.reduce((total, balance) => {
      return total + (balance.pendingDeposits || 0);
    }, 0);
    
    const totalPendingWithdrawals = balances.reduce((total, balance) => {
      return total + (balance.pendingWithdrawals || 0);
    }, 0);
    
    return {
      totalValue,
      totalPendingDeposits,
      totalPendingWithdrawals,
      cryptoCount: balances.length,
    };
  }
);

export const selectWalletsByType = createSelector(
  [selectWalletList, (_state: RootState, cryptoType: string) => cryptoType],
  (wallets, cryptoType) => wallets.filter(wallet => wallet.cryptoType === cryptoType)
);

export const selectActiveWallets = createSelector(
  [selectWalletList],
  (wallets) => wallets.filter(wallet => wallet.isActive)
);

export const selectTransactionsByType = createSelector(
  [selectCryptoTransactions, (_state: RootState, cryptoType: string) => cryptoType],
  (transactions, cryptoType) => transactions.filter(tx => tx.cryptoType === cryptoType)
);

export const selectTransactionsByStatus = createSelector(
  [selectCryptoTransactions, (_state: RootState, status: string) => status],
  (transactions, status) => transactions.filter(tx => tx.status === status)
);

export const selectPendingTransactionsByType = createSelector(
  [selectPendingTransactions, (_state: RootState, type: string) => type],
  (transactions, type) => transactions.filter(tx => tx.type === type)
);
