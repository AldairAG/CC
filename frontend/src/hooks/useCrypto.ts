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
  setError,
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
import type { CreateWalletRequest, CryptoBalance, CryptoTransaction, CryptoWithdrawalRequest, ExchangeRate, UpdateWalletRequest } from '../types/CryptoTypes';
import {CryptoService} from '../service/crypto/cryptoService';

export const useCrypto = () => {
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

  // Wallet CRUD actions
  const createWallet = useCallback(async (walletData:CreateWalletRequest) => {
    try {
      const wallet = await CryptoService.createCryptoWallet(walletData);
      // Si tienes un slice de wallets, aquí deberías despachar la acción para guardar el wallet
      return wallet;
    } catch (error) {
      dispatch(setError('Error al crear wallet'));
      throw error;
    }
  }, [dispatch]);

  const getWalletById = useCallback(async (walletId: number) => {
    try {
      return await CryptoService.getCryptoWalletById(walletId);
    } catch (error) {
      dispatch(setError('Error al obtener wallet'));
      throw error;
    }
  }, [dispatch]);

  const getWalletsByUserId = useCallback(async (userId: number) => {
    try {
      return await CryptoService.getCryptoWalletsByUserId(userId);
    } catch (error) {
      dispatch(setError('Error al obtener wallets de usuario'));
      throw error;
    }
  }, [dispatch]);

  const updateWallet = useCallback(async (walletId: number, walletData: UpdateWalletRequest) => {
    try {
      return await CryptoService.updateCryptoWallet(walletId, walletData);
    } catch (error) {
      dispatch(setError('Error al actualizar wallet'));
      throw error;
    }
  }, [dispatch]);

  const deleteWallet = useCallback(async (walletId: number) => {
    try {
      await CryptoService.deleteCryptoWallet(walletId);
      // Si tienes un slice de wallets, aquí deberías despachar la acción para eliminar el wallet
    } catch (error) {
      dispatch(setError('Error al eliminar wallet'));
      throw error;
    }
  }, [dispatch]);

  // Withdraw actions
  const createWithdrawal = useCallback(async (withdrawalData: CryptoWithdrawalRequest) => {
    try {
      const tx = await CryptoService.createCryptoWithdrawal(withdrawalData);
      dispatch(addTransaction(tx));
      return tx;
    } catch (error) {
      dispatch(setError('Error al crear retiro'));
      throw error;
    }
  }, [dispatch]);

  const processWithdrawalConfirmation = useCallback(async (txHash: string, confirmations: number) => {
    try {
      await CryptoService.processWithdrawalConfirmation(txHash, confirmations);
      // Podrías actualizar el estado de la transacción en el slice si lo necesitas
    } catch (error) {
      dispatch(setError('Error al confirmar retiro'));
      throw error;
    }
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

    // Wallet CRUD
    createWallet,
    getWalletById,
    getWalletsByUserId,
    updateWallet,
    deleteWallet,
    // Withdrawals
    createWithdrawal,
    processWithdrawalConfirmation,
  };
};
