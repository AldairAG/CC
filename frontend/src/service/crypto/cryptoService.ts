import type { CryptoBalance, ExchangeRate, CryptoToFiatConversionRequest, CryptoToFiatConversionResponse, CryptoTransaction, CryptoDepositRequest } from '../../types/CryptoTypes';
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
}
