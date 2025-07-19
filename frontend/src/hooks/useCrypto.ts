import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  selectCryptoBalances,
  selectCryptoExchangeRates,
  selectCryptoTransactions,
  selectPendingTransactions,
  selectWalletList,
  selectCryptoLoading,
  selectFetchingTransactions,
  selectFetchingWallets,
  selectCreatingWallet,
  selectUpdatingWallet,
  selectDeletingWallet,
  selectCreatingDeposit,
  selectCreatingWithdrawal,
  selectApprovingTransaction,
  selectCryptoError,
} from '../store/selectors/cryptoSelectors';
import {
  setTransactions,
  setPendingTransactions,
  setWalletList,
  setFetchingTransactions,
  setFetchingWallets,
  setCreatingWallet,
  setUpdatingWallet,
  setDeletingWallet,
  setCreatingDeposit,
  setCreatingWithdrawal,
  setApprovingTransaction,
  setError,
  clearError,
  addTransaction,
} from '../store/slices/cryptoSlice';
import { CryptoService } from '../service/crypto/cryptoService';
import type {
  UserWallet,
  CryptoTransaction,
  CryptoManualDepositRequest,
  CryptoManualWithdrawalRequest,
  CreateWalletRequest,
  CryptoDepositRequest,
  CryptoWithdrawalRequest,
  CryptoAdminApprovalRequest,
} from '../types/CryptoTypes';
import useUser from './useUser';

/**
 * Hook personalizado para gestionar operaciones de criptomonedas
 * 
 * Este hook proporciona una interfaz completa para:
 * - Gestión de wallets (CRUD)
 * - Depósitos manuales y automáticos
 * - Retiros manuales y automáticos
 * - Operaciones de administración
 * - Gestión de estado y errores
 * 
 * Sigue el patrón del proyecto: el hook llama al service y luego actualiza el estado
 */
export const useCrypto = () => {
  const dispatch = useDispatch();
  const {user}=useUser();

  // Selectores de estado
  const wallets = useSelector(selectWalletList);
  const transactions = useSelector(selectCryptoTransactions);
  const pendingTransactions = useSelector(selectPendingTransactions);
  const balances = useSelector(selectCryptoBalances);
  const exchangeRates = useSelector(selectCryptoExchangeRates);
  
  // Estados de carga
  const isLoading = useSelector(selectCryptoLoading);
  const isFetchingTransactions = useSelector(selectFetchingTransactions);
  const isFetchingWallets = useSelector(selectFetchingWallets);
  const isCreatingWallet = useSelector(selectCreatingWallet);
  const isUpdatingWallet = useSelector(selectUpdatingWallet);
  const isDeletingWallet = useSelector(selectDeletingWallet);
  const isCreatingDeposit = useSelector(selectCreatingDeposit);
  const isCreatingWithdrawal = useSelector(selectCreatingWithdrawal);
  const isApprovingTransaction = useSelector(selectApprovingTransaction);

  // Estados de error
  const error = useSelector(selectCryptoError);

  // =============================================================================
  // OPERACIONES DE WALLET
  // =============================================================================

  /**
   * Crea una nueva wallet
   */
  const createWallet = useCallback(async (walletData: CreateWalletRequest): Promise<UserWallet | null> => {
    try {
      dispatch(setCreatingWallet(true));
      dispatch(clearError());
      
      const newWallet = await CryptoService.createCryptoWallet(walletData,user?.idUsuario||0);
      
      // Actualizar lista de wallets
      dispatch(setWalletList([...wallets, newWallet]));
      
      return newWallet;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear wallet';
      dispatch(setError(errorMessage));
      return null;
    } finally {
      dispatch(setCreatingWallet(false));
    }
  }, [dispatch, wallets]);

  /**
   * Obtiene las wallets del usuario
   */
  const getUserWallets = useCallback(async (): Promise<UserWallet[]> => {
    try {
      dispatch(setFetchingWallets(true));
      dispatch(clearError());
      
      const userWallets = await CryptoService.getUserWallets();
      
      dispatch(setWalletList(userWallets));
      
      return userWallets;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al obtener wallets del usuario';
      dispatch(setError(errorMessage));
      return [];
    } finally {
      dispatch(setFetchingWallets(false));
    }
  }, [dispatch]);

  /**
   * Obtiene una wallet específica por ID
   */
  const getWalletById = useCallback(async (walletId: number): Promise<UserWallet | null> => {
    try {
      dispatch(setFetchingWallets(true));
      dispatch(clearError());
      
      const walletData = await CryptoService.getCryptoWalletById(walletId);
      
      return walletData;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al obtener wallet';
      dispatch(setError(errorMessage));
      return null;
    } finally {
      dispatch(setFetchingWallets(false));
    }
  }, [dispatch]);

  /**
   * Actualiza una wallet
   */
  const updateWallet = useCallback(async (walletId: number, walletData: Partial<CreateWalletRequest>): Promise<UserWallet | null> => {
    try {
      dispatch(setUpdatingWallet(true));
      dispatch(clearError());
      
      const updatedWallet = await CryptoService.updateCryptoWallet(walletId,user?.idUsuario||0, walletData);
      
      // Actualizar en la lista de wallets
      const updatedWallets = wallets.map(w => 
        w.id === walletId ? updatedWallet : w
      );
      dispatch(setWalletList(updatedWallets));
      
      return updatedWallet;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar wallet';
      dispatch(setError(errorMessage));
      return null;
    } finally {
      dispatch(setUpdatingWallet(false));
    }
  }, [dispatch, wallets]);

  /**
   * Elimina una wallet
   */
  const deleteWallet = useCallback(async (walletId: number): Promise<boolean> => {
    try {
      dispatch(setDeletingWallet(true));
      dispatch(clearError());
      
      await CryptoService.deleteCryptoWallet(walletId);
      
      // Remover de la lista de wallets
      const updatedWallets = wallets.filter(w => w.id !== walletId);
      dispatch(setWalletList(updatedWallets));
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar wallet';
      dispatch(setError(errorMessage));
      return false;
    } finally {
      dispatch(setDeletingWallet(false));
    }
  }, [dispatch, wallets]);

  // =============================================================================
  // OPERACIONES DE TRANSACCIONES
  // =============================================================================

  /**
   * Obtiene las transacciones de crypto del usuario
   */
  const getCryptoTransactions = useCallback(async (): Promise<CryptoTransaction[]> => {
    try {
      dispatch(setFetchingTransactions(true));
      dispatch(clearError());
      
      const transactions = await CryptoService.getCryptoTransactions();
      
      dispatch(setTransactions(transactions));
      
      return transactions;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al obtener transacciones de crypto';
      dispatch(setError(errorMessage));
      return [];
    } finally {
      dispatch(setFetchingTransactions(false));
    }
  }, [dispatch]);

  // =============================================================================
  // OPERACIONES DE DEPÓSITO
  // =============================================================================

  /**
   * Crea un depósito básico
   */
  const createDeposit = useCallback(async (depositRequest: CryptoDepositRequest): Promise<CryptoTransaction | null> => {
    try {
      dispatch(setCreatingDeposit(true));
      dispatch(clearError());
      
      const transaction = await CryptoService.createCryptoDeposit(depositRequest,user?.idUsuario||0);
      
      // Agregar la transacción a la lista
      dispatch(addTransaction(transaction));
      
      return transaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear depósito';
      dispatch(setError(errorMessage));
      return null;
    } finally {
      dispatch(setCreatingDeposit(false));
    }
  }, [dispatch]);

  /**
   * Crea un depósito automático con verificación externa
   */
  const createAutomaticDeposit = useCallback(async (depositRequest: CryptoDepositRequest): Promise<CryptoTransaction | null> => {
    try {
      dispatch(setCreatingDeposit(true));
      dispatch(clearError());
      
      const transaction = await CryptoService.createAutomaticDeposit(depositRequest);
      
      // Agregar la transacción a la lista
      dispatch(addTransaction(transaction));
      
      return transaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear depósito automático';
      dispatch(setError(errorMessage));
      return null;
    } finally {
      dispatch(setCreatingDeposit(false));
    }
  }, [dispatch]);

  /**
   * Solicita un depósito manual
   */
  const createManualDepositRequest = useCallback(async (depositRequest: CryptoManualDepositRequest): Promise<CryptoTransaction | null> => {
    try {
      dispatch(setCreatingDeposit(true));
      dispatch(clearError());
      
      const transaction = await CryptoService.createManualDepositRequest(depositRequest,user?.idUsuario||0);
      
      // Agregar la transacción a la lista
      dispatch(addTransaction(transaction));
      
      return transaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al solicitar depósito manual';
      dispatch(setError(errorMessage));
      return null;
    } finally {
      dispatch(setCreatingDeposit(false));
    }
  }, [dispatch]);

  // =============================================================================
  // OPERACIONES DE RETIRO
  // =============================================================================

  /**
   * Crea un retiro automático
   */
  const createAutomaticWithdrawal = useCallback(async (withdrawalRequest: CryptoManualWithdrawalRequest): Promise<CryptoTransaction | null> => {
    try {
      dispatch(setCreatingWithdrawal(true));
      dispatch(clearError());
      
      const transaction = await CryptoService.createAutomaticWithdrawal(withdrawalRequest);
      
      // Agregar la transacción a la lista
      dispatch(addTransaction(transaction));
      
      return transaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear retiro automático';
      dispatch(setError(errorMessage));
      return null;
    } finally {
      dispatch(setCreatingWithdrawal(false));
    }
  }, [dispatch]);

  /**
   * Solicita un retiro manual
   */
  const createManualWithdrawalRequest = useCallback(async (withdrawalRequest: CryptoManualWithdrawalRequest): Promise<CryptoTransaction | null> => {
    try {
      dispatch(setCreatingWithdrawal(true));
      dispatch(clearError());
      
      const transaction = await CryptoService.createManualWithdrawalRequest(withdrawalRequest);
      
      // Agregar la transacción a la lista
      dispatch(addTransaction(transaction));
      
      return transaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al solicitar retiro manual';
      dispatch(setError(errorMessage));
      return null;
    } finally {
      dispatch(setCreatingWithdrawal(false));
    }
  }, [dispatch]);

  /**
   * Crea un retiro de crypto (método deprecated pero disponible)
   */
  const createCryptoWithdrawal = useCallback(async (withdrawalRequest: CryptoWithdrawalRequest): Promise<CryptoTransaction | null> => {
    try {
      dispatch(setCreatingWithdrawal(true));
      dispatch(clearError());
      
      const transaction = await CryptoService.createCryptoWithdrawal(withdrawalRequest);
      
      // Agregar la transacción a la lista
      dispatch(addTransaction(transaction));
      
      return transaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear retiro de crypto';
      dispatch(setError(errorMessage));
      return null;
    } finally {
      dispatch(setCreatingWithdrawal(false));
    }
  }, [dispatch]);

  // =============================================================================
  // OPERACIONES DE ADMINISTRACIÓN
  // =============================================================================

  /**
   * Obtiene todas las wallets (admin)
   */
  const getAllWallets = useCallback(async (): Promise<UserWallet[]> => {
    try {
      dispatch(setFetchingWallets(true));
      dispatch(clearError());
      
      const allWallets = await CryptoService.getAllWallets();
      
      dispatch(setWalletList(allWallets));
      
      return allWallets;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al obtener todas las wallets';
      dispatch(setError(errorMessage));
      return [];
    } finally {
      dispatch(setFetchingWallets(false));
    }
  }, [dispatch]);

  /**
   * Obtiene las transacciones pendientes de aprobación manual
   */
  const getPendingManualTransactions = useCallback(async (): Promise<CryptoTransaction[]> => {
    try {
      dispatch(setFetchingTransactions(true));
      dispatch(clearError());
      
      const pendingTransactions = await CryptoService.getPendingManualTransactions();
      
      dispatch(setPendingTransactions(pendingTransactions));
      
      return pendingTransactions;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al obtener transacciones pendientes';
      dispatch(setError(errorMessage));
      return [];
    } finally {
      dispatch(setFetchingTransactions(false));
    }
  }, [dispatch]);

  /**
   * Aprueba una transacción manual (admin)
   */
  const approveManualTransaction = useCallback(async (approvalRequest: CryptoAdminApprovalRequest): Promise<CryptoTransaction | null> => {
    try {
      dispatch(setApprovingTransaction(true));
      dispatch(clearError());
      
      const transaction = await CryptoService.approveManualTransaction(approvalRequest);
      
      // Actualizar la transacción en el estado
      dispatch(addTransaction(transaction));
      
      return transaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al aprobar transacción manual';
      dispatch(setError(errorMessage));
      return null;
    } finally {
      dispatch(setApprovingTransaction(false));
    }
  }, [dispatch]);

  // =============================================================================
  // FUNCIONES AUXILIARES
  // =============================================================================

  /**
   * Procesa confirmación de transacción (webhook/interno)
   */
  const processConfirmation = useCallback(async (txHash: string, confirmations: number): Promise<void> => {
    try {
      await CryptoService.processConfirmation(txHash, confirmations);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al procesar confirmación';
      dispatch(setError(errorMessage));
    }
  }, [dispatch]);

  /**
   * Limpia errores del estado
   */
  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // Estado de datos
    wallets,
    transactions,
    pendingTransactions,
    balances,
    exchangeRates,
    
    // Estados de carga
    isLoading,
    isFetchingTransactions,
    isFetchingWallets,
    isCreatingWallet,
    isUpdatingWallet,
    isDeletingWallet,
    isCreatingDeposit,
    isCreatingWithdrawal,
    isApprovingTransaction,

    // Estados de error
    error,

    // Operaciones de wallet
    createWallet,
    getUserWallets,
    getWalletById,
    updateWallet,
    deleteWallet,

    // Operaciones de transacciones
    getCryptoTransactions,

    // Operaciones de depósito
    createDeposit,
    createAutomaticDeposit,
    createManualDepositRequest,

    // Operaciones de retiro
    createAutomaticWithdrawal,
    createManualWithdrawalRequest,
    createCryptoWithdrawal,

    // Operaciones de administración
    getAllWallets,
    getPendingManualTransactions,
    approveManualTransaction,

    // Funciones auxiliares
    processConfirmation,
    clearErrors,
  };
};

export default useCrypto;
