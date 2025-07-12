import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchCryptoBalances,
  fetchExchangeRates,
  fetchCryptoTransactions,
  setBalances,
  setExchangeRates,
  setTransactions,
  addTransaction,
  updateBalance,
  clearError,
  resetCryptoState,
} from '../store/slices/cryptoSlice';
import {
  selectCryptoBalances,
  selectCryptoExchangeRates,
  selectCryptoTransactions,
  selectCryptoLoading,
  selectCryptoError,
  selectCryptoBalanceByType,
  selectExchangeRateByType,
  selectTotalPortfolioValue,
  selectRecentTransactions,
  selectPortfolioStats,
} from '../store/selectors/cryptoSelectors';
import type { CryptoBalance, CryptoTransaction, ExchangeRate } from '../types/CryptoTypes';

export const useCryptoStore = () => {
  const dispatch = useAppDispatch();
  
  // Basic selectors
  const balances = useAppSelector(selectCryptoBalances);
  const exchangeRates = useAppSelector(selectCryptoExchangeRates);
  const transactions = useAppSelector(selectCryptoTransactions);
  const loading = useAppSelector(selectCryptoLoading);
  const error = useAppSelector(selectCryptoError);
  
  // Computed selectors
  const totalPortfolioValue = useAppSelector(selectTotalPortfolioValue);
  const recentTransactions = useAppSelector(selectRecentTransactions);
  const portfolioStats = useAppSelector(selectPortfolioStats);

  // Async actions
  const fetchBalances = useCallback(() => {
    dispatch(fetchCryptoBalances());
  }, [dispatch]);

  const fetchRates = useCallback(() => {
    dispatch(fetchExchangeRates());
  }, [dispatch]);

  const fetchTransactions = useCallback(() => {
    dispatch(fetchCryptoTransactions());
  }, [dispatch]);

  // Sync actions
  const setBalancesData = useCallback((balances: CryptoBalance[]) => {
    dispatch(setBalances(balances));
  }, [dispatch]);

  const setExchangeRatesData = useCallback((rates: ExchangeRate[]) => {
    dispatch(setExchangeRates(rates));
  }, [dispatch]);

  const setTransactionsData = useCallback((transactions: CryptoTransaction[]) => {
    dispatch(setTransactions(transactions));
  }, [dispatch]);

  const addNewTransaction = useCallback((transaction: CryptoTransaction) => {
    dispatch(addTransaction(transaction));
  }, [dispatch]);

  const updateCryptoBalance = useCallback((balance: CryptoBalance) => {
    dispatch(updateBalance(balance));
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetCryptoState());
  }, [dispatch]);

  // Utility functions
  const getBalanceByType = useCallback((cryptoType: string) => {
    return useAppSelector(state => selectCryptoBalanceByType(state, cryptoType));
  }, []);

  const getExchangeRateByType = useCallback((cryptoType: string) => {
    return useAppSelector(state => selectExchangeRateByType(state, cryptoType));
  }, []);

  const convertToUSD = useCallback((amount: number, cryptoType: string): number => {
    const rate = exchangeRates.find(r => r.currency === cryptoType);
    return rate ? amount * rate.usdPrice : 0;
  }, [exchangeRates]);

  const refreshAllData = useCallback(async () => {
    await Promise.all([
      dispatch(fetchCryptoBalances()),
      dispatch(fetchExchangeRates()),
      dispatch(fetchCryptoTransactions()),
    ]);
  }, [dispatch]);

  return {
    // State
    balances,
    exchangeRates,
    transactions,
    loading,
    error,
    
    // Computed values
    totalPortfolioValue,
    recentTransactions,
    portfolioStats,
    
    // Async actions
    fetchBalances,
    fetchRates,
    fetchTransactions,
    refreshAllData,
    
    // Sync actions
    setBalancesData,
    setExchangeRatesData,
    setTransactionsData,
    addNewTransaction,
    updateCryptoBalance,
    clearErrorState,
    resetState,
    
    // Utility functions
    getBalanceByType,
    getExchangeRateByType,
    convertToUSD,
  };
};
