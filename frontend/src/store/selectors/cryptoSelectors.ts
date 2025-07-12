import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Base selector
const selectCrypto = (state: RootState) => state.crypto;

// Selectors específicos
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

export const selectCryptoLoading = createSelector(
  [selectCrypto],
  (crypto) => crypto.loading
);

export const selectCryptoError = createSelector(
  [selectCrypto],
  (crypto) => crypto.error
);

// Selector para obtener balance específico de una crypto
export const selectCryptoBalanceByType = createSelector(
  [selectCryptoBalances, (_state: RootState, cryptoType: string) => cryptoType],
  (balances, cryptoType) => balances.find(balance => balance.cryptoType === cryptoType)
);

// Selector para obtener tasa de cambio específica
export const selectExchangeRateByType = createSelector(
  [selectCryptoExchangeRates, (_state: RootState, cryptoType: string) => cryptoType],
  (exchangeRates, cryptoType) => exchangeRates.find(rate => rate.currency === cryptoType)
);

// Selector para obtener valor total en USD de todos los balances
export const selectTotalPortfolioValue = createSelector(
  [selectCryptoBalances, selectCryptoExchangeRates],
  (balances, exchangeRates) => {
    return balances.reduce((total, balance) => {
      const rate = exchangeRates.find(r => r.currency === balance.cryptoType);
      return total + (rate ? balance.balance * rate.usdPrice : 0);
    }, 0);
  }
);

// Selector para obtener transacciones por tipo
export const selectTransactionsByType = createSelector(
  [selectCryptoTransactions, (_state: RootState, transactionType: string) => transactionType],
  (transactions, transactionType) => 
    transactions.filter(transaction => transaction.transactionType === transactionType)
);

// Selector para obtener transacciones recientes (últimas 10)
export const selectRecentTransactions = createSelector(
  [selectCryptoTransactions],
  (transactions) => 
    [...transactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
);

// Selector para obtener estadísticas del portafolio
export const selectPortfolioStats = createSelector(
  [selectCryptoBalances, selectCryptoExchangeRates, selectCryptoTransactions],
  (balances, exchangeRates, transactions) => {
    const totalValue = balances.reduce((total, balance) => {
      const rate = exchangeRates.find(r => r.currency === balance.cryptoType);
      return total + (rate ? balance.balance * rate.usdPrice : 0);
    }, 0);

    const totalTransactions = transactions.length;
    const completedTransactions = transactions.filter(t => t.status === 'COMPLETED').length;
    const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length;

    return {
      totalValue,
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      cryptoCount: balances.length,
    };
  }
);
