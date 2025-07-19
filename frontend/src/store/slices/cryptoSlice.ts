import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CryptoBalance, ExchangeRate, CryptoTransaction, UserWallet } from "../../types/CryptoTypes";
import { createSelector } from 'reselect';

interface CryptoState {
  // Data
  walletList: UserWallet[];
  balances: CryptoBalance[];
  exchangeRates: ExchangeRate[];
  transactions: CryptoTransaction[];
  pendingTransactions: CryptoTransaction[];
  
  // Loading states
  loading: boolean;
  fetchingBalances: boolean;
  fetchingRates: boolean;
  fetchingTransactions: boolean;
  fetchingWallets: boolean;
  fetchingPendingTransactions: boolean;
  
  // Operation states
  creatingWallet: boolean;
  updatingWallet: boolean;
  deletingWallet: boolean;
  creatingDeposit: boolean;
  creatingWithdrawal: boolean;
  approvingTransaction: boolean;
  
  // Error states
  error: string | null;
}

const initialState: CryptoState = {
  // Data
  walletList: [],
  balances: [],
  exchangeRates: [],
  transactions: [],
  pendingTransactions: [],
  
  // Loading states
  loading: false,
  fetchingBalances: false,
  fetchingRates: false,
  fetchingTransactions: false,
  fetchingWallets: false,
  fetchingPendingTransactions: false,
  
  // Operation states
  creatingWallet: false,
  updatingWallet: false,
  deletingWallet: false,
  creatingDeposit: false,
  creatingWithdrawal: false,
  approvingTransaction: false,
  
  // Error states
  error: null,
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    // ===== DATA ACTIONS =====
    setBalances: (state, action: PayloadAction<CryptoBalance[]>) => {
      state.balances = action.payload;
    },
    setExchangeRates: (state, action: PayloadAction<ExchangeRate[]>) => {
      state.exchangeRates = action.payload;
    },
    setTransactions: (state, action: PayloadAction<CryptoTransaction[]>) => {
      state.transactions = action.payload;
    },
    setPendingTransactions: (state, action: PayloadAction<CryptoTransaction[]>) => {
      state.pendingTransactions = action.payload;
    },
    setWalletList: (state, action: PayloadAction<UserWallet[]>) => {
      state.walletList = action.payload;
    },
    
    // ===== LOADING ACTIONS =====
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFetchingBalances: (state, action: PayloadAction<boolean>) => {
      state.fetchingBalances = action.payload;
    },
    setFetchingRates: (state, action: PayloadAction<boolean>) => {
      state.fetchingRates = action.payload;
    },
    setFetchingTransactions: (state, action: PayloadAction<boolean>) => {
      state.fetchingTransactions = action.payload;
    },
    setFetchingWallets: (state, action: PayloadAction<boolean>) => {
      state.fetchingWallets = action.payload;
    },
    setFetchingPendingTransactions: (state, action: PayloadAction<boolean>) => {
      state.fetchingPendingTransactions = action.payload;
    },
    
    // ===== OPERATION ACTIONS =====
    setCreatingWallet: (state, action: PayloadAction<boolean>) => {
      state.creatingWallet = action.payload;
    },
    setUpdatingWallet: (state, action: PayloadAction<boolean>) => {
      state.updatingWallet = action.payload;
    },
    setDeletingWallet: (state, action: PayloadAction<boolean>) => {
      state.deletingWallet = action.payload;
    },
    setCreatingDeposit: (state, action: PayloadAction<boolean>) => {
      state.creatingDeposit = action.payload;
    },
    setCreatingWithdrawal: (state, action: PayloadAction<boolean>) => {
      state.creatingWithdrawal = action.payload;
    },
    setApprovingTransaction: (state, action: PayloadAction<boolean>) => {
      state.approvingTransaction = action.payload;
    },
    
    // ===== ERROR ACTIONS =====
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // ===== ITEM ACTIONS =====
    addTransaction: (state, action: PayloadAction<CryptoTransaction>) => {
      state.transactions.unshift(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<CryptoTransaction>) => {
      const index = state.transactions.findIndex(tx => tx.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
      // Also update in pending transactions if exists
      const pendingIndex = state.pendingTransactions.findIndex(tx => tx.id === action.payload.id);
      if (pendingIndex !== -1) {
        state.pendingTransactions[pendingIndex] = action.payload;
      }
    },
    removeTransaction: (state, action: PayloadAction<number>) => {
      state.transactions = state.transactions.filter(tx => tx.id !== action.payload);
      state.pendingTransactions = state.pendingTransactions.filter(tx => tx.id !== action.payload);
    },
    
    addWallet: (state, action: PayloadAction<UserWallet>) => {
      state.walletList.push(action.payload);
    },
    updateWallet: (state, action: PayloadAction<UserWallet>) => {
      const index = state.walletList.findIndex(wallet => wallet.id === action.payload.id);
      if (index !== -1) {
        state.walletList[index] = action.payload;
      }
    },
    removeWallet: (state, action: PayloadAction<number>) => {
      state.walletList = state.walletList.filter(wallet => wallet.id !== action.payload);
    },
    
    updateBalance: (state, action: PayloadAction<CryptoBalance>) => {
      const index = state.balances.findIndex(
        balance => balance.cryptoType === action.payload.cryptoType
      );
      if (index !== -1) {
        state.balances[index] = action.payload;
      } else {
        state.balances.push(action.payload);
      }
    },
    
    // ===== RESET ACTIONS =====
    resetCryptoState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Export actions
export const {
  // Data actions
  setBalances,
  setExchangeRates,
  setTransactions,
  setPendingTransactions,
  setWalletList,
  
  // Loading actions
  setLoading,
  setFetchingBalances,
  setFetchingRates,
  setFetchingTransactions,
  setFetchingWallets,
  setFetchingPendingTransactions,
  
  // Operation actions
  setCreatingWallet,
  setUpdatingWallet,
  setDeletingWallet,
  setCreatingDeposit,
  setCreatingWithdrawal,
  setApprovingTransaction,
  
  // Error actions
  setError,
  clearError,
  
  // Item actions
  addTransaction,
  updateTransaction,
  removeTransaction,
  addWallet,
  updateWallet,
  removeWallet,
  updateBalance,
  
  // Reset actions
  resetCryptoState,
} = cryptoSlice.actions;

// ===== SELECTORS =====
const selectCryptoState = (state: { crypto: CryptoState }) => state.crypto;

// Data selectors
export const selectCryptoBalances = createSelector(
  [selectCryptoState],
  (crypto) => crypto.balances
);

export const selectCryptoExchangeRates = createSelector(
  [selectCryptoState],
  (crypto) => crypto.exchangeRates
);

export const selectCryptoTransactions = createSelector(
  [selectCryptoState],
  (crypto) => crypto.transactions
);

export const selectPendingTransactions = createSelector(
  [selectCryptoState],
  (crypto) => crypto.pendingTransactions
);

export const selectWalletList = createSelector(
  [selectCryptoState],
  (crypto) => crypto.walletList
);

// Loading selectors
export const selectCryptoLoading = createSelector(
  [selectCryptoState],
  (crypto) => crypto.loading
);

export const selectFetchingBalances = createSelector(
  [selectCryptoState],
  (crypto) => crypto.fetchingBalances
);

export const selectFetchingRates = createSelector(
  [selectCryptoState],
  (crypto) => crypto.fetchingRates
);

export const selectFetchingTransactions = createSelector(
  [selectCryptoState],
  (crypto) => crypto.fetchingTransactions
);

export const selectFetchingWallets = createSelector(
  [selectCryptoState],
  (crypto) => crypto.fetchingWallets
);

export const selectFetchingPendingTransactions = createSelector(
  [selectCryptoState],
  (crypto) => crypto.fetchingPendingTransactions
);

// Operation selectors
export const selectCreatingWallet = createSelector(
  [selectCryptoState],
  (crypto) => crypto.creatingWallet
);

export const selectUpdatingWallet = createSelector(
  [selectCryptoState],
  (crypto) => crypto.updatingWallet
);

export const selectDeletingWallet = createSelector(
  [selectCryptoState],
  (crypto) => crypto.deletingWallet
);

export const selectCreatingDeposit = createSelector(
  [selectCryptoState],
  (crypto) => crypto.creatingDeposit
);

export const selectCreatingWithdrawal = createSelector(
  [selectCryptoState],
  (crypto) => crypto.creatingWithdrawal
);

export const selectApprovingTransaction = createSelector(
  [selectCryptoState],
  (crypto) => crypto.approvingTransaction
);

// Error selectors
export const selectCryptoError = createSelector(
  [selectCryptoState],
  (crypto) => crypto.error
);

// Computed selectors
export const selectCryptoBalanceByType = createSelector(
  [selectCryptoBalances, (_, cryptoType: string) => cryptoType],
  (balances, cryptoType) => balances.find(balance => balance.cryptoType === cryptoType)
);

export const selectExchangeRateByType = createSelector(
  [selectCryptoExchangeRates, (_, cryptoType: string) => cryptoType],
  (rates, cryptoType) => rates.find(rate => rate.currency === cryptoType)
);

export const selectTotalPortfolioValue = createSelector(
  [selectCryptoBalances, selectCryptoExchangeRates],
  (balances, rates) => {
    return balances.reduce((total, balance) => {
      const rate = rates.find(r => r.currency === balance.cryptoType);
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
  (balances, rates) => {
    const totalValue = balances.reduce((total, balance) => {
      const rate = rates.find(r => r.currency === balance.cryptoType);
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
  [selectWalletList, (_, cryptoType: string) => cryptoType],
  (wallets, cryptoType) => wallets.filter(wallet => wallet.cryptoType === cryptoType)
);

export const selectActiveWallets = createSelector(
  [selectWalletList],
  (wallets) => wallets.filter(wallet => wallet.isActive)
);

// Export reducer
export default cryptoSlice.reducer;
