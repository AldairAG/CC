import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { CryptoBalance, ExchangeRate, CryptoTransaction } from "../../types/CryptoTypes";
import { CryptoService } from "../../service/crypto/cryptoService";

interface CryptoState {
  balances: CryptoBalance[];
  exchangeRates: ExchangeRate[];
  transactions: CryptoTransaction[];
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  balances: [],
  exchangeRates: [],
  transactions: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCryptoBalances = createAsyncThunk(
  'crypto/fetchBalances',
  async (_, { rejectWithValue }) => {
    try {
      const data = await CryptoService.getCryptoBalances();
      return data;
    } catch (err) {
      console.error('Error fetching crypto balances:', err);
      return rejectWithValue('Error al cargar balances');
    }
  }
);

export const fetchExchangeRates = createAsyncThunk(
  'crypto/fetchExchangeRates',
  async (_, { rejectWithValue }) => {
    try {
      const data = await CryptoService.getExchangeRates();
      return data;
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      return rejectWithValue('Error al cargar tasas de cambio');
    }
  }
);

export const fetchCryptoTransactions = createAsyncThunk(
  'crypto/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await CryptoService.getCryptoTransactions();
      return data;
    } catch (err) {
      console.error('Error fetching crypto transactions:', err);
      return rejectWithValue('Error al cargar transacciones');
    }
  }
);

// Slice
const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    // Synchronous actions
    setBalances: (state, action: PayloadAction<CryptoBalance[]>) => {
      state.balances = action.payload;
    },
    setExchangeRates: (state, action: PayloadAction<ExchangeRate[]>) => {
      state.exchangeRates = action.payload;
    },
    setTransactions: (state, action: PayloadAction<CryptoTransaction[]>) => {
      state.transactions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add new transaction
    addTransaction: (state, action: PayloadAction<CryptoTransaction>) => {
      state.transactions.unshift(action.payload);
    },
    // Update balance
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
    // Reset state
    resetCryptoState: (state) => {
      state.balances = [];
      state.exchangeRates = [];
      state.transactions = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch balances
    builder
      .addCase(fetchCryptoBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoBalances.fulfilled, (state, action) => {
        state.loading = false;
        state.balances = action.payload;
        state.error = null;
      })
      .addCase(fetchCryptoBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Set default empty balances if error
        state.balances = [
          { cryptoType: 'BTC', balance: 0 },
          { cryptoType: 'ETH', balance: 0 },
          { cryptoType: 'SOL', balance: 0 },
        ];
      });

    // Fetch exchange rates
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.exchangeRates = action.payload;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Set default rates if error
        state.exchangeRates = [
          { currency: 'BTC', usdPrice: 45000, timestamp: new Date() },
          { currency: 'ETH', usdPrice: 3000, timestamp: new Date() },
          { currency: 'SOL', usdPrice: 100, timestamp: new Date() },
        ];
      });

    // Fetch transactions
    builder
      .addCase(fetchCryptoTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCryptoTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchCryptoTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.transactions = [];
      });
  },
});

// Export actions
export const {
  setBalances,
  setExchangeRates,
  setTransactions,
  setLoading,
  setError,
  clearError,
  addTransaction,
  updateBalance,
  resetCryptoState,
} = cryptoSlice.actions;

// Export reducer
export default cryptoSlice.reducer;
