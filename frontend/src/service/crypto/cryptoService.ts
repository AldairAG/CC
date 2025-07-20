import axios from 'axios';
import type {
  CryptoBalance,
  ExchangeRate,
  CryptoToFiatConversionRequest,
  CryptoToFiatConversionResponse,
  CryptoTransaction,
  CryptoDepositRequest,
  CryptoManualDepositRequest,
  CryptoWithdrawalRequest,
  CryptoManualWithdrawalRequest,
  CryptoAdminApprovalRequest,
  UserWallet,
  CreateWalletRequest,
  CryptoPrice
} from '../../types/CryptoTypes';
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
  static async getExchangeRates(): Promise<CryptoPrice> {
    // For now, return mock data. In production, this would fetch from a real API
    const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids=solana%2Cethereum%2Cbitcoin&vs_currencies=usd";
    const response = await axios.get<CryptoPrice>(COINGECKO_URL);
    return response.data;
  }

  /**
   * Convert crypto to fiat
   */
  static async convertToFiat(request: CryptoToFiatConversionRequest): Promise<CryptoToFiatConversionResponse> {
    const response = await apiClient.post(`${BASE_URL}/convert-to-fiat`, request);
    return response.data;
  }

  /**
   * Create a crypto deposit (basic)
   */
  static async createCryptoDeposit(request: CryptoDepositRequest, userId: number): Promise<CryptoTransaction> {
    const response = await apiClient.post(`${BASE_URL}/deposit/${userId}`, request);
    return response.data;
  }

  /**
   * Create automatic crypto deposit with external verification
   */
  static async createAutomaticDeposit(request: CryptoDepositRequest): Promise<CryptoTransaction> {
    const response = await apiClient.post(`${BASE_URL}/deposit/automatic`, request);
    return response.data;
  }

  /**
   * Create manual deposit request
   */
  static async createManualDepositRequest(request: CryptoManualDepositRequest, userId: number): Promise<CryptoTransaction> {
    const response = await apiClient.post(`${BASE_URL}/deposit/manual/${userId}`, request);
    return response.data;
  }

  /**
   * Create automatic withdrawal
   */
  static async createAutomaticWithdrawal(request: CryptoManualWithdrawalRequest): Promise<CryptoTransaction> {
    const response = await apiClient.post(`${BASE_URL}/withdraw/automatic`, request);
    return response.data;
  }

  /**
   * Create manual withdrawal request
   */
  static async createManualWithdrawalRequest(request: CryptoManualWithdrawalRequest): Promise<CryptoTransaction> {
    const response = await apiClient.post(`${BASE_URL}/withdraw/manual`, request);
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
   * Process confirmation (webhook/internal)
   */
  static async processConfirmation(txHash: string, confirmations: number): Promise<void> {
    await apiClient.post(`${BASE_URL}/process-confirmation?txHash=${txHash}&confirmations=${confirmations}`);
  }

  // ===== WALLET CRUD OPERATIONS =====

  /**
   * Create a crypto wallet
   */
  static async createCryptoWallet(walletData: CreateWalletRequest, userId: number): Promise<UserWallet> {
    const response = await apiClient.post(`${BASE_URL}/wallets/${userId}`, walletData);
    return response.data;
  }

  /**
   * Get user's wallets
   */
  static async getUserWallets(): Promise<UserWallet[]> {
    const response = await apiClient.get(`${BASE_URL}/wallets`);
    return response.data;
  }

  /**
   * Get wallet by ID
   */
  static async getCryptoWalletById(walletId: number): Promise<UserWallet> {
    const response = await apiClient.get(`${BASE_URL}/wallets/${walletId}`);
    return response.data;
  }

  /**
   * Update wallet
   */
  static async updateCryptoWallet(walletId: number, userId: number, request: Partial<CreateWalletRequest>): Promise<UserWallet> {
    const response = await apiClient.put(`${BASE_URL}/wallets/${walletId}/${userId}`, request);
    return response.data;
  }

  /**
   * Delete wallet
   */
  static async deleteCryptoWallet(walletId: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/wallets/${walletId}`);
  }

  // ===== ADMIN OPERATIONS =====

  /**
   * Get pending manual transactions (admin only)
   */
  static async getPendingManualTransactions(): Promise<CryptoTransaction[]> {
    const response = await apiClient.get(`${BASE_URL}/admin/pending-transactions`);
    return response.data;
  }

  /**
   * Approve or reject manual transaction (admin only)
   */
  static async approveManualTransaction(request: CryptoAdminApprovalRequest): Promise<CryptoTransaction> {
    const response = await apiClient.post(`${BASE_URL}/admin/approve-transaction`, request);
    return response.data;
  }

  /**
   * Get all wallets (admin only)
   */
  static async getAllWallets(): Promise<UserWallet[]> {
    const response = await apiClient.get(`${BASE_URL}/admin/wallets`);
    return response.data;
  }

  // ===== DEPRECATED METHODS (for backward compatibility) =====

  /**
   * @deprecated Use createAutomaticWithdrawal or createManualWithdrawalRequest instead
   */
  static async createCryptoWithdrawal(request: CryptoWithdrawalRequest): Promise<CryptoTransaction> {
    return this.createAutomaticWithdrawal({
      cryptoType: request.cryptoType,
      amount: request.amount,
      toAddress: request.toAddress
    });
  }

  /**
   * @deprecated Use processConfirmation instead
   */
  static async processWithdrawalConfirmation(txHash: string, confirmations: number): Promise<void> {
    return this.processConfirmation(txHash, confirmations);
  }

  static async getCryptoBalancesWithExchangeRates(ids: string): Promise<ExchangeRate[]> {
    const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids={ids}&vs_currencies=usd";
    const url = COINGECKO_URL.replace("{ids}", ids);
    const response = await axios.get(url);
    return response.data;
  }

}
