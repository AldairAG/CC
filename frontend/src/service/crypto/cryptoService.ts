import type { CryptoBalance, ExchangeRate, CryptoToFiatConversionRequest, CryptoToFiatConversionResponse, CryptoTransaction, CryptoDepositRequest, UserWallet, CreateWalletRequest } from '../../types/CryptoTypes';
import { apiClient } from '../casino/ApiCliente';

const BASE_URL = '/crypto';

export class CryptoService {
  
  /**
   * Get user's crypto balances
   */
  static async getCryptoBalances(): Promise<CryptoBalance[]> {
    const response = await apiClient.get(`${BASE_URL}/balances`);
    return response.data;
  }

  /**
   * Get current exchange rates
   */
  static async getExchangeRates(): Promise<ExchangeRate[]> {
    // For now, return mock data. In production, this would fetch from a real API
    return [
      { currency: 'BTC', usdPrice: 45000, timestamp: new Date() },
      { currency: 'ETH', usdPrice: 3000, timestamp: new Date() },
      { currency: 'SOL', usdPrice: 100, timestamp: new Date() },
    ];
  }

  /**
   * Convert crypto to fiat
   */
  static async convertToFiat(request: CryptoToFiatConversionRequest): Promise<CryptoToFiatConversionResponse> {
    const response = await apiClient.post(`${BASE_URL}/convert-to-fiat`, request);
    return response.data;
  }

  /**
   * Create a crypto deposit
   */
  static async createCryptoDeposit(request: CryptoDepositRequest): Promise<CryptoTransaction> {
    const response = await apiClient.post(`${BASE_URL}/deposit`, request);
    return response.data;
  }

  /**
   * Get user's crypto transactions
   */
  static async getCryptoTransactions(): Promise<CryptoTransaction[]> {
    const response = await apiClient.get(`${BASE_URL}/transactions`);
    return response.data;
  }

  /**
   * Create a crypto withdrawal
   */
  static async createCryptoWithdrawal(request: {
    toAddress: string;
    amount: number;
    cryptoType: 'BTC' | 'ETH' | 'SOL';
  }): Promise<CryptoTransaction> {
    const response = await apiClient.post(`${BASE_URL}/withdraw`, request);
    return response.data;
  }

  /**
   * Process withdrawal confirmation (admin/webhook)
   */
  static async processWithdrawalConfirmation(txHash: string, confirmations: number): Promise<void> {
    await apiClient.post(`${BASE_URL}/process-withdrawal-confirmation?txHash=${txHash}&confirmations=${confirmations}`);
  }

  /**
   * CRUD: Create a crypto wallet
   */
  static async createCryptoWallet(walletData: CreateWalletRequest): Promise<UserWallet> {
    const response = await apiClient.post(`${BASE_URL}/wallets`, walletData);
    return response.data;
  }

  /**
   * CRUD: Get wallet by ID
   */
  static async getCryptoWalletById(walletId: number): Promise<UserWallet> {
    const response = await apiClient.get(`${BASE_URL}/wallets/${walletId}`);
    return response.data;
  }

  /**
   * CRUD: Get wallets by user ID
   */
  static async getCryptoWalletsByUserId(userId: number): Promise<UserWallet[]> {
    const response = await apiClient.get(`${BASE_URL}/wallets?userId=${userId}`);
    return response.data;
  }

  /**
   * CRUD: Update wallet
   */
  static async updateCryptoWallet(walletId: number, request: Partial<UserWallet>): Promise<UserWallet> {
    const response = await apiClient.put(`${BASE_URL}/wallets/${walletId}`, request);
    return response.data;
  }

  /**
   * CRUD: Delete wallet
   */
  static async deleteCryptoWallet(walletId: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/wallets/${walletId}`);
  }
}
