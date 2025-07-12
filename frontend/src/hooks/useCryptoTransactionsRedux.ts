import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchCryptoBalances,
  fetchExchangeRates as fetchExchangeRatesAction,
  fetchCryptoTransactions,
  clearError,
  resetCryptoState,
} from '../store/slices/cryptoSlice';

export const useCryptoTransactionsRedux = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const { balances, exchangeRates, transactions, loading, error } = useAppSelector(
    (state) => state.crypto
  );

  // Fetch balances
  const fetchBalances = useCallback(async () => {
    dispatch(fetchCryptoBalances());
  }, [dispatch]);

  // Fetch exchange rates
  const fetchExchangeRates = useCallback(async () => {
    dispatch(fetchExchangeRatesAction());
  }, [dispatch]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    dispatch(fetchCryptoTransactions());
  }, [dispatch]);

  // Convert crypto amount to USD
  const convertToUSD = useCallback((amount: number, cryptoType: string): number => {
    const rate = exchangeRates.find(r => r.currency === cryptoType);
    return rate ? amount * rate.usdPrice : 0;
  }, [exchangeRates]);

  // Clear error
  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch(resetCryptoState());
  }, [dispatch]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      dispatch(fetchCryptoBalances()),
      dispatch(fetchExchangeRatesAction()),
      dispatch(fetchCryptoTransactions()),
    ]);
  }, [dispatch]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Refresh exchange rates every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchExchangeRatesAction());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return {
    balances,
    exchangeRates,
    transactions,
    loading,
    error,
    convertToUSD,
    refreshData,
    fetchBalances,
    fetchExchangeRates: fetchExchangeRates,
    fetchTransactions,
    clearError: clearErrorState,
    resetState,
  };
};
