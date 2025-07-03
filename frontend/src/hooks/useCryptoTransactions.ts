import { useState, useEffect, useCallback } from 'react';
import type { CryptoBalance, ExchangeRate, CryptoTransaction } from '../types/CryptoTypes';
import { CryptoService } from '../service/crypto/cryptoService';

export const useCryptoTransactions = () => {
  const [balances, setBalances] = useState<CryptoBalance[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch balances
  const fetchBalances = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CryptoService.getCryptoBalances();
      setBalances(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching crypto balances:', err);
      setError('Error al cargar balances');
      // Set default empty balances if error
      setBalances([
        { cryptoType: 'BTC', balance: 0 },
        { cryptoType: 'ETH', balance: 0 },
        { cryptoType: 'SOL', balance: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch exchange rates
  const fetchExchangeRates = useCallback(async () => {
    try {
      const data = await CryptoService.getExchangeRates();
      setExchangeRates(data);
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      // Set default rates if error
      setExchangeRates([
        { currency: 'BTC', usdPrice: 45000, timestamp: new Date() },
        { currency: 'ETH', usdPrice: 3000, timestamp: new Date() },
        { currency: 'SOL', usdPrice: 100, timestamp: new Date() },
      ]);
    }
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const data = await CryptoService.getCryptoTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching crypto transactions:', err);
      setTransactions([]);
    }
  }, []);

  // Convert crypto amount to USD
  const convertToUSD = useCallback((amount: number, cryptoType: string): number => {
    const rate = exchangeRates.find(r => r.currency === cryptoType);
    return rate ? amount * rate.usdPrice : 0;
  }, [exchangeRates]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchBalances(),
      fetchExchangeRates(),
      fetchTransactions(),
    ]);
  }, [fetchBalances, fetchExchangeRates, fetchTransactions]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Refresh exchange rates every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchExchangeRates]);

  return {
    balances,
    exchangeRates,
    transactions,
    loading,
    error,
    convertToUSD,
    refreshData,
    fetchBalances,
    fetchExchangeRates,
    fetchTransactions,
  };
};
