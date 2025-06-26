import { useState, useCallback, useEffect } from 'react';
import { cryptoService } from '../service/api/cryptoService';
import type { 
  CryptoTransaction, 
  CryptoDepositRequest, 
  CryptoWithdrawalRequest,
  CryptoExchangeRate,
  CryptoBalance,
  CryptoDepositAddress,
  CryptoTransactionFee,
  CryptoNetwork,
  CryptoType
} from '../types/CryptoTypes';

export const useCryptoTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networks, setNetworks] = useState<CryptoNetwork[]>([]);
  const [exchangeRates, setExchangeRates] = useState<CryptoExchangeRate[]>([]);
  const [balances, setBalances] = useState<CryptoBalance[]>([]);
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [depositAddress, setDepositAddress] = useState<CryptoDepositAddress | null>(null);

  // Cargar redes soportadas
  const fetchSupportedNetworks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const networksData = await cryptoService.getSupportedNetworks();
      setNetworks(networksData);
      return networksData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar redes';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar tipos de cambio
  const fetchExchangeRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rates = await cryptoService.getExchangeRates();
      setExchangeRates(rates);
      return rates;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar tipos de cambio';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar balances
  const fetchBalances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const balancesData = await cryptoService.getCryptoBalances();
      setBalances(balancesData);
      return balancesData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar balances';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Generar dirección de depósito
  const generateDepositAddress = useCallback(async (cryptoType: CryptoType) => {
    try {
      setLoading(true);
      setError(null);
      const address = await cryptoService.generateDepositAddress(cryptoType);
      setDepositAddress(address);
      return { success: true, address };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar dirección';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear depósito
  const createDeposit = useCallback(async (depositData: CryptoDepositRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validar dirección primero
      const isValidAddress = await cryptoService.validateAddress(
        depositData.userWalletAddress, 
        depositData.cryptoType
      );
      
      if (!isValidAddress) {
        throw new Error('Dirección de wallet inválida');
      }

      const transaction = await cryptoService.createDeposit(depositData);
      
      // Actualizar lista de transacciones
      setTransactions(prev => [transaction, ...prev]);
      
      // Actualizar balances
      await fetchBalances();
      
      return { success: true, transaction };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear depósito';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchBalances]);

  // Crear retiro
  const createWithdrawal = useCallback(async (withdrawalData: CryptoWithdrawalRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validar dirección de destino
      const isValidAddress = await cryptoService.validateAddress(
        withdrawalData.destinationAddress, 
        withdrawalData.cryptoType
      );
      
      if (!isValidAddress) {
        throw new Error('Dirección de destino inválida');
      }

      // Verificar balance suficiente
      const balance = balances.find(b => b.cryptoType === withdrawalData.cryptoType);
      if (!balance || balance.balance < withdrawalData.amount) {
        throw new Error('Balance insuficiente');
      }

      const transaction = await cryptoService.createWithdrawal(withdrawalData);
      
      // Actualizar lista de transacciones
      setTransactions(prev => [transaction, ...prev]);
      
      // Actualizar balances
      await fetchBalances();
      
      return { success: true, transaction };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear retiro';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [balances, fetchBalances]);

  // Cargar historial de transacciones
  const fetchTransactionHistory = useCallback(async (limit = 50, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const transactionsData = await cryptoService.getTransactionHistory(limit, offset);
      setTransactions(transactionsData);
      return transactionsData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar historial';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener detalles de transacción
  const getTransactionDetails = useCallback(async (txId: string) => {
    try {
      setLoading(true);
      setError(null);
      const transaction = await cryptoService.getTransactionDetails(txId);
      return { success: true, transaction };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener detalles';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener comisiones de red
  const getNetworkFees = useCallback(async (cryptoType: CryptoType): Promise<CryptoTransactionFee | null> => {
    try {
      const fees = await cryptoService.getNetworkFees(cryptoType);
      return fees;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener comisiones';
      setError(errorMessage);
      return null;
    }
  }, []);

  // Validar dirección
  const validateAddress = useCallback(async (address: string, cryptoType: CryptoType) => {
    try {
      const isValid = await cryptoService.validateAddress(address, cryptoType);
      return isValid;
    } catch {
      setError('Error al validar dirección');
      return false;
    }
  }, []);

  // Convertir entre criptomoneda y USD
  const convertToUSD = useCallback((amount: number, cryptoType: CryptoType): number => {
    const rate = exchangeRates.find(r => r.currency === cryptoType);
    return rate ? amount * rate.usdPrice : 0;
  }, [exchangeRates]);

  const convertFromUSD = useCallback((usdAmount: number, cryptoType: CryptoType): number => {
    const rate = exchangeRates.find(r => r.currency === cryptoType);
    return rate ? usdAmount / rate.usdPrice : 0;
  }, [exchangeRates]);

  // Obtener información de red
  const getNetworkInfo = useCallback((cryptoType: CryptoType): CryptoNetwork | undefined => {
    return networks.find(n => n.type === cryptoType);
  }, [networks]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Actualizar datos automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      fetchExchangeRates();
      fetchBalances();
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, [fetchExchangeRates, fetchBalances]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchSupportedNetworks();
    fetchExchangeRates();
    fetchBalances();
    fetchTransactionHistory();
  }, [fetchSupportedNetworks, fetchExchangeRates, fetchBalances, fetchTransactionHistory]);

  return {
    // Estados
    loading,
    error,
    networks,
    exchangeRates,
    balances,
    transactions,
    depositAddress,

    // Acciones
    generateDepositAddress,
    createDeposit,
    createWithdrawal,
    fetchTransactionHistory,
    getTransactionDetails,
    getNetworkFees,
    validateAddress,
    fetchBalances,
    fetchExchangeRates,
    
    // Utilidades
    convertToUSD,
    convertFromUSD,
    getNetworkInfo,
    clearError
  };
};
