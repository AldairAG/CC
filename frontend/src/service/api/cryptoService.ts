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
} from '../../types/CryptoTypes';

// const API_BASE_URL = 'http://localhost:8080/api/crypto'; // Para uso en producción
const API_BASE_URL = 'http://localhost:8080/api/crypto';

// Mock data para desarrollo
const mockNetworks: CryptoNetwork[] = [
  {
    type: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    confirmationsRequired: 3,
    minDeposit: 0.001,
    maxDeposit: 10,
    withdrawalFee: 0.0005,
    isActive: true,
    rpcUrl: 'https://bitcoin-mainnet.rpc.com',
    explorerUrl: 'https://blockstream.info/tx/'
  },
  {
    type: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    confirmationsRequired: 12,
    minDeposit: 0.01,
    maxDeposit: 100,
    withdrawalFee: 0.005,
    isActive: true,
    rpcUrl: 'https://ethereum-mainnet.rpc.com',
    explorerUrl: 'https://etherscan.io/tx/'
  },
  {
    type: 'SOL',
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    confirmationsRequired: 1,
    minDeposit: 0.1,
    maxDeposit: 1000,
    withdrawalFee: 0.01,
    isActive: true,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io/tx/'
  }
];

class CryptoService {  // Obtener redes soportadas
  async getSupportedNetworks(): Promise<CryptoNetwork[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/networks`);
      if (!response.ok) throw new Error('Failed to fetch networks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching supported networks:', error);
      return mockNetworks;
    }
  }
  // Obtener tipos de cambio
  async getExchangeRates(): Promise<CryptoExchangeRate[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/rates`);
      if (!response.ok) throw new Error('Failed to fetch rates');
      return await response.json();
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Fallback a datos mock
      return [
        {
          currency: 'BTC',
          usdPrice: 45000,
          changePercent24h: 2.5,
          lastUpdated: new Date().toISOString()
        },
        {
          currency: 'ETH',
          usdPrice: 3200,
          changePercent24h: -1.2,
          lastUpdated: new Date().toISOString()
        },
        {
          currency: 'SOL',
          usdPrice: 180,
          changePercent24h: 5.8,
          lastUpdated: new Date().toISOString()
        }
      ];
    }
  }
  // Obtener balances de criptomonedas
  async getCryptoBalances(): Promise<CryptoBalance[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/balances`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch balances');
      return await response.json();
    } catch (error) {
      console.error('Error fetching crypto balances:', error);
      // Fallback a datos mock
      const rates = await this.getExchangeRates();
      return [
        {
          cryptoType: 'BTC',
          balance: 0.05,
          usdValue: 0.05 * (rates.find(r => r.currency === 'BTC')?.usdPrice || 0),
          pendingDeposits: 0.001,
          pendingWithdrawals: 0
        },
        {
          cryptoType: 'ETH',
          balance: 0.8,
          usdValue: 0.8 * (rates.find(r => r.currency === 'ETH')?.usdPrice || 0),
          pendingDeposits: 0,
          pendingWithdrawals: 0.1
        },
        {
          cryptoType: 'SOL',
          balance: 12.5,
          usdValue: 12.5 * (rates.find(r => r.currency === 'SOL')?.usdPrice || 0),
          pendingDeposits: 0,
          pendingWithdrawals: 0
        }
      ];
    }
  }

  // Generar dirección de depósito
  async generateDepositAddress(cryptoType: CryptoType): Promise<CryptoDepositAddress> {
    try {
      // En producción: const response = await fetch(`${API_BASE_URL}/deposit-address`, { method: 'POST', body: JSON.stringify({ cryptoType }) });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddresses = {
        BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        ETH: '0x742d35Cc6634C0532925a3b8D46B654C24E7C4b8',
        SOL: '11111111111111111111111111111112'
      };

      return {
        cryptoType,
        address: mockAddresses[cryptoType],
        qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
      };
    } catch (error) {
      console.error('Error generating deposit address:', error);
      throw new Error('Error al generar dirección de depósito');
    }
  }

  // Crear depósito
  async createDeposit(depositData: CryptoDepositRequest): Promise<CryptoTransaction> {
    try {
      // En producción: const response = await fetch(`${API_BASE_URL}/deposit`, { method: 'POST', body: JSON.stringify(depositData) });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const rates = await this.getExchangeRates();
      const rate = rates.find(r => r.currency === depositData.cryptoType)?.usdPrice || 0;
      
      return {
        id: `tx_${Date.now()}`,
        userId: 'user_123',
        type: 'DEPOSIT',
        cryptoType: depositData.cryptoType,
        amount: depositData.amount,
        usdAmount: depositData.amount * rate,
        fromAddress: depositData.userWalletAddress,
        toAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Dirección del casino
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: 'PENDING',
        confirmations: 0,
        requiredConfirmations: mockNetworks.find(n => n.type === depositData.cryptoType)?.confirmationsRequired || 1,
        fee: 0.001,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating deposit:', error);
      throw new Error('Error al crear depósito');
    }
  }

  // Crear retiro
  async createWithdrawal(withdrawalData: CryptoWithdrawalRequest): Promise<CryptoTransaction> {
    try {
      // En producción: const response = await fetch(`${API_BASE_URL}/withdrawal`, { method: 'POST', body: JSON.stringify(withdrawalData) });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const rates = await this.getExchangeRates();
      const rate = rates.find(r => r.currency === withdrawalData.cryptoType)?.usdPrice || 0;
      const network = mockNetworks.find(n => n.type === withdrawalData.cryptoType);
      
      return {
        id: `tx_${Date.now()}`,
        userId: 'user_123',
        type: 'WITHDRAWAL',
        cryptoType: withdrawalData.cryptoType,
        amount: withdrawalData.amount,
        usdAmount: withdrawalData.amount * rate,
        fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Dirección del casino
        toAddress: withdrawalData.destinationAddress,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: 'PROCESSING',
        confirmations: 0,
        requiredConfirmations: network?.confirmationsRequired || 1,
        fee: network?.withdrawalFee || 0.001,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      throw new Error('Error al crear retiro');
    }
  }
  // Obtener historial de transacciones
  async getTransactionHistory(_limit = 50, _offset = 0): Promise<CryptoTransaction[]> {
    try {
      // En producción: const response = await fetch(`${API_BASE_URL}/transactions?limit=${limit}&offset=${offset}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      return [
        {
          id: 'tx_1',
          userId: 'user_123',
          type: 'DEPOSIT',
          cryptoType: 'BTC',
          amount: 0.001,
          usdAmount: 45,
          fromAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
          toAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          status: 'CONFIRMED',
          confirmations: 6,
          requiredConfirmations: 3,
          fee: 0.0005,
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:30:00Z',
          completedAt: '2024-01-20T10:30:00Z'
        },
        {
          id: 'tx_2',
          userId: 'user_123',
          type: 'DEPOSIT',
          cryptoType: 'ETH',
          amount: 0.5,
          usdAmount: 1600,
          fromAddress: '0x742d35Cc6634C0532925a3b8D46B654C24E7C4b8',
          toAddress: '0x8ba1f109551bD432803012645Hac136c72a3C8j7',
          txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          status: 'PENDING',
          confirmations: 8,
          requiredConfirmations: 12,
          fee: 0.005,
          createdAt: '2024-01-21T14:30:00Z',
          updatedAt: '2024-01-21T14:45:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw new Error('Error al obtener historial de transacciones');
    }
  }

  // Obtener detalles de transacción
  async getTransactionDetails(txId: string): Promise<CryptoTransaction> {
    try {
      // En producción: const response = await fetch(`${API_BASE_URL}/transactions/${txId}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const transactions = await this.getTransactionHistory();
      const transaction = transactions.find(tx => tx.id === txId);
      
      if (!transaction) {
        throw new Error('Transacción no encontrada');
      }
      
      return transaction;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      throw new Error('Error al obtener detalles de la transacción');
    }
  }

  // Obtener comisiones de red
  async getNetworkFees(cryptoType: CryptoType): Promise<CryptoTransactionFee> {
    try {
      // En producción: const response = await fetch(`${API_BASE_URL}/fees/${cryptoType}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockFees = {
        BTC: { network: 'BTC' as CryptoType, slow: 0.0001, standard: 0.0005, fast: 0.001 },
        ETH: { network: 'ETH' as CryptoType, slow: 0.002, standard: 0.005, fast: 0.01 },
        SOL: { network: 'SOL' as CryptoType, slow: 0.005, standard: 0.01, fast: 0.02 }
      };
      
      return mockFees[cryptoType];
    } catch (error) {
      console.error('Error fetching network fees:', error);
      throw new Error('Error al obtener comisiones de red');
    }
  }

  // Validar dirección de wallet
  async validateAddress(address: string, cryptoType: CryptoType): Promise<boolean> {
    try {
      // En producción: const response = await fetch(`${API_BASE_URL}/validate-address`, { method: 'POST', body: JSON.stringify({ address, cryptoType }) });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Validación básica mock
      const patterns = {
        BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
        ETH: /^0x[a-fA-F0-9]{40}$/,
        SOL: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
      };
      
      return patterns[cryptoType].test(address);
    } catch (error) {
      console.error('Error validating address:', error);
      return false;
    }
  }
}

export const cryptoService = new CryptoService();
